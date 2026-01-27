import axios from 'axios'

/**
 * 백엔드 API 기본 URL
 * 
 * 환경 변수 우선순위:
 * 1. VITE_API_BASE_URL (환경 변수)
 * 2. 기본값: http://localhost:3001 (로컬 개발)
 * 
 * 배포 환경:
 * - Vercel: 환경 변수에서 VITE_API_BASE_URL 설정
 * - Render (백엔드): 별도 배포, 프론트엔드와 직접 import 없음
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터: 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터: 에러 처리
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
