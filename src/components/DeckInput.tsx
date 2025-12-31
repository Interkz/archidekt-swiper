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
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste Archidekt deck URL or ID"
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20
                     text-white placeholder-white/50 focus:outline-none focus:ring-2
                     focus:ring-purple-500 focus:border-transparent"
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50
                     disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
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
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}
      </div>
    </form>
  )
}
