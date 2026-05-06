import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, AlertCircle, Activity, ChevronRight } from 'lucide-react'
import { insightsService } from '@/services/insights.service'
import { Layout, Card, Loading, ErrorMessage, PageHeader, SearchInput } from '@/components'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useSearch } from '@/hooks/useSearch'
import type { CenterDashboard } from '@/types'
import './CenterDashboardPage.css'

interface CenterOverviewData {
  center: CenterDashboard
  riskMembers: Array<{
    memberId: string
    memberName: string
    riskType: 'DECLINE' | 'INJURY' | 'INACTIVE'
    description: string
  }>
  weeklySummary: {
    thisWeek: { totalScore: number }
    lastWeek: { totalScore: number }
    changes: { totalScore: number }
    percentageChange: { totalScore: number }
  }
}

export function CenterDashboardPage() {
  const navigate = useNavigate()

  const fetchCenterOverview = useCallback(async (): Promise<CenterOverviewData> => {
    const [center, riskMembers, weeklySummary] = await Promise.all([
      insightsService.getCenterDashboard(),
      insightsService.getRiskMembers(),
      insightsService.getWeeklySummary(),
    ])
    return {
      center,
      riskMembers,
      weeklySummary: {
        thisWeek: { totalScore: weeklySummary.thisWeek.totalScore },
        lastWeek: { totalScore: weeklySummary.lastWeek.totalScore },
        changes: { totalScore: weeklySummary.changes.totalScore },
        percentageChange: { totalScore: weeklySummary.percentageChange.totalScore },
      },
    }
  }, [])

  const { data, isLoading, error, refetch } = useAsyncData<CenterOverviewData>({
    fetchFn: fetchCenterOverview,
  })

  const { searchQuery, setSearchQuery, filteredData: filteredRisks } = useSearch({
    data: data?.riskMembers || [],
    searchFields: ['memberName', 'description'],
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

  return (
    <Layout>
      <div className="center-dashboard-page">
        <PageHeader
          title="센터현황"
          subtitle="운영 리스크와 주간 변화 신호를 우선 확인하세요."
        />

        <div className="summary-cards">
          <Card className="summary-card">
            <div className="summary-icon">
              <TrendingUp size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">전체 회원</div>
              <div className="summary-value">{data.center.summary.totalMembers}명</div>
            </div>
          </Card>
          <Card className="summary-card">
            <div className="summary-icon">
              <TrendingUp size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">위험 신호 회원</div>
              <div className="summary-value">{data.riskMembers.length}명</div>
            </div>
          </Card>
          <Card className="summary-card">
            <div className="summary-icon warning">
              <Activity size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">주간 총점 변화</div>
              <div className="summary-value">
                {data.weeklySummary.changes.totalScore >= 0 ? '+' : ''}
                {data.weeklySummary.changes.totalScore}점
              </div>
            </div>
          </Card>
          <Card className="summary-card">
            <div className="summary-icon danger">
              <AlertCircle size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">위험(Red) 회원</div>
              <div className="summary-value">{data.center.summary.riskCounts.red}명</div>
            </div>
          </Card>
          <Card className="summary-card">
            <div className="summary-icon">
              <TrendingUp size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">주간 변화율</div>
              <div className="summary-value">
                {data.weeklySummary.percentageChange.totalScore >= 0 ? '+' : ''}
                {data.weeklySummary.percentageChange.totalScore}%
              </div>
            </div>
          </Card>
        </div>

        <Card className="members-list-card">
          <div className="members-list-header">
            <h2 className="section-title">위험 신호 회원 리스트</h2>
            <SearchInput
              placeholder="회원명, 위험 사유 검색..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <div className="members-table">
            <div className="table-header">
              <div className="table-cell">회원명</div>
              <div className="table-cell">위험 유형</div>
              <div className="table-cell">사유</div>
              <div className="table-cell"></div>
            </div>

            {filteredRisks.length === 0 ? (
              <div className="empty-state">위험 신호 회원이 없습니다.</div>
            ) : (
              filteredRisks.map((member) => (
                <div
                  key={member.memberId}
                  className="table-row"
                  onClick={() => navigate(`/members/${member.memberId}`)}
                >
                  <div className="table-cell">{member.memberName}</div>
                  <div className="table-cell">
                    {member.riskType === 'DECLINE' ? '능력 하락' : member.riskType === 'INJURY' ? '부상 위험' : '비활성'}
                  </div>
                  <div className="table-cell">{member.description}</div>
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
