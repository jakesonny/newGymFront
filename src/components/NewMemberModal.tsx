import { useState } from 'react'
import { Calendar, User, X } from 'lucide-react'
import { membersService } from '@/services/members.service'
import { Button, Card, Input, ErrorMessage, StepIndicator } from '@/components'
import { getErrorMessage } from '@/utils/errorHandler'
import type { CreateMemberFullDto } from '@/types'
import './NewMemberModal.css'

type MembershipType = 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'LIFETIME' | 'PT_PACKAGE'

interface NewMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function NewMemberModal({ isOpen, onClose, onSuccess }: NewMemberModalProps) {
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
  })

  const membershipType = formData.membership?.membershipType as MembershipType | undefined
  const isPTMembership = membershipType === 'PT_PACKAGE'
  const isRegularMembership = membershipType && ['MONTHLY', 'QUARTERLY', 'YEARLY', 'LIFETIME'].includes(membershipType)

  const calculateExpiryDate = (purchaseDate: string, type: MembershipType): string => {
    if (!purchaseDate) return ''
    const purchase = new Date(purchaseDate)
    const expiry = new Date(purchase)
    switch (type) {
      case 'MONTHLY': expiry.setMonth(expiry.getMonth() + 1); break
      case 'QUARTERLY': expiry.setMonth(expiry.getMonth() + 3); break
      case 'YEARLY': expiry.setFullYear(expiry.getFullYear() + 1); break
      case 'LIFETIME': expiry.setFullYear(expiry.getFullYear() + 100); break
      default: return ''
    }
    return expiry.toISOString().split('T')[0]
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('phone', formatPhoneNumber(e.target.value))
  }

  const handleChange = (field: string, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMembershipChange = (field: string, value: string | number | undefined) => {
    const newMembership = { ...formData.membership, [field]: value } as CreateMemberFullDto['membership']
    if (!newMembership) return
    if (field === 'membershipType' && value) {
      const purchaseDate = newMembership.purchaseDate || formData.joinDate
      const calculatedExpiry = calculateExpiryDate(purchaseDate, value as MembershipType)
      if (calculatedExpiry) newMembership.expiryDate = calculatedExpiry
    }
    if (field === 'purchaseDate' && membershipType && isRegularMembership) {
      const calculatedExpiry = calculateExpiryDate(value as string, membershipType)
      if (calculatedExpiry) newMembership.expiryDate = calculatedExpiry
    }
    setFormData((prev) => ({ ...prev, membership: newMembership }))
  }

  const handleNumberChange = (field: 'height' | 'weight', e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '') {
      handleChange(field, undefined)
      return
    }
    const numValue = Number(value)
    if (numValue > 0) handleChange(field, numValue)
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.phone) {
        setError('이름과 전화번호는 필수 항목입니다.')
        return
      }
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('올바른 이메일 형식이 아닙니다.')
        return
      }
    }
    if (step === 2 && formData.membership) {
      if (isPTMembership && !formData.membership.mainGoalType) {
        setError('PT 회원권은 목표 유형을 선택해야 합니다.')
        return
      }
      if (isPTMembership && (!formData.membership.ptTotalCount || formData.membership.ptTotalCount <= 0)) {
        const confirm = window.confirm('PT 총 횟수가 입력되지 않았습니다. 계속 진행하시겠습니까?')
        if (!confirm) return
      }
      if (isRegularMembership && !formData.membership.expiryDate) {
        setError('일반 회원권은 만료일이 필요합니다.')
        return
      }
      if (!formData.membership.price || formData.membership.price <= 0) {
        setError('가격을 입력해주세요.')
        return
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
      onSuccess?.()
      onClose()
    } catch (err) {
      setError(getErrorMessage(err, '회원 등록에 실패했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setError('')
    setFormData({
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
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="new-member-modal-overlay" onClick={handleClose}>
      <div className="new-member-modal" onClick={(e) => e.stopPropagation()}>
        <div className="new-member-modal-header">
          <h2>신규 회원 등록</h2>
          <div className="new-member-modal-header-actions">
            <StepIndicator currentStep={step} totalSteps={2} />
            <button type="button" className="new-member-modal-close" onClick={handleClose} aria-label="닫기">
              <X size={24} />
            </button>
          </div>
        </div>

        {error && <ErrorMessage message={error} />}

        <Card className="new-member-modal-card">
          {step === 1 && (
            <div className="wizard-step">
              <div className="step-header">
                <User size={24} />
                <h3>기본 정보 및 프로그램 설정</h3>
              </div>
              <div className="form-grid">
                <Input label="회원 성함" placeholder="이름을 입력하세요" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
                <div className="input-group">
                  <label className="input-label">시작일 (Start Date) <span className="input-required">*</span></label>
                  <div className="date-input-wrapper">
                    <Input type="date" value={formData.joinDate} onChange={(e) => handleChange('joinDate', e.target.value)} required />
                    <Calendar className="date-icon" size={20} />
                  </div>
                </div>
                <Input label="전화번호" placeholder="010-1234-5678" value={formData.phone} onChange={handlePhoneChange} required maxLength={13} />
                <Input label="이메일" type="email" placeholder="email@example.com (선택사항)" value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value || undefined)} helperText="이메일은 선택사항입니다." />
                <div className="input-group">
                  <label className="input-label">성별</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input type="radio" name="gender" value="MALE" checked={formData.gender === 'MALE'} onChange={(e) => handleChange('gender', e.target.value as 'MALE' | 'FEMALE')} />
                      <span>남성</span>
                    </label>
                    <label className="radio-label">
                      <input type="radio" name="gender" value="FEMALE" checked={formData.gender === 'FEMALE'} onChange={(e) => handleChange('gender', e.target.value as 'MALE' | 'FEMALE')} />
                      <span>여성</span>
                    </label>
                  </div>
                </div>
                <Input label="생년월일" type="date" value={formData.birthDate} onChange={(e) => handleChange('birthDate', e.target.value)} />
                <Input label="키 (cm)" type="number" placeholder="입력하세요" value={formData.height ?? ''} onChange={(e) => handleNumberChange('height', e)} min={1} step="0.1" />
                <Input label="몸무게 (kg)" type="number" placeholder="입력하세요" value={formData.weight ?? ''} onChange={(e) => handleNumberChange('weight', e)} min={1} step="0.1" />
              </div>
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
                <h3>목표 설정 (Main Goal)</h3>
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">회원권 유형</label>
                  <select className="input" value={formData.membership?.membershipType || ''} onChange={(e) => handleMembershipChange('membershipType', e.target.value)}>
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
                <Input label="구매일" type="date" value={formData.membership?.purchaseDate || formData.joinDate} onChange={(e) => handleMembershipChange('purchaseDate', e.target.value)} />
                {isRegularMembership && (
                  <Input label="만료일" type="date" value={formData.membership?.expiryDate || ''} onChange={(e) => handleMembershipChange('expiryDate', e.target.value)} helperText="구매일 기준 자동 계산" />
                )}
                <Input label="가격 (원)" type="number" placeholder="500000" value={formData.membership?.price ?? ''} onChange={(e) => handleMembershipChange('price', e.target.value ? Number(e.target.value) : undefined)} />
                {isPTMembership && (
                  <>
                    <div className="input-group">
                      <label className="input-label">목표 유형 <span className="input-required">*</span></label>
                      <select className="input" value={formData.membership?.mainGoalType || ''} onChange={(e) => handleMembershipChange('mainGoalType', e.target.value)}>
                        <option value="">선택하세요</option>
                        <option value="WEIGHT_LOSS">체중 감량</option>
                        <option value="STRENGTH_UP">근력 상승</option>
                        <option value="ENDURANCE">체력 증진</option>
                        <option value="MAINTENANCE">유지</option>
                      </select>
                    </div>
                    {formData.membership?.mainGoalType && (
                      <>
                        <Input label="목표 수치" type="number" placeholder="10" value={formData.membership?.targetValue ?? ''} onChange={(e) => handleMembershipChange('targetValue', e.target.value ? Number(e.target.value) : undefined)} />
                        <Input label="시작 수치" type="number" placeholder="80" value={formData.membership?.startValue ?? formData.weight ?? ''} onChange={(e) => handleMembershipChange('startValue', e.target.value ? Number(e.target.value) : undefined)} />
                      </>
                    )}
                    <Input label="PT 총 횟수" type="number" placeholder="24" value={formData.membership?.ptTotalCount ?? ''} onChange={(e) => { const v = e.target.value; handleMembershipChange('ptTotalCount', v === '' ? undefined : Number(v)); }} min={1} helperText="선택사항" />
                  </>
                )}
              </div>
            </div>
          )}

          <div className="wizard-actions">
            <div>
              {step > 1 && <Button variant="outline" onClick={handlePrev}>이전 단계</Button>}
            </div>
            <div className="wizard-actions-right">
              {step < 2 ? (
                <Button variant="primary" onClick={handleNext}>다음 단계 →</Button>
              ) : (
                <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>등록 완료</Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
