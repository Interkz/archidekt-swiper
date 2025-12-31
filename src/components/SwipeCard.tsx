import { useState } from 'react'
import TinderCard from 'react-tinder-card'
import type { NormalizedCard } from '../types/archidekt'
import { getCardImageUrl } from '../services/scryfallImages'
import CardDetails from './CardDetails'

interface SwipeCardProps {
  card: NormalizedCard
  onSwipe: (direction: string) => void
  onCardLeftScreen: () => void
}

export default function SwipeCard({ card, onSwipe, onCardLeftScreen }: SwipeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null)

  const handleSwipe = (direction: string) => {
    setSwipeDirection(direction)
    onSwipe(direction)
  }

  return (
    <TinderCard
      className="absolute w-full"
      onSwipe={handleSwipe}
      onCardLeftScreen={onCardLeftScreen}
      preventSwipe={['up', 'down']}
    >
      <div className="relative">
        {/* Swipe indicators */}
        <div
          className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-lg font-bold text-2xl
                      border-4 border-red-500 text-red-500 rotate-[-20deg]
                      transition-opacity ${swipeDirection === 'left' ? 'opacity-100' : 'opacity-0'}`}
        >
          REMOVE
        </div>
        <div
          className={`absolute top-4 right-4 z-10 px-4 py-2 rounded-lg font-bold text-2xl
                      border-4 border-green-500 text-green-500 rotate-[20deg]
                      transition-opacity ${swipeDirection === 'right' ? 'opacity-100' : 'opacity-0'}`}
        >
          KEEP
        </div>

        {/* Card image */}
        <div className="relative bg-gray-800 rounded-xl overflow-hidden shadow-2xl">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-700 animate-pulse">
              <svg className="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          <img
            src={getCardImageUrl(card.scryfallId, 'normal')}
            alt={card.name}
            className={`w-full h-auto transition-opacity ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            draggable={false}
          />
        </div>

        {/* Card details */}
        <CardDetails card={card} />
      </div>
    </TinderCard>
  )
}
