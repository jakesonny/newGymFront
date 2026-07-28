import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Card, ErrorMessage } from '@/components'
import { getErrorMessage } from '@/utils/errorHandler'
import { getHomeRouteForRole } from '@/utils/roleHome'
import './LoginPage.css'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const loggedInUser = await login(email, password)
      navigate(getHomeRouteForRole(loggedInUser.role))
    } catch (err) {
      setError(getErrorMessage(err, '로그인에 실패했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 포트폴리오 데모용 관리자 계정으로 즉시 로그인한다.
   * 면접관이 회원가입 없이 완성된 관리자/트레이너 대시보드를 바로 볼 수 있게 하기 위한
   * 정식 기능(숨김 백도어 아님) — 실제 로그인 API를 그대로 호출하므로 비밀번호 검증을 거친다.
   */
  const handleDemoLogin = async () => {
    setError('')
    setEmail('admin')
    setPassword('admin')
    setIsDemoLoading(true)

    try {
      const loggedInUser = await login('admin', 'admin')
      navigate(getHomeRouteForRole(loggedInUser.role))
    } catch (err) {
      setError(getErrorMessage(err, '데모 로그인에 실패했습니다.'))
    } finally {
      setIsDemoLoading(false)
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
              placeholder="이메일을 입력하세요"
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

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={isDemoLoading}
              className="login-button"
            >
              로그인
            </Button>

            <div className="login-divider">
              <span>또는</span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="lg"
              isLoading={isDemoLoading}
              disabled={isLoading}
              onClick={handleDemoLogin}
              className="login-demo-button"
            >
              <Sparkles size={18} />
              회원가입 없이 둘러보기
            </Button>
            <p className="login-demo-hint">회원가입 없이 체험해 볼 수 있습니다.</p>

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
