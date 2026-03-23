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
            {/* Bar — amber gradient on dark surface */}
            <div className="w-full flex flex-col justify-end h-16">
              <div
                className="w-full rounded-t border border-[var(--border-brass)] transition-all duration-300"
                style={{
                  height: `${heightPercent}%`,
                  minHeight: bucket.count > 0 ? '4px' : '0',
                  background: bucket.count > 0
                    ? 'linear-gradient(180deg, var(--amber-light) 0%, var(--amber) 100%)'
                    : 'transparent',
                  borderColor: bucket.count > 0 ? 'var(--border-brass)' : 'transparent',
                }}
              />
            </div>
            {/* Count label */}
            <span className="font-mono text-[10px] text-[var(--text-light)] mt-1">
              {bucket.count > 0 ? bucket.count : ''}
            </span>
            {/* CMC label */}
            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
