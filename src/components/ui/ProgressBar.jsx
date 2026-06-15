export default function ProgressBar({ score, color }) {
  // Track tinted to match fill color
  const track = color === '#F97316' ? '#FEE9D4' : '#DBEAFE'

  return (
    <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: track }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, score))}%`, backgroundColor: color }}
      />
    </div>
  )
}
