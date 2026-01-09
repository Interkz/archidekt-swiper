import type { ViewMode } from '../types/archidekt'

interface ViewModeToggleProps {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
}

export default function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex border-2 border-[var(--lumon-black)]">
      <button
        onClick={() => onChange('swipe')}
        className={`px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-150
          ${mode === 'swipe'
            ? 'bg-[var(--lumon-black)] text-[var(--lumon-white)]'
            : 'bg-transparent text-[var(--lumon-black)] hover:bg-[var(--lumon-cream)]'
          }
        `}
      >
        Swipe
      </button>
      <div className="w-px bg-[var(--lumon-black)]" />
      <button
        onClick={() => onChange('category')}
        className={`px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-150
          ${mode === 'category'
            ? 'bg-[var(--lumon-black)] text-[var(--lumon-white)]'
            : 'bg-transparent text-[var(--lumon-black)] hover:bg-[var(--lumon-cream)]'
          }
        `}
      >
        Categories
      </button>
    </div>
  )
}
