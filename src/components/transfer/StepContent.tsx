
import React, { useEffect } from 'react';
import { TransferData } from '@/pages/MobileMultiStepTransferSheetPage';
import StepOneTransfer from './StepOneTransfer';
import StepOneLocalTransfer from './StepOneLocalTransfer';
import StepOnePointFiveTransfer from './StepOnePointFiveTransfer';
import StepTwoTransfer from './StepTwoTransfer';
import TransferSummary from './TransferSummary';
import PaymentMethodSelection from './PaymentMethodSelection';
import PaymentMethodSelector from './PaymentMethodSelector';
import TransferReceipt from './TransferReceipt';
import { Button } from "@/components/ui/button";
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
  generateReceiptImage
}) => {
  const navigate = useNavigate();

  // Debug logging for step 4
  useEffect(() => {
    if (currentStep === 4) {
      console.log('Step 4 - Transfer Summary rendering');
      console.log('Transfer data for summary:', transferData);
    }
  }, [currentStep, transferData]);

  return (
    <div className="px-4 py-4">
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-gray-600">Enter the amount you want to send</p>
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
          <div className="text-center mb-4">
            <p className="text-gray-600">Choose transfer details</p>
          </div>

          <StepOnePointFiveTransfer
            transferDetails={transferData.transferDetails}
            onTransferDetailsChange={(transferDetails) => updateTransferData({ transferDetails })}
          />
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-gray-600">Who are you sending ${transferData.amount} to?</p>
          </div>

          <StepTwoTransfer
            receiverDetails={transferData.receiverDetails}
            onDetailsChange={(receiverDetails) => updateTransferData({ receiverDetails })}
            transferDetails={transferData.transferDetails}
          />
        </div>
      )}

      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-gray-600">Review your transfer details</p>
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

      {currentStep === 5 && (
        <div className="space-y-4">
          <PaymentMethodSelection
            selectedMethod={transferData.selectedPaymentMethod || 'credit-card'}
            onMethodSelect={(method) => updateTransferData({ selectedPaymentMethod: method })}
            transferType={transferData.transferType}
          />
        </div>
      )}

      {currentStep === 6 && (
        <PaymentMethodSelector
          transferData={transferData}
          onPaymentSubmit={onPaymentSubmit}
          isPaymentLoading={isPaymentLoading}
          isPaymentFormValid={isPaymentFormValid}
        />
      )}

      {currentStep === 7 && (
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
    </div>
  );
};

export default StepContent;
