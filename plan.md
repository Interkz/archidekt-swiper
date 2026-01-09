# Archidekt Swiper - Development Plan

## Completed Work

### Session: Jan 9, 2026 - Severance + Swiss International Style Redesign
**Goal**: Transform UI to Lumon Industries / Severance aesthetic with Swiss typography precision

**Changes Made**:
- [x] Complete design system overhaul in `index.css` (Lumon color palette, JetBrains Mono font)
- [x] Redesigned SwipeCard with ACCEPTED/REJECTED stamps and 3D perspective
- [x] Updated CardStack with physical deck stacking and table contact shadows
- [x] Transformed SwipeControls to brutalist rectangular buttons
- [x] Redesigned HomePage as clinical terminal entry interface
- [x] Updated SwipePage with grid header, ledger progress counter
- [x] Transformed ResultsPage into data report format with table layout
- [x] Updated CategoryModePage with rigid tab sections
- [x] Redesigned all category components (Tabs, Section, Card, Badge)
- [x] Updated KeptCardsModal to grid inventory display
- [x] Made `/wrap` skill global with git operations

**Design Decisions**:
- No traffic light colors (no red/green for bad/good)
- Forest green for positive states, black for negative
- Monospace typography for data/numbers
- 2px borders, no rounded corners
- Terminal-style inputs and labels

**Files Modified**: 17 files across components/, pages/, and index.css

---

### Session: Jan 2026 - UI Redesign (Previous)
**Goal**: Transform dark theme to sleek white modern design with card-on-table aesthetic

**Changes Made**:
- [x] Updated global styles in `index.css` (new color scheme, shadow utilities)
- [x] Redesigned all components with light theme
- [x] Added depth effects to cards (shadows, subtle gradients)
- [x] Modernized buttons with hover/active states
- [x] Updated modals with frosted glass backdrop
- [x] Consistent border-radius and transitions throughout

**Files Modified**: 17 files across components/, pages/, and index.css

---

## Backlog / Future Work

### High Priority
- [ ] **Card Preview Modal**: Click/hover on card to see larger image
- [ ] **Persist Selections**: Save/load deck progress to localStorage with named sessions

### Medium Priority
- [ ] **Dark Mode Toggle**: Add theme switcher (design system already color-neutral)
- [ ] **Drag & Drop in Category Mode**: Reorder cards between Kept/Available
- [ ] **Keyboard Shortcuts Help Modal**: Show all available shortcuts

### Low Priority / Nice to Have
- [ ] **Multiple Deck Comparison**: Compare two decks side-by-side
- [ ] **Commander Zone**: Special handling for commander cards
- [ ] **Export to Moxfield**: Alternative export format
- [ ] **Undo History Panel**: Show list of recent actions

---

## Technical Debt
- None currently identified

## Notes
- App uses Vercel serverless function to proxy Archidekt API (CORS workaround)
- Scryfall API used for card images (no auth required)
- State persisted via Zustand + localStorage
