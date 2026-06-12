import { PieChart, Pie, Cell } from 'recharts'

const scoreColor = (score) => {
  if (score >= 80) return '#22C55E'
  if (score >= 50) return '#F59E0B'
  return '#EF4444'
}

export default function HalfDonutGauge({ score, size = 160 }) {
  const color = scoreColor(score)
  const data = [
    { value: score },
    { value: 100 - score },
  ]
  const innerRadius = size * 0.36
  const outerRadius = size * 0.48
  const chartHeight = size / 2 + outerRadius * 0.1

  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size }}>
      <PieChart width={size} height={chartHeight}>
        <Pie
          data={data}
          cx={size / 2}
          cy={size / 2}
          startAngle={180}
          endAngle={0}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="value"
          strokeWidth={0}
        >
          <Cell fill={color} />
          <Cell fill="#E2E8F0" />
        </Pie>
      </PieChart>
      <div className="flex flex-col items-center -mt-2">
        <span className="font-bold leading-none" style={{ fontSize: size * 0.2, color }}>
          {score}
        </span>
        <span className="text-[#64748B] text-xs mt-0.5">/100</span>
      </div>
    </div>
  )
}
