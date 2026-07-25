import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Input, Card, ErrorMessage } from '@/components'
import { getErrorMessage } from '@/utils/errorHandler'
import './RegisterPage.css'

export function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    // 개발 편의를 위해 비밀번호 길이 제한 제거
    // if (formData.password.length < 6) {
    //   setError('비밀번호는 최소 6자 이상이어야 합니다.')
    //   return
    // }

    setIsLoading(true)

    try {
      await register(formData.email, formData.password, formData.name)
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err, '회원가입에 실패했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <div className="register-logo">
            <span>G</span>
          </div>
          <h1 className="register-title">회원가입</h1>
          <p className="register-subtitle">새 계정을 만드세요</p>
        </div>

        <Card className="register-card">
          <form onSubmit={handleSubmit} className="register-form">
            {error && <ErrorMessage message={error} />}

            <Input
              type="text"
              name="name"
              label="이름"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Input
              type="text"
              name="email"
              label="이메일"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />

            <Input
              type="password"
              name="password"
              label="비밀번호"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />

            <Input
              type="password"
              name="confirmPassword"
              label="비밀번호 확인"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="register-button"
            >
              회원가입
            </Button>

            <div className="register-footer">
              <span>이미 계정이 있으신가요?</span>
              <Link to="/login" className="register-link">
                로그인
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
