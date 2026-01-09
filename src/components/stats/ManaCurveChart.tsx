import type { ManaCurveData } from '../../utils/deckStats'

interface ManaCurveChartProps {
  data: ManaCurveData[]
}

export default function ManaCurveChart({ data }: ManaCurveChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((bucket) => {
        const heightPercent = (bucket.count / maxCount) * 100
        const label = bucket.cmc === 7 ? '7+' : String(bucket.cmc)

        return (
          <div key={bucket.cmc} className="flex-1 flex flex-col items-center">
            {/* Bar */}
            <div className="w-full flex flex-col justify-end h-16">
              <div
                className="w-full bg-[var(--lumon-green)] border border-[var(--lumon-black)] transition-all duration-300"
                style={{
                  height: `${heightPercent}%`,
                  minHeight: bucket.count > 0 ? '4px' : '0',
                }}
              />
            </div>
            {/* Count label */}
            <span className="font-mono text-[10px] text-[var(--lumon-black)] mt-1">
              {bucket.count > 0 ? bucket.count : ''}
            </span>
            {/* CMC label */}
            <span className="font-mono text-[10px] text-[var(--status-neutral)]">
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
