import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';

interface ReceiverDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  moncashPhoneNumber?: string;
}

interface StepTwoTransferProps {
  receiverDetails: ReceiverDetails;
  onDetailsChange: (details: ReceiverDetails) => void;
  transferDetails?: {
    deliveryMethod: string;
  };
}

const StepTwoTransfer: React.FC<StepTwoTransferProps> = ({ 
  receiverDetails, 
  onDetailsChange,
  transferDetails 
}) => {
  const handleInputChange = (field: keyof ReceiverDetails, value: string) => {
    const updatedDetails = {
      ...receiverDetails,
      [field]: value,
    };
    onDetailsChange(updatedDetails);
  };

  const isMonCashOrNatCash = transferDetails?.deliveryMethod === 'moncash' || transferDetails?.deliveryMethod === 'natcash';
  const paymentMethod = transferDetails?.deliveryMethod === 'moncash' ? 'MonCash' : 'NatCash';

  const inputClasses = "border-gray-300 focus:border-blue-500 focus:ring-blue-500 py-4 px-4 text-lg font-medium transition-colors h-14";
  const labelClasses = "text-lg font-bold text-gray-800 block mb-3";
  const prefixClasses = "flex items-center px-4 border border-r-0 border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100 rounded-l-lg py-4";

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Receiver Details</h2>
          <p className="text-gray-600">Please provide the recipient's information</p>
        </div>

        {/* Form Fields */}
        <div className="space-y-8">
          {/* Full Name */}
          <div>
            <Label htmlFor="firstName" className={labelClasses}>
              What's their full name?
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                type="text"
                placeholder="First name"
                value={receiverDetails.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={inputClasses}
              />
              <Input
                id="lastName"
                type="text"
                placeholder="Last name"
                value={receiverDetails.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Regular Phone Number */}
          {!isMonCashOrNatCash && (
            <div>
              <Label htmlFor="phoneNumber" className={labelClasses}>
                What's their phone number?
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg font-bold">+509</span>
                </div>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  value={receiverDetails.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className={`${inputClasses} pl-20`}
                />
              </div>
            </div>
          )}

          {/* MonCash/NatCash Phone Number */}
          {isMonCashOrNatCash && (
            <div>
              <Label htmlFor="moncashPhoneNumber" className={labelClasses}>
                What's their {paymentMethod} phone number?
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-lg font-bold">+509</span>
                </div>
                <Input
                  id="moncashPhoneNumber"
                  type="tel"
                  placeholder={`Enter ${paymentMethod} phone number`}
                  value={receiverDetails.moncashPhoneNumber || ''}
                  onChange={(e) => handleInputChange('moncashPhoneNumber', e.target.value)}
                  className={`${inputClasses} pl-20`}
                />
              </div>

              {/* Important Notice */}
              <div className="flex items-start space-x-3 p-4 mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Important Notice</p>
                  <p>
                    Please ensure the {paymentMethod} phone number is eligible to receive payments and the account is upgraded. 
                    Unverified or basic accounts may not be able to receive transfers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepTwoTransfer;