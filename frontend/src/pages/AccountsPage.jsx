import React, { useEffect, useState } from 'react'
import { useAccounts } from '../hooks/useData'
import {
  Alert,
  Spinner,
  EmptyState,
  CopyButton,
} from '../components/ui/index'
import { accountService } from '../services/api'

export default function AccountsPage() {
  const {
    accounts,
    loading,
    error,
    fetchAccounts,
    createAccount,
    fetchBalance,
  } = useAccounts()

  const [balances, setBalances] = useState({})
  const [message, setMessage] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const handleCreateAccount = async () => {
    setCreating(true)

    const result = await createAccount()

    if (result.ok) {
      setMessage('Account created successfully')
      await fetchAccounts()
    } else {
      setMessage(result.message)
    }

    setCreating(false)
  }

  const handleBalance = async (id) => {
    const result = await fetchBalance(id)

    if (result.ok) {
      setBalances((prev) => ({
        ...prev,
        [id]: result.balance,
      }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="section-title">Accounts</h1>
          <p className="text-sm text-ink-400 mt-1">
            Manage your ledger accounts
          </p>
        </div>

        <button
          onClick={handleCreateAccount}
          disabled={creating}
          className="btn-primary"
        >
          {creating ? (
            <>
              <Spinner size="sm" />
              Creating...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </div>

      {message && (
        <Alert
          type="info"
          message={message}
          onClose={() => setMessage('')}
        />
      )}

      {error && (
        <Alert
          type="error"
          message={error}
        />
      )}

      {loading ? (
        <div className="card">
          Loading accounts...
        </div>
      ) : accounts.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No Accounts"
            description="Create your first account."
          />
        </div>
      ) : (
        <div className="grid gap-4">
          {accounts.map((account) => (
            <div
              key={account._id}
              className="card"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    Account ID
                  </h3>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="mono break-all">
                      {account._id}
                    </span>

                    <CopyButton
                      text={account._id}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 flex-wrap">
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

                {account.status === 'ACTIVE' && (
                  <button
                    onClick={async () => {
                      await accountService.freeze(account._id)
                      await fetchAccounts()
                    }}
                    className="btn-secondary text-xs"
                  >
                    Freeze
                  </button>
                )}

                {account.status === 'FROZEN' && (
                  <button
                    onClick={async () => {
                      await accountService.unfreeze(account._id)
                      await fetchAccounts()
                    }}
                    className="btn-primary text-xs"
                  >
                    Unfreeze
                  </button>
                )}
              </div>
              </div>

              <div className="mt-5">
                <button
                  onClick={() =>
                    handleBalance(account._id)
                  }
                  className="btn-secondary"
                >
                  Get Balance
                </button>

                {balances[account._id] !== undefined && (
                  <div className="mt-3">
                    <span className="amount-neutral">
                      ₹ {balances[account._id]}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}