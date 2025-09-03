import React, { useState } from 'react';
import { X, Link as LinkIcon, Copy, QrCode, Send, Eye, Calendar, DollarSign, User, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useNotifications } from '../common/NotificationSystem';

interface PaymentLinkDetailsModalProps {
  link: any;
  onClose: () => void;
  onLinkUpdated: () => void;
}

export function PaymentLinkDetailsModal({ link, onClose, onLinkUpdated }: PaymentLinkDetailsModalProps) {
  const { showSuccess, showError } = useNotifications();
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const paymentUrl = `${window.location.origin}/payment-link/${link.secureToken || link.token}`;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(type);
      setTimeout(() => setCopiedText(null), 2000);
      showSuccess('Copied!', `${type} copied to clipboard.`);
    } catch (error) {
      showError('Copy Failed', 'Failed to copy to clipboard.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'USED':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'EXPIRED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'USED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const isExpired = new Date(link.expires_at) < new Date();
  const daysUntilExpiry = Math.ceil((new Date(link.expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mr-4">
              <LinkIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{link.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Payment Link Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(link.status)}`}>
            <div className="flex items-center">
              {getStatusIcon(link.status)}
              <div className="ml-3">
                <h3 className="font-medium">Status: {link.status}</h3>
                {link.status === 'ACTIVE' && !isExpired && (
                  <p className="text-sm mt-1">
                    {daysUntilExpiry > 0 ? `Expires in ${daysUntilExpiry} days` : 'Expires today'}
                  </p>
                )}
                {link.status === 'ACTIVE' && isExpired && (
                  <p className="text-sm mt-1 text-red-600">This link has expired</p>
                )}
                {link.status === 'USED' && (
                  <p className="text-sm mt-1">Payment completed successfully</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Client</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {link.client?.fullName || 'Unknown'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                </div>
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  ${parseFloat(link.amount).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date(link.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Expires</span>
                </div>
                <span className={`font-medium ${isExpired ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                  {new Date(link.expires_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Payment URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={paymentUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-mono text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(paymentUrl, 'Payment URL')}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    title="Copy URL"
                  >
                    {copiedText === 'Payment URL' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Secure Token */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secure Token
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={link.secureToken || link.token}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-mono text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => copyToClipboard(link.secureToken || link.token, 'Token')}
                    className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    title="Copy Token"
                  >
                    {copiedText === 'Token' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Client Email */}
              {link.client?.email && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client Email
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={link.client.email}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => copyToClipboard(link.client.email, 'Email')}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      title="Copy Email"
                    >
                      {copiedText === 'Email' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {link.description && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Description</h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">{link.description}</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => handleSendLink(link)}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Link
            </button>
            <button
              onClick={() => generateQRCode(link)}
              className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </button>
            <a
              href={paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </a>
          </div>

          {/* Usage Statistics */}
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Link Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {new Date(link.created_at).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                <span className="ml-2 text-gray-900 dark:text-white">
                  {new Date(link.updated_at).toLocaleString()}
                </span>
              </div>
              {link.usedAt && (
                <div className="col-span-2">
                  <span className="text-gray-600 dark:text-gray-400">Payment Completed:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {new Date(link.usedAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}