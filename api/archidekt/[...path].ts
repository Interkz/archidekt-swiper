import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query
  const pathSegments = Array.isArray(path) ? path : [path]
  const apiPath = pathSegments.join('/')

  try {
    const response = await fetch(`https://archidekt.com/api/${apiPath}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch from Archidekt API' })
  }
}
