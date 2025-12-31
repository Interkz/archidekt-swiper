interface CategoryLimitBadgeProps {
  current: number
  max: number | null // null means no limit
}

export default function CategoryLimitBadge({ current, max }: CategoryLimitBadgeProps) {
  const hasLimit = max !== null && max > 0
  const atLimit = hasLimit && current >= max
  const nearLimit = hasLimit && current >= max * 0.8

  let colorClass = 'text-gray-400'
  if (atLimit) {
    colorClass = 'text-red-400'
  } else if (nearLimit) {
    colorClass = 'text-yellow-400'
  } else if (current > 0) {
    colorClass = 'text-green-400'
  }

  return (
    <span className={`text-xs font-medium ${colorClass}`}>
      {current}/{hasLimit ? max : '--'}
    </span>
  )
}
