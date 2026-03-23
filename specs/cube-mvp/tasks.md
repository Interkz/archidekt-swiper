# Cube Manager Tasks

## Task 1: Scryfall proxies + import service [L]
context: [contracts: "scryfallImport service", "Serverless Proxies"]
owns: api/scryfall/collection.ts, api/scryfall/search.ts, src/services/scryfallImport.ts
depends: none
verify: import 10 test cards in browser console, see resolved data + tags

- POST proxy for /cards/collection, GET proxy for /cards/search
- parseCubeList: split newlines, trim, skip comments/empty
- resolveCards: batch 75 names → POST /cards/collection → collect results
- resolveOtags: 10 searches (otag:removal, otag:card-draw, otag:ramp, otag:board-wipe, otag:counterspell, otag:tutor, otag:recursion, otag:mana-dork, otag:mana-rock, otag:card-advantage) → build name→tags Map
- Return CubeCard[] ready for store

## Task 2: Rewrite cubeStore — localStorage persistence, full actions [M]
context: [contracts: "cubeStore"]
owns: src/stores/cubeStore.ts
depends: none (parallel with Task 1)
verify: cubeStore.getState().createCube(...) works in console

- Persist FULL state to localStorage (not just memberName)
- createCube: set cube metadata + 4 default members
- importCards: accepts CubeCard[], sets cards array
- proposeCut/proposeAdd: create Proposal in proposals[]
- castVote: add vote, check threshold, auto-resolve (remove/add card)
- setFilters: color[], type[], tag[] — computed getFilteredCards()
- getStats: mana curve, color dist, type breakdown (from filtered cards)

## Task 3: CubeSetupPage — create + import flow [M]
context: [contracts: "scryfallImport service", "cubeStore"]
owns: src/pages/CubeSetupPage.tsx
depends: Task 1, Task 2
verify: paste Thecube.txt, see progress bar, auto-navigate to browser

- Cube name input (default "The Cube")
- Vote threshold selector (majority/unanimous)
- Textarea for card list
- Import button → shows progress (X/607 resolved, then tagging...)
- On complete → navigate to /cube/:id/browser

## Task 4: CubeBrowserPage — felt table card grid + filters + stats [L]
context: [contracts: "CubeBrowserPage component", "cubeStore"]
owns: src/pages/CubeBrowserPage.tsx, src/components/cube/CardGrid.tsx, src/components/cube/FilterBar.tsx, src/components/cube/CubeStatsPanel.tsx, src/components/cube/CubeNav.tsx
depends: Task 2
verify: see all cards, filter by blue, stats panel shows correct curve

- Port felt-table from cube-preview.html into React
- CardGrid: responsive image grid, hover lift (CSS only, no JS mouse tracking)
- FilterBar: color chips (WUBRG+C+Multi), type chips, tag chips. Toggle on/off. AND within category, OR across.
- CubeStatsPanel: reuse ManaCurveChart + ColorPips + CategoryStats via adapter (CubeCard→NormalizedCard)
- Stats reflect filtered view
- CubeNav: tabs for Dashboard|Browser|Voting|Propose
- Header: cube name, card count, member picker, stats toggle

## Task 5: VotingBoardPage + ProposeChangePage [M]
context: [contracts: "cubeStore"]
owns: src/pages/VotingBoardPage.tsx, src/pages/ProposeChangePage.tsx, src/components/cube/ProposalCard.tsx, src/components/cube/VoteButton.tsx, src/components/cube/CardSearchInput.tsx
depends: Task 2
verify: propose cut, see on voting board, vote, see it resolve

- VotingBoard: list ProposalCards for pending proposals
- ProposalCard: card image, CUT/ADD type, proposer, reason, vote tally, vote buttons
- ProposeChangePage: two modes — "Cut" (select from cube) and "Add" (Scryfall search)
- CardSearchInput: debounced Scryfall search via proxy
- Voting: approve/reject buttons, shows voter names, auto-resolve on threshold

## Task 6: CubeDashboardPage — overview hub [S]
context: [contracts: ALL]
owns: src/pages/CubeDashboardPage.tsx
depends: Task 4, Task 5
verify: /cube/:id shows card count, recent proposals, member list, nav links

- Card count + target size
- Quick stats (avg CMC, color breakdown summary)
- Recent proposals (3 newest)
- Member list
- Quick nav to browser/voting/propose

## Task 7 [VERIFY]: Full flow test
context: [contracts: ALL]
owns: none
depends: ALL
verify: complete flow works

1. /cube/setup → create cube, import Thecube.txt
2. /cube/:id/browser → 607 cards visible, filters work, stats panel works
3. Propose cutting a card → appears on voting board
4. Vote → auto-resolves → card removed from browser
5. Dashboard shows correct counts
