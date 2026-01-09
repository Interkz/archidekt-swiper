interface CategoryLimitBadgeProps {
  current: number
  max: number | null // null means no limit
  isActive?: boolean
}

export default function CategoryLimitBadge({ current, max, isActive }: CategoryLimitBadgeProps) {
  const hasLimit = max !== null && max > 0
  const atLimit = hasLimit && current >= max

  // Clinical color coding without traffic lights
  // Use green for positive state, neutral for default
  let colorClass = isActive ? 'text-[var(--lumon-white)]/60' : 'text-[var(--status-neutral)]'

  if (atLimit) {
    // At limit - use a muted warning instead of red
    colorClass = isActive ? 'text-[var(--lumon-white)]' : 'text-[var(--lumon-black)]'
  } else if (current > 0) {
    // Has cards - use green
    colorClass = isActive ? 'text-[var(--lumon-white)]' : 'text-[var(--lumon-green)]'
  }

  return (
    <span className={`font-mono text-[10px] ${colorClass} mt-1 block`}>
      {current.toString().padStart(2, '0')}/{hasLimit ? max.toString().padStart(2, '0') : '--'}
    </span>
  )
}
