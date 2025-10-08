import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Smartphone, 
  Mail, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Download,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';
import { useNotifications } from '../common/NotificationSystem';

interface MfaSetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface TotpSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export const MfaSetup: React.FC<MfaSetupProps> = ({ onComplete, onCancel }) => {
  const { showSuccess, showError } = useNotifications();
  const [step, setStep] = useState<'method' | 'totp-setup' | 'totp-verify' | 'backup-codes' | 'complete'>('method');
  const [selectedMethod, setSelectedMethod] = useState<'TOTP' | 'EMAIL' | 'SMS'>('TOTP');
  const [totpSetup, setTotpSetup] = useState<TotpSetup | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const methods = [
    {
      id: 'TOTP',
      name: 'Google Authenticator',
      description: 'Use Google Authenticator or similar TOTP app',
      icon: Smartphone,
      color: 'from-blue-500 to-blue-600',
      recommended: true,
    },
    {
      id: 'EMAIL',
      name: 'Email Verification',
      description: 'Receive verification codes via email',
      icon: Mail,
      color: 'from-accent500 to-accent600',
      recommended: false,
    },
    {
      id: 'SMS',
      name: 'SMS Verification',
      description: 'Receive verification codes via SMS',
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      recommended: false,
    },
  ];

  const setupTotp = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/mfa/setup-totp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to setup TOTP');
      }

      const data = await response.json();
      setTotpSetup(data);
      setStep('totp-setup');
    } catch (error) {
      showError('Setup Error', 'Failed to setup TOTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const enableMfa = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/mfa/enable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationCode }),
      });

      if (!response.ok) {
        throw new Error('Invalid verification code');
      }

      const data = await response.json();
      setBackupCodes(data.backupCodes);
      setStep('backup-codes');
    } catch (error) {
      showError('Verification Error', 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess('Copied', 'Copied to clipboard');
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

  const handleMethodSelect = (method: 'TOTP' | 'EMAIL' | 'SMS') => {
    setSelectedMethod(method);
    if (method === 'TOTP') {
      setupTotp();
    } else {
      // For EMAIL and SMS, you would implement different flows
      showError('Coming Soon', `${method} verification will be available soon.`);
    }
  };

  const renderMethodSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <Shield className="h-16 w-16 text-accent1 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-fg mb-2">Enable Two-Factor Authentication</h2>
        <p className="text-muted">Choose your preferred method for additional security</p>
      </div>

      <div className="grid gap-4">
        {methods.map((method) => (
          <motion.button
            key={method.id}
            onClick={() => handleMethodSelect(method.id as 'TOTP' | 'EMAIL' | 'SMS')}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              selectedMethod === method.id
                ? 'border-emerald-500 bg-accent2/10'
                : 'border-outline bg-surface hover:border-slate-600'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${method.color}`}>
                <method.icon className="h-6 w-6 text-fg" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-fg">{method.name}</h3>
                  {method.recommended && (
                    <span className="px-2 py-1 text-xs bg-accent2 text-fg rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted">{method.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-surface2 hover:bg-slate-600 text-fg rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );

  const renderTotpSetup = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <Smartphone className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-fg mb-2">Setup Google Authenticator</h2>
        <p className="text-muted">Scan the QR code with your authenticator app</p>
      </div>

      <div className="bg-surface rounded-xl p-6">
        <div className="text-center mb-6">
          <div className="bg-white p-4 rounded-lg inline-block">
            <img 
              src={totpSetup?.qrCodeUrl} 
              alt="QR Code" 
              className="w-48 h-48 mx-auto"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Manual Entry Key
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={totpSetup?.secret || ''}
                readOnly
                className="flex-1 px-3 py-2 bg-surface2 border border-slate-600 rounded-lg text-fg font-mono text-sm"
              />
              <button
                onClick={() => copyToClipboard(totpSetup?.secret || '')}
                className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
              >
                <Copy className="h-4 w-4 text-fg" />
              </button>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-300">
                <p className="font-medium mb-1">Setup Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Install Google Authenticator or similar TOTP app</li>
                  <li>Scan the QR code or enter the manual key</li>
                  <li>Enter the 6-digit code from your app to verify</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setStep('method')}
          className="flex-1 px-4 py-3 bg-surface2 hover:bg-slate-600 text-fg rounded-lg font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => setStep('totp-verify')}
          className="flex-1 px-4 py-3 bg-accent2 hover:bg-accent1 text-fg rounded-lg font-medium transition-colors"
        >
          Next: Verify
        </button>
      </div>
    </motion.div>
  );

  const renderTotpVerify = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-accent1 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-fg mb-2">Verify Setup</h2>
        <p className="text-muted">Enter the 6-digit code from your authenticator app</p>
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

          <div className="bg-accent2/10 border border-emerald-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-accent2 mt-0.5" />
              <div className="text-sm text-accent3">
                <p className="font-medium mb-1">Need help?</p>
                <p className="text-xs">Make sure your device time is synchronized and enter the current 6-digit code from your authenticator app.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => setStep('totp-setup')}
          className="flex-1 px-4 py-3 bg-surface2 hover:bg-slate-600 text-fg rounded-lg font-medium transition-colors"
        >
          Back
        </button>
        <button
          onClick={enableMfa}
          disabled={verificationCode.length !== 6 || loading}
          className="flex-1 px-4 py-3 bg-accent2 hover:bg-accent1 disabled:bg-slate-600 disabled:cursor-not-allowed text-fg rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
        >
          {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
          <span>Enable MFA</span>
        </button>
      </div>
    </motion.div>
  );

  const renderBackupCodes = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <Shield className="h-16 w-16 text-accent1 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-fg mb-2">Save Your Backup Codes</h2>
        <p className="text-muted">Store these codes in a safe place. Each can only be used once.</p>
      </div>

      <div className="bg-surface rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-fg">Backup Codes</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowBackupCodes(!showBackupCodes)}
              className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
            >
              {showBackupCodes ? <EyeOff className="h-4 w-4 text-fg" /> : <Eye className="h-4 w-4 text-fg" />}
            </button>
            <button
              onClick={downloadBackupCodes}
              className="p-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4 text-fg" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {backupCodes.map((code, index) => (
            <div
              key={index}
              className="p-3 bg-surface2 rounded-lg font-mono text-center"
            >
              {showBackupCodes ? (
                <span className="text-fg">{code}</span>
              ) : (
                <span className="text-gray-500">••••••</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
            <div className="text-sm text-amber-300">
              <p className="font-medium mb-1">Important Security Notice:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Store these codes in a secure location</li>
                <li>Each code can only be used once</li>
                <li>You can generate new codes anytime</li>
                <li>If you lose access to your authenticator app, use these codes to regain access</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onComplete}
          className="flex-1 px-4 py-3 bg-accent2 hover:bg-accent1 text-fg rounded-lg font-medium transition-colors"
        >
          Complete Setup
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
        className="bg-bg2 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <AnimatePresence mode="wait">
          {step === 'method' && renderMethodSelection()}
          {step === 'totp-setup' && renderTotpSetup()}
          {step === 'totp-verify' && renderTotpVerify()}
          {step === 'backup-codes' && renderBackupCodes()}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
