import { useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCubeStore } from '../stores/cubeStore'
import CubeNav from '../components/cube/CubeNav'
import FilterBar from '../components/cube/FilterBar'
import CardGrid from '../components/cube/CardGrid'
import CubeStatsPanel from '../components/cube/CubeStatsPanel'
import MemberPicker from '../components/cube/MemberPicker'

export default function CubeBrowserPage() {
  const { id } = useParams()
  const [statsOpen, setStatsOpen] = useState(false)

  const cube = useCubeStore((s) => s.cube)
  const cards = useCubeStore((s) => s.cards)
  const memberName = useCubeStore((s) => s.memberName)
  const activeFilters = useCubeStore((s) => s.activeFilters)
  const getFilteredCards = useCubeStore((s) => s.getFilteredCards)
  // Subscribe to activeFilters so component re-renders when filters change
  const filteredCards = useMemo(() => getFilteredCards(), [cards, activeFilters, getFilteredCards])

  // No cube loaded — link back to setup
  if (!cube || !id) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="font-display text-2xl text-[var(--amber)] tracking-wider mb-4">
          NO CUBE LOADED
        </h1>
        <p className="text-[var(--text-muted)] mb-6">
          Import a cube list first.
        </p>
        <Link to="/cube/setup" className="btn-wood px-6 py-2 inline-block">
          Go to Setup
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ─── HEADER BAR: dark wood with grain ─── */}
      <header
        className="flex items-center justify-between px-6 py-4 border-b-2"
        style={{
          background: `
            repeating-linear-gradient(92deg, transparent, transparent 20px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px),
            linear-gradient(180deg, #5c3a1e, #3b2410 40%, #1a0e06)`,
          borderColor: 'var(--stone-dark, #706858)',
        }}
      >
        <div className="flex items-baseline gap-4">
          <Link
            to={`/cube/${id}`}
            className="font-display text-2xl tracking-wider text-[var(--cream,#f0e8d0)]
                       hover:text-[var(--amber)] transition-colors"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6), 0 0 20px rgba(200,160,96,0.1)' }}
          >
            {cube.name.toUpperCase()}
          </Link>
          <span className="font-mono text-[11px] text-[var(--cream-dim,#b0a888)] tracking-wider">
            {filteredCards.length === cards.length
              ? `${cards.length} CARDS`
              : `${filteredCards.length} / ${cards.length} CARDS`
            }
          </span>
        </div>

        <div className="flex items-center gap-4">
          <MemberPicker />
          {memberName && (
            <Link
              to={`/cube/${id}`}
              className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider
                         hover:text-[var(--amber)] transition-colors"
            >
              Dashboard
            </Link>
          )}
        </div>
      </header>

      {/* ─── CUBE NAV ─── */}
      <CubeNav cubeId={id} active="browser" />

      {/* ─── FILTER BAR ─── */}
      <FilterBar filteredCount={filteredCards.length} totalCount={cards.length} />

      {/* ─── FELT TABLE with card grid ─── */}
      <div
        className="flex-1"
        style={{
          /* Outer wood frame on left/right/bottom */
          borderLeft: '10px solid #3b2410',
          borderRight: '10px solid #3b2410',
          borderBottom: '10px solid #3b2410',
          background: `
            repeating-linear-gradient(87deg, transparent, transparent 30px, rgba(90,58,30,0.06) 30px, rgba(90,58,30,0.06) 31px),
            linear-gradient(180deg, #1a0e06, #0a0602)`,
        }}
      >
        <CardGrid cards={filteredCards} />
      </div>

      {/* ─── STATS PANEL ─── */}
      <CubeStatsPanel
        cards={filteredCards}
        targetSize={cube.target_size}
        isOpen={statsOpen}
        onToggle={() => setStatsOpen((o) => !o)}
      />
    </div>
  )
}
