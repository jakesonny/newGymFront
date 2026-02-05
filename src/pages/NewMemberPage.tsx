import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, User } from 'lucide-react'
import { membersService } from '@/services/members.service'
import { Layout, Card, Button, Input, ErrorMessage, PageHeader, StepIndicator } from '@/components'
import { getErrorMessage } from '@/utils/errorHandler'
import type { CreateMemberFullDto } from '@/types'
import './NewMemberPage.css'

type MembershipType = 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'LIFETIME' | 'PT_PACKAGE'

export function NewMemberPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState<CreateMemberFullDto>({
    name: '',
    phone: '',
    email: '',
    joinDate: new Date().toISOString().split('T')[0],
    birthDate: '',
    gender: undefined,
    height: undefined,
    weight: undefined,
    status: 'ACTIVE',
    membership: undefined,
    initialMeasurement: undefined,
  })

  // 회원권 유형에 따른 분류
  const membershipType = formData.membership?.membershipType as MembershipType | undefined
  const isPTMembership = membershipType === 'PT_PACKAGE'
  const isRegularMembership = membershipType && ['MONTHLY', 'QUARTERLY', 'YEARLY', 'LIFETIME'].includes(membershipType)

  // 일반 회원권 만료일 자동 계산
  const calculateExpiryDate = (purchaseDate: string, membershipType: MembershipType): string => {
    if (!purchaseDate) return ''
    
    const purchase = new Date(purchaseDate)
    const expiry = new Date(purchase)

    switch (membershipType) {
      case 'MONTHLY':
        expiry.setMonth(expiry.getMonth() + 1)
        break
      case 'QUARTERLY':
        expiry.setMonth(expiry.getMonth() + 3)
        break
      case 'YEARLY':
        expiry.setFullYear(expiry.getFullYear() + 1)
        break
      case 'LIFETIME':
        // 평생 회원권은 만료일 없음 (또는 매우 먼 미래)
        expiry.setFullYear(expiry.getFullYear() + 100)
        break
      default:
        return ''
    }

    return expiry.toISOString().split('T')[0]
  }

  // 전화번호 자동 하이픈 포맷팅
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    handleChange('phone', formatted)
  }

  const handleChange = (field: string, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMembershipChange = (field: string, value: string | number | undefined) => {
    const newMembership = { ...formData.membership, [field]: value } as CreateMemberFullDto['membership']
    
    if (!newMembership) return
    
    // 회원권 유형 변경 시 만료일 자동 계산
    if (field === 'membershipType' && value) {
      const purchaseDate = newMembership.purchaseDate || formData.joinDate
      const calculatedExpiry = calculateExpiryDate(purchaseDate, value as MembershipType)
      if (calculatedExpiry) {
        newMembership.expiryDate = calculatedExpiry
      }
    }
    
    // 구매일 변경 시 만료일 자동 재계산 (일반 회원권인 경우)
    if (field === 'purchaseDate' && membershipType && isRegularMembership) {
      const calculatedExpiry = calculateExpiryDate(value as string, membershipType)
      if (calculatedExpiry) {
        newMembership.expiryDate = calculatedExpiry
      }
    }

    setFormData((prev) => ({
      ...prev,
      membership: newMembership,
    }))
  }

  const handleMeasurementChange = (field: string, value: number | undefined) => {
    setFormData((prev) => ({
      ...prev,
      initialMeasurement: { ...prev.initialMeasurement, [field]: value } as CreateMemberFullDto['initialMeasurement'],
    }))
  }

  // 숫자 입력 검증 (음수와 0 방지)
  const handleNumberChange = (
    field: 'height' | 'weight',
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    if (value === '') {
      handleChange(field, undefined)
      return
    }
    
    const numValue = Number(value)
    if (numValue > 0) {
      handleChange(field, numValue)
    }
  }


  const handleNext = () => {
    if (step === 1) {
      // 필수 항목: 이름, 전화번호만 (이메일은 optional)
      if (!formData.name || !formData.phone) {
        setError('이름과 전화번호는 필수 항목입니다.')
        return
      }
      // 이메일 형식 검증 (입력된 경우에만)
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('올바른 이메일 형식이 아닙니다.')
        return
      }
    }
    if (step === 2) {
      // 회원권이 선택된 경우에만 검증
      if (formData.membership) {
        // PT 회원권인 경우 골타입 필수
        if (isPTMembership && !formData.membership.mainGoalType) {
          setError('PT 회원권은 목표 유형을 선택해야 합니다.')
          return
        }
        // PT 회원권인 경우 PT 총 횟수 권장 (선택사항이지만 입력 권장)
        if (isPTMembership && (!formData.membership.ptTotalCount || formData.membership.ptTotalCount <= 0)) {
          const confirm = window.confirm('PT 총 횟수가 입력되지 않았습니다. 계속 진행하시겠습니까?')
          if (!confirm) return
        }
        // 일반 회원권인 경우 만료일 필수
        if (isRegularMembership && !formData.membership.expiryDate) {
          setError('일반 회원권은 만료일이 필요합니다.')
          return
        }
        // 가격 검증
        if (!formData.membership.price || formData.membership.price <= 0) {
          setError('가격을 입력해주세요.')
          return
        }
      }
    }
    setError('')
    setStep(step + 1)
  }

  const handlePrev = () => {
    setError('')
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError('')

    try {
      await membersService.createFull(formData)
      navigate('/members')
    } catch (err) {
      setError(getErrorMessage(err, '회원 등록에 실패했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="new-member-page">
        <PageHeader
          title="신규 회원 등록"
          actions={<StepIndicator currentStep={step} totalSteps={3} />}
        />

        {error && <ErrorMessage message={error} />}

        <Card className="wizard-card">
          {step === 1 && (
            <div className="wizard-step">
              <div className="step-header">
                <User size={24} />
                <h2>기본 정보 및 프로그램 설정</h2>
              </div>

              <div className="form-grid">
                <Input
                  label="회원 성함"
                  placeholder="이름을 입력하세요"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />

                <div className="input-group">
                  <label className="input-label">
                    시작일 (Start Date)
                    <span className="input-required">*</span>
                  </label>
                  <div className="date-input-wrapper">
                    <Input
                      type="date"
                      value={formData.joinDate}
                      onChange={(e) => handleChange('joinDate', e.target.value)}
                      required
                    />
                    <Calendar className="date-icon" size={20} />
                  </div>
                </div>

                <Input
                  label="전화번호"
                  placeholder="010-1234-5678"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  required
                  maxLength={13}
                />

                <Input
                  label="이메일"
                  type="email"
                  placeholder="email@example.com (선택사항)"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value || undefined)}
                  helperText="이메일은 선택사항입니다. PT 회원이 아닌 경우 생략 가능합니다."
                />

                <div className="input-group">
                  <label className="input-label">성별</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="MALE"
                        checked={formData.gender === 'MALE'}
                        onChange={(e) => handleChange('gender', e.target.value as 'MALE' | 'FEMALE')}
                      />
                      <span>남성</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="gender"
                        value="FEMALE"
                        checked={formData.gender === 'FEMALE'}
                        onChange={(e) => handleChange('gender', e.target.value as 'MALE' | 'FEMALE')}
                      />
                      <span>여성</span>
                    </label>
                  </div>
                </div>

                <Input
                  label="생년월일"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                />

                <Input
                  label="키 (cm)"
                  type="number"
                  placeholder="입력하세요"
                  value={formData.height || ''}
                  onChange={(e) => handleNumberChange('height', e)}
                  min="1"
                  step="0.1"
                />

                <Input
                  label="몸무게 (kg)"
                  type="number"
                  placeholder="입력하세요"
                  value={formData.weight || ''}
                  onChange={(e) => handleNumberChange('weight', e)}
                  min="1"
                  step="0.1"
                />
              </div>

              {/* 프로그램 기간: PT 회원권일 때만 표시 */}
              {isPTMembership && (
                <div className="program-duration-section">
                  <label className="section-label">프로그램 기간 (Time-Box)</label>
                  <div className="duration-cards">
                    {[4, 8, 12].map((weeks) => (
                      <button
                        key={weeks}
                        type="button"
                        className={`duration-card ${formData.membership?.durationWeeks === weeks ? 'selected' : ''}`}
                        onClick={() => handleMembershipChange('durationWeeks', weeks as 4 | 8 | 12)}
                      >
                        <div className="duration-number">{weeks}주</div>
                        <div className="duration-label">집중 관리 프로그램</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="wizard-step">
              <div className="step-header">
                <h2>회원권 및 목표 설정</h2>
              </div>

              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">회원권 유형</label>
                  <select
                    className="input"
                    value={formData.membership?.membershipType || ''}
                    onChange={(e) => handleMembershipChange('membershipType', e.target.value)}
                  >
                    <option value="">선택하세요</option>
                    <optgroup label="일반 회원권">
                      <option value="MONTHLY">월간</option>
                      <option value="QUARTERLY">분기</option>
                      <option value="YEARLY">연간</option>
                      <option value="LIFETIME">평생</option>
                    </optgroup>
                    <optgroup label="PT 회원권">
                      <option value="PT_PACKAGE">PT 패키지</option>
                    </optgroup>
                  </select>
                </div>

                <Input
                  label="구매일"
                  type="date"
                  value={formData.membership?.purchaseDate || formData.joinDate}
                  onChange={(e) => handleMembershipChange('purchaseDate', e.target.value)}
                />

                {/* 만료일: 일반 회원권일 때만 표시 */}
                {isRegularMembership && (
                  <Input
                    label="만료일"
                    type="date"
                    value={formData.membership?.expiryDate || ''}
                    onChange={(e) => handleMembershipChange('expiryDate', e.target.value)}
                    helperText={membershipType === 'LIFETIME' ? '평생 회원권은 자동으로 설정됩니다' : '구매일 기준으로 자동 계산됩니다'}
                  />
                )}

                <Input
                  label="가격 (원)"
                  type="number"
                  placeholder="500000"
                  value={formData.membership?.price || ''}
                  onChange={(e) => handleMembershipChange('price', e.target.value ? Number(e.target.value) : undefined)}
                />

                {/* 골타입 관련 필드: PT 회원권일 때만 표시 */}
                {isPTMembership && (
                  <>
                    <div className="input-group">
                      <label className="input-label">
                        목표 유형
                        <span className="input-required">*</span>
                      </label>
                      <select
                        className="input"
                        value={formData.membership?.mainGoalType || ''}
                        onChange={(e) => handleMembershipChange('mainGoalType', e.target.value)}
                      >
                        <option value="">선택하세요</option>
                        <option value="WEIGHT_LOSS">체중 감량</option>
                        <option value="STRENGTH_UP">근력 상승</option>
                        <option value="ENDURANCE">체력 증진</option>
                        <option value="MAINTENANCE">유지</option>
                      </select>
                    </div>

                    {formData.membership?.mainGoalType && (
                      <>
                        <Input
                          label="목표 수치"
                          type="number"
                          placeholder="10"
                          value={formData.membership?.targetValue || ''}
                          onChange={(e) => handleMembershipChange('targetValue', e.target.value ? Number(e.target.value) : undefined)}
                        />

                        <Input
                          label="시작 수치"
                          type="number"
                          placeholder="80"
                          value={formData.membership?.startValue || formData.weight || ''}
                          onChange={(e) => handleMembershipChange('startValue', e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </>
                    )}

                    <Input
                      label="PT 총 횟수"
                      type="number"
                      placeholder="24"
                      value={formData.membership?.ptTotalCount || ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '') {
                          handleMembershipChange('ptTotalCount', undefined)
                        } else {
                          const numValue = Number(value)
                          if (numValue > 0) {
                            handleMembershipChange('ptTotalCount', numValue)
                          }
                        }
                      }}
                      min="1"
                      helperText="PT 회원권의 총 세션 횟수를 입력하세요. (선택사항)"
                    />
                  </>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="wizard-step">
              <div className="step-header">
                <h2>초기 측정값 입력</h2>
              </div>

              {/* PT 회원권이고 골타입이 선택된 경우에만 표시 */}
              {isPTMembership && formData.membership?.mainGoalType ? (
                <div className="form-grid">
                  {/* WEIGHT_LOSS 또는 MAINTENANCE: 체중만 */}
                  {(formData.membership.mainGoalType === 'WEIGHT_LOSS' || formData.membership.mainGoalType === 'MAINTENANCE') && (
                    <Input
                      label="체중 (kg)"
                      type="number"
                      placeholder="입력하세요"
                      value={formData.initialMeasurement?.weight || ''}
                      onChange={(e) => handleMeasurementChange('weight', e.target.value ? Number(e.target.value) : undefined)}
                      min="1"
                      step="0.1"
                    />
                  )}

                  {/* STRENGTH_UP: 빅3 1RM */}
                  {formData.membership.mainGoalType === 'STRENGTH_UP' && (
                    <>
                      <Input
                        label="벤치프레스 1RM (kg)"
                        type="number"
                        placeholder="입력하세요"
                        value={formData.initialMeasurement?.benchPress1RM || ''}
                        onChange={(e) => handleMeasurementChange('benchPress1RM', e.target.value ? Number(e.target.value) : undefined)}
                        min="1"
                        step="0.1"
                      />

                      <Input
                        label="스쿼트 1RM (kg)"
                        type="number"
                        placeholder="입력하세요"
                        value={formData.initialMeasurement?.squat1RM || ''}
                        onChange={(e) => handleMeasurementChange('squat1RM', e.target.value ? Number(e.target.value) : undefined)}
                        min="1"
                        step="0.1"
                      />

                      <Input
                        label="데드리프트 1RM (kg)"
                        type="number"
                        placeholder="입력하세요"
                        value={formData.initialMeasurement?.deadlift1RM || ''}
                        onChange={(e) => handleMeasurementChange('deadlift1RM', e.target.value ? Number(e.target.value) : undefined)}
                        min="1"
                        step="0.1"
                      />
                    </>
                  )}

                  {/* ENDURANCE: 스텝테스트 시간 (TODO: 필드 추가 필요) */}
                  {formData.membership.mainGoalType === 'ENDURANCE' && (
                    <div className="input-group">
                      <label className="input-label">스텝테스트 시간 (초)</label>
                      <p className="input-helper">스텝테스트 시간 측정 필드는 추후 추가 예정입니다.</p>
                    </div>
                  )}

                  {/* 공통 측정값 (선택사항) */}
                  <Input
                    label="골격근량 (kg)"
                    type="number"
                    placeholder="입력하세요 (선택사항)"
                    value={formData.initialMeasurement?.muscleMass || ''}
                    onChange={(e) => handleMeasurementChange('muscleMass', e.target.value ? Number(e.target.value) : undefined)}
                    min="1"
                    step="0.1"
                  />

                  <Input
                    label="체지방률 (%)"
                    type="number"
                    placeholder="입력하세요 (선택사항)"
                    value={formData.initialMeasurement?.bodyFat || ''}
                    onChange={(e) => handleMeasurementChange('bodyFat', e.target.value ? Number(e.target.value) : undefined)}
                  />
                </div>
              ) : (
                <div className="form-grid">
                  <p className="input-helper">PT 회원권을 선택하고 목표 유형을 설정하면 초기 측정값을 입력할 수 있습니다.</p>
                </div>
              )}
            </div>
          )}

          <div className="wizard-actions">
            {step > 1 && (
              <Button variant="outline" onClick={handlePrev}>
                이전
              </Button>
            )}
            <div className="wizard-actions-right">
              {step < 3 ? (
                <Button variant="primary" onClick={handleNext}>
                  다음 단계 →
                </Button>
              ) : (
                <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
                  회원 등록 완료
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
