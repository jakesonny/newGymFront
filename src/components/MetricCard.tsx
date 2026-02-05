import { memo } from 'react'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'
import { Card } from './Card'
import './MetricCard.css'

interface MetricItem {
  label: string
  value: string
}

interface MetricCardProps {
  title: string
  /** 없으면 "데이터 없음" 표시 (임의 값 0 사용 안 함) */
  score: number | null
  trend?: 'up' | 'down' | 'stable'
  items: MetricItem[]
  icon?: LucideIcon
  borderColor?: 'success' | 'danger' | 'warning' | 'primary'
}

export const MetricCard = memo(function MetricCard({ title, score, trend, items, icon: Icon, borderColor = 'success' }: MetricCardProps) {
  const hasScore = score !== null && score !== undefined
  return (
    <Card className="metric-card" border="left" borderColor={borderColor}>
      <div className="metric-header">
        {Icon && <Icon size={24} />}
        <h3>{title}</h3>
        {hasScore && trend && (
          <span className={`trend-badge trend-${trend}`}>
            {trend === 'up' ? <TrendingUp size={16} /> : trend === 'down' ? <TrendingDown size={16} /> : null}
            {trend === 'up' ? '개선' : trend === 'down' ? '하락' : '유지'}
          </span>
        )}
      </div>
      <div className="metric-score">{hasScore ? `${score} 점` : '데이터 없음'}</div>
      <div className="metric-details">
        {items.map((item, index) => (
          <div key={index} className="metric-item">
            <span className="metric-label">{item.label}</span>
            <span className="metric-value">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  )
})
