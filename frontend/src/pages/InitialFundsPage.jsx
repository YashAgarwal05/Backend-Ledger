import React, { useEffect, useState } from 'react'
import { useAccounts, useTransactions } from '../hooks/useData'
import {
  Alert,
  Input,
  Select,
  Spinner,
} from '../components/ui/index'
import { accountService } from '../services/api'


export default function InitialFundsPage() {
  const { accounts, fetchAccounts } = useAccounts()
  const { addInitialFunds, loading } = useTransactions()
  const [receiverName, setReceiverName] = useState("")
const [accountError, setAccountError] = useState("")

  const [form, setForm] = useState({
    toAccount: '',
    amount: '',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (!form.toAccount || !form.amount) {
      setError('All fields are required')
      return
    }
    if (accountError) {
      setError(accountError)
      return
  }

    const result = await addInitialFunds({
      toAccount: form.toAccount,
      amount: Number(form.amount),
      idempotencyKey: crypto.randomUUID(),
    })

    if (result.ok) {
      setMessage('Initial funds added successfully')

      setForm({
        toAccount: '',
        amount: '',
      })
      setReceiverName("")
      setAccountError("")
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">
          Initial Funds
        </h1>

        <p className="text-sm text-ink-400 mt-1">
          System user funding operation
        </p>
      </div>

      {message && (
        <Alert
          type="success"
          message={message}
          onClose={() => setMessage('')}
        />
      )}

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      <div className="card max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
               <Input
              label="Account ID"
              value={form.toAccount}
              maxLength={24}
              onChange={async (e) => {
                const value = e.target.value

                setForm({
                  ...form,
                  toAccount: value,
                })

    if (value.length === 24) {
      try {
        const res =
          await accountService.getAccountDetails(value)

        setReceiverName(res.data.name)
        setAccountError("")
      } catch {
        setReceiverName("")
        setAccountError("✗ Account not found")
      }
    } else {
      setReceiverName("")
      setAccountError("")
    }
  }}
  placeholder="Paste account ID here"
/>
{receiverName && (
  <p className="text-sm text-green-400 mt-2">
    ✓ Account Holder: {receiverName}
  </p>
)}

{accountError && (
  <p className="text-sm text-red-400 mt-2">
    {accountError}
  </p>
)}

          <Input
            label="Amount"
            type="number"
            min="1"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value,
              })
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                Processing...
              </>
            ) : (
              'Add Initial Funds'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}