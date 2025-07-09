
import React from 'react';
import { EmailCheckState } from '../../types/email';

interface EmailStatusMessageProps {
  emailCheckState: EmailCheckState;
}

const EmailStatusMessage: React.FC<EmailStatusMessageProps> = ({ emailCheckState }) => {
  if (emailCheckState === 'error') {
    return (
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm text-center">
          Connection issue. You can still continue with verification code.
        </p>
      </div>
    );
  }

  return null;
};

export default EmailStatusMessage;
