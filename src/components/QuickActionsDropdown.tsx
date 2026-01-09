import { useState, useRef, useEffect } from 'react'
import type { QuickAction, NormalizedCard, BulkActionType } from '../types/archidekt'

interface QuickActionsDropdownProps {
  getRemainingLands: () => NormalizedCard[]
  getRemainingByCategory: (category: string) => NormalizedCard[]
  categories: string[]
  onActionSelect: (action: QuickAction) => void
}

export default function QuickActionsDropdown({
  getRemainingLands,
  getRemainingByCategory,
  categories,
  onActionSelect,
}: QuickActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const buildActions = (): QuickAction[] => {
    const actions: QuickAction[] = []

    // Keep all lands
    const lands = getRemainingLands()
    actions.push({
      type: 'keep-lands' as BulkActionType,
      cards: lands,
      label: 'Keep All Lands',
    })

    // Keep by category
    categories.forEach((cat) => {
      const cards = getRemainingByCategory(cat)
      actions.push({
        type: 'keep-category' as BulkActionType,
        category: cat,
        cards,
        label: `Keep All ${cat}`,
      })
    })

    return actions
  }

  const actions = buildActions()

  const handleSelect = (action: QuickAction) => {
    setIsOpen(false)
    onActionSelect(action)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border-2 border-[var(--lumon-black)]
                   font-mono text-xs uppercase tracking-wider
                   hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)]
                   transition-all duration-150"
      >
        <span>Quick</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="square" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-56 border-2 border-[var(--lumon-black)]
                     bg-[var(--surface-primary)] shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {actions.map((action, index) => (
            <button
              key={`${action.type}-${action.category || 'lands'}-${index}`}
              onClick={() => handleSelect(action)}
              disabled={action.cards.length === 0}
              className="w-full px-4 py-3 text-left font-mono text-xs uppercase tracking-wider
                         border-b border-[var(--grid-line)] last:border-b-0
                         hover:bg-[var(--lumon-cream)] disabled:opacity-30 disabled:cursor-not-allowed
                         transition-colors"
            >
              <span className="block truncate">{action.label}</span>
              <span className="text-[var(--status-neutral)]">({action.cards.length})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
