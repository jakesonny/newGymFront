import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import './PageHeader.css'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backTo?: string
  backLabel?: string
  actions?: ReactNode
  children?: ReactNode
}

export function PageHeader({ title, subtitle, backTo, backLabel = '← 전체 대시보드로 돌아가기', actions, children }: PageHeaderProps) {
  return (
    <div className="page-header">
      {backTo && (
        <Link to={backTo} className="back-link">
          <ArrowLeft size={20} />
          {backLabel}
        </Link>
      )}
      <div className="page-header-content">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
          {children}
        </div>
        {actions && <div className="page-header-actions">{actions}</div>}
      </div>
    </div>
  )
}
