import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeckStore } from '../stores/deckStore'
import { fetchDeck } from '../services/archidektApi'
import { parseDeckUrl } from '../utils/parseDeckUrl'

export default function DeckInput() {
  const [input, setInput] = useState('')
  const navigate = useNavigate()
  const { setDeck, setLoading, setError, isLoading, error } = useDeckStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const deckId = parseDeckUrl(input)
    if (!deckId) {
      setError('Please enter a valid Archidekt deck URL or ID')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const deck = await fetchDeck(deckId)
      setDeck(deck)
      navigate('/swipe')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deck')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste Archidekt deck URL or ID"
            className="w-full px-5 py-4 rounded-xl bg-white border border-slate-200
                       text-slate-800 placeholder-slate-400 card-shadow
                       focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent
                       transition-all duration-200"
            disabled={isLoading}
          />
          {input && !isLoading && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-full px-6 py-4 bg-violet-600 hover:bg-violet-700
                     disabled:bg-slate-300 disabled:cursor-not-allowed
                     rounded-xl font-semibold text-white transition-all duration-200
                     hover:shadow-lg hover:shadow-violet-200 active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Loading Deck...
            </span>
          ) : (
            'Load Deck'
          )}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}
      </div>
    </form>
  )
}
