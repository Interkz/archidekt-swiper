/**
 * Extract deck ID from an Archidekt URL or raw deck ID
 * Supports formats:
 * - https://archidekt.com/decks/123456
 * - https://archidekt.com/decks/123456/deck-name
 * - archidekt.com/decks/123456
 * - 123456
 */
export function parseDeckUrl(input: string): string | null {
  const trimmed = input.trim()

  // If it's just a number, return it
  if (/^\d+$/.test(trimmed)) {
    return trimmed
  }

  // Try to extract from URL
  const urlMatch = trimmed.match(/archidekt\.com\/decks\/(\d+)/)
  if (urlMatch) {
    return urlMatch[1]
  }

  return null
}
