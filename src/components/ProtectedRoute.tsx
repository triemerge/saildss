// src/components/ProtectedRoute.tsx
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

type Props = { children: JSX.Element }

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // still loading (auth state initializing) — render nothing or spinner
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  // not logged in -> redirect to /login and store the intended path in query param `next`
  if (!user) {
    const next = encodeURIComponent(location.pathname + (location.search || ''))
    return <Navigate to={`/login?next=${next}`} replace />
  }

  // user present, allow access
  return children
}
