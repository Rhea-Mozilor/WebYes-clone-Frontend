# Accessibility Checker — Claude Code Project Plan

> Reference: https://www.webyes.com/website-audit/
> This file tells Claude Code exactly what to build, in what order, and how.
> Work through phases sequentially. Complete and verify each phase before moving to the next.

---

## What This App Is

A single-page web accessibility checker tool.

1. User lands on a minimal home page
2. Enters a URL + selects device (Desktop/Mobile)
3. Clicks "Scan URL" → loading state
4. A **drawer slides up** over the home page showing the full audit report
5. Drawer has: overall score, 4 category scores, tabbed issue breakdown, passed checks list

**There is no routing. The entire app is one page. The drawer is controlled by `useState`.**

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React (Vite) | UI framework |
| Tailwind CSS | Styling |
| TanStack Query | API calls — mutation, polling, report fetch |
| Framer Motion | Drawer open/close animation |
| Lucide React | Icons |
| Axios | HTTP client |

> No React Router. No Zustand. No Redux. Keep it minimal.

---

## Exact Colors (use these, no deviations)

```
Page background:     #EEF2F7
Drawer background:   #FFFFFF
Top nav bar:         #1E2B4A  (dark navy)
Primary blue:        #2563EB
Accent orange:       #F97316
Success green:       #22C55E
Error red:           #EF4444
Warning amber:       #F59E0B
Card background:     #FFFFFF
Muted text:          #64748B
Border:              #E2E8F0
Upsell banner bg:    #FEF3E2  (peach)
```

## Typography

- Font: **Inter** (Google Fonts)
- Load in `index.css`: `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap')`
- Base font size: 16px

---

## Project Structure

```
src/
├── components/
│   ├── home/
│   │   ├── URLInputForm.jsx       ← URL text input with globe icon
│   │   └── DeviceSelector.jsx     ← Desktop/Mobile dropdown
│   ├── drawer/
│   │   ├── ResultsDrawer.jsx      ← Drawer shell + animation
│   │   ├── DrawerHeader.jsx       ← "Back to home" + X button + dark nav bar
│   │   ├── AuditSummaryCard.jsx   ← Site screenshot, URL, location, date
│   │   ├── ScoreOverview.jsx      ← Donut gauge + 4 bar scores
│   │   ├── CategoryTabs.jsx       ← 4 tabs with warning count badges
│   │   ├── CategoryDetail.jsx     ← Half-donut + description + stats card
│   │   ├── UpsellBanner.jsx       ← Peach CTA banner
│   │   ├── IssueList.jsx          ← Critical issues section
│   │   ├── PassedList.jsx         ← Passed checks section
│   │   ├── CheckRow.jsx           ← Reusable expandable row (used in both lists)
│   │   └── BottomCTA.jsx          ← "Fix what's slowing down your site" section
│   └── ui/
│       ├── DonutGauge.jsx         ← SVG circular gauge
│       ├── HalfDonutGauge.jsx     ← SVG half-circle gauge
│       ├── ProgressBar.jsx        ← Horizontal score bar
│       ├── Badge.jsx              ← Critical / Passed / Warning badge
│       └── SkeletonLoader.jsx     ← Loading skeleton blocks
├── hooks/
│   ├── useScan.js                 ← TanStack useMutation → POST /scan
│   ├── useScanStatus.js           ← TanStack useQuery polling → GET /scan/:id
│   └── useReport.js               ← TanStack useQuery → GET /report/:id
├── services/
│   └── api.js                     ← All axios calls in one place
├── lib/
│   └── mockReport.js              ← Mock JSON for local development
├── App.jsx                        ← Root, QueryClientProvider, home page layout
└── main.jsx
```

---

## API Contract

All calls go through `services/api.js`. Never call axios directly in components.

```js
// services/api.js
const BASE = import.meta.env.VITE_API_URL  // http://localhost:8000

export const startScan     = ({ url, device }) => axios.post(`${BASE}/scan`, { url, device })
export const getScanStatus = (scanId)          => axios.get(`${BASE}/scan/${scanId}`)
export const getReport     = (scanId)          => axios.get(`${BASE}/report/${scanId}`)
```

