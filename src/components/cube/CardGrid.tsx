import type { CubeCard } from '../../types/cube'
import './CardGrid.css'

interface CardGridProps {
  cards: CubeCard[]
}

export default function CardGrid({ cards }: CardGridProps) {
  return (
    <div className="cube-felt">
      {/* Bottom-left and bottom-right rivets (top rivets via ::before/::after) */}
      <div className="cube-rivet cube-rivet-bl" />
      <div className="cube-rivet cube-rivet-br" />

      <div className="cube-grid">
        {cards.map((card) => (
          <div key={card.id} className="cube-card">
            <div className="cube-card-inner">
              <img
                src={card.image_uri}
                alt={card.name}
                loading="lazy"
                draggable={false}
              />
              <div className="cube-card-label">{card.name}</div>
            </div>
          </div>
        ))}
      </div>

      {cards.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <p className="font-mono text-sm text-[var(--text-muted)] uppercase tracking-wider">
            No cards match filters
          </p>
        </div>
      )}
    </div>
  )
}
