import type { ArchidektDeckResponse } from '../types/archidekt'

export async function fetchDeck(deckId: string): Promise<ArchidektDeckResponse> {
  // Use proxy in dev (Vite proxy), serverless function in production
  const url = import.meta.env.DEV
    ? `/api/archidekt/decks/${deckId}/`
    : `/api/deck?id=${deckId}`

  const response = await fetch(url)

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
