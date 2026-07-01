
import React, { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alert, Input, Spinner } from '../components/ui/index'

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]   = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    const result = await login(form.email.trim().toLowerCase(), form.password)
    if (result.ok) {
      navigate('/dashboard')
    } else {
      setApiError(result.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-400/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center shadow-gold">
            <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <div>
            <div className="font-display text-2xl font-bold text-ink-50">Ledger</div>
            <div className="text-[10px] text-ink-500 tracking-widest uppercase">Financial Platform</div>
          </div>
        </div>

        <div className="glass rounded-2xl shadow-card overflow-hidden">
          {/* Header strip */}
          <div className="px-8 pt-8 pb-6 border-b border-ink-700/40">
            <h1 className="font-display text-2xl font-semibold text-ink-50">Welcome back</h1>
            <p className="text-sm text-ink-400 mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="px-8 py-6 space-y-5">
            {apiError && <Alert type="error" message={apiError} onClose={() => setApiError('')} />}

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              error={errors.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              error={errors.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
            />

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? <><Spinner size="sm" /> Signing in…</> : 'Sign In'}
            </button>
          </form>

          <div className="px-8 pb-7 text-center">
            <p className="text-sm text-ink-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}