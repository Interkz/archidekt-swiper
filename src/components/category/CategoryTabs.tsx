import CategoryLimitBadge from './CategoryLimitBadge'

interface CategoryTabsProps {
  categories: string[]
  activeIndex: number
  categoryLimits: Record<string, number>
  getCategoryKeptCount: (category: string) => number
  onTabClick: (index: number) => void
}

export default function CategoryTabs({
  categories,
  activeIndex,
  categoryLimits,
  getCategoryKeptCount,
  onTabClick,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-0 overflow-x-auto border-2 border-[var(--lumon-black)]">
      {categories.map((category, index) => {
        const isActive = index === activeIndex
        const keptCount = getCategoryKeptCount(category)
        const limit = categoryLimits[category] || null
        const isLast = index === categories.length - 1

        return (
          <button
            key={category}
            onClick={() => onTabClick(index)}
            className={`flex-shrink-0 px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-150
              ${!isLast ? 'border-r border-[var(--lumon-black)]' : ''}
              ${isActive
                ? 'bg-[var(--lumon-black)] text-[var(--lumon-white)]'
                : 'bg-transparent text-[var(--lumon-black)] hover:bg-[var(--lumon-cream)]'
              }
            `}
          >
            <span className="block">{category}</span>
            <CategoryLimitBadge current={keptCount} max={limit} isActive={isActive} />
          </button>
        )
      })}
    </div>
  )
}
