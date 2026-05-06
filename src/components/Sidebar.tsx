import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, Dumbbell } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import logoImage from '@/img/스트롱살롱.jpg'
import './Sidebar.css'

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()

  const handleLogoClick = () => {
    navigate('/')
  }

  // 대시보드 → 회원 관리 → 레벨 측정기
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: '대시보드', requireRole: 'TRAINER' },
    { path: '/members', icon: Users, label: '회원 관리', requireRole: 'TRAINER' },
    { path: '/strength-level', icon: Dumbbell, label: '레벨 측정기' },
  ]

  // 권한 필터링
  const filteredNavItems = navItems.filter((item) => {
    if (item.requireRole && user?.role !== item.requireRole && user?.role !== 'ADMIN') {
      return false
    }
    return true
  })

  return (
    <aside className="sidebar">
      <div className="sidebar-header" onClick={handleLogoClick}>
        <div className="sidebar-logo">
          <img src={logoImage} alt="스트롱쌀롱 로고" className="logo-image" />
        </div>
        <div className="sidebar-branding">
          <div className="branding-title">스트롱쌀롱</div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          // /members로 시작하는 모든 경로는 회원 관리로 활성화
          const isActive = 
            location.pathname === item.path || 
            (item.path === '/members' && location.pathname.startsWith('/members') && location.pathname !== '/members/new')
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span className="sidebar-nav-label">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
