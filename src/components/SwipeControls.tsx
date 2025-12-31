interface SwipeControlsProps {
  onKeep: () => void
  onRemove: () => void
  onUndo: () => void
  canUndo: boolean
  disabled?: boolean
}

export default function SwipeControls({
  onKeep,
  onRemove,
  onUndo,
  canUndo,
  disabled,
}: SwipeControlsProps) {
  return (
    <div className="flex items-center justify-center gap-6 mt-6">
      {/* Remove button */}
      <button
        onClick={onRemove}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500
                   text-red-500 flex items-center justify-center
                   hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        title="Remove (Left Arrow)"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Undo button */}
      <button
        onClick={onUndo}
        disabled={!canUndo || disabled}
        className="w-12 h-12 rounded-full bg-yellow-500/20 border-2 border-yellow-500
                   text-yellow-500 flex items-center justify-center
                   hover:bg-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        title="Undo (Z)"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </button>

      {/* Keep button */}
      <button
        onClick={onKeep}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500
                   text-green-500 flex items-center justify-center
                   hover:bg-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-colors"
        title="Keep (Right Arrow)"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  )
}
