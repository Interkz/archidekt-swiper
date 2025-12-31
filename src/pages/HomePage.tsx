import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DeckInput from '../components/DeckInput'
import { useDeckStore } from '../stores/deckStore'

export default function HomePage() {
  const navigate = useNavigate()
  const { remainingCards, allCards, clearState } = useDeckStore()

  // Check if there's an existing session
  const hasExistingSession = allCards.length > 0 && remainingCards.length > 0

  useEffect(() => {
    // Clear any errors when arriving at home
    useDeckStore.getState().setError(null)
  }, [])

  const handleContinueSession = () => {
    navigate('/swipe')
  }

  const handleNewSession = () => {
    clearState()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Archidekt Swiper</h1>
        <p className="text-gray-400 max-w-md">
          Trim your Commander deck the fun way! Swipe right to keep a card, left to remove it.
        </p>
      </div>

      {hasExistingSession ? (
        <div className="w-full max-w-md space-y-4">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-white mb-2">You have an existing session:</p>
            <p className="text-gray-400 text-sm">
              {remainingCards.length} cards remaining out of {allCards.length}
            </p>
          </div>

          <button
            onClick={handleContinueSession}
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700
                       rounded-lg font-semibold transition-colors"
          >
            Continue Swiping
          </button>

          <button
            onClick={handleNewSession}
            className="w-full px-6 py-3 bg-transparent border border-white/30
                       hover:bg-white/10 rounded-lg font-semibold transition-colors"
          >
            Start New Deck
          </button>
        </div>
      ) : (
        <DeckInput />
      )}

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Enter your Archidekt deck URL or ID to get started.</p>
        <p className="mt-1">
          Example: <code className="bg-white/10 px-2 py-0.5 rounded">archidekt.com/decks/123456</code>
        </p>
      </footer>
    </div>
  )
}
