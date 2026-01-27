import { ReactNode } from 'react'
import './Card.css'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  border?: 'none' | 'left' | 'full'
  borderColor?: 'primary' | 'success' | 'warning' | 'danger'
}

export function Card({ children, className = '', padding = 'md', border = 'full', borderColor }: CardProps) {
  const borderClass = border === 'left' ? 'card-border-left' : border === 'full' ? 'card-border-full' : ''
  const borderColorClass = borderColor ? `card-border-${borderColor}` : ''
  
  return (
    <div className={`card card-padding-${padding} ${borderClass} ${borderColorClass} ${className}`}>
      {children}
    </div>
  )
}
