import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { useNotifications } from '../common/NotificationSystem';
import { 
  CreditCard, 
  Plus, 
  DollarSign, 
  User, 
  Calendar, 
  Shield, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Link as LinkIcon,
  Send,
  Eye,
  RefreshCw
} from 'lucide-react';
import { ChargeClientModal } from './ChargeClientModal';
import { CreatePaymentLinkModal } from './CreatePaymentLinkModal';

export function PaymentProcessingPage() {
  const { showSuccess, showError } = useNotifications();
  
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [recentLinks, setRecentLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [stats, setStats] = useState({
    totalProcessed: 0,
    totalAmount: 0,
    successRate: 0,
    activeLinks: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsResponse, linksResponse] = await Promise.all([
        apiClient.getPayments(),
        apiClient.getPaymentLinks(),
      ]);

      const payments = paymentsResponse.payments || [];
      const links = linksResponse.links || [];

      setRecentPayments(payments.slice(0, 10));
      setRecentLinks(links.slice(0, 5));

      // Calculate stats
      const totalProcessed = payments.length;
      const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);
      const successfulPayments = payments.filter(p => p.status === 'COMPLETED').length;
      const successRate = totalProcessed > 0 ? (successfulPayments / totalProcessed) * 100 : 0;
      const activeLinks = links.filter(l => l.status === 'ACTIVE').length;

      setStats({
        totalProcessed,
        totalAmount,
        successRate,
        activeLinks,
      });

      showSuccess('Payment Data Loaded', 'Payment processing data loaded successfully.');
    } catch (error) {
      console.error('Error fetching payment data:', error);
      showError('Failed to Load Data', 'Unable to load payment processing data.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'USED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'USED':
        return <CheckCircle className="h-4 w-4" />;
      case 'PENDING':
      case 'ACTIVE':
        return <Clock className="h-4 w-4" />;
      case 'FAILED':
      case 'EXPIRED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Processing</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Charge cards and manage payment links</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchData}
            className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowLinkModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LinkIcon className="h-4 w-4 mr-2" />
            Create Payment Link
          </button>
          <button
            onClick={() => setShowChargeModal(true)}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Charge Card
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Processed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProcessed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.successRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <LinkIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Links</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeLinks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payments</h2>
          </div>
          <div className="p-4">
            {recentPayments.length > 0 ? (
              <div className="space-y-3">
                {recentPayments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                        <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {payment.client_name || 'Unknown Client'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${parseFloat(payment.amount).toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No recent payments</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Payment Links */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Payment Links</h2>
          </div>
          <div className="p-4">
            {recentLinks.length > 0 ? (
              <div className="space-y-3">
                {recentLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
                        <LinkIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {link.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {link.client?.fullName || 'Guest'} • {new Date(link.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${parseFloat(link.amount).toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        {getStatusIcon(link.status)}
                        <span className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(link.status)}`}>
                          {link.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No payment links created</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Payment Processing Tools</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Process payments instantly or create secure payment links that can be shared with anyone. 
            All transactions are processed securely through Authorize.Net with bank-grade encryption.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Direct Card Charge</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Charge any client's card immediately with secure card processing
              </p>
              <button
                onClick={() => setShowChargeModal(true)}
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Charge Card Now
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <LinkIcon className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Payment Link</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Create secure payment links to send via email, SMS, or share anywhere
              </p>
              <button
                onClick={() => setShowLinkModal(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Create Payment Link
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security & Compliance</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">PCI Compliant</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Bank-grade security standards</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">256-bit SSL</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">End-to-end encryption</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Authorize.Net</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">Trusted payment gateway</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChargeClientModal
        isOpen={showChargeModal}
        onClose={() => setShowChargeModal(false)}
        onPaymentProcessed={() => {
          setShowChargeModal(false);
          fetchData();
        }}
      />

      <CreatePaymentLinkModal
        onClose={() => setShowLinkModal(false)}
        onSuccess={(newLink) => {
          setShowLinkModal(false);
          fetchData();
        }}
      />
    </div>
  );
}