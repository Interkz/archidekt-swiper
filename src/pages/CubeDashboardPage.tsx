import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCubeStore } from '../stores/cubeStore'
import CubeNav from '../components/cube/CubeNav'
import MemberPicker from '../components/cube/MemberPicker'

export default function CubeDashboardPage() {
  const { id } = useParams()
  const cube = useCubeStore(s => s.cube)
  const cards = useCubeStore(s => s.cards)
  const members = useCubeStore(s => s.members)
  const proposals = useCubeStore(s => s.proposals)

  const pending = useMemo(
    () => proposals.filter(p => p.status === 'pending'),
    [proposals]
  )

  const stats = useMemo(() => {
    const creatures = cards.filter(c => c.type_line.toLowerCase().includes('creature')).length
    const instants = cards.filter(c => c.type_line.toLowerCase().includes('instant')).length
    const sorceries = cards.filter(c => c.type_line.toLowerCase().includes('sorcery')).length
    const lands = cards.filter(c => c.type_line.toLowerCase().includes('land')).length
    const nonLands = cards.filter(c => !c.type_line.toLowerCase().includes('land'))
    const avgCmc = nonLands.length > 0
      ? (nonLands.reduce((sum, c) => sum + c.cmc, 0) / nonLands.length).toFixed(2)
      : '0.00'
    return { creatures, instants, sorceries, lands, avgCmc }
  }, [cards])

  if (!cube || cards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="font-display text-2xl text-[var(--text-light)] tracking-wider mb-4">NO CUBE LOADED</h1>
        <Link to="/cube/setup" className="btn-tavern px-6 py-3 inline-block">Create Cube</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b-2 border-[var(--border-wood)] p-4 wood-surface">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-[var(--text-light)] tracking-wider">{cube.name}</h1>
            <p className="font-mono text-xs text-[var(--text-muted)]">{cards.length} cards</p>
          </div>
          <MemberPicker />
        </div>
      </div>

      {/* Use shared CubeNav */}
      <CubeNav cubeId={id || ''} active="dashboard" />

      {/* Dashboard content */}
      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Quick Stats */}
          <div className="border-2 border-[var(--border-wood)] rounded p-5 bg-[var(--tavern-surface)]">
            <h2 className="text-terminal text-[var(--text-muted)] tracking-widest mb-4">CUBE STATS</h2>
            <div className="space-y-3">
              {[
                ['Total Cards', cards.length],
                ['Creatures', stats.creatures],
                ['Instants', stats.instants],
                ['Sorceries', stats.sorceries],
                ['Lands', stats.lands],
                ['Avg CMC', stats.avgCmc],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between">
                  <span className="font-mono text-sm text-[var(--text-muted)]">{label}</span>
                  <span className="font-mono text-sm text-[var(--text-light)] font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Members */}
          <div className="border-2 border-[var(--border-wood)] rounded p-5 bg-[var(--tavern-surface)]">
            <h2 className="text-terminal text-[var(--text-muted)] tracking-widest mb-4">MEMBERS</h2>
            <div className="space-y-3">
              {members.map(m => (
                <div key={m.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-display text-xs font-bold"
                       style={{ borderColor: m.color, background: m.color + '30', color: m.color }}>
                    {m.name[0]}
                  </div>
                  <span className="font-body text-[var(--text-light)]">{m.name}</span>
                </div>
              ))}
            </div>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-3">
              Threshold: {cube.vote_threshold}
            </p>
          </div>

          {/* Recent Proposals */}
          <div className="border-2 border-[var(--border-wood)] rounded p-5 bg-[var(--tavern-surface)]">
            <h2 className="text-terminal text-[var(--text-muted)] tracking-widest mb-4">RECENT PROPOSALS</h2>
            {proposals.length === 0 ? (
              <p className="text-[var(--text-muted)] text-sm">No proposals yet.</p>
            ) : (
              <div className="space-y-3">
                {proposals.slice(-3).reverse().map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className={`font-mono text-xs uppercase px-2 py-0.5 rounded border ${
                      p.type === 'cut'
                        ? 'border-[var(--negative)] text-[var(--negative)]'
                        : 'border-[var(--positive)] text-[var(--positive)]'
                    }`}>
                      {p.type}
                    </span>
                    <span className="text-sm text-[var(--text-light)] truncate">
                      {p.type === 'cut' ? (cards.find(c => c.id === p.cut_card_id)?.name || 'Unknown') : p.add_card_name}
                    </span>
                    <span className={`ml-auto font-mono text-xs ${
                      p.status === 'pending' ? 'text-[var(--deferred)]' :
                      p.status === 'approved' ? 'text-[var(--positive)]' :
                      'text-[var(--negative)]'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {pending.length > 0 && (
              <Link
                to={`/cube/${id}/voting`}
                className="block mt-4 text-center font-mono text-sm text-[var(--amber)] hover:text-[var(--amber-light)] transition-colors"
              >
                {pending.length} pending &rarr;
              </Link>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mt-6">
          <Link to={`/cube/${id}/browser`} className="btn-tavern flex-1 text-center py-3">
            Browse Cards
          </Link>
          <Link to={`/cube/${id}/propose`} className="btn-wood flex-1 text-center py-3">
            Propose Change
          </Link>
        </div>
      </div>
    </div>
  )
}
