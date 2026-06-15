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
          <div className="text-center py-8 space-y-3">
            <p className="text-4xl">✉️</p>
            <h2 className="text-2xl font-bold" style={{ color: '#1E2B4A' }}>Report sent!</h2>
            <p className="text-sm" style={{ color: '#64748B' }}>Check your inbox for the full audit report.</p>
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
