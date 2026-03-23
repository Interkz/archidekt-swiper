import type { Proposal, Vote, CubeMember } from '../../types/cube'
import VoteButton from './VoteButton'

interface ProposalCardProps {
  proposal: Proposal
  votes: Vote[]
  members: CubeMember[]
  cubeCards: { id: string; name: string; image_uri: string }[]
  currentMember: string | null
  onVote: (proposalId: string, vote: 'approve' | 'reject') => void
}

function getProposalImage(proposal: Proposal, cubeCards: { id: string; image_uri: string }[]): string {
  if (proposal.type === 'cut' && proposal.cut_card_id) {
    const card = cubeCards.find((c) => c.id === proposal.cut_card_id)
    return card?.image_uri || ''
  }
  if (proposal.type === 'add' && proposal.add_card_data) {
    const data = proposal.add_card_data as { image_uri?: string; scryfall_id?: string }
    if (data.image_uri) return data.image_uri
    if (data.scryfall_id) {
      return `https://api.scryfall.com/cards/${data.scryfall_id}?format=image&version=normal`
    }
  }
  return ''
}

function getProposalCardName(proposal: Proposal, cubeCards: { id: string; name: string }[]): string {
  if (proposal.type === 'cut' && proposal.cut_card_id) {
    const card = cubeCards.find((c) => c.id === proposal.cut_card_id)
    return card?.name || 'Unknown Card'
  }
  if (proposal.type === 'add') {
    return proposal.add_card_name || 'Unknown Card'
  }
  return 'Unknown Card'
}

export default function ProposalCard({
  proposal,
  votes,
  members,
  cubeCards,
  currentMember,
  onVote,
}: ProposalCardProps) {
  const imageUri = getProposalImage(proposal, cubeCards)
  const cardName = getProposalCardName(proposal, cubeCards)
  const isCut = proposal.type === 'cut'

  const proposerMember = members.find((m) => m.name === proposal.proposed_by)
  const otherMembers = members.filter((m) => m.name !== proposal.proposed_by)

  const currentUserVoted = votes.some((v) => v.voter_name === currentMember)
  const isProposer = currentMember === proposal.proposed_by
  const votingDisabled = currentUserVoted || isProposer || !currentMember

  return (
    <div
      className="rounded-lg overflow-hidden border-2 border-[var(--border-wood)] card-shadow"
      style={{ background: 'var(--tavern-surface)' }}
    >
      {/* Card image */}
      <div className="relative">
        {imageUri ? (
          <img
            src={imageUri}
            alt={cardName}
            className="w-full h-auto"
            loading="lazy"
          />
        ) : (
          <div
            className="aspect-[488/680] flex items-center justify-center text-sm text-[var(--text-muted)]"
            style={{ background: 'var(--tavern-sunken)' }}
          >
            {cardName}
          </div>
        )}

        {/* Type badge */}
        <div
          className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-display uppercase tracking-wider font-bold"
          style={{
            background: isCut ? 'var(--negative)' : 'var(--positive)',
            color: 'var(--tavern-card)',
          }}
        >
          {isCut ? 'CUT' : 'ADD'}
        </div>
      </div>

      {/* Card info */}
      <div className="p-3 space-y-3">
        {/* Card name */}
        <h3 className="font-display text-sm text-[var(--text-light)] tracking-wide truncate">
          {cardName}
        </h3>

        {/* Proposer */}
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: proposerMember?.color || 'var(--text-muted)' }}
          />
          <span className="text-xs text-[var(--text-muted)]">
            Proposed by <span className="text-[var(--text-light)] font-semibold">{proposal.proposed_by}</span>
          </span>
        </div>

        {/* Reason */}
        {proposal.reason && (
          <p className="text-xs text-[var(--text-muted)] italic leading-relaxed">
            &ldquo;{proposal.reason}&rdquo;
          </p>
        )}

        {/* Vote tally */}
        <div className="flex flex-wrap gap-2">
          {otherMembers.map((member) => {
            const vote = votes.find((v) => v.voter_name === member.name)
            let icon = '\u25CB' // not voted
            let color = 'var(--text-muted)'
            if (vote?.vote === 'approve') {
              icon = '\u2713'
              color = 'var(--positive)'
            } else if (vote?.vote === 'reject') {
              icon = '\u2717'
              color = 'var(--negative)'
            }

            return (
              <div key={member.id} className="flex items-center gap-1" title={`${member.name}: ${vote ? vote.vote : 'not voted'}`}>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: member.color }}
                />
                <span className="text-xs font-mono" style={{ color }}>
                  {icon}
                </span>
              </div>
            )
          })}
        </div>

        {/* Vote buttons */}
        <div className="flex gap-2 pt-1">
          <VoteButton
            type="approve"
            onClick={() => onVote(proposal.id, 'approve')}
            disabled={votingDisabled}
          />
          <VoteButton
            type="reject"
            onClick={() => onVote(proposal.id, 'reject')}
            disabled={votingDisabled}
          />
        </div>

        {/* Status hint */}
        {isProposer && (
          <p className="text-[10px] text-[var(--text-muted)] italic">You proposed this — waiting for others to vote.</p>
        )}
        {currentUserVoted && !isProposer && (
          <p className="text-[10px] text-[var(--text-muted)] italic">You already voted on this proposal.</p>
        )}
      </div>
    </div>
  )
}
