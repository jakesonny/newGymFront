import { ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import './ErrorMessage.css'

interface ErrorMessageProps {
  message: string
  title?: string
  onRetry?: () => void
  children?: ReactNode
}

export function ErrorMessage({ message, title, onRetry, children }: ErrorMessageProps) {
  return (
    <div className="error-message">
      <div className="error-icon">
        <AlertCircle size={24} />
      </div>
      {title && <h3 className="error-title">{title}</h3>}
      <p className="error-text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="error-retry">
          다시 시도
        </button>
      )}
      {children}
    </div>
  )
}
