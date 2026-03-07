export interface ScryfallRuling {
  source: string
  published_at: string
  comment: string
}

const cache = new Map<string, ScryfallRuling[]>()

export async function fetchRulings(scryfallId: string): Promise<ScryfallRuling[]> {
  if (cache.has(scryfallId)) {
    return cache.get(scryfallId)!
  }

  const response = await fetch(
    `https://api.scryfall.com/cards/${scryfallId}/rulings`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch rulings: ${response.status}`)
  }

  const data = await response.json()
  const rulings: ScryfallRuling[] = data.data ?? []
  cache.set(scryfallId, rulings)
  return rulings
}
