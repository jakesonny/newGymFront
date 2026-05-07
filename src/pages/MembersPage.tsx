import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Plus, Users, UserCheck, ChevronRight } from 'lucide-react'
import { insightsService } from '@/services/insights.service'
import { Layout, Card, Button, Loading, ErrorMessage, PageHeader, SearchInput, StatusBadge, NewMemberModal } from '@/components'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useSearch } from '@/hooks/useSearch'
import { getGoalLabel, getGoalIcon, getGoalClassName } from '@/utils/goalUtils'
import type { CenterDashboard } from '@/types'
import './MembersPage.css'

export function MembersPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showNewMemberModal, setShowNewMemberModal] = useState(false)

  useEffect(() => {
    if (location.state?.openNewMemberModal) {
      setShowNewMemberModal(true)
      navigate('/members', { replace: true, state: {} })
    }
  }, [location.state?.openNewMemberModal, navigate])

  const fetchCenterDashboard = useCallback(() => {
    return insightsService.getCenterDashboard()
  }, [])

  const { data, isLoading, error, refetch } = useAsyncData<CenterDashboard>({
    fetchFn: fetchCenterDashboard,
  })

  const { searchQuery, setSearchQuery, filteredData: filteredMembers } = useSearch({
    data: data?.memberList || [],
    searchFields: ['name', 'phone'],
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
      <div className="members-page">
        <PageHeader
          title="회원 관리"
          subtitle="회원 등록, 수정, 상세 진입 등 운영 작업을 수행하세요."
          actions={
            <Button variant="primary" onClick={() => setShowNewMemberModal(true)}>
              <Plus size={20} />
              회원 추가
            </Button>
          }
        />

        <div className="summary-cards">
          <Card className="summary-card">
            <div className="summary-icon">
              <Users size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">전체 회원</div>
              <div className="summary-value">{data.summary.totalMembers}명</div>
            </div>
          </Card>
          <Card className="summary-card">
            <div className="summary-icon">
              <UserCheck size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">활동 회원</div>
              <div className="summary-value">{data.summary.activeMembers}명</div>
            </div>
          </Card>
          <Card className="summary-card">
            <div className="summary-icon warning">
              <Users size={24} />
            </div>
            <div className="summary-content">
              <div className="summary-label">비활동 회원</div>
              <div className="summary-value">{Math.max(0, data.summary.totalMembers - data.summary.activeMembers)}명</div>
            </div>
          </Card>
        </div>

        <Card className="members-list-card">
          <div className="members-list-header">
            <h2 className="section-title">회원 목록</h2>
            <SearchInput
              placeholder="회원명, 전화번호로 검색..."
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
                    {(() => {
                      const goalType = member.program?.mainGoalType || null
                      const Icon = getGoalIcon(goalType)
                      return Icon ? <Icon size={18} className={`goal-icon ${getGoalClassName(goalType)}`} /> : null
                    })()}
                    <span>
                      {member.program
                        ? (member.program.mainGoal || getGoalLabel(member.program.mainGoalType || null))
                        : '-'}
                    </span>
                  </div>
                  <div className="table-cell">
                    {member.program?.durationWeeks ? `${member.program.durationWeeks}주` : '-'}
                  </div>
                  <div className="table-cell">
                    {member.program ? `${member.program.currentProgress || 0}%` : '-'}
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

        <NewMemberModal
          isOpen={showNewMemberModal}
          onClose={() => setShowNewMemberModal(false)}
          onSuccess={refetch}
        />
      </div>
    </Layout>
  )
}
