import { api } from './api'
import { extractApiData } from '@/utils/apiResponse'
import type { ApiResponse, WorkoutRoutine } from '@/types'

export const workoutRoutinesService = {
  async getCommonRoutines(startDate?: string, endDate?: string, isCompleted?: boolean) {
    const response = await api.get<ApiResponse<{ routines: WorkoutRoutine[]; total: number }>>(
      '/workout-routines',
      { params: { startDate, endDate, isCompleted } }
    )
    return extractApiData(response, '운동 루틴 목록을 불러올 수 없습니다.')
  },

  async getTodayCommonRoutine() {
    const response = await api.get<ApiResponse<WorkoutRoutine>>('/workout-routines/today')
    return extractApiData(response, '오늘의 루틴을 불러올 수 없습니다.')
  },

  async getCommonRoutineById(routineId: string) {
    const response = await api.get<ApiResponse<WorkoutRoutine>>(`/workout-routines/${routineId}`)
    return extractApiData(response, '루틴 정보를 불러올 수 없습니다.')
  },

  async createCommonRoutine(data: {
    routineDate: string
    exercises: Array<{ exerciseName: string; sets: number; reps: number; weight?: number; restTime?: number; notes?: string }>
  }) {
    const response = await api.post<ApiResponse<WorkoutRoutine>>('/workout-routines', data)
    return extractApiData(response, '루틴 등록에 실패했습니다.')
  },

  async updateCommonRoutine(routineId: string, data: Partial<WorkoutRoutine>) {
    const response = await api.put<ApiResponse<WorkoutRoutine>>(`/workout-routines/${routineId}`, data)
    return extractApiData(response, '루틴 수정에 실패했습니다.')
  },

  async deleteCommonRoutine(routineId: string) {
    await api.delete<ApiResponse<null>>(`/workout-routines/${routineId}`)
  },

  async getMemberRoutines(memberId: string, startDate?: string, endDate?: string, isCompleted?: boolean) {
    const response = await api.get<ApiResponse<{ routines: WorkoutRoutine[]; total: number }>>(
      `/members/${memberId}/workout-routines`,
      { params: { startDate, endDate, isCompleted } }
    )
    return extractApiData(response, '회원 루틴 목록을 불러올 수 없습니다.')
  },

  async getTodayMemberRoutine(memberId: string) {
    const response = await api.get<ApiResponse<WorkoutRoutine>>(`/members/${memberId}/workout-routines/today`)
    return extractApiData(response, '오늘의 루틴을 불러올 수 없습니다.')
  },

  async createMemberRoutine(memberId: string, data: {
    routineDate: string
    exercises: Array<{ exerciseName: string; sets: number; reps: number; weight?: number; restTime?: number; notes?: string }>
  }) {
    const response = await api.post<ApiResponse<WorkoutRoutine>>(`/members/${memberId}/workout-routines`, data)
    return extractApiData(response, '루틴 등록에 실패했습니다.')
  },

  async updateMemberRoutine(memberId: string, routineId: string, data: Partial<WorkoutRoutine>) {
    const response = await api.put<ApiResponse<WorkoutRoutine>>(`/members/${memberId}/workout-routines/${routineId}`, data)
    return extractApiData(response, '루틴 수정에 실패했습니다.')
  },

  async completeMemberRoutine(memberId: string, routineId: string) {
    const response = await api.put<ApiResponse<WorkoutRoutine>>(
      `/members/${memberId}/workout-routines/${routineId}/complete`
    )
    return extractApiData(response, '루틴 완료 처리에 실패했습니다.')
  },

  async deleteMemberRoutine(memberId: string, routineId: string) {
    await api.delete<ApiResponse<null>>(`/members/${memberId}/workout-routines/${routineId}`)
  },

  async suggestWeight(memberId: string, exerciseName: string, reps: number) {
    const response = await api.get<ApiResponse<{ suggestedWeight: number; strengthLevel: string }>>(
      `/members/${memberId}/workout-records/suggest-weight`,
      { params: { exerciseName, reps } }
    )
    return extractApiData(response, '추천 무게를 불러올 수 없습니다.')
  },
}
