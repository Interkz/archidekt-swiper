import { useState } from 'react'
import TinderCard from 'react-tinder-card'
import type { NormalizedCard } from '../types/archidekt'
import { getCardImageUrl } from '../services/scryfallImages'
import { useFavoritesStore } from '../stores/favoritesStore'
import CardDetails from './CardDetails'

interface SwipeCardProps {
  card: NormalizedCard
  onSwipe: (direction: string) => void
  onCardLeftScreen: () => void
}

export default function SwipeCard({ card, onSwipe, onCardLeftScreen }: SwipeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null)
  const { toggleFavorite, isFavorite } = useFavoritesStore()
  const favorited = isFavorite(card.id)

  const handleSwipe = (direction: string) => {
    setSwipeDirection(direction)
    onSwipe(direction)
  }

  return (
    <TinderCard
      className="absolute w-full perspective-1000"
      onSwipe={handleSwipe}
      onCardLeftScreen={onCardLeftScreen}
      preventSwipe={['down']}
    >
      <div className="relative preserve-3d">
        {/* ACCEPTED stamp - clinical approval */}
        <div
          className={`absolute top-8 left-4 z-10 stamp stamp-accepted
                      ${swipeDirection === 'right' ? 'stamp-visible' : ''}`}
        >
          <span className="text-sm tracking-widest">ACCEPTED</span>
          <div className="flex gap-0.5 mt-1 justify-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-[var(--lumon-green)]" />
            ))}
          </div>
        </div>

        {/* REJECTED stamp - clinical rejection */}
        <div
          className={`absolute top-8 right-4 z-10 stamp stamp-rejected
                      ${swipeDirection === 'left' ? 'stamp-visible' : ''}`}
        >
          <span className="text-sm tracking-widest">REJECTED</span>
          <div className="flex gap-0.5 mt-1 justify-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 border border-[var(--lumon-black)] bg-transparent" />
            ))}
          </div>
        </div>

        {/* DEFERRED stamp - clinical deferral */}
        <div
          className={`absolute top-8 left-1/2 -translate-x-1/2 z-10 stamp stamp-deferred
                      ${swipeDirection === 'up' ? 'stamp-visible' : ''}`}
        >
          <span className="text-sm tracking-widest">DEFERRED</span>
          <div className="flex gap-0.5 mt-1 justify-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 border border-[#8b5a2b] bg-transparent" />
            ))}
          </div>
        </div>

        {/* Card image with physical presence */}
        <div className="relative bg-surface overflow-hidden card-shadow-lg transition-all duration-200 hover:card-shadow-hover">
          {/* Subtle paper texture overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-30"
               style={{
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                 mixBlendMode: 'multiply'
               }}
          />

          {/* Card border - thin black line */}
          <div className="absolute inset-0 border border-[var(--lumon-black)]/10 pointer-events-none z-10" />

          {/* Favorite heart button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(card)
            }}
            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center
                       border-2 border-[var(--lumon-black)] bg-[var(--lumon-white)]/90
                       hover:bg-[var(--lumon-white)] transition-all duration-150"
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className={`w-4 h-4 transition-colors duration-150 ${
                favorited ? 'text-[var(--lumon-green)] fill-[var(--lumon-green)]' : 'text-[var(--lumon-black)] fill-transparent'
              }`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="square" strokeLinejoin="miter" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          {/* Loading state - clinical placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-lumon-cream">
              <div className="w-12 h-12 border-2 border-[var(--lumon-black)] border-t-transparent animate-spin" />
              <span className="mt-4 text-terminal text-[var(--status-neutral)]">Loading</span>
            </div>
          )}

          <img
            src={getCardImageUrl(card.scryfallId, 'normal')}
            alt={card.name}
            className={`w-full h-auto transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
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
