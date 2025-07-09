
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, Send,CreditCard, ArrowRight, ArrowDownLeft, ArrowUpRight, TrendingUp, Clock } from 'lucide-react';
import { getAllExchangeRates, CurrencyRates } from '@/utils/currencyConverter';

interface StepOneTransferProps {
  amount: string;
  onAmountChange: (amount: string) => void;
}

const StepOneTransfer: React.FC<StepOneTransferProps> = ({ amount, onAmountChange }) => {
  const [receiverAmount, setReceiverAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [liveRates, setLiveRates] = useState<CurrencyRates>({
    USD: 127.5,
    EUR: 144.8,
    GBP: 168.2,
    CAD: 97.3,
    AUD: 86.1,
    CHF: 147.9,
    JPY: 0.89
  });
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [lastEditedField, setLastEditedField] = useState<'send' | 'receive'>('send');

  // Currency options
  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }
  ];

  // Fetch live rates on component mount
  useEffect(() => {
    const fetchLiveRates = async () => {
      setIsLoadingRates(true);
      try {
        const rateData = await getAllExchangeRates();
        setLiveRates(rateData.rates);
        setLastUpdated(rateData.lastUpdated);
        setIsLive(rateData.isLive);
        console.log('Live exchange rates fetched:', rateData.rates);
      } catch (error) {
        console.error('Failed to fetch live exchange rates:', error);
        // Keep the default fallback rates
      } finally {
        setIsLoadingRates(false);
      }
    };

    fetchLiveRates();
  }, []);

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency) || currencies[0];
  const currentRate = liveRates[selectedCurrency] || 127.5;

  // Update receiver amount when send amount or rate changes (but not when user is editing receiver)
  useEffect(() => {
    if (lastEditedField === 'send') {
      const sendAmount = parseFloat(amount) || 0;
      const htgAmount = sendAmount * currentRate;
      setReceiverAmount(htgAmount.toFixed(2));
    }
  }, [amount, currentRate, lastEditedField]);

  // Update send amount when receiver amount or rate changes (but not when user is editing sender)
  useEffect(() => {
    if (lastEditedField === 'receive' && receiverAmount) {
      const htgAmount = parseFloat(receiverAmount) || 0;
      const sendAmount = htgAmount / currentRate;
      onAmountChange(sendAmount.toFixed(2));
    }
  }, [receiverAmount, currentRate, lastEditedField, onAmountChange]);

  const handleSendAmountChange = (value: string) => {
    setLastEditedField('send');
    onAmountChange(value);
  };

  const handleReceiverAmountChange = (value: string) => {
    setLastEditedField('receive');
    setReceiverAmount(value);
  };

  const sendAmount = parseFloat(amount) || 0;
  const transferFee = Math.ceil(sendAmount / 100) * 15; // $15 per $100 equivalent
  const totalAmount = sendAmount + transferFee;

  return (
    <div className="space-y-4">
      {/* Exchange Rate Section - Flat & Clean */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Exchange Rate</span>
          </div>
          <div className="flex items-center gap-2">
            {isLoadingRates && (
              <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            )}
            <div className="flex items-center gap-1.5 bg-white rounded-md px-2.5 py-1 border border-gray-200">
              <span className="text-sm text-gray-600">
                1 {selectedCurrency} =
              </span>
              <span className="font-semibold text-gray-900 text-sm">
                {currentRate.toFixed(2)} HTG
              </span>
            </div>
          </div>
        </div>
        
        {lastUpdated && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>
                {isLive ? 'Live BRH rate' : 'Cached rate'}
              </span>
            </div>
            <span>Updated {lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* Send Amount Input with Currency Selection */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 rounded-xl border border-purple-200 shadow-lg shadow-purple-100/50 overflow-hidden backdrop-blur-sm">
        <div className="p-3 pb-2 relative">
          <div className="absolute top-2 right-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 rounded-full shadow-sm">
              <ArrowUpRight className="w-3 h-3 text-white" />
            </div>
          </div>
          <Label htmlFor="amount" className="text-xs font-bold text-purple-800 mb-2 block uppercase tracking-wide">
            Send Amount
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span className="text-purple-700 font-bold text-sm">{selectedCurrencyData.symbol}</span>
            </div>
            <Input
              id="amount"
              type="number"
              className="pl-12 pr-20 text-2xl font-light border-0 shadow-none focus-visible:ring-0 bg-transparent text-purple-900 placeholder-purple-400 placeholder:text-2xl placeholder:font-light h-12 transition-colors duration-200 w-full outline-none"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleSendAmountChange(e.target.value)}
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                <SelectTrigger className="h-6 w-auto border-0 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700 font-semibold text-xs px-2 py-1 rounded-full focus:ring-0 shadow-none transition-all duration-200">
                  <SelectValue>{selectedCurrency}</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white border border-purple-200 shadow-xl z-50">
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-purple-700">{currency.symbol}</span>
                        <span className="text-xs text-purple-600">{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Receiver Amount Input - Now Editable */}
      <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-xl border border-emerald-200 shadow-lg shadow-emerald-100/50 overflow-hidden backdrop-blur-sm">
        <div className="p-3 pb-2 relative">
          <div className="absolute top-2 right-2">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-1.5 rounded-full shadow-sm">
              <ArrowDownLeft className="w-3 h-3 text-white" />
            </div>
          </div>
          <Label htmlFor="receiverAmount" className="text-xs font-bold text-emerald-800 mb-2 block uppercase tracking-wide">
            Receiver Gets
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span className="text-emerald-700 font-bold text-sm">HTG</span>
            </div>
            <Input
              id="receiverAmount"
              type="number"
              className="pl-12 pr-12 text-2xl font-light border-0 shadow-none focus-visible:ring-0 bg-transparent text-emerald-900 placeholder-emerald-400 placeholder:text-2xl placeholder:font-light h-12 transition-colors duration-200 w-full outline-none"
              placeholder="0.00"
              value={receiverAmount}
              onChange={(e) => handleReceiverAmountChange(e.target.value)}
              min="0"
              step="0.01"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <span className="text-xs font-bold text-emerald-700 bg-gradient-to-r from-emerald-100 to-teal-100 px-2 py-0.5 rounded-full border border-emerald-200 shadow-sm">
                HTG
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border border-blue-200 p-3 shadow-sm">
  <div className="space-y-2">
    <div className="flex items-center justify-between text-xs">
      <span className="text-blue-700 font-medium flex items-center gap-1">
        <CreditCard className="w-3 h-3" />
        Transfer fee
      </span>
      <span className="font-bold text-blue-900">
        {selectedCurrencyData.symbol}{transferFee.toFixed(2)}
      </span>
    </div>
    <div className="border-t border-blue-200 pt-2">
      <div className="flex items-center justify-between">
        <span className="font-bold text-blue-900 text-sm flex items-center gap-1">
          <ArrowRight className="w-4 h-4" />
          Total to pay
        </span>
        <span className="text-xl font-bold text-blue-900">
          {selectedCurrencyData.symbol}{totalAmount.toFixed(2)}
        </span>
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default StepOneTransfer;
