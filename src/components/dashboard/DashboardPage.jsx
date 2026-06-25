import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Globe, ChevronDown, Settings, Bell, Clock, ExternalLink,
  X, AlertCircle, Shield, Gauge, CheckCircle, Search,
  LayoutGrid, MapPin, BarChart2, FileText, Share2, ArrowUpCircle,
  Info, ArrowRight, Download, ChevronRight,
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

function scoreIcon(score) {
  if (score >= 90) return '▲'
  if (score >= 70) return '▲'
  return '▼'
}

const SCORE_KEYS = [
  { key: 'accessibility', label: 'Accessibility', Icon: Shield },
  { key: 'performance',   label: 'Performance',   Icon: Gauge },
  { key: 'quality',       label: 'Quality',       Icon: CheckCircle },
  { key: 'seo',           label: 'SEO',           Icon: Search },
]

const ISSUE_TABS = ['All', 'Accessibility', 'Performance', 'Quality', 'SEO']
const ISSUE_TAB_ICONS = [LayoutGrid, Shield, Gauge, CheckCircle, Search]

const SIDEBAR_ITEMS = [
  { Icon: LayoutGrid,   label: 'Dashboard' },
  { Icon: MapPin,       label: 'Locations' },
  { Icon: BarChart2,    label: 'Analytics' },
  { Icon: FileText,     label: 'Reports' },
  { Icon: Share2,       label: 'Share' },
  { Icon: ArrowUpCircle,label: 'Upgrade' },
]

