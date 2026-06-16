import { useState } from 'react'
import { AlertTriangle, CheckCircle, ChevronDown } from 'lucide-react'

/* ── formatting helpers ───────────────────────────────────── */

function truncate(str, n) {
  return str?.length > n ? str.slice(0, n) + '…' : str
}

function formatBytes(n) {
  if (n >= 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MiB`
  if (n >= 1024) return `${Math.round(n / 1024)} KiB`
  return `${n} B`
}

function formatMs(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(2)} s` : `${Math.round(n)} ms`
}

const BYTES_KEYS = new Set(['wastedBytes', 'totalBytes', 'overallSavingsBytes', 'size', 'transferSize', 'resourceSize', 'transferSize'])
const MS_KEYS    = new Set(['wastedMs', 'duration', 'overallSavingsMs', 'blockingTime', 'mainThreadTime'])
const SKIP_KEYS  = new Set(['type', 'debugData', 'entity', 'subItems', 'fromProtocol', 'isCrossOrigin', 'statistic', 'sourceLocation'])

const COL_LABEL = {
  url:        'URL',
  label:      'Resource',
  text:       'Content',
  description:'Description',
  protocol:   'Protocol',
  selector:   'Selector',
  wastedBytes:'Potential Savings',
  totalBytes: 'Transfer Size',
  wastedMs:   'Time Savings',
  duration:   'Duration',
  mainThreadTime: 'Main Thread',
  blockingTime: 'Blocking',
}

function fmtCell(key, val) {
  if (val == null || val === '') return '—'
  if (typeof val === 'number') {
    if (BYTES_KEYS.has(key)) return formatBytes(val)
    if (MS_KEYS.has(key)) return formatMs(val)
    return val.toLocaleString()
  }
  if (typeof val === 'object') {
    return val.url || val.snippet || val.text || '—'
  }
  return String(val)
}

/* ── Generic Lighthouse table (Performance / Quality / SEO) ─ */

function stripMd(str) {
  if (!str) return '—'
  // [text](url) → text
  return str.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim()
}

function GenericRow({ item, cols, colLabel, cellVal, isUrlCol, gridCols }) {
  const [open, setOpen] = useState(false)

  // All string/number fields for the expanded detail panel
  const allFields = Object.entries(item).filter(([k, v]) => {
    if (SKIP_KEYS.has(k)) return false
    if (typeof v === 'string' || typeof v === 'number') return true
    if ((k === 'node' || k === 'element') && v) return true
    if (k === 'source' && v?.url) return true
    return false
  })

  return (
    <div style={{ borderBottom: '1px solid #F1F5F9' }}>
      {/* Row */}
      <div
        className="grid px-4 py-3 items-center cursor-pointer hover:bg-gray-50 transition-colors"
        style={{ gridTemplateColumns: gridCols + ' 32px' }}
        onClick={() => setOpen(v => !v)}
      >
        {cols.map(col => {
          const val = cellVal(col, item)
          const isLink = isUrlCol(col, item)
          return (
            <span
              key={col}
              className="text-sm pr-3 leading-relaxed"
              style={{ color: '#475569', wordBreak: 'break-all' }}
              onClick={e => isLink && e.stopPropagation()}
            >
              {isLink
                ? <a href={val} target="_blank" rel="noopener noreferrer"
                     className="hover:underline" style={{ color: '#2563EB' }} title={val}>
                    {truncate(val, 70)}
                  </a>
                : truncate(stripMd(val), 100)
              }
            </span>
          )
        })}
        {/* Chevron */}
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{
            border: '1.5px solid #E2E8F0',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <ChevronDown size={12} style={{ color: '#64748B' }} />
        </span>
      </div>

      {/* Expanded detail */}
      {open && (
        <div className="px-5 py-4 space-y-2" style={{ backgroundColor: '#F8FAFC', borderTop: '1px solid #F1F5F9' }}>
          {allFields.map(([k, v]) => {
            let display
            if ((k === 'node' || k === 'element') && typeof v === 'object') {
              display = v.selector || v.nodeLabel || v.snippet || v.path || JSON.stringify(v)
            } else if (k === 'source' && typeof v === 'object') {
              display = v.url
            } else {
              display = typeof v === 'number'
                ? (BYTES_KEYS.has(k) ? formatBytes(v) : MS_KEYS.has(k) ? formatMs(v) : String(v))
                : stripMd(String(v))
            }
            return (
              <div key={k} className="flex gap-3 text-sm">
                <span className="shrink-0 font-medium w-32" style={{ color: '#94A3B8' }}>
                  {COL_LABEL[k] || k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                </span>
                <span className="break-all leading-relaxed" style={{ color: '#475569' }}>{display || '—'}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function GenericItemsTable({ items }) {
  if (!items?.length) return (
    <p className="px-6 py-8 text-sm text-center" style={{ color: '#94A3B8' }}>
      No item details available.
    </p>
  )

  // Collect all usable primitive-or-url keys
  const keySet = new Set()
  items.forEach(item => {
    Object.entries(item).forEach(([k, v]) => {
      if (SKIP_KEYS.has(k)) return
      if (typeof v === 'string' || typeof v === 'number') keySet.add(k)
      if ((k === 'node' || k === 'element') && v && typeof v === 'object') keySet.add('__node')
      if (k === 'source' && v && typeof v === 'object' && v.url) keySet.add('__sourceUrl')
    })
  })

  const FIRST = ['url', 'label', 'text', 'description', 'selector', '__node', '__sourceUrl']
  const NUMERIC = [...BYTES_KEYS, ...MS_KEYS]
  const cols = [
    ...FIRST.filter(k => keySet.has(k)),
    ...NUMERIC.filter(k => keySet.has(k)),
    ...[...keySet].filter(k => !FIRST.includes(k) && !NUMERIC.includes(k)).sort(),
  ].slice(0, 3) // max 3 cols to leave room for chevron

  if (!cols.length) return null

  const gridCols = cols.length === 1 ? '1fr' : cols.length === 2 ? '1fr 160px' : '1fr 150px 150px'

  const colLabel = (k) => {
    if (k === '__node') return 'Element'
    if (k === '__sourceUrl') return 'Source URL'
    return COL_LABEL[k] || k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
  }

  const cellVal = (col, item) => {
    if (col === '__node') {
      const n = item.node || item.element
      return n ? (n.nodeLabel || n.snippet || n.selector || n.path || '—') : '—'
    }
    if (col === '__sourceUrl') return item.source?.url || '—'
    return fmtCell(col, item[col])
  }

  const isUrlCol = (col, item) => {
    if (col !== 'url' && col !== '__sourceUrl') return false
    const v = col === '__sourceUrl' ? item.source?.url : item.url
    return typeof v === 'string' && v.startsWith('http')
  }

  return (
    <div>
      <div style={{ height: 8 }} />
      {/* Header */}
      <div
        className="grid px-4 py-3 text-xs font-semibold uppercase tracking-wide"
        style={{ gridTemplateColumns: gridCols + ' 32px', backgroundColor: '#EEF2F7', color: '#64748B' }}
      >
        {cols.map(col => <span key={col}>{colLabel(col)}</span>)}
        <span />
      </div>
      {/* Rows */}
      {items.map((item, i) => (
        <GenericRow
          key={i}
          item={item}
          cols={cols}
          colLabel={colLabel}
          cellVal={cellVal}
          isUrlCol={isUrlCol}
          gridCols={gridCols}
        />
      ))}
    </div>
  )
}

/* ── Network Dependency Tree (recursive collapsible) ─────── */

const TREE_GRID = '1fr 120px 130px 80px'

function NetworkTreeNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = Object.keys(node.children ?? {}).length > 0

  return (
    <>
      <div
        className="grid items-center px-4 py-3"
        style={{ gridTemplateColumns: TREE_GRID, borderBottom: '1px solid #F1F5F9' }}
      >
        {/* Resource — indented URL + expand button */}
        <div className="flex items-center gap-1.5 min-w-0" style={{ paddingLeft: depth * 20 }}>
          {hasChildren ? (
            <button
              onClick={() => setExpanded(v => !v)}
              className="shrink-0 w-5 h-5 rounded flex items-center justify-center transition-colors hover:bg-gray-100"
            >
              <ChevronDown
                size={13}
                style={{
                  color: '#64748B',
                  transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 0.15s',
                }}
              />
            </button>
          ) : (
            <span className="shrink-0 w-5" />
          )}
          <a
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm truncate hover:underline min-w-0"
            style={{ color: '#2563EB' }}
            title={node.url}
          >
            {truncate(node.url, 65)}
          </a>
        </div>

        {/* Transfer Size */}
        <span className="text-sm" style={{ color: '#475569' }}>
          {node.transferSize != null ? formatBytes(node.transferSize) : '—'}
        </span>

        {/* Duration */}
        <span className="text-sm" style={{ color: '#475569' }}>
          {node.navStartToEndTime != null ? formatMs(node.navStartToEndTime) : '—'}
        </span>

        {/* Longest badge */}
        <span>
          {node.isLongest && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
            >
              Longest
            </span>
          )}
        </span>
      </div>

      {/* Children — rendered inline when expanded */}
      {expanded && hasChildren && Object.values(node.children).map((child, i) => (
        <NetworkTreeNode key={i} node={child} depth={depth + 1} />
      ))}
    </>
  )
}

function NetworkTreeTable({ items }) {
  const section = items.find(i => i.type === 'list-section')
  const treeData = section?.value
  if (!treeData || treeData.type !== 'network-tree') return null

  const { chains = {}, longestChain } = treeData

  return (
    <div>
      <div style={{ height: 8 }} />

      {/* Longest chain duration header */}
      {longestChain?.duration != null && (
        <div
          className="px-4 py-2.5 text-sm font-medium"
          style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}
        >
          Longest chain duration:{' '}
          <span className="font-semibold" style={{ color: '#1E2B4A' }}>
            {formatMs(longestChain.duration)}
          </span>
        </div>
      )}

      {/* Table header */}
      <div
        className="grid px-4 py-3 text-xs font-semibold uppercase tracking-wide"
        style={{ gridTemplateColumns: TREE_GRID, backgroundColor: '#EEF2F7', color: '#64748B' }}
      >
        <span>Resource</span>
        <span>Transfer Size</span>
        <span>Duration</span>
        <span>Path</span>
      </div>

      {/* Root nodes */}
      {Object.values(chains).map((node, i) => (
        <NetworkTreeNode key={i} node={node} depth={0} />
      ))}
    </div>
  )
}

/* ── Critical Request Chain tree ─────────────────────────── */

function ChainTreeTable({ items, wastedMs }) {
  return (
    <div>
      <div style={{ height: 8 }} />

      {/* Longest chain duration header */}
      {wastedMs != null && (
        <div className="px-6 py-2.5 text-sm font-medium" style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}>
          Longest chain duration:{' '}
          <span className="font-semibold" style={{ color: '#1E2B4A' }}>
            {wastedMs >= 1000 ? `${(wastedMs / 1000).toFixed(2)} s` : `${Math.round(wastedMs)} ms`}
          </span>
        </div>
      )}

      {/* Table header */}
      <div
        className="grid px-6 py-3 text-xs font-semibold uppercase tracking-wide"
        style={{ gridTemplateColumns: '1fr 130px 130px', backgroundColor: '#EEF2F7', color: '#64748B' }}
      >
        <span>Resource</span>
        <span>Transfer Size</span>
        <span>Duration</span>
      </div>

      {/* Rows */}
      {items.map((item, i) => {
        const depth = item.depth ?? 0
        const indent = depth * 20
        return (
          <div
            key={i}
            className="grid px-6 py-3 items-center"
            style={{ gridTemplateColumns: '1fr 130px 130px', borderBottom: '1px solid #F1F5F9' }}
          >
            {/* Resource — indented URL */}
            <div className="flex items-center gap-1.5 pr-4 min-w-0">
              {depth > 0 && (
                <span className="shrink-0 text-xs" style={{ color: '#CBD5E1', paddingLeft: indent - 20 }}>└─</span>
              )}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm truncate hover:underline"
                style={{ color: '#2563EB' }}
                title={item.url}
              >
                {truncate(item.url, 70)}
              </a>
            </div>

            {/* Transfer Size */}
            <span className="text-sm" style={{ color: '#475569' }}>
              {item.transferSize != null ? formatBytes(item.transferSize) : '—'}
            </span>

            {/* Duration */}
            <span className="text-sm" style={{ color: '#475569' }}>
              {item.duration != null ? formatMs(item.duration) : '—'}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ── helpers for node/element selector ───────────────────── */

function nodeSelector(item) {
  const node = item.node || item.element
  if (!node) return null
  return node.selector || node.nodeLabel || node.snippet || node.path || null
}

/* ── Main CheckRow ────────────────────────────────────────── */

export default function CheckRow({
  title,
  variant = 'passed',
  description,
  learnMoreUrl,
  displayValue,
  failingElements,
  wastedMs,
  items = [],
  tabKey = 'accessibility',
  auditId = '',
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isIssue = variant === 'issue'
  const isAccessibility = tabKey === 'accessibility'
  const isChainTree   = auditId === 'critical-request-chains' && items.some(i => i.depth != null)
  const isNetworkTree = items.some(i => i.type === 'list-section' && i.value?.type === 'network-tree')

  const elementRows = items.filter(i => (i.node || i.element) && nodeSelector(i))

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

        {/* displayValue badge for non-accessibility */}
        {isIssue && !isAccessibility && displayValue && (
          <span
            className="shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: '#FEF3C7', color: '#B45309' }}
          >
            {displayValue}
          </span>
        )}

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
          {!isIssue && !description && (
            <div className="px-5 py-4">
              <p className="text-sm" style={{ color: '#22C55E' }}>All checks passed ✓</p>
            </div>
          )}

          {/* ── Accessibility: simple failing elements list ── */}
          {isIssue && isAccessibility && elementRows.length > 0 && (
            <div className="px-5 pb-5">
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
                {/* Header */}
                <div
                  className="grid px-4 py-2.5 text-xs font-semibold"
                  style={{ gridTemplateColumns: '40px 1fr', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B' }}
                >
                  <span>#</span>
                  <span>Failing Elements</span>
                </div>
                {/* Rows */}
                {elementRows.map((item, i) => (
                  <div
                    key={i}
                    className="grid px-4 py-3 items-start"
                    style={{ gridTemplateColumns: '40px 1fr', borderBottom: i < elementRows.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                  >
                    <span className="text-sm" style={{ color: '#94A3B8' }}>{i + 1}</span>
                    <span className="text-sm font-mono break-all leading-relaxed" style={{ color: '#475569' }}>
                      {nodeSelector(item)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Non-accessibility: chain tree or generic table ── */}
          {isIssue && !isAccessibility && items.length > 0 && (
            <div className="px-5 pb-5">
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}
              >
                {isNetworkTree
                  ? <NetworkTreeTable items={items} />
                  : isChainTree
                  ? <ChainTreeTable items={items} wastedMs={wastedMs} />
                  : <GenericItemsTable items={items} />
                }
              </div>
            </div>
          )}

          {/* Fallback: accessibility with no parseable elements */}
          {isIssue && isAccessibility && elementRows.length === 0 && failingElements != null && failingElements > 0 && (
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
