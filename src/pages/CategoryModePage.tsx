import { useEffect, useCallback, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDeckStore } from '../stores/deckStore'
import { useFavoritesStore } from '../stores/favoritesStore'
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
  const favoritesCount = useFavoritesStore((s) => s.favorites.length)

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

  // Format numbers with leading zeros
  const formatNumber = (n: number) => n.toString().padStart(3, '0')

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
        <div className="w-16 h-16 border-2 border-[var(--grid-line)] flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-[var(--status-neutral)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="square" strokeLinejoin="miter" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-terminal text-[var(--status-neutral)] mb-6">NO CATEGORIES DETECTED</p>
        <button
          onClick={() => navigate('/swipe')}
          className="px-6 py-3 bg-[var(--lumon-green)] border-2 border-[var(--lumon-green)]
                     font-mono font-semibold uppercase tracking-wider text-[var(--lumon-white)]
                     hover:bg-[var(--lumon-green-light)] transition-all duration-150"
        >
          Use Swipe Mode
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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
            <Link
              to="/favorites"
              className="relative font-mono text-sm uppercase tracking-wider text-[var(--lumon-black)]
                         hover:text-[var(--lumon-green)] transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {favoritesCount > 0 && (
                <span className="absolute -top-2 -right-3 min-w-[16px] h-4 px-1 flex items-center justify-center
                                 bg-[var(--lumon-green)] text-[var(--lumon-white)] font-mono text-[10px] font-bold">
                  {favoritesCount}
                </span>
              )}
            </Link>
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

      {/* Deck info */}
      <div className="border-b border-[var(--grid-line)] py-3 px-4">
        <div className="max-w-4xl mx-auto">
          <span className="text-terminal text-[var(--status-neutral)]">ACTIVE DECK:</span>
          <h1 className="font-mono text-lg font-bold text-[var(--lumon-black)] truncate">
            {deckName}
          </h1>
        </div>
      </div>

      <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
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
        <div className="flex items-center justify-center gap-3 mb-6 py-3 border-y border-[var(--grid-line)]">
          {showLimitInput ? (
            <>
              <input
                type="number"
                min="0"
                value={limitValue}
                onChange={(e) => setLimitValue(e.target.value)}
                placeholder="Max"
                className="w-20 px-3 py-2 border-2 border-[var(--lumon-black)] font-mono text-sm
                           focus:border-[var(--lumon-green)] focus:outline-none transition-colors"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSetLimit()
                  if (e.key === 'Escape') setShowLimitInput(false)
                }}
              />
              <button
                onClick={handleSetLimit}
                className="px-4 py-2 bg-[var(--lumon-green)] border-2 border-[var(--lumon-green)]
                           font-mono text-xs font-semibold uppercase text-[var(--lumon-white)]
                           hover:bg-[var(--lumon-green-light)] transition-colors"
              >
                Set
              </button>
              <button
                onClick={() => setShowLimitInput(false)}
                className="px-4 py-2 border-2 border-[var(--lumon-black)] font-mono text-xs font-semibold uppercase
                           hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-colors"
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
              className="font-mono text-sm text-[var(--status-neutral)] hover:text-[var(--lumon-black)] transition-colors"
            >
              {currentLimit ? `LIMIT: ${currentLimit}` : 'SET LIMIT'} // {activeCategory.toUpperCase()}
            </button>
          )}
        </div>

        {/* Card sections */}
        <div className="space-y-6">
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
      </div>

      {/* Keyboard hints */}
      <div className="border-t border-[var(--grid-line)] py-4 px-4">
        <div className="text-center space-y-1">
          <p className="text-terminal text-[var(--status-neutral)]">
            <kbd className="px-2 py-1 border border-[var(--grid-line)] font-mono text-xs mx-1">←</kbd>
            <kbd className="px-2 py-1 border border-[var(--grid-line)] font-mono text-xs mx-1">→</kbd>
            NAVIGATE
            <span className="mx-3">|</span>
            <kbd className="px-2 py-1 border border-[var(--grid-line)] font-mono text-xs mx-1">↑</kbd>
            ACCEPT
            <span className="mx-3">|</span>
            <kbd className="px-2 py-1 border border-[var(--grid-line)] font-mono text-xs mx-1">↓</kbd>
            REJECT
          </p>
          <p className="text-terminal text-[var(--status-neutral)]">
            <kbd className="px-2 py-1 border border-[var(--grid-line)] font-mono text-xs mx-1">Tab</kbd>
            SWITCH SECTIONS
          </p>
        </div>
      </div>
    </div>
  )
}
