import { useMemo } from 'react'
import type { CubeCard } from '../../types/cube'
import type { NormalizedCard } from '../../types/archidekt'
import {
  computeManaCurve,
  computeColorDistribution,
  computeCategoryBreakdown,
  computeAverageCmc,
} from '../../utils/deckStats'
import ManaCurveChart from '../stats/ManaCurveChart'
import ColorPips from '../stats/ColorPips'
import CategoryStats from '../stats/CategoryStats'
import DeckSizeGauge from '../stats/DeckSizeGauge'

interface CubeStatsPanelProps {
  cards: CubeCard[]
  targetSize: number
  isOpen: boolean
  onToggle: () => void
}

function cubeCardToNormalized(card: CubeCard): NormalizedCard {
  return {
    id: card.id,
    name: card.name,
    manaCost: card.mana_cost,
    cmc: card.cmc,
    typeLine: card.type_line,
    scryfallId: card.scryfall_id,
    quantity: 1,
    categories: card.tags.length > 0 ? card.tags : [card.type_line.split(' ')[0]],
    setCode: card.set_code,
    colorIdentity: card.color_identity,
  }
}

export default function CubeStatsPanel({ cards, targetSize, isOpen, onToggle }: CubeStatsPanelProps) {
  const stats = useMemo(() => {
    const normalized = cards.map(cubeCardToNormalized)

    // Collect unique categories from the normalized cards
    const categorySet = new Set<string>()
    for (const card of normalized) {
      for (const cat of card.categories) {
        categorySet.add(cat)
      }
    }
    const uniqueCategories = Array.from(categorySet)

    return {
      total: cards.length,
      manaCurve: computeManaCurve(normalized),
      colorDistribution: computeColorDistribution(normalized),
      categoryBreakdown: computeCategoryBreakdown(normalized, uniqueCategories),
      averageCmc: computeAverageCmc(normalized),
    }
  }, [cards])

  return (
    <>
      {/* Toggle button — brass accent tab */}
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40
                   w-8 h-16 border-2 border-r-0 border-[var(--border-wood)]
                   wood-surface flex items-center justify-center rounded-l
                   hover:border-[var(--amber)] transition-colors"
        aria-label={isOpen ? 'Close stats panel' : 'Open stats panel'}
        style={{ right: isOpen ? '288px' : '0' }}
      >
        <svg
          className={`w-4 h-4 text-[var(--text-light)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Stats Panel Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-72 z-30
                    border-l-2 border-[var(--border-wood)]
                    wood-surface
                    transform transition-transform duration-300 ease-out
                    overflow-y-auto
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Panel Header */}
        <div className="border-b-2 border-[var(--border-wood)] p-4">
          <span className="text-terminal text-[var(--text-muted)]">
            CUBE ANALYSIS
          </span>
          <h2 className="font-display text-lg text-[var(--tavern-card)] mt-1">
            Live Statistics
          </h2>
        </div>

        <div className="p-4 space-y-6">
          {/* Cube Size Gauge */}
          <DeckSizeGauge current={stats.total} target={targetSize} />

          {/* Mana Curve */}
          <section>
            <h3 className="text-terminal text-[var(--text-muted)] mb-3">
              MANA CURVE
            </h3>
            <ManaCurveChart data={stats.manaCurve} />
            <p className="font-mono text-xs text-[var(--text-muted)] mt-2">
              AVG CMC: {stats.averageCmc.toFixed(2)}
            </p>
          </section>

          {/* Color Distribution */}
          <section>
            <h3 className="text-terminal text-[var(--text-muted)] mb-3">
              COLOR IDENTITY
            </h3>
            <ColorPips distribution={stats.colorDistribution} />
          </section>

          {/* Category Breakdown */}
          <section>
            <h3 className="text-terminal text-[var(--text-muted)] mb-3">
              BY CATEGORY
            </h3>
            <CategoryStats categories={stats.categoryBreakdown} />
          </section>
        </div>
      </aside>
    </>
  )
}
