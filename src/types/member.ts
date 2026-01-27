export interface Membership {
  id: string
  memberId: string
  membershipType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'LIFETIME' | 'PT_PACKAGE'
  purchaseDate: string
  expiryDate?: string
  status?: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED'
  price: number
  durationWeeks?: 4 | 8 | 12
  mainGoalType?: 'WEIGHT_LOSS' | 'STRENGTH_UP' | 'ENDURANCE' | 'MAINTENANCE'
  mainGoalLabel?: string
  targetValue?: number
  targetUnit?: string
  startValue?: number
  ptTotalCount?: number
  createdAt: string
  updatedAt: string
}

export interface Member {
  id: string
  name: string
  phone: string
  email?: string
  userId?: string
  gender?: 'MALE' | 'FEMALE'
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  birthDate?: string
  height?: number
  weight?: number
  joinDate: string
  createdAt: string
  updatedAt: string
  memberships?: Membership[] // 회원권 정보 (optional)
}

export interface CreateMemberDto {
  name: string
  phone: string
  email?: string
  joinDate: string
  birthDate?: string
  gender?: 'MALE' | 'FEMALE'
  height?: number
  weight?: number
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
}

export interface CreateMemberFullDto {
  name: string
  phone: string
  email?: string
  joinDate: string
  birthDate?: string
  gender?: 'MALE' | 'FEMALE'
  height?: number
  weight?: number
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  membership?: {
    membershipType: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'LIFETIME' | 'PT_PACKAGE'
    purchaseDate: string
    expiryDate?: string
    status?: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED'
    price: number
    durationWeeks?: 4 | 8 | 12
    mainGoalType?: 'WEIGHT_LOSS' | 'STRENGTH_UP' | 'ENDURANCE' | 'MAINTENANCE'
    mainGoalLabel?: string
    targetValue?: number
    targetUnit?: string
    startValue?: number
    ptTotalCount?: number
  }
  initialMeasurement?: {
    weight?: number
    muscleMass?: number
    bodyFat?: number
    benchPress1RM?: number
    squat1RM?: number
    deadlift1RM?: number
  }
}
