import { api } from './api'
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
  async getAll(params?: {
    bodyPart?: string
    search?: string
    page?: number
    pageSize?: number
  }) {
    const response = await api.get<ApiResponse<{ exercises: Exercise[]; total: number }>>('/exercises', {
      params,
    })
    return response.data.data
  },

  async getById(exerciseId: string) {
    const response = await api.get<ApiResponse<Exercise>>(`/exercises/${exerciseId}`)
    return response.data.data
  },
}
