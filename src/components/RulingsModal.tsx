import { useState, useEffect } from 'react'
import { fetchRulings, type ScryfallRuling } from '../services/scryfallRulings'

interface RulingsModalProps {
  isOpen: boolean
  onClose: () => void
  cardName: string
  scryfallId: string
}

export default function RulingsModal({ isOpen, onClose, cardName, scryfallId }: RulingsModalProps) {
  const [rulings, setRulings] = useState<ScryfallRuling[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) return

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchRulings(scryfallId)
      .then((data) => {
        if (!cancelled) setRulings(data)
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load rulings.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [isOpen, scryfallId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 modal-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="relative modal-content max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-2 border-[var(--lumon-black)]">
          <div>
            <span className="text-terminal text-[var(--status-neutral)]">OFFICIAL RULINGS</span>
            <h2 className="font-mono text-lg font-bold text-[var(--lumon-black)] mt-1">
              {cardName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 border-2 border-[var(--lumon-black)] flex items-center justify-center text-[var(--lumon-black)]
                       hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 bg-[var(--surface-elevated)]">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-2 border-[var(--lumon-black)] border-t-transparent animate-spin" />
              <span className="mt-4 text-terminal text-[var(--status-neutral)]">Loading</span>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-terminal text-[var(--lumon-black)]">{error}</p>
            </div>
          )}

          {!loading && !error && rulings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-2 border-[var(--grid-line)] flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[var(--status-neutral)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="square" strokeLinejoin="miter" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-terminal text-[var(--status-neutral)]">NO RULINGS FOUND</p>
            </div>
          )}

          {!loading && !error && rulings.length > 0 && (
            <div className="space-y-4">
              {rulings.map((ruling, index) => (
                <div key={index} className="p-4 border border-[var(--grid-line)] bg-[var(--surface-primary)]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs text-[var(--lumon-green)] uppercase">{ruling.source}</span>
                    <span className="font-mono text-xs text-[var(--status-neutral)]">{ruling.published_at}</span>
                  </div>
                  <p className="font-mono text-sm text-[var(--lumon-black)] leading-relaxed">{ruling.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-[var(--lumon-black)]">
          <button
            onClick={onClose}
            className="w-full py-3 border-2 border-[var(--lumon-black)] font-mono font-semibold uppercase tracking-wider
                       hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
