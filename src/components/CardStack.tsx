import { useEffect, useRef, useCallback } from 'react'
import type { NormalizedCard } from '../types/archidekt'
import { preloadImages } from '../services/scryfallImages'
import SwipeCard from './SwipeCard'

interface CardStackProps {
  cards: NormalizedCard[]
  onKeep: (card: NormalizedCard) => void
  onRemove: (card: NormalizedCard) => void
}

export default function CardStack({ cards, onKeep, onRemove }: CardStackProps) {
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
      }
    },
    [currentCard, onKeep, onRemove]
  )

  const handleCardLeftScreen = useCallback(() => {
    // Card has fully left the screen, animation complete
  }, [])

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <p className="text-gray-400 text-lg">No more cards to swipe!</p>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-[350px] h-[550px] mx-auto">
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
              className="absolute inset-0 transition-transform"
              style={{
                transform: `scale(${1 - reverseIndex * 0.05}) translateY(${reverseIndex * 10}px)`,
                zIndex: cardsToShow.length - reverseIndex,
                opacity: isTop ? 1 : 0.7,
              }}
            >
              {isTop ? (
                <SwipeCard
                  card={card}
                  onSwipe={handleSwipe}
                  onCardLeftScreen={handleCardLeftScreen}
                />
              ) : (
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
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
