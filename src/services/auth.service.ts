import { api } from './api'
import { extractApiData } from '@/utils/apiResponse'
import type { ApiResponse, LoginRequest, RegisterRequest, AuthResponse } from '@/types'

function setAuthTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('refreshToken', refreshToken)
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data)
    const result = extractApiData(response, '로그인 실패')
    setAuthTokens(result.accessToken, result.refreshToken)
    return result
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data)
    const result = extractApiData(response, '회원가입 실패')
    setAuthTokens(result.accessToken, result.refreshToken)
    return result
  },

  async logout(): Promise<void> {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) throw new Error('Refresh token not found')
    const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken })
    const result = extractApiData(response, '토큰 갱신 실패')
    localStorage.setItem('accessToken', result.accessToken)
    return result.accessToken
  },

  getCurrentUser() {
    const token = localStorage.getItem('accessToken')
    if (!token) return null
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch {
      return null
    }
  },

  async updateProfile(data: { name?: string; email?: string; password?: string }): Promise<AuthResponse['user']> {
    const response = await api.put<ApiResponse<AuthResponse['user']>>('/auth/profile', data)
    return extractApiData(response, '프로필 업데이트 실패')
  },
}
