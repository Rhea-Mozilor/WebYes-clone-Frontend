import { Eye, ExternalLink } from 'lucide-react'
import CheckRow from './CheckRow'

const GUEST_LIMIT = 5

export default function IssueList({ issues, tabKey = 'accessibility' }) {
  if (!issues?.length) return null

  const visible = issues.slice(0, GUEST_LIMIT)
  const hidden  = issues.length - visible.length

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
        {visible.map((issue) => (
          <CheckRow
            key={issue.id}
            auditId={issue.id}
            title={issue.title}
            variant="issue"
            description={issue.description}
            learnMoreUrl={issue.learnMoreUrl}
            displayValue={issue.displayValue}
            failingElements={issue.failingElements}
            wastedMs={issue.wastedMs}
            items={issue.items}
            tabKey={tabKey}
          />
        ))}
      </div>

      {/* Blurred ghost + CTA overlay for remaining issues */}
      {hidden > 0 && (
        <div className="relative overflow-hidden" style={{ borderTop: '1px solid #E2E8F0', minHeight: 220 }}>
          {/* Ghost row — stretched + blurred */}
          <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none', transform: 'scaleY(4)', transformOrigin: 'top' }}>
            <CheckRow
              auditId={issues[GUEST_LIMIT].id}
              title={issues[GUEST_LIMIT].title}
              variant="issue"
              displayValue={issues[GUEST_LIMIT].displayValue}
              failingElements={issues[GUEST_LIMIT].failingElements}
              tabKey={tabKey}
            />
          </div>

          {/* CTA overlay */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            style={{ background: 'rgba(255,255,255,0.78)' }}
          >
            {/* Eye + headline inline */}
            <div className="flex items-center gap-3 px-8">
              <div className="shrink-0" style={{ border: '2px dashed #2563EB', borderRadius: 8, padding: 8, color: '#2563EB' }}>
                <Eye size={30} />
              </div>
              <p className="text-xl font-bold text-left" style={{ color: '#2563EB' }}>
                Get the complete list of performance issues and fixes tailored to your site.
              </p>
            </div>

            <a
              href="https://www.webyes.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: '#2563EB' }}
            >
              Unlock complete audit <ExternalLink size={20} />
            </a>

            <div className="flex items-center gap-6 text-sm" style={{ color: '#000000' }}>
              <span>✓ Instant access</span>
              <span>✓ Site-wide audit</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
