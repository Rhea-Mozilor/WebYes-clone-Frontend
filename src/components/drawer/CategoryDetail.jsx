import HalfDonutGauge from '../ui/HalfDonutGauge'

export default function CategoryDetail({ category }) {
  const { score, description, totalChecks, passedChecks, issuesFound } = category

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      {/* Half donut */}
      <div className="flex flex-col items-center shrink-0">
        <HalfDonutGauge score={score} size={160} />
      </div>

      {/* Description + stats */}
      <div className="flex-1 space-y-4">
        <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
          {description}
        </p>

        {/* Stats grid */}
        <div
          className="grid grid-cols-3 divide-x divide-[#E2E8F0] rounded-xl overflow-hidden"
          style={{ border: '1px solid #E2E8F0' }}
        >
          {[
            { label: 'Total Checks', value: totalChecks, color: '#1E2B4A'  },
            { label: 'Passed',       value: passedChecks, color: '#22C55E' },
            { label: 'Issues Found', value: issuesFound,  color: '#EF4444' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col items-center py-4 px-2" style={{ borderColor: '#E2E8F0' }}>
              <span className="text-2xl font-bold" style={{ color }}>
                {value}
              </span>
              <span className="text-xs mt-1 text-center" style={{ color: '#64748B' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
