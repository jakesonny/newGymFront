import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, BarChart3, Dumbbell } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import './BottomTabBar.css'

export function BottomTabBar() {
  const location = useLocation()
  const { user } = useAuth()

  const navItems = [
    { path: '/center-dashboard', icon: BarChart3, label: '센터', requireRole: 'ADMIN' },
    { path: '/dashboard', icon: LayoutDashboard, label: '대시보드' },
    { path: '/members', icon: Users, label: '회원 관리' },
    { path: '/strength-level', icon: Dumbbell, label: '레벨 측정기' },
  ]

  // 권한 필터링
  const filteredNavItems = navItems.filter((item) => {
    if (item.requireRole && user?.role !== item.requireRole) {
      return false
    }
    return true
  })

  return (
    <nav className="bottom-tab-bar">
      {filteredNavItems.map((item) => {
        const Icon = item.icon
        // /members로 시작하는 모든 경로는 회원 관리로 활성화
        const isActive =
          location.pathname === item.path ||
          (item.path === '/members' && location.pathname.startsWith('/members'))

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`bottom-tab-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={24} />
            <span className="bottom-tab-label">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
