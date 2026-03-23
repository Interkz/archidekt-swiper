import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCubeStore } from '../stores/cubeStore'
import CubeNav from '../components/cube/CubeNav'
import MemberPicker from '../components/cube/MemberPicker'
import CardSearchInput from '../components/cube/CardSearchInput'

type ProposeMode = 'cut' | 'add'

interface SelectedAddCard {
  scryfall_id: string
  name: string
  image_uri: string
  mana_cost: string
  cmc: number
  type_line: string
  color_identity: string[]
}

export default function ProposeChangePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const cubeId = id || ''

  const memberName = useCubeStore((s) => s.memberName)
  const cards = useCubeStore((s) => s.cards)
  const proposeCut = useCubeStore((s) => s.proposeCut)
  const proposeAdd = useCubeStore((s) => s.proposeAdd)

  const [mode, setMode] = useState<ProposeMode>('cut')
  const [selectedCutCardId, setSelectedCutCardId] = useState<string | null>(null)
  const [selectedAddCard, setSelectedAddCard] = useState<SelectedAddCard | null>(null)
  const [reason, setReason] = useState('')
  const [cutSearch, setCutSearch] = useState('')

  const filteredCubeCards = useMemo(() => {
    if (!cutSearch.trim()) return cards
    const q = cutSearch.toLowerCase()
    return cards.filter((c) => c.name.toLowerCase().includes(q))
  }, [cards, cutSearch])

  const selectedCutCard = cards.find((c) => c.id === selectedCutCardId)

  function handleSubmit() {
    if (!memberName) return

    if (mode === 'cut' && selectedCutCardId) {
      proposeCut(selectedCutCardId, reason)
      navigate(`/cube/${cubeId}/voting`)
    } else if (mode === 'add' && selectedAddCard) {
      proposeAdd(selectedAddCard, reason)
      navigate(`/cube/${cubeId}/voting`)
    }
  }

  const canSubmit = memberName && (
    (mode === 'cut' && selectedCutCardId) ||
    (mode === 'add' && selectedAddCard)
  )

  return (
    <div className="min-h-screen flex flex-col">
      <CubeNav cubeId={cubeId} active="propose" />

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="font-display text-2xl text-[var(--text-light)] tracking-wider uppercase">
            Propose Change
          </h1>
          <MemberPicker />
        </div>

        {!memberName ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-lg border-2 border-dashed border-[var(--border-wood)]"
            style={{ background: 'var(--tavern-sunken)' }}
          >
            <p className="font-display text-lg text-[var(--text-muted)] tracking-wide uppercase">
              Pick a member above to propose changes
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mode toggle */}
            <div className="flex gap-1 p-1 rounded-lg border-2 border-[var(--border-wood)]"
                 style={{ background: 'var(--tavern-sunken)' }}>
              <button
                onClick={() => { setMode('cut'); setSelectedAddCard(null); setReason('') }}
                className={`
                  flex-1 py-2 px-4 rounded font-display text-sm uppercase tracking-wider transition-all
                  ${mode === 'cut'
                    ? 'bg-[var(--negative)] text-[var(--tavern-card)] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-light)]'
                  }
                `}
              >
                Propose Cut
              </button>
              <button
                onClick={() => { setMode('add'); setSelectedCutCardId(null); setCutSearch(''); setReason('') }}
                className={`
                  flex-1 py-2 px-4 rounded font-display text-sm uppercase tracking-wider transition-all
                  ${mode === 'add'
                    ? 'bg-[var(--positive)] text-[var(--tavern-card)] font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-light)]'
                  }
                `}
              >
                Propose Add
              </button>
            </div>

            {/* Cut mode */}
            {mode === 'cut' && (
              <div className="space-y-4">
                <label className="block text-sm text-[var(--text-muted)] font-display uppercase tracking-wider">
                  Select a card to cut
                </label>

                {/* Search within cube */}
                <input
                  type="text"
                  value={cutSearch}
                  onChange={(e) => setCutSearch(e.target.value)}
                  placeholder="Filter cube cards..."
                  className="input-terminal w-full text-sm"
                />

                {/* Card grid */}
                <div
                  className="max-h-96 overflow-y-auto rounded-lg border-2 border-[var(--border-wood)] p-2"
                  style={{ background: 'var(--tavern-sunken)' }}
                >
                  {filteredCubeCards.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] text-center py-8">
                      {cutSearch ? 'No cards match your filter' : 'No cards in cube'}
                    </p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1">
                      {filteredCubeCards.map((card) => (
                        <button
                          key={card.id}
                          onClick={() => setSelectedCutCardId(card.id)}
                          className={`
                            relative rounded overflow-hidden cursor-pointer transition-all
                            ${selectedCutCardId === card.id
                              ? 'ring-2 ring-[var(--negative)] scale-105 z-10'
                              : 'hover:ring-1 hover:ring-[var(--amber)] hover:scale-102'
                            }
                          `}
                          title={card.name}
                        >
                          {card.image_uri ? (
                            <img
                              src={card.image_uri}
                              alt={card.name}
                              className="w-full h-auto rounded"
                              loading="lazy"
                            />
                          ) : (
                            <div className="aspect-[488/680] flex items-center justify-center text-[8px] text-[var(--text-muted)] bg-[var(--tavern-surface)]">
                              {card.name}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected card preview */}
                {selectedCutCard && (
                  <div className="flex items-start gap-4 p-3 rounded-lg border border-[var(--border-wood)]"
                       style={{ background: 'var(--tavern-surface)' }}>
                    <img
                      src={selectedCutCard.image_uri}
                      alt={selectedCutCard.name}
                      className="w-24 rounded"
                    />
                    <div>
                      <p className="font-display text-sm text-[var(--text-light)] tracking-wide">
                        {selectedCutCard.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{selectedCutCard.type_line}</p>
                      <span
                        className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-display uppercase tracking-wider font-bold"
                        style={{ background: 'var(--negative)', color: 'var(--tavern-card)' }}
                      >
                        Cutting this card
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add mode */}
            {mode === 'add' && (
              <div className="space-y-4">
                <label className="block text-sm text-[var(--text-muted)] font-display uppercase tracking-wider">
                  Search Scryfall for a card to add
                </label>

                <CardSearchInput
                  onSelect={(card) => setSelectedAddCard(card)}
                />

                {/* Selected card preview */}
                {selectedAddCard && (
                  <div className="flex items-start gap-4 p-3 rounded-lg border border-[var(--border-wood)]"
                       style={{ background: 'var(--tavern-surface)' }}>
                    <img
                      src={selectedAddCard.image_uri}
                      alt={selectedAddCard.name}
                      className="w-24 rounded"
                    />
                    <div>
                      <p className="font-display text-sm text-[var(--text-light)] tracking-wide">
                        {selectedAddCard.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">{selectedAddCard.type_line}</p>
                      <span
                        className="inline-block mt-2 px-2 py-0.5 rounded text-xs font-display uppercase tracking-wider font-bold"
                        style={{ background: 'var(--positive)', color: 'var(--tavern-card)' }}
                      >
                        Adding this card
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <label className="block text-sm text-[var(--text-muted)] font-display uppercase tracking-wider">
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={mode === 'cut' ? 'Why should this card be cut?' : 'Why should this card be added?'}
                rows={3}
                className="input-terminal w-full text-sm resize-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`
                btn-tavern w-full text-center
                ${!canSubmit ? 'opacity-40 cursor-not-allowed' : ''}
              `}
            >
              {mode === 'cut' ? 'Propose Cut' : 'Propose Addition'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
