import { X } from 'lucide-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import DrawerHeader from './DrawerHeader'

export default function ResultsDrawer({ isOpen, onClose, children }) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="p-0 gap-0 rounded-lg overflow-hidden flex flex-col"
      >
        <div className="flex-1 overflow-y-auto relative" style={{ backgroundColor: '#EEF2F7' }}>
          {/* Close button — pinned to top-right of drawer */}
          <button
            onClick={onClose}
            className="absolute top-4 right-6 flex items-center justify-center w-9 h-9 rounded-full transition-opacity hover:opacity-80 z-10"
            style={{ backgroundColor: '#2563EB', color: '#ffffff' }}
            aria-label="Close report"
          >
            <X size={18} />
          </button>

          <div className="max-w-screen-2xl mx-auto px-8 sm:px-16 lg:px-32 pt-4 pb-10 space-y-6">
            <DrawerHeader onClose={onClose} />
            {children}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
