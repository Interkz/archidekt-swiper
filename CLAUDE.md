# Archidekt Swiper

## Overview
A Tinder-style swipe app for MTG Commander deckbuilding. Connects to the Archidekt API so users can swipe through cards to keep or cut when trimming decks from 200+ cards down to ~100.

- **Live App**: https://archidekt-swiper.vercel.app
- **GitHub**: https://github.com/Interkz/archidekt-swiper

## Tech Stack
- **Vite + React 18 + TypeScript**
- **Tailwind CSS v4** for styling
- **Zustand** for state management (with localStorage persistence)
- **react-tinder-card** for swipe gestures
- **react-router-dom** for routing
- **Vercel** for hosting + serverless API proxy

## Commands
```bash
npm install        # Install dependencies
npm run dev        # Start dev server (Vite)
npm run build      # Type-check + build for production
npm run lint       # ESLint
npm run preview    # Preview production build
vercel --prod      # Manual deploy to Vercel
```

## Project Structure

```
api/
  deck.ts                        # Vercel serverless proxy for Archidekt API (CORS workaround)
src/
  components/
    CardStack.tsx                # Swipeable card stack (supports up swipe for maybe)
    SwipeCard.tsx                # Individual swipe card with ACCEPTED/REJECTED stamps
    SwipeControls.tsx            # Keep/Remove/Maybe/Undo buttons
    ProgressBar.tsx              # Progress indicator (007/200 ledger style)
    CardDetails.tsx              # Card info display
    DeckInput.tsx                # URL input form
    ViewModeToggle.tsx           # Swipe/Category mode switch
    KeptCardsModal.tsx           # Modal showing all kept cards grouped by category
    QuickActionsDropdown.tsx     # Bulk action dropdown menu
    QuickActionConfirmModal.tsx  # Confirmation for bulk actions
    category/
      CategoryCard.tsx           # Small card display with focus ring
      CategoryLimitBadge.tsx     # "5/12" limit indicator
      CategorySection.tsx        # Kept/Available card rows
      CategoryTabs.tsx           # Horizontal scrollable category tabs
    stats/
      DeckStatsPanel.tsx         # Collapsible stats sidebar
      ManaCurveChart.tsx         # CMC histogram (0-7+)
      ColorPips.tsx              # W/U/B/R/G/C distribution
      DeckSizeGauge.tsx          # Target counter (053/100)
      CategoryStats.tsx          # Category breakdown
  pages/
    HomePage.tsx                 # Deck URL input (route: /)
    SwipePage.tsx                # Main swipe interface (route: /swipe)
    CategoryModePage.tsx         # Category-based selection (route: /category)
    ResultsPage.tsx              # Export kept cards (route: /results)
  stores/
    deckStore.ts                 # Zustand store — all app state and actions
  services/
    archidektApi.ts              # Archidekt API client
    scryfallImages.ts            # Scryfall image URL builder
  utils/
    parseDeckUrl.ts              # Parse Archidekt deck URLs
    exportFormatter.ts           # Export format functions (plain, grouped, with categories)
    deckStats.ts                 # Stats computation utilities
  types/
    archidekt.ts                 # TypeScript interfaces
```

## Key Features

### Swipe Mode
- Tinder-style card swiping: left = remove, right = keep, up = maybe
- Keyboard: arrow keys (left/right/up), Z to undo
- Maybe pile for deferred decisions, reviewable later
- Quick actions: bulk keep lands or entire categories
- Sideboard swiping option

### Category Mode
- Cards organized by Archidekt categories with horizontal tabs
- Kept/Available sections per category with limit badges
- Keyboard: arrows to navigate, up/down to move cards, Tab to switch sections

### Live Stats Panel
- Collapsible sidebar with real-time mana curve, color distribution, category breakdown
- Target counter showing progress toward deck size goal

### Export
- Plain (`1 Card Name`), grouped by type, or with Archidekt category syntax

## API Integration

### Archidekt API (read-only, no auth)
- **Dev**: Vite proxy at `/api/archidekt` -> `https://archidekt.com/api` (see `vite.config.ts`)
- **Prod**: Vercel serverless function at `api/deck.ts` -> `/api/deck?id={deckId}`
- CORS blocked from browsers, hence the proxy

### Scryfall API
- Card images: `https://api.scryfall.com/cards/{scryfallId}?format=image&version={size}`

## Store (deckStore.ts)

Core state: `allCards`, `remainingCards`, `keptCards`, `removedCards`, `maybeCards`, `swipeHistory`

Key actions: `loadDeck`, `keepCard`, `removeCard`, `maybeCard`, `undoLastSwipe`, `bulkKeepCards`, `addCardToKept`, `removeCardFromKept`

View modes: `swipe` | `category`, with category-specific state (`categoryLimits`, `activeCategoryIndex`, etc.)

## Design System

**Theme**: Severance + Swiss International Style ("Corporate Brutalism") — clinical, retro-futuristic Lumon Industries aesthetic.

- **Colors**: Cool paper white (`#f4f4f0`), deep green-black (`#080f0d`), forest green (`#1f4234`). No red/green traffic light colors.
- **Typography**: Helvetica Neue (display/body), JetBrains Mono (terminal/data)
- **UI**: Brutalist rectangles, 2px borders, sharp corners, no rounded corners. Stamps for ACCEPTED/REJECTED/DEFERRED.
- **Animations**: Card flip (`.card-flip-right`/`.card-flip-left`), card enter, stamp fade-in — defined in `src/index.css`

## Deployment
- Vercel auto-deploys on push to GitHub
- `vercel.json` handles SPA routing rewrites
- Serverless function `api/deck.ts` proxies Archidekt API requests
