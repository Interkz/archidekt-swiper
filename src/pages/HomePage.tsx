import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DeckInput from '../components/DeckInput'
import ColorblindToggle from '../components/ColorblindToggle'
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

  // Format numbers with leading zeros
  const formatNumber = (n: number) => n.toString().padStart(3, '0')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 grain-overlay">
      {/* Header section */}
      <div className="relative z-10 text-center mb-12">
        {/* Brass rule above */}
        <div className="w-64 h-0.5 mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, var(--border-brass), transparent)' }} />

        <h1 className="font-display text-4xl md:text-5xl tracking-wide text-[var(--tavern-card)]">
          ARCHIDEKT SWIPER
        </h1>
        <div className="h-px w-48 mx-auto my-4" style={{ background: 'linear-gradient(90deg, transparent, var(--border-wood), transparent)' }} />
        <p className="text-terminal text-[var(--text-muted)] tracking-widest">
          DECK SORTING INTERFACE
        </p>
        <p className="font-mono text-xs text-[var(--text-muted)] mt-2">v2.0.0</p>

        {/* Brass rule below */}
        <div className="w-64 h-0.5 mx-auto mt-8" style={{ background: 'linear-gradient(90deg, transparent, var(--border-brass), transparent)' }} />
      </div>

      {hasExistingSession ? (
        <div className="relative z-10 w-full max-w-md space-y-6">
          {/* Session status box — parchment card on dark background */}
          <div className="parchment border-2 border-[var(--border-wood)] rounded p-6">
            <span className="text-terminal text-[var(--ink-secondary)]">ACTIVE SESSION DETECTED</span>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between font-mono text-sm">
                <span className="text-[var(--ink-secondary)]">REMAINING:</span>
                <span className="text-[var(--positive)] font-semibold">{formatNumber(remainingCards.length)}</span>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span className="text-[var(--ink-secondary)]">TOTAL:</span>
                <span className="text-[var(--ink-primary)]">{formatNumber(allCards.length)}</span>
              </div>
              <div className="h-px bg-[var(--border-wood)] my-3" />
              <div className="flex justify-between font-mono text-sm">
                <span className="text-[var(--ink-secondary)]">PROGRESS:</span>
                <span className="text-[var(--ink-primary)] font-semibold">
                  {Math.round(((allCards.length - remainingCards.length) / allCards.length) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <button
            onClick={handleContinueSession}
            className="w-full btn-tavern text-center"
          >
            Resume Sorting
          </button>

          <button
            onClick={handleNewSession}
            className="w-full btn-wood text-center"
          >
            New Session
          </button>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-md">
          <DeckInput />
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 mt-16 text-center">
        <div className="h-px w-64 mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, var(--border-wood), transparent)' }} />

        {/* Accessibility toggle */}
        <div className="flex justify-center mb-6">
          <ColorblindToggle />
        </div>

        <p className="text-terminal text-[var(--text-muted)]">
          ACCEPTABLE INPUT FORMATS
        </p>
        <div className="mt-3 space-y-1">
          <p className="font-mono text-xs text-[var(--text-muted)]">
            URL: archidekt.com/decks/123456
          </p>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            ID: 123456
          </p>
        </div>
      </footer>
    </div>
  )
}
