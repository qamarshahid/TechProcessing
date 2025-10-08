import React, { useState } from 'react';
import { X, Send, Mail, MessageSquare, Copy, CheckCircle } from 'lucide-react';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';

interface SendPaymentLinkModalProps {
  link: any;
  onClose: () => void;
  onSent: () => void;
}

export function SendPaymentLinkModal({ link, onClose, onSent }: SendPaymentLinkModalProps) {
  const { showSuccess, showError } = useNotifications();
  const [sendMethod, setSendMethod] = useState<'email' | 'sms' | 'copy'>('email');
  const [customEmail, setCustomEmail] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [emailSubject, setEmailSubject] = useState(`Payment Request - ${link.title}`);
  const [emailMessage, setEmailMessage] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentUrl = `${window.location.origin}/payment-link/${link.secureToken || link.token}`;

  React.useEffect(() => {
    // Set default email message
    setEmailMessage(`Hello ${link.client?.fullName || 'Valued Client'},

You have a payment request from Tech Processing LLC.

Payment Details:
- Amount: $${parseFloat(link.amount).toLocaleString()}
- Description: ${link.description || link.title}
- Due: ${new Date(link.expires_at).toLocaleDateString()}

Please click the secure link below to complete your payment:
${paymentUrl}

This link will expire on ${new Date(link.expires_at).toLocaleDateString()}.

If you have any questions, please don't hesitate to contact us.

Best regards,
Tech Processing LLC Team`);

    // Set default SMS message
    setSmsMessage(`Tech Processing LLC: Payment request for $${parseFloat(link.amount).toLocaleString()}. Pay securely: ${paymentUrl} (Expires: ${new Date(link.expires_at).toLocaleDateString()})`);
  }, [link, paymentUrl]);

  const handleSend = async () => {
    setLoading(true);

    try {
      if (sendMethod === 'email') {
        const emailData = {
          to: customEmail || link.client?.email,
          subject: emailSubject,
          message: emailMessage,
          paymentLinkId: link.id,
        };

        await apiClient.sendPaymentLinkEmail(emailData);
        showSuccess('Email Sent', 'Payment link email has been sent successfully.');
      } else if (sendMethod === 'sms') {
        const smsData = {
          to: customPhone,
          message: smsMessage,
          paymentLinkId: link.id,
        };

        await apiClient.sendPaymentLinkSMS(smsData);
        showSuccess('SMS Sent', 'Payment link SMS has been sent successfully.');
      } else {
        // Copy method
        await navigator.clipboard.writeText(paymentUrl);
        showSuccess('Link Copied', 'Payment link has been copied to clipboard.');
      }

      onSent();
      onClose();
    } catch (error: any) {
      console.error('Error sending payment link:', error);
      showError('Send Failed', error.message || 'Failed to send payment link.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paymentUrl);
      showSuccess('Copied!', 'Payment link copied to clipboard.');
    } catch (error) {
      showError('Copy Failed', 'Failed to copy to clipboard.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-surface rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-outline">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-accent100 dark:bg-accent900/20 rounded-lg flex items-center justify-center mr-3">
              <Send className="h-5 w-5 text-accent600 dark:text-accent400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-fg">Send Payment Link</h2>
              <p className="text-sm text-gray-600 dark:text-muted">{link.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-gray-600 dark:hover:text-muted transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Send Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-3">
              Send Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSendMethod('email')}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                  sendMethod === 'email'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 text-gray-600 dark:text-muted'
                }`}
              >
                <Mail className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Email</span>
              </button>
              <button
                onClick={() => setSendMethod('sms')}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                  sendMethod === 'sms'
                    ? 'border-accent500 bg-accent50 dark:bg-accent900/20 text-accent700 dark:text-accent300'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 text-gray-600 dark:text-muted'
                }`}
              >
                <MessageSquare className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">SMS</span>
              </button>
              <button
                onClick={() => setSendMethod('copy')}
                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                  sendMethod === 'copy'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500 text-gray-600 dark:text-muted'
                }`}
              >
                <Copy className="h-6 w-6 mb-2" />
                <span className="text-sm font-medium">Copy</span>
              </button>
            </div>
          </div>

          {/* Email Form */}
          {sendMethod === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customEmail || link.client?.email || ''}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-surface2 text-gray-900 dark:text-fg"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-surface2 text-gray-900 dark:text-fg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                  Message
                </label>
                <textarea
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-surface2 text-gray-900 dark:text-fg"
                />
              </div>
            </div>
          )}

          {/* SMS Form */}
          {sendMethod === 'sms' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent500 focus:border-transparent bg-white dark:bg-surface2 text-gray-900 dark:text-fg"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                  Message ({smsMessage.length}/160)
                </label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  rows={4}
                  maxLength={160}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent500 focus:border-transparent bg-white dark:bg-surface2 text-gray-900 dark:text-fg"
                />
                <p className="text-xs text-gray-500 dark:text-muted mt-1">
                  Keep SMS messages under 160 characters for best delivery
                </p>
              </div>
            </div>
          )}

          {/* Copy Instructions */}
          {sendMethod === 'copy' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
                  Copy Payment Link
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-400 mb-3">
                  Click the button below to copy the payment link to your clipboard. You can then share it via any method you prefer.
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={paymentUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white dark:bg-surface2 border border-purple-200 dark:border-purple-700 rounded-lg text-sm font-mono text-gray-900 dark:text-fg"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-2 bg-purple-600 text-fg rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-outline flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-surface2 transition-colors"
          >
            Cancel
          </button>
          {sendMethod !== 'copy' && (
            <button
              onClick={handleSend}
              disabled={loading || (sendMethod === 'email' && !emailSubject) || (sendMethod === 'sms' && !customPhone)}
              className="px-4 py-2 bg-blue-600 text-fg rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {sendMethod === 'email' ? 'Send Email' : 'Send SMS'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}