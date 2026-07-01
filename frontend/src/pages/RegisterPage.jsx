import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alert, Input, Spinner } from '../components/ui/index'

export default function RegisterPage() {
  const { register, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const validate = () => {
    const e = {}

    if (!form.name.trim()) {
      e.name = 'Name is required'
    }

    if (!form.email.trim()) {
      e.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Enter a valid email'
    }

    if (!form.password) {
      e.password = 'Password is required'
    } else if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters'
    }

    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setApiError('')

    const errs = validate()

    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setErrors({})

    const result = await register(
      form.name.trim(),
      form.email.trim().toLowerCase(),
      form.password
    )

    if (result.ok) {
      navigate('/dashboard')
    } else {
      setApiError(result.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-md animate-fade-up">
        <div className="glass rounded-2xl shadow-card overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-ink-700/40">
            <h1 className="font-display text-2xl font-semibold text-ink-50">
              Create Account
            </h1>
            <p className="text-sm text-ink-400 mt-1">
              Register a new ledger account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
            {apiError && (
              <Alert
                type="error"
                message={apiError}
                onClose={() => setApiError('')}
              />
            )}

            <Input
              label="Name"
              type="text"
              placeholder="Enter your name"
              value={form.name}
              error={errors.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              error={errors.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              error={errors.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  Registering...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="px-8 pb-7 text-center">
            <p className="text-sm text-ink-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-gold-400 hover:text-gold-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}