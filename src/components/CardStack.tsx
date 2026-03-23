import { useEffect, useRef, useCallback } from 'react'
import type { NormalizedCard } from '../types/archidekt'
import { preloadImages } from '../services/scryfallImages'
import SwipeCard from './SwipeCard'

interface CardStackProps {
  cards: NormalizedCard[]
  onKeep: (card: NormalizedCard) => void
  onRemove: (card: NormalizedCard) => void
  onMaybe?: (card: NormalizedCard) => void
}

export default function CardStack({ cards, onKeep, onRemove, onMaybe }: CardStackProps) {
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
          {/* Completion indicator — golden check */}
          <div className="w-16 h-16 mx-auto mb-6 border-2 border-[var(--amber)] rounded flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--amber)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-display text-sm text-[var(--amber)] tracking-widest uppercase">
            Sorting Complete
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-[350px] h-[550px] mx-auto perspective-1000">
      {/* Table surface indicator — brass line beneath cards */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-px"
           style={{ background: 'linear-gradient(90deg, transparent, var(--border-brass), transparent)' }} />

      {/* Contact shadow on table — warm */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-8 opacity-30"
           style={{
             background: 'radial-gradient(ellipse at center, rgba(26,15,10,0.8) 0%, transparent 70%)',
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
              className={`absolute inset-0 transition-all duration-300 ${isTop ? 'card-enter' : ''}`}
              style={{
                transform: `translateY(${reverseIndex * 4}px) translateX(${reverseIndex * 2}px)`,
                zIndex: cardsToShow.length - reverseIndex,
                opacity: isTop ? 1 : 0.4,
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
                // Background cards — parchment edge with warm shadow
                <div className="parchment overflow-hidden card-shadow rounded border border-[var(--border-wood)]">
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
