import { memo, useMemo } from 'react'
import './StatusBadge.css'

export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
export type RiskStatus = 'FOUNDATION' | 'GREEN' | 'YELLOW' | 'RED'

interface StatusBadgeProps {
  status: MemberStatus | RiskStatus
  type?: 'member' | 'risk'
  showDot?: boolean
  className?: string
}

export const StatusBadge = memo(function StatusBadge({ status, type = 'member', showDot = false, className = '' }: StatusBadgeProps) {
  const config = useMemo(() => {
    if (type === 'risk') {
      switch (status as RiskStatus) {
        case 'RED':
          return { label: '위험', color: 'var(--color-danger)', class: 'risk-red' }
        case 'YELLOW':
          return { label: '주의', color: 'var(--color-warning)', class: 'risk-yellow' }
        case 'GREEN':
          return { label: '정상', color: 'var(--color-success)', class: 'risk-green' }
        case 'FOUNDATION':
          return { label: '기초', color: 'var(--color-info)', class: 'risk-foundation' }
        default:
          return { label: status, color: 'var(--color-text-tertiary)', class: '' }
      }
    } else {
      switch (status as MemberStatus) {
        case 'ACTIVE':
          return { label: '활성', color: 'var(--color-success)', class: 'member-active' }
        case 'INACTIVE':
          return { label: '비활성', color: 'var(--color-text-secondary)', class: 'member-inactive' }
        case 'SUSPENDED':
          return { label: '정지', color: 'var(--color-danger)', class: 'member-suspended' }
        default:
          return { label: status, color: 'var(--color-text-tertiary)', class: '' }
      }
    }
  }, [status, type])

  return (
    <span
      className={`status-badge ${config.class} ${className}`}
      style={showDot ? { color: config.color } : undefined}
    >
      {showDot && <span className="status-dot" style={{ backgroundColor: config.color }} />}
      {config.label}
    </span>
  )
})
