import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { useScan } from './hooks/useScan'
import { useScanStatus } from './hooks/useScanStatus'
import { useReport } from './hooks/useReport'
import URLInputForm from './components/home/URLInputForm'
import DeviceSelector from './components/home/DeviceSelector'
import ResultsDrawer from './components/drawer/ResultsDrawer'
import AuditSummaryCard from './components/drawer/AuditSummaryCard'
import ScoreOverview from './components/drawer/ScoreOverview'
import CategoryTabs from './components/drawer/CategoryTabs'
import CategoryDetail from './components/drawer/CategoryDetail'
import IssueList from './components/drawer/IssueList'
import PassedList from './components/drawer/PassedList'
import UpsellBanner from './components/drawer/UpsellBanner'
import BottomCTA from './components/drawer/BottomCTA'
import SkeletonLoader from './components/ui/SkeletonLoader'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export default function App() {
  const [device, setDevice]       = useState('desktop')
  const [scanId, setScanId]       = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('accessibility')

  const { mutate, isPending } = useScan({
    onSuccess: (data) => {
      setScanId(data.scanId)
      setIsDrawerOpen(true)
    },
  })

  const { data: statusData } = useScanStatus(scanId)
  const scanComplete = statusData?.status === 'complete'
  const scanError    = statusData?.status === 'error'

  const { data: report, isLoading: reportLoading } = useReport(scanId, {
    isReady: scanComplete,
  })

  const handleScan = (url) => {
    if (USE_MOCK) {
      setScanId('mock-abc123')
      setIsDrawerOpen(true)
      return
    }
    mutate({ url, device })
  }

  const handleClose = () => {
    setIsDrawerOpen(false)
    setScanId(null)
    setActiveTab('accessibility')
  }

  const isLoading = !report && !scanError

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEF2F7' }}>
      {/* Nav */}
      <header className="h-16 flex items-center px-6 shadow-sm" style={{ backgroundColor: '#1E2B4A' }}>
        <span className="text-white font-bold text-lg tracking-tight">
          Web<span style={{ color: '#F97316' }}>Yes</span>
        </span>
        <span
          className="ml-3 text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#94A3B8' }}
        >
          Accessibility Checker
        </span>
      </header>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center px-4 pt-20 pb-16">
        <div className="max-w-2xl w-full text-center mb-10">
          <h1 className="text-4xl font-extrabold mb-3 leading-tight" style={{ color: '#1E2B4A' }}>
            Is your website accessible?
          </h1>
          <p className="text-base" style={{ color: '#64748B' }}>
            Enter any URL to get a free WCAG 2.2 accessibility audit with performance,
            quality, and SEO scores — in seconds.
          </p>
        </div>

        {/* Input card */}
        <div
          className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6"
          style={{ border: '1px solid #E2E8F0' }}
        >
          <URLInputForm onSubmit={handleScan} isPending={isPending} />

          <div className="mt-4">
            <DeviceSelector value={device} onChange={setDevice} />
          </div>
        </div>

        {/* Trust line */}
        <p className="mt-6 text-xs" style={{ color: '#94A3B8' }}>
          Free · No signup required · Powered by WCAG 2.2
        </p>
      </main>

      <ResultsDrawer isOpen={isDrawerOpen} onClose={handleClose}>
        {/* Error state */}
        {scanError && (
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
              className="mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: '#2563EB' }}
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {!scanError && isLoading && (
          <div className="space-y-6">
            {/* Summary card skeleton */}
            <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E2E8F0' }}>
              <div className="flex gap-4">
                <div className="w-28 h-20 rounded-xl animate-pulse" style={{ backgroundColor: '#E2E8F0' }} />
                <div className="flex-1 space-y-3 pt-1">
                  <SkeletonLoader rows={3} />
                </div>
              </div>
            </div>

            {/* Score card skeleton */}
            <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #E2E8F0' }}>
              <div className="flex gap-8 items-center">
                <div className="w-36 h-36 rounded-full animate-pulse shrink-0" style={{ backgroundColor: '#E2E8F0' }} />
                <div className="flex-1 space-y-4">
                  <SkeletonLoader rows={4} />
                </div>
              </div>
            </div>

            {/* Tabs skeleton */}
            <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid #E2E8F0' }}>
              <SkeletonLoader rows={6} />
            </div>

            <p className="text-center text-sm animate-pulse" style={{ color: '#64748B' }}>
              Running audit…
            </p>
          </div>
        )}

        {/* Report content */}
        {report && (
          <>
            <AuditSummaryCard report={report} />
            <ScoreOverview overallScore={report.overallScore} scores={report.scores} />
            <CategoryTabs
              categories={report.categories}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            >
              <CategoryDetail category={report.categories[activeTab]} />
              <IssueList issues={report.categories[activeTab].issues} />
              <PassedList passed={report.categories[activeTab].passed} />
            </CategoryTabs>
            <UpsellBanner />
            <BottomCTA />
          </>
        )}
      </ResultsDrawer>
    </div>
  )
}
