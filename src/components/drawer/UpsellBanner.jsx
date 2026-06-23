const CONTENT = {
  accessibility: {
    good:    { heading: 'Just a few steps from full accessibility', body: 'Your page is in good shape based on automated checks. Refine a few areas, then run a full scan with manual checks to ensure full compliance.' },
    warning: { heading: 'Accessibility issues are blocking users', body: 'Several WCAG 2.2 failures were detected. A full site scan with guided fixes will help you reach compliance before they affect more visitors.' },
    poor:    { heading: 'Critical accessibility barriers found', body: 'Your page has serious WCAG violations that exclude users with disabilities. Get a complete audit with prioritised fixes to resolve them fast.' },
  },
  performance: {
    good:    { heading: 'Almost at peak performance', body: 'Your page loads fast for most users. A full scan will surface the remaining bottlenecks and help you squeeze out every millisecond.' },
    warning: { heading: 'Performance is hurting your conversions', body: 'Slow load times increase bounce rates. Run a full audit to get AI-powered fixes for LCP, CLS, and TBT across your entire site.' },
    poor:    { heading: 'Your page is critically slow', body: 'Users are leaving before your page loads. A complete performance audit with prioritised fixes can dramatically cut your load time.' },
  },
  quality: {
    good:    { heading: 'Good hygiene — a few things to tighten up', body: 'Best practices are mostly in place. A full scan will catch the remaining issues across security headers, console errors, and code quality.' },
    warning: { heading: 'Best-practice gaps are adding up', body: 'Several quality checks failed. Run a full site audit to get actionable fixes for security headers, deprecated APIs, and more.' },
    poor:    { heading: 'Quality issues need urgent attention', body: 'Your page has serious best-practice violations that could affect security and reliability. Get a full audit to resolve them.' },
  },
  seo: {
    good:    { heading: 'Strong SEO — fine-tune for top rankings', body: 'Your fundamentals are solid. A full scan will surface the remaining on-page signals holding you back from the top position.' },
    warning: { heading: 'SEO gaps are limiting your visibility', body: 'Missing meta tags, poor structure, or crawlability issues are costing you traffic. Run a complete SEO audit across your whole site.' },
    poor:    { heading: 'Critical SEO issues found', body: 'Search engines may struggle to index your page. A full audit will identify and prioritise every blocking issue so you can rank.' },
  },
}

const TIER_STYLES = {
  good:    { bg: '#F0FDF4', border: '#86EFAC', heading: '#16A34A', body: '#166534' },
  warning: { bg: '#FEF3E2', border: '#FED7AA', heading: '#F97316', body: '#92400E' },
  poor:    { bg: '#FEF2F2', border: '#FECACA', heading: '#EF4444', body: '#991B1B' },
}

function tier(score) {
  if (score == null || score >= 90) return 'good'
  if (score >= 50) return 'warning'
  return 'poor'
}

export default function UpsellBanner({ tab = 'accessibility', score }) {
  const category = CONTENT[tab] ?? CONTENT.accessibility
  const t = tier(score)
  const { heading, body } = category[t]
  const styles = TIER_STYLES[t]

  return (
    <div
      className="rounded-2xl p-8 text-center"
      style={{ backgroundColor: styles.bg, border: `1px solid ${styles.border}` }}
    >
      <h3 className="text-lg font-bold mb-2" style={{ color: styles.heading }}>
        {heading}
      </h3>
      <p className="text-sm leading-relaxed mb-6 max-w-lg mx-auto" style={{ color: styles.body }}>
        {body}
      </p>
      <a
        href="https://www.webyes.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#2563EB' }}
      >
        Ensure full compliance ↗
      </a>
    </div>
  )
}
