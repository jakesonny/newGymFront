import { api } from './api'
import type {
  ApiResponse,
  Member,
  CreateMemberDto,
  CreateMemberFullDto,
  Membership,
  Goal,
  Dashboard,
  GoalAnalyst,
} from '@/types'

export const membersService = {
  async getAll(page = 1, pageSize = 10) {
    const response = await api.get<
      ApiResponse<{ members: Member[]; total: number; page: number; pageSize: number }>
    >('/members', {
      params: { page, pageSize, _: Date.now() },
    })
    const result = response.data?.data
    if (!result?.members) {
      throw new Error('회원 목록 응답 형식이 올바르지 않습니다.')
    }
    return {
      data: result.members,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    }
  },

  async getById(memberId: string) {
    const response = await api.get<ApiResponse<Member>>(`/members/${memberId}`)
    if (!response.data?.data) {
      throw new Error('회원 정보를 불러올 수 없습니다.')
    }
    return response.data.data
  },

  async create(data: CreateMemberDto) {
    const response = await api.post<ApiResponse<Member>>('/members', data)
    return response.data.data
  },

  async createFull(data: CreateMemberFullDto) {
    const response = await api.post<ApiResponse<{ member: Member; membership?: Membership }>>(
      '/members/full',
      data
    )
    return response.data.data
  },

  async update(memberId: string, data: Partial<CreateMemberDto>) {
    const response = await api.put<ApiResponse<Member>>(`/members/${memberId}`, data)
    return response.data.data
  },

  async delete(memberId: string) {
    await api.delete<ApiResponse<null>>(`/members/${memberId}`)
  },

  async getDashboard(memberId: string) {
    const response = await api.get<ApiResponse<Dashboard>>(`/members/${memberId}/dashboard`)
    if (!response.data?.data) {
      throw new Error('대시보드 데이터를 불러올 수 없습니다.')
    }
    return response.data.data
  },

  async getGoalAnalyst(memberId: string) {
    const response = await api.get<ApiResponse<GoalAnalyst>>(`/members/${memberId}/goal-analyst`)
    if (!response.data?.data) {
      throw new Error('골 애널리스트 데이터를 불러올 수 없습니다.')
    }
    return response.data.data
  },

  async getGoal(memberId: string) {
    const response = await api.get<ApiResponse<Goal>>(`/members/${memberId}/goals`)
    return response.data.data
  },

  async createGoal(memberId: string, data: { goalType: string; targetValue: number; trainerComment?: string }) {
    const response = await api.post<ApiResponse<Goal>>(`/members/${memberId}/goals`, data)
    return response.data.data
  },

  async updateGoal(memberId: string, data: { progress?: number; trainerComment?: string; completedSessions?: number }) {
    const response = await api.put<ApiResponse<Goal>>(`/members/${memberId}/goals`, data)
    return response.data.data
  },

  async deleteGoal(memberId: string) {
    await api.delete<ApiResponse<null>>(`/members/${memberId}/goals`)
  },
}
