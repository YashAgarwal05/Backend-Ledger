import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-md text-center">
        <div className="text-5xl font-display text-ink-50">404</div>

        <h1 className="mt-3 text-xl font-semibold text-ink-100">
          Page Not Found
        </h1>

        <p className="mt-2 text-sm text-ink-400">
          The page you are looking for does not exist.
        </p>

        <Link to="/dashboard" className="btn-primary mt-6">
          Go To Dashboard
        </Link>
      </div>
    </div>
  )
}