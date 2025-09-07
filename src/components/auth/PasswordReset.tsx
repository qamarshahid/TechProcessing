import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';

interface PasswordResetProps {
  onSuccess: () => void;
  onCancel: () => void;
  token?: string;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({
  onSuccess,
  onCancel,
  token
}) => {
  const { showSuccess, showError } = useNotifications();
  const [step, setStep] = useState<'request' | 'code' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    if (token) {
      setStep('reset');
    }
  }, [token]);

  useEffect(() => {
    if (newPassword) {
      checkPasswordStrength(newPassword);
    }
  }, [newPassword]);

  const checkPasswordStrength = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    setPasswordRequirements(requirements);
    
    const score = Object.values(requirements).filter(Boolean).length;
    setPasswordStrength(score);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  const requestPasswordReset = async () => {
    setLoading(true);
    try {
      await apiClient.forgotPasswordCode(email);
      showSuccess('Code Sent', 'If the email exists, a password reset code has been sent');
      setStep('code');
    } catch (error) {
      showError('Error', 'Failed to send password reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      showError('Error', 'Passwords do not match');
      return;
    }

    if (passwordStrength < 3) {
      showError('Error', 'Password is too weak. Please choose a stronger password.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.resetPasswordCode(email, resetCode, newPassword);
      showSuccess('Success', 'Password reset successfully! You can now sign in with your new password.');
      onSuccess();
    } catch (error) {
      showError('Error', 'Failed to reset password. Please check your code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderCodeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Enter Reset Code</h2>
        <p className="text-gray-300">We sent a 6-digit code to {email}</p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reset Code
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Code Information:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Check your email for the 6-digit code</li>
                  <li>The code expires in 30 minutes</li>
                  <li>Enter the code to proceed to password reset</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setStep('request')}
          className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <button
          onClick={() => setStep('reset')}
          disabled={!resetCode || resetCode.length !== 6}
          className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );

  const renderRequestStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <Lock className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Reset Your Password</h2>
        <p className="text-gray-300">Enter your email address and we'll send you a reset link</p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>We'll send a secure reset link to your email</li>
                  <li>Click the link to create a new password</li>
                  <li>The link expires in 1 hour for security</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={requestPasswordReset}
          disabled={!email || loading}
          className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
          <span>Send Reset Link</span>
        </button>
      </div>
    </motion.div>
  );

  const renderResetStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Create New Password</h2>
        <p className="text-gray-300">Enter your new password below</p>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {newPassword && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Password Strength</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength <= 2 ? 'text-red-400' :
                    passwordStrength <= 3 ? 'text-yellow-400' :
                    passwordStrength <= 4 ? 'text-blue-400' : 'text-green-400'
                  }`}>
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
            )}
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="text-sm text-blue-300">
              <p className="font-medium mb-2">Password Requirements:</p>
              <ul className="space-y-1 text-xs">
                <li className={`flex items-center space-x-2 ${passwordRequirements.length ? 'text-green-400' : 'text-gray-400'}`}>
                  <CheckCircle className="h-3 w-3" />
                  <span>At least 8 characters long</span>
                </li>
                <li className={`flex items-center space-x-2 ${passwordRequirements.uppercase ? 'text-green-400' : 'text-gray-400'}`}>
                  <CheckCircle className="h-3 w-3" />
                  <span>Contains uppercase letter</span>
                </li>
                <li className={`flex items-center space-x-2 ${passwordRequirements.lowercase ? 'text-green-400' : 'text-gray-400'}`}>
                  <CheckCircle className="h-3 w-3" />
                  <span>Contains lowercase letter</span>
                </li>
                <li className={`flex items-center space-x-2 ${passwordRequirements.number ? 'text-green-400' : 'text-gray-400'}`}>
                  <CheckCircle className="h-3 w-3" />
                  <span>Contains number</span>
                </li>
                <li className={`flex items-center space-x-2 ${passwordRequirements.special ? 'text-green-400' : 'text-gray-400'}`}>
                  <CheckCircle className="h-3 w-3" />
                  <span>Contains special character</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setStep('code')}
          className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
        <button
          onClick={resetPassword}
          disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || passwordStrength < 3 || loading}
          className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
          <span>Reset Password</span>
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
        className="bg-slate-900 rounded-2xl p-6 w-full max-w-md"
      >
        {step === 'request' ? renderRequestStep() : step === 'code' ? renderCodeStep() : renderResetStep()}
      </motion.div>
    </div>
  );
};