### Response shapes (agree with backend / use for mocks)

**POST /scan** → `{ scanId: "abc123" }`

**GET /scan/:id** → `{ status: "pending" | "scanning" | "complete" | "error" }`

**GET /report/:id** →
```json
{
  "scanId": "abc123",
  "url": "https://www.google.com/",
  "device": "desktop",
  "screenshot": "<base64 or url>",
  "location": { "flag": "🇮🇳", "city": "Mumbai" },
  "scannedAt": "2026-06-10T08:12:00Z",
  "overallScore": 85,
  "scores": {
    "accessibility": 59,
    "performance": 99,
    "quality": 96,
    "seo": 91
  },
  "categories": {
    "accessibility": {
      "score": 59,
      "description": "Assess your website with automated WCAG 2.2 A/AA tests.",
      "totalChecks": 25,
      "passedChecks": 24,
      "issuesFound": 1,
      "issues": [
        {
          "id": "1",
          "title": "Uses ARIA roles on incompatible elements",
          "failingElements": 1
        }
      ],
      "passed": [
        { "id": "2", "title": "`[aria-*]` attributes match their roles" }
      ]
    },
    "performance": { ... },
    "quality": { ... },
    "seo": { ... }
  }
}
```

---

## Mock Data

Create `src/lib/mockReport.js` with the full report shape above filled with realistic data.
Use this during development by having `useReport` return mock data when `VITE_USE_MOCK=true`.

---

## Phase 0 — Project Setup

**When done:** `npm run dev` runs, blank page with correct bg color, Inter font loaded.

### Steps:
1. Scaffold: `npm create vite@latest . -- --template react`
2. Install:
```bash
npm install tailwindcss @tailwindcss/vite @tanstack/react-query axios framer-motion lucide-react
```
3. Configure Tailwind in `vite.config.js` using `@tailwindcss/vite` plugin
4. Set up `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import "tailwindcss";

:root {
  font-family: 'Inter', sans-serif;
}

body {
  background-color: #EEF2F7;
  margin: 0;
}
```
5. Wrap app in `QueryClientProvider` in `main.jsx`:
```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()
// wrap <App /> with <QueryClientProvider client={queryClient}>
```
6. Create `.env`:
```
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK=true
```
7. Create all component files as empty stubs so nothing crashes

### Verify:
- `npm run dev` loads without errors
- Background is `#EEF2F7`
- Inter font is applied

---

## Phase 1 — Home Page

**When done:** Looks exactly like screenshot 1 — logo top-left, URL input + device selector centered, blue Scan URL button at bottom.

### `App.jsx` layout:
```
Full viewport height, bg #EEF2F7
├── Top-left: WebYes logo
├── Center (absolute center of viewport):
│   ├── URLInputForm (wide input with globe icon)
│   └── DeviceSelector (dropdown, labeled "Device")
└── Bottom: full-width blue "Scan URL" button
```

### `URLInputForm.jsx`:
- Rounded border input, globe icon (Lucide `Globe`) on left, placeholder "Enter your URL to scan"
- White background, border `#E2E8F0`
- Full width, height ~56px

### `DeviceSelector.jsx`:
- Dropdown (native `<select>` styled or custom), options: Desktop / Mobile
- Label "Device" floats above the border (outlined select style)
- Width ~200px, height ~56px

### Logo:
- Text "WebYes" — "Web" in `#1E2B4A` bold, "Yes" in `#2563EB` bold
- Font size ~28px, top-left positioned

### "Scan URL" Button:
- Full width, `bg-[#2563EB]`, white text, bold, ~56px height
- Pinned to bottom of viewport OR below the input group
- On click: validates URL is not empty, then calls `useScan` mutation

### State in `App.jsx`:
```js
const [url, setUrl] = useState('')
const [device, setDevice] = useState('desktop')
const [scanId, setScanId] = useState(null)
const [status, setStatus] = useState('idle') // idle | scanning | complete | error
const [isDrawerOpen, setIsDrawerOpen] = useState(false)
```

### Verify:
- Matches screenshot 1 pixel-closely
- Input accepts text, dropdown switches between Desktop/Mobile
- Button is full width at bottom

---

## Phase 2 — API Hooks + Mock Data

