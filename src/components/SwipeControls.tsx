interface SwipeControlsProps {
  onKeep: () => void
  onRemove: () => void
  onMaybe?: () => void
  onUndo: () => void
  canUndo: boolean
  disabled?: boolean
}

export default function SwipeControls({
  onKeep,
  onRemove,
  onMaybe,
  onUndo,
  canUndo,
  disabled,
}: SwipeControlsProps) {
  return (
    <div className="mt-8 space-y-4">
      {/* Main action buttons - brutalist rectangles */}
      <div className="flex items-center justify-center gap-4">
        {/* REJECT button */}
        <button
          onClick={onRemove}
          disabled={disabled}
          className="group flex items-center gap-2 px-5 py-3 border-2 border-[var(--lumon-black)]
                     bg-transparent transition-all duration-150
                     hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)]
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--lumon-black)]
                     active:scale-[0.98]"
          aria-label="Reject card"
          title="Reject (Left Arrow)"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="square" strokeLinejoin="miter" d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="font-mono text-sm font-semibold uppercase tracking-wider">Reject</span>
        </button>

        {/* MAYBE button */}
        {onMaybe && (
          <button
            onClick={onMaybe}
            disabled={disabled}
            className="group flex items-center gap-2 px-5 py-3 border-2 border-[#8b5a2b]
                       text-[#8b5a2b] bg-transparent transition-all duration-150
                       hover:bg-[#8b5a2b] hover:text-[var(--lumon-white)]
                       disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#8b5a2b]
                       active:scale-[0.98]"
            aria-label="Maybe - decide later"
            title="Maybe (Up Arrow)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span className="font-mono text-sm font-semibold uppercase tracking-wider">Maybe</span>
          </button>
        )}

        {/* ACCEPT button */}
        <button
          onClick={onKeep}
          disabled={disabled}
          className="group flex items-center gap-2 px-5 py-3 border-2 border-[var(--lumon-green)]
                     text-[var(--lumon-green)] bg-transparent transition-all duration-150
                     hover:bg-[var(--lumon-green)] hover:text-[var(--lumon-white)]
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--lumon-green)]
                     active:scale-[0.98]"
          aria-label="Accept card"
          title="Accept (Right Arrow)"
        >
          <span className="font-mono text-sm font-semibold uppercase tracking-wider">Accept</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="square" strokeLinejoin="miter" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Undo button - smaller, secondary */}
      <div className="flex justify-center">
        <button
          onClick={onUndo}
          disabled={!canUndo || disabled}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--grid-line)]
                     text-[var(--status-neutral)] bg-transparent transition-all duration-150
                     hover:border-[var(--lumon-black)] hover:text-[var(--lumon-black)]
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[var(--grid-line)] disabled:hover:text-[var(--status-neutral)]
                     active:scale-[0.98]"
          aria-label="Undo last action"
          title="Undo (Z)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="square" strokeLinejoin="miter" d="M3 10h10a5 5 0 015 5v2M3 10l5-5M3 10l5 5" />
          </svg>
          <span className="font-mono text-xs font-medium uppercase tracking-wider">Undo</span>
        </button>
      </div>
    </div>
  )
}
