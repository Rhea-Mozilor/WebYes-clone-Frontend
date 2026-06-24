import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  Globe, ChevronDown, Home, BarChart2, List, Activity, Settings,
  Bell, Clock, ExternalLink, Star, X, AlertCircle, Shield, Gauge,
  Search, FileText, CheckCircle, ArrowRight, Eye,
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

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const mockScanFn = () => new Promise(resolve => setTimeout(() => resolve(mockReport), 1500))

function scoreColor(score) {
  if (score >= 90) return '#22C55E'
  if (score >= 70) return '#2563EB'
  return '#F97316'
}

const SIDEBAR_ICONS = [Home, Globe, BarChart2, List, Activity]

export default function DashboardPage({ user, onLogout }) {
  const [urlInput, setUrlInput]           = useState('')
  const [device, setDevice]               = useState('desktop')
  const [report, setReport]               = useState(null)
  const [pollConfig, setPollConfig]       = useState(null)
  const [isDrawerOpen, setIsDrawerOpen]   = useState(false)
  const [activeTab, setActiveTab]         = useState('accessibility')
  const [showConsult, setShowConsult]     = useState(true)
  const [showUptime, setShowUptime]       = useState(true)

  const initials = user?.username
    ? user.username.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : (user?.email?.[0] ?? 'U').toUpperCase()

  const { mutate, isPending, reset } = useMutation({
    mutationFn: USE_MOCK
      ? mockScanFn
      : ({ url, strategy }) => guestScan({ url, strategy }),
    onSuccess: (result) => {
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

  const scoreCards = [
    { key: 'accessibility', label: 'Accessibility', Icon: Shield    },
    { key: 'performance',   label: 'Performance',   Icon: Gauge     },
    { key: 'quality',       label: 'Quality',       Icon: CheckCircle },
    { key: 'seo',           label: 'SEO',           Icon: Search    },
  ]

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#EEF2F7' }}>

      {/* ── Left sidebar ── */}
      <aside className="w-14 flex flex-col items-center py-4 gap-1 shrink-0" style={{ backgroundColor: '#0F172A' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#2563EB' }}>
          <span className="text-white text-xs font-black">W</span>
        </div>
        {SIDEBAR_ICONS.map((Icon, i) => (
          <button key={i}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: i === 0 ? '#ffffff' : '#475569' }}>
            <Icon size={17} />
          </button>
        ))}
        <div className="flex-1" />
        <button className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10" style={{ color: '#475569' }}>
          <Settings size={17} />
        </button>
        {/* User avatar at bottom of sidebar */}
        <button
          onClick={onLogout}
          title="Logout"
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mt-1"
          style={{ backgroundColor: '#2563EB' }}
        >
          {initials}
        </button>
      </aside>

      {/* ── Main column ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Top nav ── */}
        <header className="h-14 flex items-center gap-3 px-4 shrink-0"
          style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0' }}>

          {/* Logo */}
          <span className="text-base font-black tracking-tight mr-1 shrink-0">
            <span style={{ color: '#065bd2' }}>Web</span><span style={{ color: '#1E2B4A' }}>Yes</span>
          </span>

          {/* URL input bar */}
          <div className="flex items-center gap-1.5 px-3 h-9 rounded-lg flex-1 max-w-xs"
            style={{ border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
            <Globe size={13} style={{ color: '#64748B' }} />
            <input
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleScan()}
              placeholder="https://yoursite.com"
              className="flex-1 text-xs outline-none bg-transparent truncate"
              style={{ color: '#1E2B4A' }}
            />
            <ChevronDown size={13} style={{ color: '#94A3B8' }} />
          </div>

          {/* Run scan */}
          <button
            onClick={handleScan}
            disabled={isLoading || !urlInput.trim()}
            className="flex items-center gap-1.5 px-4 h-9 rounded-lg text-xs font-semibold text-white shrink-0 disabled:opacity-50 transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#22C55E' }}
          >
            {isLoading ? 'Scanning…' : 'Run scan'}
            <ChevronDown size={12} />
          </button>

          <div className="flex-1" />

          {/* Credits */}
          <div className="hidden sm:flex items-center gap-2 text-xs shrink-0" style={{ color: '#64748B' }}>
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
              <div className="h-full rounded-full" style={{ width: '99%', backgroundColor: '#22C55E' }} />
            </div>
            <span className="whitespace-nowrap">696/700 (99%) credits left</span>
          </div>

          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 shrink-0">
            <Bell size={16} style={{ color: '#64748B' }} />
          </button>

          <span className="text-xs font-bold px-2 py-0.5 rounded shrink-0"
            style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>PRO</span>

          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ backgroundColor: '#2563EB' }}>
            {initials}
          </div>
        </header>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {/* Consultation banner */}
          {showConsult && (
            <div className="rounded-xl px-5 py-4 flex items-center gap-4 relative"
              style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: '#FEF3C7' }}>
                <Star size={20} style={{ color: '#F59E0B' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#D1FAE5', color: '#059669' }}>
                    Accessibility Expert
                  </span>
                </div>
                <p className="text-sm font-bold" style={{ color: '#1E2B4A' }}>
                  You've unlocked a free 45-minutes accessibility consultation!
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                  Get a live site review and a clear, prioritised plan for WCAG 2.1, ADA, and EAA.
                </p>
              </div>
              <button className="px-4 py-2 rounded-lg text-xs font-semibold text-white shrink-0"
                style={{ backgroundColor: '#2563EB' }}>
                Book a call
              </button>
              <button onClick={() => setShowConsult(false)}
                className="absolute top-3 right-3 p-1 rounded hover:bg-black/5">
                <X size={14} style={{ color: '#94A3B8' }} />
              </button>
            </div>
          )}

          {/* Uptime banner */}
          {showUptime && (
            <div className="rounded-xl px-5 py-3 flex items-center gap-3 relative"
              style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <p className="text-xs flex-1 pr-6">
                <span className="font-semibold cursor-pointer hover:underline" style={{ color: '#2563EB' }}>
                  Uptime Monitoring is now active!
                </span>{' '}
                <span style={{ color: '#64748B' }}>
                  Keep your website running smoothly by detecting outages and performance issues in real-time, ensuring a seamless experience for your customers.
                </span>
              </p>
              <button onClick={() => setShowUptime(false)}
                className="absolute top-3 right-3 p-1 rounded hover:bg-black/5">
                <X size={14} style={{ color: '#94A3B8' }} />
              </button>
            </div>
          )}

          {/* Site health overview */}
          <div className="rounded-xl p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#DBEAFE' }}>
                    <Shield size={13} style={{ color: '#2563EB' }} />
                  </div>
                  <h2 className="text-base font-bold" style={{ color: '#1E2B4A' }}>Site health overview</h2>
                </div>
                {report && (
                  <div className="flex items-center gap-2 text-xs pl-8" style={{ color: '#64748B' }}>
                    <span className="font-medium cursor-pointer hover:underline" style={{ color: '#2563EB' }}>
                      {report.url}
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
                  <div className="text-right">
                    <div className="text-xs font-medium" style={{ color: '#1E2B4A' }}>
                      {new Date(report.scannedAt).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </div>
                    <div className="text-xs flex items-center justify-end gap-1 mt-0.5" style={{ color: '#94A3B8' }}>
                      <Clock size={11} />
                      {new Date(report.scannedAt).toLocaleTimeString('en-GB', {
                        hour: '2-digit', minute: '2-digit',
                      })} UTC
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors hover:bg-gray-50"
                    style={{ border: '1px solid #E2E8F0', color: '#1E2B4A' }}
                  >
                    Get report <ExternalLink size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Score cards */}
            {isLoading ? (
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-xl p-4 animate-pulse"
                    style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', height: 130 }} />
                ))}
              </div>
            ) : report ? (
              <div className="grid grid-cols-4 gap-4">
                {scoreCards.map(({ key, label, Icon }) => {
                  const score = report.scores[key] ?? 0
                  const cat   = report.categories[key]
                  return (
                    <div key={key} className="rounded-xl p-4"
                      style={{ border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                      <Icon size={22} style={{ color: scoreColor(score) }} className="mb-2" />
                      <div className="text-sm font-medium mb-1" style={{ color: '#64748B' }}>{label}</div>
                      <div className="text-3xl font-black mb-2" style={{ color: scoreColor(score) }}>
                        {score}%
                      </div>
                      <div className="text-xs" style={{ color: '#94A3B8' }}>
                        Total issues:{' '}
                        <span className="font-semibold" style={{ color: '#1E2B4A' }}>
                          {cat?.issuesFound ?? 0}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-14" style={{ color: '#94A3B8' }}>
                <Globe size={36} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium" style={{ color: '#64748B' }}>
                  Enter a URL above and click <strong>Run scan</strong> to see your site health
                </p>
              </div>
            )}
          </div>

          {/* Bottom row — only when report is ready */}
          {report && (
            <div className="grid grid-cols-3 gap-4">
              {/* Overall issues */}
              <div className="rounded-xl p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
                <div className="flex items-center gap-1.5 mb-4">
                  <h3 className="text-sm font-bold" style={{ color: '#1E2B4A' }}>Overall issues</h3>
                  <AlertCircle size={14} style={{ color: '#94A3B8' }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg p-3" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <div className="text-xs mb-1" style={{ color: '#64748B' }}>Total issues</div>
                    <div className="text-3xl font-black" style={{ color: '#1E2B4A' }}>
                      {Object.values(report.categories).reduce((s, c) => s + (c.issuesFound ?? 0), 0)}
                    </div>
                  </div>
                  <div className="rounded-lg p-3" style={{ backgroundColor: '#FFF1F2', border: '1px solid #FECDD3' }}>
                    <div className="text-xs mb-1" style={{ color: '#64748B' }}>Critical issues</div>
                    <div className="text-3xl font-black" style={{ color: '#EF4444' }}>
                      {report.categories.accessibility?.issuesFound ?? 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Issue log */}
              <div className="col-span-2 rounded-xl p-5" style={{ backgroundColor: '#ffffff', border: '1px solid #E2E8F0' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold" style={{ color: '#1E2B4A' }}>Issue log</h3>
                    <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                      Optimise your website for peak performance by resolving these issues
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="text-xs font-semibold flex items-center gap-1 hover:opacity-80 shrink-0"
                    style={{ color: '#2563EB' }}
                  >
                    View all issues <ArrowRight size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {scoreCards.map(({ key, label, Icon }) => {
                    const cat = report.categories[key]
                    return (
                      <div key={key} className="rounded-lg p-3 text-center"
                        style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <Icon size={20} className="mx-auto mb-1.5"
                          style={{ color: scoreColor(report.scores[key] ?? 0) }} />
                        <div className="text-xs font-medium mb-1" style={{ color: '#64748B' }}>{label}</div>
                        <div className="text-xl font-black" style={{ color: '#1E2B4A' }}>
                          {cat?.issuesFound ?? 0}
                        </div>
                        <div className="text-xs" style={{ color: '#94A3B8' }}>issues</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed report drawer */}
      <ResultsDrawer isOpen={isDrawerOpen} onClose={() => { setIsDrawerOpen(false); setActiveTab('accessibility') }}>
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
