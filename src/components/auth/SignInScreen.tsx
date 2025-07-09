import React, { useState } from 'react';
import MainLoginScreen from './MainLoginScreen';
import EmailAuthScreen from './EmailAuthScreen';
import VerificationCodeScreen from './VerificationCodeScreen';
import PasswordAuthScreen from './PasswordAuthScreen';
import SuccessScreen from './SuccessScreen';
import AccountCreationScreen from './AccountCreationScreen';
import { LanguageProvider } from '@/contexts/LanguageContext';

type ScreenType = 'main' | 'email' | 'verification' | 'password' | 'success' | 'account-creation';

const SignInScreen: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('main');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [userEmail, setUserEmail] = useState('');

  const handleContinueWithEmail = () => {
    console.log('Navigating to email screen');
    setCurrentScreen('email');
  };

  const handleBackToMain = () => {
    console.log('Navigating back to main screen');
    setCurrentScreen('main');
  };

  const handleContinueWithPassword = (email: string) => {
    console.log('Continue with password for:', email);
    setUserEmail(email);
    setCurrentScreen('password');
  };

  const handleContinueWithCode = (email: string) => {
    console.log('Continue with code for:', email);
    setUserEmail(email);
    setCurrentScreen('verification');
  };

  const handleCreateAccount = (email: string) => {
    console.log('Create account for:', email);
    setUserEmail(email);
    setCurrentScreen('account-creation');
  };

  const handleSignUpClick = () => {
    console.log('Sign up clicked');
    // TODO: Navigate to sign up screen
  };

  const handleBackFromVerification = () => {
    console.log('Navigating back to email screen from verification');
    setCurrentScreen('email');
  };

  const handleBackFromPassword = () => {
    console.log('Navigating back to email screen from password');
    setCurrentScreen('email');
  };

  const handleVerificationSuccess = () => {
    console.log('Verification successful, user authenticated');
    setCurrentScreen('success');
  };

  const handleSignInSuccess = () => {
    console.log('Sign in successful, user authenticated');
    setCurrentScreen('success');
  };

  const handleForgotPasswordClick = () => {
    console.log('Forgot password clicked');
    // TODO: Navigate to forgot password screen
  };

  const handleContinueToApp = () => {
    console.log('Continuing to main app');
    // This will trigger the MainLayout to re-check auth status and show the main app
    window.location.reload();
  };

  const handleBackFromAccountCreation = () => {
    console.log('Navigating back to email screen from account creation');
    setCurrentScreen('email');
  };

  const handleAccountCreated = () => {
    console.log('Account created successfully, user authenticated');
    setCurrentScreen('success');
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        {currentScreen === 'main' && (
          <MainLoginScreen 
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            onContinueWithEmail={handleContinueWithEmail}
          />
        )}
        
        {currentScreen === 'email' && (
          <EmailAuthScreen 
            onBack={handleBackToMain}
            selectedLanguage={selectedLanguage}
            onContinueWithPassword={handleContinueWithPassword}
            onContinueWithCode={handleContinueWithCode}
            onCreateAccount={handleCreateAccount}
            onSignUpClick={handleSignUpClick}
            initialEmail={userEmail}
          />
        )}
        
        {currentScreen === 'verification' && (
          <VerificationCodeScreen
            email={userEmail}
            onBack={handleBackFromVerification}
            onVerificationSuccess={handleVerificationSuccess}
          />
        )}
        
        {currentScreen === 'password' && (
          <PasswordAuthScreen
            email={userEmail}
            onBack={handleBackFromPassword}
            onSignInSuccess={handleSignInSuccess}
            onForgotPasswordClick={handleForgotPasswordClick}
          />
        )}

        {currentScreen === 'account-creation' && (
          <AccountCreationScreen
            email={userEmail}
            onBack={handleBackFromAccountCreation}
            onAccountCreated={handleAccountCreated}
          />
        )}

        {currentScreen === 'success' && (
          <SuccessScreen
            email={userEmail}
            onContinue={handleContinueToApp}
          />
        )}
      </div>
    </LanguageProvider>
  );
};

export default SignInScreen;
