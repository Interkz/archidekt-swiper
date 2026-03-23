export interface ResolvedCard {
  scryfall_id: string
  oracle_id: string
  name: string
  mana_cost: string
  cmc: number
  type_line: string
  color_identity: string[]
  set_code: string
  image_uri: string
}

// Scryfall API types (subset)
interface ScryfallCard {
  id: string
  oracle_id: string
  name: string
  mana_cost?: string
  cmc: number
  type_line: string
  color_identity: string[]
  set: string
  image_uris?: { normal?: string }
  card_faces?: Array<{
    image_uris?: { normal?: string }
    mana_cost?: string
  }>
}

interface ScryfallCollectionResponse {
  data: ScryfallCard[]
  not_found: Array<{ name?: string }>
}

interface ScryfallSearchResponse {
  data: ScryfallCard[]
  has_more: boolean
  next_page?: string
  total_cards: number
}

const OTAG_CATEGORIES = [
  'removal',
  'card-draw',
  'ramp',
  'board-wipe',
  'counterspell',
  'tutor',
  'recursion',
  'mana-dork',
  'mana-rock',
  'card-advantage',
] as const

/**
 * Parse cube list text into unique card names.
 * Skips empty lines, comments (# or //), and section headers.
 */
export function parseCubeList(text: string): string[] {
  const seen = new Set<string>()
  const names: string[] = []

  const lines = text.split('\n')
  for (const raw of lines) {
    const line = raw.trim()

    // Skip empty lines
    if (!line) continue

    // Skip comment lines
    if (line.startsWith('#') || line.startsWith('//')) continue

    // Deduplicate (case-insensitive for comparison, preserve first occurrence casing)
    const key = line.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    names.push(line)
  }

  return names
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function extractImageUri(card: ScryfallCard): string {
  return (
    card.image_uris?.normal ??
    card.card_faces?.[0]?.image_uris?.normal ??
    ''
  )
}

function extractManaCost(card: ScryfallCard): string {
  return card.mana_cost ?? card.card_faces?.[0]?.mana_cost ?? ''
}

function toResolvedCard(card: ScryfallCard): ResolvedCard {
  return {
    scryfall_id: card.id,
    oracle_id: card.oracle_id,
    name: card.name,
    mana_cost: extractManaCost(card),
    cmc: card.cmc,
    type_line: card.type_line,
    color_identity: card.color_identity,
    set_code: card.set,
    image_uri: extractImageUri(card),
  }
}

/**
 * Resolve card names to full card data via Scryfall /cards/collection.
 * Batches 75 at a time with 100ms delay between batches.
 */
export async function resolveCards(
  names: string[],
  onProgress?: (resolved: number, total: number) => void,
): Promise<ResolvedCard[]> {
  const results: ResolvedCard[] = []
  const batchSize = 75

  for (let i = 0; i < names.length; i += batchSize) {
    const batch = names.slice(i, i + batchSize)
    const identifiers = batch.map((name) => ({ name }))

    const response = await fetch('/api/scryfall/collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifiers }),
    })

    if (!response.ok) {
      throw new Error(`Scryfall collection API error: ${response.status}`)
    }

    const data: ScryfallCollectionResponse = await response.json()

    // Log not_found cards as warnings
    if (data.not_found?.length > 0) {
      const notFoundNames = data.not_found
        .map((nf) => nf.name ?? 'unknown')
        .join(', ')
      console.warn(`Scryfall: cards not found: ${notFoundNames}`)
    }

    for (const card of data.data) {
      results.push(toResolvedCard(card))
    }

    onProgress?.(results.length, names.length)

    // Delay between batches (skip after last batch)
    if (i + batchSize < names.length) {
      await delay(100)
    }
  }

  return results
}

/**
 * Fetch all pages of a Scryfall search query.
 */
async function fetchAllSearchPages(query: string): Promise<ScryfallCard[]> {
  const cards: ScryfallCard[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const params = new URLSearchParams({ q: query, page: String(page) })
    const response = await fetch(`/api/scryfall/search?${params.toString()}`)

    if (!response.ok) {
      // 404 means no results for this query — not an error
      if (response.status === 404) break
      throw new Error(`Scryfall search API error: ${response.status}`)
    }

    const data: ScryfallSearchResponse = await response.json()
    cards.push(...data.data)
    hasMore = data.has_more
    page++

    // Rate limit: 100ms between requests
    if (hasMore) {
      await delay(100)
    }
  }

  return cards
}

/**
 * Query Scryfall for otag categories, return name->tags mapping.
 * Only returns entries for the provided cardNames.
 */
export async function resolveOtags(
  cardNames: string[],
  onProgress?: (category: string) => void,
): Promise<Map<string, string[]>> {
  const tagMap = new Map<string, string[]>()
  const nameSet = new Set(cardNames.map((n) => n.toLowerCase()))

  for (const category of OTAG_CATEGORIES) {
    onProgress?.(category)

    const cards = await fetchAllSearchPages(`otag:${category}`)

    for (const card of cards) {
      const key = card.name.toLowerCase()
      if (!nameSet.has(key)) continue

      const existing = tagMap.get(key)
      if (existing) {
        existing.push(category)
      } else {
        tagMap.set(key, [category])
      }
    }

    // Rate limit: 100ms between category queries
    await delay(100)
  }

  return tagMap
}
