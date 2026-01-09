import type { ViewMode } from '../types/archidekt'

interface ViewModeToggleProps {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
}

export default function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex bg-white rounded-xl p-1 card-shadow">
      <button
        onClick={() => onChange('swipe')}
        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
          ${mode === 'swipe'
            ? 'bg-violet-600 text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
          }
        `}
      >
        Swipe
      </button>
      <button
        onClick={() => onChange('category')}
        className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200
          ${mode === 'category'
            ? 'bg-violet-600 text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
          }
        `}
      >
        Categories
      </button>
    </div>
  )
}
