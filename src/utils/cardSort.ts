import type { NormalizedCard, SortOption } from '../types/archidekt'

const COLOR_ORDER: Record<string, number> = { W: 1, U: 2, B: 3, R: 4, G: 5 }

function colorSortValue(colorIdentity: string[]): number {
  if (colorIdentity.length === 0) return 0 // Colorless first
  if (colorIdentity.length === 1) return COLOR_ORDER[colorIdentity[0]] || 6
  // Multicolor: sort by number of colors (fewer first), then by first color in WUBRG order
  const firstColor = Math.min(...colorIdentity.map((c) => COLOR_ORDER[c] || 6))
  return 10 + colorIdentity.length * 10 + firstColor
}

const TYPE_ORDER: Record<string, number> = {
  creature: 0,
  planeswalker: 1,
  instant: 2,
  sorcery: 3,
  artifact: 4,
  enchantment: 5,
  land: 6,
}

function typeSortValue(typeLine: string): number {
  const lower = typeLine.toLowerCase()
  for (const [type, order] of Object.entries(TYPE_ORDER)) {
    if (lower.includes(type)) return order
  }
  return 7
}

export function sortCards(cards: NormalizedCard[], sortOption: SortOption): NormalizedCard[] {
  const sorted = [...cards]

  sorted.sort((a, b) => {
    switch (sortOption) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'cmc-asc':
        if (a.cmc !== b.cmc) return a.cmc - b.cmc
        return a.name.localeCompare(b.name)
      case 'cmc-desc':
        if (a.cmc !== b.cmc) return b.cmc - a.cmc
        return a.name.localeCompare(b.name)
      case 'color': {
        const colorA = colorSortValue(a.colorIdentity)
        const colorB = colorSortValue(b.colorIdentity)
        if (colorA !== colorB) return colorA - colorB
        if (a.cmc !== b.cmc) return a.cmc - b.cmc
        return a.name.localeCompare(b.name)
      }
      case 'type': {
        const typeA = typeSortValue(a.typeLine)
        const typeB = typeSortValue(b.typeLine)
        if (typeA !== typeB) return typeA - typeB
        if (a.cmc !== b.cmc) return a.cmc - b.cmc
        return a.name.localeCompare(b.name)
      }
      default:
        return 0
    }
  })

  return sorted
}

export const SORT_LABELS: Record<SortOption, string> = {
  'name-asc': 'Name (A-Z)',
  'name-desc': 'Name (Z-A)',
  'cmc-asc': 'Mana Cost (Low)',
  'cmc-desc': 'Mana Cost (High)',
  'color': 'Color Identity',
  'type': 'Type',
}
