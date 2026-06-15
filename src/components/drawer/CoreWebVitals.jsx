const METRIC_DEFS = [
  { id: 'first-contentful-paint',  label: 'First Contentful Paint' },
  { id: 'largest-contentful-paint', label: 'Largest Contentful Paint' },
  { id: 'speed-index',             label: 'Speed Index' },
  { id: 'total-blocking-time',     label: 'Total Blocking Time' },
  { id: 'cumulative-layout-shift', label: 'Cumulative Layout Shift' },
]

function metricColor(score) {
  if (score == null) return '#64748B'
  if (score >= 90) return '#22C55E'
  if (score >= 50) return '#F59E0B'
  return '#EF4444'
}

function MetricCard({ label, metric }) {
  const color = metricColor(metric?.score)
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl p-4 text-center"
      style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', minWidth: 0 }}
    >
      <span className="text-xs font-medium mb-2" style={{ color: '#64748B' }}>{label}</span>
      <span className="text-xl font-bold" style={{ color }}>
        {metric?.displayValue || '–'}
      </span>
    </div>
  )
}

function Filmstrip({ frames }) {
  if (!frames?.length) return null
  return (
    <div>
      <h4 className="text-xs font-semibold mb-3" style={{ color: '#64748B' }}>
        FILMSTRIP TIMELINE
      </h4>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {frames.map((frame, i) => {
          const secs = (frame.timing / 1000).toFixed(2)
          return (
            <div key={i} className="flex flex-col items-center shrink-0">
              <div
                className="rounded-md overflow-hidden"
                style={{ border: '1px solid #E2E8F0', width: 80, height: 60 }}
              >
                <img
                  src={frame.data}
                  alt={`${secs}s`}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="mt-1 text-xs" style={{ color: '#64748B' }}>{secs}s</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CoreWebVitals({ metrics = {}, filmstrip = [] }) {
  const top4 = METRIC_DEFS.slice(0, 4)
  const cls  = METRIC_DEFS[4]

  const hasMetrics = Object.keys(metrics).length > 0

  if (!hasMetrics && !filmstrip.length) return null

  return (
    <div
      className="rounded-2xl p-5 space-y-5"
      style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}
    >
      <h3 className="text-sm font-semibold" style={{ color: '#1E2B4A' }}>
        Core web vitals
      </h3>

      {hasMetrics && (
        <>
          {/* Top 4 metrics */}
          <div className="grid grid-cols-4 gap-3">
            {top4.map((def) => (
              <MetricCard key={def.id} label={def.label} metric={metrics[def.id]} />
            ))}
          </div>

          {/* CLS centered */}
          <div className="flex justify-center">
            <div className="w-1/4">
              <MetricCard label={cls.label} metric={metrics[cls.id]} />
            </div>
          </div>
        </>
      )}

      {filmstrip.length > 0 && (
        <div
          className="pt-4"
          style={{ borderTop: hasMetrics ? '1px solid #E2E8F0' : 'none' }}
        >
          <Filmstrip frames={filmstrip} />
        </div>
      )}
    </div>
  )
}
