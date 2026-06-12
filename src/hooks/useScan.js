import { useMutation } from '@tanstack/react-query'
import { startScan } from '../services/api'

export function useScan({ onSuccess } = {}) {
  return useMutation({
    mutationFn: startScan,
    onSuccess,
  })
}
