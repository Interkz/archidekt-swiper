import { useEffect, useCallback, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDeckStore } from '../stores/deckStore'
import CardStack from '../components/CardStack'
import SkeletonCard from '../components/SkeletonCard'
import SwipeControls from '../components/SwipeControls'
import ProgressBar from '../components/ProgressBar'
import ViewModeToggle from '../components/ViewModeToggle'
import KeptCardsModal from '../components/KeptCardsModal'
import DeckStatsPanel from '../components/stats/DeckStatsPanel'
import QuickActionsDropdown from '../components/QuickActionsDropdown'
import QuickActionConfirmModal from '../components/QuickActionConfirmModal'
import type { ViewMode, QuickAction } from '../types/archidekt'

export default function SwipePage() {
  const navigate = useNavigate()
  const [showKeptModal, setShowKeptModal] = useState(false)
  const [showStatsPanel, setShowStatsPanel] = useState(false)
  const [pendingQuickAction, setPendingQuickAction] = useState<QuickAction | null>(null)

  const {
    deckName,
    remainingCards,
    allCards,
    remainingSideboardCards,
    allSideboardCards,
    keptCards,
    maybeCards,
    isReviewingMaybes,
    swipeHistory,
    swipeMode,
    viewMode,
    isLoading,
    error,
    keepCard,
    removeCard,
    maybeCard,
    undoLastSwipe,
    setSwipeMode,
    setViewMode,
    startMaybeReview,
    getRemainingLands,
    getRemainingByCategory,
    getUniqueCategories,
    bulkKeepCards,
  } = useDeckStore()

  // Current cards based on mode
  const currentCards = swipeMode === 'sideboard' ? remainingSideboardCards : remainingCards
  const totalCards = swipeMode === 'sideboard' ? allSideboardCards.length : allCards.length

  // Format numbers with leading zeros
  const formatNumber = (n: number) => n.toString().padStart(3, '0')

  // Redirect if no deck loaded (but not while loading or showing error)
  useEffect(() => {
    if (allCards.length === 0 && !isLoading && !error) {
      navigate('/')
    }
  }, [allCards, isLoading, error, navigate])

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
      // If there are maybes, don't auto-navigate - let user review
      if (maybeCards.length > 0 && !isReviewingMaybes) {
        return
      }
      // If there are sideboard cards, offer to switch; otherwise go to results
      if (allSideboardCards.length > 0 && remainingSideboardCards.length > 0) {
        // Stay on page, user can switch to sideboard
      } else if (maybeCards.length === 0) {
        navigate('/results')
      }
    }
  }, [remainingCards, allCards, swipeMode, allSideboardCards, remainingSideboardCards, maybeCards, isReviewingMaybes, navigate])

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
        case 'ArrowUp':
          e.preventDefault()
          maybeCard(currentCard)
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
  }, [currentCards, swipeHistory, keepCard, removeCard, maybeCard, undoLastSwipe])

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

  const handleMaybe = useCallback(() => {
    if (currentCards.length > 0) {
      maybeCard(currentCards[0])
    }
  }, [currentCards, maybeCard])

  const handleUndo = useCallback(() => {
    undoLastSwipe()
  }, [undoLastSwipe])

  const handleQuickActionSelect = (action: QuickAction) => {
    if (action.cards.length > 0) {
      setPendingQuickAction(action)
    }
  }

  const handleQuickActionConfirm = () => {
    if (pendingQuickAction) {
      bulkKeepCards(pendingQuickAction.cards, pendingQuickAction.type, pendingQuickAction.label)
      setPendingQuickAction(null)
    }
  }

  if (allCards.length === 0 && !isLoading && !error) {
    return null
  }

  const mainDeckDone = remainingCards.length === 0
  const sideboardAvailable = allSideboardCards.length > 0
  const hasMaybes = maybeCards.length > 0
  const categories = getUniqueCategories()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header - clinical top bar */}
      <header className="border-b-2 border-[var(--lumon-black)] p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-[var(--status-neutral)]
                       hover:text-[var(--lumon-black)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M15 19l-7-7 7-7" />
            </svg>
            Exit
          </Link>

          <ViewModeToggle mode={viewMode} onChange={handleViewModeChange} />

          <div className="flex items-center gap-4">
            {hasMaybes && (
              <span className="font-mono text-xs uppercase tracking-wider text-[#8b5a2b]">
                Pending ({formatNumber(maybeCards.length)})
              </span>
            )}
            <button
              onClick={() => setShowKeptModal(true)}
              className="font-mono text-sm uppercase tracking-wider text-[var(--lumon-green)]
                         hover:text-[var(--lumon-green-light)] transition-colors"
            >
              Inventory ({formatNumber(keptCards.length)})
            </button>
          </div>
        </div>
      </header>

      {/* Kept cards modal */}
      <KeptCardsModal isOpen={showKeptModal} onClose={() => setShowKeptModal(false)} />

      {/* Stats panel */}
      <DeckStatsPanel isOpen={showStatsPanel} onToggle={() => setShowStatsPanel(!showStatsPanel)} />

      {/* Quick action confirm modal */}
      <QuickActionConfirmModal
        isOpen={pendingQuickAction !== null}
        action={pendingQuickAction}
        onConfirm={handleQuickActionConfirm}
        onCancel={() => setPendingQuickAction(null)}
      />

      {/* Reviewing maybes banner */}
      {isReviewingMaybes && (
        <div className="bg-[#8b5a2b]/10 border-y border-[#8b5a2b] py-2 px-4">
          <p className="text-center text-terminal text-[#8b5a2b]">
            REVIEWING DEFERRED CARDS
          </p>
        </div>
      )}

      {/* Deck info bar */}
      <div className="border-b border-[var(--grid-line)] py-3 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-terminal text-[var(--status-neutral)]">ACTIVE DECK:</span>
              <h1 className="font-mono text-lg font-bold text-[var(--lumon-black)] truncate max-w-[200px] sm:max-w-none">
                {deckName}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <QuickActionsDropdown
                getRemainingLands={getRemainingLands}
                getRemainingByCategory={getRemainingByCategory}
                categories={categories}
                onActionSelect={handleQuickActionSelect}
              />
              <div className="text-right">
                <span className="text-terminal text-[var(--status-neutral)]">STATUS:</span>
                <p className="font-mono text-sm text-[var(--lumon-green)]">
                  {swipeMode === 'main' ? 'MAIN DECK' : 'SIDEBOARD'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode toggle (if sideboard available) */}
      {sideboardAvailable && (
        <div className="border-b border-[var(--grid-line)] py-3 px-4">
          <div className="flex justify-center gap-0">
            <button
              onClick={() => setSwipeMode('main')}
              className={`px-6 py-2 font-mono text-xs font-semibold uppercase tracking-wider border-2 border-r-0
                         transition-all duration-150 ${
                swipeMode === 'main'
                  ? 'bg-[var(--lumon-black)] text-[var(--lumon-white)] border-[var(--lumon-black)]'
                  : 'bg-transparent text-[var(--lumon-black)] border-[var(--lumon-black)] hover:bg-[var(--lumon-cream)]'
              }`}
            >
              Main ({formatNumber(remainingCards.length)}/{formatNumber(allCards.length)})
            </button>
            <button
              onClick={() => setSwipeMode('sideboard')}
              className={`px-6 py-2 font-mono text-xs font-semibold uppercase tracking-wider border-2
                         transition-all duration-150 ${
                swipeMode === 'sideboard'
                  ? 'bg-[var(--lumon-black)] text-[var(--lumon-white)] border-[var(--lumon-black)]'
                  : 'bg-transparent text-[var(--lumon-black)] border-[var(--lumon-black)] hover:bg-[var(--lumon-cream)]'
              }`}
            >
              Sideboard ({formatNumber(remainingSideboardCards.length)}/{formatNumber(allSideboardCards.length)})
            </button>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="py-6 px-4">
        <ProgressBar current={currentCards.length} total={totalCards} />
        {swipeMode === 'sideboard' && (
          <p className="text-center font-mono text-xs text-[var(--status-warning)] mt-3 uppercase tracking-wider">
            Accept sideboard cards to add to deck
          </p>
        )}
      </div>

      {/* Card stack, skeleton, error, or completion message */}
      <div className="flex-1 flex items-center justify-center px-4 pb-4">
        {isLoading ? (
          <div className="text-center">
            <SkeletonCard />
            <p className="mt-6 text-terminal text-[var(--status-neutral)] tracking-widest animate-pulse">
              LOADING DECK DATA...
            </p>
          </div>
        ) : error ? (
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 border-2 border-[var(--lumon-black)] flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--lumon-black)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-terminal text-[var(--lumon-black)] tracking-widest mb-2">
              INITIALIZATION FAILED
            </p>
            <div className="border-2 border-[var(--lumon-black)] p-4 mb-6 bg-[var(--surface-elevated)]">
              <p className="font-mono text-sm text-[var(--lumon-black)]">{error}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 border-2 border-[var(--lumon-black)]
                         font-mono font-semibold uppercase tracking-wider
                         hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
            >
              Return to Input
            </button>
          </div>
        ) : currentCards.length > 0 ? (
          <CardStack
            cards={currentCards}
            onKeep={keepCard}
            onRemove={removeCard}
            onMaybe={maybeCard}
          />
        ) : (
          <div className="text-center">
            {/* Main deck done with maybes - show review prompt */}
            {mainDeckDone && hasMaybes && !isReviewingMaybes && swipeMode === 'main' && (
              <>
                <div className="w-16 h-16 mx-auto mb-6 border-2 border-[#8b5a2b] flex items-center justify-center">
                  <span className="font-mono text-2xl text-[#8b5a2b]">?</span>
                </div>
                <p className="text-terminal text-[#8b5a2b] tracking-widest mb-2">
                  {formatNumber(maybeCards.length)} CARDS DEFERRED
                </p>
                <p className="font-mono text-sm text-[var(--status-neutral)] mb-6">
                  Review your maybe pile to make final decisions
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={startMaybeReview}
                    className="px-6 py-3 bg-[#8b5a2b] border-2 border-[#8b5a2b]
                               font-mono font-semibold uppercase tracking-wider text-[var(--lumon-white)]
                               hover:opacity-90 transition-all duration-150"
                  >
                    Review Maybes
                  </button>
                  <button
                    onClick={() => navigate('/results')}
                    className="px-6 py-3 border-2 border-[var(--lumon-black)]
                               font-mono font-semibold uppercase tracking-wider
                               hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
                  >
                    Skip to Results
                  </button>
                </div>
              </>
            )}

            {/* Normal completion states */}
            {(!hasMaybes || isReviewingMaybes) && (
              <>
                <div className="w-16 h-16 mx-auto mb-6 border-2 border-[var(--lumon-green)] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[var(--lumon-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-terminal text-[var(--lumon-green)] tracking-widest mb-6">
                  {swipeMode === 'main' ? 'MAIN DECK COMPLETE' : 'SIDEBOARD COMPLETE'}
                </p>
                {mainDeckDone && sideboardAvailable && remainingSideboardCards.length > 0 && swipeMode === 'main' && (
                  <button
                    onClick={() => setSwipeMode('sideboard')}
                    className="px-6 py-3 bg-[var(--lumon-green)] border-2 border-[var(--lumon-green)]
                               font-mono font-semibold uppercase tracking-wider text-[var(--lumon-white)]
                               hover:bg-[var(--lumon-green-light)] transition-all duration-150"
                  >
                    Process Sideboard
                  </button>
                )}
                {(mainDeckDone && (!sideboardAvailable || remainingSideboardCards.length === 0)) && (
                  <button
                    onClick={() => navigate('/results')}
                    className="px-6 py-3 bg-[var(--lumon-green)] border-2 border-[var(--lumon-green)]
                               font-mono font-semibold uppercase tracking-wider text-[var(--lumon-white)]
                               hover:bg-[var(--lumon-green-light)] transition-all duration-150"
                  >
                    View Report
                  </button>
                )}
                {swipeMode === 'sideboard' && remainingSideboardCards.length === 0 && (
                  <button
                    onClick={() => navigate('/results')}
                    className="px-6 py-3 bg-[var(--lumon-green)] border-2 border-[var(--lumon-green)]
                               font-mono font-semibold uppercase tracking-wider text-[var(--lumon-white)]
                               hover:bg-[var(--lumon-green-light)] transition-all duration-150"
                  >
                    View Report
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      {currentCards.length > 0 && (
        <div className="px-4 pb-6">
          <SwipeControls
            onKeep={handleKeep}
            onRemove={handleRemove}
            onMaybe={handleMaybe}
            onUndo={handleUndo}
            canUndo={swipeHistory.length > 0}
            disabled={currentCards.length === 0}
          />
        </div>
      )}

      {/* Keyboard hints */}
      <div className="border-t border-[var(--grid-line)] py-4 px-4">
        <div className="text-center">
          <span className="hidden sm:inline text-terminal text-[var(--status-neutral)]">
            CONTROLS: <kbd className="px-2 py-1 border border-[var(--grid-line)] font-mono text-xs mx-1">←</kbd> REJECT
            <span className="mx-2">|</span>
            <kbd className="px-2 py-1 border border-[var(--grid-line)] font-mono text-xs mx-1">↑</kbd> DEFER
            <span className="mx-2">|</span>
            <kbd className="px-2 py-1 border border-[var(--grid-line)] font-mono text-xs mx-1">→</kbd> ACCEPT
            <span className="mx-2">|</span>
            <kbd className="px-2 py-1 border border-[var(--grid-line)] font-mono text-xs mx-1">Z</kbd> UNDO
          </span>
          <span className="sm:hidden text-terminal text-[var(--status-neutral)]">
            SWIPE: LEFT REJECT, UP DEFER, RIGHT ACCEPT
          </span>
        </div>
      </div>
    </div>
  )
}
