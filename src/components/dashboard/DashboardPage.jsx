import { useState, useEffect, useRef } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Globe, ChevronDown, Settings, Info, ArrowRight,
  Shield, Gauge, CheckCircle, Search, LayoutGrid,
  Accessibility, BadgeCheck, TrendingUp, Zap,
  Share2, Wifi, MapPin, HelpCircle, ArrowUpCircle,
} from 'lucide-react'
import { guestScan, pollGuestScan } from '@/services/api'
import mockReport from '@/lib/mockReport'
import ResultsDrawer from '@/components/drawer/ResultsDrawer'
import AuditSummaryCard from '@/components/drawer/AuditSummaryCard'
import ScoreOverview from '@/components/drawer/ScoreOverview'
import CategoryTabs from '@/components/drawer/CategoryTabs'
import CategoryDetail from '@/components/drawer/CategoryDetail'
import IssueList from '@/components/drawer/IssueList'
import PassedList from '@/components/drawer/PassedList'
import CoreWebVitals from '@/components/drawer/CoreWebVitals'
import UpsellBanner from '@/components/drawer/UpsellBanner'
import BottomCTA from '@/components/drawer/BottomCTA'
import SkeletonLoader from '@/components/ui/SkeletonLoader'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const mockScanFn = () => new Promise(resolve => setTimeout(() => resolve(mockReport), 1500))

function scoreColor(score) {
  if (score >= 90) return '#22C55E'
  if (score >= 70) return '#F97316'
  return '#EF4444'
}

const SCORE_KEYS = [
  { key: 'accessibility', label: 'Accessibility', Icon: Accessibility },
  { key: 'performance',   label: 'Performance',   Icon: Gauge },
  { key: 'quality',       label: 'Quality',       Icon: BadgeCheck },
  { key: 'seo',           label: 'SEO',           Icon: TrendingUp },
]

const ISSUE_TABS = ['All', 'Accessibility', 'Performance', 'Quality', 'SEO']

const SIDEBAR_ITEMS = [
  { Icon: LayoutGrid,    label: 'Dashboard' },
  { Icon: Accessibility, label: 'Accessibility' },
  { Icon: Gauge,         label: 'Performance' },
  { Icon: BadgeCheck,    label: 'Quality' },
  { Icon: TrendingUp,    label: 'SEO' },
  { Icon: ArrowUpCircle, label: 'Uptime' },
]