**When done:** Clicking "Scan URL" triggers the scan flow, drawer opens with mock data after 2s.

### `src/lib/mockReport.js`:
Fill with realistic data matching the response shape above. Include all 4 categories with issues and passed checks.

### `services/api.js`:
Write all three axios calls as described in API Contract section.

### `hooks/useScan.js`:
```js
// useMutation wrapping startScan
// onSuccess: setScanId(data.scanId), setStatus('scanning')
// onError: setStatus('error')
```

### `hooks/useScanStatus.js`:
```js
// useQuery polling GET /scan/:id every 2000ms
// enabled only when status === 'scanning'
// when data.status === 'complete': setStatus('complete'), setIsDrawerOpen(true)
// when data.status === 'error': setStatus('error')
// refetchInterval: (data) => data?.status === 'complete' ? false : 2000
```

### `hooks/useReport.js`:
```js
// useQuery GET /report/:id
// enabled only when status === 'complete'
// if VITE_USE_MOCK=true, return mockReport directly without API call
```

### Wire into `App.jsx`:
- "Scan URL" button onClick → call `useScan` mutation with `{ url, device }`
- While `status === 'scanning'`: show a loading indicator (spinner or progress text) on the button
- When `isDrawerOpen === true`: render `<ResultsDrawer />`

### Verify:
- Click "Scan URL" → button shows loading state
- After ~2s (mock) → drawer opens
- `console.log(report)` shows full mock data

---

## Phase 3 — Drawer Shell

**When done:** Drawer animates open from bottom, has dark nav bar, scrollable content area, closes on Back/X click.

### `ResultsDrawer.jsx`:
```jsx
// Framer Motion: animate from y: '100%' to y: 0
// Position: fixed, inset-0, z-50
// Structure:
// ├── DrawerHeader (dark navy bar, sticky at top)
// └── Scrollable content div (overflow-y-auto, bg white, flex-1)
//     └── {children} (all sections rendered here)
```

### Framer Motion animation:
```js
initial={{ y: '100%' }}
animate={{ y: 0 }}
exit={{ y: '100%' }}
transition={{ type: 'spring', damping: 30, stiffness: 300 }}
```
Wrap with `<AnimatePresence>` in `App.jsx` so exit animation plays on close.

### `DrawerHeader.jsx`:
- Background `#1E2B4A` (dark navy), height ~56px, sticky top-0
- Left: `← Back to home` in white, cursor pointer, onClick → `onClose()`
- Right: circular blue X button (`#2563EB` bg, white X icon)

### Verify:
- Drawer slides up smoothly from bottom
- Slides back down when Back or X clicked
- Content area is scrollable

---

## Phase 4 — Audit Summary Card

**When done:** Top card in drawer matches screenshot 2 exactly.

### `AuditSummaryCard.jsx`:
```
White card, rounded, padding 24px, margin 16px
├── Left (~40% width): site screenshot thumbnail (img tag, rounded, border)
└── Right (~60% width):
    ├── Row: "Your website audit is in!" (bold, ~24px) + "Share report ↗" link (blue, right)
    ├── Row: URL text + desktop/mobile icon (Lucide Monitor or Smartphone)
    ├── Row: flag emoji + city + calendar icon + formatted date/time
    └── Grey upsell banner:
        bell icon + "You're seeing results for just one page..." text + "sign up for free. ↗" blue link
```

### Notes:
- Date format: "10 June 2026 08:12 AM (UTC)"
- Screenshot: use `<img src={report.screenshot} />` — show a grey placeholder if null
- Share report: onClick → opens `ShareModal` (build as empty stub for now)

### Verify:
- Card renders with mock data
- Layout matches screenshot 2 top section

---

## Phase 5 — Score Overview

**When done:** Overall donut gauge + 4 horizontal bar scores match screenshot 2 bottom.

### `ScoreOverview.jsx`:
```
Two cards side by side (flex row, gap 16px)

Left card:
├── Title: "Webpage health score" + ⓘ icon
├── DonutGauge (SVG, large, shows overall %)
└── Tagline text: "You're on the right track! Apply recommended fixes..."

Right card:
├── Accessibility row: icon + "Accessibility" + "59%" + ProgressBar (orange for <70)
├── Performance row: icon + "Performance" + "99%" + ProgressBar (blue for >=70)
├── Quality row: icon + "Quality" + "96%" + ProgressBar
└── SEO row: icon + "SEO" + "91%" + ProgressBar
```

