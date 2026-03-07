interface ManaFilterProps {
  activeCmcValues: Set<number>
  onToggle: (cmc: number) => void
  onReset: () => void
  matchCount: number
  totalCount: number
  isFiltering: boolean
}

const CMC_VALUES = [0, 1, 2, 3, 4, 5, 6, 7] // 7 = "7+"

export default function ManaFilter({
  activeCmcValues,
  onToggle,
  onReset,
  matchCount,
  totalCount,
  isFiltering,
}: ManaFilterProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
        {/* All button */}
        <button
          onClick={onReset}
          className={`px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider border-2 border-[var(--lumon-black)]
                     transition-all duration-150 ${
            !isFiltering
              ? 'bg-[var(--lumon-black)] text-[var(--lumon-white)]'
              : 'bg-transparent text-[var(--lumon-black)] hover:bg-[var(--lumon-cream)]'
          }`}
        >
          All
        </button>

        {/* CMC buttons */}
        {CMC_VALUES.map((cmc) => (
          <button
            key={cmc}
            onClick={() => onToggle(cmc)}
            className={`w-9 h-9 font-mono text-xs font-semibold border-2 border-[var(--lumon-black)]
                       transition-all duration-150 flex items-center justify-center ${
              activeCmcValues.has(cmc)
                ? 'bg-[var(--lumon-black)] text-[var(--lumon-white)]'
                : 'bg-transparent text-[var(--lumon-black)] hover:bg-[var(--lumon-cream)]'
            }`}
          >
            {cmc === 7 ? '7+' : cmc}
          </button>
        ))}
      </div>

      {/* Match count when filtering */}
      {isFiltering && (
        <p className="text-center font-mono text-xs text-[var(--status-neutral)] mt-2 uppercase tracking-wider">
          {matchCount.toString().padStart(3, '0')}/{totalCount.toString().padStart(3, '0')} matching
        </p>
      )}
    </div>
  )
}
