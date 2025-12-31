import { useEffect, useCallback, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDeckStore } from '../stores/deckStore'
import CategoryTabs from '../components/category/CategoryTabs'
import CategorySection from '../components/category/CategorySection'
import ViewModeToggle from '../components/ViewModeToggle'
import KeptCardsModal from '../components/KeptCardsModal'
import type { NormalizedCard, ViewMode } from '../types/archidekt'

export default function CategoryModePage() {
  const navigate = useNavigate()
  const [showLimitInput, setShowLimitInput] = useState(false)
  const [limitValue, setLimitValue] = useState('')
  const [showKeptModal, setShowKeptModal] = useState(false)

  const {
    deckName,
    allCards,
    keptCards,
    viewMode,
    categoryLimits,
    activeCategoryIndex,
    activeSection,
    activeCardIndex,
    setViewMode,
    setCategoryLimit,
    setActiveCategoryIndex,
    setActiveSection,
    setActiveCardIndex,
    addCardToKept,
    removeCardFromKept,
    getUniqueCategories,
    getCategoryKeptCards,
    getCategoryAvailableCards,
    canAddToCategory,
  } = useDeckStore()

  const categories = getUniqueCategories()
  const activeCategory = categories[activeCategoryIndex] || ''
  const keptInCategory = activeCategory ? getCategoryKeptCards(activeCategory) : []
  const availableInCategory = activeCategory ? getCategoryAvailableCards(activeCategory) : []
  const currentLimit = categoryLimits[activeCategory] || null

  // Current section's cards
  const currentCards = activeSection === 'kept' ? keptInCategory : availableInCategory

  // Redirect if no deck loaded
  useEffect(() => {
    if (allCards.length === 0) {
      navigate('/')
    }
  }, [allCards, navigate])

  // Handle view mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    if (mode === 'swipe') {
      navigate('/swipe')
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showLimitInput) return // Don't handle keys when editing limit

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          setActiveCardIndex(Math.max(0, activeCardIndex - 1))
          break

        case 'ArrowRight':
          e.preventDefault()
          setActiveCardIndex(Math.min(currentCards.length - 1, activeCardIndex + 1))
          break

        case 'ArrowUp':
          e.preventDefault()
          if (activeSection === 'available' && currentCards[activeCardIndex]) {
            const card = currentCards[activeCardIndex]
            if (canAddToCategory(activeCategory)) {
              addCardToKept(card)
              // Adjust index if we removed a card
              if (activeCardIndex >= availableInCategory.length - 1) {
                setActiveCardIndex(Math.max(0, activeCardIndex - 1))
              }
            }
          } else if (activeSection === 'kept') {
            // Switch to available section
            setActiveSection('available')
          }
          break

        case 'ArrowDown':
          e.preventDefault()
          if (activeSection === 'kept' && currentCards[activeCardIndex]) {
            const card = currentCards[activeCardIndex]
            removeCardFromKept(card)
            // Adjust index if we removed a card
            if (activeCardIndex >= keptInCategory.length - 1) {
              setActiveCardIndex(Math.max(0, activeCardIndex - 1))
            }
          } else if (activeSection === 'available') {
            // Switch to kept section
            setActiveSection('kept')
          }
          break

        case 'Tab':
          e.preventDefault()
          setActiveSection(activeSection === 'kept' ? 'available' : 'kept')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    activeCardIndex,
    activeSection,
    activeCategory,
    currentCards,
    availableInCategory,
    keptInCategory,
    showLimitInput,
    canAddToCategory,
    addCardToKept,
    removeCardFromKept,
    setActiveCardIndex,
    setActiveSection,
  ])

  const handleCardClick = useCallback(
    (_card: NormalizedCard, index: number, section: 'kept' | 'available') => {
      setActiveSection(section)
      setActiveCardIndex(index)
    },
    [setActiveSection, setActiveCardIndex]
  )

  const handleSetLimit = () => {
    const limit = parseInt(limitValue, 10)
    if (!isNaN(limit) && limit >= 0) {
      setCategoryLimit(activeCategory, limit)
    }
    setShowLimitInput(false)
    setLimitValue('')
  }

  if (allCards.length === 0) {
    return null
  }

  if (categories.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-gray-400 text-lg mb-4">No categories found in this deck.</p>
        <button
          onClick={() => navigate('/swipe')}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
        >
          Use Swipe Mode
        </button>
      </div>
    )
  }

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

      {/* Category tabs */}
      <div className="mb-4">
        <CategoryTabs
          categories={categories}
          activeIndex={activeCategoryIndex}
          categoryLimits={categoryLimits}
          getCategoryKeptCount={(cat) => getCategoryKeptCards(cat).length}
          onTabClick={setActiveCategoryIndex}
        />
      </div>

      {/* Limit setting */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {showLimitInput ? (
          <>
            <input
              type="number"
              min="0"
              value={limitValue}
              onChange={(e) => setLimitValue(e.target.value)}
              placeholder="Max cards"
              className="w-24 px-2 py-1 bg-white/10 rounded text-white text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSetLimit()
                if (e.key === 'Escape') setShowLimitInput(false)
              }}
            />
            <button
              onClick={handleSetLimit}
              className="px-2 py-1 bg-purple-600 rounded text-sm"
            >
              Set
            </button>
            <button
              onClick={() => setShowLimitInput(false)}
              className="px-2 py-1 bg-white/10 rounded text-sm"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setLimitValue(currentLimit?.toString() || '')
              setShowLimitInput(true)
            }}
            className="text-sm text-gray-400 hover:text-white"
          >
            {currentLimit ? `Limit: ${currentLimit}` : 'Set limit'} for {activeCategory}
          </button>
        )}
      </div>

      {/* Card sections */}
      <div className="flex-1 space-y-4">
        <CategorySection
          title="Kept"
          cards={keptInCategory}
          isActiveSection={activeSection === 'kept'}
          activeCardIndex={activeCardIndex}
          onCardClick={(card, index) => handleCardClick(card, index, 'kept')}
        />

        <CategorySection
          title="Available"
          cards={availableInCategory}
          isActiveSection={activeSection === 'available'}
          activeCardIndex={activeCardIndex}
          onCardClick={(card, index) => handleCardClick(card, index, 'available')}
          limitReached={!canAddToCategory(activeCategory)}
        />
      </div>

      {/* Keyboard hints */}
      <div className="text-center text-gray-500 text-xs mt-4 space-y-1">
        <p>
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded">←</kbd>
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded ml-1">→</kbd>
          {' '}Navigate cards
          <span className="mx-2">|</span>
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑</kbd>
          {' '}Keep
          <span className="mx-2">|</span>
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↓</kbd>
          {' '}Remove
        </p>
        <p>
          <kbd className="px-1.5 py-0.5 bg-white/10 rounded">Tab</kbd>
          {' '}Switch sections
        </p>
      </div>
    </div>
  )
}
