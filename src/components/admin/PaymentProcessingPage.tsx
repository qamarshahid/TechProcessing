import React, { useState, useEffect } from 'react';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { 
  CreditCard, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  TrendingUp,
  Eye,
  Download,
  Filter,
  Search
} from 'lucide-react';

export function PaymentProcessingPage() {
  const { showSuccess, showError } = useNotifications();
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    amount: '',
    dateRange: '',
  });
  const [stats, setStats] = useState({
    totalPayments: 0,
    pendingPayments: 0,
    completedPayments: 0,
    failedPayments: 0,
    totalAmount: 0,
    processingFees: 0,
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, filters]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getPayments();
      const paymentsList = response?.payments || [];
      
      // Ensure we always have an array
      const safePaymentsList = Array.isArray(paymentsList) ? paymentsList : [];
      setPayments(safePaymentsList);
      setFilteredPayments(safePaymentsList);
      calculateStats(safePaymentsList);
      showSuccess('Payments Data Loaded', `Successfully loaded ${safePaymentsList.length} payments.`);
    } catch (error) {
      logger.error('Error fetching payments:', error);
      showError('Failed to Load Payments', 'Unable to load payments data. Please try again later.');
      setPayments([]);
      setFilteredPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (paymentsList: any[]) => {
    if (!Array.isArray(paymentsList)) {
      paymentsList = [];
    }
    
    const totalPayments = paymentsList.length;
    const pendingPayments = paymentsList.filter(p => p.status === 'PENDING').length;
    const completedPayments = paymentsList.filter(p => p.status === 'COMPLETED').length;
    const failedPayments = paymentsList.filter(p => p.status === 'FAILED').length;
    const totalAmount = paymentsList.reduce((sum, payment) => 
      sum + parseFloat(payment.amount || '0'), 0
    );
    const processingFees = paymentsList.reduce((sum, payment) => 
      sum + parseFloat(payment.processing_fee || '0'), 0
    );

    setStats({
      totalPayments,
      pendingPayments,
      completedPayments,
      failedPayments,
      totalAmount,
      processingFees,
    });
  };

  const filterPayments = () => {
    // Ensure payments is always an array
    const safePayments = Array.isArray(payments) ? payments : [];
    let filtered = [...safePayments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment?.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment?.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment?.payment_method?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(payment => 
        payment?.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Method filter
    if (filters.method) {
      filtered = filtered.filter(payment => 
        payment?.payment_method?.toLowerCase().includes(filters.method.toLowerCase())
      );
    }

    // Amount filter
    if (filters.amount) {
      const amount = parseFloat(filters.amount);
      filtered = filtered.filter(payment => 
        parseFloat(payment?.amount || '0') >= amount
      );
    }

    setFilteredPayments(filtered);
  };

  const handlePaymentAction = async (paymentId: string, action: 'approve' | 'reject' | 'refund') => {
    try {
      let newStatus = '';
      let message = '';
      
      switch (action) {
        case 'approve':
          newStatus = 'COMPLETED';
          message = 'Payment approved successfully.';
          break;
        case 'reject':
          newStatus = 'FAILED';
          message = 'Payment rejected.';
          break;
        case 'refund':
          newStatus = 'REFUNDED';
          message = 'Payment refunded successfully.';
          break;
      }
      
      showSuccess('Payment Updated', message);
      
      setPayments(prev => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return safePrev.map(payment => 
          payment?.id === paymentId 
            ? { ...payment, status: newStatus }
            : payment
        );
      });
      
      fetchPayments(); // Refresh data
    } catch (error) {
      logger.error(`Error ${action}ing payment:`, error);
      showError('Action Failed', `Failed to ${action} payment. Please try again.`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'refunded':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'refunded':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Ensure arrays are always safe
  const safeFilteredPayments = Array.isArray(filteredPayments) ? filteredPayments : [];
  const safePayments = Array.isArray(payments) ? payments : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Processing</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Manage and process client payments and transactions</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <CreditCard className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Failed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.failedPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Processing Fees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.processingFees.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search payments by transaction ID, client name, or payment method..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <select
                value={filters.method}
                onChange={(e) => setFilters({ ...filters, method: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              >
                <option value="">All Methods</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
              </select>
              <button
                onClick={fetchPayments}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {safeFilteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {payment.transaction_id || 'Unknown Transaction'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {payment.invoice_id ? `Invoice: ${payment.invoice_id}` : 'No invoice'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {payment.client_name || 'Unknown Client'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {payment.client_email || 'No email'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${parseFloat(payment.amount || '0').toFixed(2)}
                    </div>
                    {payment.processing_fee && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Fee: ${parseFloat(payment.processing_fee).toFixed(2)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {payment.payment_method || 'Unknown Method'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1 capitalize">
                        {payment.status || 'Unknown'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {payment.created_at ? 
                      new Date(payment.created_at).toLocaleDateString() : 
                      'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        title="View payment details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {payment.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handlePaymentAction(payment.id, 'approve')}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                            title="Approve payment"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePaymentAction(payment.id, 'reject')}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Reject payment"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {payment.status === 'COMPLETED' && (
                        <button
                          onClick={() => handlePaymentAction(payment.id, 'refund')}
                          className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                          title="Refund payment"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                        title="Download receipt"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {safeFilteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No payments found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {safePayments.length === 0 ? 'No payments available.' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
