import { ReactNode, memo } from 'react'
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react'
import { Card } from './Card'
import './MetricCard.css'

interface MetricItem {
  label: string
  value: string
}

interface MetricCardProps {
  title: string
  score: number | string
  trend?: 'up' | 'down' | 'stable'
  items: MetricItem[]
  icon?: LucideIcon
  borderColor?: 'success' | 'danger' | 'warning' | 'primary'
}

export const MetricCard = memo(function MetricCard({ title, score, trend, items, icon: Icon, borderColor = 'success' }: MetricCardProps) {
  return (
    <Card className="metric-card" border="left" borderColor={borderColor}>
      <div className="metric-header">
        {Icon && <Icon size={24} />}
        <h3>{title}</h3>
        {trend && (
          <span className={`trend-badge trend-${trend}`}>
            {trend === 'up' ? <TrendingUp size={16} /> : trend === 'down' ? <TrendingDown size={16} /> : null}
            {trend === 'up' ? '개선' : trend === 'down' ? '하락' : '유지'}
          </span>
        )}
      </div>
      <div className="metric-score">{score} 점</div>
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
