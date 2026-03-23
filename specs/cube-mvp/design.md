# Cube Manager Design

## Architecture

**No Supabase** — self-host with localStorage + JSON file persistence for now. Zero setup for Emil.

**Scryfall tag strategy without rate limits:**
- Download Scryfall bulk data file (`oracle-cards` — ~80MB JSON, every card once) at build time or first import
- Bulk data includes `oracle_id` for each card but NOT otags
- For otags: query each tag category ONCE (`otag:removal`, `otag:draw`, etc.) — Scryfall allows 10 req/sec, we need ~10 requests total for 10 categories. Each returns ALL cards with that tag. Build a `Set<oracle_id>` per tag.
- Match imported cube cards against tag sets by name (exact match). No per-card API calls.
- Total: ~10 Scryfall requests for tags + 9 batch requests for card resolution = ~19 requests. Well within limits.

**Alternative if rate limited:** Ship oracle_id→tag mapping as a static JSON file generated offline. Zero API calls for tags.

## Storage: localStorage + Zustand persist

- cubeStore persists full state to localStorage (cards, proposals, votes, members)
- Export/import as JSON for backup
- Migrate to Supabase later when sharing is needed

## Contracts

### scryfallImport service
```ts
parseCubeList(text: string): string[]
resolveCards(names: string[]): Promise<ResolvedCard[]>
resolveOtags(names: string[]): Promise<Map<string, string[]>>
importCube(text: string, memberName: string): CubeCard[]
```

### cubeStore (full state, persisted)
```ts
// State
cube: { name, target_size, vote_threshold, created_at }
members: CubeMember[]
cards: CubeCard[]
proposals: Proposal[]
votes: Record<string, Vote[]>
memberName: string | null
activeFilters: { colors: string[], types: string[], tags: string[] }

// Actions
createCube(name, members[], threshold)
importCards(text, memberName)
setFilters(filters)
proposeCut(cardId, reason, memberName)
proposeAdd(scryfallCard, reason, memberName)
castVote(proposalId, vote, memberName)
```

### Serverless Proxies (for CORS)
```
api/scryfall/collection.ts  — POST proxy
api/scryfall/search.ts      — GET proxy
```
