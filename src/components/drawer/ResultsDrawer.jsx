import { Sheet, SheetContent } from '@/components/ui/sheet'
import DrawerHeader from './DrawerHeader'

export default function ResultsDrawer({ isOpen, onClose, children }) {
  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="p-0 gap-0 rounded-none flex flex-col"
      >
        <DrawerHeader onClose={onClose} />
        <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#EEF2F7' }}>
          <div className="max-w-screen-2xl mx-auto px-16 sm:px-20 py-10 space-y-6">
            {children}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
