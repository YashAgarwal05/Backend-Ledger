import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAccounts } from '../hooks/useData'
import { Alert, EmptyState, SkeletonCard } from '../components/ui/index'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { accounts, loading, error, fetchAccounts } = useAccounts()
  const { user } = useAuth()

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">
            Welcome back, {user?.name} 👋
          </h1>

          <p className="text-sm text-ink-400 mt-1">
            Overview of your ledger accounts
          </p>
        </div>

        <Link
          to="/dashboard/accounts"
          className="btn-primary"
        >
          Manage Accounts
        </Link>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
        />
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <p className="text-sm text-ink-400">
            Accounts
          </p>

          <h2 className="text-3xl font-bold text-gold-300 mt-2">
            {accounts.length}
          </h2>
        </div>
      </div>
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : accounts.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No Accounts Found"
            description="Create your first account to begin using the ledger."
            action={
              <Link
                to="/dashboard/accounts"
                className="btn-primary"
              >
                Create Account
              </Link>
            }
          />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <div
              key={account._id}
              className="card"
            >
              <h3 className="font-semibold text-lg">
                Account
              </h3>

              <p className="mono break-all mt-2">
                {account._id}
              </p>

              <div className="mt-4">
                <span
                  className={
                    account.status === 'ACTIVE'
                      ? 'badge-active'
                      : account.status === 'FROZEN'
                      ? 'badge-frozen'
                      : 'badge-closed'
                  }
                >
                  {account.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}