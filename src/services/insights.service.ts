import { api } from './api'
import { extractApiData } from '@/utils/apiResponse'
import type { ApiResponse, CenterDashboard, HexagonData } from '@/types'

export const insightsService = {
  async getHexagon() {
    const response = await api.get<ApiResponse<HexagonData>>('/insights/hexagon')
    return extractApiData(response, '헥사곤 데이터를 불러올 수 없습니다.')
  },

  async getWeeklySummary() {
    const response = await api.get<ApiResponse<{
      thisWeek: { count: number; average: number }
      lastWeek: { count: number; average: number }
      change: number
    }>>('/insights/weekly-summary')
    return extractApiData(response, '주간 요약 데이터를 불러올 수 없습니다.')
  },

  async getRiskMembers() {
    const response = await api.get<ApiResponse<Array<{
      id: string
      name: string
      riskStatus: 'FOUNDATION' | 'GREEN' | 'YELLOW' | 'RED'
      reason: string
    }>>>('/insights/risk-members')
    return extractApiData(response, '위험 회원 목록을 불러올 수 없습니다.')
  },

  async getCenterDashboard() {
    const response = await api.get<ApiResponse<CenterDashboard>>('/insights/center-dashboard')
    return extractApiData(response, '센터 대시보드 데이터를 불러올 수 없습니다.')
  },
}
