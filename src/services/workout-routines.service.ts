import { api } from './api'
import type { ApiResponse, WorkoutRoutine } from '@/types'

export const workoutRoutinesService = {
  async getCommonRoutines(startDate?: string, endDate?: string, isCompleted?: boolean) {
    const response = await api.get<ApiResponse<{ routines: WorkoutRoutine[]; total: number }>>(
      '/workout-routines',
      { params: { startDate, endDate, isCompleted } }
    )
    return response.data.data
  },

  async getTodayCommonRoutine() {
    const response = await api.get<ApiResponse<WorkoutRoutine>>('/workout-routines/today')
    return response.data.data
  },

  async getCommonRoutineById(routineId: string) {
    const response = await api.get<ApiResponse<WorkoutRoutine>>(`/workout-routines/${routineId}`)
    return response.data.data
  },

  async createCommonRoutine(data: {
    routineDate: string
    exercises: Array<{
      exerciseName: string
      sets: number
      reps: number
      weight?: number
      restTime?: number
      notes?: string
    }>
  }) {
    const response = await api.post<ApiResponse<WorkoutRoutine>>('/workout-routines', data)
    return response.data.data
  },

  async updateCommonRoutine(routineId: string, data: Partial<WorkoutRoutine>) {
    const response = await api.put<ApiResponse<WorkoutRoutine>>(`/workout-routines/${routineId}`, data)
    return response.data.data
  },

  async deleteCommonRoutine(routineId: string) {
    await api.delete<ApiResponse<null>>(`/workout-routines/${routineId}`)
  },

  // 회원별 루틴
  async getMemberRoutines(memberId: string, startDate?: string, endDate?: string, isCompleted?: boolean) {
    const response = await api.get<ApiResponse<{ routines: WorkoutRoutine[]; total: number }>>(
      `/members/${memberId}/workout-routines`,
      { params: { startDate, endDate, isCompleted } }
    )
    return response.data.data
  },

  async getTodayMemberRoutine(memberId: string) {
    const response = await api.get<ApiResponse<WorkoutRoutine>>(`/members/${memberId}/workout-routines/today`)
    return response.data.data
  },

  async createMemberRoutine(memberId: string, data: {
    routineDate: string
    exercises: Array<{
      exerciseName: string
      sets: number
      reps: number
      weight?: number
      restTime?: number
      notes?: string
    }>
  }) {
    const response = await api.post<ApiResponse<WorkoutRoutine>>(
      `/members/${memberId}/workout-routines`,
      data
    )
    return response.data.data
  },

  async updateMemberRoutine(memberId: string, routineId: string, data: Partial<WorkoutRoutine>) {
    const response = await api.put<ApiResponse<WorkoutRoutine>>(
      `/members/${memberId}/workout-routines/${routineId}`,
      data
    )
    return response.data.data
  },

  async completeMemberRoutine(memberId: string, routineId: string) {
    const response = await api.put<ApiResponse<WorkoutRoutine>>(
      `/members/${memberId}/workout-routines/${routineId}/complete`
    )
    return response.data.data
  },

  async deleteMemberRoutine(memberId: string, routineId: string) {
    await api.delete<ApiResponse<null>>(`/members/${memberId}/workout-routines/${routineId}`)
  },

  async suggestWeight(memberId: string, exerciseName: string, reps: number) {
    const response = await api.get<ApiResponse<{ suggestedWeight: number; strengthLevel: string }>>(
      `/members/${memberId}/workout-records/suggest-weight`,
      { params: { exerciseName, reps } }
    )
    return response.data.data
  },
}
