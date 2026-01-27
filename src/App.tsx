import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { MembersPage } from './pages/MembersPage'
import { MemberDetailPage } from './pages/MemberDetailPage'
import { NewMemberPage } from './pages/NewMemberPage'
import { GoalAnalystPage } from './pages/GoalAnalystPage'
import { CenterDashboardPage } from './pages/CenterDashboardPage'
import { StrengthLevelPage } from './pages/StrengthLevelPage'
import { MyPage } from './pages/MyPage'

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
              <ProtectedRoute>
                <DashboardPage />
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
                <NewMemberPage />
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
          <Route
            path="/center-dashboard"
            element={
              <ProtectedRoute requireRole="ADMIN">
                <CenterDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/strength-level"
            element={<StrengthLevelPage />}
          />
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
