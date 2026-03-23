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
      {/* Main action buttons */}
      <div className="flex items-center justify-center gap-4">
        {/* REJECT button */}
        <button
          onClick={onRemove}
          disabled={disabled}
          className="group flex items-center gap-2 px-5 py-3 border-2 border-[var(--negative)]
                     text-[var(--negative)] bg-transparent rounded transition-all duration-150
                     hover:bg-[var(--negative)] hover:text-[var(--tavern-card)]
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--negative)]
                     active:scale-[0.98]"
          aria-label="Reject card"
          title="Reject (Left Arrow)"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className="font-display text-sm font-bold uppercase tracking-wider">Reject</span>
        </button>

        {/* MAYBE button */}
        {onMaybe && (
          <button
            onClick={onMaybe}
            disabled={disabled}
            className="group flex items-center gap-2 px-5 py-3 border-2 border-[var(--deferred)]
                       text-[var(--deferred)] bg-transparent rounded transition-all duration-150
                       hover:bg-[var(--deferred)] hover:text-[var(--tavern-card)]
                       disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--deferred)]
                       active:scale-[0.98]"
            aria-label="Maybe - decide later"
            title="Maybe (Up Arrow)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
            </svg>
            <span className="font-display text-sm font-bold uppercase tracking-wider">Maybe</span>
          </button>
        )}

        {/* ACCEPT button */}
        <button
          onClick={onKeep}
          disabled={disabled}
          className="group flex items-center gap-2 px-5 py-3 border-2 border-[var(--positive)]
                     text-[var(--positive)] bg-transparent rounded transition-all duration-150
                     hover:bg-[var(--positive)] hover:text-[var(--tavern-card)]
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--positive)]
                     active:scale-[0.98]"
          aria-label="Accept card"
          title="Accept (Right Arrow)"
        >
          <span className="font-display text-sm font-bold uppercase tracking-wider">Accept</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Undo button - secondary, warm wood style */}
      <div className="flex justify-center">
        <button
          onClick={onUndo}
          disabled={!canUndo || disabled}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--border-wood)]
                     text-[var(--text-muted)] bg-transparent rounded transition-all duration-150
                     hover:border-[var(--amber)] hover:text-[var(--amber)]
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-[var(--border-wood)] disabled:hover:text-[var(--text-muted)]
                     active:scale-[0.98]"
          aria-label="Undo last action"
          title="Undo (Z)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a5 5 0 015 5v2M3 10l5-5M3 10l5 5" />
          </svg>
          <span className="font-mono text-xs font-medium uppercase tracking-wider">Undo</span>
        </button>
      </div>
    </div>
  )
}
