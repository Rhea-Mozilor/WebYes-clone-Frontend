import CheckRow from './CheckRow'

export default function PassedList({ passed }) {
  if (!passed?.length) return null

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
      {/* Header */}
      <div
        className="flex items-center gap-1.5 px-4 py-2.5"
        style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}
      >
        <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>#</span>
        <h3 className="text-sm font-semibold" style={{ color: '#1E2B4A' }}>
          Passed Checks
          <span className="ml-2 text-xs font-normal" style={{ color: '#64748B' }}>
            ({passed.length})
          </span>
        </h3>
      </div>

      {/* Rows */}
      <div style={{ backgroundColor: '#FFFFFF' }}>
        {passed.map((check) => (
          <CheckRow
            key={check.id}
            title={check.title}
            variant="passed"
            description={check.description}
            learnMoreUrl={check.learnMoreUrl}
          />
        ))}
      </div>
    </div>
  )
}
