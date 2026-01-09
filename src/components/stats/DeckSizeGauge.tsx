interface DeckSizeGaugeProps {
  current: number
  target: number
}

export default function DeckSizeGauge({ current, target }: DeckSizeGaugeProps) {
  const percent = Math.min((current / target) * 100, 100)
  const isOver = current > target
  const formatNum = (n: number) => n.toString().padStart(3, '0')

  return (
    <div className="border-2 border-[var(--lumon-black)] p-4">
      {/* Big numbers display */}
      <div className="flex items-baseline justify-center gap-1 mb-3">
        <span
          className={`font-mono text-3xl font-bold ${
            isOver ? 'text-[#8b5a2b]' : 'text-[var(--lumon-green)]'
          }`}
        >
          {formatNum(current)}
        </span>
        <span className="font-mono text-lg text-[var(--status-neutral)]">/</span>
        <span className="font-mono text-lg text-[var(--lumon-black)]">
          {formatNum(target)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-[var(--lumon-cream)] border border-[var(--grid-line)]">
        <div
          className={`h-full transition-all duration-300 ${
            isOver ? 'bg-[#8b5a2b]' : 'bg-[var(--lumon-green)]'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Status */}
      <p className="font-mono text-xs text-center mt-2 text-[var(--status-neutral)]">
        {isOver
          ? `${current - target} OVER TARGET`
          : current === target
            ? 'TARGET REACHED'
            : `${target - current} TO TARGET`}
      </p>
    </div>
  )
}
