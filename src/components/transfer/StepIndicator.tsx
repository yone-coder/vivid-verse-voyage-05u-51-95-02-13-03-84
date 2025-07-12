import React from 'react';
import { ChevronLeft, HelpCircle } from 'lucide-react'; // Import the help icon

interface StepIndicatorProps {
  currentStep: number;
  onBack?: () => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, onBack }) => {
  const totalSteps = 8;
  
  const stepTitles = [
    'Amount', 
    'Delivery Method', 
    'Recipient Info',
    'Delivery Address', 
    'Review Transfer', 
    'Payment Method',
    'Complete Payment',
    'Transfer Complete'
  ];

  return (
    <div className="bg-white">
      <div className="px-4 py-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 flex justify-start">
              {currentStep > 1 && onBack && (
                <button 
                  onClick={onBack}
                  className="flex items-center justify-center w-10 h-10 bg-transparent text-gray-600"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="flex-1 text-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {stepTitles[currentStep - 1]}
              </h1>
              {/* Removed the line displaying the current step */}
              {/* <p className="text-sm text-gray-600 mt-1">
                Step {currentStep} of {totalSteps}
              </p> */}
            </div>

            {/* Help icon on the right */}
            <div className="w-10 flex justify-end">
              <HelpCircle className="w-5 h-5 text-gray-600" />
            </div>
          </div>
          
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