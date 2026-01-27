import { api } from './api'
import type { ApiResponse, PTSession } from '@/types'

export const ptSessionsService = {
  async getAll(memberId: string) {
    const response = await api.get<ApiResponse<PTSession[]>>(`/members/${memberId}/pt-sessions`)
    return response.data.data
  },

  async getById(memberId: string, sessionId: string) {
    const response = await api.get<ApiResponse<PTSession>>(`/members/${memberId}/pt-sessions/${sessionId}`)
    return response.data.data
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
    return response.data.data
  },

  async update(memberId: string, sessionId: string, data: Partial<PTSession>) {
    const response = await api.put<ApiResponse<PTSession>>(
      `/members/${memberId}/pt-sessions/${sessionId}`,
      data
    )
    return response.data.data
  },

  async delete(memberId: string, sessionId: string) {
    await api.delete<ApiResponse<null>>(`/members/${memberId}/pt-sessions/${sessionId}`)
  },
}
