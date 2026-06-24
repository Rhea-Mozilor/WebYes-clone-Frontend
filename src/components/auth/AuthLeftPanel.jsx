export default function AuthLeftPanel({ headline, subtext }) {
  return (
    <div
      className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1E3A8A 0%, #1E2B4A 60%, #0F172A 100%)' }}
    >
      {/* Decorative product preview */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Main card */}
        <div className="w-72 rounded-xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
          {/* Issues header */}
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #E2E8F0' }}>
            <span className="text-sm font-bold" style={{ color: '#1E2B4A' }}>Issues</span>
            <span className="text-xs">
              <span style={{ color: '#1E2B4A' }}>Total issues: 321 </span>
              <span className="font-semibold" style={{ color: '#EF4444' }}>| Critical issues: 22</span>
            </span>
          </div>
          {/* Issue bars */}
          <div className="px-4 py-3 space-y-2">
            {[
              { label: 'Critical', count: 10, color: '#EF4444', pct: 30 },
              { label: 'Medium',   count: 229, color: '#F97316', pct: 70 },
              { label: 'Low',      count: 80, color: '#F59E0B', pct: 25 },
            ].map(({ label, count, color, pct }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: '#1E2B4A', fontWeight: 500 }}>{label}</span>
                  <span style={{ color: '#64748B' }}>{count} issues</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: '#E2E8F0' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                </div>
              </div>
            ))}
          </div>

          {/* WCAG overlay card */}
          <div className="mx-3 mb-3 rounded-lg p-3 shadow" style={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
            <div className="text-xs font-bold mb-2" style={{ color: '#1E2B4A' }}>WCAG 2.2 Criteria</div>
            {[
              { level: 'Level A',   desc: 'Basic accessibility requirements',    pct: '29.41%' },
              { level: 'Level AA',  desc: 'Intermediate accessibility compliance', pct: '31.11%' },
              { level: 'Level AAA', desc: 'Advanced accessibility standards',     pct: '32.07%' },
            ].map(({ level, desc, pct }) => (
              <div key={level} className="flex items-center gap-2 py-1">
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#DBEAFE' }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2563EB' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold" style={{ color: '#1E2B4A' }}>{level}</div>
                  <div className="text-xs truncate" style={{ color: '#64748B' }}>{desc}</div>
                </div>
                <span className="text-xs font-bold shrink-0" style={{ color: '#1E2B4A' }}>{pct}</span>
              </div>
            ))}
            <div className="mt-2 text-xs font-semibold" style={{ color: '#2563EB' }}>
              Understand WCAG 2.2 accessibility standards →
            </div>
          </div>
        </div>

        {/* Floating stat card */}
        <div
          className="absolute -bottom-4 -left-2 rounded-xl p-3 shadow-xl w-60"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="text-xs font-bold mb-2" style={{ color: '#1E2B4A' }}>WCAG Criteria Overview</div>
          <div className="text-xs mb-2" style={{ color: '#64748B' }}>Total WCAG checkpoints: 9234</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { n: '1414', sub: '/9234', label: 'Passed Audits',         color: '#22C55E' },
              { n: '336',  sub: '/9234', label: 'Failed Audits',         color: '#EF4444' },
              { n: '6816', sub: '/9234', label: 'Required manual checks', color: '#64748B' },
              { n: '668',  sub: '/9234', label: 'Not Applicable',         color: '#F97316' },
            ].map(({ n, sub, label, color }) => (
              <div key={label} className="rounded-lg p-2" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="text-sm font-black" style={{ color: '#1E2B4A' }}>
                  {n}<span className="text-xs font-normal" style={{ color: '#94A3B8' }}>{sub}</span>
                </div>
                <div className="text-xs" style={{ color }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom text */}
      <div className="mt-16 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2">{headline}</h2>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{subtext}</p>
        {/* Dot indicators */}
        <div className="flex gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1.5 rounded-full" style={{ width: i === 0 ? 24 : 8, backgroundColor: i === 0 ? '#ffffff' : 'rgba(255,255,255,0.35)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}
