import { useState } from 'react'
import { AlertTriangle, CheckCircle, ChevronDown, ScanSearch } from 'lucide-react'

/* ── helpers ──────────────────────────────────────────────── */

function truncate(str, n) {
  return str?.length > n ? str.slice(0, n) + '…' : str
}

// Only for DOM node items — returns the CSS selector path
function nodeSelector(item) {
  const node = item.node || item.element
  if (!node) return null
  return node.nodeLabel || node.snippet || node.path || null
}

// Only for URL items
function pageUrl(item) {
  return item.url || item.source?.url || null
}

/* ── Elements table ───────────────────────────────────────── */

function ElementsTab({ items, learnMoreUrl }) {
  // Only node/element items — NOT url items
  const rows = items
    .filter(item => item.node || item.element)
    .map((item, i) => {
      const label = nodeSelector(item)
      return label ? { index: i + 1, label, item } : null
    })
    .filter(Boolean)

  if (!rows.length) return (
    <p className="px-6 py-8 text-sm text-center" style={{ color: '#94A3B8' }}>
      No element details available.
    </p>
  )

  return (
    <div>
      {/* Spacer after tabs */}
      <div style={{ height: 8 }} />

      {/* Table header */}
      <div
        className="grid px-6 py-3 text-sm font-semibold"
        style={{
          gridTemplateColumns: '220px 1fr 120px 180px',
          backgroundColor: '#EEF2F7',
          color: '#64748B',
        }}
      >
        <span>Preview</span>
        <span>Elements</span>
        <span>Occurrences</span>
        <span>Review & Fix</span>
      </div>

      {/* Rows */}
      {rows.map(({ index, label, item }) => {
        const node  = item.node || item.element
        const thumb = node?.nodeImage || item.thumbnail || null

        return (
          <div
            key={index}
            className="grid px-6 py-5 items-center"
            style={{
              gridTemplateColumns: '220px 1fr 120px 180px',
              borderBottom: '1px solid #F1F5F9',
            }}
          >
            {/* Preview — large thumbnail */}
            <div
              className="rounded-xl overflow-hidden"
              style={{ width: 190, height: 130, border: '1px solid #E2E8F0', backgroundColor: '#EEF2F7' }}
            >
              {thumb
                ? <img src={thumb} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full" style={{ backgroundColor: '#E2E8F0' }} />
              }
            </div>

            {/* Element label */}
            <span className="text-sm pr-6 break-all leading-relaxed" style={{ color: '#475569' }}>
              {truncate(label, 200)}
            </span>

            {/* Occurrences */}
            <span className="text-sm font-medium" style={{ color: '#1E2B4A' }}>1</span>

            {/* Review & Fix */}
            {learnMoreUrl
              ? <a
                  href={learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: '#2563EB' }}
                >
                  <ScanSearch size={18} />
                  View in Inspector
                </a>
              : <span className="text-sm" style={{ color: '#94A3B8' }}>—</span>
            }
          </div>
        )
      })}
    </div>
  )
}

/* ── Pages tab (uses URL items if available) ──────────────── */

function PagesTab({ items, learnMoreUrl }) {
  const urlRows = items.filter(i => pageUrl(i))

  if (!urlRows.length) return (
    <p className="px-4 py-6 text-sm text-center" style={{ color: '#94A3B8' }}>
      No page-level data available.
    </p>
  )

  return (
    <div>
      <div style={{ height: 8 }} />
      <div
        className="grid px-6 py-3 text-sm font-semibold"
        style={{
          gridTemplateColumns: '1fr 120px 180px',
          backgroundColor: '#EEF2F7',
          color: '#64748B',
        }}
      >
        <span>Page</span>
        <span>Occurrence</span>
        <span>Review & Fix</span>
      </div>

      {urlRows.map((item, i) => {
        const url = pageUrl(item)
        return (
          <div
            key={i}
            className="grid px-6 py-5 items-center"
            style={{
              gridTemplateColumns: '1fr 120px 180px',
              borderBottom: '1px solid #F1F5F9',
            }}
          >
            <span className="text-sm pr-6" style={{ color: '#475569' }}>
              {truncate(url, 80)}
            </span>
            <span className="text-sm font-medium" style={{ color: '#1E2B4A' }}>1</span>
            {learnMoreUrl
              ? <a
                  href={learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: '#2563EB' }}
                >
                  <ScanSearch size={18} />
                  View in Inspector
                </a>
              : <span className="text-sm" style={{ color: '#94A3B8' }}>—</span>
            }
          </div>
        )
      })}
    </div>
  )
}

