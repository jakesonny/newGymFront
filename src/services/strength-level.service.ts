import { api } from './api'
import { extractApiData } from '@/utils/apiResponse'
import type { ApiResponse, StrengthLevelRequest, StrengthLevelData } from '@/types'

export const strengthLevelService = {
  async calculate(data: StrengthLevelRequest): Promise<StrengthLevelData> {
    const response = await api.post<ApiResponse<StrengthLevelData>>('/strength-level/calculate', data)
    return extractApiData(response, '레벨 계산 결과를 불러올 수 없습니다.')
  },
}
