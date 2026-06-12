import CheckRow from './CheckRow'

export default function PassedList({ passed }) {
  if (!passed?.length) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#22C55E' }} />
        <h3 className="text-sm font-semibold" style={{ color: '#1E2B4A' }}>
          Passed Checks
          <span className="ml-2 text-xs font-normal" style={{ color: '#64748B' }}>
            ({passed.length})
          </span>
        </h3>
      </div>

      <div className="space-y-2">
        {passed.map((check) => (
          <CheckRow
            key={check.id}
            title={check.title}
            variant="passed"
          />
        ))}
      </div>
    </div>
  )
}
