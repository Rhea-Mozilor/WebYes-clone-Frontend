import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

/* ─── Design tokens ─────────────────────────────────────────────────────── */
const F      = 'Inter,Arial,sans-serif'
const BG     = '#E8EBF5'        // page background (category pages)
const BLUE   = '#2563EB'        // brand blue
const DARK   = '#1E2B4A'        // primary text
const MUTED  = '#64748B'        // secondary text
const BORDER = '#E2E8F0'        // card border / divider
const RED    = '#EF4444'        // vital metric values
const GREEN  = '#22C55E'        // CLS=0 good value

/* ─── Vital formatting ──────────────────────────────────────────────────── */
function fmtVital(key, val) {
  if (val == null) return '–'
  if (key === 'tbt_ms')  return Math.round(val) + 'ms'
  if (key === 'cls')     return val === 0 ? '0' : parseFloat(val.toFixed(3)).toString()
  return (val / 1000).toFixed(1) + 's'   // fcp_ms, lcp_ms, speed_index_ms
}

function fmtDate(iso) {
  if (!iso) return '–'
  try {
    const d     = new Date(iso)
    const day   = String(d.getUTCDate()).padStart(2, '0')
    const month = String(d.getUTCMonth() + 1).padStart(2, '0')
    const year  = d.getUTCFullYear()
    const hh24  = d.getUTCHours()
    const hh12  = hh24 % 12 || 12
    const mm    = String(d.getUTCMinutes()).padStart(2, '0')
    const ampm  = hh24 < 12 ? 'AM' : 'PM'
    return `${day}/${month}/${year}, ${hh12}:${mm} ${ampm} UTC`
  } catch { return iso }
}

