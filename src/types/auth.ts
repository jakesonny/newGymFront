export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  role?: 'ADMIN' | 'TRAINER' | 'MEMBER'
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    name: string
    role: 'ADMIN' | 'TRAINER' | 'MEMBER'
  }
}
