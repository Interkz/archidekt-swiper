import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useCubeStore } from '../stores/cubeStore'
import CubeNav from '../components/cube/CubeNav'
import MemberPicker from '../components/cube/MemberPicker'
import ProposalCard from '../components/cube/ProposalCard'

export default function VotingBoardPage() {
  const { id } = useParams()
  const cubeId = id || ''

  const memberName = useCubeStore((s) => s.memberName)
  const members = useCubeStore((s) => s.members)
  const cards = useCubeStore((s) => s.cards)
  const proposals = useCubeStore((s) => s.proposals)
  const votes = useCubeStore((s) => s.votes)
  const castVote = useCubeStore((s) => s.castVote)

  const pendingProposals = useMemo(
    () => proposals.filter((p) => p.status === 'pending'),
    [proposals]
  )

  const cubeCards = useMemo(
    () => cards.map((c) => ({ id: c.id, name: c.name, image_uri: c.image_uri })),
    [cards]
  )

  function handleVote(proposalId: string, vote: 'approve' | 'reject') {
    castVote(proposalId, vote)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CubeNav cubeId={cubeId} active="voting" />

      <div className="flex-1 p-6 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-2xl text-[var(--text-light)] tracking-wider uppercase">
              Voting Board
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {pendingProposals.length} pending proposal{pendingProposals.length !== 1 ? 's' : ''}
            </p>
          </div>
          <MemberPicker />
        </div>

        {/* Proposals grid */}
        {pendingProposals.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 rounded-lg border-2 border-dashed border-[var(--border-wood)]"
            style={{ background: 'var(--tavern-sunken)' }}
          >
            <p className="font-display text-lg text-[var(--text-muted)] tracking-wide uppercase mb-2">
              No Pending Proposals
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              All caught up. Head to the Propose tab to suggest changes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pendingProposals.map((proposal) => (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                votes={votes[proposal.id] || []}
                members={members}
                cubeCards={cubeCards}
                currentMember={memberName}
                onVote={handleVote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
