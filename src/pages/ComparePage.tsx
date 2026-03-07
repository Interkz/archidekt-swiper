import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getSavedSessions, deleteSession } from '../services/sessionStorage'
import { getCardImageUrl } from '../services/scryfallImages'
import type { CompletedSession } from '../types/archidekt'

interface CardComparison {
  name: string
  scryfallId: string
  manaCost: string
  typeLine: string
  deckCount: number
  deckNames: string[]
}

export default function ComparePage() {
  const [sessions, setSessions] = useState<CompletedSession[]>(getSavedSessions)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set(sessions.map((s) => s.id)))

  const selectedSessions = useMemo(
    () => sessions.filter((s) => selectedIds.has(s.id)),
    [sessions, selectedIds]
  )

  const { sharedCards, uniqueCardsByDeck } = useMemo(() => {
    if (selectedSessions.length < 2) return { sharedCards: [] as CardComparison[], uniqueCardsByDeck: new Map<string, CardComparison[]>() }

    // Count how many decks each card name appears in
    const cardMap = new Map<string, CardComparison>()

    for (const session of selectedSessions) {
      const seenInDeck = new Set<string>()
      for (const card of session.keptCards) {
        if (seenInDeck.has(card.name)) continue
        seenInDeck.add(card.name)

        const existing = cardMap.get(card.name)
        if (existing) {
          existing.deckCount++
          existing.deckNames.push(session.deckName)
        } else {
          cardMap.set(card.name, {
            name: card.name,
            scryfallId: card.scryfallId,
            manaCost: card.manaCost,
            typeLine: card.typeLine,
            deckCount: 1,
            deckNames: [session.deckName],
          })
        }
      }
    }

    const shared: CardComparison[] = []
    const unique = new Map<string, CardComparison[]>()

    // Init unique map for each selected deck
    for (const session of selectedSessions) {
      unique.set(session.id, [])
    }

    for (const card of cardMap.values()) {
      if (card.deckCount > 1) {
        shared.push(card)
      } else {
        // Find which session has this card
        for (const session of selectedSessions) {
          if (session.keptCards.some((c) => c.name === card.name)) {
            unique.get(session.id)!.push(card)
            break
          }
        }
      }
    }

    // Sort shared by deck count desc, then name
    shared.sort((a, b) => b.deckCount - a.deckCount || a.name.localeCompare(b.name))

    // Sort unique lists by name
    for (const list of unique.values()) {
      list.sort((a, b) => a.name.localeCompare(b.name))
    }

    return { sharedCards: shared, uniqueCardsByDeck: unique }
  }, [selectedSessions])

  const toggleSession = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleDeleteSession = (id: string) => {
    deleteSession(id)
    setSessions((prev) => prev.filter((s) => s.id !== id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  if (sessions.length < 2) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-terminal text-[var(--status-neutral)] mb-4">COMPARISON MODULE</div>
          <div className="border-2 border-[var(--lumon-black)] p-8 mb-6">
            <div className="font-mono text-sm text-[var(--lumon-black)] mb-2">
              INSUFFICIENT DATA
            </div>
            <p className="font-mono text-xs text-[var(--status-neutral)]">
              Complete sorting on at least 2 decks to enable comparison.
              You have {sessions.length} completed session{sessions.length !== 1 ? 's' : ''}.
            </p>
          </div>
          <Link
            to="/"
            className="inline-block px-6 py-3 border-2 border-[var(--lumon-black)] font-mono font-semibold uppercase tracking-wider
                       hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-[var(--lumon-black)] p-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
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
          <span className="text-terminal text-[var(--lumon-green)]">DECK COMPARISON</span>
        </div>
      </header>

      <div className="flex-1 p-4 max-w-5xl mx-auto w-full">
        {/* Session selector */}
        <div className="mb-6">
          <div className="text-terminal text-[var(--status-neutral)] mb-3">SELECT SESSIONS TO COMPARE</div>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between border-2 p-3 transition-all duration-150 ${
                  selectedIds.has(session.id)
                    ? 'border-[var(--lumon-green)] bg-[var(--lumon-green-pale)]'
                    : 'border-[var(--grid-line)]'
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(session.id)}
                    onChange={() => toggleSession(session.id)}
                    className="w-4 h-4 accent-[var(--lumon-green)]"
                  />
                  <div>
                    <div className="font-mono text-sm font-semibold text-[var(--lumon-black)]">
                      {session.deckName}
                    </div>
                    <div className="font-mono text-xs text-[var(--status-neutral)]">
                      {session.keptCards.length} cards kept &middot; by {session.deckOwner}
                    </div>
                  </div>
                </label>
                <button
                  onClick={() => handleDeleteSession(session.id)}
                  className="px-2 py-1 font-mono text-xs text-[var(--status-neutral)]
                             hover:text-[var(--lumon-black)] transition-colors"
                  title="Remove session"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {selectedSessions.length < 2 ? (
          <div className="border-2 border-[var(--lumon-black)] p-6 text-center">
            <span className="font-mono text-sm text-[var(--status-neutral)]">
              SELECT AT LEAST 2 SESSIONS TO COMPARE
            </span>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="mb-6 border-2 border-[var(--lumon-black)]">
              <div className="grid grid-cols-3 border-b-2 border-[var(--lumon-black)] bg-[var(--lumon-cream)]">
                <div className="p-3 font-mono text-xs font-bold uppercase tracking-wider text-center border-r border-[var(--grid-line)]">
                  Decks
                </div>
                <div className="p-3 font-mono text-xs font-bold uppercase tracking-wider text-center border-r border-[var(--grid-line)]">
                  Shared
                </div>
                <div className="p-3 font-mono text-xs font-bold uppercase tracking-wider text-center">
                  Total Unique
                </div>
              </div>
              <div className="grid grid-cols-3">
                <div className="p-4 font-mono text-2xl font-bold text-center text-[var(--lumon-black)] border-r border-[var(--grid-line)]">
                  {selectedSessions.length.toString().padStart(3, '0')}
                </div>
                <div className="p-4 font-mono text-2xl font-bold text-center text-[var(--lumon-green)] border-r border-[var(--grid-line)]">
                  {sharedCards.length.toString().padStart(3, '0')}
                </div>
                <div className="p-4 font-mono text-2xl font-bold text-center text-[var(--status-neutral)]">
                  {Array.from(uniqueCardsByDeck.values())
                    .reduce((sum, list) => sum + list.length, 0)
                    .toString()
                    .padStart(3, '0')}
                </div>
              </div>
            </div>

            {/* Shared cards */}
            {sharedCards.length > 0 && (
              <div className="mb-8">
                <div className="text-terminal text-[var(--lumon-green)] mb-3">
                  SHARED CARDS ({sharedCards.length})
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {sharedCards.map((card) => (
                    <CardTile key={card.name} card={card} totalDecks={selectedSessions.length} />
                  ))}
                </div>
              </div>
            )}

            {/* Unique cards per deck */}
            {selectedSessions.map((session) => {
              const uniqueCards = uniqueCardsByDeck.get(session.id) || []
              if (uniqueCards.length === 0) return null
              return (
                <div key={session.id} className="mb-8">
                  <div className="text-terminal text-[var(--lumon-black)] mb-3">
                    UNIQUE TO: {session.deckName} ({uniqueCards.length})
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {uniqueCards.map((card) => (
                      <CardTile key={card.name} card={card} />
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}

function CardTile({
  card,
  totalDecks,
}: {
  card: CardComparison
  totalDecks?: number
}) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="relative group">
      {/* Deck count badge */}
      {totalDecks && card.deckCount > 1 && (
        <div
          className="absolute -top-2 -right-2 z-10 w-7 h-7 flex items-center justify-center
                     bg-[var(--lumon-green)] text-[var(--lumon-white)]
                     font-mono text-xs font-bold border-2 border-[var(--lumon-white)]"
        >
          {card.deckCount}
        </div>
      )}

      {/* Card image or fallback */}
      {!imgError ? (
        <img
          src={getCardImageUrl(card.scryfallId, 'normal')}
          alt={card.name}
          className="w-full rounded-sm card-shadow group-hover:card-shadow-hover transition-shadow duration-150"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full aspect-[488/680] border-2 border-[var(--grid-line)] bg-[var(--surface-elevated)] flex flex-col items-center justify-center p-2">
          <span className="font-mono text-xs text-center text-[var(--lumon-black)] font-semibold leading-tight">
            {card.name}
          </span>
          <span className="font-mono text-[10px] text-[var(--status-neutral)] mt-1">
            {card.typeLine}
          </span>
        </div>
      )}

      {/* Tooltip on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-[var(--lumon-black)] text-[var(--lumon-white)] p-2
                   opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none"
      >
        <div className="font-mono text-xs font-semibold truncate">{card.name}</div>
        {totalDecks && (
          <div className="font-mono text-[10px] text-[var(--lumon-green-pale)]">
            In {card.deckCount}/{totalDecks} decks
          </div>
        )}
      </div>
    </div>
  )
}
