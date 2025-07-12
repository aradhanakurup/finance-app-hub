interface Step {
  id: number
  title: string
  description: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick: (step: number) => void
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <button
                onClick={() => onStepClick(step.id)}
                disabled={step.id > currentStep}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step.id < currentStep
                    ? 'bg-green-500 text-white'
                    : step.id === currentStep
                    ? 'bg-green-600 text-white ring-4 ring-green-200'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {step.id < currentStep ? '✓' : step.id}
              </button>
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${
                  step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 ${
                step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 