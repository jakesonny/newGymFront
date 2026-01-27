import { useState, useEffect, useCallback, useRef } from 'react'
import { TrendingUp, User, Check, Dumbbell, Flame, UserCircle } from 'lucide-react'
import { strengthLevelService } from '@/services/strength-level.service'
import { Layout, Card, Input, ErrorMessage, PageHeader } from '@/components'
import { getErrorMessage } from '@/utils/errorHandler'
import type { StrengthLevelData } from '@/types'
import './StrengthLevelPage.css'

export function StrengthLevelPage() {
  const [exerciseType, setExerciseType] = useState<'BENCH_PRESS' | 'SQUAT' | 'DEADLIFT'>('BENCH_PRESS')
  const [age, setAge] = useState(30)
  const [ageInput, setAgeInput] = useState('30')
  const [bodyWeight, setBodyWeight] = useState(75)
  const [bodyWeightInput, setBodyWeightInput] = useState('75')
  const [gender, setGender] = useState<'MALE' | 'FEMALE'>('MALE')
  const [currentWeight, setCurrentWeight] = useState<number | undefined>(undefined)
  const [currentWeightInput, setCurrentWeightInput] = useState('')
  const [result, setResult] = useState<StrengthLevelData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const exerciseNames = {
    BENCH_PRESS: '벤치프레스',
    SQUAT: '스쿼트',
    DEADLIFT: '데드리프트',
  }

  // 나이 입력 필드 핸들러
  const handleAgeInputChange = (value: string) => {
    setAgeInput(value)
    const numValue = Number(value)
    if (!isNaN(numValue) && numValue >= 15 && numValue <= 80) {
      setAge(numValue)
    }
  }

  // 체중 입력 필드 핸들러
  const handleBodyWeightInputChange = (value: string) => {
    setBodyWeightInput(value)
    const numValue = Number(value)
    if (!isNaN(numValue) && numValue >= 40 && numValue <= 140) {
      setBodyWeight(numValue)
    }
  }

  // 현재 무게 입력 필드 핸들러
  const handleCurrentWeightInputChange = (value: string) => {
    setCurrentWeightInput(value)
    const numValue = Number(value)
    if (value === '') {
      setCurrentWeight(undefined)
    } else if (!isNaN(numValue) && numValue >= 0) {
      setCurrentWeight(numValue)
    }
  }

  // 슬라이더 변경 시 입력 필드 동기화
  const handleAgeSliderChange = (value: number) => {
    setAge(value)
    setAgeInput(String(value))
  }

  const handleBodyWeightSliderChange = (value: number) => {
    setBodyWeight(value)
    setBodyWeightInput(String(value))
  }

  // 자동 계산 함수 (디바운스 적용)
  const calculateLevel = useCallback(async () => {
    if (!age || !bodyWeight) {
      return
    }

    // 디바운스 타이머 클리어
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // 500ms 후에 API 호출
    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true)
      setError('')

      try {
        const data = await strengthLevelService.calculate({
          exerciseType,
          age,
          bodyWeight,
          gender,
          currentWeight,
        })
        setResult(data)
      } catch (err) {
        console.error('레벨 측정 API 오류:', err)
        const errorMessage = getErrorMessage(err, '계산에 실패했습니다.')
        setError(errorMessage)
        // 개발 모드에서 상세 에러 정보 표시
        if (import.meta.env.DEV && err && typeof err === 'object' && 'response' in err) {
          const httpError = err as { response?: { data?: { message?: string }; status?: number } }
          if (httpError.response?.status === 404) {
            setError('API 엔드포인트를 찾을 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.')
          } else if (httpError.response?.data?.message) {
            setError(`${errorMessage}: ${httpError.response.data.message}`)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }, [exerciseType, age, bodyWeight, gender, currentWeight])

  // 입력값 변경 시 자동 계산
  useEffect(() => {
    calculateLevel()
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [calculateLevel])

  // 다음 목표까지 남은 무게 계산
  const getRemainingWeight = (level: StrengthLevelData['allLevels'][0], currentWeight?: number) => {
    if (!currentWeight || !level.isNext) return null
    const remaining = level.weight - currentWeight
    return remaining > 0 ? remaining : null
  }

  // 프로그레스 계산 (달성률)
  const getProgress = (level: StrengthLevelData['allLevels'][0], currentWeight?: number) => {
    if (!currentWeight || !result) return 0
    if (currentWeight >= level.weight) return 100
    
    // 이전 레벨 찾기
    const currentIndex = result.allLevels.findIndex(l => l.level === level.level)
    if (currentIndex <= 0) return 0
    
    const prevLevel = result.allLevels[currentIndex - 1]
    if (!prevLevel) return 0
    
    const range = level.weight - prevLevel.weight
    if (range <= 0) return 0
    
    const progress = currentWeight - prevLevel.weight
    return Math.min(100, Math.max(0, (progress / range) * 100))
  }

  return (
    <Layout>
      <div className="strength-level-page">
        <PageHeader
          title={`${exerciseNames[exerciseType]} 레벨 측정기`}
          subtitle="내 신체 정보에 딱 맞는 목표를 알려드려요"
        />

        <div className="strength-level-content">
          {/* 왼쪽: 입력 폼 */}
          <Card className="input-card">
            <div className="card-header">
              <User size={24} />
              <h2>내 정보 입력</h2>
            </div>

            {error && <ErrorMessage message={error} />}
            {isLoading && <div className="loading-indicator">계산 중...</div>}

            {/* 운동 종류 선택 */}
            <div className="input-section">
              <label className="input-label-compact">운동 종류</label>
              <div className="exercise-tabs-compact">
                {(['BENCH_PRESS', 'SQUAT', 'DEADLIFT'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`exercise-tab-compact ${exerciseType === type ? 'active' : ''}`}
                    onClick={() => setExerciseType(type)}
                  >
                    {exerciseNames[type]}
                  </button>
                ))}
              </div>
            </div>

            {/* 성별 선택 */}
            <div className="input-section">
              <label className="input-label-compact">성별</label>
              <div className="radio-group-compact">
                <label className={`radio-label-compact ${gender === 'MALE' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    checked={gender === 'MALE'}
                    onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE')}
                  />
                  <span>남성</span>
                </label>
                <label className={`radio-label-compact ${gender === 'FEMALE' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    checked={gender === 'FEMALE'}
                    onChange={(e) => setGender(e.target.value as 'MALE' | 'FEMALE')}
                  />
                  <span>여성</span>
                </label>
              </div>
            </div>

            {/* 나이 - 레이블과 값 한 줄, 슬라이더 아래 */}
            <div className="input-section">
              <div className="slider-input-header">
                <label className="slider-label">나이</label>
                <div className="slider-value-display">{age}세</div>
              </div>
              <div className="slider-container-image-style">
                <input
                  type="range"
                  min="15"
                  max="80"
                  value={age}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    handleAgeSliderChange(value)
                    setAgeInput(String(value))
                  }}
                  className="slider-image-style"
                />
                <div className="slider-range-labels">
                  <span>15세</span>
                  <span>80세</span>
                </div>
              </div>
            </div>

            {/* 체중 - 레이블과 값 한 줄, 슬라이더 아래 */}
            <div className="input-section">
              <div className="slider-input-header">
                <label className="slider-label">체중</label>
                <div className="slider-value-display">{bodyWeight}kg</div>
              </div>
              <div className="slider-container-image-style">
                <input
                  type="range"
                  min="40"
                  max="140"
                  value={bodyWeight}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    handleBodyWeightSliderChange(value)
                    setBodyWeightInput(String(value))
                  }}
                  className="slider-image-style"
                />
                <div className="slider-range-labels">
                  <span>40kg</span>
                  <span>140kg</span>
                </div>
              </div>
            </div>

            <div className="input-section">
              <label className="input-label-compact">현재 1번 들 수 있는 무게 (선택)</label>
              <div className="current-weight-input-wrapper-compact">
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={currentWeightInput}
                  onChange={(e) => handleCurrentWeightInputChange(e.target.value)}
                  className="current-weight-input-compact"
                />
                <span className="input-unit-medium">kg</span>
              </div>
              <p className="input-helper-compact">* 입력하면 내가 어느 단계인지 보여줍니다.</p>
            </div>
          </Card>

          {/* 오른쪽: 결과 */}
          {result ? (
            <Card className="result-card">
              <div className="card-header">
                <TrendingUp size={24} />
                <h2>나의 근력 성장 계단</h2>
              </div>
              <div className="result-subtitle">
                {age}세 {bodyWeight}kg {gender === 'MALE' ? '남성' : '여성'} 기준 목표
              </div>

              <div className="levels-list">
                {result.allLevels.map((level, index) => {
                  const remainingWeight = getRemainingWeight(level, currentWeight)
                  const isAchieved = currentWeight !== undefined && currentWeight >= level.weight
                  const progress = getProgress(level, currentWeight)
                  
                  return (
                    <div
                      key={level.level}
                      className={`level-item ${level.isNext ? 'next-goal' : ''} ${isAchieved ? 'achieved' : ''}`}
                    >
                      <div className="level-left">
                        <div className="level-icon-wrapper">
                          {isAchieved ? (
                            <div className="level-icon achieved-icon">
                              <Check size={20} />
                            </div>
                          ) : level.isNext ? (
                            <div className="level-icon next-icon">
                              <Flame size={20} />
                            </div>
                          ) : (
                            <div className="level-icon default-icon">
                              <UserCircle size={20} />
                            </div>
                          )}
                          <div className="level-number">{index + 1}</div>
                        </div>
                      </div>
                      
                      <div className="level-content">
                        <div className="level-header">
                          <div className="level-info">
                            <div className="level-name-wrapper">
                              <div className="level-name">{level.levelKorean}</div>
                              {level.isNext && (
                                <span className="next-goal-badge">다음 목표!</span>
                              )}
                            </div>
                            <div className="level-description">{level.description}</div>
                          </div>
                          <div className="level-weight">{level.weight} kg</div>
                        </div>
                        
                        {level.isNext && remainingWeight && (
                          <div className="level-remaining">
                            {remainingWeight}kg 남음
                          </div>
                        )}
                        
                        <div className="level-footer">
                          <div className="progress-bar-container">
                            <div 
                              className={`progress-bar ${isAchieved ? 'completed' : ''}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          {isAchieved && (
                            <div className="level-status achieved-status">
                              <Check size={14} />
                              <span>달성 완료</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="disclaimer">
                ① 이 기준은 일반적인 통계를 바탕으로 추정된 수치입니다. 절대적인 기준이 아니니 참고만 하세요!
              </div>
            </Card>
          ) : (
            <Card className="result-card placeholder-card">
              <div className="placeholder-content">
                <p>입력 정보를 바탕으로 레벨을 계산합니다...</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  )
}
