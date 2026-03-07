import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  ArchidektDeckResponse,
  ArchidektCardEntry,
  NormalizedCard,
  SwipeAction,
  SwipeHistoryEntry,
  BulkSwipeAction,
  BulkActionType,
  ViewMode,
  CategorySection,
} from '../types/archidekt'

type SwipeMode = 'main' | 'sideboard'

interface DeckState {
  // Deck metadata
  deckId: string | null
  deckName: string
  deckOwner: string

  // Main deck card lists
  allCards: NormalizedCard[]
  remainingCards: NormalizedCard[]
  keptCards: NormalizedCard[]
  removedCards: NormalizedCard[]

  // Maybe pile for deferred decisions
  maybeCards: NormalizedCard[]
  isReviewingMaybes: boolean

  // Sideboard card lists
  allSideboardCards: NormalizedCard[]
  remainingSideboardCards: NormalizedCard[]

  // Swipe history for undo (supports single and bulk actions)
  swipeHistory: SwipeHistoryEntry[]

  // UI State
  isLoading: boolean
  error: string | null
  swipeMode: SwipeMode

  // View mode (swipe vs category)
  viewMode: ViewMode

  // Category mode state
  categoryLimits: Record<string, number>
  activeCategoryIndex: number
  activeSection: CategorySection
  activeCardIndex: number

  // Actions
  setDeck: (deck: ArchidektDeckResponse) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSwipeMode: (mode: SwipeMode) => void
  keepCard: (card: NormalizedCard) => void
  removeCard: (card: NormalizedCard) => void
  maybeCard: (card: NormalizedCard) => void
  undoLastSwipe: () => NormalizedCard | null
  resetDeck: () => void
  clearState: () => void

  // Maybe pile actions
  startMaybeReview: () => void

  // Quick actions
  getRemainingLands: () => NormalizedCard[]
  getRemainingByCategory: (category: string) => NormalizedCard[]
  bulkKeepCards: (cards: NormalizedCard[], actionType: BulkActionType, label: string) => void

  // View mode actions
  setViewMode: (mode: ViewMode) => void

  // Category mode actions
  setCategoryLimit: (category: string, limit: number) => void
  setActiveCategoryIndex: (index: number) => void
  setActiveSection: (section: CategorySection) => void
  setActiveCardIndex: (index: number) => void
  addCardToKept: (card: NormalizedCard) => void
  removeCardFromKept: (card: NormalizedCard) => void

  // Category mode selectors (computed)
  getUniqueCategories: () => string[]
  getCategoryKeptCards: (category: string) => NormalizedCard[]
  getCategoryAvailableCards: (category: string) => NormalizedCard[]
  canAddToCategory: (category: string) => boolean
}

function normalizeCards(cards: ArchidektCardEntry[], includeSideboard: boolean = false): NormalizedCard[] {
  return cards
    .filter((entry) => {
      const isSideboard = entry.categories.some(
        (cat) => cat.toLowerCase() === 'sideboard'
      )
      const isMaybeboard = entry.categories.some(
        (cat) => cat.toLowerCase() === 'maybeboard'
      )

      if (includeSideboard) {
        return isSideboard
      } else {
        // Main deck: exclude maybeboard and sideboard
        return !isMaybeboard && !isSideboard
      }
    })
    .map((entry) => ({
      id: entry.card.uid,
      name: entry.card.oracleCard.name,
      manaCost: entry.card.oracleCard.manaCost || '',
      cmc: entry.card.oracleCard.cmc,
      typeLine: entry.card.oracleCard.typeLine,
      scryfallId: entry.card.uid,
      quantity: entry.quantity,
      categories: entry.categories,
      setCode: entry.card.edition.editioncode,
      colorIdentity: entry.card.oracleCard.colorIdentity || [],
      price: entry.card.prices?.tcg ?? null,
    }))
    .sort((a, b) => {
      // Sort by CMC, then alphabetically
      if (a.cmc !== b.cmc) return a.cmc - b.cmc
      return a.name.localeCompare(b.name)
    })
}

