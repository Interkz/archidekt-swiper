import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  CubeMember,
  CubeCard,
  Proposal,
  Vote,
} from '../types/cube'

interface CubeState {
  // Identity
  memberName: string | null

  // Cube data (ALL persisted to localStorage)
  currentCubeId: string | null
  cube: { name: string; target_size: number; vote_threshold: 'majority' | 'unanimous'; created_at: string } | null
  members: CubeMember[]
  cards: CubeCard[]
  proposals: Proposal[]
  votes: Record<string, Vote[]>

  // UI state (not persisted)
  isLoading: boolean
  error: string | null
  activeFilters: {
    colors: string[]
    types: string[]
    tags: string[]
  }

  // Actions
  setMemberName: (name: string) => void
  createCube: (name: string, targetSize: number, voteThreshold: 'majority' | 'unanimous') => void
  setCards: (cards: CubeCard[]) => void
  setFilters: (filters: Partial<CubeState['activeFilters']>) => void
  toggleFilter: (category: 'colors' | 'types' | 'tags', value: string) => void
  clearFilters: () => void

  proposeCut: (cardId: string, reason: string) => void
  proposeAdd: (card: { scryfall_id: string; name: string; image_uri: string; mana_cost: string; cmc: number; type_line: string; color_identity: string[] }, reason: string) => void
  castVote: (proposalId: string, vote: 'approve' | 'reject') => void

  // Computed (as functions, not state)
  getFilteredCards: () => CubeCard[]
  getCardsByColor: (color: string) => CubeCard[]
  getPendingProposals: () => Proposal[]
  getProposalVotes: (proposalId: string) => Vote[]
  getTagCounts: () => Record<string, number>
  getTypeCounts: () => Record<string, number>
  getColorCounts: () => Record<string, number>
}

