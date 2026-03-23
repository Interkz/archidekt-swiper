import { useCubeStore } from '../../stores/cubeStore'

const COLORS = [
  { value: 'W', label: 'W', title: 'White' },
  { value: 'U', label: 'U', title: 'Blue' },
  { value: 'B', label: 'B', title: 'Black' },
  { value: 'R', label: 'R', title: 'Red' },
  { value: 'G', label: 'G', title: 'Green' },
  { value: 'C', label: 'C', title: 'Colorless' },
  { value: 'M', label: 'Multi', title: 'Multicolor' },
]

const TYPES = [
  'Creature', 'Instant', 'Sorcery', 'Enchantment', 'Artifact', 'Land', 'Planeswalker',
]

const TAGS = [
  'removal', 'card-draw', 'ramp', 'board-wipe', 'counterspell',
  'tutor', 'recursion', 'mana-dork', 'mana-rock', 'card-advantage',
]

interface FilterBarProps {
  filteredCount: number
  totalCount: number
}

export default function FilterBar({ filteredCount, totalCount }: FilterBarProps) {
  const activeFilters = useCubeStore((s) => s.activeFilters)
  const toggleFilter = useCubeStore((s) => s.toggleFilter)
  const clearFilters = useCubeStore((s) => s.clearFilters)
  const colorCounts = useCubeStore((s) => s.getColorCounts)()
  const typeCounts = useCubeStore((s) => s.getTypeCounts)()
  const tagCounts = useCubeStore((s) => s.getTagCounts)()

  const hasFilters =
    activeFilters.colors.length > 0 ||
    activeFilters.types.length > 0 ||
    activeFilters.tags.length > 0

  return (
    <div
      className="px-4 py-3 space-y-2"
      style={{ background: 'var(--felt-edge, #0e2016)', borderBottom: '1px solid rgba(14,32,22,0.9)' }}
    >
      {/* Header row with count and clear */}
      <div className="flex items-center justify-between mb-1">
        <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-wider uppercase">
          {hasFilters ? `${filteredCount} / ${totalCount} cards` : `${totalCount} cards`}
        </span>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="font-mono text-[10px] uppercase tracking-wider text-[var(--amber)]
                       hover:text-[var(--amber-light)] transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Color chips */}
      <div className="flex gap-1.5 flex-wrap">
        {COLORS.map((c) => {
          const isActive = activeFilters.colors.includes(c.value)
          const count = colorCounts[c.value] || 0
          return (
            <button
              key={c.value}
              onClick={() => toggleFilter('colors', c.value)}
              title={c.title}
              className={`
                font-mono text-[10px] font-semibold uppercase tracking-wider
                px-2.5 py-1 rounded-sm border-[1.5px] whitespace-nowrap
                cursor-pointer transition-all duration-150
                ${isActive
                  ? 'border-[var(--stone,#9a9080)] text-[var(--ink,#1a0e06)] shadow-sm'
                  : 'border-[var(--felt-light,#224a34)] text-[var(--cream-dim,#b0a888)] bg-transparent hover:border-[var(--stone,#9a9080)] hover:text-[var(--stone-light,#b8b0a0)]'
                }
              `}
              style={isActive ? {
                background: 'linear-gradient(180deg, var(--stone-light, #b8b0a0), var(--stone, #9a9080))',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              } : undefined}
            >
              {c.label} <span className="opacity-70">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Type chips */}
      <div className="flex gap-1.5 flex-wrap">
        {TYPES.map((t) => {
          const isActive = activeFilters.types.includes(t)
          const count = typeCounts[t] || 0
          return (
            <button
              key={t}
              onClick={() => toggleFilter('types', t)}
              className={`
                font-mono text-[10px] font-semibold uppercase tracking-wider
                px-2.5 py-1 rounded-sm border-[1.5px] whitespace-nowrap
                cursor-pointer transition-all duration-150
                ${isActive
                  ? 'border-[var(--stone,#9a9080)] text-[var(--ink,#1a0e06)] shadow-sm'
                  : 'border-[var(--felt-light,#224a34)] text-[var(--cream-dim,#b0a888)] bg-transparent hover:border-[var(--stone,#9a9080)] hover:text-[var(--stone-light,#b8b0a0)]'
                }
              `}
              style={isActive ? {
                background: 'linear-gradient(180deg, var(--stone-light, #b8b0a0), var(--stone, #9a9080))',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              } : undefined}
            >
              {t} {count > 0 && <span className="opacity-70">{count}</span>}
            </button>
          )
        })}
      </div>

      {/* Tag chips */}
      <div className="flex gap-1.5 flex-wrap">
        {TAGS.map((tag) => {
          const isActive = activeFilters.tags.includes(tag)
          const count = tagCounts[tag] || 0
          if (count === 0 && !isActive) return null
          return (
            <button
              key={tag}
              onClick={() => toggleFilter('tags', tag)}
              className={`
                font-mono text-[10px] font-semibold uppercase tracking-wider
                px-2.5 py-1 rounded-sm border-[1.5px] whitespace-nowrap
                cursor-pointer transition-all duration-150
                ${isActive
                  ? 'border-[var(--stone,#9a9080)] text-[var(--ink,#1a0e06)] shadow-sm'
                  : 'border-[var(--felt-light,#224a34)] text-[var(--cream-dim,#b0a888)] bg-transparent hover:border-[var(--stone,#9a9080)] hover:text-[var(--stone-light,#b8b0a0)]'
                }
              `}
              style={isActive ? {
                background: 'linear-gradient(180deg, var(--stone-light, #b8b0a0), var(--stone, #9a9080))',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              } : undefined}
            >
              {tag} <span className="opacity-70">{count}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
