export default function ProgressBar({ score, color }) {
  return (
    <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, score))}%`, backgroundColor: color }}
      />
    </div>
  )
}
