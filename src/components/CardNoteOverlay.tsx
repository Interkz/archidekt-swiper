import { useState, useEffect, useRef } from 'react'

interface CardNoteOverlayProps {
  cardName: string
  initialNote: string
  onSave: (note: string) => void
  onClose: () => void
}

export default function CardNoteOverlay({ cardName, initialNote, onSave, onClose }: CardNoteOverlayProps) {
  const [note, setNote] = useState(initialNote)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Prevent keyboard shortcuts from firing while overlay is open
  useEffect(() => {
    const stop = (e: KeyboardEvent) => {
      // Allow Escape to close
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      // Stop all other keys from propagating to swipe handlers
      e.stopPropagation()
    }
    window.addEventListener('keydown', stop, true)
    return () => window.removeEventListener('keydown', stop, true)
  }, [onClose])

  const handleSave = () => {
    onSave(note)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 modal-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[var(--surface-primary)] border-2 border-[var(--lumon-black)] w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--grid-line)]">
          <div>
            <span className="text-terminal text-[var(--status-neutral)]">ANNOTATE</span>
            <p className="font-mono text-sm font-bold text-[var(--lumon-black)] truncate max-w-[220px]">
              {cardName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 border-2 border-[var(--lumon-black)] flex items-center justify-center text-[var(--lumon-black)]
                       hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Input */}
        <div className="p-4">
          <textarea
            ref={inputRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., need 2 copies, sideboard candidate, too expensive..."
            className="w-full h-24 p-3 font-mono text-sm text-[var(--lumon-black)] bg-[var(--surface-elevated)]
                       border-2 border-[var(--lumon-black)] resize-none
                       focus:outline-none focus:border-[var(--lumon-green)]
                       placeholder:text-[var(--status-neutral)] placeholder:text-xs"
            maxLength={200}
          />
          <div className="flex justify-between items-center mt-1">
            <span className="font-mono text-[10px] text-[var(--status-neutral)]">
              {note.length}/200
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-0 border-t border-[var(--grid-line)]">
          {initialNote && (
            <button
              onClick={() => { onSave(''); onClose() }}
              className="flex-1 py-3 font-mono text-xs font-semibold uppercase tracking-wider
                         text-[var(--lumon-black)] border-r border-[var(--grid-line)]
                         hover:bg-[var(--lumon-cream)] transition-all duration-150"
            >
              Clear
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 py-3 font-mono text-xs font-semibold uppercase tracking-wider
                       bg-[var(--lumon-green)] text-[var(--lumon-white)]
                       hover:bg-[var(--lumon-green-light)] transition-all duration-150"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  )
}
