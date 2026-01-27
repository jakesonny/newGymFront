/**
 * 에러 처리 유틸리티
 */

export function getErrorMessage(error: unknown, defaultMessage = '오류가 발생했습니다.'): string {
  if (error instanceof Error) {
    return error.message || defaultMessage
  }
  if (typeof error === 'string') {
    return error
  }
  return defaultMessage
}

export function logError(error: unknown, context?: string) {
  const message = getErrorMessage(error)
  if (context) {
    console.error(`[${context}]`, message, error)
  } else {
    console.error(message, error)
  }
}
