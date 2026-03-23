interface VoteButtonProps {
  type: 'approve' | 'reject'
  onClick: () => void
  disabled: boolean
}

export default function VoteButton({ type, onClick, disabled }: VoteButtonProps) {
  const isApprove = type === 'approve'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        font-display text-xs uppercase tracking-widest px-5 py-2 rounded
        border-2 transition-all duration-150 cursor-pointer
        ${disabled
          ? 'opacity-30 cursor-not-allowed border-[var(--border-wood)] text-[var(--text-muted)] bg-transparent'
          : isApprove
            ? 'border-[var(--positive)] text-[var(--positive)] bg-transparent hover:bg-[var(--positive)] hover:text-[var(--tavern-card)]'
            : 'border-[var(--negative)] text-[var(--negative)] bg-transparent hover:bg-[var(--negative)] hover:text-[var(--tavern-card)]'
        }
      `}
    >
      {isApprove ? 'Approve' : 'Reject'}
    </button>
  )
}
