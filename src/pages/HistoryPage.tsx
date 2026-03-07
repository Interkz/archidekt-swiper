import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useHistoryStore } from '../stores/historyStore'

export default function HistoryPage() {
  const { reviews, clearHistory } = useHistoryStore()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleClear = () => {
    clearHistory()
    setShowConfirm(false)
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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
          <span className="text-terminal text-[var(--lumon-green)]">REVIEW HISTORY</span>
          <div className="w-16" />
        </div>
      </header>

      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Title section */}
        <div className="mb-6 pb-4 border-b border-[var(--grid-line)]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-terminal text-[var(--status-neutral)]">DECK REVIEW LOG</span>
              <p className="font-mono text-xs text-[var(--status-neutral)] mt-1">
                {reviews.length} {reviews.length === 1 ? 'ENTRY' : 'ENTRIES'}
              </p>
            </div>
            {reviews.length > 0 && (
              <button
                onClick={() => setShowConfirm(true)}
                className="px-4 py-2 border-2 border-[var(--lumon-black)] font-mono text-xs font-semibold uppercase tracking-wider
                           hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
              >
                Clear History
              </button>
            )}
          </div>
        </div>

        {/* Clear confirmation */}
        {showConfirm && (
          <div className="mb-6 border-2 border-[var(--lumon-black)] p-4">
            <p className="font-mono text-sm text-[var(--lumon-black)] mb-4">
              CONFIRM: DELETE ALL REVIEW HISTORY?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClear}
                className="flex-1 px-4 py-2 bg-[var(--lumon-black)] border-2 border-[var(--lumon-black)] text-[var(--lumon-white)]
                           font-mono text-xs font-semibold uppercase tracking-wider
                           hover:opacity-80 transition-all duration-150"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border-2 border-[var(--lumon-black)] font-mono text-xs font-semibold uppercase tracking-wider
                           hover:bg-[var(--lumon-cream)] transition-all duration-150"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {reviews.length === 0 && (
          <div className="border-2 border-[var(--grid-line)] p-8 text-center">
            <p className="font-mono text-sm text-[var(--status-neutral)]">
              NO REVIEWS RECORDED
            </p>
            <p className="font-mono text-xs text-[var(--status-neutral)] mt-2">
              Complete a deck sorting session to see it here.
            </p>
          </div>
        )}

        {/* Review list */}
        <div className="space-y-3">
          {reviews.map((review) => (
            <Link
              key={review.id}
              to={`/history/${review.id}`}
              className="block border-2 border-[var(--lumon-black)] p-4 hover:bg-[var(--lumon-cream)] transition-all duration-150 group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-mono text-sm font-bold text-[var(--lumon-black)] group-hover:text-[var(--lumon-green)] transition-colors">
                  {review.deckName}
                </h3>
                <svg className="w-4 h-4 text-[var(--status-neutral)] group-hover:text-[var(--lumon-black)] transition-colors flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="font-mono text-xs text-[var(--status-neutral)] mb-3">
                {formatDate(review.date)}
              </p>
              <div className="flex gap-4 font-mono text-xs">
                <span className="text-[var(--lumon-green)]">
                  {review.keptCount} KEPT
                </span>
                <span className="text-[var(--lumon-black)]">
                  {review.removedCount} CUT
                </span>
                {review.maybeCount > 0 && (
                  <span className="text-[var(--status-neutral)]">
                    {review.maybeCount} MAYBE
                  </span>
                )}
                <span className="text-[var(--status-neutral)] ml-auto">
                  {review.totalCards} TOTAL
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
