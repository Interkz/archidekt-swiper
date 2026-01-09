interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? ((total - current) / total) * 100 : 0

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between text-sm text-slate-500 mb-2">
        <span className="font-medium">{total - current} swiped</span>
        <span className="font-medium">{current} remaining</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
