import { PieChart, Pie, Cell } from 'recharts'

const scoreColor = (score) => score >= 70 ? '#2563EB' : '#F97316'

export default function HalfDonutGauge({ score, size = 50 }) {
  const color = scoreColor(score)
  const track = color === '#F97316' ? '#FEE9D4' : '#DBEAFE'
  const data = [{ value: score }, { value: 100 - score }]
  const innerRadius = size * 0.36
  const outerRadius = size * 0.48
  const chartHeight = size / 2 + outerRadius * 0.15

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
          <Cell fill={track} />
        </Pie>
      </PieChart>
      <span
        className="absolute font-bold leading-none"
        style={{
          fontSize: size * 0.2,
          color,
          bottom: 0,
          left: '55%',
          transform: 'translateX(-50%)',
        }}
      >
        {score}%
      </span>
    </div>
  )
}
