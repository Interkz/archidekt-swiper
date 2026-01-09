interface CategoryLimitBadgeProps {
  current: number
  max: number | null // null means no limit
  isActive?: boolean
}

export default function CategoryLimitBadge({ current, max, isActive }: CategoryLimitBadgeProps) {
  const hasLimit = max !== null && max > 0
  const atLimit = hasLimit && current >= max
  const nearLimit = hasLimit && current >= max * 0.8

  let colorClass = isActive ? 'text-violet-200' : 'text-slate-400'
  if (atLimit) {
    colorClass = isActive ? 'text-red-300' : 'text-red-500'
  } else if (nearLimit) {
    colorClass = isActive ? 'text-amber-300' : 'text-amber-500'
  } else if (current > 0) {
    colorClass = isActive ? 'text-emerald-300' : 'text-emerald-500'
  }

  return (
    <span className={`text-xs font-medium ${colorClass}`}>
      {current}/{hasLimit ? max : '--'}
    </span>
  )
}
