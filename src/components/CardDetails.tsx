import type { NormalizedCard } from '../types/archidekt'

interface CardDetailsProps {
  card: NormalizedCard
}

export default function CardDetails({ card }: CardDetailsProps) {
  return (
    <div className="mt-6 text-center">
      {/* Card name - clinical typography */}
      <h2 className="font-display text-xl tracking-tight text-[var(--lumon-black)]">
        {card.name}
      </h2>

      {/* Mana cost - monospace terminal style */}
      {card.manaCost && (
        <div className="mt-2">
          <span className="font-mono text-sm text-[var(--lumon-green)] bg-[var(--lumon-green-pale)] px-3 py-1 border border-[var(--lumon-green)]/20">
            {formatManaCost(card.manaCost)}
          </span>
        </div>
      )}

      {/* Type line - subdued */}
      <p className="mt-2 font-mono text-xs uppercase tracking-wider text-[var(--status-neutral)]">
        {card.typeLine}
      </p>

      {/* Category badge if present */}
      {card.categories && card.categories.length > 0 && (
        <p className="mt-1 text-terminal text-[var(--status-neutral)]">
          // {card.categories[0]}
        </p>
      )}
    </div>
  )
}

function formatManaCost(manaCost: string): string {
  // Convert {W}{U}{B}{R}{G} format to more readable
  return manaCost.replace(/\{([^}]+)\}/g, '[$1]')
}
