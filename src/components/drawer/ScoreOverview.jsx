import { Accessibility, Gauge, ShieldCheck, SearchCode, CircleHelp } from 'lucide-react'
import DonutGauge from '../ui/DonutGauge'
import ProgressBar from '../ui/ProgressBar'

const CATEGORIES = [
  { key: 'accessibility', label: 'Accessibility', Icon: Accessibility },
  { key: 'performance',   label: 'Performance',   Icon: Gauge         },
  { key: 'quality',       label: 'Quality',        Icon: ShieldCheck   },
  { key: 'seo',           label: 'SEO',            Icon: SearchCode    },
]

// <70 → orange, ≥70 → primary blue
const scoreColor = (score) => score >= 70 ? '#2563EB' : '#F97316'

function tagline(score) {
  if (score >= 90) return 'Great job! Your page is in excellent shape.'
  if (score >= 70) return 'You\'re on the right track! Apply recommended fixes to fine-tune your webpage.'
  return 'Several improvements needed. Check the issues below to boost your score.'
}

export default function ScoreOverview({ overallScore, scores }) {
  return (
    <div className="flex gap-4">
      {/* Left card — donut */}
      <div
        className="bg-white rounded-2xl flex flex-col items-start gap-4 p-7 min-h-[390px] flex-1"
        style={{ border: '1px solid #E2E8F0' }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-base font-semibold" style={{ color: '#1E2B4A' }}>Webpage health score</span>
          <CircleHelp size={15} style={{ color: '#94A3B8' }} />
        </div>

        <div className="flex justify-center w-full">
          <DonutGauge score={overallScore} size={220} />
        </div>

        <p className="text-xs text-center leading-relaxed w-full" style={{ color: '#64748B' }}>
          {tagline(overallScore)}
        </p>
      </div>

      {/* Right card — category bars */}
      <div
        className="bg-white rounded-2xl flex-1 p-7 flex flex-col justify-between gap-2 min-h-[390px]"
        style={{ border: '1px solid #E2E8F0' }}
      >
        {CATEGORIES.map(({ key, label, Icon }) => {
          const score = scores[key] ?? 0
          const color = scoreColor(score)
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Icon size={17} style={{ color: '#64748B' }} />
                  <span className="text-base font-semibold" style={{ color: '#1E2B4A' }}>{label}</span>
                </div>
                <span className="text-base font-bold" style={{ color }}>{score}%</span>
              </div>
              <ProgressBar score={score} color={color} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
