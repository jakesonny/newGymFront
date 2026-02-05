import { api } from './api'
import { extractApiData } from '@/utils/apiResponse'
import type { ApiResponse } from '@/types'

export interface Exercise {
  id: string
  name: string
  nameKorean: string
  bodyPart: string
  equipment?: string
  description?: string
}

export const exercisesService = {
  async getAll(params?: { bodyPart?: string; search?: string; page?: number; pageSize?: number }) {
    const response = await api.get<ApiResponse<{ exercises: Exercise[]; total: number }>>('/exercises', { params })
    return extractApiData(response, '운동 목록을 불러올 수 없습니다.')
  },

  async getById(exerciseId: string) {
    const response = await api.get<ApiResponse<Exercise>>(`/exercises/${exerciseId}`)
    return extractApiData(response, '운동 정보를 불러올 수 없습니다.')
  },
}
