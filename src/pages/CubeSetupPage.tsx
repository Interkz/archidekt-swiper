import { Link } from 'react-router-dom'

export default function CubeSetupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="font-display text-3xl text-[var(--amber)] tracking-wider mb-4">
        CUBE SETUP
      </h1>
      <p className="text-[var(--text-muted)] mb-8">
        Create or join a cube. Coming in Phase 2.
      </p>
      <Link to="/" className="btn-wood px-6 py-2 inline-block">
        Back to Home
      </Link>
    </div>
  )
}
