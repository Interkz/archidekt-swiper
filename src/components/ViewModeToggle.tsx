import type { ViewMode } from '../types/archidekt'

interface ViewModeToggleProps {
  mode: ViewMode
  onChange: (mode: ViewMode) => void
}

export default function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex bg-white/10 rounded-lg p-1">
      <button
        onClick={() => onChange('swipe')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
          ${mode === 'swipe'
            ? 'bg-purple-600 text-white'
            : 'text-gray-400 hover:text-white'
          }
        `}
      >
        Swipe
      </button>
      <button
        onClick={() => onChange('category')}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
          ${mode === 'category'
            ? 'bg-purple-600 text-white'
            : 'text-gray-400 hover:text-white'
          }
        `}
      >
        Categories
      </button>
    </div>
  )
}
