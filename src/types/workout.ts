export enum WorkoutType {
  PT = 'PT',
  PERSONAL = 'PERSONAL',
}

export interface WorkoutRecord {
  id: string
  userId: string
  memberId?: string
  exerciseId: string
  exerciseName: string
  weight: number
  reps: number
  sets: number
  volume: number
  oneRepMax: number
  workoutDate: string
  workoutType: WorkoutType
  createdAt: string
  updatedAt: string
}

export interface CreateWorkoutRecordDto {
  workoutDate: string
  bodyPart: string
  exerciseName: string
  weight?: number
  reps?: number
  sets?: number
  workoutType?: WorkoutType
  duration?: number
  ptSessionId?: string
  trainerComment?: string
  userId?: string
}

export interface OneRepMax {
  exerciseName: string
  latest: {
    oneRepMax: number
    date: string
  }
  best: {
    oneRepMax: number
    date: string
  }
  history: Array<{
    date: string
    oneRepMax: number
  }>
}

export interface MajorExercisesOneRepMax {
  benchPress: OneRepMax | null
  squat: OneRepMax | null
  deadlift: OneRepMax | null
}

export interface MajorExercisesOneRepMaxResponse {
  exercises: Array<{
    exerciseName: string
    exerciseNameEn: string
    category: 'UPPER' | 'LOWER' | 'FULL_BODY'
    isSubstitute: boolean
    current: {
      oneRepMax: number
      relativeStrength: number
      strengthLevel: string | null
      workoutDate: string
    } | null
    best: {
      oneRepMax: number
      relativeStrength: number
      strengthLevel: string | null
      workoutDate: string
    } | null
    history: Array<{
      oneRepMax: number
      workoutDate: string
      strengthLevel: string | null
    }>
  }>
}
