import { ReactNode } from 'react'
import './Loading.css'

interface LoadingProps {
  message?: string
  fullScreen?: boolean
  children?: ReactNode
}

export function Loading({ message = '로딩 중...', fullScreen = false, children }: LoadingProps) {
  if (children) {
    return <div className="loading-container">{children}</div>
  }

  return (
    <div className={`loading ${fullScreen ? 'loading-fullscreen' : ''}`}>
      <div className="loading-spinner"></div>
      <span className="loading-message">{message}</span>
    </div>
  )
}
