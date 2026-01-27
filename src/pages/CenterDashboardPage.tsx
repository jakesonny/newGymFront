import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, AlertCircle, Clock, Flame, Dumbbell, HeartPulse, ChevronRight } from 'lucide-react'
import { insightsService } from '@/services/insights.service'
import { Layout, Card, Loading, ErrorMessage, PageHeader, SearchInput, StatusBadge } from '@/components'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useSearch } from '@/hooks/useSearch'
import type { CenterDashboard } from '@/types'
import './CenterDashboardPage.css'

export function CenterDashboardPage() {
  const navigate = useNavigate()

  const fetchCenterDashboard = useCallback(() => {
    return insightsService.getCenterDashboard()
  }, [])

  const { data, isLoading, error, refetch } = useAsyncData<CenterDashboard>({
    fetchFn: fetchCenterDashboard,
  })

  const { searchQuery, setSearchQuery, filteredData: filteredMembers } = useSearch({
    data: data?.memberList || [],
    searchFields: ['name'],
  })

  // GoalType에 따른 아이콘과 라벨 매핑
  const getGoalIcon = (goalType: string | null) => {
    switch (goalType) {
      case 'WEIGHT_LOSS':
        return <Flame size={18} className="goal-icon weight-loss" />
      case 'STRENGTH_UP':
        return <Dumbbell size={18} className="goal-icon strength-up" />
      case 'ENDURANCE':
        return <HeartPulse size={18} className="goal-icon endurance" />
      case 'MAINTENANCE':
        return <TrendingUp size={18} className="goal-icon maintenance" />
      default:
        return null
    }
  }

  const getGoalLabel = (goalType: string | null) => {
    switch (goalType) {
      case 'WEIGHT_LOSS':
        return '체중 감량'
      case 'STRENGTH_UP':
        return '근력 상승'
      case 'ENDURANCE':
        return '체력 증진'
      case 'MAINTENANCE':
        return '유지'
      default:
        return '-'
    }
  }

  // 진행도 계산 (D-남은일수)
  const calculateDaysRemaining = useCallback((member: CenterDashboard['memberList'][0]) => {
    if (!member.program?.endDate) return '-'
    const endDate = new Date(member.program.endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    endDate.setHours(0, 0, 0, 0)
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`
  }, [])

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

  return (
    <Layout>
      <div className="center-dashboard-page">
        <PageHeader
          title="센터 대시보드"
          subtitle="관리자님, 현재 운영 중인 타임박스 프로그램 현황입니다."
        />

        <div className="summary-cards">
          <Card className="summary-card">
            <div className="summary-icon">
              <TrendingUp size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">평균 달성률</div>
              <div className="summary-value">{data.summary.averageProgress}%</div>
            </div>
          </Card>

          <Card className="summary-card">
            <div className="summary-icon danger">
              <AlertCircle size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">위험(Red) 회원</div>
              <div className="summary-value">{data.summary.riskCounts.red}명</div>
            </div>
          </Card>

          <Card className="summary-card">
            <div className="summary-icon warning">
              <Clock size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">미입력 측정 데이터</div>
              <div className="summary-value">{data.summary.missingMeasurements}건</div>
            </div>
          </Card>
        </div>

        <Card className="members-list-card">
          <div className="members-list-header">
            <h2 className="section-title">회원 관리 리스트</h2>
            <SearchInput
              placeholder="회원명 검색..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <div className="members-table">
            <div className="table-header">
              <div className="table-cell">회원명</div>
              <div className="table-cell">핵심 목표</div>
              <div className="table-cell">프로그램</div>
              <div className="table-cell">진행도</div>
              <div className="table-cell">상태</div>
              <div className="table-cell">성과 달성도</div>
              <div className="table-cell"></div>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="empty-state">회원이 없습니다.</div>
            ) : (
              filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="table-row"
                  onClick={() => navigate(`/members/${member.id}`)}
                >
                  <div className="table-cell">{member.name}</div>
                  <div className="table-cell goal-cell">
                    {getGoalIcon(member.program?.mainGoalType || null)}
                    <span>{getGoalLabel(member.program?.mainGoalType || null)}</span>
                  </div>
                  <div className="table-cell">
                    {member.program?.durationWeeks ? `${member.program.durationWeeks}주` : '-'}
                  </div>
                  <div className="table-cell">
                    {calculateDaysRemaining(member)}
                  </div>
                  <div className="table-cell">
                    <StatusBadge status={member.riskStatus} type="risk" showDot />
                  </div>
                  <div className="table-cell">
                    <div className="progress-container">
                      <div className="progress-bar-wrapper">
                        <div
                          className="progress-bar"
                          style={{ width: `${member.program?.currentProgress || 0}%` }}
                        />
                      </div>
                      <span className="progress-text">{member.program?.currentProgress || 0}%</span>
                    </div>
                  </div>
                  <div className="table-cell arrow-cell">
                    <ChevronRight size={20} className="arrow-icon" />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </Layout>
  )
}
