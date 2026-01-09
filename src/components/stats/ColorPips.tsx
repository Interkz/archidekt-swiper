import type { ColorDistribution } from '../../utils/deckStats'

interface ColorPipsProps {
  distribution: ColorDistribution
}

const COLOR_CONFIG = {
  W: { name: 'White', bg: '#f9faf4', border: '#a8a8a0' },
  U: { name: 'Blue', bg: '#0e67ab', border: '#0e67ab' },
  B: { name: 'Black', bg: '#170b13', border: '#170b13' },
  R: { name: 'Red', bg: '#d3202a', border: '#d3202a' },
  G: { name: 'Green', bg: '#00743f', border: '#00743f' },
  C: { name: 'Colorless', bg: '#ccc2c0', border: '#999' },
}

export default function ColorPips({ distribution }: ColorPipsProps) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-2">
      {(
        Object.entries(COLOR_CONFIG) as [
          keyof ColorDistribution,
          (typeof COLOR_CONFIG)['W'],
        ][]
      ).map(([key, config]) => {
        const count = distribution[key]
        const percent = total > 0 ? (count / total) * 100 : 0

        return (
          <div key={key} className="flex items-center gap-2">
            {/* Color pip */}
            <div
              className="w-4 h-4 rounded-full border-2 flex-shrink-0"
              style={{ backgroundColor: config.bg, borderColor: config.border }}
              title={config.name}
            />
            {/* Bar */}
            <div className="flex-1 h-3 bg-[var(--lumon-cream)] border border-[var(--grid-line)]">
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${percent}%`,
                  backgroundColor: config.border,
                  opacity: 0.7,
                }}
              />
            </div>
            {/* Count */}
            <span className="font-mono text-xs text-[var(--lumon-black)] w-6 text-right">
              {count}
            </span>
          </div>
        )
      })}
    </div>
  )
}
