import { ChevronLeft } from 'lucide-react'

export default function DrawerHeader({ onClose }) {
  return (
    <header className="flex items-center py-4">
      <button
        onClick={onClose}
        className="flex items-center gap-1 text-lg font-medium transition-opacity hover:opacity-75"
        style={{ color: '#000000' }}
      >
        <ChevronLeft size={20} />
        Back to home
      </button>
    </header>
  )
}
