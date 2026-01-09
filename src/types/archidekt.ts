// Archidekt API response types

export interface ArchidektDeckResponse {
  id: number
  name: string
  owner: {
    id: number
    username: string
  }
  cards: ArchidektCardEntry[]
  categories: ArchidektCategory[]
  format: number
  createdAt: string
  updatedAt: string
}

export interface ArchidektCardEntry {
  quantity: number
  card: ArchidektCard
  categories: string[]
  label?: string
}

export interface ArchidektCard {
  uid: string // Scryfall ID
  oracleCard: {
    name: string
    manaCost: string | null
    typeLine: string
    cmc: number
    colorIdentity: string[]
    oracleText?: string
  }
  edition: {
    editioncode: string
    editionname: string
  }
}

export interface ArchidektCategory {
  name: string
  includedInDeck: boolean
  includedInPrice: boolean
  isPremier: boolean
}

// Normalized card type for internal use
export interface NormalizedCard {
  id: string
  name: string
  manaCost: string
  cmc: number
  typeLine: string
  scryfallId: string
  quantity: number
  categories: string[]
  setCode: string
  colorIdentity: string[] // W, U, B, R, G
}

// Swipe action for undo history
export interface SwipeAction {
  card: NormalizedCard
  action: 'keep' | 'remove' | 'maybe'
  timestamp: number
  fromSideboard?: boolean
}

// Bulk action types for quick actions
export type BulkActionType = 'keep-lands' | 'keep-category'

export interface BulkSwipeAction {
  type: 'bulk'
  actionType: BulkActionType
  cards: NormalizedCard[]
  timestamp: number
  label: string // e.g., "All Lands" or "Commander"
}

// Union type for swipe history entries
export type SwipeHistoryEntry = SwipeAction | BulkSwipeAction

// View mode for hybrid swipe/category selection
export type ViewMode = 'swipe' | 'category'

// Category selection section
export type CategorySection = 'kept' | 'available'

// Quick action for bulk operations
export interface QuickAction {
  type: BulkActionType
  category?: string
  cards: NormalizedCard[]
  label: string
}
