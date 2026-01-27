import { api } from './api'
import type { ApiResponse, InjuryHistory, InjuryRestriction } from '@/types'

export const injuriesService = {
  async getAll(memberId: string) {
    const response = await api.get<ApiResponse<{ injuries: InjuryHistory[]; total: number }>>(
      `/members/${memberId}/injuries`
    )
    return response.data.data
  },

  async getById(memberId: string, injuryId: string) {
    const response = await api.get<ApiResponse<InjuryHistory>>(
      `/members/${memberId}/injuries/${injuryId}`
    )
    return response.data.data
  },

  async create(memberId: string, data: { date: string; description: string }) {
    const response = await api.post<ApiResponse<InjuryHistory>>(`/members/${memberId}/injuries`, data)
    return response.data.data
  },

  async update(memberId: string, injuryId: string, data: { date?: string; description?: string }) {
    const response = await api.put<ApiResponse<InjuryHistory>>(
      `/members/${memberId}/injuries/${injuryId}`,
      data
    )
    return response.data.data
  },

  async createRestriction(memberId: string, injuryId: string, data: { restrictedCategory: string }) {
    const response = await api.post<ApiResponse<InjuryRestriction>>(
      `/members/${memberId}/injuries/${injuryId}/restrictions`,
      data
    )
    return response.data.data
  },
}
