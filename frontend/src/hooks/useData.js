import { useState, useCallback } from 'react'
import { accountService, transactionService } from '../services/api'
 
// ─── Accounts ────────────────────────────────────────────────────────────────
 
export function useAccounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
 
  const fetchAccounts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await accountService.getAll()
      setAccounts(data.accounts || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }, [])
 
  const createAccount = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await accountService.create()
      setAccounts((prev) => [...prev, data.account])
      return { ok: true, account: data.account }
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Failed to create account' }
    } finally {
      setLoading(false)
    }
  }, [])
 
  const fetchBalance = useCallback(async (accountId) => {
    try {
      const { data } = await accountService.getBalance(accountId)
      return { ok: true, balance: data.balance }
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Failed to fetch balance' }
    }
  }, [])
 
  return { accounts, loading, error, fetchAccounts, createAccount, fetchBalance }
}
 
// ─── Transactions ─────────────────────────────────────────────────────────────
 
export function useTransactions() {
  const [loading, setLoading] = useState(false)
 
  const sendMoney = useCallback(async ({ fromAccount, toAccount, amount, idempotencyKey }) => {
    setLoading(true)
    try {
      const { data } = await transactionService.create({ fromAccount, toAccount, amount: Number(amount), idempotencyKey })
      return { ok: true, transaction: data.transaction, message: data.message }
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Transaction failed' }
    } finally {
      setLoading(false)
    }
  }, [])
 
  const addInitialFunds = useCallback(async ({ toAccount, amount, idempotencyKey }) => {
    setLoading(true)
    try {
      const { data } = await transactionService.addInitialFunds({ toAccount, amount: Number(amount), idempotencyKey })
      return { ok: true, transaction: data.transaction }
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || 'Failed to add funds' }
    } finally {
      setLoading(false)
    }
  }, [])
 
  return { loading, sendMoney, addInitialFunds }
}
 