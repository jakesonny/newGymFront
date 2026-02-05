import { api } from './api'
import { extractApiData } from '@/utils/apiResponse'
import type { ApiResponse, Membership, PTUsage } from '@/types'

export const membershipsService = {
  async getMembership(memberId: string) {
    const response = await api.get<ApiResponse<Membership>>(`/members/${memberId}/memberships`)
    return extractApiData(response, '회원권 정보를 불러올 수 없습니다.')
  },

  async createMembership(memberId: string, data: Partial<Membership>) {
    const response = await api.post<ApiResponse<Membership>>(`/members/${memberId}/memberships`, data)
    return extractApiData(response, '회원권 등록에 실패했습니다.')
  },

  async updateMembership(memberId: string, membershipId: string, data: Partial<Membership>) {
    const response = await api.put<ApiResponse<Membership>>(
      `/members/${memberId}/memberships/${membershipId}`,
      data
    )
    return extractApiData(response, '회원권 수정에 실패했습니다.')
  },

  async deleteMembership(memberId: string, membershipId: string) {
    await api.delete<ApiResponse<null>>(`/members/${memberId}/memberships/${membershipId}`)
  },

  async getPTUsage(memberId: string) {
    const response = await api.get<ApiResponse<PTUsage>>(`/members/${memberId}/memberships/pt-count`)
    return extractApiData(response, 'PT 횟수 정보를 불러올 수 없습니다.')
  },

  async updatePTUsage(memberId: string, data: { totalCount: number; usedCount?: number }) {
    const response = await api.post<ApiResponse<PTUsage>>(`/members/${memberId}/memberships/pt-count`, data)
    return extractApiData(response, 'PT 횟수 업데이트에 실패했습니다.')
  },
}
