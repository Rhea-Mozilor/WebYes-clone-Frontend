import { PieChart, Pie, Cell } from 'recharts'

const scoreColor = (score) => {
  if (score >= 80) return '#22C55E'
  if (score >= 50) return '#F59E0B'
  return '#EF4444'
}

export default function DonutGauge({ score, size = 120 }) {
  const color = scoreColor(score)
  const data = [
    { value: score },
    { value: 100 - score },
  ]
  const innerRadius = size * 0.34
  const outerRadius = size * 0.46

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <PieChart width={size} height={size}>
        <Pie
          data={data}
          cx={size / 2}
          cy={size / 2}
          startAngle={90}
          endAngle={-270}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="value"
          strokeWidth={0}
        >
          <Cell fill={color} />
          <Cell fill="#E2E8F0" />
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-bold leading-none" style={{ fontSize: size * 0.22, color }}>
          {score}
        </span>
        <span className="text-[#64748B] leading-none mt-1" style={{ fontSize: size * 0.1 }}>
          /100
        </span>
      </div>
    </div>
  )
}
