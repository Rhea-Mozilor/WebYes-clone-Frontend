import { useState } from 'react'
import { AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react'

function FailingTable({ items }) {
  const rows = items
    .map((item, i) => {
      const node = item.node || item.element
      const label = node?.nodeLabel || node?.snippet || item.url || item.source?.url || null
      const isUrl = !node && (item.url || item.source?.url)
      return label ? { index: i + 1, label, isUrl } : null
    })
    .filter(Boolean)

  if (!rows.length) return null

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
      <div
        className="flex items-center gap-4 px-3 py-2 text-xs font-medium"
        style={{ backgroundColor: '#F8FAFC', color: '#94A3B8', borderBottom: '1px solid #E2E8F0' }}
      >
        <span className="w-5 shrink-0">#</span>
        <span>Failing Elements</span>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: 220 }}>
        {rows.map(({ index, label, isUrl }) => (
          <div
            key={index}
            className="flex items-center gap-4 px-3 py-2 text-xs"
            style={{ borderBottom: '1px solid #F1F5F9', color: '#1E2B4A' }}
          >
            <span className="w-5 shrink-0 text-right" style={{ color: '#94A3B8' }}>{index}</span>
            {isUrl ? (
              <a
                href={label}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate font-mono"
                style={{ color: '#2563EB' }}
              >
                {label}
              </a>
            ) : (
              <span className="font-mono truncate" style={{ color: '#475569' }}>{label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CheckRow({
  title,
  variant = 'passed',
  description,
  learnMoreUrl,
  displayValue,
  failingElements,
  items = [],
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isIssue = variant === 'issue'

  const hasTableRows = items.some((item) => {
    const node = item.node || item.element
    return node?.nodeLabel || node?.snippet || item.url || item.source?.url
  })

  return (
    <div style={{ borderBottom: '1px solid #F1F5F9' }}>
      {/* Row */}
      <button
        onClick={() => setIsExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        {isIssue ? (
          <AlertTriangle size={15} className="shrink-0" style={{ color: '#F97316' }} />
        ) : (
          <CheckCircle size={15} className="shrink-0" style={{ color: '#22C55E' }} />
        )}

        <span className="flex-1 text-base" style={{ color: '#1E2B4A', fontWeight: 500 }}>{title}</span>

        {/* Failing elements pill — always visible for issues */}
        {isIssue && failingElements != null && failingElements > 0 && (
          <span
            className="shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: '#FEE2E2', color: '#EF4444' }}
          >
            {failingElements.toLocaleString()} {failingElements === 1 ? 'element' : 'elements'}
          </span>
        )}

        {/* Circle chevron */}
        <span
          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            border: '1.5px solid #E2E8F0',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <ChevronDown size={13} style={{ color: '#64748B' }} />
        </span>
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div
          className="px-4 py-4 space-y-3 text-sm"
          style={{ backgroundColor: '#FAFAFA', borderTop: '1px solid #F1F5F9' }}
        >
          {/* Passed */}
          {!isIssue && (
            <div className="space-y-1">
              {description ? (
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{description}</p>
              ) : (
                <p className="text-xs" style={{ color: '#22C55E' }}>All checks passed</p>
              )}
              {learnMoreUrl && (
                <a
                  href={learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium"
                  style={{ color: '#2563EB' }}
                >
                  Learn more →
                </a>
              )}
            </div>
          )}

          {/* Issue */}
          {isIssue && (
            <div className="space-y-3">
              {(description || learnMoreUrl) && (
                <div className="space-y-1">
                  {description && (
                    <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>{description}</p>
                  )}
                  {learnMoreUrl && (
                    <a
                      href={learnMoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium"
                      style={{ color: '#2563EB' }}
                    >
                      Learn more →
                    </a>
                  )}
                </div>
              )}

              {hasTableRows && <FailingTable items={items} />}

              {!hasTableRows && failingElements != null && failingElements > 0 && (
                <p className="text-xs" style={{ color: '#64748B' }}>
                  <span className="font-semibold" style={{ color: '#EF4444' }}>{failingElements}</span>
                  {' '}{failingElements === 1 ? 'element' : 'elements'} failing this check
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
