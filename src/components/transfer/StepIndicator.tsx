
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const totalSteps = 7;
  
  const stepTitles = [
    'Send Money', 
    'Transfer Details', 
    'Recipient Details', 
    'Review', 
    'Select Payment Method',
    'Payment',
    'Transfer Complete'
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-4">
        <div className="space-y-4">
          {/* Header with Step Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {stepTitles[currentStep - 1]}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex gap-1">
              {Array.from({ length: totalSteps }, (_, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;
                
                return (
                  <div
                    key={stepNumber}
                    className={`flex-1 h-2 rounded-full transition-all duration-500 ease-in-out ${
                      isCompleted || isCurrent
                        ? 'bg-red-600'
                        : 'bg-gray-200'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
