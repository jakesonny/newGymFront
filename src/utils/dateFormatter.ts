/**
 * 날짜 포맷팅 유틸리티
 */

export function formatDate(date: string | Date, format: 'full' | 'short' | 'date' = 'date'): string {
  const d = typeof date === 'string' ? new Date(date) : date

  if (format === 'full') {
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (format === 'short') {
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return d.toLocaleDateString('ko-KR')
}

export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  return `${formatDate(startDate)} ~ ${formatDate(endDate)}`
}
