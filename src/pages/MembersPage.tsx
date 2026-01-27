import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Flame, Dumbbell, HeartPulse, TrendingUp } from 'lucide-react'
import { membersService } from '@/services/members.service'
import { Layout, Card, Button, Loading, ErrorMessage, SearchInput, StatusBadge } from '@/components'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useSearch } from '@/hooks/useSearch'
import { formatDate } from '@/utils/dateFormatter'
import type { Member } from '@/types'
import './MembersPage.css'

export function MembersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const pageSize = 10

  const fetchMembers = useCallback(() => {
    return membersService.getAll(page, pageSize)
  }, [page, pageSize])

  const { data, isLoading, error, refetch } = useAsyncData<{ data: Member[]; total: number }>({
    fetchFn: fetchMembers,
    dependencies: [page],
  })

  const { searchQuery, setSearchQuery, filteredData: filteredMembers } = useSearch({
    data: data?.data || [],
    searchFields: ['name', 'phone', 'email'],
  })

  // totalPages 계산만 useMemo로 메모이제이션
  const totalPages = useMemo(() => {
    if (!data) return 0
    return Math.ceil(data.total / pageSize)
  }, [data?.total, pageSize])

  const handlePrevPage = useCallback(() => {
    setPage((p) => Math.max(1, p - 1))
  }, [])

  const handleNextPage = useCallback(() => {
    setPage((p) => Math.min(totalPages, p + 1))
  }, [totalPages])

  // GoalType에 따른 아이콘과 라벨 매핑
  const getGoalIcon = (goalType: string | null | undefined) => {
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

  const getGoalLabel = (goalType: string | null | undefined) => {
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

  // 회원의 활성 회원권에서 GoalType 가져오기
  const getMemberGoalType = (member: Member) => {
    if (!member.memberships || member.memberships.length === 0) return null
    // 활성 회원권 중 첫 번째의 mainGoalType 반환
    const activeMembership = member.memberships.find(
      (m) => m.status === 'ACTIVE' || !m.status
    )
    return activeMembership?.mainGoalType || null
  }

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
        <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="section-title">회원 목록</h2>
          <Button variant="primary" onClick={() => navigate('/members/new')}>
            <Plus size={20} />
            회원 추가
          </Button>
        </div>

        <Card className="members-card">
          <div className="members-search">
            <SearchInput
              placeholder="회원명, 전화번호, 이메일로 검색..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <div className="members-table">
            <div className="table-header">
              <div className="table-cell">이름</div>
              <div className="table-cell">핵심 목표</div>
              <div className="table-cell">전화번호</div>
              <div className="table-cell">이메일</div>
              <div className="table-cell">상태</div>
              <div className="table-cell">가입일</div>
              <div className="table-cell">작업</div>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="empty-state">회원이 없습니다.</div>
            ) : (
              filteredMembers.map((member) => {
                const goalType = getMemberGoalType(member)
                return (
                  <div key={member.id} className="table-row">
                    <div className="table-cell">{member.name}</div>
                    <div className="table-cell goal-cell">
                      {getGoalIcon(goalType)}
                      <span>{getGoalLabel(goalType)}</span>
                    </div>
                    <div className="table-cell">{member.phone}</div>
                    <div className="table-cell">{member.email || '-'}</div>
                    <div className="table-cell">
                      <StatusBadge status={member.status || 'ACTIVE'} type="member" />
                    </div>
                    <div className="table-cell">
                      {formatDate(member.joinDate)}
                    </div>
                    <div className="table-cell">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/members/${member.id}`)}
                      >
                        상세보기
                      </Button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {data.total > pageSize && (
            <div className="pagination">
              <Button
                variant="outline"
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                이전
              </Button>
              <span className="page-info">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={page >= totalPages}
              >
                다음
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  )
}
