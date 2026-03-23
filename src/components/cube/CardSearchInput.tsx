import { useState, useEffect, useRef, useCallback } from 'react'

interface ScryfallCard {
  id: string
  name: string
  scryfall_id?: string
  mana_cost: string
  cmc: number
  type_line: string
  color_identity: string[]
  image_uris?: { normal?: string; small?: string }
  card_faces?: { image_uris?: { normal?: string; small?: string } }[]
}

interface CardSearchInputProps {
  onSelect: (card: {
    scryfall_id: string
    name: string
    image_uri: string
    mana_cost: string
    cmc: number
    type_line: string
    color_identity: string[]
  }) => void
}

function getImageUri(card: ScryfallCard): string {
  if (card.image_uris?.normal) return card.image_uris.normal
  if (card.image_uris?.small) return card.image_uris.small
  if (card.card_faces?.[0]?.image_uris?.normal) return card.card_faces[0].image_uris.normal
  if (card.card_faces?.[0]?.image_uris?.small) return card.card_faces[0].image_uris.small
  return ''
}

export default function CardSearchInput({ onSelect }: CardSearchInputProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ScryfallCard[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(
        `https://api.scryfall.com/cards/search?q=${encodeURIComponent(q)}&unique=cards&order=name`
      )
      if (!res.ok) {
        setResults([])
        setIsOpen(false)
        return
      }
      const data = await res.json()
      setResults((data.data as ScryfallCard[]).slice(0, 20))
      setIsOpen(true)
    } catch {
      setResults([])
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      search(query)
    }, 300)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [query, search])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(card: ScryfallCard) {
    onSelect({
      scryfall_id: card.id,
      name: card.name,
      image_uri: getImageUri(card),
      mana_cost: card.mana_cost || '',
      cmc: card.cmc,
      type_line: card.type_line,
      color_identity: card.color_identity,
    })
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (results.length > 0) setIsOpen(true) }}
        placeholder="Search Scryfall for a card..."
        className="input-terminal w-full text-sm"
      />
      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-[var(--amber)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isOpen && results.length > 0 && (
        <div
          className="absolute z-50 top-full mt-1 w-full max-h-80 overflow-y-auto rounded border-2 border-[var(--border-wood)]"
          style={{ background: 'var(--tavern-surface)' }}
        >
          <div className="grid grid-cols-4 gap-1 p-2">
            {results.map((card) => {
              const img = getImageUri(card)
              return (
                <button
                  key={card.id}
                  onClick={() => handleSelect(card)}
                  className="group relative rounded overflow-hidden border border-transparent hover:border-[var(--amber)] transition-colors cursor-pointer"
                  title={card.name}
                >
                  {img ? (
                    <img
                      src={img}
                      alt={card.name}
                      className="w-full h-auto rounded"
                      loading="lazy"
                    />
                  ) : (
                    <div className="aspect-[488/680] flex items-center justify-center text-xs text-[var(--text-muted)] bg-[var(--tavern-sunken)]">
                      {card.name}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-[var(--text-light)] text-[10px] px-1 py-0.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                    {card.name}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div
          className="absolute z-50 top-full mt-1 w-full p-4 text-center text-sm text-[var(--text-muted)] rounded border-2 border-[var(--border-wood)]"
          style={{ background: 'var(--tavern-surface)' }}
        >
          No cards found
        </div>
      )}
    </div>
  )
}