export const useDeckStore = create<DeckState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        deckId: null,
        deckName: '',
        deckOwner: '',
        allCards: [],
        remainingCards: [],
        keptCards: [],
        removedCards: [],
        maybeCards: [],
        isReviewingMaybes: false,
        allSideboardCards: [],
        remainingSideboardCards: [],
        swipeHistory: [],
        isLoading: false,
        error: null,
        swipeMode: 'main' as SwipeMode,

        // View mode state
        viewMode: 'swipe' as ViewMode,

        // Category mode state
        categoryLimits: {} as Record<string, number>,
        activeCategoryIndex: 0,
        activeSection: 'available' as CategorySection,
        activeCardIndex: 0,

        setDeck: (deck) => {
          const mainDeck = normalizeCards(deck.cards, false)
          const sideboard = normalizeCards(deck.cards, true)
          set({
            deckId: String(deck.id),
            deckName: deck.name,
            deckOwner: deck.owner.username,
            allCards: mainDeck,
            remainingCards: [...mainDeck],
            keptCards: [],
            removedCards: [],
            maybeCards: [],
            isReviewingMaybes: false,
            allSideboardCards: sideboard,
            remainingSideboardCards: [...sideboard],
            swipeHistory: [],
            error: null,
            swipeMode: 'main',
            viewMode: 'swipe',
            categoryLimits: {},
            activeCategoryIndex: 0,
            activeSection: 'available',
            activeCardIndex: 0,
          })
        },

        setLoading: (loading) => set({ isLoading: loading }),

        setError: (error) => set({ error }),

        setSwipeMode: (mode) => set({ swipeMode: mode }),

        // View mode actions
        setViewMode: (mode) => set({ viewMode: mode }),

        // Category mode actions
        setCategoryLimit: (category, limit) => {
          const { categoryLimits } = get()
          set({
            categoryLimits: { ...categoryLimits, [category]: limit },
          })
        },

        setActiveCategoryIndex: (index) => set({ activeCategoryIndex: index, activeCardIndex: 0 }),

        setActiveSection: (section) => set({ activeSection: section, activeCardIndex: 0 }),

        setActiveCardIndex: (index) => set({ activeCardIndex: index }),

        addCardToKept: (card) => {
          const { keptCards, remainingCards } = get()
          // Only add if not already kept
          if (!keptCards.some((c) => c.id === card.id)) {
            set({
              keptCards: [...keptCards, card],
              remainingCards: remainingCards.filter((c) => c.id !== card.id),
            })
          }
        },

        removeCardFromKept: (card) => {
          const { keptCards, remainingCards, allCards } = get()
          // Only remove if currently kept
          if (keptCards.some((c) => c.id === card.id)) {
            // Check if card is in original allCards (not from sideboard)
            const isMainDeckCard = allCards.some((c) => c.id === card.id)
            set({
              keptCards: keptCards.filter((c) => c.id !== card.id),
              remainingCards: isMainDeckCard ? [...remainingCards, card] : remainingCards,
            })
          }
        },

        // Category mode selectors
        getUniqueCategories: () => {
          const { allCards } = get()
          const categorySet = new Set<string>()

          allCards.forEach((card) => {
            card.categories.forEach((cat) => {
              const lowerCat = cat.toLowerCase()
              if (!['sideboard', 'maybeboard'].includes(lowerCat)) {
                categorySet.add(cat)
              }
            })
          })

          // Sort alphabetically but put Commander first
          return Array.from(categorySet).sort((a, b) => {
            if (a.toLowerCase() === 'commander') return -1
            if (b.toLowerCase() === 'commander') return 1
            return a.localeCompare(b)
          })
        },

        getCategoryKeptCards: (category) => {
          const { keptCards } = get()
          return keptCards.filter((card) =>
            card.categories.some((cat) => cat.toLowerCase() === category.toLowerCase())
          )
        },

        getCategoryAvailableCards: (category) => {
          const { allCards, keptCards } = get()
          const keptIds = new Set(keptCards.map((c) => c.id))
          return allCards.filter(
            (card) =>
              card.categories.some((cat) => cat.toLowerCase() === category.toLowerCase()) &&
              !keptIds.has(card.id)
          )
        },

        canAddToCategory: (category) => {
          const { categoryLimits } = get()
          const limit = categoryLimits[category]
          if (limit === undefined || limit === 0) return true // No limit set
          const keptCount = get().getCategoryKeptCards(category).length
          return keptCount < limit
        },

        keepCard: (card) => {
          const { remainingCards, remainingSideboardCards, keptCards, swipeHistory, swipeMode } = get()

          if (swipeMode === 'sideboard') {
            // Swiping right on sideboard card adds it to kept (mainboard)
            set({
              remainingSideboardCards: remainingSideboardCards.filter((c) => c.id !== card.id),
              keptCards: [...keptCards, card],
              swipeHistory: [
                ...swipeHistory,
                { card, action: 'keep', timestamp: Date.now(), fromSideboard: true },
              ],
            })
          } else {
            set({
              remainingCards: remainingCards.filter((c) => c.id !== card.id),
              keptCards: [...keptCards, card],
              swipeHistory: [
                ...swipeHistory,
                { card, action: 'keep', timestamp: Date.now(), fromSideboard: false },
              ],
            })
          }
        },

        removeCard: (card) => {
          const { remainingCards, remainingSideboardCards, removedCards, swipeHistory, swipeMode } = get()

          if (swipeMode === 'sideboard') {
            // Swiping left on sideboard card just skips it (doesn't add to mainboard)
            set({
              remainingSideboardCards: remainingSideboardCards.filter((c) => c.id !== card.id),
              swipeHistory: [
                ...swipeHistory,
                { card, action: 'remove', timestamp: Date.now(), fromSideboard: true },
              ],
            })
          } else {
            set({
              remainingCards: remainingCards.filter((c) => c.id !== card.id),
              removedCards: [...removedCards, card],
              swipeHistory: [
                ...swipeHistory,
                { card, action: 'remove', timestamp: Date.now(), fromSideboard: false },
              ],
            })
          }
        },

        maybeCard: (card) => {
          const { remainingCards, remainingSideboardCards, maybeCards, swipeHistory, swipeMode } = get()

          if (swipeMode === 'sideboard') {
            set({
              remainingSideboardCards: remainingSideboardCards.filter((c) => c.id !== card.id),
              maybeCards: [...maybeCards, card],
              swipeHistory: [
                ...swipeHistory,
                { card, action: 'maybe', timestamp: Date.now(), fromSideboard: true },
              ],
            })
          } else {
            set({
              remainingCards: remainingCards.filter((c) => c.id !== card.id),
              maybeCards: [...maybeCards, card],
              swipeHistory: [
                ...swipeHistory,
                { card, action: 'maybe', timestamp: Date.now(), fromSideboard: false },
              ],
            })
          }
        },

        startMaybeReview: () => {
          const { maybeCards } = get()
          // Move all maybe cards back to remaining for review
          set({
            remainingCards: [...maybeCards],
            maybeCards: [],
            isReviewingMaybes: true,
          })
        },

        // Quick action selectors
        getRemainingLands: () => {
          const { remainingCards } = get()
          return remainingCards.filter((card) =>
            card.typeLine.toLowerCase().includes('land')
          )
        },

        getRemainingByCategory: (category: string) => {
          const { remainingCards } = get()
          return remainingCards.filter((card) =>
            card.categories.some((cat) => cat.toLowerCase() === category.toLowerCase())
          )
        },

        bulkKeepCards: (cards, actionType, label) => {
          if (cards.length === 0) return

          const { remainingCards, keptCards, swipeHistory } = get()
          const cardIds = new Set(cards.map((c) => c.id))

          set({
            remainingCards: remainingCards.filter((c) => !cardIds.has(c.id)),
            keptCards: [...keptCards, ...cards],
            swipeHistory: [
              ...swipeHistory,
              {
                type: 'bulk',
                actionType,
                cards,
                timestamp: Date.now(),
                label,
              } as BulkSwipeAction,
            ],
          })
        },

        undoLastSwipe: () => {
          const { swipeHistory, keptCards, removedCards, maybeCards, remainingCards, remainingSideboardCards } = get()
          if (swipeHistory.length === 0) return null

          const lastAction = swipeHistory[swipeHistory.length - 1]
          const newHistory = swipeHistory.slice(0, -1)

          // Handle bulk actions
          if ('type' in lastAction && lastAction.type === 'bulk') {
            const bulkAction = lastAction as BulkSwipeAction
            const bulkCardIds = new Set(bulkAction.cards.map((c) => c.id))

            set({
              keptCards: keptCards.filter((c) => !bulkCardIds.has(c.id)),
              remainingCards: [...bulkAction.cards, ...remainingCards],
              swipeHistory: newHistory,
            })

            return bulkAction.cards[0] // Return first card for UI feedback
          }

          // Handle single card actions
          const singleAction = lastAction as SwipeAction
          const fromSideboard = singleAction.fromSideboard

          if (fromSideboard) {
            // Restore to sideboard
            if (singleAction.action === 'keep') {
              set({
                keptCards: keptCards.filter((c) => c.id !== singleAction.card.id),
                remainingSideboardCards: [singleAction.card, ...remainingSideboardCards],
                swipeHistory: newHistory,
              })
            } else if (singleAction.action === 'maybe') {
              set({
                maybeCards: maybeCards.filter((c) => c.id !== singleAction.card.id),
                remainingSideboardCards: [singleAction.card, ...remainingSideboardCards],
                swipeHistory: newHistory,
              })
            } else {
              set({
                remainingSideboardCards: [singleAction.card, ...remainingSideboardCards],
                swipeHistory: newHistory,
              })
            }
          } else {
            // Restore to main deck
            if (singleAction.action === 'keep') {
              set({
                keptCards: keptCards.filter((c) => c.id !== singleAction.card.id),
                remainingCards: [singleAction.card, ...remainingCards],
                swipeHistory: newHistory,
              })
            } else if (singleAction.action === 'maybe') {
              set({
                maybeCards: maybeCards.filter((c) => c.id !== singleAction.card.id),
                remainingCards: [singleAction.card, ...remainingCards],
                swipeHistory: newHistory,
              })
            } else {
              set({
                removedCards: removedCards.filter((c) => c.id !== singleAction.card.id),
                remainingCards: [singleAction.card, ...remainingCards],
                swipeHistory: newHistory,
              })
            }
          }

          return singleAction.card
        },

        resetDeck: () => {
          const { allCards, allSideboardCards } = get()
          set({
            remainingCards: [...allCards],
            remainingSideboardCards: [...allSideboardCards],
            keptCards: [],
            removedCards: [],
            maybeCards: [],
            isReviewingMaybes: false,
            swipeHistory: [],
            swipeMode: 'main',
            viewMode: 'swipe',
            categoryLimits: {},
            activeCategoryIndex: 0,
            activeSection: 'available',
            activeCardIndex: 0,
          })
        },

        clearState: () => {
          set({
            deckId: null,
            deckName: '',
            deckOwner: '',
            allCards: [],
            remainingCards: [],
            keptCards: [],
            removedCards: [],
            maybeCards: [],
            isReviewingMaybes: false,
            allSideboardCards: [],
            remainingSideboardCards: [],
            swipeHistory: [],
            isLoading: false,
            error: null,
            swipeMode: 'main',
            viewMode: 'swipe',
            categoryLimits: {},
            activeCategoryIndex: 0,
            activeSection: 'available',
            activeCardIndex: 0,
          })
        },
      }),
      {
        name: 'archidekt-swiper-storage',
        partialize: (state) => ({
          deckId: state.deckId,
          deckName: state.deckName,
          deckOwner: state.deckOwner,
          keptCards: state.keptCards,
          removedCards: state.removedCards,
          maybeCards: state.maybeCards,
          isReviewingMaybes: state.isReviewingMaybes,
          remainingCards: state.remainingCards,
          allCards: state.allCards,
          allSideboardCards: state.allSideboardCards,
          remainingSideboardCards: state.remainingSideboardCards,
          swipeHistory: state.swipeHistory,
          swipeMode: state.swipeMode,
          viewMode: state.viewMode,
          categoryLimits: state.categoryLimits,
        }),
      }
    )
  )
)
