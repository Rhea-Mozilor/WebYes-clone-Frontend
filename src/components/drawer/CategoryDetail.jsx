import HalfDonutGauge from '../ui/HalfDonutGauge'

export default function CategoryDetail({ category }) {
  const { score, description, totalChecks, passedChecks, issuesFound } = category

  return (
    <div className="flex flex-col sm:flex-row gap-8 items-start">
      {/* Half donut */}
      <div className="shrink-0 flex flex-col items-center">
        <HalfDonutGauge score={score} size={280} />
      </div>

      {/* Description + stats */}
      <div className="flex-1 space-y-5">
        <p className="text-sm leading-relaxed" style={{ color: '#64748B' }}>
          {description}
        </p>

        {/* Stats */}
        <div
          className="grid grid-cols-3 divide-x divide-[#E2E8F0] rounded-xl overflow-hidden"
          style={{ border: '1px solid #E2E8F0' }}
        >
          {[
            { label: 'Total checks',   value: totalChecks,  color: '#1E2B4A'  },
            { label: 'Passed checks',  value: passedChecks, color: '#22C55E'  },
            { label: 'Issues found',   value: issuesFound,  color: '#EF4444'  },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col items-center py-12 px-4">
              <span className="text-4xl font-bold" style={{ color }}>{value}</span>
              <span className="text-sm mt-1 text-center" style={{ color: '#64748B' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
