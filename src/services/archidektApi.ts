import type { ArchidektDeckResponse } from '../types/archidekt'

// Use proxy endpoint (works in both dev and production via Vercel serverless function)
const ARCHIDEKT_API_BASE = '/api/archidekt/decks'

export async function fetchDeck(deckId: string): Promise<ArchidektDeckResponse> {
  const response = await fetch(`${ARCHIDEKT_API_BASE}/${deckId}/`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Deck not found. Please check the deck ID.')
    }
    if (response.status === 403) {
      throw new Error('This deck is private.')
    }
    throw new Error('Failed to fetch deck. Please try again.')
  }

  return response.json()
}
