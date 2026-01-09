interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const swiped = total - current
  const progress = total > 0 ? (swiped / total) * 100 : 0

  // Format numbers with leading zeros for that terminal look
  const formatNumber = (n: number) => n.toString().padStart(3, '0')

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Terminal-style header */}
      <div className="flex justify-between items-baseline mb-3">
        <span className="text-terminal text-[var(--status-neutral)]">DECK PROGRESS</span>
        <span className="font-mono text-sm text-[var(--lumon-black)]">
          {formatNumber(swiped)} / {formatNumber(total)}
        </span>
      </div>

      {/* Ledger-style progress bar */}
      <div className="progress-ledger">
        <div
          className="progress-ledger-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status line */}
      <div className="flex justify-between mt-2">
        <span className="font-mono text-xs text-[var(--status-neutral)]">
          {formatNumber(swiped)} PROCESSED
        </span>
        <span className="font-mono text-xs text-[var(--lumon-green)]">
          {formatNumber(current)} REMAINING
        </span>
      </div>
    </div>
  )
}
