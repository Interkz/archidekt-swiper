import { useCubeStore } from '../../stores/cubeStore'

const MEMBERS = [
  { name: 'Emil', color: '#c44536' },
  { name: 'Breki', color: '#1a6fb5' },
  { name: 'Joe', color: '#2d6a4f' },
  { name: 'Andri', color: '#d4a020' },
]

export default function MemberPicker() {
  const memberName = useCubeStore((s) => s.memberName)
  const setMemberName = useCubeStore((s) => s.setMemberName)

  const selectedMember = MEMBERS.find((m) => m.name === memberName)

  if (selectedMember) {
    return (
      <div className="flex items-center gap-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: selectedMember.color }}
        />
        <span className="font-body text-[var(--text-light)] font-semibold">
          {selectedMember.name}
        </span>
        <button
          onClick={() => useCubeStore.setState({ memberName: null })}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--amber)] transition-colors"
        >
          (switch)
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <label className="font-display text-sm text-[var(--amber)] tracking-widest uppercase">
        Who are you?
      </label>
      <div className="flex gap-2">
        {MEMBERS.map((member) => (
          <button
            key={member.name}
            onClick={() => setMemberName(member.name)}
            className="btn-wood px-4 py-2 flex items-center gap-2 text-sm"
          >
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: member.color }}
            />
            {member.name}
          </button>
        ))}
      </div>
    </div>
  )
}
