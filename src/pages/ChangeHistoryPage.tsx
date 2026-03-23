import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useCubeStore } from '../stores/cubeStore'
import CubeNav from '../components/cube/CubeNav'
import MemberPicker from '../components/cube/MemberPicker'

export default function ChangeHistoryPage() {
  const { id } = useParams()
  const proposals = useCubeStore(s => s.proposals)
  const votes = useCubeStore(s => s.votes)
  const members = useCubeStore(s => s.members)
  const cards = useCubeStore(s => s.cards)

  const resolvedProposals = useMemo(
    () => proposals
      .filter(p => p.status !== 'pending')
      .sort((a, b) => (b.resolved_at || b.created_at).localeCompare(a.resolved_at || a.created_at)),
    [proposals]
  )

  function getCardName(proposal: typeof proposals[0]) {
    if (proposal.type === 'cut' && proposal.cut_card_id) {
      return cards.find(c => c.id === proposal.cut_card_id)?.name || 'Unknown Card'
    }
    return proposal.add_card_name || 'Unknown Card'
  }

  function getMemberColor(name: string) {
    return members.find(m => m.name === name)?.color || '#9a9080'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CubeNav cubeId={id || ''} active="dashboard" />

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl text-[var(--text-light)] tracking-wider uppercase">
              Change History
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {resolvedProposals.length} resolved proposal{resolvedProposals.length !== 1 ? 's' : ''}
            </p>
          </div>
          <MemberPicker />
        </div>

        {resolvedProposals.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-lg border-2 border-dashed border-[var(--border-wood)]"
            style={{ background: 'var(--tavern-sunken)' }}
          >
            <p className="font-display text-lg text-[var(--text-muted)] tracking-wide uppercase mb-2">
              No History Yet
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              Resolved proposals will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {resolvedProposals.map(p => {
              const proposalVotes = votes[p.id] || []
              const cardName = getCardName(p)

              return (
                <div
                  key={p.id}
                  className="flex items-start gap-4 p-4 rounded border-2 border-[var(--border-wood)] bg-[var(--tavern-surface)]"
                >
                  {/* Status badge */}
                  <div className={`px-2 py-1 rounded font-mono text-xs uppercase font-bold ${
                    p.status === 'approved'
                      ? 'bg-[var(--positive)] text-[var(--tavern-card)]'
                      : 'bg-[var(--negative)] text-[var(--tavern-card)]'
                  }`}>
                    {p.status}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-xs uppercase px-1.5 py-0.5 rounded border ${
                        p.type === 'cut'
                          ? 'border-[var(--negative)] text-[var(--negative)]'
                          : 'border-[var(--positive)] text-[var(--positive)]'
                      }`}>
                        {p.type}
                      </span>
                      <span className="font-body text-[var(--text-light)] font-semibold truncate">
                        {cardName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-[var(--text-muted)]">by</span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: getMemberColor(p.proposed_by) }}
                      >
                        {p.proposed_by}
                      </span>
                      {p.reason && (
                        <>
                          <span className="text-xs text-[var(--text-muted)]">&mdash;</span>
                          <span className="text-xs text-[var(--text-muted)] italic truncate">
                            "{p.reason}"
                          </span>
                        </>
                      )}
                    </div>

                    {/* Vote breakdown */}
                    {proposalVotes.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-[var(--text-muted)]">Votes:</span>
                        {proposalVotes.map(v => (
                          <span
                            key={v.id}
                            className={`text-xs font-mono ${
                              v.vote === 'approve' ? 'text-[var(--positive)]' : 'text-[var(--negative)]'
                            }`}
                          >
                            {v.voter_name} {v.vote === 'approve' ? '\u2713' : '\u2717'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="font-mono text-[10px] text-[var(--text-muted)] whitespace-nowrap">
                    {p.resolved_at ? new Date(p.resolved_at).toLocaleDateString() : ''}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
