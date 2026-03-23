interface DeckSizeGaugeProps {
  current: number
  target: number
}

export default function DeckSizeGauge({ current, target }: DeckSizeGaugeProps) {
  const percent = Math.min((current / target) * 100, 100)
  const isOver = current > target
  const formatNum = (n: number) => n.toString().padStart(3, '0')

  return (
    <div className="border-2 border-[var(--border-wood)] rounded p-4">
      {/* Big numbers display */}
      <div className="flex items-baseline justify-center gap-1 mb-3">
        <span
          className={`font-mono text-3xl font-bold ${
            isOver ? 'text-[var(--deferred)]' : 'text-[var(--amber)]'
          }`}
        >
          {formatNum(current)}
        </span>
        <span className="font-mono text-lg text-[var(--text-muted)]">/</span>
        <span className="font-mono text-lg text-[var(--text-light)]">
          {formatNum(target)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-[var(--tavern-sunken)] border border-[var(--border-wood)] rounded">
        <div
          className={`h-full rounded transition-all duration-300 ${
            isOver ? 'bg-[var(--deferred)]' : ''
          }`}
          style={{
            width: `${percent}%`,
            background: isOver ? undefined : 'linear-gradient(90deg, var(--amber) 0%, var(--gold) 100%)',
          }}
        />
      </div>

      {/* Status */}
      <p className="font-mono text-xs text-center mt-2 text-[var(--text-muted)]">
        {isOver
          ? `${current - target} OVER TARGET`
          : current === target
            ? 'TARGET REACHED'
            : `${target - current} TO TARGET`}
      </p>
    </div>
  )
}
