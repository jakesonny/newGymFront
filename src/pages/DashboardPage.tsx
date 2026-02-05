import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Layout, Card, Button, MetricCard } from '@/components'
import { Dumbbell, UtensilsCrossed, Lightbulb } from 'lucide-react'
import './DashboardPage.css'

interface TaskItem {
  id: string
  text: string
  completed: boolean
}

interface TaskCategory {
  id: string
  title: string
  icon: typeof Dumbbell
  tasks: TaskItem[]
}

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // 체크박스 상태 관리
  const [tasks, setTasks] = useState<TaskCategory[]>([
    {
      id: 'workout',
      title: '운동 가이드',
      icon: Dumbbell,
      tasks: [
        { id: 'workout-1', text: '스쿼트 5세트 (80kg)', completed: false },
        { id: 'workout-2', text: '인터벌 러닝 20분', completed: false },
        { id: 'workout-3', text: '폼롤러 스트레칭', completed: false },
      ],
    },
    {
      id: 'diet',
      title: '식단 체크',
      icon: UtensilsCrossed,
      tasks: [
        { id: 'diet-1', text: '점심: 닭가슴살 샐러드', completed: false },
        { id: 'diet-2', text: '물 2L 섭취하기', completed: false },
        { id: 'diet-3', text: '저녁: 일반식 1/2', completed: false },
      ],
    },
    {
      id: 'lifestyle',
      title: '생활 숙제',
      icon: Lightbulb,
      tasks: [
        { id: 'lifestyle-1', text: '수면 7시간 이상', completed: false },
        { id: 'lifestyle-2', text: '눈바디 사진 촬영', completed: false },
        { id: 'lifestyle-3', text: '체중계 올라가기', completed: false },
      ],
    },
  ])

  const handleTaskToggle = useCallback((categoryId: string, taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              tasks: category.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : category
      )
    )
  }, [])

  const handleAddTask = useCallback((categoryId: string) => {
    const newTaskText = prompt('새 항목을 입력하세요:')
    if (!newTaskText?.trim()) return

    setTasks((prevTasks) =>
      prevTasks.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              tasks: [
                ...category.tasks,
                {
                  id: `${categoryId}-${Date.now()}`,
                  text: newTaskText.trim(),
                  completed: false,
                },
              ],
            }
          : category
      )
    )
  }, [])

  // TODO: 실제 대시보드 API 연동 시 useAsyncData 사용
  // 회원 정보가 없을 때는 데이터를 표시하지 않음
  const hasMemberData = false // 실제로는 회원 정보 확인 후 설정

  return (
    <Layout>
      <div className="dashboard-page">
        {user?.role === 'ADMIN' && (
          <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" onClick={() => navigate('/center-dashboard')}>
              센터 대시보드 보기
            </Button>
          </div>
        )}

        <div className="dashboard-content">
          {!hasMemberData ? (
            <Card className="empty-state-card">
              <div className="empty-state">
                <h2>회원 정보가 없습니다</h2>
                <p>회원 등록 후 대시보드를 확인할 수 있습니다.</p>
                <Button variant="primary" onClick={() => navigate('/members/new')}>
                  회원 등록하기
                </Button>
              </div>
            </Card>
          ) : (
            <div className="dashboard-main">
              <Card className="progress-card">
                <div className="progress-header">
                  <div>
                    <div className="progress-value">-</div>
                    <div className="progress-goal">Goal: -</div>
                  </div>
                </div>
                <div className="progress-chart">
                  {/* 차트는 추후 구현 */}
                  <div className="chart-placeholder">진행 추이 그래프</div>
                </div>
              </Card>

              <div className="metric-cards">
                <MetricCard
                  title="BODY (체성분)"
                  score={0}
                  trend="up"
                  items={[]}
                  borderColor="success"
                />

                <MetricCard
                  title="STRENGTH (근력)"
                  score={0}
                  trend="up"
                  items={[]}
                  borderColor="success"
                />

                <MetricCard
                  title="CONDITIONING (체력)"
                  score={0}
                  trend="down"
                  items={[]}
                  borderColor="danger"
                />
              </div>

              <Card className="tasks-card">
                <div className="tasks-header">
                  <h2>오늘의 핵심 과제</h2>
                  <p className="tasks-subtitle">목표 달성을 위해 오늘 꼭 수행해야 할 리스트입니다.</p>
                </div>
                <div className="tasks-grid">
                  {tasks.map((category) => {
                    const Icon = category.icon
                    return (
                      <Card key={category.id} className="task-category">
                        <div className="task-category-header">
                          <Icon size={24} />
                          <h3>{category.title}</h3>
                        </div>
                        <ul className="task-list">
                          {category.tasks.map((task) => (
                            <li
                              key={task.id}
                              className={`task-item ${task.completed ? 'completed' : ''}`}
                            >
                              <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleTaskToggle(category.id, task.id)}
                              />
                              <span>{task.text}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="add-task-btn"
                          onClick={() => handleAddTask(category.id)}
                        >
                          + 항목 추가
                        </Button>
                      </Card>
                    )
                  })}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
