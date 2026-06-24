import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL

// ---------------------------------------------------------------------------
// Legacy stubs (kept for reference — not used by the guest flow)
// ---------------------------------------------------------------------------
export const startScan = ({ url, device }) =>
  axios.post(`${BASE}/scan`, { url, device }).then((r) => r.data)

export const getScanStatus = (scanId) =>
  axios.get(`${BASE}/scan/${scanId}`).then((r) => r.data)

export const getReport = (scanId) =>
  axios.get(`${BASE}/report/${scanId}`).then((r) => r.data)

// ---------------------------------------------------------------------------
// Guest scan — no auth required, returns full report in one shot
// ---------------------------------------------------------------------------

const CATEGORY_DESCRIPTIONS = {
  performance:      'Measures page speed metrics including LCP, FID, and CLS.',
  accessibility:    'Assess your website with automated WCAG 2.2 A/AA tests.',
  quality:          'Checks for best practices in HTML, security headers, and code quality.',
  seo:              'Ensures your page is optimised for search engine indexing and ranking.',
}

const makeCategory = (catData = {}, description) => {
  const critical    = catData.critical    || []
  const nonCritical = catData.non_critical || catData.nonCritical || []
  const allIssues   = [...critical, ...nonCritical]

  const issues = allIssues.map((issue) => ({
    id:              issue.id,
    title:           issue.title,
    description:     issue.description || '',
    learnMoreUrl:    issue.learn_more_url || issue.learnMoreUrl || null,
    displayValue:    issue.display_value || issue.displayValue || null,
    failingElements: issue.item_count ?? issue.itemCount ?? issue.items?.length ?? null,
    wastedMs:        issue.wasted_ms    ?? issue.wastedMs    ?? null,
    items:           issue.items || [],
  }))

  const passed = (catData.passed || []).map((p) => ({
    id:           p.id,
    title:        p.title,
    description:  p.description  || '',
    learnMoreUrl: p.learn_more_url || p.learnMoreUrl || null,
  }))

  return {
    score:        catData.score ?? 0,
    description,
    totalChecks:  issues.length + passed.length,
    passedChecks: passed.length,
    issuesFound:  issues.length,
    issues,
    passed,
  }
}

const transformResponse = (data, device) => {
  const s   = data.scores       || {}
  const by  = data.by_category  || data.byCategory || {}
  const ss  = data.screenshots  || {}

  const perf = s.performance?.score   ?? 0
  const a11y = s.accessibility?.score ?? 0
  const qual = (s['best-practices'] || s['best_practices'])?.score ?? 0
  const seo  = s.seo?.score           ?? 0

  // Normalize metrics (backend may use snake_case or camelCase)
  const rawMetrics = data.metrics || {}
  const metrics = {}
  for (const [key, val] of Object.entries(rawMetrics)) {
    metrics[key] = {
      value:        val.value,
      displayValue: val.display_value || val.displayValue || '',
      score:        val.score,
      numericUnit:  val.numeric_unit  || val.numericUnit  || '',
    }
  }

  const filmstrip = (ss.filmstrip || []).map((f) => ({
    timing: f.timing,
    data:   f.data,
  }))

  return {
    scanId:       `guest-${Date.now()}`,
    url:          data.url,
    device:       device || data.strategy,
    screenshot:   ss.full_page || ss.final || null,
    location:     null,
    scannedAt:    data.fetch_time || data.fetchTime || new Date().toISOString(),
    overallScore: Math.round((perf + a11y + qual + seo) / 4),
    scores:       { performance: perf, accessibility: a11y, quality: qual, seo },
    metrics,
    filmstrip,
    categories: {
      performance:   makeCategory(by.performance,                               CATEGORY_DESCRIPTIONS.performance),
      accessibility: makeCategory(by.accessibility,                             CATEGORY_DESCRIPTIONS.accessibility),
      quality:       makeCategory(by['best-practices'] || by['best_practices'],  CATEGORY_DESCRIPTIONS.quality),
      seo:           makeCategory(by.seo,                                        CATEGORY_DESCRIPTIONS.seo),
    },
  }
}

export { transformResponse }

export const guestScan = async ({ url, strategy }) => {
  const r = await axios.post(`${BASE}/api/scans/guest`, { url, strategy })
  const data = r.data
  if (data.status === 'pending' && data.guest_scan_id) {
    return { async: true, guestScanId: data.guest_scan_id, strategy }
  }
  return { async: false, report: transformResponse(data, strategy) }
}

export const pollGuestScan = ({ guestScanId, strategy }) =>
  axios.get(`${BASE}/api/scans/guest/${guestScanId}`).then((r) => {
    const data = r.data
    if (data.status === 'complete' && data.data) {
      return { status: 'complete', report: transformResponse(data.data, strategy) }
    }
    return { status: data.status, message: data.message }
  })

export const getScannerHealth = () =>
  axios.get(`${BASE}/api/scans/health`, { timeout: 10000 }).then((r) => r.data)
