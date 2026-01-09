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
    <div className="flex gap-2 overflow-x-auto pb-2">
      {categories.map((category, index) => {
        const isActive = index === activeIndex
        const keptCount = getCategoryKeptCount(category)
        const limit = categoryLimits[category] || null

        return (
          <button
            key={category}
            onClick={() => onTabClick(index)}
            className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
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
