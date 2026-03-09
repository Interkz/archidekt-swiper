import { useSettingsStore } from '../stores/settingsStore'

interface ColorblindToggleProps {
  compact?: boolean
}

export default function ColorblindToggle({ compact }: ColorblindToggleProps) {
  const { colorblindMode, toggleColorblindMode } = useSettingsStore()

  if (compact) {
    return (
      <button
        onClick={toggleColorblindMode}
        className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all duration-150
          ${colorblindMode
            ? 'border-[var(--lumon-green)] bg-[var(--lumon-green)] text-[var(--lumon-white)]'
            : 'border-[var(--grid-line)] text-[var(--status-neutral)] hover:border-[var(--lumon-black)] hover:text-[var(--lumon-black)]'
          }`}
        aria-label={colorblindMode ? 'Disable colorblind mode' : 'Enable colorblind mode'}
        title={colorblindMode ? 'Colorblind mode: ON' : 'Colorblind mode: OFF'}
      >
        {/* Eye icon with pattern indicator */}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="square" strokeLinejoin="miter" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
          {colorblindMode && (
            <>
              <line x1="9" y1="9" x2="15" y2="15" strokeWidth={1.5} />
              <line x1="9" y1="15" x2="15" y2="9" strokeWidth={1.5} />
            </>
          )}
        </svg>
        <span className="font-mono text-[10px] uppercase tracking-wider">CB</span>
      </button>
    )
  }

  return (
    <button
      onClick={toggleColorblindMode}
      className={`flex items-center gap-2 px-4 py-2 border-2 transition-all duration-150 font-mono text-xs uppercase tracking-wider
        ${colorblindMode
          ? 'border-[var(--lumon-green)] bg-[var(--lumon-green)] text-[var(--lumon-white)] hover:bg-[var(--lumon-green-light)]'
          : 'border-[var(--lumon-black)] bg-transparent text-[var(--lumon-black)] hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)]'
        }`}
      aria-label={colorblindMode ? 'Disable colorblind mode' : 'Enable colorblind mode'}
    >
      {/* Eye icon */}
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="square" strokeLinejoin="miter" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <span>Colorblind {colorblindMode ? 'On' : 'Off'}</span>
    </button>
  )
}
