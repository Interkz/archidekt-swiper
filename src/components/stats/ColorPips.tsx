import type { ColorDistribution } from '../../utils/deckStats'
import { useSettingsStore } from '../../stores/settingsStore'

interface ColorPipsProps {
  distribution: ColorDistribution
}

// Standard MTG color config with colorblind-friendly patterns
const COLOR_CONFIG = {
  W: {
    name: 'White',
    symbol: 'W',
    bg: '#f9faf4',
    border: '#a8a8a0',
    // Colorblind: sun/light symbol
    cbBg: '#f9faf4',
    cbBorder: '#666',
    pattern: 'radial', // Circle/dot pattern
  },
  U: {
    name: 'Blue',
    symbol: 'U',
    bg: '#0e67ab',
    border: '#0e67ab',
    cbBg: '#0e67ab',
    cbBorder: '#0e67ab',
    pattern: 'horizontal', // Horizontal lines (water)
  },
  B: {
    name: 'Black',
    symbol: 'B',
    bg: '#170b13',
    border: '#170b13',
    cbBg: '#170b13',
    cbBorder: '#170b13',
    pattern: 'solid', // Solid fill (darkness)
  },
  R: {
    name: 'Red',
    symbol: 'R',
    bg: '#d3202a',
    border: '#d3202a',
    cbBg: '#d3202a',
    cbBorder: '#d3202a',
    pattern: 'diagonal', // Diagonal lines (fire/lightning)
  },
  G: {
    name: 'Green',
    symbol: 'G',
    bg: '#00743f',
    border: '#00743f',
    cbBg: '#00743f',
    cbBorder: '#00743f',
    pattern: 'crosshatch', // Crosshatch (forest/nature)
  },
  C: {
    name: 'Colorless',
    symbol: 'C',
    bg: '#ccc2c0',
    border: '#999',
    cbBg: '#ccc2c0',
    cbBorder: '#999',
    pattern: 'empty', // Empty/outline only
  },
}

// SVG pattern definitions for colorblind mode
function ColorblindPatterns() {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        {/* Horizontal lines pattern (Blue) */}
        <pattern id="cb-horizontal" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="white" />
          <line x1="0" y1="1" x2="6" y2="1" stroke="#0e67ab" strokeWidth="2" />
          <line x1="0" y1="4" x2="6" y2="4" stroke="#0e67ab" strokeWidth="2" />
        </pattern>
        {/* Diagonal lines pattern (Red) */}
        <pattern id="cb-diagonal" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="white" />
          <line x1="0" y1="0" x2="6" y2="0" stroke="#d3202a" strokeWidth="2" />
        </pattern>
        {/* Crosshatch pattern (Green) */}
        <pattern id="cb-crosshatch" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="white" />
          <line x1="0" y1="3" x2="6" y2="3" stroke="#00743f" strokeWidth="1.5" />
          <line x1="3" y1="0" x2="3" y2="6" stroke="#00743f" strokeWidth="1.5" />
        </pattern>
        {/* Dot pattern (White) */}
        <pattern id="cb-radial" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#f9faf4" />
          <circle cx="3" cy="3" r="1.5" fill="#666" />
        </pattern>
        {/* Solid pattern (Black) */}
        <pattern id="cb-solid" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#170b13" />
        </pattern>
        {/* Empty / outline pattern (Colorless) */}
        <pattern id="cb-empty" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#e8e8e4" />
        </pattern>

        {/* Bar fill patterns */}
        <pattern id="cb-bar-horizontal" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#0e67ab" fillOpacity="0.15" />
          <line x1="0" y1="1" x2="6" y2="1" stroke="#0e67ab" strokeWidth="1.5" />
          <line x1="0" y1="4" x2="6" y2="4" stroke="#0e67ab" strokeWidth="1.5" />
        </pattern>
        <pattern id="cb-bar-diagonal" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="#d3202a" fillOpacity="0.15" />
          <line x1="0" y1="0" x2="6" y2="0" stroke="#d3202a" strokeWidth="1.5" />
        </pattern>
        <pattern id="cb-bar-crosshatch" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#00743f" fillOpacity="0.15" />
          <line x1="0" y1="3" x2="6" y2="3" stroke="#00743f" strokeWidth="1" />
          <line x1="3" y1="0" x2="3" y2="6" stroke="#00743f" strokeWidth="1" />
        </pattern>
        <pattern id="cb-bar-radial" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#a8a8a0" fillOpacity="0.3" />
          <circle cx="3" cy="3" r="1.5" fill="#666" fillOpacity="0.5" />
        </pattern>
        <pattern id="cb-bar-solid" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#170b13" fillOpacity="0.7" />
        </pattern>
        <pattern id="cb-bar-empty" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#ccc2c0" fillOpacity="0.5" />
        </pattern>
      </defs>
    </svg>
  )
}

export default function ColorPips({ distribution }: ColorPipsProps) {
  const colorblindMode = useSettingsStore((s) => s.colorblindMode)
  const total = Object.values(distribution).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-2">
      {colorblindMode && <ColorblindPatterns />}
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
            {colorblindMode ? (
              <div className="flex items-center gap-1 flex-shrink-0">
                <svg width="16" height="16" className="flex-shrink-0">
                  <circle
                    cx="8" cy="8" r="6"
                    fill={`url(#cb-${config.pattern})`}
                    stroke={config.cbBorder}
                    strokeWidth="2"
                  />
                </svg>
                <span className="font-mono text-[10px] font-bold text-[var(--lumon-black)] w-3">
                  {config.symbol}
                </span>
              </div>
            ) : (
              <div
                className="w-4 h-4 rounded-full border-2 flex-shrink-0"
                style={{ backgroundColor: config.bg, borderColor: config.border }}
                title={config.name}
              />
            )}
            {/* Bar */}
            {colorblindMode ? (
              <div className="flex-1 h-3 bg-[var(--lumon-cream)] border border-[var(--grid-line)] overflow-hidden">
                <svg width="100%" height="100%" preserveAspectRatio="none">
                  <rect
                    width={`${percent}%`}
                    height="100%"
                    fill={`url(#cb-bar-${config.pattern})`}
                    className="transition-all duration-300"
                  />
                </svg>
              </div>
            ) : (
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
            )}
            {/* Count + name */}
            {colorblindMode ? (
              <span className="font-mono text-xs text-[var(--lumon-black)] w-14 text-right">
                {count} <span className="text-[var(--status-neutral)] text-[10px]">{config.name.substring(0, 2).toUpperCase()}</span>
              </span>
            ) : (
              <span className="font-mono text-xs text-[var(--lumon-black)] w-6 text-right">
                {count}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
