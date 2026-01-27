import { api } from './api'
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
    return response.data.data
  },

  async compareWithAverage(memberId: string) {
    const response = await api.get<ApiResponse<{
      member: MemberAnalytics
      average: MemberAnalytics
      comparison: {
        lowerBodyStrength: number
        cardiorespiratoryEndurance: number
        muscularEndurance: number
        flexibility: number
        bodyComposition: number
        stability: number
        totalScore: number
      }
    }>>(`/analytics/comparison/${memberId}`)
    return response.data.data
  },

  async getMemberAnalytics(memberId: string) {
    const response = await api.get<ApiResponse<MemberAnalytics>>(`/members/${memberId}/analytics`)
    return response.data.data
  },
}
