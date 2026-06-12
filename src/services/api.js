import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL

export const startScan = ({ url, device }) =>
  axios.post(`${BASE}/scan`, { url, device }).then((r) => r.data)

export const getScanStatus = (scanId) =>
  axios.get(`${BASE}/scan/${scanId}`).then((r) => r.data)

export const getReport = (scanId) =>
  axios.get(`${BASE}/report/${scanId}`).then((r) => r.data)
