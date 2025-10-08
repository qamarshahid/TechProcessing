import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useNotifications } from '../common/NotificationSystem';

interface MfaVerificationProps {
  mfaMethod: 'TOTP' | 'EMAIL' | 'SMS';
  tempToken: string;
  onSuccess: (token: string, user: any) => void;
  onBack: () => void;
  onCancel: () => void;
}

export const MfaVerification: React.FC<MfaVerificationProps> = ({
  mfaMethod,
  tempToken,
  onSuccess,
  onBack,
  onCancel
}) => {
  const { showSuccess, showError } = useNotifications();
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (mfaMethod === 'EMAIL' || mfaMethod === 'SMS') {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [mfaMethod]);

  const verifyCode = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tempToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: useBackupCode ? backupCode : verificationCode 
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      const data = await response.json();
      showSuccess('Success', 'Two-factor authentication verified successfully');
      onSuccess(data.access_token, data.user);
    } catch (error) {
      showError('Verification Failed', 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    setLoading(true);
    try {
      // This would trigger resending the verification code
      // Implementation depends on your backend endpoint
      setTimeLeft(30);
      setCanResend(false);
      showSuccess('Code Sent', 'A new verification code has been sent');
    } catch (error) {
      showError('Error', 'Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMethodInfo = () => {
    switch (mfaMethod) {
      case 'TOTP':
        return {
          icon: Smartphone,
          title: 'Google Authenticator',
          description: 'Enter the 6-digit code from your authenticator app',
          placeholder: '000000',
          maxLength: 6,
          color: 'from-blue-500 to-blue-600'
        };
      case 'EMAIL':
        return {
          icon: Mail,
          title: 'Email Verification',
          description: 'Enter the 6-digit code sent to your email',
          placeholder: '000000',
          maxLength: 6,
          color: 'from-accent500 to-accent600'
        };
      case 'SMS':
        return {
          icon: MessageSquare,
          title: 'SMS Verification',
          description: 'Enter the 6-digit code sent to your phone',
          placeholder: '000000',
          maxLength: 6,
          color: 'from-purple-500 to-purple-600'
        };
      default:
        return {
          icon: Shield,
          title: 'Two-Factor Authentication',
          description: 'Enter your verification code',
          placeholder: '000000',
          maxLength: 6,
          color: 'from-accent1 to-emerald-600'
        };
    }
  };

  const methodInfo = getMethodInfo();
  const IconComponent = methodInfo.icon;

  const renderMainVerification = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className={`p-4 rounded-full bg-gradient-to-r ${methodInfo.color} inline-block mb-4`}>
          <IconComponent className="h-8 w-8 text-fg" />
        </div>
        <h2 className="text-2xl font-bold text-fg mb-2">{methodInfo.title}</h2>
        <p className="text-muted">{methodInfo.description}</p>
      </div>

      <div className="bg-surface rounded-xl p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Verification Code
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, methodInfo.maxLength))}
              placeholder={methodInfo.placeholder}
              className="w-full px-4 py-3 bg-surface2 border border-slate-600 rounded-lg text-fg text-center text-2xl font-mono tracking-widest"
              maxLength={methodInfo.maxLength}
            />
          </div>

          {(mfaMethod === 'EMAIL' || mfaMethod === 'SMS') && (
            <div className="text-center">
              {canResend ? (
                <button
                  onClick={resendCode}
                  disabled={loading}
                  className="text-accent2 hover:text-accent3 text-sm font-medium transition-colors"
                >
                  Resend Code
                </button>
              ) : (
                <p className="text-muted text-sm">
                  Resend code in {timeLeft}s
                </p>
              )}
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Need help?</p>
                <p className="text-xs">
                  {mfaMethod === 'TOTP' 
                    ? 'Make sure your device time is synchronized and enter the current code from your authenticator app.'
                    : 'Check your email/SMS for the verification code. It may take a few minutes to arrive.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-3 bg-surface2 hover:bg-slate-600 text-fg rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <button
          onClick={verifyCode}
          disabled={verificationCode.length !== methodInfo.maxLength || loading}
          className="flex-1 px-4 py-3 bg-accent2 hover:bg-accent1 disabled:bg-slate-600 disabled:cursor-not-allowed text-fg rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
          <span>Verify</span>
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={() => setUseBackupCode(true)}
          className="text-muted hover:text-muted text-sm transition-colors"
        >
          Use backup code instead
        </button>
      </div>
    </motion.div>
  );

  const renderBackupCode = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <Shield className="h-16 w-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-fg mb-2">Backup Code</h2>
        <p className="text-muted">Enter one of your backup codes to sign in</p>
      </div>

      <div className="bg-surface rounded-xl p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Backup Code
            </label>
            <input
              type="text"
              value={backupCode}
              onChange={(e) => setBackupCode(e.target.value.toUpperCase().slice(0, 6))}
              placeholder="ABCDEF"
              className="w-full px-4 py-3 bg-surface2 border border-slate-600 rounded-lg text-fg text-center text-lg font-mono tracking-wider"
              maxLength={6}
            />
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
              <div className="text-sm text-amber-300">
                <p className="font-medium mb-1">Backup Code Notice:</p>
                <p className="text-xs">Each backup code can only be used once. After using a code, it will be permanently removed from your account.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setUseBackupCode(false)}
          className="flex-1 px-4 py-3 bg-surface2 hover:bg-slate-600 text-fg rounded-lg font-medium transition-colors"
        >
          Back to {methodInfo.title}
        </button>
        <button
          onClick={verifyCode}
          disabled={backupCode.length !== 6 || loading}
          className="flex-1 px-4 py-3 bg-accent2 hover:bg-accent1 disabled:bg-slate-600 disabled:cursor-not-allowed text-fg rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
          <span>Verify</span>
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-bg2 rounded-2xl p-6 w-full max-w-md"
      >
        {useBackupCode ? renderBackupCode() : renderMainVerification()}
        
        <div className="mt-6 text-center">
          <button
            onClick={onCancel}
            className="text-muted hover:text-muted text-sm transition-colors"
          >
            Cancel and sign out
          </button>
        </div>
      </motion.div>
    </div>
  );
};
