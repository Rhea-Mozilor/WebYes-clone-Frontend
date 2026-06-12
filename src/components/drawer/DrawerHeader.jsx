import { ChevronLeft, X } from 'lucide-react'

export default function DrawerHeader({ onClose }) {
  return (
    <header
      className="sticky top-0 z-10 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0"
      style={{ backgroundColor: '#1E2B4A' }}
    >
      <button
        onClick={onClose}
        className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-75"
        style={{ color: '#94A3B8' }}
      >
        <ChevronLeft size={18} />
        Back
      </button>

      <span className="text-white font-bold text-base tracking-tight">
        Web<span style={{ color: '#F97316' }}>Yes</span>
        <span className="ml-2 text-xs font-normal" style={{ color: '#94A3B8' }}>
          Audit Report
        </span>
      </span>

      <button
        onClick={onClose}
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-white/10"
        style={{ color: '#94A3B8' }}
        aria-label="Close report"
      >
        <X size={18} />
      </button>
    </header>
  )
}
