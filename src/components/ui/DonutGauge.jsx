import { PieChart, Pie, Cell } from 'recharts'

export default function DonutGauge({ score, size = 120 }) {
  const data = [{ value: score }, { value: 100 - score }]
  const innerRadius = size * 0.35
  const outerRadius = size * 0.40 

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <PieChart width={size} height={size} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
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
          <Cell fill="#2563EB" />
          <Cell fill="#E8EFFD" />
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="leading-none" style={{ fontSize: size * 0.2, color: '#2563EB' }}>
          {score}%
        </span>
      </div>
    </div>
  )
}
