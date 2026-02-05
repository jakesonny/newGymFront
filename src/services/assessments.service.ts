import { api } from './api'
import { extractApiData } from '@/utils/apiResponse'
import type { ApiResponse, Assessment } from '@/types'

export const assessmentsService = {
  async getAll(memberId: string) {
    const response = await api.get<ApiResponse<{
      assessments: Assessment[]
      total: number
      hasInitialAssessment: boolean
    }>>(`/members/${memberId}/assessments`)
    return extractApiData(response, '평가 목록을 불러올 수 없습니다.')
  },

  async checkInitial(memberId: string) {
    const response = await api.get<ApiResponse<{
      hasInitialAssessment: boolean
      initialAssessment: { id: string; assessedAt: string; assessmentType: string } | null
    }>>(`/members/${memberId}/assessments/check-initial`)
    return extractApiData(response, '초기 평가 확인에 실패했습니다.')
  },

  async getById(memberId: string, assessmentId: string) {
    const response = await api.get<ApiResponse<Assessment>>(`/members/${memberId}/assessments/${assessmentId}`)
    return extractApiData(response, '평가 정보를 불러올 수 없습니다.')
  },

  async create(memberId: string, data: {
    assessmentType: 'INITIAL' | 'REGULAR'
    assessedAt: string
    items: Array<{ category: string; grade?: string; details?: Record<string, unknown> }>
  }) {
    const response = await api.post<ApiResponse<Assessment>>(`/members/${memberId}/assessments`, data)
    return extractApiData(response, '평가 등록에 실패했습니다.')
  },

  async update(memberId: string, assessmentId: string, data: Partial<Assessment>) {
    const response = await api.put<ApiResponse<Assessment>>(`/members/${memberId}/assessments/${assessmentId}`, data)
    return extractApiData(response, '평가 수정에 실패했습니다.')
  },
}
