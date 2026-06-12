import { ArrowRight } from 'lucide-react'

export default function BottomCTA() {
  return (
    <div
      className="rounded-2xl px-6 py-10 flex flex-col items-center text-center gap-4"
      style={{ backgroundColor: '#1E2B4A' }}
    >
      <h2 className="text-xl font-bold text-white leading-snug max-w-sm">
        Fix what's slowing down your site
      </h2>
      <p className="text-sm max-w-md leading-relaxed" style={{ color: '#94A3B8' }}>
        WebYes turns your audit results into a step-by-step action plan — so your team
        knows exactly what to fix, in what order, and why it matters.
      </p>
      <button
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
          text-white transition-opacity hover:opacity-90 mt-2"
        style={{ backgroundColor: '#2563EB' }}
      >
        Start fixing for free
        <ArrowRight size={16} />
      </button>
      <p className="text-xs" style={{ color: '#475569' }}>
        No credit card required
      </p>
    </div>
  )
}
