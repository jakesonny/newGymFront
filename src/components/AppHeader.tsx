import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Bell, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import './AppHeader.css'

// 라우트 경로 → 페이지 제목 매핑
const routeTitles: Record<string, string> = {
  '/dashboard': '센터현황',
  '/members': '회원 관리',
  '/members/new': '신규 회원 등록',
  '/center-dashboard': '센터현황',
  '/strength-level': '레벨 측정기',
  '/mypage': '마이페이지',
}

// 동적 라우트 패턴 매칭
const getPageTitle = (pathname: string): string => {
  // 정확한 매칭
  if (routeTitles[pathname]) {
    return routeTitles[pathname]
  }

  // 동적 라우트 매칭
  if (pathname.startsWith('/members/')) {
    if (pathname.endsWith('/goal-analyst')) {
      return '골 애널리스트'
    }
    // /members/:id
    return '회원 상세'
  }

  return '센터현황' // 기본값
}

export function AppHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const pageTitle = getPageTitle(location.pathname)

  // 현재 날짜 포맷팅 (예: 2026년 1월 23일)
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="app-header">
      <div className="app-header-left">
        <h1 className="app-header-title">{pageTitle}</h1>
        <p className="app-header-date">{currentDate}</p>
      </div>
      <div className="app-header-right">
        <button className="app-header-icon-btn" title="검색">
          <Search size={20} />
        </button>
        <button className="app-header-icon-btn" title="알림">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        <button 
          className="app-header-icon-btn" 
          title={user?.name || '프로필'}
          onClick={() => navigate('/mypage')}
        >
          <User size={20} />
        </button>
      </div>
    </header>
  )
}
