import { useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Zap } from 'lucide-react'
import { membersService } from '@/services/members.service'
import { Layout, Card, Button, Loading, ErrorMessage, MetricCard, PageHeader } from '@/components'
import { useAsyncData } from '@/hooks/useAsyncData'
import type { GoalAnalyst } from '@/types'
import './GoalAnalystPage.css'

export function GoalAnalystPage() {
  const { memberId } = useParams<{ memberId: string }>()
  
  const fetchGoalAnalyst = useCallback(() => {
    if (!memberId) throw new Error('회원 ID가 필요합니다.')
    return membersService.getGoalAnalyst(memberId)
  }, [memberId])
  
  const { data, isLoading, error, refetch } = useAsyncData<GoalAnalyst>({
    fetchFn: fetchGoalAnalyst,
    dependencies: [memberId],
    enabled: !!memberId,
  })

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
        <ErrorMessage message={error || '데이터를 불러올 수 없습니다.'} onRetry={refetch} />
      </Layout>
    )
  }

  // 차트 데이터 준비 (useMemo로 최적화)
  const chartData = useMemo(() => {
    if (!data) return []
    return [
      { week: 'Start', value: data.progressRoadmap.start?.value || 0 },
      { week: '2w', value: data.trend.recentValues[0]?.value || 0 },
      { week: '4w', value: data.trend.recentValues[1]?.value || 0 },
      { week: '6w', value: data.trend.recentValues[2]?.value || 0 },
      { week: '8w', value: data.trend.recentValues[3]?.value || 0 },
      { week: 'Now', value: data.progressRoadmap.current?.value || 0 },
    ]
  }, [data])

  const getTierName = useCallback((progress: number) => {
    if (progress >= 90) return 'Elite'
    if (progress >= 70) return 'Advanced'
    if (progress >= 50) return 'Average'
    if (progress >= 30) return 'Novice'
    return 'Under'
  }, [])

  const currentTier = useMemo(
    () => getTierName(data?.program.currentProgress || 0),
    [data?.program.currentProgress, getTierName]
  )

  return (
    <Layout>
      <div className="goal-analyst-page">
        <PageHeader
          title="골 애널리스트 (Goal Analyst)"
          subtitle="데이터 기반 성과 추세 및 예측"
          backTo={`/members/${memberId}`}
        />

        <div className="phase-navigation">
          <div className="phase-item">
            <span className="phase-label">START</span>
            <span className="phase-value">{data.progressRoadmap.start?.value || '-'}</span>
          </div>
          <div className="phase-item active">
            <span className="phase-label">CURRENT PHASE</span>
            <span className="phase-value">{data.progressRoadmap.current?.value || '-'}</span>
          </div>
          <div className="phase-item">
            <span className="phase-label">GOAL</span>
            <span className="phase-value">{data.progressRoadmap.goal?.value || '-'}</span>
          </div>
        </div>

        <div className="goal-analyst-content">
          <div className="goal-analyst-main">
            <Card className="chart-card">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ fill: '#7c3aed', r: 6 }}
                    name="진행률"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="metric-cards-row">
              <MetricCard
                title="BODY (체성분)"
                score={78}
                trend="up"
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
                items={[
                  { label: 'SQUAT', value: '135kg → 140kg' },
                  { label: 'BENCH', value: '90kg → 95kg' },
                  { label: 'DEAD', value: '170kg → 180kg' },
                ]}
                borderColor="success"
              />

              <MetricCard
                title="CONDITIONING (체력)"
                score={62}
                trend="down"
                items={[
                  { label: '로잉', value: '110s → 105s' },
                  { label: '러닝', value: '9.5m → 8.3m' },
                  { label: '버피', value: '28회 → 32회' },
                ]}
                borderColor="danger"
              />
            </div>
          </div>

          <div className="goal-analyst-sidebar">
            <Card className="tier-card">
              <div className="tier-header">CURRENT TIER</div>
              <div className="tier-content">
                <Zap size={32} />
                <div className="tier-name">{currentTier}</div>
              </div>
            </Card>

            <Card className="target-controls-card">
              <div className="target-controls-header">
                <h3>NEXT TARGET CONTROLS</h3>
                <Button variant="ghost" size="sm">전체 보기</Button>
              </div>
              <div className="target-list">
                {data.nextTarget.value && (
                  <div className="target-item">
                    <div className="target-label">다음 목표</div>
                    <div className="target-value">{data.nextTarget.value}{data.program.targetUnit || 'kg'}</div>
                    <div className="target-description">{data.nextTarget.description}</div>
                  </div>
                )}
                {data.program.mainGoalType === 'ENDURANCE' && (
                  <>
                    <div className="target-item">
                      <div className="target-label">로잉500m</div>
                      <div className="target-value">105s</div>
                      <div className="target-goal">Goal: 100s</div>
                    </div>
                    <div className="target-item">
                      <div className="target-label">2km러닝</div>
                      <div className="target-value">8.3min</div>
                      <div className="target-goal">Goal: 8min</div>
                    </div>
                    <div className="target-item">
                      <div className="target-label">버피</div>
                      <div className="target-value">32회</div>
                      <div className="target-goal">Goal: 40회</div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
