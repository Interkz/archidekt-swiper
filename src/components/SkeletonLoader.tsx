export default function SkeletonLoader() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 py-8">
      {/* Header skeleton */}
      <div className="w-full flex items-center justify-between px-4">
        <div className="skeleton-shimmer h-4 w-16" />
        <div className="flex gap-2">
          <div className="skeleton-shimmer h-8 w-20 border border-[var(--grid-line)]" />
          <div className="skeleton-shimmer h-8 w-20 border border-[var(--grid-line)]" />
        </div>
        <div className="skeleton-shimmer h-4 w-24" />
      </div>

      {/* Deck info bar skeleton */}
      <div className="w-full border-y border-[var(--grid-line)] py-3 px-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="skeleton-shimmer h-3 w-20 mb-2" />
            <div className="skeleton-shimmer h-5 w-40" />
          </div>
          <div className="text-right">
            <div className="skeleton-shimmer h-3 w-14 mb-2 ml-auto" />
            <div className="skeleton-shimmer h-4 w-20 ml-auto" />
          </div>
        </div>
      </div>

      {/* Progress bar skeleton */}
      <div className="w-full max-w-md px-4">
        <div className="flex justify-between mb-2">
          <div className="skeleton-shimmer h-3 w-12" />
          <div className="skeleton-shimmer h-3 w-16" />
        </div>
        <div className="skeleton-shimmer h-2 w-full border border-[var(--grid-line)]" />
      </div>

      {/* Main content area */}
      <div className="flex gap-8 items-start px-4">
        {/* Skeleton card - matches CardStack 350x490 (card aspect ratio ~5:7) */}
        <div
          className="skeleton-shimmer border border-[var(--grid-line)] card-shadow flex-shrink-0"
          style={{ width: 350, height: 490, borderRadius: 0 }}
        />

        {/* Sidebar skeleton - 3 list items */}
        <div className="hidden sm:flex flex-col gap-4 w-48">
          <div className="skeleton-shimmer h-3 w-24 mb-1" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="border border-[var(--grid-line)] p-3">
              <div className="skeleton-shimmer h-3 w-20 mb-2" />
              <div className="skeleton-shimmer h-5 w-full" />
              <div className="skeleton-shimmer h-2 w-3/4 mt-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Controls skeleton */}
      <div className="flex gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="skeleton-shimmer border border-[var(--grid-line)]"
            style={{ width: 56, height: 56 }}
          />
        ))}
      </div>

      {/* Loading status text */}
      <p className="text-terminal text-[var(--status-neutral)] tracking-widest animate-pulse">
        LOADING DECK DATA...
      </p>
    </div>
  )
}
