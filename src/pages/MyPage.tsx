import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Shield, LogOut, Save, Lock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Layout, Card, Input, Button, ErrorMessage } from '@/components'
import { getErrorMessage } from '@/utils/errorHandler'
import { authService } from '@/services/auth.service'
import './MyPage.css'

export function MyPage() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const roleLabels: Record<string, string> = {
    ADMIN: '관리자',
    TRAINER: '트레이너',
    MEMBER: '회원',
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleSaveProfile = async () => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const updatedUser = await authService.updateProfile({
        name: profileData.name,
      })
      
      // AuthContext의 user 상태 업데이트
      updateUser(updatedUser)
      
      setSuccess('프로필이 성공적으로 업데이트되었습니다.')
      setIsEditing(false)
    } catch (err) {
      setError(getErrorMessage(err, '프로필 업데이트에 실패했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    setError('')
    setSuccess('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }

    if (!passwordData.currentPassword) {
      setError('현재 비밀번호를 입력해주세요.')
      return
    }

    setIsLoading(true)

    try {
      await authService.updateProfile({
        password: passwordData.newPassword,
      })
      
      setSuccess('비밀번호가 성공적으로 변경되었습니다.')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setIsChangingPassword(false)
    } catch (err) {
      setError(getErrorMessage(err, '비밀번호 변경에 실패했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      setError(getErrorMessage(err, '로그아웃에 실패했습니다.'))
    }
  }

  return (
    <Layout>
      <div className="mypage">
        <div className="mypage-header">
          <h1>마이페이지</h1>
          <p>계정 정보를 관리하고 설정을 변경할 수 있습니다.</p>
        </div>

        <div className="mypage-content">
          {/* 프로필 정보 카드 */}
          <Card className="profile-card">
            {!isEditing ? (
              <div className="card-header-with-button">
                <div className="card-header-left">
                  <div className="card-header-icon-compact">
                    <User size={20} />
                  </div>
                  <div>
                    <h2>프로필 정보</h2>
                  </div>
                </div>
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  프로필 수정
                </Button>
              </div>
            ) : (
              <div className="card-header-section-compact">
                <div className="card-header-icon-compact">
                  <User size={20} />
                </div>
                <div>
                  <h2>프로필 정보</h2>
                </div>
              </div>
            )}

            {error && <ErrorMessage message={error} />}
            {success && <div className="success-message">{success}</div>}

            <div className="profile-info-section">
              <div className="info-item">
                <label className="info-label">
                  <Mail size={16} />
                  이메일
                </label>
                <div className="info-value">{user?.email || '-'}</div>
                <p className="info-description">이메일은 변경할 수 없습니다.</p>
              </div>

              <div className="info-item">
                <label className="info-label">
                  <User size={16} />
                  이름
                </label>
                {isEditing ? (
                  <Input
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    placeholder="이름을 입력하세요"
                  />
                ) : (
                  <div className="info-value">{user?.name || '-'}</div>
                )}
              </div>

              <div className="info-item">
                <label className="info-label">
                  <Shield size={16} />
                  역할
                </label>
                <div className="info-value role-badge">
                  {roleLabels[user?.role || 'MEMBER'] || user?.role || '-'}
                </div>
              </div>

              {isEditing && (
                <div className="profile-actions-compact">
                  <Button
                    variant="primary"
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                  >
                    <Save size={16} />
                    저장
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false)
                      setProfileData({
                        name: user?.name || '',
                        email: user?.email || '',
                      })
                      setError('')
                      setSuccess('')
                    }}
                  >
                    취소
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* 비밀번호 변경 및 로그아웃 - 한 줄 배치 */}
          <div className="password-logout-row">
            {/* 비밀번호 변경 카드 */}
            <Card className="password-card">
              {!isChangingPassword ? (
                <div className="card-header-with-button">
                  <div className="card-header-left">
                    <div className="card-header-icon-compact">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h2>비밀번호 변경</h2>
                    </div>
                  </div>
                  <Button variant="primary" onClick={() => setIsChangingPassword(true)}>
                    변경
                  </Button>
                </div>
              ) : (
                <>
                  <div className="card-header-section-compact">
                    <div className="card-header-icon-compact">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h2>비밀번호 변경</h2>
                    </div>
                  </div>
                  <div className="password-change-section">
                    <div className="info-item">
                      <Input
                        name="currentPassword"
                        type="password"
                        label="현재 비밀번호"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="현재 비밀번호를 입력하세요"
                      />
                    </div>
                    <div className="info-item">
                      <Input
                        name="newPassword"
                        type="password"
                        label="새 비밀번호"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="새 비밀번호를 입력하세요"
                      />
                    </div>
                    <div className="info-item">
                      <Input
                        name="confirmPassword"
                        type="password"
                        label="새 비밀번호 확인"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="새 비밀번호를 다시 입력하세요"
                      />
                    </div>
                    <div className="profile-actions-compact">
                      <Button
                        variant="primary"
                        onClick={handleChangePassword}
                        disabled={isLoading}
                      >
                        비밀번호 변경
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setIsChangingPassword(false)
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                          })
                          setError('')
                          setSuccess('')
                        }}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>

            {/* 로그아웃 카드 */}
            <Card className="logout-card">
              <div className="logout-button-container">
                <Button variant="danger" onClick={handleLogout}>
                  <LogOut size={16} />
                  로그아웃
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
