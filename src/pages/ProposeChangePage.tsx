import { Link, useParams } from 'react-router-dom'

export default function ProposeChangePage() {
  const { id } = useParams()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="font-display text-3xl text-[var(--amber)] tracking-wider mb-4">
        PROPOSE CHANGE
      </h1>
      <p className="text-[var(--text-muted)] mb-8">
        Propose a cut, add, or swap for cube <span className="font-mono text-[var(--text-light)]">{id}</span>. Coming in Phase 4.
      </p>
      <Link to={`/cube/${id}`} className="btn-wood px-6 py-2 inline-block">
        Back to Dashboard
      </Link>
    </div>
  )
}
