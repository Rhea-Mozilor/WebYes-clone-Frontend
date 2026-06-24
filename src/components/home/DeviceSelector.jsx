import { Monitor, Smartphone } from 'lucide-react'

const OPTIONS = [
  { value: 'desktop', label: 'Desktop', Icon: Monitor },
  { value: 'mobile',  label: 'Mobile',  Icon: Smartphone },
]

export default function DeviceSelector({ value, onChange }) {
  return (
    <div
      className="inline-flex rounded-lg p-1 gap-1"
      style={{ backgroundColor: '#E2E8F0' }}
    >
      {OPTIONS.map(({ value: opt, label, Icon }) => {
        const active = value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="flex items-center gap-2 px-4 h-10 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: active ? '#2563EB' : 'transparent',
              color: active ? '#FFFFFF' : '#64748B',
            }}
          >
            <Icon size={15} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
