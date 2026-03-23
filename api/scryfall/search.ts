import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { q, page } = req.query

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing query parameter "q"' })
  }

  try {
    const params = new URLSearchParams({ q })
    if (page && typeof page === 'string') {
      params.set('page', page)
    }

    const response = await fetch(`https://api.scryfall.com/cards/search?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: `Scryfall API error: ${response.status}` })
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('Scryfall search proxy error:', error)
    res.status(500).json({ error: 'Failed to fetch from Scryfall API' })
  }
}
