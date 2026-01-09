# Archidekt Swiper - Project Summary

## Links
- **Live App**: https://archidekt-swiper.vercel.app
- **GitHub**: https://github.com/Interkz/archidekt-swiper

## Overview
A Tinder-style swipe app for MTG Commander deckbuilding that connects to the Archidekt API. Users can swipe to keep or remove cards when trimming decks from 200+ cards down to ~100.

## Tech Stack
- **Vite + React 18 + TypeScript**
- **Tailwind CSS v4** for styling
- **Zustand** for state management (with localStorage persistence)
- **react-tinder-card** for swipe gestures
- **react-router-dom** for routing

## Project Structure

```
api/
└── deck.ts                    # Vercel serverless proxy for Archidekt API
src/
├── components/
│   ├── CardStack.tsx          # Swipeable card stack
│   ├── SwipeCard.tsx          # Individual swipe card
│   ├── SwipeControls.tsx      # Keep/Remove/Undo buttons
│   ├── ProgressBar.tsx        # Progress indicator
│   ├── CardDetails.tsx        # Card info display
│   ├── DeckInput.tsx          # URL input form
│   ├── ViewModeToggle.tsx     # Swipe/Category mode switch
│   ├── KeptCardsModal.tsx     # Modal showing all kept cards
│   └── category/
│       ├── CategoryCard.tsx       # Small card display with focus ring
│       ├── CategoryLimitBadge.tsx # "5/12" limit indicator
│       ├── CategorySection.tsx    # Kept/Available card rows
│       └── CategoryTabs.tsx       # Horizontal category tabs
├── pages/
│   ├── HomePage.tsx           # Deck URL input
│   ├── SwipePage.tsx          # Main swipe interface
│   ├── CategoryModePage.tsx   # Category-based selection
│   └── ResultsPage.tsx        # Export kept cards
├── stores/
│   └── deckStore.ts           # Zustand store with all state
├── services/
│   ├── archidektApi.ts        # Archidekt API client
│   └── scryfallImages.ts      # Scryfall image URLs
├── utils/
│   ├── urlParser.ts           # Parse Archidekt deck URLs
│   └── exportFormatter.ts     # Export format functions
└── types/
    └── archidekt.ts           # TypeScript interfaces
```

## Key Features

### 1. Swipe Mode (Original)
- Tinder-style card swiping (left=remove, right=keep)
- Keyboard support: ←/→ arrow keys, Z to undo
- Sideboard swiping option
- Progress bar showing cards remaining

### 2. Category Mode (New)
- Browse cards organized by Archidekt categories
- Horizontal scrollable category tabs with limit badges
- Two sections per category: Kept and Available
- Keyboard navigation:
  - `←`/`→` - Navigate between cards
  - `↑` - Move card from Available to Kept
  - `↓` - Move card from Kept to Available
  - `Tab` - Switch between sections
- Category limits (e.g., "max 12 Draw cards")

### 3. View Kept Anytime
- "View Kept (N)" button in header
- Opens modal showing all kept cards grouped by category
- Available in both Swipe and Category modes

### 4. Export Formats
Three options in ResultsPage:
1. **Plain**: `1 Card Name`
2. **Grouped by Type**: Cards under `// Category (count)` headers
3. **With Categories**: `1 Card Name \`Category\`` (Archidekt import syntax)

## Routes
- `/` - HomePage (deck URL input)
- `/swipe` - SwipePage (swipe mode)
- `/category` - CategoryModePage (category mode)
- `/results` - ResultsPage (export)

## API Integration

### Archidekt API
- Read-only, no write endpoints
- CORS blocked from browsers - requires proxy solution

**Development**: Vite proxy in `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api/archidekt': {
      target: 'https://archidekt.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/archidekt/, '/api'),
    },
  },
}
```

**Production**: Vercel serverless function at `api/deck.ts`:
- Endpoint: `/api/deck?id={deckId}`
- Proxies requests to `https://archidekt.com/api/decks/{id}/`

### Scryfall API
- Used for card images: `https://api.scryfall.com/cards/{scryfallId}?format=image&version={size}`

## Store Structure (deckStore.ts)

