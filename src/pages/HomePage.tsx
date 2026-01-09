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
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-100 to-cyan-100 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-800 mb-3 tracking-tight">
          Archidekt Swiper
        </h1>
        <p className="text-slate-500 max-w-md text-lg">
          Trim your Commander deck the fun way! Swipe right to keep, left to remove.
        </p>
      </div>

      {hasExistingSession ? (
        <div className="relative z-10 w-full max-w-md space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 card-shadow text-center">
            <p className="text-slate-700 font-medium mb-1">You have an existing session</p>
            <p className="text-slate-500 text-sm">
              {remainingCards.length} cards remaining out of {allCards.length}
            </p>
          </div>

          <button
            onClick={handleContinueSession}
            className="w-full px-6 py-3.5 bg-violet-600 hover:bg-violet-700
                       rounded-xl font-semibold text-white transition-all duration-200
                       hover:shadow-lg hover:shadow-violet-200 active:scale-[0.98]"
          >
            Continue Swiping
          </button>

          <button
            onClick={handleNewSession}
            className="w-full px-6 py-3.5 bg-white border border-slate-200
                       hover:bg-slate-50 hover:border-slate-300
                       rounded-xl font-semibold text-slate-700 transition-all duration-200"
          >
            Start New Deck
          </button>
        </div>
      ) : (
        <div className="relative z-10">
          <DeckInput />
        </div>
      )}

      <footer className="relative z-10 mt-12 text-center text-slate-400 text-sm">
        <p>Enter your Archidekt deck URL or ID to get started.</p>
        <p className="mt-2">
          Example: <code className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs">archidekt.com/decks/123456</code>
        </p>
      </footer>
    </div>
  )
}
