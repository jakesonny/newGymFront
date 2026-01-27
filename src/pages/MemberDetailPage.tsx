import { useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Target, Heart, Activity } from 'lucide-react'
import { membersService } from '@/services/members.service'
import { abilitiesService } from '@/services/abilities.service'
import { workoutRecordsService } from '@/services/workout-records.service'
import { Layout, Card, Button, Loading, ErrorMessage, MetricCard, PageHeader, StatusBadge } from '@/components'
import { useAsyncData } from '@/hooks/useAsyncData'
import type { Member, HexagonData, MajorExercisesOneRepMaxResponse } from '@/types'
import './MemberDetailPage.css'

interface MemberDetailData {
  member: Member
  hexagonData: HexagonData | null
  oneRepMax: MajorExercisesOneRepMaxResponse | null
}

export function MemberDetailPage() {
  const { memberId } = useParams<{ memberId: string }>()
  const navigate = useNavigate()

  const fetchMemberDetail = useCallback(async (): Promise<MemberDetailData> => {
    if (!memberId) throw new Error('회원 ID가 필요합니다.')
    
    // Promise.allSettled를 사용하여 일부 실패해도 나머지 데이터는 가져옴
    const results = await Promise.allSettled([
      membersService.getById(memberId),
      abilitiesService.getHexagon(memberId, true), // 404 에러 시 null 반환
      workoutRecordsService.getOneRepMax(memberId, 'major'), // type='major'는 MajorExercisesOneRepMaxResponse 반환
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

    
    return { member, hexagonData, oneRepMax }
  }, [memberId])

  const { data, isLoading, error, refetch } = useAsyncData<MemberDetailData>({
    fetchFn: fetchMemberDetail,
    dependencies: [memberId],
    enabled: !!memberId,
  })

  // useMemo를 컴포넌트 최상단으로 이동 (조건부 return 전에)
  const strengthItems = useMemo(() => {
    if (!data) return [{ label: '데이터 없음', value: '-' }]
    
    const items: Array<{ label: string; value: string }> = []
    const { oneRepMax } = data
    
    // 백엔드 응답 형식: { exercises: [...] }
    if (oneRepMax && 'exercises' in oneRepMax) {
      oneRepMax.exercises.forEach((exercise) => {
        if (exercise.current) {
          const exerciseName = exercise.exerciseName
          // 벤치프레스, 스쿼트, 데드리프트만 표시
          if (exerciseName.includes('벤치') || exerciseName.includes('Bench')) {
            items.push({ label: 'BENCH', value: `${exercise.current.oneRepMax}kg` })
          } else if (exerciseName.includes('스쿼트') || exerciseName.includes('Squat')) {
            items.push({ label: 'SQUAT', value: `${exercise.current.oneRepMax}kg` })
          } else if (exerciseName.includes('데드') || exerciseName.includes('Deadlift')) {
            items.push({ label: 'DEAD', value: `${exercise.current.oneRepMax}kg` })
          }
        }
      })
    }
    return items.length > 0 ? items : [{ label: '데이터 없음', value: '-' }]
  }, [data?.oneRepMax])

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

  const { member, hexagonData } = data

  return (
    <Layout>
      <div className="member-detail-page">
        <PageHeader
          title={`${member.name} 회원님`}
          backTo="/members"
        />
        <div className="member-meta">
          <StatusBadge status="GREEN" type="risk" />
          <span>① 12주 프로그램</span>
          <span>6주차 / 12주 (50%)</span>
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
                <div className="goal-title">체중 감량</div>
                <div className="goal-detail">체지방 10kg 감량</div>
                <div className="goal-progress">85% 달성</div>
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
                  {/* 헥사곤 차트는 추후 구현 */}
                  <div className="hexagon-placeholder">
                    <div className="hexagon-label">하체 근력: {hexagonData.indicators.lowerBodyStrength}</div>
                    <div className="hexagon-label">심폐 지구력: {hexagonData.indicators.cardiorespiratoryEndurance}</div>
                    <div className="hexagon-label">근지구력: {hexagonData.indicators.muscularEndurance}</div>
                    <div className="hexagon-label">유연성: {hexagonData.indicators.flexibility}</div>
                    <div className="hexagon-label">체성분: {hexagonData.indicators.bodyComposition}</div>
                    <div className="hexagon-label">안정성: {hexagonData.indicators.stability}</div>
                  </div>
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
                score={78}
                trend="up"
                icon={Heart}
                items={[
                  { label: '체중', value: '80kg → 79.5kg' },
                  { label: '골격근', value: '37.2kg → 37.5kg' },
                  { label: '체지방', value: '18% → 16%' },
                ]}
                borderColor="success"
              />

              <MetricCard
                title="STRENGTH (근력)"
                score={85}
                trend="up"
                icon={Activity}
                items={strengthItems}
                borderColor="success"
              />

              <MetricCard
                title="CONDITIONING (체력)"
                score={62}
                trend="down"
                icon={Activity}
                items={[
                  { label: '로잉', value: '110s → 105s' },
                  { label: '러닝', value: '9.5m → 8.3m' },
                  { label: '버피', value: '28회 → 32회' },
                ]}
                borderColor="danger"
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
      </div>
    </Layout>
  )
}
