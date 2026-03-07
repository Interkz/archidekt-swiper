import { useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDeckStore } from '../stores/deckStore'
import { computeColorDistribution, computeAverageCmc } from '../utils/deckStats'
import type { NormalizedCard } from '../types/archidekt'

const COLOR_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  W: { label: 'W', bg: 'bg-amber-50 border-amber-300', text: 'text-amber-800' },
  U: { label: 'U', bg: 'bg-blue-50 border-blue-300', text: 'text-blue-800' },
  B: { label: 'B', bg: 'bg-gray-100 border-gray-500', text: 'text-gray-800' },
  R: { label: 'R', bg: 'bg-red-50 border-red-300', text: 'text-red-800' },
  G: { label: 'G', bg: 'bg-green-50 border-green-300', text: 'text-green-800' },
  C: { label: 'C', bg: 'bg-gray-50 border-gray-300', text: 'text-gray-500' },
}

function countCards(cards: NormalizedCard[]): number {
  return cards.reduce((sum, c) => sum + c.quantity, 0)
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  if (minutes === 0) return `${seconds}s`
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
}

export default function SessionStatsPage() {
  const navigate = useNavigate()
  const {
    deckName,
    allCards,
    keptCards,
    removedCards,
    maybeCards,
    sessionStartTime,
    resetDeck,
  } = useDeckStore()

  const stats = useMemo(() => {
    const now = Date.now()
    const elapsed = sessionStartTime ? now - sessionStartTime : 0
    const totalReviewed = countCards(keptCards) + countCards(removedCards) + countCards(maybeCards)
    const elapsedMinutes = elapsed / 60000
    const cardsPerMinute = elapsedMinutes > 0 ? totalReviewed / elapsedMinutes : 0

    // Color breakdown across ALL reviewed cards
    const allReviewed = [...keptCards, ...removedCards, ...maybeCards]
    const colorDist = computeColorDistribution(allReviewed)
    const totalColorPips = Object.values(colorDist).reduce((a, b) => a + b, 0)

    // Average CMC per pile
    const avgCmcKept = computeAverageCmc(keptCards)
    const avgCmcRemoved = computeAverageCmc(removedCards)
    const avgCmcMaybe = computeAverageCmc(maybeCards)

    return {
      totalReviewed,
      elapsed,
      cardsPerMinute,
      colorDist,
      totalColorPips,
      avgCmcKept,
      avgCmcRemoved,
      avgCmcMaybe,
      keptCount: countCards(keptCards),
      removedCount: countCards(removedCards),
      maybeCount: countCards(maybeCards),
    }
  }, [keptCards, removedCards, maybeCards, sessionStartTime])

  if (allCards.length === 0) {
    navigate('/')
    return null
  }

  const handleReviewAgain = () => {
    resetDeck()
    navigate('/swipe')
  }

  const formatNumber = (n: number) => n.toString().padStart(3, '0')

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-[var(--lumon-black)] p-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-[var(--status-neutral)]
                       hover:text-[var(--lumon-black)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <span className="text-terminal text-[var(--lumon-green)]">SESSION COMPLETE</span>
        </div>
      </header>

      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Deck name */}
        <div className="mb-6 pb-4 border-b border-[var(--grid-line)]">
          <span className="text-terminal text-[var(--status-neutral)]">DECK:</span>
          <h1 className="font-mono text-xl font-bold text-[var(--lumon-black)]">{deckName}</h1>
        </div>

        {/* Primary stats row */}
        <div className="mb-6">
          <div className="text-terminal text-[var(--status-neutral)] mb-3">SESSION REPORT</div>
          <div className="grid grid-cols-3 gap-3">
            {/* Total reviewed */}
            <div className="border-2 border-[var(--lumon-black)] p-4 text-center">
              <div className="font-mono text-3xl font-bold text-[var(--lumon-black)]">
                {formatNumber(stats.totalReviewed)}
              </div>
              <div className="text-terminal text-[var(--status-neutral)] mt-1">REVIEWED</div>
            </div>
            {/* Time taken */}
            <div className="border-2 border-[var(--lumon-black)] p-4 text-center">
              <div className="font-mono text-3xl font-bold text-[var(--lumon-black)]">
                {formatDuration(stats.elapsed)}
              </div>
              <div className="text-terminal text-[var(--status-neutral)] mt-1">DURATION</div>
            </div>
            {/* Cards per minute */}
            <div className="border-2 border-[var(--lumon-black)] p-4 text-center">
              <div className="font-mono text-3xl font-bold text-[var(--lumon-black)]">
                {stats.cardsPerMinute.toFixed(1)}
              </div>
              <div className="text-terminal text-[var(--status-neutral)] mt-1">CARDS/MIN</div>
            </div>
          </div>
        </div>

        {/* Sorting breakdown */}
        <div className="mb-6">
          <div className="text-terminal text-[var(--status-neutral)] mb-3">SORTING BREAKDOWN</div>
          <div className="border-2 border-[var(--lumon-black)]">
            {/* Header */}
            <div className="grid grid-cols-3 border-b-2 border-[var(--lumon-black)] bg-[var(--lumon-cream)]">
              <div className="p-3 font-mono text-xs font-bold uppercase tracking-wider text-center border-r border-[var(--grid-line)]">
                Accepted
              </div>
              <div className="p-3 font-mono text-xs font-bold uppercase tracking-wider text-center border-r border-[var(--grid-line)]">
                Rejected
              </div>
              <div className="p-3 font-mono text-xs font-bold uppercase tracking-wider text-center">
                Deferred
              </div>
            </div>
            {/* Counts */}
            <div className="grid grid-cols-3 border-b border-[var(--grid-line)]">
              <div className="p-4 font-mono text-2xl font-bold text-center text-[var(--lumon-green)] border-r border-[var(--grid-line)]">
                {formatNumber(stats.keptCount)}
              </div>
              <div className="p-4 font-mono text-2xl font-bold text-center text-[var(--lumon-black)] border-r border-[var(--grid-line)]">
                {formatNumber(stats.removedCount)}
              </div>
              <div className="p-4 font-mono text-2xl font-bold text-center text-[#8b5a2b]">
                {formatNumber(stats.maybeCount)}
              </div>
            </div>
            {/* Avg CMC row */}
            <div className="grid grid-cols-3 bg-[var(--lumon-cream)]">
              <div className="p-3 font-mono text-sm text-center text-[var(--status-neutral)] border-r border-[var(--grid-line)]">
                AVG CMC {stats.avgCmcKept.toFixed(2)}
              </div>
              <div className="p-3 font-mono text-sm text-center text-[var(--status-neutral)] border-r border-[var(--grid-line)]">
                AVG CMC {stats.avgCmcRemoved.toFixed(2)}
              </div>
              <div className="p-3 font-mono text-sm text-center text-[var(--status-neutral)]">
                AVG CMC {stats.avgCmcMaybe.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Color identity breakdown */}
        <div className="mb-6">
          <div className="text-terminal text-[var(--status-neutral)] mb-3">COLOR DISTRIBUTION</div>
          <div className="border-2 border-[var(--lumon-black)] p-4">
            <div className="grid grid-cols-6 gap-2">
              {(['W', 'U', 'B', 'R', 'G', 'C'] as const).map((color) => {
                const count = stats.colorDist[color]
                const pct = stats.totalColorPips > 0 ? (count / stats.totalColorPips) * 100 : 0
                const style = COLOR_LABELS[color]
                return (
                  <div key={color} className="text-center">
                    <div className={`border-2 ${style.bg} p-3 mb-2`}>
                      <div className={`font-mono text-2xl font-bold ${style.text}`}>{count}</div>
                    </div>
                    <div className="font-mono text-xs font-bold text-[var(--lumon-black)]">{style.label}</div>
                    <div className="font-mono text-xs text-[var(--status-neutral)]">{pct.toFixed(0)}%</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleReviewAgain}
            className="flex-1 px-4 py-3 border-2 border-[var(--lumon-black)] font-mono font-semibold uppercase tracking-wider
                       hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
          >
            Review Again
          </button>
          <button
            onClick={() => navigate('/results')}
            className="flex-1 px-4 py-3 bg-[var(--lumon-green)] border-2 border-[var(--lumon-green)]
                       font-mono font-semibold uppercase tracking-wider text-[var(--lumon-white)]
                       hover:bg-[var(--lumon-green-light)] transition-all duration-150"
          >
            Export Deck
          </button>
        </div>
      </div>
    </div>
  )
}
