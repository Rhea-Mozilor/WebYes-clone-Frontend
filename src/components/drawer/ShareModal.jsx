import { useState } from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { generatePDFFromReport } from '@/lib/reportGenerator'

export default function ShareModal({ report, onClose }) {
  const [email, setEmail] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [sent, setSent] = useState(false)
  const [generating, setGenerating] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setGenerating(true)
    try {
      await generatePDFFromReport(report)
    } finally {
      setGenerating(false)
      setSent(true)
    }
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent
        showCloseButton={false}
        className="w-[90vw] max-w-xl sm:max-w-xl rounded-sm p-0 gap-0 overflow-hidden"
      >
        {sent ? (
          <div className="px-8 py-14 text-center space-y-5">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 transition-opacity hover:opacity-60"
              style={{ color: '#37373a' }}
            >
              <X size={18} />
            </button>
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#1ba74e' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold" style={{ color: '#1E2B4A' }}>Your audit report is on its way!</h2>
            <p className="text-base" style={{ color: '#000000' }}>
              We've sent the report to <span style={{ color: '#2563EB' }}>{email}</span>. 
              <br />Please check your inbox.
            </p>
            <div className="flex gap-3 justify-center pt-10">
              {[
                {
                  label: 'Open Gmail',
                  href: 'https://mail.google.com',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
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
                    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
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
                    <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
                      <rect x="2" y="10" width="44" height="30" rx="4" fill="#1C8EF9"/>
                      <path d="M2 14l22 14 22-14" stroke="white" strokeWidth="2.5" fill="none"/>
                    </svg>
                  ),
                },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                  style={{ border: '1px solid #000000', color: '#1E2B4A' }}
                >
                  {icon}
                  {label}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="px-10 pt-10 pb-0">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 transition-opacity hover:opacity-60"
                style={{ color: '#94A3B8' }}
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-bold mb-6" style={{ color: '#030408' }}>
                Get your detailed audit report
              </h2>

              {/* Tab */}
              <div style={{ borderBottom: '1px solid #E2E8F0' }}>
                <span
                  className="inline-block pb-2 text-base font-medium"
                  style={{ color: '#2563EB', borderBottom: '2px solid #2563EB', marginBottom: -1 }}
                >
                  Email report
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="px-10 py-8 space-y-7">
              <p className="text-base" style={{ color: '#000000' }}>
                Drop your email and we'll send the full report straight to your inbox.
              </p>

              <div className="space-y-2">
                <label className="text-base font-medium" style={{ color: '#0F172A' }}>
                  Business email<span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="w-full rounded-lg px-5 py-4 text-base outline-none"
                  style={{ border: '1.5px solid #2563EB', color: '#1E2B4A' }}
                />
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 shrink-0"
                />
                <span className="text-sm" style={{ color: '#64748B' }}>
                  I agree to receive educational and product related emails from WebYes.
                </span>
              </label>

              <button
                type="submit"
                disabled={generating}
                className="w-full py-4 rounded-sm text-white text-base font-semibold transition-opacity hover:opacity-90 disabled:opacity-70"
                style={{ backgroundColor: '#2563EB' }}
              >
                {generating ? 'Generating PDF…' : 'Send to my inbox'}
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
