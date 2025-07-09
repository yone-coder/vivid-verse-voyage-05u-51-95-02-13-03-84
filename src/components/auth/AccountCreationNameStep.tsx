import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FAVICON_OVERRIDES } from '../../constants/email';

interface AccountCreationNameStepProps {
  email: string;
  onBack: () => void;
  onChangeEmail: () => void;
  onContinue: (firstName: string, lastName: string) => void;
  initialFirstName?: string;
  initialLastName?: string;
}

const AccountCreationNameStep: React.FC<AccountCreationNameStepProps> = ({
  email,
  onBack,
  onChangeEmail,
  onContinue,
  initialFirstName = '',
  initialLastName = '',
}) => {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);

  const extractDomain = (emailValue: string): string => {
    if (!emailValue.includes('@')) return '';
    const parts = emailValue.split('@');
    if (parts.length !== 2) return '';
    const domain = parts[1].trim();
    return domain.includes('.') && domain.length > 3 ? domain : '';
  };

  const getFaviconUrl = (emailValue: string) => {
    const domain = extractDomain(emailValue);
    if (domain) {
      return FAVICON_OVERRIDES[domain] || `https://www.google.com/s2/favicons?domain=${domain}&sz=20`;
    }
    return null;
  };

  const faviconUrl = getFaviconUrl(email);

  const handleContinue = () => {
    if (!firstName.trim() || !lastName.trim()) return;
    
    // Just pass the names to the parent - don't create account here
    onContinue(firstName.trim(), lastName.trim());
  };

  const isFormValid = firstName.trim().length > 0 && lastName.trim().length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col px-4">
      {/* Header */}
      <div className="pt-2 pb-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">Create Account</h2>
        <div className="w-10 h-10"></div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 px-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            What's your name?
          </h1>
          <p className="text-gray-600">
            We'll use this to personalize your experience
          </p>
        </div>

        {/* Email Display */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6">
                {faviconUrl ? (
                  <img
                    src={faviconUrl}
                    alt="Email provider favicon"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Mail className="w-full h-full text-gray-400" />
                )}
              </div>
              <span className="text-gray-700 font-medium">{email}</span>
            </div>
            <button
              onClick={onChangeEmail}
              className="text-red-500 hover:text-red-600 font-medium text-sm"
            >
              Change
            </button>
          </div>
        </div>

        {/* Name Form */}
        <div className="space-y-4 mb-8">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <Input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
                <User className="w-5 h-5 text-gray-400" />
              </div>
              <Input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!isFormValid}
          className="w-full mb-6"
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default AccountCreationNameStep;
