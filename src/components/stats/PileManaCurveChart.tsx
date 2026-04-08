import type { NormalizedCard } from '../../types/archidekt'
import { computeManaCurve } from '../../utils/deckStats'

interface PileManaCurveChartProps {
  keptCards: NormalizedCard[]
  removedCards: NormalizedCard[]
  maybeCards: NormalizedCard[]
}

export default function PileManaCurveChart({ keptCards, removedCards, maybeCards }: PileManaCurveChartProps) {
  const keptCurve = computeManaCurve(keptCards)
  const removedCurve = computeManaCurve(removedCards)
  const maybeCurve = computeManaCurve(maybeCards)

  const hasMaybe = maybeCards.length > 0

  const maxCount = Math.max(
    ...keptCurve.map((d) => d.count),
    ...removedCurve.map((d) => d.count),
    ...maybeCurve.map((d) => d.count),
    1
  )

  // Y-axis: ~5 ticks from 0 to maxCount
  const tickCount = Math.min(maxCount, 5)
  const tickStep = maxCount <= 5 ? 1 : Math.ceil(maxCount / 5)
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => i * tickStep).filter((v) => v <= maxCount)
  // Always include maxCount if not already there
  if (yTicks[yTicks.length - 1] !== maxCount) {
    yTicks.push(maxCount)
  }

  return (
    <div className="mb-6">
      <div className="text-terminal text-[var(--status-neutral)] mb-3">MANA CURVE BY PILE</div>
      <div className="border-2 border-[var(--lumon-black)] p-4">
        {/* Chart area using CSS grid */}
        <div
          className="grid gap-0"
          style={{
            gridTemplateColumns: '2rem repeat(8, 1fr)',
            gridTemplateRows: '1fr auto',
          }}
        >
          {/* Y-axis + bars area */}
          <div className="relative flex flex-col justify-between items-end pr-2" style={{ height: '8rem' }}>
            {[...yTicks].reverse().map((tick) => (
              <span key={tick} className="font-mono text-[10px] text-[var(--status-neutral)] leading-none">
                {tick}
              </span>
            ))}
          </div>

          {/* Bar groups for each CMC bucket */}
          {Array.from({ length: 8 }, (_, cmc) => {
            const kept = keptCurve[cmc].count
            const removed = removedCurve[cmc].count
            const maybe = maybeCurve[cmc].count

            return (
              <div key={cmc} className="flex items-end justify-center gap-px" style={{ height: '8rem' }}>
                {/* Kept bar */}
                <div
                  className="transition-all duration-300"
                  style={{
                    width: hasMaybe ? '28%' : '40%',
                    height: kept > 0 ? `${Math.max((kept / maxCount) * 100, 3)}%` : '0',
                    backgroundColor: 'var(--lumon-green)',
                  }}
                  title={`Accepted: ${kept}`}
                />
                {/* Removed bar */}
                <div
                  className="transition-all duration-300"
                  style={{
                    width: hasMaybe ? '28%' : '40%',
                    height: removed > 0 ? `${Math.max((removed / maxCount) * 100, 3)}%` : '0',
                    backgroundColor: 'var(--lumon-black)',
                  }}
                  title={`Rejected: ${removed}`}
                />
                {/* Maybe bar (only if there are maybe cards) */}
                {hasMaybe && (
                  <div
                    className="transition-all duration-300"
                    style={{
                      width: '28%',
                      height: maybe > 0 ? `${Math.max((maybe / maxCount) * 100, 3)}%` : '0',
                      backgroundColor: '#8b5a2b',
                    }}
                    title={`Deferred: ${maybe}`}
                  />
                )}
              </div>
            )
          })}

          {/* Empty cell under Y-axis */}
          <div />

          {/* X-axis labels */}
          {Array.from({ length: 8 }, (_, cmc) => (
            <div key={cmc} className="text-center pt-1">
              <span className="font-mono text-[10px] text-[var(--status-neutral)]">
                {cmc === 7 ? '7+' : cmc}
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-3 pt-3 border-t border-[var(--grid-line)]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3" style={{ backgroundColor: 'var(--lumon-green)' }} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--status-neutral)]">
              Accepted ({keptCards.length})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3" style={{ backgroundColor: 'var(--lumon-black)' }} />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--status-neutral)]">
              Rejected ({removedCards.length})
            </span>
          </div>
          {hasMaybe && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3" style={{ backgroundColor: '#8b5a2b' }} />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--status-neutral)]">
                Deferred ({maybeCards.length})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
