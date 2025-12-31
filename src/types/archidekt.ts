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
}

// Swipe action for undo history
export interface SwipeAction {
  card: NormalizedCard
  action: 'keep' | 'remove'
  timestamp: number
  fromSideboard?: boolean
}

// View mode for hybrid swipe/category selection
export type ViewMode = 'swipe' | 'category'

// Category selection section
export type CategorySection = 'kept' | 'available'