```typescript
// Core state
deckName, deckUrl
allCards, remainingCards, keptCards, removedCards
allSideboardCards, remainingSideboardCards
swipeHistory: SwipeAction[]
swipeMode: 'main' | 'sideboard'

// Category mode state
viewMode: 'swipe' | 'category'
categoryLimits: Record<string, number>
activeCategoryIndex: number
activeSection: 'kept' | 'available'
activeCardIndex: number

// Actions
loadDeck, keepCard, removeCard, undoLastSwipe
setSwipeMode, setViewMode, setCategoryLimit
setActiveCategoryIndex, setActiveSection, setActiveCardIndex
addCardToKept, removeCardFromKept, resetDeck, clearState

// Selectors
getUniqueCategories, getCategoryKeptCards, getCategoryAvailableCards, canAddToCategory
```

## Known Issues Fixed
1. **Blank screen**: Missing `@react-spring/web` peer dependency - installed it
2. **CORS errors**: Added Vite proxy for Archidekt API
3. **Build errors**: Fixed unused variables, missing image URL property

## Development Commands
```bash
npm run dev    # Start dev server
npm run build  # Build for production
```

## Deployment
- **Hosting**: Vercel (auto-deploys on push to GitHub)
- **Serverless Function**: `api/deck.ts` handles CORS proxy
- **Config**: `vercel.json` for SPA routing rewrites

To deploy manually:
```bash
vercel --prod
```

## Design System (Updated Jan 2026)

### Theme: Severance + Swiss International Style ("Corporate Brutalism")
Clinical, retro-futuristic aesthetic inspired by Lumon Industries from Apple TV's Severance, combined with Swiss International typographic precision. The UI feels like a corporate mainframe terminal meets physical card manipulation.

### Color Palette ("The Lumon Void")
```css
--lumon-white: #f4f4f0;      /* Cool paper white, fluorescent-lit */
--lumon-cream: #e8e8e4;      /* Slightly darker for contrast */
--lumon-black: #080f0d;      /* Deep almost-green black */
--lumon-green: #1f4234;      /* Severance forest green accent */
--lumon-green-light: #2d5a47; /* Lighter green for hover states */
--lumon-green-pale: #d4e5dc;  /* Very pale green for backgrounds */
--grid-line: #c8c8c4;         /* Visible ledger lines */
--status-neutral: #6b6b68;    /* Muted gray */
```

**Key Design Decision**: No traffic light colors (red/green for good/bad). Instead:
- Forest green (`--lumon-green`) for positive/accept states
- Black (`--lumon-black`) for negative/reject states

### Typography
- **Display**: Helvetica Neue (tight, bold, -0.03em letter-spacing)
- **Monospace**: JetBrains Mono (terminal/data aesthetic)
- **Body**: Helvetica Neue

### UI Patterns
- **Borders**: 2px solid black for primary elements, 1px grid lines for structure
- **Buttons**: Brutalist rectangles with thick borders, fill on hover
- **Inputs**: Terminal-style with 2px black borders, green focus state
- **Progress**: Ledger-style counter with padded numbers (007/200)
- **Stamps**: ACCEPTED/REJECTED indicators with fill patterns

### Shadow Classes (defined in `index.css`)
```css
.card-shadow        /* Subtle contact shadow */
.card-shadow-lg     /* Elevated card being picked up */
.card-shadow-hover  /* Hover state - card lifting */
.table-contact-shadow /* Where card meets surface */
```

### Animation Classes
```css
.card-flip-right    /* 3D flip animation for accept */
.card-flip-left     /* 3D flip animation for reject */
.card-enter         /* Card sliding up into stack */
.stamp-visible      /* Stamp fade-in */
```

### Component Styling Conventions
- Buttons: Transparent bg with 2px borders, fills with color on hover
- Inputs: White bg, 2px black border, green focus ring
- Cards: Sharp corners, subtle shadows, no rounded corners
- Active states: Black bg with white text
- Modal backdrop: `modal-backdrop` class with blur

## Future Enhancements to Consider
- Card preview on hover/click (larger image modal)
- Drag and drop in category mode
- Save/load deck selections to localStorage
- Multiple deck comparison
- Commander zone handling
- Dark mode toggle (design system supports it)
