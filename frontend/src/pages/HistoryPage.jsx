import React, { useEffect, useState } from "react";
import { transactionService } from "../services/api";
import { CopyButton } from "../components/ui";
export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountFilter, setAccountFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await transactionService.history();
        setHistory(res.data.history || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
 const filteredHistory = history.filter((item) => {
  const matchesAccount =
    accountFilter === 'ALL' ||
    item.account === accountFilter

  const matchesType =
    typeFilter === 'ALL' ||
    item.type === typeFilter

  const transactionDate = new Date(
    item.transaction?.createdAt
  )

  const matchesFrom =
    !fromDate ||
    transactionDate >= new Date(fromDate)

  const endDate = toDate
  ? new Date(toDate + "T23:59:59")
  : null

const matchesTo =
  !toDate ||
  transactionDate <= endDate

  return (
    matchesAccount &&
    matchesType &&
    matchesFrom &&
    matchesTo
  )
})
  return (
  <div className="space-y-4">
    <h1 className="section-title">Transaction History</h1>
    <div className="mt-4 flex gap-3 flex-wrap">
  <select
    value={accountFilter}
    onChange={(e) => setAccountFilter(e.target.value)}
    className="input-field max-w-md"
  >
    <option value="ALL">All Accounts</option>

    {[...new Set(history.map((item) => item.account))].map(
      (accountId) => (
        <option
          key={accountId}
          value={accountId}
        >
          {accountId}
        </option>
      )
    )}
  </select>

  <select
    value={typeFilter}
    onChange={(e) => setTypeFilter(e.target.value)}
    className="input-field max-w-xs"
  >
    <option value="ALL">All Types</option>
    <option value="CREDIT">Credit</option>
    <option value="DEBIT">Debit</option>
  </select>
</div>
<div className="flex gap-3 flex-wrap">
  <div>
    <label className="block text-sm mb-1">
      From Date
    </label>

    <input
      type="date"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
      className="input-field w-44"
    />
  </div>

  <div>
    <label className="block text-sm mb-1">
      To Date
    </label>

    <input
      type="date"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
      className="input-field w-44"
    />
  </div>
</div>

    {filteredHistory.length === 0 ? (
      <p>No transactions found</p>
    ) : (
      filteredHistory.map((item) => (
        <div
          key={item._id}
          className="card p-4 border rounded-lg"
        >
          <div className="flex justify-between items-start">

           <div>
  <p className="font-medium text-gray-200">
    {new Date(item.transaction?.createdAt).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}
  </p>

  <p className="text-sm font-medium text-gray-300">
    {item.type === "CREDIT"
      ? `From: ${item.transaction?.fromAccount?.user?.name}`
      : `To: ${item.transaction?.toAccount?.user?.name}`}
  </p>

  <div className="flex items-center gap-2">
  <p className="text-xs text-gray-500 break-all">
     TXN Ref : {item.transaction?._id}
  </p>

  <CopyButton text={item.transaction?._id} />
</div>
</div>

            <div
              className={
                item.type === "CREDIT"
                  ? "text-green-400 font-bold text-lg"
                  : "text-red-400 font-bold text-lg"
              }
            >
              {item.type === "CREDIT"
  ? `+₹${Number(item.amount).toLocaleString("en-IN")} ↑`
  : `-₹${Number(item.amount).toLocaleString("en-IN")} ↓`}
            </div>

          </div>
        </div>
      ))
    )}
  </div>
);
}