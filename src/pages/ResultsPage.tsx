import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDeckStore } from '../stores/deckStore'
import {
  formatForArchidektImport,
  formatWithCategories,
  formatWithArchidektCategories,
  copyToClipboard,
  downloadAsFile,
  formatDecisionsAsJson,
  formatDecisionsAsText,
} from '../utils/exportFormatter'

type ExportFormat = 'plain' | 'grouped' | 'archidekt'

export default function ResultsPage() {
  const navigate = useNavigate()
  const { deckName, keptCards, removedCards, maybeCards, allCards, clearState, resetDeck } = useDeckStore()
  const [exportFormat, setExportFormat] = useState<ExportFormat>('archidekt')
  const [copied, setCopied] = useState(false)
  const [decisionsCopied, setDecisionsCopied] = useState(false)

  // Format numbers with leading zeros
  const formatNumber = (n: number) => n.toString().padStart(3, '0')

  const getExportText = () => {
    switch (exportFormat) {
      case 'grouped':
        return formatWithCategories(keptCards)
      case 'archidekt':
        return formatWithArchidektCategories(keptCards)
      default:
        return formatForArchidektImport(keptCards)
    }
  }

  const exportText = getExportText()

  const handleCopy = async () => {
    await copyToClipboard(exportText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const safeName = deckName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    downloadAsFile(exportText, `${safeName}_trimmed.txt`)
  }

  const handleStartOver = () => {
    clearState()
    navigate('/')
  }

  const handleSwipeAgain = () => {
    resetDeck()
    navigate('/swipe')
  }

  if (allCards.length === 0) {
    navigate('/')
    return null
  }

  const deckComplete = keptCards.length === 100
  const cardDifference = 100 - keptCards.length

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b-2 border-[var(--lumon-black)] p-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-[var(--status-neutral)]
                       hover:text-[var(--lumon-black)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="square" strokeLinejoin="miter" d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <span className="text-terminal text-[var(--lumon-green)]">SORTING COMPLETE</span>
        </div>
      </header>

      <div className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Deck name */}
        <div className="mb-6 pb-4 border-b border-[var(--grid-line)]">
          <span className="text-terminal text-[var(--status-neutral)]">DECK:</span>
          <h1 className="font-mono text-xl font-bold text-[var(--lumon-black)]">{deckName}</h1>
        </div>

        {/* Stats table */}
        <div className="mb-6">
          <div className="text-terminal text-[var(--status-neutral)] mb-3">INVENTORY REPORT</div>
          <div className="border-2 border-[var(--lumon-black)]">
            {/* Header row */}
            <div className={`grid ${maybeCards.length > 0 ? 'grid-cols-4' : 'grid-cols-3'} border-b-2 border-[var(--lumon-black)] bg-[var(--lumon-cream)]`}>
              <div className="p-3 font-mono text-xs font-bold uppercase tracking-wider text-center border-r border-[var(--grid-line)]">
                Accepted
              </div>
              <div className="p-3 font-mono text-xs font-bold uppercase tracking-wider text-center border-r border-[var(--grid-line)]">
                Rejected
              </div>
              {maybeCards.length > 0 && (
                <div className="p-3 font-mono text-xs font-bold uppercase tracking-wider text-center border-r border-[var(--grid-line)]">
                  Deferred
                </div>
              )}
              <div className="p-3 font-mono text-xs font-bold uppercase tracking-wider text-center">
                Total
              </div>
            </div>
            {/* Data row */}
            <div className={`grid ${maybeCards.length > 0 ? 'grid-cols-4' : 'grid-cols-3'}`}>
              <div className="p-4 font-mono text-2xl font-bold text-center text-[var(--lumon-green)] border-r border-[var(--grid-line)]">
                {formatNumber(keptCards.length)}
              </div>
              <div className="p-4 font-mono text-2xl font-bold text-center text-[var(--lumon-black)] border-r border-[var(--grid-line)]">
                {formatNumber(removedCards.length)}
              </div>
              {maybeCards.length > 0 && (
                <div className="p-4 font-mono text-2xl font-bold text-center text-[#8b5a2b] border-r border-[var(--grid-line)]">
                  {formatNumber(maybeCards.length)}
                </div>
              )}
              <div className="p-4 font-mono text-2xl font-bold text-center text-[var(--status-neutral)]">
                {formatNumber(allCards.length)}
              </div>
            </div>
          </div>
        </div>

        {/* Commander deck check */}
        <div className={`mb-6 border-2 p-4 ${deckComplete ? 'border-[var(--lumon-green)]' : 'border-[var(--lumon-black)]'}`}>
          <div className="flex items-center gap-3">
            {deckComplete ? (
              <>
                <div className="w-6 h-6 border-2 border-[var(--lumon-green)] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[var(--lumon-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-mono text-sm text-[var(--lumon-green)]">
                  DECK SIZE: 100 CARDS (COMMANDER LEGAL)
                </span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 border-2 border-[var(--lumon-black)] flex items-center justify-center">
                  <span className="font-mono text-xs text-[var(--lumon-black)]">!</span>
                </div>
                <span className="font-mono text-sm text-[var(--lumon-black)]">
                  {cardDifference > 0
                    ? `REQUIRES ${cardDifference} ADDITIONAL CARDS`
                    : `EXCEEDS LIMIT BY ${Math.abs(cardDifference)} CARDS`}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Export section */}
        <div className="mb-6">
          <div className="text-terminal text-[var(--status-neutral)] mb-3">EXPORT OPTIONS</div>

          {/* Format selector */}
          <div className="flex mb-4 border-2 border-[var(--lumon-black)]">
            {(['plain', 'grouped', 'archidekt'] as const).map((format, index) => (
              <button
                key={format}
                onClick={() => setExportFormat(format)}
                className={`flex-1 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-150
                           ${index < 2 ? 'border-r border-[var(--lumon-black)]' : ''}
                           ${exportFormat === format
                             ? 'bg-[var(--lumon-black)] text-[var(--lumon-white)]'
                             : 'bg-transparent text-[var(--lumon-black)] hover:bg-[var(--lumon-cream)]'
                           }`}
              >
                {format === 'archidekt' ? 'Categorized' : format}
              </button>
            ))}
          </div>

          {/* Export text box */}
          <div className="border-2 border-[var(--lumon-black)] p-4 max-h-[250px] overflow-auto bg-[var(--surface-elevated)]">
            <pre className="font-mono text-sm text-[var(--lumon-black)] whitespace-pre-wrap">
              {exportText}
            </pre>
          </div>

          {/* Export buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3
                         font-mono font-semibold uppercase tracking-wider transition-all duration-150
                         ${copied
                           ? 'bg-[var(--lumon-green)] border-2 border-[var(--lumon-green)] text-[var(--lumon-white)]'
                           : 'bg-[var(--lumon-green)] border-2 border-[var(--lumon-green)] text-[var(--lumon-white)] hover:bg-[var(--lumon-green-light)]'
                         }`}
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-3 border-2 border-[var(--lumon-black)] font-mono font-semibold uppercase tracking-wider
                         hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150
                         flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
        </div>

        {/* Decision export */}
        <div className="mb-6">
          <div className="text-terminal text-[var(--status-neutral)] mb-3">EXPORT DECISIONS</div>
          <p className="font-mono text-xs text-[var(--status-neutral)] mb-4">
            Save a record of all card decisions (accepted, rejected{maybeCards.length > 0 ? ', deferred' : ''}).
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const text = formatDecisionsAsText(deckName, keptCards, removedCards, maybeCards)
                copyToClipboard(text)
                setDecisionsCopied(true)
                setTimeout(() => setDecisionsCopied(false), 2000)
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3
                         font-mono font-semibold uppercase tracking-wider transition-all duration-150
                         border-2 border-[var(--lumon-black)]
                         ${decisionsCopied
                           ? 'bg-[var(--lumon-green)] border-[var(--lumon-green)] text-[var(--lumon-white)]'
                           : 'hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)]'
                         }`}
            >
              {decisionsCopied ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Copy Decisions
                </>
              )}
            </button>
            <button
              onClick={() => {
                const json = formatDecisionsAsJson(deckName, keptCards, removedCards, maybeCards)
                const safeName = deckName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
                downloadAsFile(json, `${safeName}_decisions.json`, 'application/json')
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-[var(--lumon-black)]
                         font-mono font-semibold uppercase tracking-wider
                         hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="square" strokeLinejoin="miter" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export JSON
            </button>
          </div>
        </div>

        {/* Import instructions */}
        <div className="mb-6 border border-[var(--grid-line)] p-4 bg-[var(--surface-elevated)]">
          <div className="text-terminal text-[var(--status-neutral)] mb-3">IMPORT INSTRUCTIONS</div>
          <ol className="font-mono text-sm text-[var(--lumon-black)] space-y-2 list-decimal list-inside">
            <li>Open deck on Archidekt</li>
            <li>Menu (three dots) → "Clear Deck"</li>
            <li>"Add Cards" → "Import"</li>
            <li>Paste list and click "Import"</li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSwipeAgain}
            className="flex-1 px-4 py-3 border-2 border-[var(--lumon-black)] font-mono font-semibold uppercase tracking-wider
                       hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
          >
            Re-sort
          </button>
          <button
            onClick={handleStartOver}
            className="flex-1 px-4 py-3 border-2 border-[var(--lumon-black)] font-mono font-semibold uppercase tracking-wider
                       hover:bg-[var(--lumon-black)] hover:text-[var(--lumon-white)] transition-all duration-150"
          >
            New Deck
          </button>
        </div>
      </div>
    </div>
  )
}
