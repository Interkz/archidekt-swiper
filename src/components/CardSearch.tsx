import { useState, useRef, useEffect, useCallback } from 'react'
import type { NormalizedCard } from '../types/archidekt'

interface CardSearchProps {
  cards: NormalizedCard[]
  onSelect: (card: NormalizedCard) => void
}

export default function CardSearch({ cards, onSelect }: CardSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = query.length > 0
    ? cards.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : []

  const close = useCallback(() => {
    setQuery('')
    setIsOpen(false)
    setHighlightIndex(0)
    inputRef.current?.blur()
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        close()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, close])

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const item = listRef.current.children[highlightIndex] as HTMLElement | undefined
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightIndex, isOpen])

  const handleInputChange = (value: string) => {
    setQuery(value)
    setIsOpen(value.length > 0)
    setHighlightIndex(0)
  }

  const handleSelect = (card: NormalizedCard) => {
    onSelect(card)
    close()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filtered.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((prev) => Math.min(prev + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      handleSelect(filtered[highlightIndex])
    }
  }

  return (
    <div className="relative w-full max-w-[350px] mx-auto mb-4">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--status-neutral)]"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="square" strokeLinejoin="miter" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => { if (query.length > 0) setIsOpen(true) }}
          onKeyDown={handleKeyDown}
          placeholder="Search deck..."
          className="w-full pl-10 pr-3 py-2 bg-[var(--lumon-white)] border-2 border-[var(--lumon-black)]
                     font-mono text-sm text-[var(--lumon-black)] placeholder:text-[var(--status-neutral)]
                     focus:outline-none focus:border-[var(--lumon-green)] transition-colors"
        />
      </div>

      {isOpen && query.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-0 max-h-60 overflow-y-auto
                     bg-[var(--lumon-white)] border-2 border-t-0 border-[var(--lumon-black)]"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-3 font-mono text-sm text-[var(--status-neutral)] uppercase tracking-wider text-center">
              No matches
            </li>
          ) : (
            filtered.slice(0, 20).map((card, i) => (
              <li
                key={card.id}
                onMouseDown={(e) => { e.preventDefault(); handleSelect(card) }}
                onMouseEnter={() => setHighlightIndex(i)}
                className={`px-3 py-2 cursor-pointer font-mono text-sm flex items-center justify-between
                           border-b border-[var(--grid-line)] last:border-b-0 transition-colors
                           ${i === highlightIndex
                             ? 'bg-[var(--lumon-black)] text-[var(--lumon-white)]'
                             : 'text-[var(--lumon-black)] hover:bg-[var(--lumon-cream)]'
                           }`}
              >
                <span className="truncate">{card.name}</span>
                <span className={`ml-2 text-xs shrink-0 ${
                  i === highlightIndex ? 'text-[var(--grid-line)]' : 'text-[var(--status-neutral)]'
                }`}>
                  {card.manaCost || card.typeLine}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
