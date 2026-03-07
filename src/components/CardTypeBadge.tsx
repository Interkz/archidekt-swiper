const TYPE_COLORS: Record<string, string> = {
  Creature: '#16a34a',
  Instant: '#2563eb',
  Sorcery: '#dc2626',
  Enchantment: '#9333ea',
  Artifact: '#92400e',
  Land: '#6b7280',
  Planeswalker: '#ca8a04',
}

function getCardType(typeLine: string): { label: string; color: string } | null {
  const mainType = typeLine.split('—')[0].split('//')[0].trim()

  // Check types in priority order (most specific first)
  for (const [type, color] of Object.entries(TYPE_COLORS)) {
    if (mainType.includes(type)) {
      return { label: type, color }
    }
  }

  return null
}

interface CardTypeBadgeProps {
  typeLine: string
}

export default function CardTypeBadge({ typeLine }: CardTypeBadgeProps) {
  const typeInfo = getCardType(typeLine)
  if (!typeInfo) return null

  return (
    <div
      className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded-full text-white text-xs font-bold tracking-wide pointer-events-none"
      style={{ backgroundColor: typeInfo.color }}
    >
      {typeInfo.label}
    </div>
  )
}