### `DonutGauge.jsx` (SVG):
```jsx
// Two concentric circles — background track + colored fill
// strokeDasharray / strokeDashoffset to show percentage
// Score color logic:
//   >= 90: #22C55E (green)
//   70-89: #2563EB (blue)
//   < 70:  #F97316 (orange)
// Score % text centered inside
```

### `ProgressBar.jsx`:
```jsx
// Thin horizontal bar, ~8px height, rounded
// Background track: #E2E8F0
// Fill color: same score color logic as DonutGauge
// Width: (score / 100) * 100%
// Animate width with CSS transition on mount
```

### Verify:
- Scores from mock data render correctly
- Colors match score ranges
- Layout matches screenshot 2

---

## Phase 6 — Category Tabs

**When done:** 4 tabs render, active tab has blue underline, warning count shows correctly.

### `CategoryTabs.jsx`:
```jsx
// State: activeTab lives in App.jsx, passed as prop
// 4 tabs: accessibility | performance | quality | seo
// Each tab:
//   - Icon (Lucide: Accessibility, Gauge, Shield, Search)
//   - Label (capitalized)
//   - Warning badge: triangle icon + issue count (e.g. "⚠ 1")
//     only shown if issuesFound > 0
// Active tab: blue bottom border (2px solid #2563EB), bold text
// Inactive tab: grey text, no border
// Tab bar has a bottom border separating it from content below
```

### In `App.jsx`:
```js
const [activeTab, setActiveTab] = useState('accessibility')
```

Pass `activeTab` and `setActiveTab` down to `CategoryTabs` and `CategoryDetail`.

### Verify:
- All 4 tabs render
- Clicking a tab sets it as active
- Warning counts match mock data

---

## Phase 7 — Category Detail Section

**When done:** Below the tabs, the active category's detail renders — half-donut, description, stats, upsell banner.

### `CategoryDetail.jsx`:
Receives `category` object from `report.categories[activeTab]`

```
Row layout (flex):
├── Left: HalfDonutGauge showing category score %
└── Center-right:
    ├── Category name (bold, ~20px)
    ├── Description text (muted, ~14px)
    └── Stats card (right-aligned):
        ├── "Total checks" → number
        ├── ✅ "Passed checks" (green) → number
        └── 🔴 "Issues found" (red) → number
```

### `HalfDonutGauge.jsx` (SVG):
- Half circle (180°), same color logic as DonutGauge
- Score % text below center of arc

### `UpsellBanner.jsx`:
- Background `#FEF3E2` (peach), rounded, padding 24px, centered text
- Heading in orange/amber, bold
- Subtext in muted grey
- Blue "Ensure full compliance ↗" button centered below

### Verify:
- Switching tabs updates the half-donut score and stats
- Upsell banner renders below stats

---

## Phase 8 — Issues & Passed Checks Lists

**When done:** Critical issues and passed checks render as expandable rows matching screenshots 4 & 5.

### `CheckRow.jsx` (reusable):
```
Props: type ('issue' | 'passed'), index, title, failingElements (for issues), detail (expanded content)

Row layout:
├── Index number (muted, left)
├── Icon: orange warning triangle (issue) OR green checkmark circle (passed)
├── Title text
├── [issues only] Red badge: "X element" pill
└── Chevron down icon (right), rotates 180° when expanded

Expanded state (onClick toggles):
└── Detail content area (bg light grey, padding, text)
```

### `IssueList.jsx`:
```
Section heading row: "#  Critical Issues" (left) + "Failing elements" (right, muted)
Bordered container
Map over category.issues → <CheckRow type="issue" />
```

### `PassedList.jsx`:
```
Section heading: "#  Passed checks"
Bordered container
Map over category.passed → <CheckRow type="passed" />
```

Both lists re-render when `activeTab` changes.

### Verify:
- Issues and passed checks render for each tab
- Clicking a row expands/collapses it
- Chevron animates on expand

---

