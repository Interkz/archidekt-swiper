import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing deck ID' })
  }

  try {
    const response = await fetch(`https://archidekt.com/api/decks/${id}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: `Archidekt API error: ${response.status}` })
    }

    const data = await response.json()
    res.status(200).json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Failed to fetch from Archidekt API' })
  }
}
