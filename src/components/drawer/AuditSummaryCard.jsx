import { useState } from 'react'
import { Globe, Calendar, Monitor, Smartphone, Share2, Bell } from 'lucide-react'
import ShareModal from './ShareModal'

const formatDate = (iso) =>
  new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
  }).format(new Date(iso))

export default function AuditSummaryCard({ report }) {
  const { url, screenshot, location, scannedAt, device } = report
  const [showShare, setShowShare] = useState(false)

  return (
    <div
      className="bg-white rounded-2xl flex gap-0 items-stretch overflow-hidden"
      style={{ border: '1px solid #E2E8F0' }}
    >
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}

      {/* Screenshot — left 45% */}
      <div
        className="shrink-0 flex items-center justify-center p-5"
        style={{
          width: '45%',
          minHeight: 320,
          backgroundColor: '#F1F5F9',
          borderRight: '1px solid #E2E8F0',
        }}
      >
        {screenshot
          ? <div
              className="w-full rounded-2xl overflow-hidden"
              style={{
                aspectRatio: '4 / 3',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              }}
            >
              <img
                src={screenshot}
                alt={`Screenshot of ${url}`}
                className="w-full h-full object-cover"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>
          : <Globe size={40} style={{ color: '#CBD5E1' }} />
        }
      </div>

      {/* Meta — right 55% */}
      <div className="flex-1 flex flex-col justify-between p-8">
        <div className="space-y-3">
          {/* Headline + Share */}
          <div className="flex items-start justify-between gap-4">
            <h2
              className="font-black leading-tight"
              style={{ fontSize: 36, color: '#0F172A' }}
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
          <div className="flex items-center gap-2 text-base" style={{ color: '#1E2B4A' }}>
            <span className="font-medium">{url}</span>
            <span
              className="flex items-center justify-center rounded-lg p-1"
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
          className="flex items-start gap-3 rounded-xl px-4 py-4 mt-6"
          style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
        >
          <Bell size={18} className="shrink-0 mt-0.5" style={{ color: '#64748B' }} />
          <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
            You're seeing results for just one page. To get a full-site audit report and uncover all critical issues,{' '}
            <a href="#" className="font-semibold underline" style={{ color: '#2563EB' }}>sign up for free. ↗</a>
          </p>
        </div>
      </div>
    </div>
  )
}
