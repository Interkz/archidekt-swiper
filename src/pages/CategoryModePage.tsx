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
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-500 text-lg mb-4">No categories found in this deck.</p>
        <button
          onClick={() => navigate('/swipe')}
          className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl font-semibold text-white
                     transition-all duration-200 hover:shadow-lg hover:shadow-violet-200"
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
              className="w-24 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-sm
                         focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSetLimit()
                if (e.key === 'Escape') setShowLimitInput(false)
              }}
            />
            <button
              onClick={handleSetLimit}
              className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm text-white font-medium transition-colors"
            >
              Set
            </button>
            <button
              onClick={() => setShowLimitInput(false)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm text-slate-600 font-medium transition-colors"
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
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
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
      <div className="text-center text-slate-400 text-xs mt-4 space-y-1">
        <p>
          <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px]">←</kbd>
          <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px] ml-1">→</kbd>
          {' '}Navigate cards
          <span className="mx-2 text-slate-300">|</span>
          <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px]">↑</kbd>
          {' '}Keep
          <span className="mx-2 text-slate-300">|</span>
          <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px]">↓</kbd>
          {' '}Remove
        </p>
        <p>
          <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-mono text-[10px]">Tab</kbd>
          {' '}Switch sections
        </p>
      </div>
    </div>
  )
}