export default function DashboardPage({ user, onLogout }) {
  const [urlInput, setUrlInput]         = useState('')
  const [report, setReport]             = useState(null)
  const [pollConfig, setPollConfig]     = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab]       = useState('accessibility')
  const [issueTab, setIssueTab]         = useState('All')
  const [device, setDevice]             = useState('desktop')

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

  // Build flat issue list for the issue log table
  const allIssues = report
    ? SCORE_KEYS.flatMap(({ key, label }) =>
        (report.categories[key]?.issues || []).map(issue => ({
          ...issue,
          category: key,
          categoryLabel: label,
        }))
      )
    : []

  const filteredIssues = issueTab === 'All'
    ? allIssues
    : allIssues.filter(i => i.categoryLabel === issueTab)

  const totalIssues = report
    ? Object.values(report.categories).reduce((s, c) => s + (c.issuesFound ?? 0), 0)
    : 0

  const criticalIssues = report?.categories?.accessibility?.issuesFound ?? 0

  const scannedDate = report
    ? new Date(report.scannedAt).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : null
  const scannedTime = report
    ? new Date(report.scannedAt).toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit',
      }) + ' UTC'
    : null

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: '#F8FAFC' }}>

      {/* ── Top nav — full width ── */}
      <header
        className="h-14 flex items-center gap-3 px-5 shrink-0 border-b w-full"
        style={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0' }}
      >
        {/* Logo text */}
        <span className="font-black text-2xl tracking-tight mr-1 shrink-0">
          <span style={{ color: '#2563EB' }}>W</span><span style={{ color: '#1E2B4A' }}>ebYes</span>
        </span>

        {/* URL bar */}
        <div
          className="flex items-center gap-2 px-3 h-9 rounded-lg flex-1 max-w-xs"
          style={{ border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}
        >
          <Globe size={13} style={{ color: '#64748B' }} />
          <input
            type="text"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleScan()}
            placeholder="https://yoursite.com"
            className="flex-1 text-xs outline-none bg-transparent min-w-0"
            style={{ color: '#1E2B4A' }}
          />
          <ChevronDown size={13} style={{ color: '#94A3B8' }} />
        </div>

        {/* Run scan */}
        <button
          onClick={handleScan}
          disabled={isLoading || !urlInput.trim()}
          className="flex items-center gap-1.5 px-4 h-9 rounded-sm text-base font-semibold text-white shrink-0"
          style={{ backgroundColor: '#1469e1' }}
        >
          {isLoading ? 'Scanning…' : 'Run scan'}
          <ChevronDown size={12} />
        </button>

        <div className="flex-1" />

        {/* Credits */}
        <div className="hidden sm:flex items-center gap-2 text-xs shrink-0" style={{ color: '#64748B' }}>
          <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
            <div className="h-full rounded-full" style={{ width: '98%', backgroundColor: '#22C55E' }} />
          </div>
          <span className="whitespace-nowrap">686/700 (98%) credits left</span>
          <Info size={13} style={{ color: '#94A3B8' }} />
        </div>

        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 shrink-0">
          <Clock size={16} style={{ color: '#94A3B8' }} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 shrink-0">
          <Bell size={16} style={{ color: '#94A3B8' }} />
        </button>

        <span
          className="text-xs font-bold px-2 py-0.5 rounded shrink-0"
          style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
        >
          PRO
        </span>

        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 cursor-pointer"
          style={{ backgroundColor: '#2563EB' }}
          onClick={onLogout}
          title="Logout"
        >
          {initials}
        </div>
      </header>

      {/* ── Below nav: sidebar + content ── */}
      <div className="flex flex-1 overflow-hidden">

      {/* ── Sidebar ── */}
      <aside
        className="w-14 flex flex-col items-center py-4 gap-1 shrink-0 border-r"
        style={{ backgroundColor: '#ffffff', borderColor: '#E2E8F0' }}
      >
        {/* Logo icon */}
        

        {SIDEBAR_ITEMS.map(({ Icon, label }, i) => (
          <button
            key={i}
            title={label}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:bg-blue-50"
            style={{
              backgroundColor: i === 0 ? '#EFF6FF' : 'transparent',
              color: i === 0 ? '#2563EB' : '#94A3B8',
            }}
          >
            <Icon size={18} />
          </button>
        ))}

        <div className="flex-1" />

        <button
          title="Logout"
          onClick={onLogout}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white mb-1"
          style={{ backgroundColor: '#2563EB' }}
        >
          {initials}
        </button>
        <button
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-50"
          style={{ color: '#94A3B8' }}
          title="Settings"
        >
          <Settings size={18} />
        </button>
        <span className="text-xs" style={{ color: '#94A3B8', fontSize: 9 }}>Settings</span>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ backgroundColor: '#F1F5F9' }}>

          {/* Site health overview card */}
          <div className="rounded-2xl p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>

            {/* Header row */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#DCFCE7' }}
                  >
                    <span style={{ color: '#22C55E', fontSize: 14 }}>▲</span>
                  </div>
                  <h2 className="text-base font-bold" style={{ color: '#1E2B4A' }}>
                    Site health overview
                  </h2>
                </div>
                {report && (
                  <div className="flex items-center gap-2 text-xs pl-9" style={{ color: '#64748B' }}>
                    <span
                      className="font-medium cursor-pointer hover:underline flex items-center gap-1"
                      style={{ color: '#2563EB' }}
                    >
                      <Globe size={11} /> {report.url}
                    </span>
                    <span>|</span>
                    <span className="cursor-pointer hover:underline" style={{ color: '#2563EB' }}>
                      View scanned pages
                    </span>
                  </div>
                )}
              </div>

              {report && (
                <div className="flex items-center gap-3 shrink-0">
                  {/* Stacked avatars + date */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      <div className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: '#3B82F6' }} />
                      <div className="w-6 h-6 rounded-full border-2 border-white" style={{ backgroundColor: '#F97316' }} />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-semibold" style={{ color: '#1E2B4A' }}>{scannedDate}</div>
                      <div className="text-xs flex items-center gap-1" style={{ color: '#94A3B8' }}>
                        <Clock size={10} /> {scannedTime}
                      </div>
                    </div>
                    <Info size={13} style={{ color: '#94A3B8' }} />
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors hover:bg-gray-50"
                    style={{ border: '1px solid #E2E8F0', color: '#1E2B4A' }}
                  >
                    Get report <Download size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Score cards */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl p-5 animate-pulse"
                    style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', height: 140 }}
                  />
                ))}
              </div>
            ) : report ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {SCORE_KEYS.map(({ key, label, Icon }) => {
                  const score    = report.scores[key] ?? 0
                  const cat      = report.categories[key]
                  const issues   = cat?.issuesFound ?? 0
                  const color    = scoreColor(score)
                  return (
                    <div
                      key={key}
                      className="rounded-xl p-5 cursor-pointer hover:shadow-sm transition-shadow"
                      style={{ border: '1px solid #E2E8F0', backgroundColor: '#FAFAFA' }}
                    >
                      <Icon size={20} style={{ color: '#64748B' }} className="mb-3" />
                      <div className="text-sm mb-1" style={{ color: '#64748B' }}>{label}</div>
                      <div className="text-3xl font-black mb-2" style={{ color }}>
                        {score}%
                      </div>
                      <div className="text-xs" style={{ color: '#94A3B8' }}>
                        Total issues:{' '}
                        <span className="font-semibold" style={{ color: '#1E2B4A' }}>{issues}</span>
                        {key === 'accessibility' && (
                          <span style={{ color: '#94A3B8' }}> (+32 manual checks)</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Globe size={40} style={{ color: '#CBD5E1' }} />
                <p className="text-sm font-medium" style={{ color: '#94A3B8' }}>
                  Enter a URL above and click <strong style={{ color: '#22C55E' }}>Run scan</strong> to view site health
                </p>
              </div>
            )}
          </div>

          {/* Bottom two-column row — only when report exists */}
          {report && (
            <div className="grid grid-cols-3 gap-4">

              {/* Overall issues */}
              <div className="rounded-2xl p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
                <div className="flex items-center gap-1.5 mb-4">
                  <h3 className="text-sm font-bold" style={{ color: '#1E2B4A' }}>Overall issues</h3>
                  <Info size={13} style={{ color: '#CBD5E1' }} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="rounded-xl p-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <div className="text-xs mb-2" style={{ color: '#64748B' }}>Total issues</div>
                    <div className="text-3xl font-black mb-1" style={{ color: '#1E2B4A' }}>{totalIssues}</div>
                    <button className="text-xs font-medium" style={{ color: '#2563EB' }}>View more</button>
                  </div>
                  <div className="rounded-xl p-4" style={{ backgroundColor: '#FFF1F2', border: '1px solid #FECDD3' }}>
                    <div className="text-xs mb-2" style={{ color: '#64748B' }}>Critical issues</div>
                    <div className="text-3xl font-black mb-1" style={{ color: '#EF4444' }}>{criticalIssues}</div>
                    <button className="text-xs font-medium" style={{ color: '#2563EB' }}>View more</button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold mb-0.5" style={{ color: '#1E2B4A' }}>
                      Issues by category
                    </div>
                    <div className="text-xs" style={{ color: '#94A3B8' }}>
                      Total issues in the recent scan
                    </div>
                  </div>
                  <button
                    className="flex items-center gap-1 text-xs font-semibold"
                    style={{ color: '#2563EB' }}
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    View all issues <ArrowRight size={13} />
                  </button>
                </div>

                {/* Category breakdown */}
                <div className="mt-3 space-y-2">
                  {SCORE_KEYS.map(({ key, label, Icon }) => {
                    const count = report.categories[key]?.issuesFound ?? 0
                    const pct   = totalIssues > 0 ? (count / totalIssues) * 100 : 0
                    return (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="flex items-center gap-1" style={{ color: '#64748B' }}>
                            <Icon size={11} /> {label}
                          </span>
                          <span className="font-semibold" style={{ color: '#1E2B4A' }}>{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{ backgroundColor: '#E2E8F0' }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: scoreColor(report.scores[key] ?? 0) }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Issue log */}
              <div className="col-span-2 rounded-2xl p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: '#1E2B4A' }}>Issue log</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                      Optimise your website for peak performance by resolving these issues
                    </p>
                  </div>
                  <button
                    className="flex items-center gap-1 text-xs font-semibold shrink-0"
                    style={{ color: '#2563EB' }}
                    onClick={() => setIsDrawerOpen(true)}
                  >
                    View all issues <ArrowRight size={13} />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-0 mb-4 border-b" style={{ borderColor: '#E2E8F0' }}>
                  {ISSUE_TABS.map((tab, i) => {
                    const Icon = ISSUE_TAB_ICONS[i]
                    const active = issueTab === tab
                    return (
                      <button
                        key={tab}
                        onClick={() => setIssueTab(tab)}
                        className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors"
                        style={{
                          color: active ? '#2563EB' : '#64748B',
                          borderBottom: active ? '2px solid #2563EB' : '2px solid transparent',
                          marginBottom: -1,
                        }}
                      >
                        <Icon size={13} />
                        {tab}
                      </button>
                    )
                  })}
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl" style={{ border: '1px solid #E2E8F0' }}>
                  {/* Header */}
                  <div
                    className="grid text-xs font-semibold px-4 py-2.5"
                    style={{
                      gridTemplateColumns: '1fr 100px 100px 80px',
                      backgroundColor: '#F8FAFC',
                      color: '#94A3B8',
                      borderBottom: '1px solid #E2E8F0',
                    }}
                  >
                    <span>Issue</span>
                    <span>Priority</span>
                    <span>Category</span>
                    <span>Action</span>
                  </div>

                  {/* Rows */}
                  {filteredIssues.length === 0 ? (
                    <div className="py-10 text-center text-xs" style={{ color: '#94A3B8' }}>
                      No issues found in this category
                    </div>
                  ) : (
                    filteredIssues.slice(0, 6).map((issue, idx) => {
                      const CatIcon = SCORE_KEYS.find(s => s.key === issue.category)?.Icon ?? Shield
                      return (
                        <div
                          key={idx}
                          className="grid items-center px-4 py-3 text-xs"
                          style={{
                            gridTemplateColumns: '1fr 100px 100px 80px',
                            borderBottom: idx < filteredIssues.slice(0, 6).length - 1 ? '1px solid #F1F5F9' : 'none',
                          }}
                        >
                          <span className="pr-4 font-medium leading-snug" style={{ color: '#1E2B4A' }}>
                            {issue.title}
                          </span>
                          <span>
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{ backgroundColor: '#FEE2E2', color: '#EF4444' }}
                            >
                              Critical
                            </span>
                          </span>
                          <span className="flex items-center gap-1" style={{ color: '#64748B' }}>
                            <CatIcon size={13} />
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

                {filteredIssues.length > 6 && (
                  <div className="mt-3 text-center">
                    <button
                      className="text-xs font-medium"
                      style={{ color: '#2563EB' }}
                      onClick={() => setIsDrawerOpen(true)}
                    >
                      + {filteredIssues.length - 6} more issues — View all
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      </div>{/* end flex-1 row (sidebar + content) */}

      {/* Feedback tab on right edge */}
      <div
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40"
        style={{ writingMode: 'vertical-rl' }}
      >
        <button
          className="px-2 py-4 text-xs font-semibold text-white rounded-l-lg"
          style={{ backgroundColor: '#2563EB' }}
        >
          Feedback
        </button>
      </div>

      {/* Detailed report drawer */}
      <ResultsDrawer
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setActiveTab('accessibility') }}
      >
        {isLoading && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-5" style={{ border: '1px solid #E2E8F0' }}>
              <SkeletonLoader rows={3} />
            </div>
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
