import { useEffect, useCallback, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDeckStore } from '../stores/deckStore'
import CardStack from '../components/CardStack'
import SwipeControls from '../components/SwipeControls'
import ProgressBar from '../components/ProgressBar'
import ViewModeToggle from '../components/ViewModeToggle'
import KeptCardsModal from '../components/KeptCardsModal'
import type { ViewMode } from '../types/archidekt'

export default function SwipePage() {
  const navigate = useNavigate()
  const [showKeptModal, setShowKeptModal] = useState(false)
  const {
    deckName,
    remainingCards,
    allCards,
    remainingSideboardCards,
    allSideboardCards,
    keptCards,
    swipeHistory,
    swipeMode,
    viewMode,
    keepCard,
    removeCard,
    undoLastSwipe,
    setSwipeMode,
    setViewMode,
  } = useDeckStore()

  // Current cards based on mode
  const currentCards = swipeMode === 'sideboard' ? remainingSideboardCards : remainingCards
  const totalCards = swipeMode === 'sideboard' ? allSideboardCards.length : allCards.length

  // Redirect if no deck loaded
  useEffect(() => {
    if (allCards.length === 0) {
      navigate('/')
    }
  }, [allCards, navigate])

  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    if (mode === 'category') {
      navigate('/category')
    }
  }

  // Navigate to results when done with main deck (sideboard is optional)
  useEffect(() => {
    if (allCards.length > 0 && remainingCards.length === 0 && swipeMode === 'main') {
      // If there are sideboard cards, offer to switch; otherwise go to results
      if (allSideboardCards.length > 0 && remainingSideboardCards.length > 0) {
        // Stay on page, user can switch to sideboard
      } else {
        navigate('/results')
      }
    }
  }, [remainingCards, allCards, swipeMode, allSideboardCards, remainingSideboardCards, navigate])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentCards.length === 0) return

      const currentCard = currentCards[0]

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          keepCard(currentCard)
          break
        case 'ArrowLeft':
          e.preventDefault()
          removeCard(currentCard)
          break
        case 'z':
        case 'Z':
          if (swipeHistory.length > 0) {
            e.preventDefault()
            undoLastSwipe()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentCards, swipeHistory, keepCard, removeCard, undoLastSwipe])

  const handleKeep = useCallback(() => {
    if (currentCards.length > 0) {
      keepCard(currentCards[0])
    }
  }, [currentCards, keepCard])

  const handleRemove = useCallback(() => {
    if (currentCards.length > 0) {
      removeCard(currentCards[0])
    }
  }, [currentCards, removeCard])

  const handleUndo = useCallback(() => {
    undoLastSwipe()
  }, [undoLastSwipe])

  if (allCards.length === 0) {
    return null
  }

  const mainDeckDone = remainingCards.length === 0
  const sideboardAvailable = allSideboardCards.length > 0

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <Link
          to="/"
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <ViewModeToggle mode={viewMode} onChange={handleViewModeChange} />

        <button
          onClick={() => setShowKeptModal(true)}
          className="text-sm text-purple-400 hover:text-purple-300"
        >
          View Kept ({keptCards.length})
        </button>
      </header>

      {/* Kept cards modal */}
      <KeptCardsModal isOpen={showKeptModal} onClose={() => setShowKeptModal(false)} />

      {/* Deck name */}
      <h1 className="text-lg font-semibold text-white text-center mb-4 truncate">
        {deckName}
      </h1>

      {/* Mode toggle (if sideboard available) */}
      {sideboardAvailable && (
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setSwipeMode('main')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              swipeMode === 'main'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Main Deck ({remainingCards.length}/{allCards.length})
          </button>
          <button
            onClick={() => setSwipeMode('sideboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              swipeMode === 'sideboard'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Sideboard ({remainingSideboardCards.length}/{allSideboardCards.length})
          </button>
        </div>
      )}

      {/* Progress */}
      <div className="mb-6">
        <ProgressBar current={currentCards.length} total={totalCards} />
        {swipeMode === 'sideboard' && (
          <p className="text-center text-yellow-400 text-xs mt-2">
            Swipe right to add sideboard cards to your deck
          </p>
        )}
      </div>

      {/* Card stack or completion message */}
      <div className="flex-1 flex items-center justify-center">
        {currentCards.length > 0 ? (
          <CardStack
            cards={currentCards}
            onKeep={keepCard}
            onRemove={removeCard}
          />
        ) : (
          <div className="text-center">
            <p className="text-gray-400 text-lg mb-4">
              {swipeMode === 'main' ? 'Main deck complete!' : 'Sideboard complete!'}
            </p>
            {mainDeckDone && sideboardAvailable && remainingSideboardCards.length > 0 && swipeMode === 'main' && (
              <button
                onClick={() => setSwipeMode('sideboard')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
              >
                Swipe Sideboard Cards
              </button>
            )}
            {(mainDeckDone && (!sideboardAvailable || remainingSideboardCards.length === 0)) && (
              <button
                onClick={() => navigate('/results')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
              >
                View Results
              </button>
            )}
            {swipeMode === 'sideboard' && remainingSideboardCards.length === 0 && (
              <button
                onClick={() => navigate('/results')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
              >
                View Results
              </button>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      {currentCards.length > 0 && (
        <SwipeControls
          onKeep={handleKeep}
          onRemove={handleRemove}
          onUndo={handleUndo}
          canUndo={swipeHistory.length > 0}
          disabled={currentCards.length === 0}
        />
      )}

      {/* Keyboard hints */}
      <div className="text-center text-gray-500 text-xs mt-4">
        <span className="hidden sm:inline">
          Use <kbd className="px-1.5 py-0.5 bg-white/10 rounded">←</kbd> / <kbd className="px-1.5 py-0.5 bg-white/10 rounded">→</kbd> arrow keys or swipe. <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Z</kbd> to undo.
        </span>
        <span className="sm:hidden">
          Swipe left to remove, right to keep
        </span>
      </div>
    </div>
  )
}
