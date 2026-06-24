export default function ProgressBar({ score, color }) {
  // Track tinted to match fill color
  const track = color === '#F97316' ? '#FEE9D4' : '#DBEAFE'

  return (
    <div className="w-full h-3 rounded-lg overflow-hidden" style={{ backgroundColor: track }}>
      <div
        className="h-full rounded-lg transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, score))}%`, backgroundColor: color }}
      />
    </div>
  )
}
