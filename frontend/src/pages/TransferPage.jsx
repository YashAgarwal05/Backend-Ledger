import React, { useEffect, useState } from 'react'
import { useAccounts, useTransactions } from '../hooks/useData'
import {
  Alert,
  Input,
  Select,
  Spinner,
} from '../components/ui/index'
import { accountService } from '../services/api'

export default function TransferPage() {
  const { accounts, fetchAccounts } = useAccounts()
  const { sendMoney, loading } = useTransactions()

  const [receiverName, setReceiverName] = useState("");
  const [accountError, setAccountError] = useState("");

  const [form, setForm] = useState({
    fromAccount: '',
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

    if (
      !form.fromAccount ||
      !form.toAccount ||
      !form.amount
    ) {
      setError('All fields are required')
      return
    }
    if (accountError) {
  setError(accountError)
  return
}

    const result = await sendMoney({
      fromAccount: form.fromAccount,
      toAccount: form.toAccount,
      amount: Number(form.amount),
      idempotencyKey: crypto.randomUUID(),
    })

    if (result.ok) {
      setError('')
      setMessage(
        result.message || 'Transfer successful'
      )
      

      setForm({
        fromAccount: '',
        toAccount: '',
        amount: '',
      })
      setReceiverName('')
      setAccountError('')
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">
          Transfer Funds
        </h1>

        <p className="text-sm text-ink-400 mt-1">
          Send money between accounts
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
          <Select
            label="From Account"
            value={form.fromAccount}
            onChange={(e) =>{
              setForm({
                ...form,
                fromAccount: e.target.value,
              })
              setAccountError("")
              setReceiverName("")
            }}
          >
            <option value="">
              Select Account
            </option>

            {accounts.map((acc) => (
              <option
                key={acc._id}
                value={acc._id}
              >
                {acc._id}
              </option>
            ))}
          </Select>

          <Input
  label="To Account ID"
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
      const res = await accountService.getAccountDetails(value)

      if (value === form.fromAccount) {
        setReceiverName("")
        setAccountError("⚠ You cannot transfer to your own account")
      } else {
        setReceiverName(res.data.name)
        setAccountError("")
      }

    } catch (err) {
      setReceiverName("")
      setAccountError("✗ Account not found")
    }
  } else {
    setReceiverName("")
    setAccountError("")
  }
}}
  placeholder="Enter destination account ID"
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
<p className="text-xs text-ink-500 mt-1">
  Account ID must be 24 characters
</p>

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
              'Transfer'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}