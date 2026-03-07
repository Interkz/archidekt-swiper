import { useState, useCallback } from 'react'

export interface RecentDeck {
  id: string
  name: string
  cardCount: number
  lastReviewed: string // ISO date string
}

const STORAGE_KEY = 'archidekt-swiper-recent-decks'
const MAX_RECENT = 5

function loadRecent(): RecentDeck[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveRecent(decks: RecentDeck[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(decks))
}

export function addRecentDeck(deck: RecentDeck) {
  const existing = loadRecent().filter((d) => d.id !== deck.id)
  const updated = [deck, ...existing].slice(0, MAX_RECENT)
  saveRecent(updated)
}

export function useRecentDecks() {
  const [recentDecks, setRecentDecks] = useState<RecentDeck[]>(loadRecent)

  const refresh = useCallback(() => {
    setRecentDecks(loadRecent())
  }, [])

  const clearRecent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setRecentDecks([])
  }, [])

  return { recentDecks, clearRecent, refresh }
}
