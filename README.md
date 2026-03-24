# Archidekt Swiper

A Tinder-style swipe interface for trimming MTG Commander decks. Paste an [Archidekt](https://archidekt.com) deck URL and swipe through cards to decide what stays and what gets cut.

**Live at [archidekt-swiper.vercel.app](https://archidekt-swiper.vercel.app)**

## What it does

Building a Commander deck often means starting with 200+ cards and cutting down to ~100. Archidekt Swiper makes that process tactile and fun:

1. **Paste** an Archidekt deck URL
2. **Swipe** through cards — right to keep, left to cut, up for maybe
3. **Export** your trimmed list back into Archidekt-compatible format

## Features

- **Swipe Mode** — Tinder-style card swiping with keyboard support (arrow keys + Z to undo)
- **Category Mode** — Browse and select cards organized by deck categories (Draw, Ramp, Removal, etc.)
- **Maybe Pile** — Swipe up to defer tough decisions, review them later
- **Quick Actions** — Bulk keep all lands or entire categories
- **Live Stats** — Real-time mana curve, color distribution, and category breakdown as you build
- **Flexible Export** — Plain list, grouped by type, or with Archidekt category tags

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4
- Zustand (state management)
- react-tinder-card (swipe gestures)
- Vercel (hosting + serverless API proxy)

## Development

```bash
npm install
npm run dev
```

The dev server proxies Archidekt API requests to avoid CORS issues. In production, a Vercel serverless function (`api/deck.ts`) handles the proxy.

## Build

```bash
npm run build
npm run preview    # preview the production build locally
```

## Deployment

Hosted on Vercel with auto-deploy on push. To deploy manually:

```bash
vercel --prod
```

## Design

The UI uses a "Corporate Brutalism" aesthetic inspired by Apple TV's *Severance* — clinical paper-white backgrounds, forest green accents, sharp borders, monospace data displays, and ACCEPTED/REJECTED stamps on swiped cards.

## License

MIT
