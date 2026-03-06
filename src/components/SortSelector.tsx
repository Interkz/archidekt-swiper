import type { SortOption } from '../types/archidekt'
import { SORT_LABELS } from '../utils/cardSort'

const SORT_OPTIONS: SortOption[] = [
  'cmc-asc',
  'cmc-desc',
  'name-asc',
  'name-desc',
  'color',
  'type',
]

interface SortSelectorProps {
  value: SortOption
  onChange: (option: SortOption) => void
}

export default function SortSelector({ value, onChange }: SortSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-terminal text-[var(--status-neutral)] hidden sm:inline">SORT:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="px-3 py-1.5 border-2 border-[var(--lumon-black)] bg-[var(--surface-primary)]
                   font-mono text-xs uppercase tracking-wider text-[var(--lumon-black)]
                   focus:border-[var(--lumon-green)] focus:outline-none transition-colors
                   cursor-pointer appearance-none pr-8"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23080f0d' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {SORT_LABELS[option]}
          </option>
        ))}
      </select>
    </div>
  )
}