/* ── Main CheckRow ────────────────────────────────────────── */

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
  const [activeDetailTab, setActiveDetailTab] = useState('elements')
  const isIssue = variant === 'issue'

  const elementRows = items.filter(i => (i.node || i.element) && nodeSelector(i))
  const pageRows    = items.filter(i => pageUrl(i))

  return (
    <div style={{ borderBottom: '1px solid #F1F5F9' }}>
      {/* Collapsed row */}
      <button
        onClick={() => setIsExpanded(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        {isIssue
          ? <AlertTriangle size={15} className="shrink-0" style={{ color: '#F97316' }} />
          : <CheckCircle   size={15} className="shrink-0" style={{ color: '#22C55E' }} />
        }

        <span className="flex-1 text-base" style={{ color: '#1E2B4A', fontWeight: 500 }}>
          {title}
        </span>

        {isIssue && failingElements != null && failingElements > 0 && (
          <span
            className="shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: '#FEE2E2', color: '#EF4444' }}
          >
            {failingElements} {failingElements === 1 ? 'element' : 'elements'}
          </span>
        )}

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
        <div style={{ backgroundColor: '#FAFAFA', borderTop: '1px solid #F1F5F9' }}>

          {/* Description + learn more */}
          {(description || learnMoreUrl) && (
            <div className="px-5 pt-4 pb-3 space-y-1.5">
              {description && (
                <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
                  {description}
                </p>
              )}
              {learnMoreUrl && (
                <a
                  href={learnMoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-medium"
                  style={{ color: '#2563EB' }}
                >
                  Learn more ›
                </a>
              )}
            </div>
          )}

          {/* Passed checks — simple */}
          {!isIssue && (
            <div className="px-5 py-4">
              {description
                ? null
                : <p className="text-sm" style={{ color: '#22C55E' }}>All checks passed ✓</p>
              }
            </div>
          )}

          {/* Issue detail tabs */}
          {isIssue && (elementRows.length > 0 || pageRows.length > 0) && (
            <div className="px-5 pb-5">
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}
              >
                {/* Tab bar */}
                <div className="flex" style={{ borderBottom: '1px solid #E2E8F0' }}>
                  {[
                    { key: 'elements', label: `Elements affected (${elementRows.length || failingElements || 0})` },
                    { key: 'pages',    label: `Pages affected (${pageRows.length || 1})` },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setActiveDetailTab(key)}
                      className="px-5 py-3 text-sm transition-colors"
                      style={{
                        fontWeight:        activeDetailTab === key ? 600 : 400,
                        color:             activeDetailTab === key ? '#2563EB' : '#64748B',
                        borderBottom:      activeDetailTab === key ? '2px solid #2563EB' : '2px solid transparent',
                        marginBottom:      -1,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                {activeDetailTab === 'elements'
                  ? <ElementsTab items={items} learnMoreUrl={learnMoreUrl} />
                  : <PagesTab    items={items} learnMoreUrl={learnMoreUrl} />
                }
              </div>
            </div>
          )}

          {/* Fallback when no items */}
          {isIssue && elementRows.length === 0 && pageRows.length === 0 && failingElements != null && failingElements > 0 && (
            <div className="px-5 pb-4">
              <p className="text-xs" style={{ color: '#64748B' }}>
                <span className="font-semibold" style={{ color: '#EF4444' }}>{failingElements}</span>
                {' '}{failingElements === 1 ? 'element' : 'elements'} failing this check
              </p>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
