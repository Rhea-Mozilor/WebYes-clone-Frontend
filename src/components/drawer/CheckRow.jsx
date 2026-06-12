import { useState } from 'react'
import { AlertCircle, CheckCircle, ChevronDown } from 'lucide-react'

export default function CheckRow({ title, variant = 'passed', failingElements }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const isIssue = variant === 'issue'

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: '1px solid #E2E8F0' }}
    >
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
      >
        {/* Icon */}
        {isIssue ? (
          <AlertCircle size={16} className="shrink-0" style={{ color: '#EF4444' }} />
        ) : (
          <CheckCircle size={16} className="shrink-0" style={{ color: '#22C55E' }} />
        )}

        {/* Title */}
        <span className="flex-1 text-sm font-medium" style={{ color: '#1E2B4A' }}>
          {title}
        </span>

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          style={{ color: '#64748B' }}
        />
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div
          className="px-4 py-3 text-sm"
          style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0', color: '#64748B' }}
        >
          {isIssue ? (
            <span>
              <span className="font-semibold" style={{ color: '#EF4444' }}>
                {failingElements}
              </span>{' '}
              {failingElements === 1 ? 'element' : 'elements'} failing this check
            </span>
          ) : (
            <span style={{ color: '#22C55E' }}>All checks passed</span>
          )}
        </div>
      )}
    </div>
  )
}
