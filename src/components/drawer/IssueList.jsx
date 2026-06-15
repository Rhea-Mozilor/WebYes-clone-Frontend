import CheckRow from './CheckRow'

export default function IssueList({ issues }) {
  if (!issues?.length) return null

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>#</span>
          <h3 className="text-sm font-semibold" style={{ color: '#1E2B4A' }}>Critical Issues</h3>
        </div>
        <span className="text-xs" style={{ color: '#94A3B8' }}>Failing elements</span>
      </div>

      {/* Rows */}
      <div style={{ backgroundColor: '#FFFFFF' }}>
        {issues.map((issue) => (
          <CheckRow
            key={issue.id}
            title={issue.title}
            variant="issue"
            description={issue.description}
            learnMoreUrl={issue.learnMoreUrl}
            displayValue={issue.displayValue}
            failingElements={issue.failingElements}
            items={issue.items}
          />
        ))}
      </div>
    </div>
  )
}
