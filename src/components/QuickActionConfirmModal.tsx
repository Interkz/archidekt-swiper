import { useEffect } from 'react'
import type { QuickAction } from '../types/archidekt'
import { getCardImageUrl } from '../services/scryfallImages'

interface QuickActionConfirmModalProps {
  isOpen: boolean
  action: QuickAction | null
  onConfirm: () => void
  onCancel: () => void
}

export default function QuickActionConfirmModal({
  isOpen,
  action,
  onConfirm,
  onCancel,
}: QuickActionConfirmModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onCancel])

  if (!isOpen || !action) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 modal-backdrop"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-[var(--surface-primary)] border-2 border-[var(--lumon-black)] w-full max-w-lg">
        {/* Header */}
        <div className="p-5 border-b-2 border-[var(--lumon-black)]">
          <span className="text-terminal text-[var(--status-neutral)]">CONFIRM ACTION</span>
          <h2 className="font-mono text-lg font-bold text-[var(--lumon-black)]">
            {action.label.toUpperCase()}
          </h2>
        </div>

        {/* Body */}
        <div className="p-5">
          <p className="font-mono text-sm mb-4">
            This will add <strong className="text-[var(--lumon-green)]">{action.cards.length}</strong> cards to your inventory.
          </p>

          {/* Card preview grid */}
          <div className="max-h-48 overflow-y-auto border border-[var(--grid-line)] p-2">
            <div className="grid grid-cols-6 gap-1">
              {action.cards.slice(0, 12).map((card) => (
                <div key={card.id} className="relative group">
                  <img
                    src={getCardImageUrl(card.scryfallId, 'small')}
                    alt={card.name}
                    className="w-full h-auto border border-[var(--grid-line)]"
                  />
                  <div className="absolute inset-0 bg-[var(--lumon-black)]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                    <span className="text-[var(--lumon-white)] text-[8px] text-center font-mono leading-tight">
                      {card.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {action.cards.length > 12 && (
              <p className="mt-2 text-center font-mono text-xs text-[var(--status-neutral)]">
                +{action.cards.length - 12} more cards
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-[var(--lumon-black)] flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border-2 border-[var(--lumon-black)]
                       font-mono text-sm font-semibold uppercase tracking-wider
                       hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)]
                       transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-[var(--lumon-green)] border-2 border-[var(--lumon-green)]
                       text-[var(--lumon-white)] font-mono text-sm font-semibold uppercase tracking-wider
                       hover:bg-[var(--lumon-green-light)] transition-all duration-150"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
