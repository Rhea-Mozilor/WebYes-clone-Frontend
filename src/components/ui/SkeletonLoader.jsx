const rowWidths = ['w-full', 'w-4/5', 'w-2/3']

export default function SkeletonLoader({ rows = 4, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`animate-pulse h-4 rounded-md bg-[#E2E8F0] ${rowWidths[i % 3]}`} />
      ))}
    </div>
  )
}
