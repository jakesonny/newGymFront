import './StepIndicator.css'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function StepIndicator({ currentStep, totalSteps, className = '' }: StepIndicatorProps) {
  return (
    <div className={`step-indicator ${className}`}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <span key={step} className={currentStep >= step ? 'active' : ''}>
          {step}
        </span>
      ))}
    </div>
  )
}
