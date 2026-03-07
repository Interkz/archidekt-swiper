import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useHistoryStore } from '../stores/historyStore'
import type { CardDecision } from '../types/archidekt'

type FilterMode = 'all' | 'keep' | 'remove' | 'maybe'

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const review = useHistoryStore((s) => s.getReview(id || ''))
  const [filter, setFilter] = useState<FilterMode>('all')

  if (!review) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <p className="font-mono text-sm text-[var(--status-neutral)] mb-4">REVIEW NOT FOUND</p>
        <button
          onClick={() => navigate('/history')}
          className="px-6 py-3 border-2 border-[var(--lumon-black)] font-mono text-sm font-semibold uppercase tracking-wider
                     hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
        >
          Back to History
        </button>
      </div>
    )
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

  const formatNumber = (n: number) => n.toString().padStart(3, '0')

  const filtered = filter === 'all'
    ? review.decisions
    : review.decisions.filter((d) => d.action === filter)

  // Group by category
  const grouped = filtered.reduce<Record<string, CardDecision[]>>((acc, d) => {
    const cat = d.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(d)
    return acc
  }, {})

  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    if (a.toLowerCase() === 'commander') return -1
    if (b.toLowerCase() === 'commander') return 1
    return a.localeCompare(b)
  })

  const actionLabel = (action: CardDecision['action']) => {
    switch (action) {
      case 'keep': return 'KEPT'
      case 'remove': return 'CUT'
      case 'maybe': return 'MAYBE'
    }
  }

  const actionColor = (action: CardDecision['action']) => {
    switch (action) {
      case 'keep': return 'text-[var(--lumon-green)]'
      case 'remove': return 'text-[var(--lumon-black)]'
      case 'maybe': return 'text-[var(--status-neutral)]'
    }
  }

  const filterButtons: { mode: FilterMode; label: string }[] = [
    { mode: 'all', label: `All (${review.decisions.length})` },
    { mode: 'keep', label: `Kept (${review.keptCount})` },
    { mode: 'remove', label: `Cut (${review.removedCount})` },
  ]
  if (review.maybeCount > 0) {
    filterButtons.push({ mode: 'maybe', label: `Maybe (${review.maybeCount})` })
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-[var(--lumon-black)] p-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Link
            to="/history"
            className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-[var(--status-neutral)]
                       hover:text-[var(--lumon-black)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M15 19l-7-7 7-7" />
            </svg>
            History
          </Link>
          <span className="text-terminal text-[var(--lumon-green)]">REVIEW DETAIL</span>
          <div className="w-16" />
        </div>
      </header>

      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Deck info */}
        <div className="mb-6 pb-4 border-b border-[var(--grid-line)]">
          <span className="text-terminal text-[var(--status-neutral)]">DECK:</span>
          <h1 className="font-mono text-xl font-bold text-[var(--lumon-black)]">{review.deckName}</h1>
          <p className="font-mono text-xs text-[var(--status-neutral)] mt-1">
            {formatDate(review.date)} &middot; {review.deckOwner}
          </p>
        </div>

        {/* Stats table */}
        <div className="mb-6">
          <div className="border-2 border-[var(--lumon-black)]">
            <div className="grid grid-cols-3 border-b-2 border-[var(--lumon-black)] bg-[var(--lumon-cream)]">
              <div className="p-3 font-mono text-xs font-bold uppercase tracking-wider text-center border-r border-[var(--grid-line)]">
                Kept
              </div>
              <div className="p-3 font-mono text-xs font-bold uppercase tracking-wider text-center border-r border-[var(--grid-line)]">
                Cut
              </div>
              <div className="p-3 font-mono text-xs font-bold uppercase tracking-wider text-center">
                Total
              </div>
            </div>
            <div className="grid grid-cols-3">
              <div className="p-4 font-mono text-2xl font-bold text-center text-[var(--lumon-green)] border-r border-[var(--grid-line)]">
                {formatNumber(review.keptCount)}
              </div>
              <div className="p-4 font-mono text-2xl font-bold text-center text-[var(--lumon-black)] border-r border-[var(--grid-line)]">
                {formatNumber(review.removedCount)}
              </div>
              <div className="p-4 font-mono text-2xl font-bold text-center text-[var(--status-neutral)]">
                {formatNumber(review.totalCards)}
              </div>
            </div>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="mb-4 flex border-2 border-[var(--lumon-black)]">
          {filterButtons.map((btn, index) => (
            <button
              key={btn.mode}
              onClick={() => setFilter(btn.mode)}
              className={`flex-1 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-150
                         ${index < filterButtons.length - 1 ? 'border-r border-[var(--lumon-black)]' : ''}
                         ${filter === btn.mode
                           ? 'bg-[var(--lumon-black)] text-[var(--lumon-white)]'
                           : 'bg-transparent text-[var(--lumon-black)] hover:bg-[var(--lumon-cream)]'
                         }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Card decisions grouped by category */}
        <div className="space-y-4">
          {sortedCategories.map((category) => (
            <div key={category} className="border-2 border-[var(--lumon-black)]">
              <div className="bg-[var(--lumon-cream)] px-4 py-2 border-b border-[var(--grid-line)]">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--lumon-black)]">
                  {category}
                </span>
                <span className="font-mono text-xs text-[var(--status-neutral)] ml-2">
                  ({grouped[category].length})
                </span>
              </div>
              <div className="divide-y divide-[var(--grid-line)]">
                {grouped[category].map((decision, i) => (
                  <div key={`${decision.cardName}-${i}`} className="flex items-center justify-between px-4 py-2">
                    <span className="font-mono text-sm text-[var(--lumon-black)]">
                      {decision.cardName}
                    </span>
                    <span className={`font-mono text-xs font-semibold uppercase tracking-wider ${actionColor(decision.action)}`}>
                      {actionLabel(decision.action)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
