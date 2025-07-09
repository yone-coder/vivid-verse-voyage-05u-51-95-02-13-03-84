
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface StepOneLocalTransferProps {
  amount: string;
  onAmountChange: (amount: string) => void;
}

const StepOneLocalTransfer: React.FC<StepOneLocalTransferProps> = ({ amount, onAmountChange }) => {
  const handleSendAmountChange = (value: string) => {
    onAmountChange(value);
  };

  const htgAmount = parseFloat(amount) || 0;
  const transferFee = htgAmount * 0.15; // 15% fee
  const totalAmount = htgAmount + transferFee;

  return (
    <div className="space-y-4">
      {/* Send Amount Input */}
      <div className="bg-white rounded-xl border border-blue-300 overflow-hidden">
        <div className="p-3 pb-2">
          <Label htmlFor="amount" className="text-xs font-bold text-blue-600 mb-2 block uppercase tracking-wide">
            Send Amount
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span className="text-blue-600 font-bold text-sm">HTG</span>
            </div>
            <Input
              id="amount"
              type="number"
              className="pl-12 pr-12 text-2xl font-light border-0 shadow-none focus-visible:ring-0 bg-transparent text-gray-900 placeholder-blue-300 placeholder:text-2xl placeholder:font-light h-12"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleSendAmountChange(e.target.value)}
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                HTG
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-200 p-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium">Transfer fee (15%)</span>
            <span className="font-bold text-blue-600">{transferFee.toFixed(2)} HTG</span>
          </div>
          <div className="border-t border-blue-100 pt-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800 text-sm">Total to pay</span>
              <span className="text-xl font-bold text-blue-600">
                {totalAmount.toFixed(2)} HTG
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepOneLocalTransfer;
