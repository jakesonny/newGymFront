import { api } from './api'
import { extractApiData } from '@/utils/apiResponse'
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
    >('/members', { params: { page, pageSize, _: Date.now() } })
    const data = extractApiData(response, '회원 목록을 불러올 수 없습니다.')
    return { data: data.members, total: data.total, page: data.page, pageSize: data.pageSize }
  },

  async getById(memberId: string) {
    const response = await api.get<ApiResponse<Member>>(`/members/${memberId}`)
    return extractApiData(response, '회원 정보를 불러올 수 없습니다.')
  },

  async create(data: CreateMemberDto) {
    const response = await api.post<ApiResponse<Member>>('/members', data)
    return extractApiData(response, '회원 등록에 실패했습니다.')
  },

  async createFull(data: CreateMemberFullDto) {
    const response = await api.post<ApiResponse<{ member: Member; membership?: Membership }>>('/members/full', data)
    return extractApiData(response, '회원 등록에 실패했습니다.')
  },

  async update(memberId: string, data: Partial<CreateMemberDto>) {
    const response = await api.put<ApiResponse<Member>>(`/members/${memberId}`, data)
    return extractApiData(response, '회원 정보 수정에 실패했습니다.')
  },

  async delete(memberId: string) {
    await api.delete<ApiResponse<null>>(`/members/${memberId}`)
  },

  async getDashboard(memberId: string) {
    const response = await api.get<ApiResponse<Dashboard>>(`/members/${memberId}/dashboard`)
    return extractApiData(response, '대시보드 데이터를 불러올 수 없습니다.')
  },

  async getGoalAnalyst(memberId: string) {
    const response = await api.get<ApiResponse<GoalAnalyst>>(`/members/${memberId}/goal-analyst`)
    return extractApiData(response, '골 애널리스트 데이터를 불러올 수 없습니다.')
  },

  async getGoal(memberId: string) {
    const response = await api.get<ApiResponse<Goal>>(`/members/${memberId}/goals`)
    return extractApiData(response, '목표 정보를 불러올 수 없습니다.')
  },

  async createGoal(memberId: string, data: { goalType: string; targetValue: number; trainerComment?: string }) {
    const response = await api.post<ApiResponse<Goal>>(`/members/${memberId}/goals`, data)
    return extractApiData(response, '목표 등록에 실패했습니다.')
  },

  async updateGoal(memberId: string, data: { progress?: number; trainerComment?: string; completedSessions?: number }) {
    const response = await api.put<ApiResponse<Goal>>(`/members/${memberId}/goals`, data)
    return extractApiData(response, '목표 수정에 실패했습니다.')
  },

  async deleteGoal(memberId: string) {
    await api.delete<ApiResponse<null>>(`/members/${memberId}/goals`)
  },
}
