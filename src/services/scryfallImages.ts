type ImageVersion = 'small' | 'normal' | 'large' | 'png'

export function getCardImageUrl(
  scryfallId: string,
  version: ImageVersion = 'normal'
): string {
  return `https://api.scryfall.com/cards/${scryfallId}?format=image&version=${version}`
}

export function preloadImages(scryfallIds: string[], version: ImageVersion = 'normal'): void {
  scryfallIds.forEach((id) => {
    const img = new Image()
    img.src = getCardImageUrl(id, version)
  })
}
