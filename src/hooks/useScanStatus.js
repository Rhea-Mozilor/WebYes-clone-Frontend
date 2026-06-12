import { useQuery } from '@tanstack/react-query'
import { getScanStatus } from '../services/api'

const TERMINAL = ['complete', 'error']
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export function useScanStatus(scanId) {
  return useQuery({
    queryKey: ['scanStatus', scanId],
    queryFn: () => getScanStatus(scanId),
    enabled: Boolean(scanId) && !USE_MOCK,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return TERMINAL.includes(status) ? false : 2000
    },
  })
}
