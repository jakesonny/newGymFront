import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { authService } from '@/services/auth.service'
import type { AuthResponse } from '@/types'

interface AuthContextType {
  user: AuthResponse['user'] | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: AuthResponse['user']) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser({
        id: currentUser.id || currentUser.sub || '',
        email: currentUser.email || '',
        name: currentUser.name || '',
        role: currentUser.role || 'MEMBER',
      })
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    setUser(response.user)
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    const response = await authService.register({ email, password, name })
    setUser(response.user)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
  }, [])

  const updateUser = useCallback((updatedUser: AuthResponse['user']) => {
    setUser(updatedUser)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
