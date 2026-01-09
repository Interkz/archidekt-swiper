import type { CategoryCount } from '../../utils/deckStats'

interface CategoryStatsProps {
  categories: CategoryCount[]
}

export default function CategoryStats({ categories }: CategoryStatsProps) {
  if (categories.length === 0) {
    return (
      <p className="font-mono text-xs text-[var(--status-neutral)]">NO CARDS KEPT</p>
    )
  }

  const maxCount = Math.max(...categories.map((c) => c.count))

  return (
    <div className="space-y-2">
      {categories.slice(0, 8).map((cat) => {
        const widthPercent = (cat.count / maxCount) * 100

        return (
          <div key={cat.name} className="flex items-center gap-2">
            {/* Category name */}
            <span
              className="font-mono text-xs text-[var(--lumon-black)] w-20 truncate"
              title={cat.name}
            >
              {cat.name.toUpperCase()}
            </span>
            {/* Bar */}
            <div className="flex-1 h-3 bg-[var(--lumon-cream)] border border-[var(--grid-line)]">
              <div
                className="h-full bg-[var(--lumon-green)] transition-all duration-300"
                style={{ width: `${widthPercent}%` }}
              />
            </div>
            {/* Count */}
            <span className="font-mono text-xs text-[var(--lumon-black)] w-6 text-right">
              {cat.count}
            </span>
          </div>
        )
      })}
      {categories.length > 8 && (
        <p className="font-mono text-[10px] text-[var(--status-neutral)]">
          +{categories.length - 8} MORE
        </p>
      )}
    </div>
  )
}
