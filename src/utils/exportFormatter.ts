import type { NormalizedCard } from '../types/archidekt'

/**
 * Format cards for Archidekt import (plain text, one card per line)
 */
export function formatForArchidektImport(cards: NormalizedCard[]): string {
  return cards.map((card) => `${card.quantity} ${card.name}`).join('\n')
}

/**
 * Format cards grouped by their Archidekt categories
 */
export function formatWithCategories(cards: NormalizedCard[]): string {
  const grouped = groupByArchidektCategory(cards)
  let output = ''

  // Sort categories alphabetically, but put Commander first if present
  const categories = Object.keys(grouped).sort((a, b) => {
    if (a.toLowerCase() === 'commander') return -1
    if (b.toLowerCase() === 'commander') return 1
    return a.localeCompare(b)
  })

  for (const category of categories) {
    const categoryCards = grouped[category]
    if (categoryCards && categoryCards.length > 0) {
      output += `// ${category} (${categoryCards.length})\n`
      categoryCards.forEach((card) => {
        output += `${card.quantity} ${card.name}\n`
      })
      output += '\n'
    }
  }

  return output.trim()
}

/**
 * Format cards with Archidekt inline category syntax: `1 Card Name \`Category\``
 * This format allows re-importing with categories preserved
 */
export function formatWithArchidektCategories(cards: NormalizedCard[]): string {
  return cards.map((card) => {
    // Find the primary category (exclude sideboard/maybeboard/commander)
    const category = card.categories.find(c =>
      !['sideboard', 'maybeboard', 'commander'].includes(c.toLowerCase())
    )

    return category
      ? `${card.quantity} ${card.name} \`${category}\``
      : `${card.quantity} ${card.name}`
  }).join('\n')
}

function groupByArchidektCategory(cards: NormalizedCard[]): Record<string, NormalizedCard[]> {
  const groups: Record<string, NormalizedCard[]> = {}

  cards.forEach((card) => {
    // Use the first non-empty category, or "Uncategorized" if none
    const category = card.categories.find(c =>
      c.toLowerCase() !== 'maybeboard' &&
      c.toLowerCase() !== 'sideboard'
    ) || 'Uncategorized'

    if (!groups[category]) groups[category] = []
    groups[category].push(card)
  })

  return groups
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  }
}

/**
 * Download text as a file
 */
export function downloadAsFile(text: string, filename: string): void {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
