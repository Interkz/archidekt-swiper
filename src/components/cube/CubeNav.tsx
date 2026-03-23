import { Link } from 'react-router-dom'

type CubeNavTab = 'dashboard' | 'browser' | 'voting' | 'propose' | 'history'

interface CubeNavProps {
  cubeId: string
  active: CubeNavTab
}

const TABS: { key: CubeNavTab; label: string; path: (id: string) => string }[] = [
  { key: 'dashboard', label: 'Dashboard', path: (id) => `/cube/${id}` },
  { key: 'browser', label: 'Browser', path: (id) => `/cube/${id}/browser` },
  { key: 'voting', label: 'Voting', path: (id) => `/cube/${id}/voting` },
  { key: 'propose', label: 'Propose', path: (id) => `/cube/${id}/propose` },
  { key: 'history', label: 'History', path: (id) => `/cube/${id}/history` },
]

export default function CubeNav({ cubeId, active }: CubeNavProps) {
  return (
    <nav aria-label="Cube navigation" className="flex gap-1 px-4 py-2 border-b border-[var(--border-wood)]"
         style={{ background: 'var(--tavern-surface)' }}>
      {TABS.map((tab) => {
        const isActive = tab.key === active
        return (
          <Link
            key={tab.key}
            to={tab.path(cubeId)}
            className={`
              font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-t
              transition-colors duration-150
              ${isActive
                ? 'bg-[var(--stone-light,#b8b0a0)] text-[var(--ink-primary)] font-bold border border-b-0 border-[var(--border-wood)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-light)] hover:bg-[var(--tavern-surface-alt)]'
              }
            `}
          >
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