## Phase 9 — Bottom CTA

**When done:** Bottom of drawer has the upgrade CTA section matching screenshot 5 bottom.

### `BottomCTA.jsx`:
```
Centered, padding 48px vertical
├── Heading: "Fix what's slowing down your site with a complete audit" (bold, ~22px)
├── Feature pills row (flex, gap 12px, centered):
│   ├── ✅ Full site scan
│   ├── ✅ AI-powered solutions
│   └── ✅ Built for teams
├── Blue button: "Get a free audit ↗" (~200px wide, rounded)
└── Fine print: "✓ 7-day free trial  ✓ Cancel anytime" (muted, small)
```

### Verify:
- Renders at bottom of drawer scroll
- Button and pills match screenshot 5

---

## Phase 10 — Loading & Error States

**When done:** App handles all states gracefully — no broken UI during loading or on error.

### Loading state (while scanning):
- "Scan URL" button shows spinner + "Scanning..." text
- Button is disabled
- Do NOT open drawer yet

### Report loading state (drawer open, report fetching):
- Show `SkeletonLoader` blocks in place of AuditSummaryCard, ScoreOverview
- Use `isLoading` from `useReport` hook

### `SkeletonLoader.jsx`:
```jsx
// Animated grey pulse blocks
// Props: width, height, borderRadius
// CSS: animate-pulse, bg-gray-200
```

### Error state:
- If `status === 'error'`: show red error message below input "Something went wrong. Please try again."
- Reset status to 'idle' when user edits the URL input

### Empty/invalid URL:
- If URL is empty on submit: show inline validation "Please enter a URL"
- Basic URL format check before firing mutation

### Verify:
- All loading states show skeletons
- Errors show clear messages
- Empty URL is caught before API call

---

## Phase 11 — Polish & Responsive

**When done:** App looks great on mobile and desktop, animations are smooth.

### Mobile (< 640px):
- Home page: input and device selector stack vertically
- Drawer: full screen (already is, since it's fixed inset-0)
- AuditSummaryCard: screenshot stacks above text (flex-col)
- ScoreOverview: left/right cards stack vertically
- CategoryTabs: horizontal scroll if needed
- CategoryDetail: stack vertically

### Animations:
- Drawer: spring animation (already set in Phase 3)
- CheckRow expand: `AnimatePresence` + height animation for smooth expand/collapse
- ProgressBar: CSS `transition: width 1s ease` on mount
- Tab switch: subtle fade on content change

### Final checks:
- [ ] Test on 375px (iPhone SE), 768px (iPad), 1280px (desktop)
- [ ] All mock data renders without errors
- [ ] Drawer open/close is smooth
- [ ] No console errors or warnings
- [ ] Fonts load correctly
- [ ] Colors exactly match the reference

---

## Complete Data Flow

```
User types URL + selects device
        ↓
"Scan URL" clicked
        ↓
URL validation (empty / invalid format check)
        ↓
useScan mutation → POST /api/scan { url, device }
        ↓
response: { scanId }
setScanId(scanId), setStatus('scanning')
button shows "Scanning..." spinner
        ↓
useScanStatus polls GET /api/scan/:id every 2s
(enabled only when status === 'scanning')
        ↓
response: { status: 'complete' }
setStatus('complete'), setIsDrawerOpen(true)
        ↓
ResultsDrawer renders, animates up
useReport fires GET /api/report/:id
(or returns mockReport if VITE_USE_MOCK=true)
        ↓
Report data available in TanStack cache
All drawer components read from report object
        ↓
User scrolls through report
Tab clicks update activeTab state
CheckRow clicks expand/collapse
        ↓
User clicks "Back to home" or X
setIsDrawerOpen(false)
Drawer animates back down
status resets to 'idle'
```

---

## Conventions

- All components: PascalCase (`CheckRow.jsx`)
- All hooks: camelCase with `use` prefix (`useScan.js`)
- Never call axios directly in components — use `services/api.js`
- Never store API response data in useState — TanStack Query owns it
- All colors from the exact hex values listed above — no Tailwind default colors
- Tailwind for layout/spacing, inline style or CSS vars for exact brand colors
- Every component gets only the props it needs — no prop drilling beyond 2 levels
