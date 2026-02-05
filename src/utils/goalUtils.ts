import { Flame, Dumbbell, HeartPulse, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type GoalType = 'WEIGHT_LOSS' | 'STRENGTH_UP' | 'ENDURANCE' | 'MAINTENANCE'

const GOAL_CONFIG: Record<GoalType, { label: string; icon: LucideIcon; className?: string }> = {
  WEIGHT_LOSS: { label: '체중 감량', icon: Flame, className: 'weight-loss' },
  STRENGTH_UP: { label: '근력 상승', icon: Dumbbell, className: 'strength-up' },
  ENDURANCE: { label: '체력 증진', icon: HeartPulse, className: 'endurance' },
  MAINTENANCE: { label: '유지', icon: TrendingUp, className: 'maintenance' },
}

export function getGoalLabel(goalType: string | null): string {
  if (!goalType || !(goalType in GOAL_CONFIG)) return '-'
  return GOAL_CONFIG[goalType as GoalType].label
}

export function getGoalIcon(goalType: string | null): LucideIcon | null {
  if (!goalType || !(goalType in GOAL_CONFIG)) return null
  return GOAL_CONFIG[goalType as GoalType].icon
}

export function getGoalClassName(goalType: string | null): string {
  if (!goalType || !(goalType in GOAL_CONFIG)) return ''
  return GOAL_CONFIG[goalType as GoalType].className ?? ''
}
