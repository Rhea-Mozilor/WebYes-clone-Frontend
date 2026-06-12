import { useEffect, useState } from 'react'
import DrawerHeader from './DrawerHeader'

export default function ResultsDrawer({ isOpen, onClose, children }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!isOpen) { setVisible(false); return }
    const id = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(id)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 flex flex-col overflow-hidden z-50 transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <DrawerHeader onClose={onClose} />
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#EEF2F7' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {children}
        </div>
      </div>
    </div>
  )
}
