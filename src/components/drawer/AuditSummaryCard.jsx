import { Globe, Calendar, Monitor, Smartphone } from 'lucide-react'

const formatDate = (iso) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))

export default function AuditSummaryCard({ report }) {
  const { url, screenshot, location, scannedAt, device } = report

  return (
    <div
      className="bg-white rounded-2xl p-5 flex gap-5 items-start"
      style={{ border: '1px solid #E2E8F0' }}
    >
      {/* Screenshot / placeholder */}
      <div
        className="shrink-0 w-28 h-20 rounded-xl overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: '#EEF2F7', border: '1px solid #E2E8F0' }}
      >
        {screenshot ? (
          <img src={screenshot} alt={`Screenshot of ${url}`} className="w-full h-full object-cover" />
        ) : (
          <Globe size={28} style={{ color: '#CBD5E1' }} />
        )}
      </div>

      {/* Meta */}
      <div className="flex-1 min-w-0 space-y-2">
        <p className="font-semibold text-sm truncate" style={{ color: '#1E2B4A' }}>
          {url}
        </p>

        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {/* Location */}
          {location && (
            <span className="flex items-center gap-1.5 text-xs" style={{ color: '#64748B' }}>
              <span>{location.flag}</span>
              {location.city}
            </span>
          )}

          {/* Date */}
          <span className="flex items-center gap-1.5 text-xs" style={{ color: '#64748B' }}>
            <Calendar size={12} />
            {formatDate(scannedAt)}
          </span>

          {/* Device */}
          <span className="flex items-center gap-1.5 text-xs" style={{ color: '#64748B' }}>
            {device === 'mobile' ? <Smartphone size={12} /> : <Monitor size={12} />}
            {device === 'mobile' ? 'Mobile' : 'Desktop'}
          </span>
        </div>
      </div>
    </div>
  )
}
