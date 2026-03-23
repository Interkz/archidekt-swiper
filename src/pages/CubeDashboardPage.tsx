import { Link, useParams } from 'react-router-dom'

export default function CubeDashboardPage() {
  const { id } = useParams()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="font-display text-3xl text-[var(--amber)] tracking-wider mb-4">
        CUBE DASHBOARD
      </h1>
      <p className="text-[var(--text-muted)] mb-8">
        Cube <span className="font-mono text-[var(--text-light)]">{id}</span> — overview coming in Phase 3.
      </p>
      <Link to="/cube/setup" className="btn-wood px-6 py-2 inline-block">
        Back to Setup
      </Link>
    </div>
  )
}
