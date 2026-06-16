import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function ShareModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSent(true)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl w-full max-w-xl p-10 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 hover:opacity-60 transition-opacity"
          style={{ color: '#94A3B8' }}
        >
          <X size={22} />
        </button>

        {sent ? (
          <div className="text-center py-4 space-y-5">
            {/* Green checkmark circle */}
            <div className="flex justify-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#22C55E' }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-bold" style={{ color: '#1E2B4A' }}>
              Your audit report is on its way!
            </h2>

            {/* Subtext with email */}
            <p className="text-base" style={{ color: '#64748B' }}>
              We've sent the report to{' '}
              <span style={{ color: '#2563EB' }}>{email}</span>.{' '}
              Please check your inbox.
            </p>

            {/* Mail client buttons */}
            <div className="flex gap-3 justify-center pt-2">
              {[
                {
                  label: 'Open Gmail',
                  href: 'https://mail.google.com',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                      <path fill="#EA4335" d="M6 40h8V22.4L2 14v22c0 2.2 1.8 4 4 4z"/>
                      <path fill="#34A853" d="M34 40h8c2.2 0 4-1.8 4-4V14l-12 8.4z"/>
                      <path fill="#FBBC05" d="M34 10v12.4l12-8.4V12c0-4.9-5.6-7.7-9.6-4.8z"/>
                      <path fill="#4285F4" d="M14 22.4V10l10 7.2 10-7.2v12.4L24 30z"/>
                      <path fill="#C5221F" d="M2 12v2l12 8.4V10l-.4-.3C9.6 6.3 2 9.1 2 14z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Open Outlook',
                  href: 'https://outlook.live.com',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                      <rect x="2" y="8" width="28" height="32" rx="3" fill="#0078D4"/>
                      <rect x="6" y="12" width="20" height="24" rx="2" fill="#28A8E8"/>
                      <circle cx="16" cy="24" r="7" fill="white"/>
                      <circle cx="16" cy="24" r="5" fill="#0078D4"/>
                      <rect x="26" y="16" width="20" height="16" rx="2" fill="#0078D4"/>
                      <path d="M26 16l10 8 10-8" stroke="white" strokeWidth="1.5" fill="none"/>
                    </svg>
                  ),
                },
                {
                  label: 'Open Apple Mail',
                  href: 'mailto:',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
                      <rect x="2" y="10" width="44" height="30" rx="4" fill="#1C8EF9"/>
                      <path d="M2 14l22 14 22-14" stroke="white" strokeWidth="2.5" fill="none"/>
                      <rect x="6" y="14" width="14" height="10" rx="1" fill="white" opacity="0.3"/>
                    </svg>
                  ),
                },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-gray-50"
                  style={{ border: '1.5px solid #E2E8F0', color: '#1E2B4A' }}
                >
                  {icon}
                  {label}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Heading */}
            <h2 className="text-4xl font-black leading-tight" style={{ color: '#1E2B4A' }}>
              Get your detailed audit report
            </h2>

            {/* Tab */}
            <div style={{ borderBottom: '1px solid #E2E8F0' }}>
              <span
                className="inline-block pb-2 text-sm font-semibold"
                style={{ color: '#2563EB', borderBottom: '2px solid #2563EB', marginBottom: -1 }}
              >
                Email report
              </span>
            </div>

            {/* Description */}
            <p className="text-base" style={{ color: '#1E2B4A' }}>
              Drop your email and we'll send the full report straight to your inbox.
            </p>

            {/* Email field */}
            <div className="space-y-2">
              <label className="text-base font-semibold" style={{ color: '#1E2B4A' }}>
                Business email<span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jhone@example.com"
                required
                className="w-full rounded-xl px-4 py-4 text-base outline-none transition-all"
                style={{
                  border: '2px solid #2563EB',
                  color: '#1E2B4A',
                }}
              />
            </div>

            {/* Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 shrink-0 cursor-pointer"
              />
              <span className="text-sm" style={{ color: '#1E2B4A' }}>
                I agree to receive educational and product related emails from WebYes.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-5 rounded-xl text-white text-lg font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#2563EB' }}
            >
              Send to my inbox
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
