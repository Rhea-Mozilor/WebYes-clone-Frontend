import { useState, useEffect } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AlertCircle } from 'lucide-react'
import { guestScan, pollGuestScan, authMe, authLogout, getToken, clearToken, setToken } from './services/api'
import mockReport from './lib/mockReport'
import URLInputForm from './components/home/URLInputForm'
import DeviceSelector from './components/home/DeviceSelector'
import ResultsDrawer from './components/drawer/ResultsDrawer'
import LoginPage from './components/auth/LoginPage'
import SignupPage from './components/auth/SignupPage'
import AuditSummaryCard from './components/drawer/AuditSummaryCard'
import ScoreOverview from './components/drawer/ScoreOverview'
import CategoryTabs from './components/drawer/CategoryTabs'
import CategoryDetail from './components/drawer/CategoryDetail'
import IssueList from './components/drawer/IssueList'
import PassedList from './components/drawer/PassedList'
import CoreWebVitals from './components/drawer/CoreWebVitals'
import UpsellBanner from './components/drawer/UpsellBanner'
import BottomCTA from './components/drawer/BottomCTA'
import SkeletonLoader from './components/ui/SkeletonLoader'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const mockScanFn = () =>
  new Promise((resolve) => setTimeout(() => resolve(mockReport), 1500))

export default function App() {
  const [view, setView]                 = useState('home') // 'home' | 'login' | 'signup'
  const [user, setUser]                 = useState(null)
  const [device, setDevice]             = useState('desktop')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [report, setReport]             = useState(null)
  const [activeTab, setActiveTab]       = useState('accessibility')
  const [errorType, setErrorType]       = useState(null) // 'scan_failed'
  const [pollConfig, setPollConfig]     = useState(null) // { guestScanId, strategy }

  const { mutate, isPending, isError, reset } = useMutation({
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
    onError: () => {
      setErrorType('scan_failed')
    },
  })

  // Poll result every 3s when in async mode
  const { data: pollData } = useQuery({
    queryKey: ['guest-poll', pollConfig?.guestScanId],
    queryFn: () => pollGuestScan(pollConfig),
    refetchInterval: (q) => q.state.data?.status === 'complete' ? false : 3000,
    enabled: !!pollConfig,
    retry: false,
  })

  useEffect(() => {
    if (!pollData) return
    if (pollData.status === 'complete') {
      setPollConfig(null)
      setReport(pollData.report)
    } else if (pollData.status === 'error') {
      setPollConfig(null)
      setErrorType('scan_failed')
    }
  }, [pollData])

  // Restore session on mount
  useEffect(() => {
    if (getToken()) {
      authMe().then(setUser).catch(() => clearToken())
    }
  }, [])

  const handleLoginSuccess = (token, userData) => {
    setToken(token)
    setUser(userData)
    setView('home')
  }

  const handleLogout = async () => {
    try { await authLogout() } catch (_) {}
    clearToken()
    setUser(null)
  }

  const isLoading = isPending || !!pollConfig

  const handleScan = (url) => {
    setReport(null)
    reset()
    setIsDrawerOpen(true)
    mutate({ url, strategy: device })
  }

  const handleClose = () => {
    setIsDrawerOpen(false)
    setReport(null)
    setPollConfig(null)
    reset()
    setErrorType(null)
    setActiveTab('accessibility')
  }

  if (view === 'login')  return <LoginPage  onLoginSuccess={handleLoginSuccess} onNavigateSignup={() => setView('signup')} />
  if (view === 'signup') return <SignupPage onLoginSuccess={handleLoginSuccess} onNavigateLogin={() => setView('login')} />

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEF2F7' }}>
      {/* Nav */}
      <header className="h-16 flex items-center justify-between px-6 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
        <span className="text-black font-bold text-lg tracking-tight">
          <span style={{ color: '#065bd2' }}>W</span>ebYes
        </span>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm font-medium" style={{ color: '#1E2B4A' }}>
                {user.username || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                style={{ color: '#EF4444', border: '1px solid #E2E8F0' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setView('login')}
                className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:bg-gray-50"
                style={{ color: '#1E2B4A', border: '1px solid #E2E8F0' }}
              >
                Sign in
              </button>
              <button
                onClick={() => setView('signup')}
                className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#2563EB' }}
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center px-4 pt-10 sm:pt-20 pb-16">
        <div className="max-w-2xl w-full text-center mb-10">
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 leading-tight" style={{ color: '#1E2B4A' }}>
            Is your website accessible?
          </h1>
          <p className="text-base" style={{ color: '#64748B' }}>
            Enter any URL to get a free WCAG 2.2 accessibility audit with performance,
            quality, and SEO scores — in seconds.
          </p>
        </div>

        <div
          className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6"
          style={{ border: '1px solid #E2E8F0' }}
        >
          <URLInputForm onSubmit={handleScan} isPending={isPending} />
          <div className="mt-4">
            <DeviceSelector value={device} onChange={setDevice} />
          </div>
        </div>

        <p className="mt-6 text-xs" style={{ color: '#94A3B8' }}>
          Free · No signup required · Powered by WCAG 2.2
        </p>
      </main>

      <ResultsDrawer isOpen={isDrawerOpen} onClose={handleClose}>
        {/* Error state */}
        {isError && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <AlertCircle size={40} style={{ color: '#EF4444' }} />
            <div className="text-center">
              <p className="font-semibold text-base mb-1" style={{ color: '#1E2B4A' }}>
                Scan failed
              </p>
              <p className="text-sm" style={{ color: '#64748B' }}>
                We couldn't complete the audit. Please check the URL and try again.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="mt-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
              style={{ backgroundColor: '#2563EB' }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-5" style={{ border: '1px solid #E2E8F0' }}>
              <div className="flex gap-4">
                <div className="w-28 h-20 rounded-lg animate-pulse shrink-0" style={{ backgroundColor: '#E2E8F0' }} />
                <div className="flex-1 space-y-3 pt-1">
                  <SkeletonLoader rows={3} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6" style={{ border: '1px solid #E2E8F0' }}>
              <div className="flex gap-8 items-center">
                <div className="w-36 h-36 rounded-lg animate-pulse shrink-0" style={{ backgroundColor: '#E2E8F0' }} />
                <div className="flex-1 space-y-4">
                  <SkeletonLoader rows={4} />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-5" style={{ border: '1px solid #E2E8F0' }}>
              <SkeletonLoader rows={6} />
            </div>
            <p className="text-center text-sm animate-pulse" style={{ color: '#64748B' }}>
              Running Lighthouse audit — this takes about 20 seconds…
            </p>
          </div>
        )}

        {/* Report */}
        {report && (
          <>
            <AuditSummaryCard report={report} />
            <ScoreOverview overallScore={report.overallScore} scores={report.scores} />
            <CategoryTabs
              categories={report.categories}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            >
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
