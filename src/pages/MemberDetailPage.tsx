import { useCallback, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Target, Heart, Activity, User } from 'lucide-react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import { membersService } from '@/services/members.service'
import { membershipsService } from '@/services/memberships.service'
import { ptSessionsService } from '@/services/pt-sessions.service'
import { abilitiesService } from '@/services/abilities.service'
import { workoutRecordsService } from '@/services/workout-records.service'
import { Layout, Card, Button, Loading, ErrorMessage, MetricCard, PageHeader, StatusBadge, Input } from '@/components'
import { useAsyncData } from '@/hooks/useAsyncData'
import { getErrorMessage } from '@/utils/errorHandler'
import { getGoalLabel } from '@/utils/goalUtils'
import type { Member, Membership, HexagonData, MajorExercisesOneRepMaxResponse } from '@/types'
import './MemberDetailPage.css'

type DetailTab = 'summary' | 'baseline'

interface MemberDetailData {
  member: Member
  hexagonData: HexagonData | null
  oneRepMax: MajorExercisesOneRepMaxResponse | null
  dashboard: import('@/types').Dashboard | null
  goal: import('@/types').Goal | null
}

export function MemberDetailPage() {
  const formatKg = useCallback((value: number | null | undefined): string => {
    if (value == null || Number.isNaN(value)) return '-'
    return value.toFixed(2)
  }, [])

  const { memberId } = useParams<{ memberId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<DetailTab>('summary')

  const fetchMemberDetail = useCallback(async (): Promise<MemberDetailData> => {
    if (!memberId) throw new Error('회원 ID가 필요합니다.')
    
    // Promise.allSettled를 사용하여 일부 실패해도 나머지 데이터는 가져옴
    const results = await Promise.allSettled([
      membersService.getById(memberId),
      abilitiesService.getHexagon(memberId, true), // 404 에러 시 null 반환
      workoutRecordsService.getOneRepMax(memberId, 'major'), // type='major'는 MajorExercisesOneRepMaxResponse 반환
      membersService.getDashboard(memberId).catch(() => null), // Dashboard (선택)
      membersService.getGoal(memberId).catch(() => null), // Goal (선택)
    ])
    
    // member는 필수이므로 실패하면 에러
    if (results[0].status === 'rejected') {
      throw results[0].reason
    }
    
    const member = results[0].value
    const hexagonData = results[1].status === 'fulfilled' ? results[1].value : null
    // type='major'이므로 MajorExercisesOneRepMaxResponse만 반환됨
    const oneRepMaxResult = results[2].status === 'fulfilled' ? results[2].value : null
    const oneRepMax: MajorExercisesOneRepMaxResponse | null = 
      oneRepMaxResult && 'exercises' in oneRepMaxResult ? (oneRepMaxResult as MajorExercisesOneRepMaxResponse) : null
    const dashboard = results[3].status === 'fulfilled' ? results[3].value : null
    const goal = results[4].status === 'fulfilled' ? results[4].value ?? null : null

    return { member, hexagonData, oneRepMax, dashboard, goal }
  }, [memberId])

  const { data, isLoading, error, refetch } = useAsyncData<MemberDetailData>({
    fetchFn: fetchMemberDetail,
    dependencies: [memberId],
    enabled: !!memberId,
  })

  const strengthItems = useMemo(() => {
    if (!data) return [{ label: '데이터 없음', value: '-' }]
    const items: Array<{ label: string; value: string }> = []
    const { oneRepMax } = data
    if (oneRepMax && 'exercises' in oneRepMax) {
      oneRepMax.exercises.forEach((exercise) => {
        if (exercise.current) {
          const exerciseName = exercise.exerciseName
          if (exerciseName.includes('벤치') || exerciseName.includes('Bench')) {
            items.push({ label: 'BENCH', value: `${formatKg(exercise.current.oneRepMax)}kg` })
          } else if (exerciseName.includes('스쿼트') || exerciseName.includes('Squat')) {
            items.push({ label: 'SQUAT', value: `${formatKg(exercise.current.oneRepMax)}kg` })
          } else if (exerciseName.includes('데드') || exerciseName.includes('Deadlift')) {
            items.push({ label: 'DEAD', value: `${formatKg(exercise.current.oneRepMax)}kg` })
          }
        }
      })
    }
    return items.length > 0 ? items : [{ label: '데이터 없음', value: '-' }]
  }, [data?.oneRepMax, formatKg])

  const bodyItems = useMemo(() => {
    if (!data?.member) return [{ label: '데이터 없음', value: '-' }]
    const m = data.member
    const items: Array<{ label: string; value: string }> = []
    if (m.weight != null) items.push({ label: '체중', value: `${formatKg(m.weight)}kg` })
    return items.length > 0 ? items : [{ label: '데이터 없음', value: '-' }]
  }, [data?.member, formatKg])

  const conditioningItems = useMemo(() => {
    if (!data?.hexagonData) return [{ label: '데이터 없음', value: '-' }]
    const h = data.hexagonData.indicators
    const items: Array<{ label: string; value: string }> = []
    if (h.cardiorespiratoryEndurance != null) {
      items.push({ label: '심폐 지구력', value: `${Math.round(h.cardiorespiratoryEndurance)}점` })
    }
    if (h.muscularEndurance != null) {
      items.push({ label: '근지구력', value: `${Math.round(h.muscularEndurance)}점` })
    }
    return items.length > 0 ? items : [{ label: '데이터 없음', value: '-' }]
  }, [data?.hexagonData])

  const metricScores = useMemo((): { body: number | null; strength: number | null; conditioning: number | null } => {
    if (!data?.hexagonData) {
      return { body: null, strength: null, conditioning: null }
    }
    const h = data.hexagonData.indicators
    const cardio = h.cardiorespiratoryEndurance
    const endurance = h.muscularEndurance
    const conditioningValue =
      cardio != null && endurance != null
        ? Math.round((cardio + endurance) / 2)
        : cardio != null
          ? Math.round(cardio)
          : endurance != null
            ? Math.round(endurance)
            : null
    return {
      body: h.bodyComposition != null ? Math.round(h.bodyComposition) : null,
      strength: h.lowerBodyStrength != null ? Math.round(h.lowerBodyStrength) : null,
      conditioning: conditioningValue,
    }
  }, [data?.hexagonData])

  const hexagonChartData = useMemo(() => {
    if (!data?.hexagonData) return []
    const h = data.hexagonData.indicators
    return [
      { subject: '하체 근력', value: h.lowerBodyStrength ?? 0 },
      { subject: '심폐 지구력', value: h.cardiorespiratoryEndurance ?? 0 },
      { subject: '근지구력', value: h.muscularEndurance ?? 0 },
      { subject: '유연성', value: h.flexibility ?? 0 },
      { subject: '체성분', value: h.bodyComposition ?? 0 },
      { subject: '안정성', value: h.stability ?? 0 },
    ]
  }, [data?.hexagonData])

  if (isLoading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }

  if (error || !data) {
    return (
      <Layout>
        <ErrorMessage message={error || '회원을 찾을 수 없습니다.'} onRetry={refetch} />
      </Layout>
    )
  }

  const { member, hexagonData, dashboard, goal } = data

  // 활성 회원권 정보 가져오기
  const activeMembership = member.memberships?.find(
    (m) => m.status === 'ACTIVE' || !m.status
  )

  // RiskStatus 결정 (membership의 riskStatus 또는 기본값)
  const riskStatus = activeMembership?.riskStatus || 'FOUNDATION'

  // 프로그램 정보
  const durationWeeks = activeMembership?.durationWeeks
  const programInfo = durationWeeks
    ? `${durationWeeks}주 프로그램`
    : '프로그램 없음'

  // 세션 진행률 (dashboard 또는 member에서)
  const sessionProgress = dashboard?.sessionProgress || {
    totalSessions: member.totalSessions || 0,
    completedSessions: member.completedSessions || 0,
    progressPercentage: 0,
  }

  const sessionInfo = sessionProgress.totalSessions > 0
    ? `${sessionProgress.completedSessions}회차 / ${sessionProgress.totalSessions}회 (${sessionProgress.progressPercentage}%)`
    : '세션 정보 없음'

  // Goal 정보 (dashboard 또는 goal에서)
  const goalInfo = dashboard?.goal || {
    goal: member.goal || goal?.goalType || null,
    goalProgress: member.goalProgress || goal?.progress || 0,
    goalTrainerComment: member.goalTrainerComment || goal?.trainerComment || null,
  }

  // 프로그램 진행률을 최우선으로 사용 (없을 때만 기존 goalProgress 폴백)
  const programProgress = activeMembership?.currentProgress ?? goalInfo.goalProgress

  const goalTypeLabel = (() => {
    const label = getGoalLabel(activeMembership?.mainGoalType ?? null)
    return label === '-' ? (goalInfo.goal || '목표 없음') : label
  })()

  return (
    <Layout>
      <div className="member-detail-page">
        <PageHeader
          title={`${member.name} 회원님`}
          backTo="/members"
        />

        <div className="member-detail-tabs">
          <button
            type="button"
            className={`member-detail-tab ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            요약
          </button>
          <button
            type="button"
            className={`member-detail-tab ${activeTab === 'baseline' ? 'active' : ''}`}
            onClick={() => setActiveTab('baseline')}
          >
            초기 측정
          </button>
        </div>

        {activeTab === 'baseline' && (
          <BaselineTab
            memberId={memberId!}
            member={member}
            activeMembership={activeMembership}
            onSaved={refetch}
          />
        )}

        {activeTab === 'summary' && (
          <>
        <div className="member-meta">
          <StatusBadge status={riskStatus as 'FOUNDATION' | 'GREEN' | 'YELLOW' | 'RED'} type="risk" />
          {durationWeeks && <span>① {programInfo}</span>}
          <span>{sessionInfo}</span>
        </div>

        <div className="progress-roadmap">
          <div className="roadmap-item">
            <span className="roadmap-label">START</span>
          </div>
          <div className="roadmap-item">
            <span className="roadmap-label">Phase 2</span>
          </div>
          <div className="roadmap-item active">
            <span className="roadmap-label">CURRENT PHASE</span>
          </div>
          <div className="roadmap-item">
            <span className="roadmap-label">Phase 3</span>
          </div>
          <div className="roadmap-item">
            <span className="roadmap-label">GOAL</span>
          </div>
        </div>

        <div className="main-goal-card">
          <Card className="goal-card" border="none">
            <div className="goal-card-content">
              <div className="goal-icon">
                <Target size={32} />
              </div>
              <div className="goal-info">
                <div className="goal-label">MAIN GOAL</div>
                <div className="goal-title">{goalTypeLabel}</div>
                {activeMembership?.currentValue != null &&
                  activeMembership?.targetValue != null &&
                  activeMembership?.targetUnit && (
                  <div className="goal-detail">
                    현재: {formatKg(activeMembership.currentValue)}{activeMembership.targetUnit}
                    {' / '}
                    목표: {formatKg(activeMembership.targetValue)}{activeMembership.targetUnit}
                    {activeMembership.startValue != null &&
                      ` (시작: ${formatKg(activeMembership.startValue)}${activeMembership.targetUnit})`}
                  </div>
                )}
                {!activeMembership?.targetValue && goalInfo.goal && (
                  <div className="goal-detail">{goalInfo.goal}</div>
                )}
                <div className="goal-progress">{programProgress}% 달성</div>
                {goalInfo.goalTrainerComment && (
                  <div className="goal-comment">{goalInfo.goalTrainerComment}</div>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="member-detail-content">
          <div className="detail-main">
            <Card className="abilities-card">
              <h2 className="section-title">능력치 분석</h2>
              {hexagonData ? (
                <div className="hexagon-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={hexagonChartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar dataKey="value" stroke="#ff7a00" fill="#ff7a00" fillOpacity={0.35} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="hexagon-placeholder">
                  <p>능력치 데이터가 없습니다.</p>
                </div>
              )}
            </Card>

            <div className="metric-cards-grid">
              <MetricCard
                title="BODY (체성분)"
                score={metricScores.body}
                trend={metricScores.body != null ? (metricScores.body >= 70 ? 'up' : metricScores.body >= 50 ? 'stable' : 'down') : undefined}
                icon={Heart}
                items={bodyItems}
                borderColor={metricScores.body != null ? (metricScores.body >= 70 ? 'success' : metricScores.body >= 50 ? 'warning' : 'danger') : 'primary'}
              />

              <MetricCard
                title="STRENGTH (근력)"
                score={metricScores.strength}
                trend={metricScores.strength != null ? (metricScores.strength >= 70 ? 'up' : metricScores.strength >= 50 ? 'stable' : 'down') : undefined}
                icon={Activity}
                items={strengthItems}
                borderColor={metricScores.strength != null ? (metricScores.strength >= 70 ? 'success' : metricScores.strength >= 50 ? 'warning' : 'danger') : 'primary'}
              />

              <MetricCard
                title="CONDITIONING (체력)"
                score={metricScores.conditioning}
                trend={metricScores.conditioning != null ? (metricScores.conditioning >= 70 ? 'up' : metricScores.conditioning >= 50 ? 'stable' : 'down') : undefined}
                icon={Activity}
                items={conditioningItems}
                borderColor={metricScores.conditioning != null ? (metricScores.conditioning >= 70 ? 'success' : metricScores.conditioning >= 50 ? 'warning' : 'danger') : 'primary'}
              />
            </div>

            <div className="action-buttons">
              <Button variant="primary" onClick={() => navigate(`/members/${memberId}/goal-analyst`)}>
                Goal Analyst 보기
              </Button>
              <Button variant="outline" onClick={() => navigate('/strength-level')}>
                Strength Level 측정
              </Button>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </Layout>
  )
}

interface BaselineTabProps {
  memberId: string
  member: Member
  activeMembership: Membership | undefined
  onSaved: () => void
}

function BaselineTab({ memberId, member, activeMembership, onSaved }: BaselineTabProps) {
  const [weight, setWeight] = useState<number | ''>(member.weight ?? '')
  const [startValue, setStartValue] = useState<number | ''>(activeMembership?.startValue ?? '')
  const [currentValue, setCurrentValue] = useState<number | ''>(activeMembership?.currentValue ?? '')
  const [muscleMass, setMuscleMass] = useState<number | ''>('')
  const [bodyFat, setBodyFat] = useState<number | ''>('')
  const [benchPress1RM, setBenchPress1RM] = useState<number | ''>('')
  const [squat1RM, setSquat1RM] = useState<number | ''>('')
  const [deadlift1RM, setDeadlift1RM] = useState<number | ''>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    setError('')
    setSuccess(false)
    try {
      await membersService.update(memberId, {
        weight: weight === '' ? undefined : Number(weight),
      })

      if (activeMembership?.id) {
        const updates: { startValue?: number; currentValue?: number } = {}
        if (startValue !== '') updates.startValue = Number(startValue)
        if (currentValue !== '') updates.currentValue = Number(currentValue)
        if (Object.keys(updates).length > 0) {
          await membershipsService.updateMembership(memberId, activeMembership.id, updates)
        }

        const hasMeasurements =
          muscleMass !== '' || bodyFat !== '' || benchPress1RM !== '' || squat1RM !== '' || deadlift1RM !== ''
        const weightNum = weight === '' ? undefined : Number(weight)
        if (hasMeasurements || weightNum !== undefined) {
          await ptSessionsService.create(memberId, {
            sessionDate: new Date().toISOString().split('T')[0],
            mainContent: '초기 측정 (Baseline)',
            membershipId: activeMembership.id,
            measuredWeight: weightNum,
            measuredMuscleMass: muscleMass === '' ? undefined : Number(muscleMass),
            measuredBodyFat: bodyFat === '' ? undefined : Number(bodyFat),
            benchPress1RM: benchPress1RM === '' ? undefined : Number(benchPress1RM),
            squat1RM: squat1RM === '' ? undefined : Number(squat1RM),
            deadlift1RM: deadlift1RM === '' ? undefined : Number(deadlift1RM),
          })
        }
      }

      setSuccess(true)
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err, '저장에 실패했습니다.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="baseline-tab-card">
      <h2 className="section-title">
        <User size={24} />
        초기 측정 (Baseline)
      </h2>
      <p className="baseline-description">
        회원의 현재 상태를 입력하세요. 미입력 시 0으로 처리되며, PT 회원은 시작/현재 수치가 진행률에 반영됩니다.
      </p>

      {error && <ErrorMessage message={error} />}
      {success && <p className="baseline-success">저장되었습니다.</p>}

      <div className="baseline-form">
        <div className="baseline-section">
          <h3 className="baseline-section-title">Body (신체)</h3>
          <div className="baseline-fields">
            <Input
              label="체중 (kg)"
              type="number"
              placeholder="0"
              value={weight === '' ? '' : weight}
              onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
              min={0}
              step="0.1"
            />
            <Input
              label="골격근량 (kg)"
              type="number"
              placeholder="0 (선택)"
              value={muscleMass}
              onChange={(e) => setMuscleMass(e.target.value === '' ? '' : Number(e.target.value))}
              min={0}
              step="0.1"
            />
            <Input
              label="체지방률 (%)"
              type="number"
              placeholder="0 (선택)"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value === '' ? '' : Number(e.target.value))}
              min={0}
              max={100}
              step="0.1"
            />
          </div>
        </div>

        {activeMembership?.membershipType === 'PT_PACKAGE' && activeMembership && (
          <div className="baseline-section">
            <h3 className="baseline-section-title">프로그램 기준 수치</h3>
            <div className="baseline-fields">
              <Input
                label="시작 수치"
                type="number"
                placeholder="0"
                value={startValue === '' ? '' : startValue}
                onChange={(e) => setStartValue(e.target.value === '' ? '' : Number(e.target.value))}
                min={0}
                step="0.1"
              />
              <Input
                label="현재 수치"
                type="number"
                placeholder="0"
                value={currentValue === '' ? '' : currentValue}
                onChange={(e) => setCurrentValue(e.target.value === '' ? '' : Number(e.target.value))}
                min={0}
                step="0.1"
              />
            </div>
          </div>
        )}

        <div className="baseline-section">
          <h3 className="baseline-section-title">Strength (근력) 1RM</h3>
          <div className="baseline-fields">
            <Input
              label="벤치프레스 (kg)"
              type="number"
              placeholder="0 (선택)"
              value={benchPress1RM}
              onChange={(e) => setBenchPress1RM(e.target.value === '' ? '' : Number(e.target.value))}
              min={0}
              step="0.1"
            />
            <Input
              label="스쿼트 (kg)"
              type="number"
              placeholder="0 (선택)"
              value={squat1RM}
              onChange={(e) => setSquat1RM(e.target.value === '' ? '' : Number(e.target.value))}
              min={0}
              step="0.1"
            />
            <Input
              label="데드리프트 (kg)"
              type="number"
              placeholder="0 (선택)"
              value={deadlift1RM}
              onChange={(e) => setDeadlift1RM(e.target.value === '' ? '' : Number(e.target.value))}
              min={0}
              step="0.1"
            />
          </div>
        </div>

        <div className="baseline-actions">
          <Button variant="primary" onClick={handleSave} isLoading={isLoading}>
            저장
          </Button>
        </div>
      </div>
    </Card>
  )
}
