import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  Settings,
  Key,
  Eye,
  EyeOff,
  RefreshCw,
  Download,
  Copy
} from 'lucide-react';
import { useNotifications } from '../common/NotificationSystem';
import { MfaSetup } from './MfaSetup';

interface SecuritySettingsProps {
  user: any;
  onClose: () => void;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ user, onClose }) => {
  const { showSuccess, showError } = useNotifications();
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [mfaStatus, setMfaStatus] = useState({
    enabled: user?.mfaEnabled || false,
    method: user?.twoFactorMethod || null,
  });
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const disableMfa = async () => {
    if (!currentPassword) {
      showError('Error', 'Please enter your current password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/mfa/disable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: currentPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to disable MFA');
      }

      setMfaStatus({ enabled: false, method: null });
      setCurrentPassword('');
      showSuccess('Success', 'Two-factor authentication has been disabled');
    } catch (error) {
      showError('Error', 'Failed to disable MFA. Please check your password and try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateNewBackupCodes = async () => {
    if (!currentPassword) {
      showError('Error', 'Please enter your current password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/mfa/generate-backup-codes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: currentPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate new backup codes');
      }

      const data = await response.json();
      setBackupCodes(data.backupCodes);
      setShowBackupCodes(true);
      setCurrentPassword('');
      showSuccess('Success', 'New backup codes generated successfully');
    } catch (error) {
      showError('Error', 'Failed to generate new backup codes. Please check your password and try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    const content = `TechProcessing LLC - MFA Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\nBackup Codes:\n${backupCodes.map((code, index) => `${index + 1}. ${code}`).join('\n')}\n\nImportant: Store these codes in a safe place. Each code can only be used once.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'techprocessing-mfa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showSuccess('Downloaded', 'Backup codes downloaded successfully');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess('Copied', 'Copied to clipboard');
  };

  const getMethodInfo = (method: string) => {
    switch (method) {
      case 'TOTP':
        return {
          name: 'Google Authenticator',
          icon: Smartphone,
          color: 'from-blue-500 to-blue-600',
          description: 'Time-based one-time passwords'
        };
      case 'EMAIL':
        return {
          name: 'Email Verification',
          icon: Mail,
          color: 'from-green-500 to-green-600',
          description: 'Verification codes via email'
        };
      case 'SMS':
        return {
          name: 'SMS Verification',
          icon: MessageSquare,
          color: 'from-purple-500 to-purple-600',
          description: 'Verification codes via SMS'
        };
      default:
        return {
          name: 'Not Set',
          icon: Shield,
          color: 'from-gray-500 to-gray-600',
          description: 'No method configured'
        };
    }
  };

  const methodInfo = getMethodInfo(mfaStatus.method || '');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-900 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Settings className="h-6 w-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Security Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <span className="text-gray-400 hover:text-white">✕</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* MFA Status */}
          <div className="bg-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-emerald-400" />
                <h3 className="text-lg font-semibold text-white">Two-Factor Authentication</h3>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                mfaStatus.enabled 
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {mfaStatus.enabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>

            {mfaStatus.enabled ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-slate-700/50 rounded-lg">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${methodInfo.color}`}>
                    <methodInfo.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{methodInfo.name}</p>
                    <p className="text-sm text-gray-400">{methodInfo.description}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowMfaSetup(true)}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Change Method</span>
                  </button>
                  <button
                    onClick={() => setCurrentPassword('')}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Disable MFA
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div className="text-sm text-amber-300">
                      <p className="font-medium mb-1">Security Recommendation</p>
                      <p className="text-xs">Enable two-factor authentication to add an extra layer of security to your account.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowMfaSetup(true)}
                  className="w-full px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Shield className="h-5 w-5" />
                  <span>Enable Two-Factor Authentication</span>
                </button>
              </div>
            )}
          </div>

          {/* Backup Codes */}
          {mfaStatus.enabled && (
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Key className="h-6 w-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Backup Codes</h3>
                </div>
                <button
                  onClick={generateNewBackupCodes}
                  disabled={loading}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                >
                  {loading && <RefreshCw className="h-3 w-3 animate-spin" />}
                  <span>Generate New</span>
                </button>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-300">
                    <p className="font-medium mb-1">Backup Codes</p>
                    <p className="text-xs">Use these codes to access your account if you lose your authenticator device. Each code can only be used once.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Confirmation Modal */}
          {currentPassword !== '' && (
            <div className="bg-slate-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Confirm Your Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setCurrentPassword('')}
                    className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={disableMfa}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                    <span>Disable MFA</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Backup Codes Display */}
          {showBackupCodes && backupCodes.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Your Backup Codes</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={downloadBackupCodes}
                    className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                  >
                    <Download className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={() => setShowBackupCodes(false)}
                    className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
                  >
                    <span className="text-white">✕</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {backupCodes.map((code, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-700 rounded-lg font-mono text-center text-white"
                  >
                    {code}
                  </div>
                ))}
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
                  <div className="text-sm text-amber-300">
                    <p className="font-medium mb-1">Important:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Store these codes in a secure location</li>
                      <li>Each code can only be used once</li>
                      <li>Generate new codes if you run out</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MFA Setup Modal */}
        {showMfaSetup && (
          <MfaSetup
            onComplete={() => {
              setShowMfaSetup(false);
              setMfaStatus({ enabled: true, method: 'TOTP' });
              showSuccess('Success', 'Two-factor authentication has been enabled');
            }}
            onCancel={() => setShowMfaSetup(false)}
          />
        )}
      </motion.div>
    </div>
  );
};
