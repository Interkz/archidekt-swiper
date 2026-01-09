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
          className="text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-1 font-medium mb-4"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Home
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Results</h1>
        <p className="text-slate-500">{deckName}</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-emerald-600">{keptCards.length}</p>
          <p className="text-emerald-600/80 text-sm font-medium">Cards Kept</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-red-500">{removedCards.length}</p>
          <p className="text-red-500/80 text-sm font-medium">Cards Removed</p>
        </div>
      </div>

      {/* Commander deck check */}
      {keptCards.length === 100 && (
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-violet-700 font-medium">
              Perfect! Your deck is exactly 100 cards (including commander)
            </p>
          </div>
        </div>
      )}
      {keptCards.length !== 100 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-center">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-amber-700 font-medium">
              Commander decks need 100 cards. You have {keptCards.length}.
            </p>
          </div>
        </div>
      )}

      {/* Export section */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Export Kept Cards</h2>

        {/* Format selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setExportFormat('plain')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              exportFormat === 'plain'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            Plain
          </button>
          <button
            onClick={() => setExportFormat('grouped')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              exportFormat === 'grouped'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            Grouped by Type
          </button>
          <button
            onClick={() => setExportFormat('archidekt')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              exportFormat === 'archidekt'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            With Categories
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 max-h-[300px] overflow-auto card-shadow">
          <pre className="text-sm text-slate-600 whitespace-pre-wrap font-mono">
            {exportText}
          </pre>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className={`flex-1 px-4 py-3.5 rounded-xl font-semibold transition-all duration-200
                       flex items-center justify-center gap-2 ${
                         copied
                           ? 'bg-emerald-500 text-white'
                           : 'bg-violet-600 hover:bg-violet-700 text-white hover:shadow-lg hover:shadow-violet-200'
                       }`}
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
            className="px-4 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300
                       rounded-xl font-semibold text-slate-700 transition-all duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* Import instructions */}
      <div className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl">
        <h3 className="font-semibold text-slate-800 mb-3">How to import into Archidekt:</h3>
        <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
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
          className="flex-1 px-4 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300
                     rounded-xl font-semibold text-slate-700 transition-all duration-200"
        >
          Swipe Again
        </button>
        <button
          onClick={handleStartOver}
          className="flex-1 px-4 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300
                     rounded-xl font-semibold text-slate-700 transition-all duration-200"
        >
          New Deck
        </button>
      </div>
    </div>
  )
}
