import { api } from './api'
import type { ApiResponse, LoginRequest, RegisterRequest, AuthResponse } from '@/types'

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data)
    if (response.data.success && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken)
      localStorage.setItem('refreshToken', response.data.data.refreshToken)
      return response.data.data
    }
    throw new Error(response.data.message || '로그인 실패')
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data)
    if (response.data.success && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken)
      localStorage.setItem('refreshToken', response.data.data.refreshToken)
      return response.data.data
    }
    throw new Error(response.data.message || '회원가입 실패')
  },

  async logout(): Promise<void> {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('Refresh token not found')
    }
    const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', {
      refreshToken,
    })
    if (response.data.success && response.data.data) {
      localStorage.setItem('accessToken', response.data.data.accessToken)
      return response.data.data.accessToken
    }
    throw new Error('토큰 갱신 실패')
  },

  getCurrentUser() {
    const token = localStorage.getItem('accessToken')
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload
    } catch {
      return null
    }
  },

  async updateProfile(data: { name?: string; email?: string; password?: string }): Promise<AuthResponse['user']> {
    const response = await api.put<ApiResponse<AuthResponse['user']>>('/auth/profile', data)
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    throw new Error(response.data.message || '프로필 업데이트 실패')
  },
}
