import { api } from './api'
import { extractApiData } from '@/utils/apiResponse'
import type { ApiResponse, MemberAnalytics } from '@/types'

export const analyticsService = {
  async getAverages() {
    const response = await api.get<ApiResponse<{
      lowerBodyStrength: number
      cardiorespiratoryEndurance: number
      muscularEndurance: number
      flexibility: number
      bodyComposition: number
      stability: number
      totalScore: number
    }>>('/analytics/averages')
    return extractApiData(response, '분석 데이터를 불러올 수 없습니다.')
  },

  async compareWithAverage(memberId: string) {
    const response = await api.get<ApiResponse<{
      member: MemberAnalytics
      average: MemberAnalytics
      comparison: { lowerBodyStrength: number; cardiorespiratoryEndurance: number; muscularEndurance: number; flexibility: number; bodyComposition: number; stability: number; totalScore: number }
    }>>(`/analytics/comparison/${memberId}`)
    return extractApiData(response, '평균 비교 데이터를 불러올 수 없습니다.')
  },

  async getMemberAnalytics(memberId: string) {
    const response = await api.get<ApiResponse<MemberAnalytics>>(`/members/${memberId}/analytics`)
    return extractApiData(response, '회원 분석 데이터를 불러올 수 없습니다.')
  },
}
