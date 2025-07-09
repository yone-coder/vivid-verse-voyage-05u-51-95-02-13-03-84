
import React, { useRef, useEffect } from 'react';
import { Mail, Check, X } from 'lucide-react';
import { EmailCheckState } from '../../types/email';
import { FAVICON_OVERRIDES } from '../../constants/email';

interface EmailInputProps {
  email: string;
  onEmailChange: (value: string) => void;
  emailCheckState: EmailCheckState;
  isLoading: boolean;
}

const EmailInput: React.FC<EmailInputProps> = ({
  email,
  onEmailChange,
  emailCheckState,
  isLoading,
}) => {
  const emailInputRef = useRef<HTMLInputElement>(null);

  const extractDomain = (emailValue: string): string => {
    if (!emailValue.includes('@')) return '';
    const parts = emailValue.split('@');
    if (parts.length !== 2) return '';
    const domain = parts[1].trim();
    return domain.includes('.') && domain.length > 3 ? domain : '';
  };

  const updateFavicon = (emailValue: string) => {
    const domain = extractDomain(emailValue);
    if (domain) {
      const url = FAVICON_OVERRIDES[domain] || `https://www.google.com/s2/favicons?domain=${domain}&sz=20`;
      return { url, show: true, domain };
    }
    return { url: '', show: false, domain: '' };
  };

  const { url: faviconUrl, show: showFavicon } = updateFavicon(email);

  useEffect(() => {
    const input = emailInputRef.current;
    if (!input) return;

    const syncWithDOM = () => {
      const domValue = input.value;
      if (domValue !== email && domValue.length > 0) {
        onEmailChange(domValue);
        return true;
      }
      return false;
    };

    const handleFocus = () => {
      setTimeout(syncWithDOM, 50);
      setTimeout(syncWithDOM, 200);
      setTimeout(syncWithDOM, 500);
    };

    const handleBlur = () => {
      syncWithDOM();
    };

    const handleInput = () => {
      syncWithDOM();
    };

    const handleChange = () => {
      syncWithDOM();
    };

    const observer = new MutationObserver(() => {
      syncWithDOM();
    });

    observer.observe(input, {
      attributes: true,
      attributeFilter: ['value']
    });

    const pollInterval = setInterval(() => {
      syncWithDOM();
    }, 100);

    const stopPolling = setTimeout(() => {
      clearInterval(pollInterval);
    }, 5000);

    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);
    input.addEventListener('input', handleInput);
    input.addEventListener('change', handleChange);

    setTimeout(syncWithDOM, 100);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(stopPolling);
      observer.disconnect();
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
      input.removeEventListener('input', handleInput);
      input.removeEventListener('change', handleChange);
    };
  }, [email, onEmailChange]);

  const getRightSideIcon = () => {
    if (isLoading) {
      return (
        <div className="w-5 h-5">
          <svg className="animate-spin text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      );
    }

    if (emailCheckState === 'checking') {
      return (
        <div className="w-5 h-5">
          <svg className="animate-spin text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      );
    }

    if (emailCheckState === 'exists') {
      return <Check className="w-5 h-5 text-green-500" />;
    }

    if (emailCheckState === 'not-exists') {
      return <X className="w-5 h-5 text-red-500" />;
    }

    if (emailCheckState === 'error') {
      return (
        <div className="w-5 h-5">
          <svg className="text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
      );
    }

    return null;
  };

  const handleFaviconError = () => {
    // Icon failed to load
  };

  return (
    <div className="mb-2 relative">
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Email address
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 z-10">
          {showFavicon && faviconUrl ? (
            <img
              src={faviconUrl}
              alt="Email provider favicon"
              className="w-full h-full object-contain"
              onError={handleFaviconError}
            />
          ) : (
            <Mail className="w-full h-full text-gray-400" />
          )}
        </div>

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10">
          {getRightSideIcon()}
        </div>

        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Enter your email address"
          autoComplete="email"
          ref={emailInputRef}
          disabled={isLoading}
          className="relative w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors bg-transparent disabled:opacity-50"
        />
      </div>
    </div>
  );
};

export default EmailInput;
