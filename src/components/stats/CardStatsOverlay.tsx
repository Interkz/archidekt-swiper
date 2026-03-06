import { useMemo } from 'react'
import { useDeckStore } from '../../stores/deckStore'
import {
  computeManaCurve,
  computeColorDistribution,
  computeAverageCmc,
  computeTotalCards,
} from '../../utils/deckStats'

const COLOR_CONFIG = {
  W: { label: 'W', bg: '#f9faf4', border: '#a8a8a0' },
  U: { label: 'U', bg: '#0e67ab', border: '#0e67ab' },
  B: { label: 'B', bg: '#170b13', border: '#170b13' },
  R: { label: 'R', bg: '#d3202a', border: '#d3202a' },
  G: { label: 'G', bg: '#00743f', border: '#00743f' },
  C: { label: 'C', bg: '#ccc2c0', border: '#999' },
} as const

interface CardStatsOverlayProps {
  isOpen: boolean
  onToggle: () => void
}

export default function CardStatsOverlay({ isOpen, onToggle }: CardStatsOverlayProps) {
  const keptCards = useDeckStore((state) => state.keptCards)

  const stats = useMemo(
    () => ({
      total: computeTotalCards(keptCards),
      manaCurve: computeManaCurve(keptCards),
      colorDistribution: computeColorDistribution(keptCards),
      avgCmc: computeAverageCmc(keptCards),
    }),
    [keptCards]
  )

  const maxCurveCount = Math.max(...stats.manaCurve.map((d) => d.count), 1)
  const totalPips = Object.values(stats.colorDistribution).reduce((a, b) => a + b, 0)

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 transition-transform duration-300 ease-out"
      style={{ transform: isOpen ? 'translateY(0)' : 'translateY(calc(100% - 32px))' }}
    >
      {/* Toggle tab */}
      <button
        onClick={onToggle}
        className="mx-auto flex items-center gap-1.5 px-4 py-1.5
                   bg-[var(--lumon-black)] text-[var(--lumon-white)]
                   font-mono text-[10px] font-semibold uppercase tracking-widest
                   border-2 border-b-0 border-[var(--lumon-black)]
                   hover:bg-[var(--lumon-green)] transition-colors"
      >
        <svg
          className={`w-3 h-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="square" d="M5 15l7-7 7 7" />
        </svg>
        STATS
      </button>

      {/* Panel body */}
      <div className="bg-[var(--lumon-black)]/95 backdrop-blur-sm border-t-2 border-[var(--lumon-green)] p-4">
        {/* Header row: total cards + avg CMC */}
        <div className="flex justify-between items-baseline mb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--lumon-green)]/70">
              Kept
            </span>
            <p className="font-mono text-2xl font-bold text-[var(--lumon-white)]">
              {stats.total.toString().padStart(3, '0')}
            </p>
          </div>
          <div className="text-right">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--lumon-green)]/70">
              Avg CMC
            </span>
            <p className="font-mono text-2xl font-bold text-[var(--lumon-white)]">
              {stats.avgCmc.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Mana Curve - CSS bar chart */}
        <div className="mb-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--lumon-green)]/70 mb-2">
            Mana Curve
          </p>
          <div className="flex items-end gap-1 h-16">
            {stats.manaCurve.map((bucket) => {
              const heightPercent = (bucket.count / maxCurveCount) * 100
              const label = bucket.cmc === 7 ? '7+' : String(bucket.cmc)

              return (
                <div key={bucket.cmc} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col justify-end h-10">
                    <div
                      className="w-full bg-[var(--lumon-green)] transition-all duration-300"
                      style={{
                        height: `${heightPercent}%`,
                        minHeight: bucket.count > 0 ? '3px' : '0',
                      }}
                    />
                  </div>
                  {bucket.count > 0 && (
                    <span className="font-mono text-[9px] text-[var(--lumon-white)]/80 mt-0.5">
                      {bucket.count}
                    </span>
                  )}
                  <span className="font-mono text-[9px] text-[var(--lumon-green)]/60">
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Color Distribution */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--lumon-green)]/70 mb-2">
            Colors
          </p>
          <div className="flex gap-2">
            {(Object.entries(COLOR_CONFIG) as [keyof typeof COLOR_CONFIG, typeof COLOR_CONFIG['W']][]).map(
              ([key, config]) => {
                const count = stats.colorDistribution[key]
                const percent = totalPips > 0 ? (count / totalPips) * 100 : 0

                return (
                  <div key={key} className="flex-1 flex flex-col items-center gap-1">
                    {/* Pip */}
                    <div
                      className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                      style={{ backgroundColor: config.bg, borderColor: config.border }}
                    />
                    {/* Vertical bar */}
                    <div className="w-full h-8 bg-[var(--lumon-white)]/10 relative">
                      <div
                        className="absolute bottom-0 left-0 right-0 transition-all duration-300"
                        style={{
                          height: `${percent}%`,
                          backgroundColor: config.border,
                          opacity: 0.8,
                          minHeight: count > 0 ? '2px' : '0',
                        }}
                      />
                    </div>
                    {/* Count */}
                    <span className="font-mono text-[9px] text-[var(--lumon-white)]/70">
                      {count > 0 ? count : '-'}
                    </span>
                  </div>
                )
              }
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
