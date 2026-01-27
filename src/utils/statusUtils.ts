/**
 * 상태 관련 유틸리티 함수
 */

export type RiskStatus = 'FOUNDATION' | 'GREEN' | 'YELLOW' | 'RED'
export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export function getRiskStatusColor(status: RiskStatus | string): string {
  switch (status) {
    case 'RED':
      return 'var(--color-danger)'
    case 'YELLOW':
      return 'var(--color-warning)'
    case 'GREEN':
      return 'var(--color-success)'
    case 'FOUNDATION':
      return 'var(--color-info)'
    default:
      return 'var(--color-text-tertiary)'
  }
}

export function getRiskStatusLabel(status: RiskStatus | string): string {
  switch (status) {
    case 'RED':
      return '위험'
    case 'YELLOW':
      return '주의'
    case 'GREEN':
      return '정상'
    case 'FOUNDATION':
      return '기초'
    default:
      return String(status)
  }
}

export function getMemberStatusLabel(status: MemberStatus | string): string {
  switch (status) {
    case 'ACTIVE':
      return '활성'
    case 'INACTIVE':
      return '비활성'
    case 'SUSPENDED':
      return '정지'
    default:
      return String(status)
  }
}
