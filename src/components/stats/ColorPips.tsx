import type { ColorDistribution } from '../../utils/deckStats'
import { useSettingsStore } from '../../stores/settingsStore'

interface ColorPipsProps {
  distribution: ColorDistribution
}

// MTG color config — warmed up gem-like tones
const COLOR_CONFIG = {
  W: {
    name: 'White',
    symbol: 'W',
    bg: '#f9f3e3',
    border: '#c4b99a',
    cbBg: '#f9f3e3',
    cbBorder: '#8c7e72',
    pattern: 'radial',
  },
  U: {
    name: 'Blue',
    symbol: 'U',
    bg: '#1a6fb5',
    border: '#1a6fb5',
    cbBg: '#1a6fb5',
    cbBorder: '#1a6fb5',
    pattern: 'horizontal',
  },
  B: {
    name: 'Black',
    symbol: 'B',
    bg: '#2a1f2d',
    border: '#2a1f2d',
    cbBg: '#2a1f2d',
    cbBorder: '#2a1f2d',
    pattern: 'solid',
  },
  R: {
    name: 'Red',
    symbol: 'R',
    bg: '#c44536',
    border: '#c44536',
    cbBg: '#c44536',
    cbBorder: '#c44536',
    pattern: 'diagonal',
  },
  G: {
    name: 'Green',
    symbol: 'G',
    bg: '#2d6a4f',
    border: '#2d6a4f',
    cbBg: '#2d6a4f',
    cbBorder: '#2d6a4f',
    pattern: 'crosshatch',
  },
  C: {
    name: 'Colorless',
    symbol: 'C',
    bg: '#8c7e72',
    border: '#6b5e52',
    cbBg: '#8c7e72',
    cbBorder: '#6b5e52',
    pattern: 'empty',
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
          <line x1="0" y1="1" x2="6" y2="1" stroke="#1a6fb5" strokeWidth="2" />
          <line x1="0" y1="4" x2="6" y2="4" stroke="#1a6fb5" strokeWidth="2" />
        </pattern>
        {/* Diagonal lines pattern (Red) */}
        <pattern id="cb-diagonal" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="white" />
          <line x1="0" y1="0" x2="6" y2="0" stroke="#c44536" strokeWidth="2" />
        </pattern>
        {/* Crosshatch pattern (Green) */}
        <pattern id="cb-crosshatch" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="white" />
          <line x1="0" y1="3" x2="6" y2="3" stroke="#2d6a4f" strokeWidth="1.5" />
          <line x1="3" y1="0" x2="3" y2="6" stroke="#2d6a4f" strokeWidth="1.5" />
        </pattern>
        {/* Dot pattern (White) */}
        <pattern id="cb-radial" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#f9f3e3" />
          <circle cx="3" cy="3" r="1.5" fill="#8c7e72" />
        </pattern>
        {/* Solid pattern (Black) */}
        <pattern id="cb-solid" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#2a1f2d" />
        </pattern>
        {/* Empty / outline pattern (Colorless) */}
        <pattern id="cb-empty" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#3d2b1e" />
        </pattern>

        {/* Bar fill patterns */}
        <pattern id="cb-bar-horizontal" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#1a6fb5" fillOpacity="0.15" />
          <line x1="0" y1="1" x2="6" y2="1" stroke="#1a6fb5" strokeWidth="1.5" />
          <line x1="0" y1="4" x2="6" y2="4" stroke="#1a6fb5" strokeWidth="1.5" />
        </pattern>
        <pattern id="cb-bar-diagonal" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="#c44536" fillOpacity="0.15" />
          <line x1="0" y1="0" x2="6" y2="0" stroke="#c44536" strokeWidth="1.5" />
        </pattern>
        <pattern id="cb-bar-crosshatch" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#2d6a4f" fillOpacity="0.15" />
          <line x1="0" y1="3" x2="6" y2="3" stroke="#2d6a4f" strokeWidth="1" />
          <line x1="3" y1="0" x2="3" y2="6" stroke="#2d6a4f" strokeWidth="1" />
        </pattern>
        <pattern id="cb-bar-radial" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#c4b99a" fillOpacity="0.3" />
          <circle cx="3" cy="3" r="1.5" fill="#8c7e72" fillOpacity="0.5" />
        </pattern>
        <pattern id="cb-bar-solid" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#2a1f2d" fillOpacity="0.7" />
        </pattern>
        <pattern id="cb-bar-empty" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#8c7e72" fillOpacity="0.5" />
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
                <span className="font-mono text-[10px] font-bold text-[var(--text-light)] w-3">
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
              <div className="flex-1 h-3 bg-[var(--tavern-sunken)] border border-[var(--border-wood)] rounded overflow-hidden">
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
              <div className="flex-1 h-3 bg-[var(--tavern-sunken)] border border-[var(--border-wood)] rounded">
                <div
                  className="h-full rounded transition-all duration-300"
                  style={{
                    width: `${percent}%`,
                    backgroundColor: config.border,
                    opacity: 0.8,
                  }}
                />
              </div>
            )}
            {/* Count */}
            {colorblindMode ? (
              <span className="font-mono text-xs text-[var(--text-light)] w-14 text-right">
                {count} <span className="text-[var(--text-muted)] text-[10px]">{config.name.substring(0, 2).toUpperCase()}</span>
              </span>
            ) : (
              <span className="font-mono text-xs text-[var(--text-light)] w-6 text-right">
                {count}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
