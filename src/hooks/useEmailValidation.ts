
import { useState, useEffect, useCallback, useRef } from 'react';
import { EmailCheckState } from '../types/email';

export const useEmailValidation = (initialEmail = '') => {
  const [email, setEmail] = useState(initialEmail);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailCheckState, setEmailCheckState] = useState<EmailCheckState>('unchecked');
  const [lastCheckedEmail, setLastCheckedEmail] = useState('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const checkEmailExists = useCallback(async (emailToCheck: string): Promise<boolean> => {
    try {
      const response = await fetch('https://supabase-y8ak.onrender.com/api/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToCheck }),
      });

      const data = await response.json();
      
      if (data.success) {
        return data.exists;
      } else {
        throw new Error(data.message || 'Failed to check email');
      }
    } catch (error) {
      console.error('Error checking email:', error);
      throw error;
    }
  }, []);

  const debouncedEmailCheck = useCallback((emailToCheck: string) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      if (emailRegex.test(emailToCheck) && emailToCheck !== lastCheckedEmail) {
        setEmailCheckState('checking');
        
        try {
          const exists = await checkEmailExists(emailToCheck);
          setEmailCheckState(exists ? 'exists' : 'not-exists');
          setLastCheckedEmail(emailToCheck);
        } catch (error) {
          setEmailCheckState('error');
          setLastCheckedEmail(emailToCheck);
        }
      }
    }, 800);
  }, [checkEmailExists, lastCheckedEmail]);

  useEffect(() => {
    const isValid = emailRegex.test(email);
    setIsEmailValid(isValid);

    if (!isValid) {
      setEmailCheckState('unchecked');
      setLastCheckedEmail('');
    } else {
      debouncedEmailCheck(email);
    }
  }, [email, debouncedEmailCheck]);

  useEffect(() => {
    if (initialEmail) {
      setIsEmailValid(emailRegex.test(initialEmail));
    }
  }, [initialEmail]);

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    email,
    setEmail,
    isEmailValid,
    emailCheckState,
  };
};
