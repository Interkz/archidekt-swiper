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
          className="text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1 font-medium"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <ViewModeToggle mode={viewMode} onChange={handleViewModeChange} />

        <button
          onClick={() => setShowKeptModal(true)}
          className="text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
        >
          View Kept ({keptCards.length})
        </button>
      </header>

      {/* Kept cards modal */}
      <KeptCardsModal isOpen={showKeptModal} onClose={() => setShowKeptModal(false)} />

      {/* Deck name */}
      <h1 className="text-lg font-semibold text-slate-800 text-center mb-4 truncate">
        {deckName}
      </h1>

      {/* Mode toggle (if sideboard available) */}
      {sideboardAvailable && (
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setSwipeMode('main')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              swipeMode === 'main'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            Main Deck ({remainingCards.length}/{allCards.length})
          </button>
          <button
            onClick={() => setSwipeMode('sideboard')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              swipeMode === 'sideboard'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
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
          <p className="text-center text-amber-600 text-xs mt-2 font-medium">
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-slate-600 text-lg font-medium mb-4">
              {swipeMode === 'main' ? 'Main deck complete!' : 'Sideboard complete!'}
            </p>
            {mainDeckDone && sideboardAvailable && remainingSideboardCards.length > 0 && swipeMode === 'main' && (
              <button
                onClick={() => setSwipeMode('sideboard')}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl font-semibold text-white
                           transition-all duration-200 hover:shadow-lg hover:shadow-violet-200"
              >
                Swipe Sideboard Cards
              </button>
            )}
            {(mainDeckDone && (!sideboardAvailable || remainingSideboardCards.length === 0)) && (
              <button
                onClick={() => navigate('/results')}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl font-semibold text-white
                           transition-all duration-200 hover:shadow-lg hover:shadow-violet-200"
              >
                View Results
              </button>
            )}
            {swipeMode === 'sideboard' && remainingSideboardCards.length === 0 && (
              <button
                onClick={() => navigate('/results')}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl font-semibold text-white
                           transition-all duration-200 hover:shadow-lg hover:shadow-violet-200"
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
      <div className="text-center text-slate-400 text-xs mt-6">
        <span className="hidden sm:inline">
          Use <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px]">←</kbd> / <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px]">→</kbd> arrow keys or swipe. <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px]">Z</kbd> to undo.
        </span>
        <span className="sm:hidden">
          Swipe left to remove, right to keep
        </span>
      </div>
    </div>
  )
}
