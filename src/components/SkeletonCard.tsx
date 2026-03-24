export default function SkeletonCard() {
  return (
    <div className="relative w-full max-w-[350px] h-[550px] mx-auto perspective-1000">
      {/* Table surface indicator */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-[var(--grid-line)]" />

      {/* Contact shadow */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-8 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, var(--lumon-black) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Skeleton card */}
      <div className="absolute inset-0 card-shadow-lg">
        <div className="relative bg-surface overflow-hidden h-full">
          {/* Card border */}
          <div className="absolute inset-0 border border-[var(--lumon-black)]/10 pointer-events-none z-10" />

          {/* Card image skeleton */}
          <div className="skeleton-shimmer w-full" style={{ aspectRatio: '488/680' }} />

          {/* Card details skeleton */}
          <div className="p-3 space-y-2 border-t border-[var(--grid-line)]">
            {/* Name line */}
            <div className="skeleton-shimmer h-4 w-3/4" />
            {/* Type line */}
            <div className="skeleton-shimmer h-3 w-1/2" />
            {/* Category line */}
            <div className="skeleton-shimmer h-3 w-1/3" />
          </div>
        </div>
      </div>

      {/* Second card in stack (offset) */}
      <div
        className="absolute inset-0 card-shadow opacity-40"
        style={{ transform: 'translateY(4px) translateX(2px)', zIndex: -1, rotate: '0.5deg' }}
      >
        <div className="bg-surface overflow-hidden h-full border border-[var(--grid-line)]">
          <div className="skeleton-shimmer w-full h-full" />
        </div>
      </div>

      {/* Third card in stack (offset more) */}
      <div
        className="absolute inset-0 card-shadow opacity-40"
        style={{ transform: 'translateY(8px) translateX(4px)', zIndex: -2, rotate: '1deg' }}
      >
        <div className="bg-surface overflow-hidden h-full border border-[var(--grid-line)]">
          <div className="skeleton-shimmer w-full h-full" />
        </div>
      </div>
    </div>
  )
}
