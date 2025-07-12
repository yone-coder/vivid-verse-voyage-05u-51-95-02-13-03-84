
import React, { useEffect } from 'react';
import { TransferData } from '@/pages/MobileMultiStepTransferSheetPage';
import StepOneTransfer from './StepOneTransfer';
import StepOneLocalTransfer from './StepOneLocalTransfer';
import StepOnePointFiveTransfer from './StepOnePointFiveTransfer';
import StepTwoTransfer from './StepTwoTransfer';
import StepTwoPointFiveTransfer from './StepTwoPointFiveTransfer';
import TransferSummary from './TransferSummary';
import PaymentMethodSelection from './PaymentMethodSelection';
import PaymentMethodSelector from './PaymentMethodSelector';
import TransferReceipt from './TransferReceipt';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StepContentProps {
  currentStep: number;
  transferData: TransferData;
  updateTransferData: (data: Partial<TransferData>) => void;
  onPaymentSubmit: () => void;
  isPaymentLoading: boolean;
  isPaymentFormValid: boolean;
  transactionId: string;
  userEmail: string;
  receiptRef: React.RefObject<HTMLDivElement>;
  generateReceiptImage: () => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  canProceed: boolean;
}

const StepContent: React.FC<StepContentProps> = ({
  currentStep,
  transferData,
  updateTransferData,
  onPaymentSubmit,
  isPaymentLoading,
  isPaymentFormValid,
  transactionId,
  userEmail,
  receiptRef,
  generateReceiptImage,
  onNextStep,
  onPreviousStep,
  canProceed
}) => {
  const navigate = useNavigate();

  // Debug logging for step 4
  useEffect(() => {
    if (currentStep === 4) {
      console.log('Step 4 - Transfer Summary rendering');
      console.log('Transfer data for summary:', transferData);
    }
  }, [currentStep, transferData]);

  // Helper function to get button text based on step
  const getButtonText = () => {
    if (currentStep === 7) {
      if (isPaymentLoading) {
        return transferData.transferType === 'national' ? 'Processing MonCash Payment...' : 'Processing...';
      }
      return transferData.transferType === 'national' 
        ? `Pay HTG ${(parseFloat(transferData.amount) * 127.5).toFixed(2)} with MonCash`
        : `Pay $${(parseFloat(transferData.amount) + Math.ceil(parseFloat(transferData.amount) / 100) * 15).toFixed(2)}`;
    }
    if (currentStep === 1) return 'Continue';
    if (currentStep === 8) return 'Done';
    return 'Next';
  };

  // Helper function to get button color based on step
  const getButtonColor = () => {
    if (currentStep === 7) {
      return transferData.transferType === 'national' 
        ? 'bg-red-600 hover:bg-red-700' 
        : 'bg-green-600 hover:bg-green-700';
    }
    return 'bg-slate-500 hover:bg-slate-600';
  };

  // Helper function to render sticky continue buttons for steps 1-7
  const renderContinueButtons = () => {
    if (currentStep >= 8) return null; // No buttons for final step

    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 shadow-lg">
        <div className="flex items-center gap-3 max-w-md mx-auto">
          {/* Back Button */}
          {currentStep > 1 && (
            <button 
              onClick={onPreviousStep}
              className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          
          {/* Continue/Pay Button */}
          <Button 
            onClick={currentStep === 7 ? onPaymentSubmit : onNextStep}
            disabled={
              !canProceed || 
              isPaymentLoading || 
              (currentStep === 7 && transferData.transferType === 'international' && !isPaymentFormValid)
            }
            className={`flex-1 h-12 rounded-full font-semibold text-white transition-colors duration-200 ${getButtonColor()}`}
          >
            {getButtonText()}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-4">
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="text-center">
              <h1 className="text-2xl font-medium text-gray-900 mb-1">
                How much are you sending?
              </h1>
              <p className="text-sm text-gray-600">Enter the amount you want to send</p>
            </div>

            {transferData.transferType === 'national' ? (
              <StepOneLocalTransfer
                amount={transferData.amount}
                onAmountChange={(amount) => updateTransferData({ amount })}
              />
            ) : (
              <StepOneTransfer
                amount={transferData.amount}
                onAmountChange={(amount) => updateTransferData({ amount })}
              />
            )}
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-gray-900 mb-1">
              How should they receive it?
            </h1>
            <p className="text-sm text-gray-600">
              Choose your preferred delivery method
            </p>
          </div>
          
          <StepOnePointFiveTransfer
            transferDetails={transferData.transferDetails}
            onTransferDetailsChange={(transferDetails) => updateTransferData({ transferDetails })}
          />
        </div>
      )}

      {currentStep === 3 && (
        <StepTwoTransfer
          receiverDetails={transferData.receiverDetails}
          onDetailsChange={(receiverDetails) => updateTransferData({ receiverDetails })}
          transferDetails={transferData.transferDetails}
        />
      )}

      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-gray-900 mb-1">
              Where should we deliver it?
            </h1>
            <p className="text-sm text-gray-600">Complete the delivery address details</p>
          </div>

          <StepTwoPointFiveTransfer
            receiverDetails={transferData.receiverDetails}
            onDetailsChange={(receiverDetails) => updateTransferData({ receiverDetails })}
          />
        </div>
      )}

      {currentStep === 5 && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-medium text-gray-900 mb-1">
              Does everything look right?
            </h1>
            <p className="text-sm text-gray-600">Review your transfer details before proceeding</p>
          </div>

          <TransferSummary
            transferData={{
              ...transferData,
              transferType: transferData.transferType || 'international'
            }}
          />
          
          {/* Debug info for step 4 */}
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <p>Debug: Step 4 rendered successfully</p>
            <p>Amount: {transferData.amount}</p>
            <p>Recipient: {transferData.receiverDetails.firstName} {transferData.receiverDetails.lastName}</p>
            <p>Transfer Type: {transferData.transferType || 'international'}</p>
          </div>
        </div>
      )}

      {currentStep === 6 && (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-medium text-gray-900 mb-1">
              How would you like to pay?
            </h1>
            <p className="text-sm text-gray-600">
              Choose your preferred payment method
            </p>
          </div>
          
          <PaymentMethodSelection
            selectedMethod={transferData.selectedPaymentMethod || 'credit-card'}
            onMethodSelect={(method) => updateTransferData({ selectedPaymentMethod: method })}
            transferType={transferData.transferType}
          />
        </div>
      )}

      {currentStep === 7 && (
        <PaymentMethodSelector
          transferData={transferData}
          onPaymentSubmit={onPaymentSubmit}
          isPaymentLoading={isPaymentLoading}
          isPaymentFormValid={isPaymentFormValid}
        />
      )}

      {currentStep === 8 && (
        <div className="space-y-4">
          <TransferReceipt
            ref={receiptRef}
            transferData={transferData}
            transactionId={transactionId}
            userEmail={userEmail}
          />

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={generateReceiptImage}
              className="flex-1"
            >
              Share Receipt
            </Button>
            <Button
              onClick={() => navigate('/for-you')}
              className="flex-1"
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* Continue Buttons for all steps except final receipt step */}
      {renderContinueButtons()}
    </div>
  );
};

export default StepContent;
