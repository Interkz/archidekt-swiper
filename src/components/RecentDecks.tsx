import { useRecentDecks } from '../hooks/useRecentDecks'

interface RecentDecksProps {
  onSelectDeck: (deckId: string) => void
  disabled?: boolean
}

export default function RecentDecks({ onSelectDeck, disabled }: RecentDecksProps) {
  const { recentDecks, clearRecent } = useRecentDecks()

  if (recentDecks.length === 0) return null

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-between mb-3">
        <span className="text-terminal text-[var(--status-neutral)] tracking-widest text-xs">
          RECENT SESSIONS
        </span>
        <button
          onClick={clearRecent}
          className="font-mono text-xs text-[var(--status-neutral)] hover:text-[var(--lumon-black)]
                     tracking-wider uppercase transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="border-t-2 border-[var(--lumon-black)]">
        {recentDecks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => onSelectDeck(deck.id)}
            disabled={disabled}
            className="w-full flex items-center justify-between px-3 py-2.5
                       border-b border-[var(--grid-line)]
                       hover:bg-[var(--lumon-green-pale)] transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed
                       group text-left"
          >
            <div className="min-w-0 flex-1">
              <span className="font-mono text-sm text-[var(--lumon-black)] truncate block
                             group-hover:text-[var(--lumon-green)]">
                {deck.name}
              </span>
            </div>
            <div className="flex items-center gap-4 ml-4 shrink-0">
              <span className="font-mono text-xs text-[var(--status-neutral)]">
                {deck.cardCount.toString().padStart(3, '0')} cards
              </span>
              <span className="font-mono text-xs text-[var(--status-neutral)] w-16 text-right">
                {formatDate(deck.lastReviewed)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
