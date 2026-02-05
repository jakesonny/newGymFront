import { api } from './api'
import { extractApiData } from '@/utils/apiResponse'
import type { ApiResponse, PTSession } from '@/types'

export const ptSessionsService = {
  async getAll(memberId: string) {
    const response = await api.get<ApiResponse<PTSession[]>>(`/members/${memberId}/pt-sessions`)
    return extractApiData(response, 'PT 세션 목록을 불러올 수 없습니다.')
  },

  async getById(memberId: string, sessionId: string) {
    const response = await api.get<ApiResponse<PTSession>>(`/members/${memberId}/pt-sessions/${sessionId}`)
    return extractApiData(response, 'PT 세션 정보를 불러올 수 없습니다.')
  },

  async create(memberId: string, data: {
    sessionDate: string
    mainContent: string
    trainerComment?: string
    membershipId?: string
    measuredWeight?: number
    measuredMuscleMass?: number
    measuredBodyFat?: number
    benchPress1RM?: number
    squat1RM?: number
    deadlift1RM?: number
    stepTestTime?: number
  }) {
    const response = await api.post<ApiResponse<PTSession>>(`/members/${memberId}/pt-sessions`, data)
    return extractApiData(response, 'PT 세션 등록에 실패했습니다.')
  },

  async update(memberId: string, sessionId: string, data: Partial<PTSession>) {
    const response = await api.put<ApiResponse<PTSession>>(`/members/${memberId}/pt-sessions/${sessionId}`, data)
    return extractApiData(response, 'PT 세션 수정에 실패했습니다.')
  },

  async delete(memberId: string, sessionId: string) {
    await api.delete<ApiResponse<null>>(`/members/${memberId}/pt-sessions/${sessionId}`)
  },
}
