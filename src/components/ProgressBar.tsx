interface ProgressBarProps {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? ((total - current) / total) * 100 : 0

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>{total - current} swiped</span>
        <span>{current} remaining</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
