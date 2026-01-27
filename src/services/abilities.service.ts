import { api } from './api'
import { extractApiData } from '@/utils/apiResponse'
import type { ApiResponse, AbilitySnapshot, HexagonData } from '@/types'

export const abilitiesService = {
  async getLatestSnapshot(memberId: string) {
    const response = await api.get<ApiResponse<AbilitySnapshot>>(`/members/${memberId}/abilities/latest`)
    return extractApiData(response, '최신 능력치 스냅샷을 불러올 수 없습니다.')
  },

  async getSnapshots(memberId: string) {
    const response = await api.get<ApiResponse<{ snapshots: AbilitySnapshot[]; total: number }>>(
      `/members/${memberId}/abilities/snapshots`
    )
    return extractApiData(response, '능력치 스냅샷 목록을 불러올 수 없습니다.')
  },

  async compareSnapshots(memberId: string, prevCount = 1) {
    const response = await api.get<ApiResponse<{
      current: AbilitySnapshot
      previous: AbilitySnapshot
      changes: {
        lowerBodyStrength: number
        cardiorespiratoryEndurance: number
        muscularEndurance: number
        flexibility: number
        bodyComposition: number
        stability: number
        totalScore: number
      }
    }>>(`/members/${memberId}/abilities/compare`, { params: { prev: prevCount } })
    return extractApiData(response, '능력치 비교 데이터를 불러올 수 없습니다.')
  },

  async getHexagon(memberId: string, compare = false): Promise<HexagonData | null> {
    try {
      const response = await api.get<ApiResponse<HexagonData>>(
        `/members/${memberId}/abilities/hexagon`,
        { params: { compare: compare.toString() } }
      )
      return extractApiData(response, '헥사곤 데이터를 불러올 수 없습니다.')
    } catch (error) {
      // 404 에러 (스냅샷 없음 등) 시 null 반환 (조용히 처리)
      if (error && typeof error === 'object' && 'response' in error) {
        const httpError = error as { response?: { status?: number } }
        if (httpError.response?.status === 404) {
          // 개발 모드에서만 로그 출력
          if (import.meta.env.DEV) {
            console.debug('능력치 스냅샷이 없습니다:', memberId)
          }
          return null
        }
      }
      // 다른 에러는 다시 throw
      throw error
    }
  },

  async getHistory(memberId: string) {
    const response = await api.get<ApiResponse<Array<{
      date: string
      lowerBodyStrength: number
      cardiorespiratoryEndurance: number
      muscularEndurance: number
      flexibility: number
      bodyComposition: number
      stability: number
      totalScore: number
    }>>>(`/members/${memberId}/abilities/history`)
    return extractApiData(response, '능력치 히스토리를 불러올 수 없습니다.')
  },
}
