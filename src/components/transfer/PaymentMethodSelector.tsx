import React, { useEffect } from 'react';
import { TransferData } from '@/pages/MobileMultiStepTransferSheetPage';
import PaymentHeader from './PaymentHeader';
import MonCashPaymentInfo from './MonCashPaymentInfo';
import PayPalCheckoutForm from './PayPalCheckoutForm';

interface PaymentMethodSelectorProps {
  transferData: TransferData;
  onPaymentSubmit: () => void;
  isPaymentLoading: boolean;
  isPaymentFormValid: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  transferData,
  onPaymentSubmit,
  isPaymentLoading,
  isPaymentFormValid
}) => {
  const receiverAmount = transferData.amount ? (parseFloat(transferData.amount) * 127.5).toFixed(2) : '0.00';
  const receiverName = `${transferData.receiverDetails.firstName} ${transferData.receiverDetails.lastName}`;

  // Listen for form validation changes
  useEffect(() => {
    const handleFormValidation = (event: any) => {
      // Handle validation if needed
    };

    const handleEmailCapture = (event: any) => {
      // Handle email capture if needed
    };

    const handlePaymentSuccess = (event: any) => {
      // Handle payment success if needed
    };

    const handlePaymentError = (event: any) => {
      // Handle payment error if needed
    };

    window.addEventListener('paymentFormValidation', handleFormValidation);
    window.addEventListener('emailCaptured', handleEmailCapture);
    window.addEventListener('paymentSuccess', handlePaymentSuccess);
    window.addEventListener('paymentError', handlePaymentError);

    return () => {
      window.removeEventListener('paymentFormValidation', handleFormValidation);
      window.removeEventListener('emailCaptured', handleEmailCapture);
      window.removeEventListener('paymentSuccess', handlePaymentSuccess);
      window.removeEventListener('paymentError', handlePaymentError);
    };
  }, []);

  return (
    <div className="space-y-4">
      <PaymentHeader
        transferType={transferData.transferType}
        amount={transferData.amount}
        receiverAmount={receiverAmount}
        receiverName={receiverName}
      />

      {/* Payment Method Based on Transfer Type */}
      {transferData.transferType === 'national' ? (
        <MonCashPaymentInfo
          receiverAmount={receiverAmount}
          receiverName={receiverName}
        />
      ) : (
        <div className="space-y-3">
          {/* PayPal Checkout Container (Form) */}
          <PayPalCheckoutForm
            transferAmount={transferData.amount}
            onFormValidation={(isValid) => {
              // Handle form validation
            }}
            onEmailCapture={(email) => {
              // Handle email capture
            }}
            onPaymentSuccess={(orderDetails) => {
              // Handle payment success
            }}
            onPaymentError={(message) => {
              // Handle payment error
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
