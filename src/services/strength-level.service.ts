import { api } from './api'
import type { StrengthLevelRequest, StrengthLevelResponse, StrengthLevelData } from '@/types'

export const strengthLevelService = {
  async calculate(data: StrengthLevelRequest): Promise<StrengthLevelData> {
    try {
      const response = await api.post<StrengthLevelResponse>('/strength-level/calculate', data)
      
      // 백엔드가 { success: true, data: {...} } 형태로 반환
      if (response.data && response.data.success && response.data.data) {
        return response.data.data
      }
      
      // 응답이 직접 데이터인 경우 (fallback)
      if (response.data && 'exercise' in response.data) {
        return response.data as unknown as StrengthLevelData
      }
      
      throw new Error('응답 데이터 형식이 올바르지 않습니다.')
    } catch (error) {
      // 개발 모드에서 상세 에러 로그
      if (import.meta.env.DEV) {
        console.error('Strength Level API Error:', error)
        if (error && typeof error === 'object' && 'response' in error) {
          const httpError = error as { response?: { data?: unknown; status?: number } }
          console.error('Response status:', httpError.response?.status)
          console.error('Response data:', httpError.response?.data)
        }
      }
      throw error
    }
  },
}
