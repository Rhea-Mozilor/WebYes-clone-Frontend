import { Zap } from 'lucide-react'

export default function UpsellBanner() {
  return (
    <div
      className="rounded-2xl p-5 flex items-start gap-4"
      style={{
        backgroundColor: '#FEF3E2',
        border: '1px solid #FED7AA',
        borderLeft: '4px solid #F97316',
      }}
    >
      {/* Icon */}
      <div
        className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
        style={{ backgroundColor: '#F97316' }}
      >
        <Zap size={18} fill="white" style={{ color: 'white' }} />
      </div>

      {/* Text + CTA */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold mb-1" style={{ color: '#1E2B4A' }}>
          Get a full manual accessibility audit
        </p>
        <p className="text-xs leading-relaxed mb-3" style={{ color: '#92400E' }}>
          Our experts will review your site against all WCAG 2.2 criteria and deliver
          a prioritised fix report within 48 hours.
        </p>
        <button
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold
            text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#F97316' }}
        >
          <Zap size={13} fill="white" style={{ color: 'white' }} />
          Get Expert Audit
        </button>
      </div>
    </div>
  )
}
