import { useMemo } from 'react'
import { computeColorDistribution, type ColorDistribution } from '../../utils/deckStats'
import type { NormalizedCard } from '../../types/archidekt'

interface ColorIdentityBreakdownProps {
  keptCards: NormalizedCard[]
  removedCards: NormalizedCard[]
  maybeCards: NormalizedCard[]
}

const COLOR_CONFIG: Record<keyof ColorDistribution, { label: string; bg: string; border: string }> = {
  W: { label: 'White', bg: '#f9faf4', border: '#a8a8a0' },
  U: { label: 'Blue', bg: '#0e67ab', border: '#0e67ab' },
  B: { label: 'Black', bg: '#170b13', border: '#170b13' },
  R: { label: 'Red', bg: '#d3202a', border: '#d3202a' },
  G: { label: 'Green', bg: '#00743f', border: '#00743f' },
  C: { label: 'Colorless', bg: '#ccc2c0', border: '#999' },
}

const COLOR_KEYS: (keyof ColorDistribution)[] = ['W', 'U', 'B', 'R', 'G', 'C']

function getTotal(dist: ColorDistribution): number {
  return Object.values(dist).reduce((a, b) => a + b, 0)
}

function formatPercent(count: number, total: number): string {
  if (total === 0) return '0%'
  return `${Math.round((count / total) * 100)}%`
}

function buildConicGradient(dist: ColorDistribution): string {
  const total = getTotal(dist)
  if (total === 0) return 'conic-gradient(var(--lumon-cream) 0deg 360deg)'

  const segments: string[] = []
  let angle = 0

  for (const key of COLOR_KEYS) {
    const count = dist[key]
    if (count === 0) continue
    const slice = (count / total) * 360
    const color = COLOR_CONFIG[key].border
    segments.push(`${color} ${angle}deg ${angle + slice}deg`)
    angle += slice
  }

  return `conic-gradient(${segments.join(', ')})`
}

export default function ColorIdentityBreakdown({
  keptCards,
  removedCards,
  maybeCards,
}: ColorIdentityBreakdownProps) {
  const keptDist = useMemo(() => computeColorDistribution(keptCards), [keptCards])
  const removedDist = useMemo(() => computeColorDistribution(removedCards), [removedCards])
  const maybeDist = useMemo(() => computeColorDistribution(maybeCards), [maybeCards])

  const keptTotal = getTotal(keptDist)
  const removedTotal = getTotal(removedDist)
  const maybeTotal = getTotal(maybeDist)
  const hasMaybes = maybeTotal > 0

  const gradient = buildConicGradient(keptDist)

  return (
    <div>
      <div className="text-terminal text-[var(--status-neutral)] mb-3">COLOR IDENTITY</div>

      {/* Pie chart + legend */}
      <div className="flex items-center gap-6 mb-6">
        {/* Conic-gradient pie chart */}
        <div
          className="w-24 h-24 rounded-full border-2 border-[var(--lumon-black)] flex-shrink-0"
          style={{ background: gradient }}
          aria-label="Color identity pie chart for kept cards"
        />

        {/* Legend */}
        <div className="space-y-1.5">
          {COLOR_KEYS.map((key) => {
            const count = keptDist[key]
            if (count === 0) return null
            return (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full border flex-shrink-0"
                  style={{ backgroundColor: COLOR_CONFIG[key].bg, borderColor: COLOR_CONFIG[key].border }}
                />
                <span className="font-mono text-xs text-[var(--lumon-black)]">
                  {COLOR_CONFIG[key].label}
                </span>
                <span className="font-mono text-xs text-[var(--status-neutral)]">
                  {count} ({formatPercent(count, keptTotal)})
                </span>
              </div>
            )
          })}
          {keptTotal === 0 && (
            <span className="font-mono text-xs text-[var(--status-neutral)]">NO DATA</span>
          )}
        </div>
      </div>

      {/* Per-pile breakdown table */}
      <div className="border-2 border-[var(--lumon-black)]">
        {/* Header row */}
        <div className={`grid ${hasMaybes ? 'grid-cols-4' : 'grid-cols-3'} border-b-2 border-[var(--lumon-black)] bg-[var(--lumon-cream)]`}>
          <div className="p-2 font-mono text-xs font-bold uppercase tracking-wider text-center border-r border-[var(--grid-line)]">
            Color
          </div>
          <div className="p-2 font-mono text-xs font-bold uppercase tracking-wider text-center border-r border-[var(--grid-line)]">
            Kept
          </div>
          <div className={`p-2 font-mono text-xs font-bold uppercase tracking-wider text-center ${hasMaybes ? 'border-r border-[var(--grid-line)]' : ''}`}>
            Cut
          </div>
          {hasMaybes && (
            <div className="p-2 font-mono text-xs font-bold uppercase tracking-wider text-center">
              Maybe
            </div>
          )}
        </div>

        {/* Color rows */}
        {COLOR_KEYS.map((key) => {
          const kept = keptDist[key]
          const removed = removedDist[key]
          const maybe = maybeDist[key]
          if (kept === 0 && removed === 0 && maybe === 0) return null

          return (
            <div
              key={key}
              className={`grid ${hasMaybes ? 'grid-cols-4' : 'grid-cols-3'} border-b border-[var(--grid-line)] last:border-b-0`}
            >
              {/* Color pip + label */}
              <div className="p-2 flex items-center gap-2 border-r border-[var(--grid-line)]">
                <div
                  className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                  style={{ backgroundColor: COLOR_CONFIG[key].bg, borderColor: COLOR_CONFIG[key].border }}
                />
                <span className="font-mono text-xs font-bold text-[var(--lumon-black)]">{key}</span>
              </div>

              {/* Kept count + percent */}
              <div className="p-2 text-center border-r border-[var(--grid-line)]">
                <span className="font-mono text-xs text-[var(--lumon-green)]">
                  {kept}
                </span>
                <span className="font-mono text-xs text-[var(--status-neutral)] ml-1">
                  {formatPercent(kept, keptTotal)}
                </span>
              </div>

              {/* Removed count + percent */}
              <div className={`p-2 text-center ${hasMaybes ? 'border-r border-[var(--grid-line)]' : ''}`}>
                <span className="font-mono text-xs text-[var(--lumon-black)]">
                  {removed}
                </span>
                <span className="font-mono text-xs text-[var(--status-neutral)] ml-1">
                  {formatPercent(removed, removedTotal)}
                </span>
              </div>

              {/* Maybe count + percent */}
              {hasMaybes && (
                <div className="p-2 text-center">
                  <span className="font-mono text-xs text-[#8b5a2b]">
                    {maybe}
                  </span>
                  <span className="font-mono text-xs text-[var(--status-neutral)] ml-1">
                    {formatPercent(maybe, maybeTotal)}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
