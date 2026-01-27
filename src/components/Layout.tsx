import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { AppHeader } from './AppHeader'
import { BottomTabBar } from './BottomTabBar'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
  showSidebar?: boolean
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  return (
    <div className="layout">
      {showSidebar && <Sidebar />}
      <div className={`layout-content ${showSidebar ? 'with-sidebar' : ''}`}>
        <AppHeader />
        <main className="layout-main">
          {children}
        </main>
      </div>
      <BottomTabBar />
    </div>
  )
}
