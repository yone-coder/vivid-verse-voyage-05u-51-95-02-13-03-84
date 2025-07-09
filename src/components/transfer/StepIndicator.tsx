
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
    <div className="bg-white px-4 pt-4 pb-3">
      <div className="space-y-3">
        {/* Multiple Progress Bars */}
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
          
          {/* Current Step Info */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="font-medium text-red-600">
              {stepTitles[currentStep - 1]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
