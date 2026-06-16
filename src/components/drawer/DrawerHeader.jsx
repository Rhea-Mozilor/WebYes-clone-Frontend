import { ChevronLeft, X } from 'lucide-react'

export default function DrawerHeader({ onClose }) {
  return (
    <header
      className="sticky top-0 z-10 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0"
      style={{ backgroundColor: '#ffffff' }}
    >
      <button
        onClick={onClose}
        className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-75"
        style={{ color: '#000000' }}
      >
        <ChevronLeft size={20} />
        Back to home
      </button>

      <button
        onClick={onClose}
        className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-white/10"
        style={{ color: '#000000' }}
        aria-label="Close report"
      >
        <X size={18} />
      </button>
    </header>
  )
}
