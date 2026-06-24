import HalfDonutGauge from '../ui/HalfDonutGauge'
import { CheckCircle2, CircleAlert } from 'lucide-react'

const TAB_LABELS = {
  accessibility: 'Accessibility',
  performance:   'Performance',
  quality:       'Quality',
  seo:           'SEO',
}

export default function CategoryDetail({ category, tabKey }) {
  const { score, description, totalChecks, passedChecks, issuesFound } = category
  const name = TAB_LABELS[tabKey] || tabKey

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center">
      {/* Half donut */}
      <div className="shrink-0 flex flex-col items-center">
        <HalfDonutGauge score={score} size={160} />
      </div>

      {/* Name + description + stats */}
      <div className="flex-1 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between w-full">
        <div className="flex flex-col gap-2">
          <h3 className="font-extrabold" style={{ fontSize: 28, color: '#000000' }}>{name}</h3>
          <p className="text-sm leading-relaxed" style={{ color: '#000000', maxWidth: 480 }}>
            {description}
          </p>
        </div>

        {/* Stats box — compact, pinned to right */}
        <div
          className="rounded-sm overflow-hidden shrink-0 w-full sm:w-64"
          style={{ border: '1px solid #E2E8F0' }}
        >
          {/* Total checks */}
          <div
            className="flex items-center justify-between px-4 py-3 pt-5 pl-6"
            style={{ borderBottom: '1px solid #ffffff' }}
          >
            <span className="text-sm font-medium" style={{ color: '#1E2B4A' }}>Total checks</span>
            <span className="text-sm font-bold" style={{ color: '#1E2B4A' }}>{totalChecks}</span>
          </div>

          {/* Passed checks */}
          <div className="px-4 py-2" style={{ borderBottom: '1px solid #ffffff' }}>
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} style={{ color: '#22C55E' }} />
                <span className="text-sm font-medium" style={{ color: '#15803D' }}>Passed checks</span>
              </div>
              <span className="text-sm font-bold" style={{ color: '#15803D' }}>{passedChecks}</span>
            </div>
          </div>

          {/* Issues found */}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between px-2 py-1.5 rounded-lg" style={{ backgroundColor: '#FFF1F2' }}>
              <div className="flex items-center gap-2">
                <CircleAlert size={20} style={{ color: '#EF4444' }} />
                <span className="text-sm font-medium" style={{ color: '#DC2626' }}>Issues found</span>
              </div>
              <span className="text-sm font-bold" style={{ color: '#DC2626' }}>{issuesFound}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