function esc(s) {
  if (!s) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/* ─── Half-donut SVG (always blue, score text below arc) ───────────────── */
function halfDonut(score, size = 160) {
  const r  = 52
  const cx = 70
  const cy = 68
  const arc  = Math.PI * r
  const dash = ((score ?? 0) / 100) * arc
  const gap  = arc + 20
  const h    = Math.round(size * 0.7)
  return `
<svg viewBox="0 0 140 100" width="${size}" height="${h}" style="display:block;flex-shrink:0;">
  <path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}"
    stroke="#DFE6F0" stroke-width="13" fill="none" stroke-linecap="round"/>
  <path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}"
    stroke="${BLUE}" stroke-width="13" fill="none" stroke-linecap="round"
    stroke-dasharray="${dash.toFixed(1)} ${gap.toFixed(1)}"/>
  <text x="70" y="86" text-anchor="middle"
    font-family="${F}" font-size="20" font-weight="800" fill="${DARK}">
    ${score ?? 0}%
  </text>
</svg>`
}

/* ─── Full circle donut (cover page) ────────────────────────────────────── */
function fullDonut(score, size = 190) {
  const r    = 66
  const cx   = size / 2
  const cy   = size / 2
  const circ = 2 * Math.PI * r
  const dash = ((score ?? 0) / 100) * circ
  return `
<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" style="display:block;">
  <circle cx="${cx}" cy="${cy}" r="${r}"
    stroke="#DFE6F0" stroke-width="16" fill="none"/>
  <circle cx="${cx}" cy="${cy}" r="${r}"
    stroke="${BLUE}" stroke-width="16" fill="none"
    stroke-linecap="round"
    stroke-dasharray="${dash.toFixed(1)} ${circ.toFixed(1)}"
    transform="rotate(-90 ${cx} ${cy})"/>
  <text x="${cx}" y="${cy + 17}" text-anchor="middle"
    font-family="${F}" font-size="48" font-weight="900" fill="${DARK}">
    ${score ?? 0}%
  </text>
</svg>`
}

/* ─── Page header strip (category pages) ────────────────────────────────── */
function pageHeader(title) {
  return `
<div style="padding:14px 32px;background:white;display:flex;align-items:center;
  justify-content:space-between;border-bottom:1px solid ${BORDER};flex-shrink:0;">
  <span style="font-family:${F};font-size:14px;font-weight:600;color:${DARK};">${title}</span>
  <span style="font-family:${F};font-size:16px;font-weight:800;color:${BLUE};">WebYes</span>
</div>`
}

/* ─── Page number (bottom-right) ────────────────────────────────────────── */
function pgNum(n) {
  return `
<div style="position:absolute;bottom:20px;right:28px;
  font-family:${F};font-size:13px;font-weight:500;color:${MUTED};">${n}</div>`
}

/* ─── Issue count boxes (Total issues / Critical issues) ─────────────────── */
function issueCountBoxes(total, critical) {
  const box = (label, val) => `
<div style="background:#F8FAFC;border:1px solid ${BORDER};border-radius:10px;
  padding:14px 32px;text-align:center;min-width:130px;">
  <div style="font-family:${F};font-size:12px;font-weight:500;color:${DARK};margin-bottom:6px;">${label}</div>
  <div style="font-family:${F};font-size:26px;font-weight:800;color:${DARK};">${val}</div>
</div>`
  return `
<div style="display:flex;align-items:center;gap:14px;">
  ${box('Total issues', total)}
  ${box('Critical issues', critical)}
</div>`
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE 1 — COVER
   Blue header (logo + text score + tagline + URL/device)
   White body (total issues card, 4 score boxes, upsell, audit details)
   ═══════════════════════════════════════════════════════════════════════════ */
function coverHTML(report) {
  const {
    url = '', device = 'desktop', scanned_at,
    scores = {}, total_issues = 0, critical_issues = 0, issues = {},
  } = report

  const vals    = [scores.performance, scores.accessibility, scores.quality, scores.seo].filter(s => s != null)
  const overall = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0

  const cats = [
    { key: 'performance',   label: 'Performance'   },
    { key: 'accessibility', label: 'Accessibility' },
    { key: 'seo',           label: 'SEO'           },
    { key: 'quality',       label: 'Quality'        },
  ]

  const devLabel = device ? device.charAt(0).toUpperCase() + device.slice(1) : 'Desktop'
  const urlShort = url.length > 52 ? url.slice(0, 49) + '…' : url

  const SVG_STYLE = 'display:block;flex-shrink:0;margin-top:2px;'
  const SVG_STROKE = 'rgba(255,255,255,0.85)'

  const globeIcon = `
<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
  stroke="${SVG_STROKE}" stroke-width="2" style="${SVG_STYLE}">
  <circle cx="12" cy="12" r="10"/>
  <line x1="2" y1="12" x2="22" y2="12"/>
  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
</svg>`

  const mobileIcon = `
<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
  stroke="${SVG_STROKE}" stroke-width="2" style="${SVG_STYLE}">
  <rect x="5" y="2" width="14" height="20" rx="2"/>
  <line x1="12" y1="18" x2="12.01" y2="18" stroke-linecap="round" stroke-width="3"/>
</svg>`

  const desktopIcon = `
<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
  stroke="${SVG_STROKE}" stroke-width="2" style="${SVG_STYLE}">
  <rect x="2" y="3" width="20" height="14" rx="2"/>
  <line x1="8" y1="21" x2="16" y2="21"/>
  <line x1="12" y1="17" x2="12" y2="21"/>
</svg>`

  const deviceIcon = device === 'mobile' ? mobileIcon : desktopIcon

  const catLabels = cats.map(c =>
    `<div style="flex:1;text-align:center;font-family:${F};font-size:13px;font-weight:600;
      color:${DARK};padding:0 4px;">${c.label}</div>`
  ).join('')

  const catBoxes = cats.map(c => {
    const s          = scores[c.key] ?? 0
    const issueCount = issues[c.key]?.total ?? 0
    return `
<div style="flex:1;background:#DBEAFE;border-radius:12px;padding:22px 10px;
  text-align:center;min-width:0;">
  <div style="font-family:${F};font-size:34px;font-weight:900;color:${DARK};line-height:1;">${s}%</div>
  <div style="font-family:${F};font-size:13px;font-weight:600;color:${DARK};margin-top:12px;">
    Issues : ${issueCount}
  </div>
</div>`
  }).join('')

  return `
<div style="width:794px;height:1123px;background:#FFFFFF;font-family:${F};
  box-sizing:border-box;overflow:hidden;display:flex;flex-direction:column;">

  <!-- ── Blue header ────────────────────────────────────────────── -->
  <div style="background:${BLUE};padding:28px 40px 36px;flex-shrink:0;">

    <div style="font-family:${F};font-size:22px;font-weight:800;color:#FFFFFF;margin-bottom:22px;">
      WebYes
    </div>

    <div style="text-align:center;">
      <div style="font-family:${F};font-size:26px;font-weight:700;color:#FFFFFF;margin-bottom:10px;">
        Webpage health score
      </div>
      <div style="font-family:${F};font-size:80px;font-weight:900;color:#FFFFFF;line-height:1;">
        ${overall}%
      </div>
      <div style="font-family:${F};font-size:14px;color:rgba(255,255,255,0.9);
        margin-top:28px;margin-bottom:18px;line-height:1.65;">
        You're on the right track! Apply recommended fixes to<br>fine-tune your webpage.
      </div>

      <!-- URL + device row -->
      <div style="display:inline-flex;align-items:center;gap:18px;
        font-family:${F};font-size:13px;color:rgba(255,255,255,0.85);">
        <span style="display:flex;align-items:center;gap:7px;">
          ${globeIcon}
          <span>${esc(urlShort)}</span>
        </span>
        <span style="color:rgba(255,255,255,0.4);">|</span>
        <span style="display:flex;align-items:center;gap:7px;">
          ${deviceIcon}
          <span>${esc(devLabel)}</span>
        </span>
      </div>
    </div>
  </div>

  <!-- ── White body ─────────────────────────────────────────────── -->
  <div style="background:#FFFFFF;flex:1;padding:28px 40px 24px;
    display:flex;flex-direction:column;gap:20px;overflow:hidden;">

    <!-- Total issues card — centered -->
    <div style="display:flex;justify-content:center;">
      <div style="background:#DBEAFE;border-radius:16px;padding:22px 70px;text-align:center;">
        <div style="font-family:${F};font-size:15px;font-weight:600;color:${DARK};margin-bottom:6px;">
          Total issues
        </div>
        <div style="font-family:${F};font-size:56px;font-weight:900;color:${DARK};line-height:1.1;">
          ${total_issues}
        </div>
        <div style="font-family:${F};font-size:14px;color:${DARK};font-weight:500;margin-top:12px;margin-bottom:5px;">
          Critical issues
        </div>
        <div style="font-family:${F};font-size:30px;font-weight:800;color:${DARK};">
          ${critical_issues}
        </div>
      </div>
    </div>

    <!-- Category score boxes: labels row then boxes row -->
    <div>
      <div style="display:flex;gap:10px;margin-bottom:8px;">
        ${catLabels}
      </div>
      <div style="display:flex;gap:10px;">
        ${catBoxes}
      </div>
    </div>

    <!-- Upsell -->
    <div style="font-family:${F};font-size:12px;color:${MUTED};">
      Scan your entire website and monitor the result and try our advanced scanning
      <span style="color:${BLUE};font-weight:600;"> for free</span>
    </div>

    <!-- Auditing website details (plain, no border) -->
    <div>
      <div style="font-family:${F};font-size:14px;font-weight:700;color:${DARK};margin-bottom:10px;">
        Auditing website details:
      </div>
      <div style="font-family:${F};font-size:13px;color:${MUTED};margin-bottom:5px;">
        Website Link: <span style="color:${DARK};">${esc(url)}</span>
      </div>
      <div style="font-family:${F};font-size:13px;color:${MUTED};">
        Scanned date: <span style="color:${DARK};">${fmtDate(scanned_at)}</span>
      </div>
    </div>

  </div>
</div>`
}

/* ═══════════════════════════════════════════════════════════════════════════
   SHARED — simple category page (Accessibility / Quality / SEO)
   ═══════════════════════════════════════════════════════════════════════════ */
function simpleCatHTML(report, name, key, description, pageNumber) {
  const cat      = report.issues?.[key] || {}
  const score    = cat.score    ?? 0
  const total    = cat.total    ?? 0
  const critical = cat.critical ?? 0
  const passed   = cat.passed   ?? 0
  const items    = cat.items    || []

  const issueRows = items.map(item => `
<div style="padding:10px 0;border-bottom:1px solid ${BORDER};">
  <div style="font-family:${F};font-size:13px;font-weight:700;color:${DARK};margin-bottom:4px;">
    ${esc(item.title || '')}
  </div>
  ${item.description
    ? `<div style="font-family:${F};font-size:11px;color:${MUTED};line-height:1.65;margin-bottom:3px;">
         ${esc(item.description)}
       </div>`
    : ''}
  ${item.learnMoreUrl
    ? `<div style="font-family:${F};font-size:11px;color:${BLUE};">${esc(item.learnMoreUrl)}</div>`
    : ''}
</div>`).join('')

  return `
<div style="width:794px;height:1123px;background:${BG};font-family:${F};
  box-sizing:border-box;overflow:hidden;display:flex;flex-direction:column;position:relative;">

  ${pageHeader(name)}

  <div style="padding:20px 32px;display:flex;flex-direction:column;gap:16px;">

    <!-- Description card -->
    <div style="background:white;border-radius:12px;padding:24px 28px;
      box-shadow:0 1px 4px rgba(0,0,0,0.06);">
      <div style="font-family:${F};font-size:26px;font-weight:800;color:${DARK};margin-bottom:10px;">
        ${name}
      </div>
      <div style="font-family:${F};font-size:13px;color:${MUTED};line-height:1.75;">
        ${description}
      </div>
    </div>

    <!-- Score + issue counts card -->
    <div style="background:white;border-radius:12px;padding:24px 28px;
      box-shadow:0 1px 4px rgba(0,0,0,0.06);">
      <div style="display:flex;align-items:center;gap:40px;flex-wrap:wrap;">
        ${halfDonut(score, 160)}
        ${issueCountBoxes(total, critical)}
      </div>
    </div>

    <!-- Issues list card -->
    <div style="background:white;border-radius:12px;padding:20px 24px;
      box-shadow:0 1px 4px rgba(0,0,0,0.06);">
      <div style="font-family:${F};font-size:20px;font-weight:800;color:${DARK};margin-bottom:4px;">
        ${name} Issues
      </div>
      <div style="font-family:${F};font-size:12px;color:${MUTED};margin-bottom:14px;">Issues</div>
      ${issueRows || `<div style="font-family:${F};font-size:12px;color:${MUTED};padding:8px 0;">No issues found</div>`}
    </div>

    <!-- Passed checks -->
    <div style="padding:2px 4px;">
      <span style="font-family:${F};font-size:14px;font-weight:700;color:${DARK};">
        Passed checks : ${passed}
      </span>
    </div>

  </div>

  ${pgNum(pageNumber)}
</div>`
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE 3 — PERFORMANCE (description + score + vitals)
   ═══════════════════════════════════════════════════════════════════════════ */
function perfPage1HTML(report) {
  const cat      = report.issues?.performance || {}
  const score    = cat.score    ?? 0
  const total    = cat.total    ?? 0
  const critical = cat.critical ?? 0
  const vitals   = report.vitals || {}

  const vDefs = [
    { k: 'fcp_ms',         a: 'FCP', l: 'First Contentful Paint'   },
    { k: 'lcp_ms',         a: 'LCP', l: 'Largest Contentful Paint' },
    { k: 'tbt_ms',         a: 'TBT', l: 'Total Blocking Time'      },
    { k: 'cls',            a: 'CLS', l: 'Cumulative Layout Shift'   },
    { k: 'speed_index_ms', a: 'SI',  l: 'Speed Index'              },
  ]

  const vBox = ({ k, a, l }) => {
    const val   = fmtVital(k, vitals[k])
    const color = (k === 'cls' && (vitals[k] ?? 1) < 0.1) ? GREEN : RED
    return `
<div style="flex:1;background:white;border-radius:10px;padding:16px 14px;min-width:0;">
  <div style="font-family:${F};font-size:18px;font-weight:800;color:${DARK};margin-bottom:2px;">${a}</div>
  <div style="font-family:${F};font-size:10px;color:${MUTED};margin-bottom:10px;">${l}</div>
  <div style="font-family:${F};font-size:17px;font-weight:700;color:${color};">${val}</div>
</div>`
  }

  return `
<div style="width:794px;height:1123px;background:${BG};font-family:${F};
  box-sizing:border-box;overflow:hidden;display:flex;flex-direction:column;position:relative;">

  ${pageHeader('Performance')}

  <div style="padding:20px 32px;display:flex;flex-direction:column;gap:16px;">

    <!-- Description card -->
    <div style="background:white;border-radius:12px;padding:24px 28px;
      box-shadow:0 1px 4px rgba(0,0,0,0.06);">
      <div style="font-family:${F};font-size:26px;font-weight:800;color:${DARK};margin-bottom:10px;">
        Performance
      </div>
      <div style="font-family:${F};font-size:13px;color:${MUTED};line-height:1.75;">
        This section assesses how efficiently your website loads and responds to user
        interactions. Webyes evaluates key performance indicators such as page load speed,
        time to first byte (TTFB), largest contentful paint (LCP), first input delay (FID),
        and overall page weight. A high-performing website ensures faster access, better user
        engagement, improved SEO rankings, and reduced bounce rates.
      </div>
    </div>

    <!-- Score + issue counts card -->
    <div style="background:white;border-radius:12px;padding:24px 28px;
      box-shadow:0 1px 4px rgba(0,0,0,0.06);">
      <div style="display:flex;align-items:center;gap:40px;flex-wrap:wrap;">
        ${halfDonut(score, 160)}
        ${issueCountBoxes(total, critical)}
      </div>
    </div>

    <!-- Core Web Vitals card -->
    <div style="background:white;border-radius:12px;padding:20px 22px;
      box-shadow:0 1px 4px rgba(0,0,0,0.06);">
      <div style="display:flex;gap:12px;margin-bottom:12px;">
        ${vDefs.slice(0, 3).map(vBox).join('')}
      </div>
      <div style="display:flex;gap:12px;">
        ${vDefs.slice(3).map(vBox).join('')}
        <div style="flex:1;"></div>
      </div>
    </div>

  </div>

  ${pgNum(3)}
</div>`
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE 4 — PERFORMANCE (filmstrip + issues list)
   ═══════════════════════════════════════════════════════════════════════════ */
function perfPage2HTML(report) {
  const cat      = report.issues?.performance || {}
  const items    = cat.items  || []
  const passed   = cat.passed ?? 0
  const frames   = (report.filmstrip || []).slice(0, 4)

  const filmstripHTML = frames.length > 0
    ? `
<div style="background:white;border-radius:12px;padding:16px 20px;
  box-shadow:0 1px 4px rgba(0,0,0,0.06);">
  <div style="display:flex;gap:10px;align-items:flex-start;">
    ${frames.map(f => {
      const src = f.data
        ? (f.data.startsWith('data:') ? f.data : 'data:image/jpeg;base64,' + f.data)
        : ''
      const t = f.timing != null ? (f.timing / 1000).toFixed(2) + 's' : '–'
      return `
<div style="flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:5px;">
  ${src
    ? `<img src="${src}" style="width:100%;display:block;border-radius:4px;border:1px solid ${BORDER};" />`
    : `<div style="width:100%;aspect-ratio:3/4;background:#F1F5F9;border-radius:4px;border:1px solid ${BORDER};"></div>`
  }
  <div style="font-family:${F};font-size:11px;color:${MUTED};font-weight:500;">${t}</div>
</div>`
    }).join('')}
  </div>
</div>`
    : ''

  const issueRows = items.map(item => `
<div style="padding:10px 0;border-bottom:1px solid ${BORDER};">
  <div style="font-family:${F};font-size:13px;font-weight:700;color:${DARK};margin-bottom:4px;">
    ${esc(item.title || '')}
  </div>
  ${item.description
    ? `<div style="font-family:${F};font-size:11px;color:${MUTED};line-height:1.65;margin-bottom:3px;">
         ${esc(item.description)}
       </div>`
    : ''}
  ${item.learnMoreUrl
    ? `<div style="font-family:${F};font-size:11px;color:${BLUE};">${esc(item.learnMoreUrl)}</div>`
    : ''}
</div>`).join('')

  return `
<div style="width:794px;height:1123px;background:${BG};font-family:${F};
  box-sizing:border-box;overflow:hidden;display:flex;flex-direction:column;position:relative;">

  ${pageHeader('Performance')}

  <div style="padding:20px 32px;display:flex;flex-direction:column;gap:16px;">

    ${filmstripHTML}

    <!-- Issues list card -->
    <div style="background:white;border-radius:12px;padding:20px 24px;
      box-shadow:0 1px 4px rgba(0,0,0,0.06);">
      <div style="font-family:${F};font-size:20px;font-weight:800;color:${DARK};margin-bottom:4px;">
        Performance Issues
      </div>
      <div style="font-family:${F};font-size:12px;color:${MUTED};margin-bottom:14px;">Issues</div>
      ${issueRows || `<div style="font-family:${F};font-size:12px;color:${MUTED};padding:8px 0;">No issues found</div>`}
    </div>

    <!-- Passed checks -->
    <div style="padding:2px 4px;">
      <span style="font-family:${F};font-size:14px;font-weight:700;color:${DARK};">
        Passed checks : ${passed}
      </span>
    </div>

  </div>

  ${pgNum(4)}
</div>`
}

/* ═══════════════════════════════════════════════════════════════════════════
   RENDERER + PDF EXPORT
   ═══════════════════════════════════════════════════════════════════════════ */
async function renderPage(htmlString) {
  const wrap = document.createElement('div')
  wrap.style.cssText = 'position:absolute;left:-9999px;top:0;z-index:-1;'
  wrap.innerHTML = htmlString
  document.body.appendChild(wrap)
  const el = wrap.firstElementChild
  let canvas
  try {
    canvas = await html2canvas(el, {
      scale:       2,
      useCORS:     true,
      allowTaint:  true,
      logging:     false,
      width:       794,
      height:      1123,
      windowWidth: 1400,
    })
  } finally {
    document.body.removeChild(wrap)
  }
  return canvas
}

export async function generatePDFReport(report) {
  if (!report) return

  const DESCS = {
    accessibility:
      'This section evaluates how well your website follows recognized accessibility standards ' +
      'like the Web Content Accessibility Guidelines (WCAG). Ensuring accessibility means ' +
      'all users—including those with visual, auditory, cognitive, or motor impairments—can ' +
      'navigate and use your site effectively.',
    quality:
      "This section highlights technical and content factors that affect your site's credibility. " +
      'WebYes audits for broken links, duplicate content, spelling errors, inconsistent metadata, ' +
      'and poor HTML structure—all of which can impact user trust and search visibility.',
    seo:
      "This section identifies technical and content-related issues that affect your site's " +
      'visibility in search engines. WebYes checks for missing or poorly structured metadata, ' +
      'broken internal links, improper heading use, and thin content. Fixing these issues ' +
      'improves crawlability, indexation, and search rankings.',
  }

  const pageFns = [
    r => coverHTML(r),
    r => simpleCatHTML(r, 'Accessibility', 'accessibility', DESCS.accessibility, 2),
    r => perfPage1HTML(r),
    r => perfPage2HTML(r),
    r => simpleCatHTML(r, 'Quality', 'quality', DESCS.quality, 5),
    r => simpleCatHTML(r, 'SEO', 'seo', DESCS.seo, 6),
  ]

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })

  for (let i = 0; i < pageFns.length; i++) {
    const canvas  = await renderPage(pageFns[i](report))
    const imgData = canvas.toDataURL('image/jpeg', 0.93)
    if (i > 0) doc.addPage()
    doc.addImage(imgData, 'JPEG', 0, 0, 210, 297)
  }

  doc.save('webyes-audit-report.pdf')
}

/* ─── Adapter: frontend app report → PDF generator shape ───────────────── */
function adaptReport(report) {
  const cats = report.categories || {}
  const m    = report.metrics    || {}

  const total_issues    = Object.values(cats).reduce((s, c) => s + (c.issuesFound || 0), 0)
  const critical_issues = total_issues

  const vitals = {
    fcp_ms:         m['first-contentful-paint']?.value   ?? null,
    lcp_ms:         m['largest-contentful-paint']?.value ?? null,
    tbt_ms:         m['total-blocking-time']?.value      ?? null,
    cls:            m['cumulative-layout-shift']?.value  ?? null,
    speed_index_ms: m['speed-index']?.value              ?? null,
  }

  const issues = {}
  for (const [key, cat] of Object.entries(cats)) {
    issues[key] = {
      score:    cat.score        ?? 0,
      total:    cat.issuesFound  ?? 0,
      critical: cat.issuesFound  ?? 0,
      passed:   cat.passedChecks ?? 0,
      items: (cat.issues || []).map(i => ({
        title:        i.title        || '',
        description:  i.displayValue || '',
        learnMoreUrl: '',
      })),
    }
  }

  return {
    url:             report.url,
    device:          report.device,
    scanned_at:      report.scannedAt,
    scores:          report.scores   || {},
    total_issues,
    critical_issues,
    issues,
    vitals,
    filmstrip:       report.filmstrip || [],
  }
}

export async function generatePDFFromReport(appReport) {
  return generatePDFReport(adaptReport(appReport))
}
