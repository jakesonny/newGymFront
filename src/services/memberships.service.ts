import { api } from './api'
import type { ApiResponse, Membership, PTUsage } from '@/types'

export const membershipsService = {
  async getMembership(memberId: string) {
    const response = await api.get<ApiResponse<Membership>>(`/members/${memberId}/memberships`)
    return response.data.data
  },

  async createMembership(memberId: string, data: Partial<Membership>) {
    const response = await api.post<ApiResponse<Membership>>(`/members/${memberId}/memberships`, data)
    return response.data.data
  },

  async updateMembership(memberId: string, membershipId: string, data: Partial<Membership>) {
    const response = await api.put<ApiResponse<Membership>>(
      `/members/${memberId}/memberships/${membershipId}`,
      data
    )
    return response.data.data
  },

  async deleteMembership(memberId: string, membershipId: string) {
    await api.delete<ApiResponse<null>>(`/members/${memberId}/memberships/${membershipId}`)
  },

  async getPTUsage(memberId: string) {
    const response = await api.get<ApiResponse<PTUsage>>(`/members/${memberId}/memberships/pt-count`)
    return response.data.data
  },

  async updatePTUsage(memberId: string, data: { totalCount: number; usedCount?: number }) {
    const response = await api.post<ApiResponse<PTUsage>>(`/members/${memberId}/memberships/pt-count`, data)
    return response.data.data
  },
}
