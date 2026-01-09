import type { NormalizedCard } from '../types/archidekt'

interface CardDetailsProps {
  card: NormalizedCard
}

export default function CardDetails({ card }: CardDetailsProps) {
  return (
    <div className="mt-4 text-center">
      <h2 className="text-xl font-semibold text-slate-800">{card.name}</h2>
      <div className="flex items-center justify-center gap-2 mt-1">
        {card.manaCost && (
          <span className="text-slate-600 font-mono text-sm bg-slate-100 px-2 py-0.5 rounded-md">
            {formatManaCost(card.manaCost)}
          </span>
        )}
      </div>
      <p className="text-slate-500 text-sm mt-1">{card.typeLine}</p>
    </div>
  )
}

function formatManaCost(manaCost: string): string {
  // Convert {W}{U}{B}{R}{G} format to more readable
  return manaCost.replace(/\{([^}]+)\}/g, '[$1]')
}
