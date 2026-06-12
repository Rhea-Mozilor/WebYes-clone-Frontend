import { useQuery } from '@tanstack/react-query'
import { getReport } from '../services/api'
import mockReport from '../lib/mockReport'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export function useReport(scanId, { isReady = false } = {}) {
  return useQuery({
    queryKey: ['report', scanId],
    queryFn: () => (USE_MOCK ? mockReport : getReport(scanId)),
    enabled: USE_MOCK ? Boolean(scanId) : Boolean(scanId) && isReady,
    staleTime: Infinity,
  })
}
