import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeckStore } from '../stores/deckStore'
import { loadDeckById } from '../services/loadDeck'
import { parseDeckUrl } from '../utils/parseDeckUrl'

export default function DeckInput() {
  const [input, setInput] = useState('')
  const navigate = useNavigate()
  const { isLoading, error } = useDeckStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const deckId = parseDeckUrl(input)
    if (!deckId) {
      useDeckStore.getState().setError('Please enter a valid Archidekt deck URL or ID')
      return
    }

    const success = await loadDeckById(deckId)
    if (success) navigate('/swipe')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col gap-6">
        {/* Label */}
        <label className="text-terminal text-[var(--status-neutral)] tracking-widest">
          ENTER DECK IDENTIFIER:
        </label>

        {/* Input field - terminal style */}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="archidekt.com/decks/______"
            className="input-terminal w-full"
            disabled={isLoading}
          />
          {input && !isLoading && (
            <button
              type="button"
              onClick={() => setInput('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--status-neutral)] hover:text-[var(--lumon-black)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Submit button - brutalist */}
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="w-full px-6 py-4 border-2 border-[var(--lumon-green)] bg-[var(--lumon-green)]
                     text-[var(--lumon-white)] font-mono font-semibold uppercase tracking-wider
                     transition-all duration-150
                     hover:bg-[var(--lumon-green-light)]
                     disabled:bg-[var(--grid-line)] disabled:border-[var(--grid-line)] disabled:cursor-not-allowed
                     active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-[var(--lumon-white)] border-t-transparent animate-spin" />
              Initializing...
            </span>
          ) : (
            'Initialize Sorting Protocol'
          )}
        </button>

        {/* Error message - clinical style */}
        {error && (
          <div className="border-2 border-[var(--lumon-black)] p-4 bg-[var(--surface-elevated)]">
            <div className="flex items-start gap-3">
              <span className="text-terminal text-[var(--lumon-black)]">ERROR:</span>
              <p className="font-mono text-sm text-[var(--lumon-black)]">{error}</p>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}