// Donut chart SVG for total issues
function DonutChart({ categories, total }) {
  const size = 160
  const cx = size / 2
  const cy = size / 2
  const r = 55
  const strokeW = 22
  const circumference = 2 * Math.PI * r

  const COLORS = {
    performance:   '#93C5FD',
    quality:       '#1D4ED8',
    accessibility: '#1E2B4A',
    seo:           '#3B82F6',
  }

  const totals = SCORE_KEYS.map(({ key }) => categories[key]?.issuesFound ?? 0)
  const sum = totals.reduce((a, b) => a + b, 0) || 1

  let offset = 0
  const segments = SCORE_KEYS.map(({ key }, i) => {
    const pct = totals[i] / sum
    const dash = pct * circumference
    const gap  = circumference - dash
    const seg  = { key, color: COLORS[key], dash, gap, offset }
    offset += dash
    return seg
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E2E8F0" strokeWidth={strokeW} />
      {segments.map(({ key, color, dash, gap, offset: off }) => (
        <circle
          key={key}
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeDasharray={`${dash} ${gap}`}
          strokeDashoffset={-off + circumference / 4}
          strokeLinecap="butt"
        />
      ))}
      <text x={cx} y={cy - 7} textAnchor="middle" fontSize="11" fill="#64748B" fontFamily="Inter, sans-serif">Total Issue</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize="22" fontWeight="800" fill="#1E2B4A" fontFamily="Inter, sans-serif">{total}</text>
    </svg>
  )
}

export default function DashboardPage({ user, onLogout }) {
  const [urlInput, setUrlInput]         = useState('')
  const [report, setReport]             = useState(null)
  const [pollConfig, setPollConfig]     = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab]       = useState('accessibility')
  const [issueTab, setIssueTab]         = useState('All')
  const [device, setDevice]             = useState('mobile')
  const [activeSidebar, setActiveSidebar] = useState(0)

  const initials = user?.username
    ? user.username.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? 'U').toUpperCase()

  const { mutate, isPending, reset } = useMutation({
    mutationFn: USE_MOCK
      ? mockScanFn
      : ({ url, strategy }) => guestScan({ url, strategy }),
    onSuccess: result => {
      if (USE_MOCK || !result.async) {
        setReport(USE_MOCK ? result : result.report)
      } else {
        setPollConfig({ guestScanId: result.guestScanId, strategy: result.strategy })
      }
    },
  })

  const { data: pollData } = useQuery({
    queryKey: ['dash-poll', pollConfig?.guestScanId],
    queryFn: () => pollGuestScan(pollConfig),
    refetchInterval: q => q.state.data?.status === 'complete' ? false : 3000,
    enabled: !!pollConfig,
    retry: false,
  })

  useEffect(() => {
    if (!pollData) return
    if (pollData.status === 'complete') { setPollConfig(null); setReport(pollData.report) }
  }, [pollData])

  const isLoading = isPending || !!pollConfig

  const handleScan = () => {
    if (!urlInput.trim()) return
    setReport(null)
    reset()
    mutate({ url: urlInput.trim(), strategy: device })
  }

  const allIssues = report
    ? SCORE_KEYS.flatMap(({ key, label }) =>
        (report.categories[key]?.issues || []).map(issue => ({
          ...issue, category: key, categoryLabel: label,
        }))
      )
    : []

  const filteredIssues = issueTab === 'All'
    ? allIssues
    : allIssues.filter(i => i.categoryLabel === issueTab)

  const totalIssues = report
    ? Object.values(report.categories).reduce((s, c) => s + (c.issuesFound ?? 0), 0)
    : 0

  const criticalIssues = report
    ? Object.values(report.categories).reduce((s, c) => s + (c.issues?.filter(i => i.failingElements > 0).length ?? 0), 0)
    : 0

  const scannedDate = report
    ? new Date(report.scannedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : null
  const scannedTime = report
    ? new Date(report.scannedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' UTC'
    : null

  // Mock issues per page data
  const issuesPerPage = report ? [
    { url: report.url || 'app.webyes.com/dashboard', count: 32 },
    { url: 'app.webyes.com/login',    count: 48 },
    { url: 'app.webyes.com/login',    count: 40 },
    { url: 'app.webyes.com/login',    count: 15 },
    { url: 'app.webyes.com/login',    count: 22 },
  ] : []
  const maxIssueCount = Math.max(...issuesPerPage.map(p => p.count), 48)

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: '#F1F5F9' }}>

      {/* ── Top nav ── */}
      <header
        className="h-14 flex items-center gap-2 px-4 shrink-0 border-b"
        style={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0', zIndex: 10 }}
      >
        {/* Logo */}
        <span className="font-black text-xl tracking-tight shrink-0 mr-1">
          <span style={{ color: '#2563EB' }}>Web</span><span style={{ color: '#1E2B4A' }}>Yes</span>
        </span>

        {/* Site picker */}
        <div
          className="flex items-center gap-1.5 px-3 h-9 rounded-md shrink-0 cursor-pointer hover:bg-gray-50 transition-colors"
          style={{ border: '1px solid #E2E8F0' }}
        >
          <Globe size={14} style={{ color: '#64748B' }} />
          <div className="leading-none">
            <div className="text-xs font-semibold" style={{ color: '#1E2B4A' }}>
              {urlInput ? new URL(urlInput.startsWith('http') ? urlInput : `https://${urlInput}`).hostname.replace('www.', '') : 'Webtoffee'}
            </div>
            <div className="text-xs" style={{ color: '#94A3B8' }}>
              {urlInput || 'www.webtoffee.com'}
            </div>
          </div>
          <ChevronDown size={13} style={{ color: '#94A3B8' }} />
        </div>

        {/* Device picker */}
        <div
          className="flex items-center gap-1.5 px-3 h-9 rounded-md shrink-0 cursor-pointer hover:bg-gray-50"
          style={{ border: '1px solid #E2E8F0' }}
          onClick={() => setDevice(d => d === 'mobile' ? 'desktop' : 'mobile')}
        >
          {device === 'mobile'
            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
            : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          }
          <span className="text-xs font-medium" style={{ color: '#1E2B4A' }}>
            {device === 'mobile' ? 'Mobile' : 'Desktop'}
          </span>
          <ChevronDown size={13} style={{ color: '#94A3B8' }} />
        </div>

        {/* Run scan button */}
        <div className="flex items-center rounded-md overflow-hidden shrink-0" style={{ border: '1px solid #1d58d8' }}>
          <button
            onClick={handleScan}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 h-9 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: '#2563EB' }}
          >
            {isLoading ? 'Scanning…' : 'Run scan'}
          </button>
          <button
            className="w-8 h-9 flex items-center justify-center border-l"
            style={{ backgroundColor: '#2563EB', borderColor: '#1d58d8' }}
          >
            <ChevronDown size={13} style={{ color: '#ffffff' }} />
          </button>
        </div>

        <div className="flex-1" />

        {/* Credits info */}
        <div className="hidden md:flex flex-col items-end leading-none shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold" style={{ color: '#1E2B4A' }}>Current plan: </span>
            <span className="text-xs font-bold" style={{ color: '#1E2B4A' }}>Enterprise yearly</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-xs" style={{ color: '#94A3B8' }}>0/2000 (1%) credit used</span>
            <Info size={11} style={{ color: '#94A3B8' }} />
          </div>
        </div>

        {/* Upgrade button */}
        <button
          className="flex items-center gap-1.5 px-4 h-9 rounded-md text-xs font-bold shrink-0 transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#F97316', color: '#ffffff' }}
        >
          <Zap size={13} fill="#ffffff" />
          Upgrade
        </button>

        {/* Help */}
        <button className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ border: '1.5px solid #E2E8F0' }}>
          <HelpCircle size={16} style={{ color: '#64748B' }} />
        </button>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 cursor-pointer hover:opacity-80"
          style={{ backgroundColor: '#1E2B4A' }}
          onClick={onLogout}
          title="Logout"
        >
          {initials}
        </div>
      </header>

      {/* ── Sidebar + content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ── */}
        <aside
          className="w-20 flex flex-col items-center py-3 gap-0.5 shrink-0 border-r"
          style={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0' }}
        >
          {SIDEBAR_ITEMS.map(({ Icon, label }, i) => (
            <button
              key={i}
              onClick={() => setActiveSidebar(i)}
              className="flex flex-col items-center gap-0.5 w-full py-2.5 px-1 rounded-lg transition-colors hover:bg-blue-50"
              style={{ color: activeSidebar === i ? '#2563EB' : '#64748B' }}
            >
              <Icon size={22} />
              <span
                className="text-center font-medium leading-tight"
                style={{ fontSize: 10, color: activeSidebar === i ? '#2563EB' : '#64748B' }}
              >
                {label}
              </span>
            </button>
          ))}

          <div className="flex-1" />

          <button
            className="flex flex-col items-center gap-0.5 w-full py-2.5 px-1 rounded-lg hover:bg-gray-50 transition-colors"
            style={{ color: '#64748B' }}
          >
            <Settings size={22} />
            <span className="text-center font-medium leading-tight" style={{ fontSize: 10, color: '#64748B' }}>
              Settings
            </span>
          </button>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundColor: '#F1F5F9' }}>

          {/* Site health overview */}
          <div className="rounded-xl p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>

            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold mb-1.5" style={{ color: '#1E2B4A' }}>
                  Site health overview
                </h2>
                {report ? (
                  <div className="flex items-center gap-3 flex-wrap" style={{ color: '#64748B', fontSize: 13 }}>
                    <a
                      href={report.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:underline"
                      style={{ color: '#2563EB' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                      {report.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                    </a>
                    <span style={{ color: '#E2E8F0' }}>|</span>
                    <span className="flex items-center gap-1">
                      <Wifi size={12} />
                      FAST 4G
                    </span>
                    <span style={{ color: '#E2E8F0' }}>|</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {report.location?.city || 'Ireland'}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: '#94A3B8' }}>
                    Enter a URL and click <strong style={{ color: '#2563EB' }}>Run scan</strong> to view site health
                  </p>
                )}
              </div>

              {report && (
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50 shrink-0"
                  style={{ border: '1px solid #E2E8F0', color: '#1E2B4A' }}
                >
                  <Share2 size={14} />
                  Get report
                </button>
              )}
            </div>

            {/* URL input (visible when no report) */}
            {!report && !isLoading && (
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleScan()}
                  placeholder="https://yoursite.com"
                  className="flex-1 h-10 px-4 rounded-lg text-sm outline-none"
                  style={{ border: '1px solid #E2E8F0', color: '#1E2B4A' }}
                />
                <button
                  onClick={handleScan}
                  disabled={!urlInput.trim()}
                  className="px-5 h-10 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: '#2563EB' }}
                >
                  Run scan
                </button>
              </div>
            )}

            {/* Score cards */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-xl animate-pulse" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', height: 130 }} />
                ))}
              </div>
            ) : report ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                {SCORE_KEYS.map(({ key, label, Icon }) => {
                  const score  = report.scores[key] ?? 0
                  const cat    = report.categories[key]
                  const issues = cat?.issuesFound ?? 0
                  const color  = scoreColor(score)
                  const isDown = score < 70
                  return (
                    <div
                      key={key}
                      className="rounded-xl p-4 cursor-pointer transition-shadow hover:shadow-sm"
                      style={{ border: '1px solid #E2E8F0', backgroundColor: '#ffffff' }}
                    >
                      {/* Label + icon */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium" style={{ color: '#64748B' }}>{label}</span>
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: '#EFF6FF' }}
                        >
                          <Icon size={14} style={{ color: '#2563EB' }} />
                        </div>
                      </div>
                      {/* Score + delta */}
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-3xl font-black" style={{ color }}>{score}%</span>
                        <span className="text-xs font-semibold flex items-center gap-0.5" style={{ color: isDown ? '#EF4444' : '#22C55E' }}>
                          {isDown ? '↓' : '↑'} {Math.abs(score - 70)}%
                        </span>
                      </div>
                      {/* Issues count */}
                      <div className="text-xs" style={{ color: '#94A3B8' }}>
                        Total issues:{' '}
                        <span
                          className="font-semibold underline cursor-pointer"
                          style={{ color: '#2563EB' }}
                          onClick={() => setIsDrawerOpen(true)}
                        >
                          {issues}
                        </span>
                        {key === 'accessibility' && (
                          <span> (+45 manual checks)</span>
                        )}
                        {' '}
                        <Info size={10} style={{ color: '#CBD5E1', display: 'inline' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>

          {/* Bottom two-column layout (when report exists) */}
          {report && (
            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 2fr' }}>

              {/* Left column */}
              <div className="flex flex-col gap-4">

                {/* Overall issues */}
                <div className="rounded-xl p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
                  <h3 className="text-sm font-bold mb-4" style={{ color: '#1E2B4A' }}>Overall issues</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg p-4" style={{ border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                      <div className="flex items-center gap-1 text-xs mb-2" style={{ color: '#64748B' }}>
                        Total issues <Info size={11} style={{ color: '#CBD5E1' }} />
                      </div>
                      <div className="text-3xl font-black" style={{ color: '#1E2B4A' }}>{totalIssues}</div>
                    </div>
                    <div className="rounded-lg p-4" style={{ border: '1px solid #FECDD3', backgroundColor: '#FFF1F2' }}>
                      <div className="flex items-center gap-1 text-xs mb-2" style={{ color: '#64748B' }}>
                        Critical issues <Info size={11} style={{ color: '#CBD5E1' }} />
                      </div>
                      <div className="text-3xl font-black" style={{ color: '#EF4444' }}>{criticalIssues}</div>
                    </div>
                  </div>
                </div>

                {/* Total issues donut */}
                <div className="rounded-xl p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
                  <h3 className="text-sm font-bold mb-4" style={{ color: '#1E2B4A' }}>Total issues</h3>
                  <div className="flex justify-center mb-3">
                    <DonutChart categories={report.categories} total={totalIssues} />
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {[
                      { label: 'Performance',   color: '#93C5FD' },
                      { label: 'Quality',        color: '#1D4ED8' },
                      { label: 'Accessibility',  color: '#1E2B4A' },
                      { label: 'SEO',            color: '#3B82F6' },
                    ].map(({ label, color }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <svg width="10" height="10" viewBox="0 0 10 10">
                          <polygon points="5,0 10,5 5,10 0,5" fill={color} />
                        </svg>
                        <span className="text-xs" style={{ color: '#64748B' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Issues per page */}
                <div className="rounded-xl p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold" style={{ color: '#1E2B4A' }}>Issues per page</h3>
                    <button
                      className="flex items-center gap-1 text-xs font-semibold"
                      style={{ color: '#2563EB' }}
                      onClick={() => setIsDrawerOpen(true)}
                    >
                      View all issues <ArrowRight size={12} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {issuesPerPage.map(({ url, count }, i) => (
                      <div key={i}>
                        <div className="text-xs mb-1 truncate" style={{ color: '#64748B' }}>{url}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: '#E2E8F0' }}>
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${(count / maxIssueCount) * 100}%`, backgroundColor: '#94A3B8' }}
                            />
                          </div>
                          <span className="text-xs font-semibold w-6 text-right" style={{ color: '#1E2B4A' }}>{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* X axis */}
                  <div className="flex justify-between mt-3" style={{ color: '#94A3B8', fontSize: 10 }}>
                    <span>0</span><span>16</span><span>32</span><span>48</span>
                  </div>
                </div>
              </div>

              {/* Issues log (right column) */}
              <div className="rounded-xl p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
                <h3 className="text-base font-bold mb-1" style={{ color: '#1E2B4A' }}>Issues log</h3>
                <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                  Optimize your website for peak performance by resolving these issues
                </p>

                {/* Tabs */}
                <div className="flex border-b mb-4" style={{ borderColor: '#E2E8F0' }}>
                  {ISSUE_TABS.map((tab) => {
                    const active = issueTab === tab
                    return (
                      <button
                        key={tab}
                        onClick={() => setIssueTab(tab)}
                        className="px-4 py-2.5 text-sm font-medium transition-colors"
                        style={{
                          color: active ? '#2563EB' : '#64748B',
                          borderBottom: active ? '2px solid #2563EB' : '2px solid transparent',
                          marginBottom: -1,
                        }}
                      >
                        {tab}
                      </button>
                    )
                  })}
                </div>

                {/* Table */}
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
                  <div
                    className="grid text-xs font-semibold px-4 py-3"
                    style={{
                      gridTemplateColumns: '1fr 110px 110px 80px',
                      backgroundColor: '#F8FAFC',
                      color: '#94A3B8',
                      borderBottom: '1px solid #E2E8F0',
                    }}
                  >
                    <span>Name</span>
                    <span>Priority</span>
                    <span>Category</span>
                    <span>Action</span>
                  </div>

                  {filteredIssues.length === 0 ? (
                    <div className="py-12 text-center text-sm" style={{ color: '#94A3B8' }}>
                      No issues found
                    </div>
                  ) : (
                    filteredIssues.slice(0, 12).map((issue, idx) => {
                      const { Icon: CatIcon } = SCORE_KEYS.find(s => s.key === issue.category) ?? { Icon: Shield }
                      const priority = idx < 4 ? 'Critical' : idx < 7 ? 'Moderate' : 'Medium'
                      const priorityStyle =
                        priority === 'Critical'
                          ? { backgroundColor: '#FEE2E2', color: '#EF4444', rounded: true }
                          : priority === 'Moderate'
                          ? { backgroundColor: '#FEF3C7', color: '#D97706', rounded: true }
                          : { backgroundColor: 'transparent', color: '#F97316', rounded: false }
                      return (
                        <div
                          key={idx}
                          className="grid items-center px-4 py-3 text-sm"
                          style={{
                            gridTemplateColumns: '1fr 110px 110px 80px',
                            borderBottom: idx < Math.min(filteredIssues.length, 12) - 1 ? '1px solid #F1F5F9' : 'none',
                          }}
                        >
                          <span className="pr-4 leading-snug truncate" style={{ color: '#1E2B4A' }}>
                            {issue.title}
                          </span>
                          <span>
                            <span
                              className="px-2.5 py-0.5 text-xs font-semibold"
                              style={{
                                backgroundColor: priorityStyle.backgroundColor,
                                color: priorityStyle.color,
                                borderRadius: priorityStyle.rounded ? 9999 : 0,
                              }}
                            >
                              {priority}
                            </span>
                          </span>
                          <span className="flex items-center gap-1.5 text-xs" style={{ color: '#64748B' }}>
                            <CatIcon size={14} />
                            {issue.categoryLabel}
                          </span>
                          <button
                            className="text-xs font-medium hover:underline text-left"
                            style={{ color: '#2563EB' }}
                            onClick={() => setIsDrawerOpen(true)}
                          >
                            View more
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Pagination */}
                {filteredIssues.length > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#64748B' }}>
                      <span>Items per page</span>
                      <div
                        className="flex items-center gap-1 px-2 py-1 rounded"
                        style={{ border: '1px solid #E2E8F0' }}
                      >
                        <span>5</span>
                        <ChevronDown size={10} />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {['‹', '1', '2', '…', '9', '10', '›'].map((p, i) => (
                        <button
                          key={i}
                          className="w-7 h-7 rounded flex items-center justify-center text-xs font-medium transition-colors"
                          style={{
                            backgroundColor: p === '1' ? '#2563EB' : 'transparent',
                            color: p === '1' ? '#ffffff' : '#64748B',
                            border: p === '1' ? 'none' : '1px solid #E2E8F0',
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback tab */}
      <div className="fixed right-0 top-1/2 z-40" style={{ transform: 'translateY(-50%)' }}>
        <button
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white"
          style={{
            backgroundColor: '#EF4444',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            borderRadius: '0 0 6px 6px',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>
          Feedback
        </button>
      </div>

      {/* Results drawer */}
      <ResultsDrawer
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setActiveTab('accessibility') }}
      >
        {isLoading && (
          <div className="bg-white rounded-lg p-5" style={{ border: '1px solid #E2E8F0' }}>
            <SkeletonLoader rows={3} />
          </div>
        )}
        {report && (
          <>
            <AuditSummaryCard report={report} />
            <ScoreOverview overallScore={report.overallScore} scores={report.scores} />
            <CategoryTabs categories={report.categories} activeTab={activeTab} onTabChange={setActiveTab}>
              <CategoryDetail category={report.categories[activeTab]} tabKey={activeTab} />
              {activeTab === 'performance' && (
                <CoreWebVitals metrics={report.metrics} filmstrip={report.filmstrip} />
              )}
              <UpsellBanner tab={activeTab} score={report.categories[activeTab]?.score} />
              <IssueList issues={report.categories[activeTab].issues} tabKey={activeTab} />
              <PassedList passed={report.categories[activeTab].passed} />
            </CategoryTabs>
            <BottomCTA />
          </>
        )}
      </ResultsDrawer>
    </div>
  )
}