export const useCubeStore = create<CubeState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        memberName: null,
        currentCubeId: null,
        cube: null,
        members: [],
        cards: [],
        proposals: [],
        votes: {},
        isLoading: false,
        error: null,
        activeFilters: {
          colors: [],
          types: [],
          tags: [],
        },

        // Actions
        setMemberName: (name) => {
          set({ memberName: name })
        },

        createCube: (name, targetSize, voteThreshold) => {
          const cubeId = crypto.randomUUID()
          const now = new Date().toISOString()

          const defaultMembers: CubeMember[] = [
            { id: crypto.randomUUID(), cube_id: cubeId, name: 'Emil', color: '#c44536', joined_at: now },
            { id: crypto.randomUUID(), cube_id: cubeId, name: 'Arnar', color: '#1a6fb5', joined_at: now },
            { id: crypto.randomUUID(), cube_id: cubeId, name: 'Beggi', color: '#2d6a4f', joined_at: now },
            { id: crypto.randomUUID(), cube_id: cubeId, name: 'Toggi', color: '#d4a020', joined_at: now },
          ]

          set({
            currentCubeId: cubeId,
            cube: {
              name,
              target_size: targetSize,
              vote_threshold: voteThreshold,
              created_at: now,
            },
            members: defaultMembers,
            cards: [],
            proposals: [],
            votes: {},
          })
        },

        setCards: (cards) => {
          set({ cards })
        },

        setFilters: (filters) => {
          const { activeFilters } = get()
          set({
            activeFilters: { ...activeFilters, ...filters },
          })
        },

        toggleFilter: (category, value) => {
          const { activeFilters } = get()
          const current = activeFilters[category]
          const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value]

          set({
            activeFilters: { ...activeFilters, [category]: updated },
          })
        },

        clearFilters: () => {
          set({
            activeFilters: { colors: [], types: [], tags: [] },
          })
        },

        proposeCut: (cardId, reason) => {
          const { proposals, memberName, currentCubeId } = get()
          if (!memberName || !currentCubeId) return

          const proposal: Proposal = {
            id: crypto.randomUUID(),
            cube_id: currentCubeId,
            type: 'cut',
            cut_card_id: cardId,
            reason,
            proposed_by: memberName,
            status: 'pending',
            created_at: new Date().toISOString(),
          }

          set({ proposals: [...proposals, proposal] })
        },

        proposeAdd: (card, reason) => {
          const { proposals, memberName, currentCubeId } = get()
          if (!memberName || !currentCubeId) return

          const proposal: Proposal = {
            id: crypto.randomUUID(),
            cube_id: currentCubeId,
            type: 'add',
            add_scryfall_id: card.scryfall_id,
            add_card_name: card.name,
            add_card_data: card as unknown as Record<string, unknown>,
            reason,
            proposed_by: memberName,
            status: 'pending',
            created_at: new Date().toISOString(),
          }

          set({ proposals: [...proposals, proposal] })
        },

        castVote: (proposalId, vote) => {
          const { votes, memberName, proposals, members, cards, cube, currentCubeId } = get()
          if (!memberName) return

          const proposal = proposals.find((p) => p.id === proposalId)
          if (!proposal || proposal.status !== 'pending') return

          // Prevent double voting
          const existingVotes = votes[proposalId] || []
          if (existingVotes.some((v) => v.voter_name === memberName)) return

          // Proposer cannot vote on their own proposal
          if (proposal.proposed_by === memberName) return

          const newVote: Vote = {
            id: crypto.randomUUID(),
            proposal_id: proposalId,
            voter_name: memberName,
            vote,
            created_at: new Date().toISOString(),
          }

          const updatedVotes = [...existingVotes, newVote]
          const allVotes = { ...votes, [proposalId]: updatedVotes }

          // Check threshold
          const otherMembers = members.filter((m) => m.name !== proposal.proposed_by)
          const totalOthers = otherMembers.length
          const approveCount = updatedVotes.filter((v) => v.vote === 'approve').length
          const totalVotesCast = updatedVotes.length

          const threshold = cube?.vote_threshold || 'majority'
          let approved = false
          let rejected = false

          if (threshold === 'majority') {
            approved = approveCount > totalOthers / 2
            // Rejected if remaining possible approvals can't reach majority
            const remainingVoters = totalOthers - totalVotesCast
            if (!approved && approveCount + remainingVoters <= totalOthers / 2) {
              rejected = true
            }
          } else {
            // unanimous
            approved = approveCount === totalOthers
            // Rejected if any rejection exists
            const rejectCount = updatedVotes.filter((v) => v.vote === 'reject').length
            if (rejectCount > 0) {
              rejected = true
            }
          }

          let updatedProposals = proposals
          let updatedCards = cards

          if (approved) {
            const now = new Date().toISOString()
            updatedProposals = proposals.map((p) =>
              p.id === proposalId ? { ...p, status: 'approved' as const, resolved_at: now } : p
            )

            if (proposal.type === 'cut' && proposal.cut_card_id) {
              updatedCards = cards.filter((c) => c.id !== proposal.cut_card_id)
            } else if (proposal.type === 'add' && proposal.add_card_data) {
              const addData = proposal.add_card_data as {
                scryfall_id: string
                name: string
                image_uri: string
                mana_cost: string
                cmc: number
                type_line: string
                color_identity: string[]
              }
              const newCard: CubeCard = {
                id: crypto.randomUUID(),
                cube_id: currentCubeId || '',
                scryfall_id: addData.scryfall_id,
                name: addData.name,
                mana_cost: addData.mana_cost,
                cmc: addData.cmc,
                type_line: addData.type_line,
                color_identity: addData.color_identity,
                tags: [],
                set_code: '',
                image_uri: addData.image_uri,
                added_by: proposal.proposed_by,
                added_at: now,
              }
              updatedCards = [...cards, newCard]
            }
          } else if (rejected) {
            const now = new Date().toISOString()
            updatedProposals = proposals.map((p) =>
              p.id === proposalId ? { ...p, status: 'rejected' as const, resolved_at: now } : p
            )
          }

          set({
            votes: allVotes,
            proposals: updatedProposals,
            cards: updatedCards,
          })
        },

        // Computed
        getFilteredCards: () => {
          const { cards, activeFilters } = get()
          const { colors, types, tags } = activeFilters

          return cards.filter((card) => {
            // Color filter
            if (colors.length > 0) {
              let matchesColor = false
              for (const c of colors) {
                if (c === 'C') {
                  // Colorless: empty color_identity
                  if (card.color_identity.length === 0) { matchesColor = true; break }
                } else if (c === 'M') {
                  // Multicolor: more than one color
                  if (card.color_identity.length > 1) { matchesColor = true; break }
                } else {
                  if (card.color_identity.includes(c)) { matchesColor = true; break }
                }
              }
              if (!matchesColor) return false
            }

            // Type filter
            if (types.length > 0) {
              const typeLower = card.type_line.toLowerCase()
              const matchesType = types.some((t) => typeLower.includes(t.toLowerCase()))
              if (!matchesType) return false
            }

            // Tag filter
            if (tags.length > 0) {
              const matchesTag = tags.some((t) => card.tags.includes(t))
              if (!matchesTag) return false
            }

            return true
          })
        },

        getCardsByColor: (color) => {
          const { cards } = get()
          if (color === 'C') {
            return cards.filter((c) => c.color_identity.length === 0)
          }
          if (color === 'M') {
            return cards.filter((c) => c.color_identity.length > 1)
          }
          return cards.filter((c) => c.color_identity.includes(color))
        },

        getPendingProposals: () => {
          const { proposals } = get()
          return proposals.filter((p) => p.status === 'pending')
        },

        getProposalVotes: (proposalId) => {
          const { votes } = get()
          return votes[proposalId] || []
        },

        getTagCounts: () => {
          const { cards } = get()
          const counts: Record<string, number> = {}
          for (const card of cards) {
            for (const tag of card.tags) {
              counts[tag] = (counts[tag] || 0) + 1
            }
          }
          return counts
        },

        getTypeCounts: () => {
          const { cards } = get()
          const counts: Record<string, number> = {}
          const majorTypes = ['Creature', 'Instant', 'Sorcery', 'Enchantment', 'Artifact', 'Planeswalker', 'Land', 'Battle']
          for (const card of cards) {
            for (const type of majorTypes) {
              if (card.type_line.toLowerCase().includes(type.toLowerCase())) {
                counts[type] = (counts[type] || 0) + 1
              }
            }
          }
          return counts
        },

        getColorCounts: () => {
          const { cards } = get()
          const counts: Record<string, number> = { W: 0, U: 0, B: 0, R: 0, G: 0, C: 0, M: 0 }
          for (const card of cards) {
            if (card.color_identity.length === 0) {
              counts['C']++
            } else if (card.color_identity.length > 1) {
              counts['M']++
            } else {
              const color = card.color_identity[0]
              if (color in counts) {
                counts[color]++
              }
            }
          }
          return counts
        },
      }),
      {
        name: 'archidekt-cube-storage',
        partialize: (state) => ({
          memberName: state.memberName,
          currentCubeId: state.currentCubeId,
          cube: state.cube,
          members: state.members,
          cards: state.cards,
          proposals: state.proposals,
          votes: state.votes,
        }),
      }
    )
  )
)
