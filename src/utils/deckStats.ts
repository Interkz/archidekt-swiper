import type { NormalizedCard } from '../types/archidekt'

export interface ManaCurveData {
  cmc: number
  count: number
}

export interface ColorDistribution {
  W: number // White
  U: number // Blue
  B: number // Black
  R: number // Red
  G: number // Green
  C: number // Colorless
}

export interface CategoryCount {
  name: string
  count: number
}

export interface DeckStats {
  totalKept: number
  targetSize: number
  manaCurve: ManaCurveData[]
  colorDistribution: ColorDistribution
  categoryBreakdown: CategoryCount[]
  averageCmc: number
}

export function computeManaCurve(cards: NormalizedCard[]): ManaCurveData[] {
  const curveMap = new Map<number, number>()

  cards.forEach((card) => {
    // Cap CMC at 7+ for display
    const bucket = Math.min(Math.floor(card.cmc), 7)
    curveMap.set(bucket, (curveMap.get(bucket) || 0) + card.quantity)
  })

  // Return buckets 0-7
  return Array.from({ length: 8 }, (_, i) => ({
    cmc: i,
    count: curveMap.get(i) || 0,
  }))
}

export function computeColorDistribution(cards: NormalizedCard[]): ColorDistribution {
  const colors: ColorDistribution = { W: 0, U: 0, B: 0, R: 0, G: 0, C: 0 }

  cards.forEach((card) => {
    const identity = card.colorIdentity || []
    if (identity.length === 0) {
      colors.C += card.quantity
    } else {
      identity.forEach((color) => {
        if (color in colors) {
          colors[color as keyof ColorDistribution] += card.quantity
        }
      })
    }
  })

  return colors
}

export function computeCategoryBreakdown(
  cards: NormalizedCard[],
  uniqueCategories: string[]
): CategoryCount[] {
  const counts = new Map<string, number>()

  cards.forEach((card) => {
    card.categories.forEach((cat) => {
      counts.set(cat, (counts.get(cat) || 0) + card.quantity)
    })
  })

  return uniqueCategories
    .map((name) => ({ name, count: counts.get(name) || 0 }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
}

export function computeAverageCmc(cards: NormalizedCard[]): number {
  if (cards.length === 0) return 0

  // Exclude lands from average CMC calculation
  const nonLandCards = cards.filter(
    (card) => !card.typeLine.toLowerCase().includes('land')
  )

  if (nonLandCards.length === 0) return 0

  const total = nonLandCards.reduce((sum, card) => sum + card.cmc * card.quantity, 0)
  const count = nonLandCards.reduce((sum, card) => sum + card.quantity, 0)
  return count > 0 ? total / count : 0
}

export function computeTotalCards(cards: NormalizedCard[]): number {
  return cards.reduce((sum, card) => sum + card.quantity, 0)
}
