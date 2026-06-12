import DonutGauge from '../ui/DonutGauge'
import ProgressBar from '../ui/ProgressBar'

const CATEGORIES = [
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'performance',   label: 'Performance'   },
  { key: 'quality',       label: 'Quality'        },
  { key: 'seo',           label: 'SEO'            },
]

const scoreColor = (score) => {
  if (score >= 80) return '#22C55E'
  if (score >= 50) return '#F59E0B'
  return '#EF4444'
}

export default function ScoreOverview({ overallScore, scores }) {
  return (
    <div
      className="bg-white rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-8"
      style={{ border: '1px solid #E2E8F0' }}
    >
      {/* Donut gauge */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        <DonutGauge score={overallScore} size={140} />
        <span className="text-xs font-medium" style={{ color: '#64748B' }}>
          Overall Score
        </span>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px self-stretch" style={{ backgroundColor: '#E2E8F0' }} />

      {/* Category bars */}
      <div className="flex-1 w-full space-y-4">
        {CATEGORIES.map(({ key, label }) => {
          const score = scores[key] ?? 0
          const color = scoreColor(score)
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium" style={{ color: '#1E2B4A' }}>
                  {label}
                </span>
                <span className="text-sm font-bold" style={{ color }}>
                  {score}
                </span>
              </div>
              <ProgressBar score={score} color={color} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
