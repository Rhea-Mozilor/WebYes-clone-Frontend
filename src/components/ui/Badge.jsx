const variants = {
  critical: { bg: '#FEE2E2', color: '#EF4444', label: 'Critical' },
  passed:   { bg: '#DCFCE7', color: '#22C55E', label: 'Passed'   },
  warning:  { bg: '#FEF3C7', color: '#F59E0B', label: 'Warning'  },
}

export default function Badge({ variant = 'passed', children }) {
  const { bg, color, label } = variants[variant] ?? variants.passed
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: bg, color }}
    >
      {children ?? label}
    </span>
  )
}
