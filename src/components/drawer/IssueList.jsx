import CheckRow from './CheckRow'

export default function IssueList({ issues }) {
  if (!issues?.length) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#EF4444' }} />
        <h3 className="text-sm font-semibold" style={{ color: '#1E2B4A' }}>
          Critical Issues
          <span className="ml-2 text-xs font-normal" style={{ color: '#64748B' }}>
            ({issues.length})
          </span>
        </h3>
      </div>

      <div className="space-y-2">
        {issues.map((issue) => (
          <CheckRow
            key={issue.id}
            title={issue.title}
            variant="issue"
            failingElements={issue.failingElements}
          />
        ))}
      </div>
    </div>
  )
}
