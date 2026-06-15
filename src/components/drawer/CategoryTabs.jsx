const TABS = [
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'performance',   label: 'Performance'   },
  { key: 'quality',       label: 'Quality'        },
  { key: 'seo',           label: 'SEO'            },
]

export default function CategoryTabs({ categories, activeTab, onTabChange, children }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
      {/* Tab bar */}
      <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid #E2E8F0' }}>
        {TABS.map(({ key, label }) => {
          const active = activeTab === key
          const issueCount = categories[key]?.issuesFound ?? 0

          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className="flex items-center gap-2 px-7 py-5 text-base whitespace-nowrap transition-colors shrink-0 border-b-2"
              style={{
                borderBottomColor: active ? '#2563EB' : 'transparent',
                color: active ? '#2563EB' : '#64748B',
                fontWeight: active ? 600 : 400,
              }}
            >
              {label}
              {issueCount > 0 && (
                <span
                  className="inline-flex items-center gap-0.5 text-xs font-semibold"
                  style={{ color: '#F97316' }}
                >
                  △{issueCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Active tab content */}
      <div className="p-5 space-y-6">
        {children}
      </div>
    </div>
  )
}
