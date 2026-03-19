import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import DeckInput from '../components/DeckInput'
import ColorblindToggle from '../components/ColorblindToggle'
import { useDeckStore } from '../stores/deckStore'
import { useFavoritesStore } from '../stores/favoritesStore'

export default function HomePage() {
  const navigate = useNavigate()
  const { remainingCards, allCards, clearState } = useDeckStore()
  const favoritesCount = useFavoritesStore((s) => s.favorites.length)

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Subtle grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
           style={{
             backgroundImage: `
               linear-gradient(var(--lumon-black) 1px, transparent 1px),
               linear-gradient(90deg, var(--lumon-black) 1px, transparent 1px)
             `,
             backgroundSize: '40px 40px'
           }}
      />

      {/* Header section */}
      <div className="relative z-10 text-center mb-12">
        {/* Horizontal rule above */}
        <div className="w-64 h-0.5 bg-[var(--lumon-black)] mx-auto mb-8" />

        <h1 className="font-display text-4xl md:text-5xl tracking-tight text-[var(--lumon-black)] mb-2">
          ARCHIDEKT SWIPER
        </h1>
        <div className="h-px bg-[var(--grid-line)] w-48 mx-auto my-4" />
        <p className="text-terminal text-[var(--status-neutral)] tracking-widest">
          DECK SORTING INTERFACE
        </p>
        <p className="font-mono text-xs text-[var(--status-neutral)] mt-2">v2.0.0</p>

        {/* Horizontal rule below */}
        <div className="w-64 h-0.5 bg-[var(--lumon-black)] mx-auto mt-8" />

        {/* Favorites link */}
        <Link
          to="/favorites"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2 border-2 border-[var(--lumon-black)]
                     font-mono text-xs font-semibold uppercase tracking-wider
                     hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          Favorites
          {favoritesCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center
                             bg-[var(--lumon-green)] text-[var(--lumon-white)] font-mono text-[10px] font-bold">
              {favoritesCount}
            </span>
          )}
        </Link>
      </div>

      {hasExistingSession ? (
        <div className="relative z-10 w-full max-w-md space-y-6">
          {/* Session status box */}
          <div className="border-2 border-[var(--lumon-black)] p-6">
            <span className="text-terminal text-[var(--status-neutral)]">ACTIVE SESSION DETECTED</span>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between font-mono text-sm">
                <span className="text-[var(--status-neutral)]">REMAINING:</span>
                <span className="text-[var(--lumon-green)]">{formatNumber(remainingCards.length)}</span>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span className="text-[var(--status-neutral)]">TOTAL:</span>
                <span className="text-[var(--lumon-black)]">{formatNumber(allCards.length)}</span>
              </div>
              <div className="h-px bg-[var(--grid-line)] my-3" />
              <div className="flex justify-between font-mono text-sm">
                <span className="text-[var(--status-neutral)]">PROGRESS:</span>
                <span className="text-[var(--lumon-black)]">
                  {Math.round(((allCards.length - remainingCards.length) / allCards.length) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <button
            onClick={handleContinueSession}
            className="w-full px-6 py-4 bg-[var(--lumon-green)] border-2 border-[var(--lumon-green)]
                       font-mono font-semibold uppercase tracking-wider text-[var(--lumon-white)]
                       hover:bg-[var(--lumon-green-light)] transition-all duration-150
                       active:scale-[0.98]"
          >
            Resume Sorting
          </button>

          <button
            onClick={handleNewSession}
            className="w-full px-6 py-4 bg-transparent border-2 border-[var(--lumon-black)]
                       font-mono font-semibold uppercase tracking-wider text-[var(--lumon-black)]
                       hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)]
                       transition-all duration-150 active:scale-[0.98]"
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
        <div className="h-px bg-[var(--grid-line)] w-64 mx-auto mb-6" />

        {/* Accessibility toggle */}
        <div className="flex justify-center mb-6">
          <ColorblindToggle />
        </div>

        <p className="text-terminal text-[var(--status-neutral)]">
          ACCEPTABLE INPUT FORMATS
        </p>
        <div className="mt-3 space-y-1">
          <p className="font-mono text-xs text-[var(--status-neutral)]">
            URL: archidekt.com/decks/123456
          </p>
          <p className="font-mono text-xs text-[var(--status-neutral)]">
            ID: 123456
          </p>
        </div>
      </footer>
    </div>
  )
}
