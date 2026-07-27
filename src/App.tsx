import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { getHomeRouteForRole } from './utils/roleHome'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { MembersPage } from './pages/MembersPage'
import { MemberDetailPage } from './pages/MemberDetailPage'
import { GoalAnalystPage } from './pages/GoalAnalystPage'
import { CenterDashboardPage } from './pages/CenterDashboardPage'
import { StrengthLevelPage } from './pages/StrengthLevelPage'
import { MyPage } from './pages/MyPage'

/** 루트("/") 진입 시 로그인 여부·역할에 따라 알맞은 화면으로 보낸다. */
function HomeRedirect() {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={getHomeRouteForRole(user?.role)} replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireRole="TRAINER">
                <CenterDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members"
            element={
              <ProtectedRoute requireRole="ADMIN">
                <MembersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/new"
            element={
              <ProtectedRoute requireRole="ADMIN">
                <Navigate to="/members" state={{ openNewMemberModal: true }} replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/:memberId"
            element={
              <ProtectedRoute>
                <MemberDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/members/:memberId/goal-analyst"
            element={
              <ProtectedRoute>
                <GoalAnalystPage />
              </ProtectedRoute>
            }
          />
          <Route path="/center-dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/strength-level" element={<StrengthLevelPage />} />
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<HomeRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
