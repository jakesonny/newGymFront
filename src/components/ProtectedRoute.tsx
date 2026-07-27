import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { getHomeRouteForRole } from '@/utils/roleHome'

interface ProtectedRouteProps {
  children: ReactNode
  requireRole?: 'ADMIN' | 'TRAINER' | 'MEMBER'
}

export function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <div>로딩 중...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireRole && user?.role !== requireRole && user?.role !== 'ADMIN') {
    // 예전엔 무조건 /dashboard로 보냈는데, /dashboard 자체가 TRAINER 전용이라
    // MEMBER가 여기 걸리면 /dashboard로 또 튕기는 무한 루프였다. 본인 역할의
    // 홈으로 보내야 실제로 갈 곳이 생긴다.
    return <Navigate to={getHomeRouteForRole(user?.role)} replace />
  }

  return <>{children}</>
}
