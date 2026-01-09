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
    <div className="flex items-center justify-center gap-5 mt-6">
      {/* Remove button */}
      <button
        onClick={onRemove}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-white border-2 border-red-200
                   text-red-500 flex items-center justify-center card-shadow
                   hover:border-red-400 hover:bg-red-50 hover:scale-105
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                   transition-all duration-200 active:scale-95"
        title="Remove (Left Arrow)"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Undo button */}
      <button
        onClick={onUndo}
        disabled={!canUndo || disabled}
        className="w-12 h-12 rounded-full bg-white border-2 border-amber-200
                   text-amber-500 flex items-center justify-center card-shadow
                   hover:border-amber-400 hover:bg-amber-50 hover:scale-105
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                   transition-all duration-200 active:scale-95"
        title="Undo (Z)"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </button>

      {/* Keep button */}
      <button
        onClick={onKeep}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-white border-2 border-emerald-200
                   text-emerald-500 flex items-center justify-center card-shadow
                   hover:border-emerald-400 hover:bg-emerald-50 hover:scale-105
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                   transition-all duration-200 active:scale-95"
        title="Keep (Right Arrow)"
      >
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  )
}
