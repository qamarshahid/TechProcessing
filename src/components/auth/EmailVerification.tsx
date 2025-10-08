import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onResend: () => void;
  onCancel: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerified,
  onResend,
  onCancel
}) => {
  console.log('EmailVerification component rendered with email:', email);
  const { showSuccess, showError } = useNotifications();
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'code' | 'link'>('code');

  useEffect(() => {
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
  }, []);

  const verifyCode = async () => {
    setLoading(true);
    try {
      const response = await apiClient.verifyEmailCode(email, verificationCode);
      
      // Debug: Log the response to see what we're getting
      console.log('Email verification response:', response);
      
      // If the response includes a token, automatically log the user in
      if (response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        apiClient.setToken(response.access_token);
        showSuccess('Success', 'Email verified successfully! You are now logged in.');
        // Call onVerified to close modal and let parent handle redirect
        onVerified();
        // Navigate to dashboard
        window.location.href = '/dashboard';
        return;
      }
      
      // If no token, show success but don't redirect
      showSuccess('Success', 'Email verified successfully!');
      onVerified();
    } catch (error) {
      console.error('Email verification error:', error);
      showError('Verification Failed', 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setLoading(true);
    try {
      await apiClient.resendVerificationEmail(email);
      setTimeLeft(60);
      setCanResend(false);
      showSuccess('Code Sent', 'A new verification code has been sent to your email');
      onResend();
    } catch (error) {
      showError('Error', 'Failed to resend verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCodeVerification = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <Mail className="h-16 w-16 text-accent1 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-fg mb-2">Verify Your Email</h2>
        <p className="text-muted">
          We've sent a verification code to <span className="font-medium text-accent2">{email}</span>
        </p>
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
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 bg-surface2 border border-slate-600 rounded-lg text-fg text-center text-2xl font-mono tracking-widest"
              maxLength={6}
            />
          </div>

          <div className="text-center">
            {canResend ? (
              <button
                onClick={resendVerification}
                disabled={loading}
                className="text-accent2 hover:text-accent3 text-sm font-medium transition-colors flex items-center justify-center space-x-2 mx-auto"
              >
                {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                <span>Resend Code</span>
              </button>
            ) : (
              <p className="text-muted text-sm">
                Resend code in {timeLeft}s
              </p>
            )}
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Didn't receive the code?</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Check your spam/junk folder</li>
                  <li>Make sure the email address is correct</li>
                  <li>Wait a few minutes for the email to arrive</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setVerificationMethod('link')}
          className="flex-1 px-4 py-3 bg-surface2 hover:bg-slate-600 text-fg rounded-lg font-medium transition-colors"
        >
          Use Link Instead
        </button>
        <button
          onClick={verifyCode}
          disabled={verificationCode.length !== 6 || loading}
          className="flex-1 px-4 py-3 bg-accent2 hover:bg-accent1 disabled:bg-slate-600 disabled:cursor-not-allowed text-fg rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
          <span>Verify Email</span>
        </button>
      </div>
    </motion.div>
  );

  const renderLinkVerification = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-accent1 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-fg mb-2">Check Your Email</h2>
        <p className="text-muted">
          We've sent a verification link to <span className="font-medium text-accent2">{email}</span>
        </p>
      </div>

      <div className="bg-surface rounded-xl p-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className="p-4 bg-accent2/10 rounded-full inline-block mb-4">
              <Mail className="h-8 w-8 text-accent2" />
            </div>
            <h3 className="text-lg font-semibold text-fg mb-2">Email Sent Successfully</h3>
            <p className="text-muted text-sm">
              Click the verification link in your email to complete the verification process.
            </p>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">What to do next:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Check your email inbox</li>
                  <li>Look for an email from TechProcessing LLC</li>
                  <li>Click the "Verify Email" button or link</li>
                  <li>You'll be redirected back to complete your registration</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={resendVerification}
              disabled={loading}
              className="text-accent2 hover:text-accent3 text-sm font-medium transition-colors flex items-center justify-center space-x-2 mx-auto"
            >
              {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
              <span>Resend Verification Email</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setVerificationMethod('code')}
          className="flex-1 px-4 py-3 bg-surface2 hover:bg-slate-600 text-fg rounded-lg font-medium transition-colors"
        >
          Use Code Instead
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 px-4 py-3 bg-accent2 hover:bg-accent1 text-fg rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <ExternalLink className="h-4 w-4" />
          <span>I've Verified</span>
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
        {verificationMethod === 'code' ? renderCodeVerification() : renderLinkVerification()}
        
        <div className="mt-6 text-center">
          <button
            onClick={onCancel}
            className="text-muted hover:text-muted text-sm transition-colors"
          >
            Cancel registration
          </button>
        </div>
      </motion.div>
    </div>
  );
};
