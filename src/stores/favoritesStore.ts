import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { NormalizedCard } from '../types/archidekt'

export interface FavoriteCard {
  id: string
  name: string
  scryfallId: string
  setCode: string
  manaCost: string
  cmc: number
  typeLine: string
  colorIdentity: string[]
  categories: string[]
  favoritedAt: number
}

interface FavoritesState {
  favorites: FavoriteCard[]
  toggleFavorite: (card: NormalizedCard) => void
  removeFavorite: (cardId: string) => void
  isFavorite: (cardId: string) => boolean
  clearFavorites: () => void
}

function toFavoriteCard(card: NormalizedCard): FavoriteCard {
  return {
    id: card.id,
    name: card.name,
    scryfallId: card.scryfallId,
    setCode: card.setCode,
    manaCost: card.manaCost,
    cmc: card.cmc,
    typeLine: card.typeLine,
    colorIdentity: card.colorIdentity,
    categories: card.categories,
    favoritedAt: Date.now(),
  }
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      toggleFavorite: (card) => {
        const { favorites } = get()
        const exists = favorites.some((f) => f.id === card.id)
        if (exists) {
          set({ favorites: favorites.filter((f) => f.id !== card.id) })
        } else {
          set({ favorites: [...favorites, toFavoriteCard(card)] })
        }
      },

      removeFavorite: (cardId) => {
        const { favorites } = get()
        set({ favorites: favorites.filter((f) => f.id !== cardId) })
      },

      isFavorite: (cardId) => {
        return get().favorites.some((f) => f.id === cardId)
      },

      clearFavorites: () => set({ favorites: [] }),
    }),
    {
      name: 'archidekt-swiper-favorites',
    }
  )
)
