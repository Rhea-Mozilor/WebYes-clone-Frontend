import { Check, ExternalLink } from 'lucide-react'

const PILLS = ['Full site scan', 'AI-powered solutions', 'Built for teams']

export default function BottomCTA() {
  return (
    <div
      className="rounded-lg px-6 py-12 flex flex-col items-center text-center gap-6"
      style={{ backgroundColor: '#EEF2F7' }}
    >
      <h2 className="text-2xl font-extrabold text-black leading-tight max-w-2xl">
        Fix what's slowing down your site with a complete audit
      </h2>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {PILLS.map((label) => (
          <span
            key={label}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white"
            style={{ border: '1px solid #E2E8F0', color: '#1E2B4A' }}
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-lg" style={{ backgroundColor: '#DCFCE7' }}>
              <Check size={12} strokeWidth={3} style={{ color: '#22C55E' }} />
            </span>
            {label}
          </span>
        ))}
      </div>

      <a
        href="https://app.webyes.com/login"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-bold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#2563EB' }}
      >
        Get a free audit
        <ExternalLink size={16} />
      </a>

      <p className="text-sm flex items-center gap-4" style={{ color: '#64748B' }}>
        <span className="flex items-center gap-1.5"><Check size={14} /> 7-day free trial</span>
        <span className="flex items-center gap-1.5"><Check size={14} /> Cancel anytime</span>
      </p>
    </div>
  )
}
