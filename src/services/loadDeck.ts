import { useDeckStore } from '../stores/deckStore'
import { fetchDeck } from './archidektApi'
import { addRecentDeck } from '../hooks/useRecentDecks'

export async function loadDeckById(deckId: string): Promise<boolean> {
  const { setDeck, setLoading, setError } = useDeckStore.getState()
  setLoading(true)
  setError(null)

  try {
    const deck = await fetchDeck(deckId)
    setDeck(deck)
    addRecentDeck({
      id: String(deck.id),
      name: deck.name,
      cardCount: deck.cards.length,
      lastReviewed: new Date().toISOString(),
    })
    return true
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to load deck')
    return false
  } finally {
    useDeckStore.getState().setLoading(false)
  }
}
