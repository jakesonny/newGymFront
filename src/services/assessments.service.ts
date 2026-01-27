import { api } from './api'
import type { ApiResponse, Assessment } from '@/types'

export const assessmentsService = {
  async getAll(memberId: string) {
    const response = await api.get<ApiResponse<{
      assessments: Assessment[]
      total: number
      hasInitialAssessment: boolean
    }>>(`/members/${memberId}/assessments`)
    return response.data.data
  },

  async checkInitial(memberId: string) {
    const response = await api.get<ApiResponse<{
      hasInitialAssessment: boolean
      initialAssessment: {
        id: string
        assessedAt: string
        assessmentType: string
      } | null
    }>>(`/members/${memberId}/assessments/check-initial`)
    return response.data.data
  },

  async getById(memberId: string, assessmentId: string) {
    const response = await api.get<ApiResponse<Assessment>>(
      `/members/${memberId}/assessments/${assessmentId}`
    )
    return response.data.data
  },

  async create(memberId: string, data: {
    assessmentType: 'INITIAL' | 'REGULAR'
    assessedAt: string
    items: Array<{
      category: string
      grade?: string
      details?: Record<string, unknown>
    }>
  }) {
    const response = await api.post<ApiResponse<Assessment>>(`/members/${memberId}/assessments`, data)
    return response.data.data
  },

  async update(memberId: string, assessmentId: string, data: Partial<Assessment>) {
    const response = await api.put<ApiResponse<Assessment>>(
      `/members/${memberId}/assessments/${assessmentId}`,
      data
    )
    return response.data.data
  },
}
