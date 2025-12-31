import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDeckStore } from '../stores/deckStore'
import {
  formatForArchidektImport,
  formatWithCategories,
  formatWithArchidektCategories,
  copyToClipboard,
  downloadAsFile,
} from '../utils/exportFormatter'

type ExportFormat = 'plain' | 'grouped' | 'archidekt'

export default function ResultsPage() {
  const navigate = useNavigate()
  const { deckName, keptCards, removedCards, allCards, clearState, resetDeck } = useDeckStore()
  const [exportFormat, setExportFormat] = useState<ExportFormat>('archidekt')
  const [copied, setCopied] = useState(false)

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

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-2xl mx-auto">
      {/* Header */}
      <header className="mb-6">
        <Link
          to="/"
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 mb-4"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </Link>
        <h1 className="text-2xl font-bold text-white">Results</h1>
        <p className="text-gray-400">{deckName}</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{keptCards.length}</p>
          <p className="text-green-400/80 text-sm">Cards Kept</p>
        </div>
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-center">
          <p className="text-3xl font-bold text-red-400">{removedCards.length}</p>
          <p className="text-red-400/80 text-sm">Cards Removed</p>
        </div>
      </div>

      {/* Commander deck check */}
      {keptCards.length === 100 && (
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 mb-6 text-center">
          <p className="text-purple-400">
            Perfect! Your deck is exactly 100 cards (including commander)
          </p>
        </div>
      )}
      {keptCards.length !== 100 && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 mb-6 text-center">
          <p className="text-yellow-400">
            Commander decks need 100 cards. You have {keptCards.length}.
          </p>
        </div>
      )}

      {/* Export section */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-white mb-3">Export Kept Cards</h2>

        {/* Format selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setExportFormat('plain')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              exportFormat === 'plain'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Plain
          </button>
          <button
            onClick={() => setExportFormat('grouped')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              exportFormat === 'grouped'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            Grouped by Type
          </button>
          <button
            onClick={() => setExportFormat('archidekt')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              exportFormat === 'archidekt'
                ? 'bg-purple-600 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            With Categories
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4 max-h-[300px] overflow-auto">
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
            {exportText}
          </pre>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700
                       rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-3 bg-white/10 hover:bg-white/20
                       rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Import instructions */}
      <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
        <h3 className="font-semibold text-white mb-2">How to import into Archidekt:</h3>
        <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
          <li>Go to your deck on Archidekt</li>
          <li>Click the menu (three dots) → "Clear Deck" to remove all cards</li>
          <li>Click "Add Cards" → "Import"</li>
          <li>Paste the copied list and click "Import"</li>
        </ol>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleSwipeAgain}
          className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20
                     rounded-lg font-semibold transition-colors"
        >
          Swipe Again
        </button>
        <button
          onClick={handleStartOver}
          className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20
                     rounded-lg font-semibold transition-colors"
        >
          New Deck
        </button>
      </div>
    </div>
  )
}
