
import React from 'react';
import { TransferData } from '@/components/desktop/DesktopMultiStepTransferPage';
import TransferTypeSelector from '@/components/transfer/TransferTypeSelector';
import StepOneTransfer from '@/components/transfer/StepOneTransfer';
import StepOneLocalTransfer from '@/components/transfer/StepOneLocalTransfer';
import StepOnePointFiveTransfer from '@/components/transfer/StepOnePointFiveTransfer';
import StepTwoTransfer from '@/components/transfer/StepTwoTransfer';
import TransferSummary from '@/components/transfer/TransferSummary';
import PaymentMethodSelection from '@/components/transfer/PaymentMethodSelection';
import PaymentMethodSelector from '@/components/transfer/PaymentMethodSelector';
import TransferReceipt from '@/components/transfer/TransferReceipt';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

interface DesktopStepContentProps {
  currentStep: number;
  transferData: TransferData;
  updateTransferData: (data: Partial<TransferData>) => void;
  onPaymentSubmit: () => void;
  isPaymentLoading: boolean;
  isPaymentFormValid: boolean;
  setIsPaymentFormValid: (isValid: boolean) => void;
  transactionId: string;
  userEmail: string;
  receiptRef: React.RefObject<HTMLDivElement>;
  generateReceiptImage: () => void;
}

const DesktopStepContent: React.FC<DesktopStepContentProps> = ({
  currentStep,
  transferData,
  updateTransferData,
  onPaymentSubmit,
  isPaymentLoading,
  isPaymentFormValid,
  setIsPaymentFormValid,
  transactionId,
  userEmail,
  receiptRef,
  generateReceiptImage
}) => {
  const navigate = useNavigate();

  switch (currentStep) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Money</h2>
            <p className="text-gray-600">Enter the amount you want to send</p>
          </div>

          <TransferTypeSelector
            transferType={transferData.transferType || 'international'}
            onTransferTypeChange={(type) => updateTransferData({ transferType: type })}
            disableNavigation={true}
          />

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
      );

    case 2:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Details</h2>
            <p className="text-gray-600">Choose transfer details</p>
          </div>

          <StepOnePointFiveTransfer
            transferDetails={transferData.transferDetails}
            onTransferDetailsChange={(transferDetails) => updateTransferData({ transferDetails })}
          />
        </div>
      );

    case 3:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipient Details</h2>
            <p className="text-gray-600">Who are you sending ${transferData.amount} to?</p>
          </div>

          <StepTwoTransfer
            receiverDetails={transferData.receiverDetails}
            onDetailsChange={(receiverDetails) => updateTransferData({ receiverDetails })}
            transferDetails={transferData.transferDetails}
          />
        </div>
      );

    case 4:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Transfer</h2>
            <p className="text-gray-600">Please review your transfer details</p>
          </div>

          <TransferSummary
            transferData={transferData}
          />
        </div>
      );

    case 5:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Payment Method</h2>
            <p className="text-gray-600">Choose how you'd like to pay</p>
          </div>

          <PaymentMethodSelection
            selectedMethod={transferData.selectedPaymentMethod || 'credit-card'}
            onMethodSelect={(method) => updateTransferData({ selectedPaymentMethod: method })}
            transferType={transferData.transferType}
          />
        </div>
      );

    case 6:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment</h2>
            <p className="text-gray-600">Complete your payment</p>
          </div>

          <PaymentMethodSelector
            transferData={transferData}
            onPaymentSubmit={onPaymentSubmit}
            isPaymentLoading={isPaymentLoading}
            isPaymentFormValid={isPaymentFormValid}
          />
        </div>
      );

    case 7:
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-2">Transfer Complete!</h2>
            <p className="text-gray-600">Your money transfer has been processed successfully</p>
          </div>

          <TransferReceipt
            ref={receiptRef}
            transferData={transferData}
            transactionId={transactionId}
            userEmail={userEmail}
          />

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={generateReceiptImage}
              className="px-8"
            >
              Share Receipt
            </Button>
            <Button
              onClick={() => navigate('/for-you')}
              className="px-8"
            >
              Done
            </Button>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default DesktopStepContent;
