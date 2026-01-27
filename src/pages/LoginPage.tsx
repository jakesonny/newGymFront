import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Card, ErrorMessage } from '@/components'
import { getErrorMessage } from '@/utils/errorHandler'
import './LoginPage.css'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err, '로그인에 실패했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <span>G</span>
          </div>
          <h1 className="login-title">헬스장 회원관리 시스템</h1>
          <p className="login-subtitle">관리자 로그인</p>
        </div>

        <Card className="login-card">
          <form onSubmit={handleSubmit} className="login-form">
            {error && <ErrorMessage message={error} />}
            
            <Input
              type="text"
              label="이메일"
              placeholder="이메일을 입력하세요 (개발용: qwer 등 허용)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <Input
              type="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="login-button">
              로그인
            </Button>

            <div className="login-footer">
              <span>계정이 없으신가요?</span>
              <Link to="/register" className="login-link">
                회원가입
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
