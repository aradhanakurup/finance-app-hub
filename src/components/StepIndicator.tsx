import React from 'react';

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export function StepIndicator({ steps, currentStep, onStepClick, className = '' }: StepIndicatorProps) {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep - 1;
            const isUpcoming = index > currentStep - 1;

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => onStepClick && onStepClick(step.id)}
                    disabled={!onStepClick || isUpcoming}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200
                      ${isCompleted 
                        ? 'bg-green-500 text-white shadow-lg' 
                        : isCurrent 
                        ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100' 
                        : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                      }
                      ${onStepClick && !isUpcoming ? 'cursor-pointer' : 'cursor-default'}
                    `}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </button>
                  
                  {/* Step Title */}
                  <div className="mt-2 text-center max-w-24">
                    <p className={`
                      text-xs font-medium transition-colors duration-200
                      ${isCompleted 
                        ? 'text-green-600' 
                        : isCurrent 
                        ? 'text-blue-600' 
                        : 'text-gray-500'
                      }
                    `}>
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-gray-400 mt-1 hidden sm:block">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4">
                    <div className={`
                      h-full transition-all duration-300
                      ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                    `} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 