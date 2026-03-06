import { useEffect, useRef, useCallback } from 'react'
import type { NormalizedCard } from '../types/archidekt'
import { preloadImages } from '../services/scryfallImages'
import SwipeCard from './SwipeCard'

interface CardStackProps {
  cards: NormalizedCard[]
  onKeep: (card: NormalizedCard) => void
  onRemove: (card: NormalizedCard) => void
  onMaybe?: (card: NormalizedCard) => void
  isUndoing?: boolean
}

export default function CardStack({ cards, onKeep, onRemove, onMaybe, isUndoing }: CardStackProps) {
  const cardsToShow = cards.slice(0, 3) // Show top 3 cards in stack
  const currentCard = cards[0]
  const preloadedRef = useRef<Set<string>>(new Set())

  // Preload upcoming card images
  useEffect(() => {
    const upcomingCards = cards.slice(0, 5)
    const toPreload = upcomingCards
      .filter((c) => !preloadedRef.current.has(c.scryfallId))
      .map((c) => c.scryfallId)

    if (toPreload.length > 0) {
      preloadImages(toPreload)
      toPreload.forEach((id) => preloadedRef.current.add(id))
    }
  }, [cards])

  const handleSwipe = useCallback(
    (direction: string) => {
      if (!currentCard) return

      if (direction === 'right') {
        onKeep(currentCard)
      } else if (direction === 'left') {
        onRemove(currentCard)
      } else if (direction === 'up' && onMaybe) {
        onMaybe(currentCard)
      }
    },
    [currentCard, onKeep, onRemove, onMaybe]
  )

  const handleCardLeftScreen = useCallback(() => {
    // Card has fully left the screen, animation complete
  }, [])

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="text-center">
          {/* Clinical completion indicator */}
          <div className="w-16 h-16 mx-auto mb-6 border-2 border-[var(--lumon-green)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--lumon-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-terminal text-[var(--lumon-green)] tracking-widest">
            SORTING COMPLETE
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-[350px] h-[550px] mx-auto perspective-1000">
      {/* Table surface indicator - subtle grid line beneath cards */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-[var(--grid-line)]" />

      {/* Contact shadow on table */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-8 opacity-20"
           style={{
             background: 'radial-gradient(ellipse at center, var(--lumon-black) 0%, transparent 70%)',
             filter: 'blur(8px)'
           }}
      />

      {/* Render cards in reverse order so first card is on top */}
      {cardsToShow
        .slice()
        .reverse()
        .map((card, index) => {
          const reverseIndex = cardsToShow.length - 1 - index
          const isTop = reverseIndex === 0

          return (
            <div
              key={card.id}
              className={`absolute inset-0 transition-all duration-300 ${isTop ? (isUndoing ? 'card-slide-back' : 'card-enter') : ''}`}
              style={{
                // Physical deck stacking - cards slightly offset
                transform: `translateY(${reverseIndex * 4}px) translateX(${reverseIndex * 2}px)`,
                zIndex: cardsToShow.length - reverseIndex,
                // Cards behind are slightly visible (deck edge effect)
                opacity: isTop ? 1 : 0.4,
                // Slight rotation for natural stack look
                rotate: `${reverseIndex * 0.5}deg`,
              }}
            >
              {isTop ? (
                <SwipeCard
                  card={card}
                  onSwipe={handleSwipe}
                  onCardLeftScreen={handleCardLeftScreen}
                />
              ) : (
                // Background cards - just show edge
                <div className="bg-surface overflow-hidden card-shadow border border-[var(--grid-line)]">
                  <img
                    src={`https://api.scryfall.com/cards/${card.scryfallId}?format=image&version=normal`}
                    alt={card.name}
                    className="w-full h-auto"
                    draggable={false}
                  />
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}
