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
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-600">
      {categories.map((category, index) => {
        const isActive = index === activeIndex
        const keptCount = getCategoryKeptCount(category)
        const limit = categoryLimits[category] || null

        return (
          <button
            key={category}
            onClick={() => onTabClick(index)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${isActive
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }
            `}
          >
            <span className="block">{category}</span>
            <CategoryLimitBadge current={keptCount} max={limit} />
          </button>
        )
      })}
    </div>
  )
}
