import type { ApiResponse } from '@/types'

/**
 * API 응답에서 data 추출 및 검증
 * @param response - axios 응답 객체
 * @param errorMessage - data가 없을 때 표시할 에러 메시지
 * @returns 추출된 data
 * @throws Error - data가 없거나 응답이 실패한 경우
 */
export function extractApiData<T>(response: { data: ApiResponse<T> }, errorMessage = '데이터를 불러올 수 없습니다.'): T {
  if (!response.data?.success || !response.data?.data) {
    throw new Error(errorMessage)
  }
  return response.data.data
}
