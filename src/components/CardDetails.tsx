import type { NormalizedCard } from '../types/archidekt'

interface CardDetailsProps {
  card: NormalizedCard
}

export default function CardDetails({ card }: CardDetailsProps) {
  return (
    <div className="mt-4 text-center">
      <h2 className="text-xl font-bold text-white">{card.name}</h2>
      <div className="flex items-center justify-center gap-2 mt-1">
        {card.manaCost && (
          <span className="text-gray-300 font-mono">{formatManaCost(card.manaCost)}</span>
        )}
      </div>
      <p className="text-gray-400 text-sm mt-1">{card.typeLine}</p>
    </div>
  )
}

function formatManaCost(manaCost: string): string {
  // Convert {W}{U}{B}{R}{G} format to more readable
  return manaCost.replace(/\{([^}]+)\}/g, '[$1]')
}
