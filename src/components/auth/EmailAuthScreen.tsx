
import React, { useState } from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { EmailAuthScreenProps } from '../../types/email';
import { useEmailValidation } from '../../hooks/useEmailValidation';
import EmailInput from './EmailInput';
import DomainSuggestions from './DomainSuggestions';
import EmailStatusMessage from './EmailStatusMessage';
import EmailActionButtons from './EmailActionButtons';

const EmailAuthScreen: React.FC<EmailAuthScreenProps> = ({
  onBack,
  selectedLanguage,
  onContinueWithPassword,
  onContinueWithCode,
  onCreateAccount,
  onSignUpClick,
  initialEmail = '',
}) => {
  const { email, setEmail, isEmailValid, emailCheckState } = useEmailValidation(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [showDomainSuggestions, setShowDomainSuggestions] = useState(false);

  const API_BASE_URL = 'https://supabase-y8ak.onrender.com/api';

  const handleEmailChange = (value: string) => {
    setEmail(value);

    const atIndex = value.lastIndexOf('@');
    if (atIndex !== -1) {
      const afterAt = value.slice(atIndex + 1);
      setShowDomainSuggestions(afterAt === '' || (!afterAt.includes('.') && afterAt.length < 15));
    } else {
      setShowDomainSuggestions(false);
    }
  };

  const handleDomainClick = (domain: string) => {
    const atIndex = email.lastIndexOf('@');
    const localPart = atIndex === -1 ? email : email.slice(0, atIndex);
    const newEmail = `${localPart}@${domain}`;
    setEmail(newEmail);
    setShowDomainSuggestions(false);
  };

  const handleContinueWithPassword = async () => {
    if (!isEmailValid || isLoading || emailCheckState !== 'exists') return;

    console.log('EmailAuthScreen: handleContinueWithPassword called for email:', email);
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('EmailAuthScreen: Calling onContinueWithPassword');
      onContinueWithPassword(email);
    } catch (error) {
      console.error('Error continuing with password:', error);
      onContinueWithPassword(email);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithCode = async () => {
    if (!isEmailValid || isLoading || emailCheckState === 'checking') return;
    
    console.log('EmailAuthScreen: handleContinueWithCode called for email:', email);
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Verification code sent successfully');
        console.log('EmailAuthScreen: Calling onContinueWithCode');
        onContinueWithCode(email);
      } else {
        console.error('Failed to send OTP:', data.message);
        // Still proceed to verification screen even if sending fails
        console.log('EmailAuthScreen: Calling onContinueWithCode (fallback)');
        onContinueWithCode(email);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      // Still proceed to verification screen even if there's a network error
      console.log('EmailAuthScreen: Calling onContinueWithCode (error fallback)');
      onContinueWithCode(email);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccountClick = async () => {
    if (!isEmailValid || isLoading || emailCheckState === 'checking') return;
    
    console.log('EmailAuthScreen: handleCreateAccountClick called for email:', email);
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('EmailAuthScreen: Calling onCreateAccount');
      onCreateAccount(email);
    } catch (error) {
      console.error('Error navigating to create account:', error);
      onCreateAccount(email);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-4">
      {/* Header */}
      <div className="pt-2 pb-3 flex items-center justify-between">
        <button
          onClick={() => {
            console.log('EmailAuthScreen: Back button clicked');
            onBack();
          }}
          className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          aria-label="Go back"
          disabled={isLoading}
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        <h2 className="text-lg font-semibold text-gray-900">
          Continue with Email
        </h2>

        <button
          className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          aria-label="Help"
          onClick={() => alert('Need help? Contact support@example.com')}
          type="button"
          disabled={isLoading}
        >
          <HelpCircle className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 px-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Main content container */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            What's your email?
          </h1>
          <p className="text-gray-600">
            We'll check if you have an account or create a new one
          </p>
        </div>

        <EmailInput
          email={email}
          onEmailChange={handleEmailChange}
          emailCheckState={emailCheckState}
          isLoading={isLoading}
        />

        <DomainSuggestions
          show={showDomainSuggestions}
          onDomainClick={handleDomainClick}
          isLoading={isLoading}
        />

        <EmailActionButtons
          isEmailValid={isEmailValid}
          emailCheckState={emailCheckState}
          isLoading={isLoading}
          onContinueWithPassword={handleContinueWithPassword}
          onContinueWithCode={handleContinueWithCode}
          onCreateAccount={handleCreateAccountClick}
        />

        <EmailStatusMessage emailCheckState={emailCheckState} />

        <div className="text-center">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  console.log('EmailAuthScreen: Sign up link clicked');
                  onSignUpClick();
                }}
                className="text-red-500 hover:underline font-medium focus:outline-none"
                disabled={isLoading}
              >
                Sign up
              </button>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z" />
            </svg>
            <span className="text-gray-500 text-sm">Your email is safe with us</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAuthScreen;
