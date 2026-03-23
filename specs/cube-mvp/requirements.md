# Cube MVP Requirements

## User Stories

### US1: Import Cube
As Emil, I paste a card list (Thecube.txt format — one card name per line), and the system resolves each card via Scryfall, tags them with otag categories, and stores everything in Supabase.
- AC: 607 cards imported with scryfall_id, image_uri, cmc, type_line, color_identity, tags[]
- AC: Import shows progress (X of 607)
- AC: Scryfall otag categories applied: removal, card-draw, ramp, board-wipe, counterspell, tutor, recursion, mana-dork, mana-rock

### US2: Browse Cube
As a cube member, I see all cards in a grid with card images from Scryfall.
- AC: Green felt table layout (from cube-preview.html prototype)
- AC: Cards display with hover lift effect
- AC: Card count shown in header

### US3: Filter Cards
As a cube member, I filter cards by color identity (W/U/B/R/G/C/Multi), card type (Creature, Instant, Sorcery, Enchantment, Artifact, Land, Planeswalker), and Scryfall tags (removal, draw, ramp, etc).
- AC: Filter bar with clickable tags
- AC: Multiple filters composable (e.g., Blue + Instant)
- AC: Card count updates to reflect filtered results

### US4: Stats Dashboard
As a cube member, I see analytics: mana curve, color distribution, type breakdown.
- AC: Reuse existing ManaCurveChart, ColorPips, CategoryStats components
- AC: Stats update when filters are applied (show stats for filtered subset)
- AC: Collapsible stats panel (reuse DeckStatsPanel pattern)

### US5: Member Profiles
As a cube member, I select my name from the 4 hardcoded players.
- AC: Name persisted in localStorage
- AC: Name shown in header
- AC: Name attached to proposals/votes

### US6: Propose Changes
As a cube member, I propose cutting a card or adding a new card.
- AC: "Propose Cut" button on each card in browser
- AC: "Propose Add" page with Scryfall card search
- AC: Proposal shows card image, proposer name, reason (optional)

### US7: Vote on Proposals
As a cube member, I see pending proposals and vote approve/reject.
- AC: Voting board shows all pending proposals
- AC: Shows who voted and how
- AC: Configurable threshold (majority/unanimous)
- AC: When threshold met, proposal auto-resolves (card added/removed from cube)

## Scope Out
- Real authentication (Google login etc.) — hardcoded names for now
- Real-time Supabase subscriptions — polling or manual refresh OK for tonight
- Change history page — nice-to-have, not blocking
- Mobile responsiveness — desktop-first tonight
