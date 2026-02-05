import { api } from './api'
import { extractApiData } from '@/utils/apiResponse'
import type { ApiResponse, InjuryHistory, InjuryRestriction } from '@/types'

export const injuriesService = {
  async getAll(memberId: string) {
    const response = await api.get<ApiResponse<{ injuries: InjuryHistory[]; total: number }>>(`/members/${memberId}/injuries`)
    return extractApiData(response, '부상 이력을 불러올 수 없습니다.')
  },

  async getById(memberId: string, injuryId: string) {
    const response = await api.get<ApiResponse<InjuryHistory>>(`/members/${memberId}/injuries/${injuryId}`)
    return extractApiData(response, '부상 이력 정보를 불러올 수 없습니다.')
  },

  async create(memberId: string, data: { date: string; description: string }) {
    const response = await api.post<ApiResponse<InjuryHistory>>(`/members/${memberId}/injuries`, data)
    return extractApiData(response, '부상 이력 등록에 실패했습니다.')
  },

  async update(memberId: string, injuryId: string, data: { date?: string; description?: string }) {
    const response = await api.put<ApiResponse<InjuryHistory>>(`/members/${memberId}/injuries/${injuryId}`, data)
    return extractApiData(response, '부상 이력 수정에 실패했습니다.')
  },

  async createRestriction(memberId: string, injuryId: string, data: { restrictedCategory: string }) {
    const response = await api.post<ApiResponse<InjuryRestriction>>(
      `/members/${memberId}/injuries/${injuryId}/restrictions`,
      data
    )
    return extractApiData(response, '평가 제한 설정에 실패했습니다.')
  },
}
