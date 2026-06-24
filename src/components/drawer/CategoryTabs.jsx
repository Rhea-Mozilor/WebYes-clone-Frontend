import { Accessibility, Gauge, BadgeCheck, SearchCode } from 'lucide-react'

const TABS = [
  { key: 'accessibility', label: 'Accessibility', Icon: Accessibility },
  { key: 'performance',   label: 'Performance',   Icon: Gauge         },
  { key: 'quality',       label: 'Quality',       Icon: BadgeCheck    },
  { key: 'seo',           label: 'SEO',           Icon: SearchCode    },
]

export default function CategoryTabs({ categories, activeTab, onTabChange, children }) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #EEF2F7' }}>
      {/* Tab bar */}
      <div className="flex overflow-x-auto" style={{ backgroundColor: '#EEF2F7' }}>
        {TABS.map(({ key, label, Icon }) => {
          const active = activeTab === key
          const issueCount = categories[key]?.issuesFound ?? 0

          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className="flex items-center gap-2 px-20 py-6 rounded-t-lg sm:py-7 text-base sm:text-lg whitespace-nowrap transition-colors shrink-0 border-t-6"
              style={{
                borderTopColor: active ? '#2563EB' : 'transparent',
                backgroundColor: active ? '#ffffff' : 'transparent',
                color: '#000000',
                fontWeight: active ? 700 : 500,
              }}
            >
              <Icon size={20} style={{ color: '#000000' }} />
              {label}
              {issueCount > 0 && (
                <span className="text-base font-semibold" style={{ color: '#F97316' }}>
                  (△{issueCount})
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Active tab content */}
      <div className="p-5 space-y-6" style={{ backgroundColor: '#ffffff' }}>
        {children}
      </div>
    </div>
  )
}
