
import React from 'react';
import { Mail, Loader2, UserPlus } from 'lucide-react';
import { EmailCheckState } from '../../types/email';

interface EmailActionButtonsProps {
  isEmailValid: boolean;
  emailCheckState: EmailCheckState;
  isLoading: boolean;
  onContinueWithPassword: () => void;
  onContinueWithCode: () => void;
  onCreateAccount: () => void;
}

const EmailActionButtons: React.FC<EmailActionButtonsProps> = ({
  isEmailValid,
  emailCheckState,
  isLoading,
  onContinueWithPassword,
  onContinueWithCode,
  onCreateAccount,
}) => {
  const getPasswordButtonState = () => {
    if (!isEmailValid) return { disabled: true, text: 'Continue with Password' };
    if (emailCheckState === 'checking') return { disabled: true, text: 'Checking...' };
    if (emailCheckState === 'exists') return { disabled: false, text: 'Continue with Password' };
    if (emailCheckState === 'not-exists') return { disabled: true, text: 'Account Not Found' };
    if (emailCheckState === 'error') return { disabled: true, text: 'Check Connection' };
    return { disabled: true, text: 'Continue with Password' };
  };

  const getCodeButtonState = () => {
    if (!isEmailValid) return { disabled: true, text: 'Send Verification Code' };
    if (emailCheckState === 'checking') return { disabled: true, text: 'Checking...' };
    if (emailCheckState === 'exists') return { disabled: false, text: 'Send Login Code' };
    if (emailCheckState === 'not-exists') return { disabled: false, text: 'Create Account' };
    if (emailCheckState === 'error') return { disabled: false, text: 'Send Verification Code' };
    return { disabled: true, text: 'Send Verification Code' };
  };

  const passwordButtonState = getPasswordButtonState();
  const codeButtonState = getCodeButtonState();

  // Show create account button when email doesn't exist
  const showCreateAccountButton = emailCheckState === 'not-exists';

  return (
    <div className="space-y-3 mb-8">
      <button
        disabled={passwordButtonState.disabled || isLoading}
        onClick={onContinueWithPassword}
        className={`w-full flex items-center justify-center gap-3 py-4 px-4 rounded-lg font-medium transition-all ${
          !passwordButtonState.disabled && !isLoading
            ? 'bg-red-500 text-white hover:bg-red-600 active:scale-98'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        type="button"
      >
        <Mail className="w-5 h-5" />
        <span>{passwordButtonState.text}</span>
      </button>

      {showCreateAccountButton ? (
        <button
          disabled={isLoading}
          onClick={onCreateAccount}
          className={`w-full flex items-center justify-center gap-3 py-4 px-4 border-2 rounded-lg font-medium transition-all ${
            !isLoading
              ? 'border-red-500 text-red-500 hover:bg-red-50 active:scale-98'
              : 'border-gray-300 text-gray-400 cursor-not-allowed'
          }`}
          type="button"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <UserPlus className="w-5 h-5" />
          )}
          <span>{isLoading ? 'Loading...' : 'Create Account'}</span>
        </button>
      ) : (
        <button
          disabled={codeButtonState.disabled || isLoading}
          onClick={onContinueWithCode}
          className={`w-full flex items-center justify-center gap-3 py-4 px-4 border-2 rounded-lg font-medium transition-all ${
            !codeButtonState.disabled && !isLoading
              ? 'border-red-500 text-red-500 hover:bg-red-50 active:scale-98'
              : 'border-gray-300 text-gray-400 cursor-not-allowed'
          }`}
          type="button"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          )}
          <span>{isLoading ? 'Sending...' : codeButtonState.text}</span>
        </button>
      )}
    </div>
  );
};

export default EmailActionButtons;
