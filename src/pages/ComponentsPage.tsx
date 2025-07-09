
import React from 'react';
import { ArrowLeft, Lock, Key, Check, HelpCircle, Eye, EyeOff, Mail } from 'lucide-react';

function PasswordScreen({ email = 'user@example.com', onBack }) {
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPasswordValid, setIsPasswordValid] = React.useState(false);

  const passwordInputRef = React.useRef(null);

  const handlePasswordChange = (value) => {
    setPassword(value);
    setIsPasswordValid(value.length >= 8);
  };

  const handleChangeEmail = () => {
    console.log('Change email clicked');
    // This would typically navigate back to email step
  };

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${email.split('@')[1] || ''}`;

  return (
    <div className="min-h-screen bg-white flex flex-col px-4">
      {/* Header */}
      <div className="pt-2 pb-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        <h2 className="text-lg font-semibold text-gray-900">
          Welcome Back! Sign In
        </h2>

        <button
          className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          aria-label="Help"
          onClick={() => alert('Need help? Contact support@example.com')}
          type="button"
        >
          <HelpCircle className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 px-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-red-500 rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Main content container */}
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto relative">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Enter your password
          </h1>
          <p className="text-gray-600">
            We'll send you a verification code or you can sign in with your password
          </p>
        </div>

        {/* Email display */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{email}</span>
            </div>
            <button
              onClick={handleChangeEmail}
              className="text-red-500 font-medium hover:text-red-600 text-sm"
              type="button"
            >
              Change
            </button>
          </div>
        </div>

        {/* Password input */}
        <div className="mb-6 relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              ref={passwordInputRef}
              className="relative w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors bg-transparent"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>

            {isPasswordValid && (
              <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <button
            disabled={!isPasswordValid}
            className={`w-full flex items-center justify-center gap-3 py-4 px-4 rounded-lg font-medium transition-all ${
              isPasswordValid
                ? 'bg-red-500 text-white hover:bg-red-600 active:scale-98'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            type="button"
          >
            <Lock className="w-5 h-5" />
            <span>Sign In</span>
          </button>

          <button
            className="w-full flex items-center justify-center gap-3 py-4 px-4 border-2 border-red-500 text-red-500 rounded-lg font-medium transition-all hover:bg-red-50 active:scale-98"
            type="button"
          >
            <Key className="w-5 h-5" />
            <span>Send Verification Code</span>
          </button>
        </div>

        <div className="text-center">
          <button className="text-red-500 font-medium hover:text-red-600 mb-4" type="button">
            Forgot password?
          </button>

          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18,8A6,6 0 0,0 12,2A6,6 0 0,0 6,8H4C2.89,8 2,8.89 2,10V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V10C22,8.89 21.1,8 20,8H18M12,4A4,4 0 0,1 16,8H8A4,4 0 0,1 12,4Z"/>
            </svg>
            <span className="text-gray-500 text-sm">Your password is secure with us</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComponentsPage() {
  const handleBack = () => {
    console.log('Back button clicked');
  };

  return <PasswordScreen email="demo@example.com" onBack={handleBack} />;
}
