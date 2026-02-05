import { api } from './api'
import { extractApiData } from '@/utils/apiResponse'
import type {
  ApiResponse,
  WorkoutRecord,
  MajorExercisesOneRepMaxResponse,
  OneRepMax,
  WorkoutVolume,
  TrendData,
} from '@/types'

export const workoutRecordsService = {
  // 현재 로그인한 유저의 기록 조회
  async getMyAll(page = 1, pageSize = 10, startDate?: string, endDate?: string) {
    const response = await api.get<ApiResponse<{ records: WorkoutRecord[]; total: number }>>(
      '/workout-records',
      { params: { page, pageSize, startDate, endDate } }
    )
    return extractApiData(response, '운동 기록을 불러올 수 없습니다.')
  },

  // 현재 로그인한 유저의 기록 생성
  async createMy(data: {
    exerciseName: string
    bodyPart: string
    weight: number
    reps: number
    sets: number
    workoutDate: string
  }) {
    const response = await api.post<ApiResponse<WorkoutRecord>>('/workout-records', data)
    return extractApiData(response, '운동 기록을 저장할 수 없습니다.')
  },

  // 기존 회원 ID 기반 조회 (TRAINER/ADMIN용)
  async getAll(memberId: string, page = 1, pageSize = 10, startDate?: string, endDate?: string) {
    const response = await api.get<ApiResponse<{ records: WorkoutRecord[]; total: number }>>(
      `/members/${memberId}/workout-records`,
      { params: { page, pageSize, startDate, endDate } }
    )
    return extractApiData(response, '회원의 운동 기록을 불러올 수 없습니다.')
  },

  async getById(memberId: string, recordId: string) {
    const response = await api.get<ApiResponse<WorkoutRecord>>(
      `/members/${memberId}/workout-records/${recordId}`
    )
    return extractApiData(response, '운동 기록 상세 정보를 불러올 수 없습니다.')
  },

  async create(memberId: string, data: {
    exerciseName: string
    bodyPart: string
    weight: number
    reps: number
    sets: number
    workoutDate: string
    userId?: string
  }) {
    const response = await api.post<ApiResponse<WorkoutRecord>>(
      `/members/${memberId}/workout-records`,
      data
    )
    return extractApiData(response, '운동 기록을 저장할 수 없습니다.')
  },

  async update(memberId: string, recordId: string, data: Partial<WorkoutRecord>) {
    const response = await api.put<ApiResponse<WorkoutRecord>>(
      `/members/${memberId}/workout-records/${recordId}`,
      data
    )
    return extractApiData(response, '운동 기록을 수정할 수 없습니다.')
  },

  async delete(memberId: string, recordId: string) {
    await api.delete<ApiResponse<null>>(`/members/${memberId}/workout-records/${recordId}`)
  },

  async getCalendar(memberId: string, startDate: string, endDate: string) {
    const response = await api.get<ApiResponse<Array<{ date: string; hasWorkout: boolean; workoutCount: number }>>>(
      `/members/${memberId}/workout-records/calendar`,
      { params: { startDate, endDate } }
    )
    return extractApiData(response, '운동 캘린더를 불러올 수 없습니다.')
  },

  async getVolume(memberId: string, type: 'basic' | 'analysis' = 'basic', period?: 'WEEKLY' | 'MONTHLY', startDate?: string, endDate?: string) {
    const response = await api.get<ApiResponse<WorkoutVolume[] | { period: string; data: WorkoutVolume[] }>>(
      `/members/${memberId}/workout-records/volume`,
      { params: { type, period, startDate, endDate } }
    )
    return extractApiData(response, '운동 볼륨 데이터를 불러올 수 없습니다.')
  },

  async getOneRepMax(memberId: string, type: 'major' | 'estimate' = 'estimate'): Promise<MajorExercisesOneRepMaxResponse | OneRepMax | null> {
    try {
      const response = await api.get<ApiResponse<MajorExercisesOneRepMaxResponse | OneRepMax>>(
        `/members/${memberId}/workout-records/one-rep-max`,
        { params: { type } }
      )
      return extractApiData(response, '1RM 데이터를 불러올 수 없습니다.')
    } catch (error) {
      // 404 에러 (데이터 없음) 시 조용히 null 반환
      if (error && typeof error === 'object' && 'response' in error) {
        const httpError = error as { response?: { status?: number } }
        if (httpError.response?.status === 404) {
          // 개발 모드에서만 로그 출력
          if (import.meta.env.DEV) {
            console.debug('1RM 데이터가 없습니다:', memberId)
          }
          return null
        }
      }
      // 다른 에러는 개발 모드에서만 경고
      if (import.meta.env.DEV) {
        console.warn('1RM 데이터를 불러올 수 없습니다:', error)
      }
      return null
    }
  },

  async getOneRepMaxTrend(memberId: string, exerciseName?: string, startDate?: string, endDate?: string) {
    const response = await api.get<ApiResponse<TrendData>>(
      `/members/${memberId}/workout-records/one-rep-max-trend`,
      { params: { exerciseName, startDate, endDate } }
    )
    return extractApiData(response, '1RM 추세 데이터를 불러올 수 없습니다.')
  },

  async getVolumeTrend(memberId: string, startDate?: string, endDate?: string, bodyPart?: string) {
    const response = await api.get<ApiResponse<TrendData>>(
      `/members/${memberId}/workout-records/volume-trend`,
      { params: { startDate, endDate, bodyPart } }
    )
    return extractApiData(response, '볼륨 추세 데이터를 불러올 수 없습니다.')
  },

  async getTrends(memberId: string, type: 'oneRm' | 'volume', exerciseName?: string, startDate?: string, endDate?: string) {
    const response = await api.get<ApiResponse<TrendData>>(
      `/members/${memberId}/workout-records/trends`,
      { params: { type, exerciseName, startDate, endDate } }
    )
    return extractApiData(response, '추세 데이터를 불러올 수 없습니다.')
  },

  async getStrengthProgress(memberId: string, exerciseName?: string) {
    const response = await api.get<ApiResponse<Array<{ date: string; level: string; oneRepMax: number }>>>(
      `/members/${memberId}/workout-records/strength-progress`,
      { params: { exerciseName } }
    )
    return extractApiData(response, '근력 발달 데이터를 불러올 수 없습니다.')
  },
}
