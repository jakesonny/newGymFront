// 공통 타입 정의
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: unknown
  }
}

export * from './auth'
export * from './member'
export * from './workout'

// 기존 index.ts에 있던 나머지 타입들... (PTSession, Assessment 등)
export interface PTSession {
  id: string
  memberId: string
  sessionNumber: number
  sessionDate: string
  mainContent: string
  trainerComment?: string
  membershipId?: string
  measuredWeight?: number
  measuredMuscleMass?: number
  measuredBodyFat?: number
  benchPress1RM?: number
  squat1RM?: number
  deadlift1RM?: number
  stepTestTime?: number
  createdAt: string
  updatedAt: string
}

export interface AbilitySnapshot {
  id: string
  memberId: string
  assessedAt: string
  totalScore: number
  lowerBodyStrength: number
  cardiorespiratoryEndurance: number
  muscularEndurance: number
  flexibility: number
  bodyComposition: number
  stability: number
}

export interface HexagonData {
  indicators: {
    lowerBodyStrength: number
    cardiorespiratoryEndurance: number
    muscularEndurance: number
    flexibility: number
    bodyComposition: number
    stability: number
  }
  initialIndicators?: {
    lowerBodyStrength: number
    cardiorespiratoryEndurance: number
    muscularEndurance: number
    flexibility: number
    bodyComposition: number
    stability: number
  }
}

export interface GoalAnalyst {
  program: {
    mainGoal: string | null
    mainGoalType: string | null
    durationWeeks: number | null
    startValue: number | null
    currentValue: number | null
    targetValue: number | null
    targetUnit: string | null
    currentProgress: number
    riskStatus: 'FOUNDATION' | 'GREEN' | 'YELLOW' | 'RED'
    startDate: string | null
    endDate: string | null
    isRapidProgress: boolean
    isMeasurementOverdue: boolean
    lastMeasurementAt: string | null
  }
  progressRoadmap: {
    start: { value: number; date: string } | null
    current: { value: number; date: string } | null
    goal: { value: number; date: string } | null
  }
  trend: {
    direction: 'UP' | 'DOWN' | 'STABLE'
    recentValues: Array<{ date: string; value: number }>
    averageChange: number
  }
  nextTarget: {
    value: number | null
    description: string | null
  }
  sessionProgress: {
    totalSessions: number
    completedSessions: number
    progressPercentage: number
  }
}

export interface CenterDashboard {
  summary: {
    totalMembers: number
    activeMembers: number
    averageProgress: number
    riskCounts: {
      foundation: number
      green: number
      yellow: number
      red: number
    }
    missingMeasurements: number
  }
  memberList: Array<{
    id: string
    name: string
    phone: string
    status: string
    riskStatus: 'FOUNDATION' | 'GREEN' | 'YELLOW' | 'RED'
    program: {
      mainGoal: string | null
      mainGoalType: 'WEIGHT_LOSS' | 'STRENGTH_UP' | 'ENDURANCE' | 'MAINTENANCE' | null
      currentProgress: number
      durationWeeks: number | null
      startDate: string | null
      endDate: string | null
    } | null
    lastAssessmentDate: string | null
    completedSessions: number
    totalSessions: number
  }>
}

export interface StrengthLevelRequest {
  exerciseType: 'BENCH_PRESS' | 'SQUAT' | 'DEADLIFT'
  age: number
  bodyWeight: number
  gender: 'MALE' | 'FEMALE'
  currentWeight?: number
}

export interface StrengthLevelData {
  exercise: {
    type: string
    nameKorean: string
    nameEnglish: string
  }
  input: {
    age: number
    bodyWeight: number
    gender: string
    currentWeight?: number
  }
  currentLevel?: {
    level: string
    levelKorean: string
    weight: number
    weightToNextLevel: number
    nextLevel?: string
    nextLevelKorean?: string
  }
  allLevels: Array<{
    level: string
    levelKorean: string
    weight: number
    description: string
    isCurrent: boolean
    isNext: boolean
  }>
}

export interface StrengthLevelResponse {
  success: boolean
  data: StrengthLevelData
}

// 서비스 연동용 타입 (API 응답 구조)
export interface MemberAnalytics {
  lowerBodyStrength: number
  cardiorespiratoryEndurance: number
  muscularEndurance: number
  flexibility: number
  bodyComposition: number
  stability: number
  totalScore: number
}

export interface Assessment {
  id: string
  memberId: string
  assessmentType: string
  assessedAt: string
  items?: Array<{ category: string; grade?: string; details?: Record<string, unknown> }>
  [key: string]: unknown
}

export interface InjuryHistory {
  id: string
  memberId: string
  date: string
  description?: string
  injuryType?: string
  bodyPart?: string
  severity?: string
  recoveryStatus?: string
  [key: string]: unknown
}

export interface InjuryRestriction {
  id: string
  injuryId: string
  restrictedCategory: string
  [key: string]: unknown
}

export interface Goal {
  id?: string
  goalType?: string
  targetValue?: number
  trainerComment?: string
  progress?: number
  completedSessions?: number
  [key: string]: unknown
}

export interface Dashboard {
  goal: {
    goal?: string
    goalProgress: number
    goalTrainerComment?: string
  }
  sessionProgress: {
    totalSessions: number
    completedSessions: number
    progressPercentage: number
  }
  workoutCalendar: Array<{
    date: string
    ptSessions: Array<{ id: string; sessionNumber: number; mainContent: string }>
    personalWorkouts: Array<{ id: string; exerciseName: string; bodyPart: string }>
  }>
  workoutAnalysis: {
    period: 'week' | 'month'
    bodyPartVolumes: Array<{ bodyPart: string; volume: number }>
    totalVolume: number
  }
}

export interface PTUsage {
  id: string
  memberId: string
  totalCount: number
  usedCount: number
  remainingCount: number
  lastUsedDate?: string
  [key: string]: unknown
}

export interface WorkoutVolume {
  bodyPart: string
  volume: number
  [key: string]: unknown
}

export interface TrendData {
  labels?: string[]
  data?: number[]
  datasets?: Array<{ label?: string; data: number[] }>
  [key: string]: unknown
}

export interface WorkoutRoutine {
  id: string
  memberId?: string
  routineName: string
  routineDate?: string
  exercises: Array<{
    exerciseName: string
    bodyPart?: string
    sets?: number
    reps?: number
    weight?: number
    duration?: number
    restTime?: number
    notes?: string
  }>
  estimatedDuration: number
  [key: string]: unknown
}
