import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DeckInput from '../components/DeckInput'
import ColorblindToggle from '../components/ColorblindToggle'
import { useDeckStore } from '../stores/deckStore'

export default function HomePage() {
  const navigate = useNavigate()
  const { remainingCards, allCards, clearState } = useDeckStore()

  const hasExistingSession = allCards.length > 0 && remainingCards.length > 0

  useEffect(() => {
    useDeckStore.getState().setError(null)
  }, [])

  const handleContinueSession = () => {
    navigate('/swipe')
  }

  const handleNewSession = () => {
    clearState()
  }

  const formatNumber = (n: number) => n.toString().padStart(3, '0')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Ambient candlelight glow behind content */}
      <div
        className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(218, 176, 48, 0.06) 0%, rgba(200, 140, 60, 0.03) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Header section */}
      <div className="relative z-10 text-center mb-12">
        {/* Ornamental brass rule */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-20 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--border-brass))' }} />
          <div className="w-2 h-2 rotate-45 border border-[var(--border-brass)]" />
          <div className="w-20 h-px" style={{ background: 'linear-gradient(270deg, transparent, var(--border-brass))' }} />
        </div>

        {/* Title — GOLDEN, glowing */}
        <h1
          className="font-display text-4xl md:text-6xl tracking-wider"
          style={{
            background: 'linear-gradient(180deg, var(--gold-shimmer) 0%, var(--amber) 50%, var(--gold) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 20px rgba(218, 176, 48, 0.3))',
          }}
        >
          ARCHIDEKT SWIPER
        </h1>

        {/* Subtitle with divider */}
        <div className="flex items-center justify-center gap-4 my-5">
          <div className="w-12 h-px bg-[var(--border-brass)]" />
          <p className="text-terminal text-[var(--amber)] tracking-[0.3em]">
            DECK SORTING INTERFACE
          </p>
          <div className="w-12 h-px bg-[var(--border-brass)]" />
        </div>

        <p className="font-mono text-xs text-[var(--text-muted)]">v2.0.0</p>

        {/* Bottom ornament */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="w-20 h-px" style={{ background: 'linear-gradient(90deg, transparent, var(--border-brass))' }} />
          <div className="w-2 h-2 rotate-45 border border-[var(--border-brass)]" />
          <div className="w-20 h-px" style={{ background: 'linear-gradient(270deg, transparent, var(--border-brass))' }} />
        </div>
      </div>

      {hasExistingSession ? (
        <div className="relative z-10 w-full max-w-md space-y-6">
          {/* Session card — bright parchment that POPS */}
          <div className="parchment border-2 border-[var(--border-brass)]/50 rounded-lg p-6 shadow-lifted">
            <span className="text-terminal text-[var(--amber)] tracking-widest">ACTIVE SESSION</span>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between font-mono text-sm">
                <span className="text-[var(--ink-secondary)]">REMAINING:</span>
                <span className="text-[var(--positive)] font-bold">{formatNumber(remainingCards.length)}</span>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span className="text-[var(--ink-secondary)]">TOTAL:</span>
                <span className="text-[var(--ink-primary)] font-bold">{formatNumber(allCards.length)}</span>
              </div>
              <div className="h-px bg-[var(--border-brass)]/30 my-3" />
              <div className="flex justify-between font-mono text-sm">
                <span className="text-[var(--ink-secondary)]">PROGRESS:</span>
                <span className="text-[var(--ink-primary)] font-bold">
                  {Math.round(((allCards.length - remainingCards.length) / allCards.length) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Primary CTA — amber glow */}
          <button
            onClick={handleContinueSession}
            className="w-full btn-tavern text-center text-lg py-4"
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
        <div className="h-px w-48 mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, var(--border-wood), transparent)' }} />

        <div className="flex justify-center mb-6">
          <ColorblindToggle />
        </div>

        <Link
          to="/cube/setup"
          className="btn-wood px-8 py-3 inline-block mb-8 tracking-widest text-sm"
        >
          Cube Mode
        </Link>

        <p className="text-terminal text-[var(--text-muted)] tracking-widest">
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
