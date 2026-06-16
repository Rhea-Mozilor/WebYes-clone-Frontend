const METRIC_DEFS = [
  { id: 'first-contentful-paint',   label: 'First Contentful Paint'   },
  { id: 'largest-contentful-paint', label: 'Largest Contentful Paint' },
  { id: 'speed-index',              label: 'Speed Index'               },
  { id: 'total-blocking-time',      label: 'Total Blocking Time'       },
  { id: 'cumulative-layout-shift',  label: 'Cumulative Layout Shift'   },
]

function metricColor(score) {
  if (score == null) return '#64748B'
  if (score >= 90)   return '#22C55E'
  if (score >= 50)   return '#F59E0B'
  return '#EF4444'
}

function MetricCard({ label, metric }) {
  const color = metricColor(metric?.score)
  return (
    <div
      className="flex flex-col gap-3 rounded-xl p-4"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', minWidth: 0 }}
    >
      <span className="text-sm leading-snug" style={{ color: '#64748B' }}>{label}</span>
      <span className="text-2xl font-bold" style={{ color }}>
        {metric?.displayValue || '–'}
      </span>
    </div>
  )
}

export default function CoreWebVitals({ metrics = {}, filmstrip = [] }) {
  const hasMetrics = Object.keys(metrics).length > 0
  if (!hasMetrics && !filmstrip.length) return null

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
    >
      <h3 className="text-base font-bold" style={{ color: '#1E2B4A' }}>Core web vitals</h3>

      {/* Inner sub-container */}
      <div
        className="rounded-xl p-5 space-y-6"
        style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
      >
        {/* All 5 metrics in one row */}
        {hasMetrics && (
          <div className="grid grid-cols-5 gap-3">
            {METRIC_DEFS.map((def) => (
              <MetricCard key={def.id} label={def.label} metric={metrics[def.id]} />
            ))}
          </div>
        )}

        {/* Filmstrip — timing labels above, images below */}
        {filmstrip.length > 0 && (
          <div className="overflow-x-auto">
            <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
              {filmstrip.map((frame, i) => {
                const secs = (frame.timing / 1000).toFixed(2) + 's'
                return (
                  <div key={i} className="flex flex-col items-start shrink-0" style={{ width: 148 }}>
                    <span className="text-xs mb-1.5" style={{ color: '#64748B' }}>{secs}</span>
                    <div
                      className="rounded-lg overflow-hidden w-full"
                      style={{ border: '1px solid #E2E8F0', height: 88 }}
                    >
                      <img
                        src={frame.data}
                        alt={secs}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
