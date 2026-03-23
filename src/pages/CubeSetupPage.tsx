import { useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCubeStore } from '../stores/cubeStore'
import { parseCubeList, resolveCards, resolveOtags } from '../services/scryfallImport'
import type { CubeCard } from '../types/cube'
import MemberPicker from '../components/cube/MemberPicker'

type ImportPhase = 'idle' | 'resolving' | 'tagging' | 'done' | 'error'

export default function CubeSetupPage() {
  const navigate = useNavigate()
  const { memberName, createCube, setCards, currentCubeId } = useCubeStore()

  const [cubeName, setCubeName] = useState('The Cube')
  const [threshold, setThreshold] = useState<'majority' | 'unanimous'>('majority')
  const [cardText, setCardText] = useState('')
  const [phase, setPhase] = useState<ImportPhase>('idle')
  const [progress, setProgress] = useState({ resolved: 0, total: 0, tag: '' })
  const [errorMsg, setErrorMsg] = useState('')

  const handleImport = useCallback(async () => {
    if (!memberName) {
      setErrorMsg('Select your name first')
      return
    }

    const names = parseCubeList(cardText)
    if (names.length === 0) {
      setErrorMsg('No cards found in the list')
      return
    }

    setPhase('resolving')
    setProgress({ resolved: 0, total: names.length, tag: '' })
    setErrorMsg('')

    try {
      // Step 1: Resolve card data from Scryfall
      const resolved = await resolveCards(names, (done, total) => {
        setProgress(p => ({ ...p, resolved: done, total }))
      })

      // Step 2: Resolve otag categories
      setPhase('tagging')
      const tagMap = await resolveOtags(
        resolved.map(c => c.name),
        (category) => {
          setProgress(p => ({ ...p, tag: category }))
        }
      )

      // Step 3: Create cube and import cards
      createCube(cubeName, 360, threshold)
      const cubeId = useCubeStore.getState().currentCubeId

      const cubeCards: CubeCard[] = resolved.map(card => ({
        id: crypto.randomUUID(),
        cube_id: cubeId || '',
        scryfall_id: card.scryfall_id,
        name: card.name,
        mana_cost: card.mana_cost,
        cmc: card.cmc,
        type_line: card.type_line,
        color_identity: card.color_identity,
        tags: tagMap.get(card.name.toLowerCase()) || [],
        set_code: card.set_code,
        image_uri: card.image_uri,
        added_by: memberName,
        added_at: new Date().toISOString(),
      }))

      setCards(cubeCards)
      setPhase('done')

      // Navigate to browser
      const id = useCubeStore.getState().currentCubeId
      setTimeout(() => navigate(`/cube/${id}/browser`), 500)
    } catch (err) {
      setPhase('error')
      setErrorMsg(err instanceof Error ? err.message : 'Import failed')
    }
  }, [cardText, cubeName, threshold, memberName, createCube, setCards, navigate])

  const isImporting = phase === 'resolving' || phase === 'tagging'
  const progressPercent = progress.total > 0 ? Math.round((progress.resolved / progress.total) * 100) : 0

  // If cube already exists, offer to go to it
  if (currentCubeId && useCubeStore.getState().cards.length > 0 && phase === 'idle') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="font-display text-3xl text-[var(--text-light)] tracking-wider mb-4">
          CUBE EXISTS
        </h1>
        <p className="text-[var(--text-muted)] mb-8">
          You already have a cube loaded ({useCubeStore.getState().cards.length} cards).
        </p>
        <div className="flex gap-4">
          <Link to={`/cube/${currentCubeId}/browser`} className="btn-tavern px-6 py-3 inline-block text-center">
            Open Cube
          </Link>
          <button
            onClick={() => {
              useCubeStore.getState().setCards([])
              useCubeStore.setState({ currentCubeId: null, cube: null, members: [], proposals: [], votes: {} })
            }}
            className="btn-wood px-6 py-3"
          >
            Start Fresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-[var(--text-muted)] text-sm font-mono hover:text-[var(--text-light)] transition-colors">
            &larr; Back
          </Link>
          <h1 className="font-display text-3xl text-[var(--text-light)] tracking-wider mt-4">
            CREATE CUBE
          </h1>
        </div>

        {/* Member Picker */}
        <div className="mb-6">
          <label className="text-terminal text-[var(--text-muted)] tracking-widest block mb-2">
            WHO ARE YOU
          </label>
          <MemberPicker />
        </div>

        {/* Cube Name */}
        <div className="mb-6">
          <label className="text-terminal text-[var(--text-muted)] tracking-widest block mb-2">
            CUBE NAME
          </label>
          <input
            type="text"
            value={cubeName}
            onChange={e => setCubeName(e.target.value)}
            className="input-terminal w-full"
            disabled={isImporting}
          />
        </div>

        {/* Vote Threshold */}
        <div className="mb-6">
          <label className="text-terminal text-[var(--text-muted)] tracking-widest block mb-2">
            VOTE THRESHOLD
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setThreshold('majority')}
              className={`flex-1 px-4 py-2 border-2 rounded font-mono text-sm uppercase tracking-wider transition-all ${
                threshold === 'majority'
                  ? 'border-[var(--amber)] bg-[var(--amber)] text-[var(--ink-primary)]'
                  : 'border-[var(--border-wood)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
              }`}
              disabled={isImporting}
            >
              Majority
            </button>
            <button
              onClick={() => setThreshold('unanimous')}
              className={`flex-1 px-4 py-2 border-2 rounded font-mono text-sm uppercase tracking-wider transition-all ${
                threshold === 'unanimous'
                  ? 'border-[var(--amber)] bg-[var(--amber)] text-[var(--ink-primary)]'
                  : 'border-[var(--border-wood)] text-[var(--text-muted)] hover:border-[var(--text-muted)]'
              }`}
              disabled={isImporting}
            >
              Unanimous
            </button>
          </div>
        </div>

        {/* Card List */}
        <div className="mb-6">
          <label className="text-terminal text-[var(--text-muted)] tracking-widest block mb-2">
            CARD LIST (ONE PER LINE)
          </label>
          <textarea
            value={cardText}
            onChange={e => setCardText(e.target.value)}
            className="input-terminal w-full h-48 resize-y font-mono text-sm"
            placeholder={"Sol Ring\nLightning Bolt\nCounterspell\n..."}
            disabled={isImporting}
          />
          {cardText && (
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">
              {parseCubeList(cardText).length} unique cards detected
            </p>
          )}
        </div>

        {/* Progress */}
        {isImporting && (
          <div className="mb-6">
            <div className="progress-ledger mb-2">
              <div
                className="progress-ledger-fill"
                style={{ width: phase === 'tagging' ? '100%' : `${progressPercent}%` }}
              />
            </div>
            <p className="font-mono text-xs text-[var(--text-muted)] text-center">
              {phase === 'resolving' && `Resolving cards... ${progress.resolved}/${progress.total}`}
              {phase === 'tagging' && `Tagging: ${progress.tag}...`}
            </p>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="mb-6 border-2 border-[var(--negative)] rounded p-3">
            <p className="font-mono text-sm text-[var(--negative)]">{errorMsg}</p>
          </div>
        )}

        {/* Done */}
        {phase === 'done' && (
          <div className="mb-6 border-2 border-[var(--positive)] rounded p-3 text-center">
            <p className="font-mono text-sm text-[var(--positive)]">
              Import complete! Redirecting...
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleImport}
          disabled={isImporting || !cardText.trim() || !memberName}
          className="w-full btn-tavern text-center text-lg py-4"
        >
          {isImporting ? 'Importing...' : 'Import Cube'}
        </button>
      </div>
    </div>
  )
}
