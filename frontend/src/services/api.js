import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,          // send cookies on every request
  headers: { 'Content-Type': 'application/json' },
})

// Attach Bearer token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ledger_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401, clear storage and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ledger_token')
      localStorage.removeItem('ledger_user')
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authService = {
  register: (data) => api.post('/api/auth/register', data),
  login:    (data) => api.post('/api/auth/login', data),
  logout:   ()     => api.post('/api/auth/logout'),
}

// ─── Accounts ────────────────────────────────────────────────────────────────

export const accountService = {
  create: () => api.post('/api/accounts/'),

  getAll: () => api.get('/api/accounts/'),

  getBalance: (accountId) =>
    api.get(`/api/accounts/balance/${accountId}`),

  getAccountDetails: (accountId) =>
    api.get(`/api/accounts/details/${accountId}`),

  freeze: (accountId) =>
    api.patch(`/api/accounts/freeze/${accountId}`),

  unfreeze: (accountId) =>
    api.patch(`/api/accounts/unfreeze/${accountId}`),
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export const transactionService = {
  create: (data) => api.post('/api/transactions/', data),
  addInitialFunds: (data) => api.post('/api/transactions/system/initial-funds', data),
  history: () => api.get('/api/transactions/history'),
}

export default api