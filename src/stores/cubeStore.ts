import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  Cube,
  CubeMember,
  CubeCard,
  Proposal,
  Vote,
  ChangeHistoryEntry,
} from '../types/cube'

interface CubeState {
  // Identity (persisted)
  memberName: string | null

  // Current cube
  currentCubeId: string | null
  cube: Cube | null
  members: CubeMember[]
  cards: CubeCard[]
  proposals: Proposal[]
  votes: Record<string, Vote[]>
  history: ChangeHistoryEntry[]

  // UI state
  isLoading: boolean
  error: string | null
  activeTagFilter: string | null

  // Actions
  setMemberName: (name: string) => void
  loadCube: (cubeId: string) => Promise<void>
  createCube: (name: string, ownerName: string, targetSize: number, voteThreshold: 'majority' | 'unanimous') => Promise<void>
  importCards: (cubeId: string, cardNames: string[]) => Promise<void>
  proposeChange: (proposal: Omit<Proposal, 'id' | 'created_at' | 'status'>) => Promise<void>
  castVote: (proposalId: string, vote: 'approve' | 'reject') => Promise<void>
  setTagFilter: (tag: string | null) => void
}

export const useCubeStore = create<CubeState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        memberName: null,
        currentCubeId: null,
        cube: null,
        members: [],
        cards: [],
        proposals: [],
        votes: {},
        history: [],
        isLoading: false,
        error: null,
        activeTagFilter: null,

        // Actions
        setMemberName: (name) => {
          set({ memberName: name })
        },

        loadCube: async (_cubeId) => {
          console.log('TODO: loadCube — fetch cube, members, cards, proposals, votes, history from Supabase')
          set({ isLoading: true, error: null })
          // Will be implemented in Phase 2
          set({ isLoading: false })
        },

        createCube: async (_name, _ownerName, _targetSize, _voteThreshold) => {
          console.log('TODO: createCube — insert into Supabase cubes table')
          set({ isLoading: true, error: null })
          // Will be implemented in Phase 2
          set({ isLoading: false })
        },

        importCards: async (_cubeId, _cardNames) => {
          console.log('TODO: importCards — resolve via Scryfall, insert into Supabase cube_cards')
          set({ isLoading: true, error: null })
          // Will be implemented in Phase 2
          set({ isLoading: false })
        },

        proposeChange: async (_proposal) => {
          console.log('TODO: proposeChange — insert into Supabase proposals table')
          set({ isLoading: true, error: null })
          // Will be implemented in Phase 4
          set({ isLoading: false })
        },

        castVote: async (_proposalId, _vote) => {
          console.log('TODO: castVote — insert into Supabase votes table, check threshold')
          set({ isLoading: true, error: null })
          // Will be implemented in Phase 4
          set({ isLoading: false })
        },

        setTagFilter: (tag) => {
          set({ activeTagFilter: tag })
        },
      }),
      {
        name: 'archidekt-cube-storage',
        partialize: (state) => ({
          memberName: state.memberName,
          currentCubeId: state.currentCubeId,
        }),
      }
    )
  )
)
