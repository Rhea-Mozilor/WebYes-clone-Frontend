import { useState } from 'react'
import { Globe, Calendar, Monitor, Smartphone, Share2, Bell } from 'lucide-react'
import ShareModal from './ShareModal'

const formatDate = (iso) => {
  const d = new Date(iso)
  const date = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(d)
  const time = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC',
  }).format(d)
  return `${date} ${time} (UTC)`
}

export default function AuditSummaryCard({ report }) {
  const { url, screenshot, location, scannedAt, device } = report
  const [showShare, setShowShare] = useState(false)

  return (
    <div
      className="bg-white rounded-sm flex flex-col sm:flex-row gap-0 items-stretch overflow-hidden"
      style={{ border: '1px solid #E2E8F0' }}
    >
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}

      {/* Screenshot */}
      <div
        className="shrink-0 sm:w-[38%] w-full flex items-center justify-center p-6 m-8 rounded-sm"
        style={{ backgroundColor: '#F1F5F9', minHeight: 220 }}
      >
        {screenshot
          ? <div
              className="w-full overflow-hidden"
              style={{ border: '1px solid #E2E8F0', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
            >
              <img
                src={screenshot}
                alt={`Screenshot of ${url}`}
                className="w-full object-cover block"
              />
            </div>
          : <Globe size={40} style={{ color: '#CBD5E1' }} />
        }
      </div>

      {/* Meta */}
      <div className="flex-1 flex flex-col justify-between p-5 sm:p-8">
        <div className="space-y-3">
          {/* Headline + Share */}
          <div className="flex items-start justify-between gap-4">
            <h2
              className="font-black leading-tight text-2xl sm:text-3xl"
              style={{ color: '#0F172A' }}
            >
              Your website audit is in!
            </h2>
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 text-sm font-medium shrink-0 mt-1 hover:opacity-70 transition-opacity"
              style={{ color: '#2563EB' }}
            >
              Share report
              <Share2 size={15} />
            </button>
          </div>

          {/* URL + device */}
          <div className="flex items-center gap-2 text-sm sm:text-base flex-wrap" style={{ color: '#1E2B4A' }}>
            <span className="font-medium">{url}</span>
            <span
              className="flex items-center justify-center rounded-sm p-1"
              style={{ backgroundColor: '#EEF2F7', border: '1px solid #E2E8F0' }}
            >
              {device === 'mobile'
                ? <Smartphone size={14} style={{ color: '#64748B' }} />
                : <Monitor size={14} style={{ color: '#64748B' }} />
              }
            </span>
          </div>

          {/* Location + date */}
          <div className="flex items-center gap-3 text-base" style={{ color: '#64748B' }}>
            {location && (
              <span className="flex items-center gap-1.5">
                <span>{location.flag}</span>
                <span>{location.city}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(scannedAt)}
            </span>
          </div>
        </div>

        {/* Info banner — pinned to bottom */}
        <div
          className="flex items-start gap-3 rounded-sm px-4 py-4 mt-6"
          style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
        >
          <Bell size={18} className="shrink-0 mt-0.5" style={{ color: '#64748B' }} />
          <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
            You're seeing results for just one page. To get a full-site audit report and uncover all critical issues,{' '}
            <a href="https://app.webyes.com/login" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: '#2563EB' }}>sign up for free. ↗</a>
          </p>
        </div>
      </div>
    </div>
  )
}
