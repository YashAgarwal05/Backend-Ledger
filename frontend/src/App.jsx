import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AccountsPage from './pages/AccountsPage'
import TransferPage from './pages/TransferPage'
import InitialFundsPage from './pages/InitialFundsPage'
import NotFoundPage from './pages/NotFoundPage'
import HistoryPage from "./pages/HistoryPage";
import { useAuth } from './context/AuthContext'


import ProtectedRoute from './components/ProtectedRoute'
function SystemRoute({ children }) {
  const { user } = useAuth();

  if (!user?.systemUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/accounts" element={<AccountsPage />} />
            <Route path="/dashboard/transfer" element={<TransferPage />} />
            <Route path="/dashboard/history" element={<HistoryPage />} />
            <Route
              path="/dashboard/initial-funds"
              element={
                <SystemRoute>
                  <InitialFundsPage />
                </SystemRoute>
              }
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}