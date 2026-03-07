import type { CompletedSession, NormalizedCard } from '../types/archidekt'

const STORAGE_KEY = 'archidekt-swiper-sessions'

export function getSavedSessions(): CompletedSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveSession(
  deckId: string,
  deckName: string,
  deckOwner: string,
  keptCards: NormalizedCard[]
): CompletedSession {
  const sessions = getSavedSessions()

  // Replace existing session for same deck, or add new
  const existing = sessions.findIndex((s) => s.deckId === deckId)
  const session: CompletedSession = {
    id: `${deckId}-${Date.now()}`,
    deckId,
    deckName,
    deckOwner,
    keptCards,
    completedAt: Date.now(),
  }

  if (existing >= 0) {
    sessions[existing] = session
  } else {
    sessions.push(session)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  return session
}

export function deleteSession(id: string): void {
  const sessions = getSavedSessions().filter((s) => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export function clearAllSessions(): void {
  localStorage.removeItem(STORAGE_KEY)
}
