import React, { useState, useEffect } from 'react';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { SearchFilters } from './SearchFilters';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle,
  Eye,
  Download,
  RefreshCw,
  Filter,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';

export function PaymentHistoryPage() {
  const { showSuccess, showError } = useNotifications();
  const [payments, setPayments] = useState<any[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    dateRange: '',
    amount: '',
  });
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
    completedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
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
      const paymentList = response?.payments || [];
      
      setPayments(Array.isArray(paymentList) ? paymentList : []);
      calculateStats(paymentList);
      showSuccess('Payment History Loaded', `Successfully loaded ${paymentList.length} payments.`);
    } catch (error) {
      logger.error('Error fetching payments:', error);
      showError('Failed to Load Payments', 'Unable to load payment history. Please try again later.');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (paymentList: any[]) => {
    const totalPayments = paymentList.length;
    const totalAmount = paymentList.reduce((sum, payment) => 
      sum + parseFloat(payment.amount || '0'), 0
    );
    const completedPayments = paymentList.filter(p => 
      p.status === 'COMPLETED' || p.status === 'completed'
    ).length;
    const pendingPayments = paymentList.filter(p => 
      p.status === 'PENDING' || p.status === 'pending'
    ).length;
    const failedPayments = paymentList.filter(p => 
      p.status === 'FAILED' || p.status === 'failed'
    ).length;

    setStats({
      totalPayments,
      totalAmount,
      completedPayments,
      pendingPayments,
      failedPayments,
    });
  };

  const filterPayments = () => {
    let filtered = [...payments];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(payment => 
        payment.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Method filter
    if (filters.method) {
      filtered = filtered.filter(payment => payment.method === filters.method);
    }

    // Amount filter
    if (filters.amount) {
      filtered = filtered.filter(payment => {
        const amount = parseFloat(payment.amount);
        switch (filters.amount) {
          case '0-100': return amount >= 0 && amount <= 100;
          case '100-500': return amount > 100 && amount <= 500;
          case '500-1000': return amount > 500 && amount <= 1000;
          case '1000-5000': return amount > 1000 && amount <= 5000;
          case '5000+': return amount > 5000;
          default: return true;
        }
      });
    }

    setFilteredPayments(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      method: '',
      dateRange: '',
      amount: '',
    });
    setSearchTerm('');
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-accent100 text-accent800 dark:bg-accent900/20 dark:text-accent400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'refunded':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'CARD':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'ZELLE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'CASHAPP':
        return 'bg-accent100 text-accent800 dark:bg-accent900/20 dark:text-accent400';
      case 'BANK_TRANSFER':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-muted';
    }
  };

  const viewPaymentDetails = (payment: any) => {
    alert(`Payment Details:\nID: ${payment.id}\nClient: ${payment.client_name || 'Unknown'}\nAmount: $${payment.amount}\nMethod: ${payment.method}\nStatus: ${payment.status}\nDate: ${new Date(payment.created_at).toLocaleDateString()}`);
  };

  const downloadReceipt = (payment: any) => {
    // Simulate receipt download
    const receiptData = `
Payment Receipt
===============
Payment ID: ${payment.id}
Client: ${payment.client_name || 'Unknown'}
Amount: $${payment.amount}
Method: ${payment.method}
Status: ${payment.status}
Date: ${new Date(payment.created_at).toLocaleDateString()}
Transaction ID: ${payment.transaction_id || 'N/A'}
    `;
    
    const blob = new Blob([receiptData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-surface2 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-surface2 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-surface2 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-fg">Payment History</h1>
          <p className="text-sm text-gray-600 dark:text-muted">View and manage all payment transactions</p>
        </div>
        <button
          onClick={fetchPayments}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-fg rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-gray-200 dark:border-outline p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="h-6 w-6 text-fg" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-muted">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-fg">{stats.totalPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-gray-200 dark:border-outline p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-accent500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-fg" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-muted">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-fg">${stats.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-gray-200 dark:border-outline p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-accent1 to-accent600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="h-6 w-6 text-fg" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-muted">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-fg">{stats.completedPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-gray-200 dark:border-outline p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="h-6 w-6 text-fg" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-muted">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-fg">{stats.pendingPayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterOptions={{
          statuses: ['COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'],
        }}
        placeholder="Search payments by client, transaction ID, or notes..."
      />

      {/* Payments Table */}
      <div className="bg-white dark:bg-surface rounded-lg shadow-sm border border-gray-200 dark:border-outline">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-outline">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-fg">
            Payment Transactions ({filteredPayments.length})
          </h2>
        </div>
        
        {filteredPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
              <thead className="bg-gray-50 dark:bg-surface2">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface divide-y divide-gray-200 dark:divide-slate-600">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-surface2">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-fg">
                          {payment.client_name || payment.user?.fullName || 'Unknown Client'}
                        </div>
                        {payment.invoice?.description && (
                          <div className="text-xs text-gray-500 dark:text-muted">
                            {payment.invoice.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-fg">
                        ${parseFloat(payment.amount).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getMethodColor(payment.method)}`}>
                        {payment.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-fg">
                      <div>
                        <div>
                          {payment.created_at && !isNaN(new Date(payment.created_at).getTime()) 
                            ? new Date(payment.created_at).toLocaleDateString()
                            : 'No date'
                          }
                        </div>
                        {payment.processed_at && (
                          <div className="text-xs text-gray-500 dark:text-muted">
                            Processed: {new Date(payment.processed_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900 dark:text-fg">
                        {payment.transaction_id || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => viewPaymentDetails(payment)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => downloadReceipt(payment)}
                          className="text-accent600 hover:text-accent900 dark:text-accent400 dark:hover:text-accent300"
                          title="Download Receipt"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-surface2 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-muted dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-fg mb-2">No Payments Found</h3>
            <p className="text-gray-500 dark:text-muted mb-6">
              {searchTerm || Object.values(filters).some(f => f) 
                ? 'Try adjusting your search or filter criteria.'
                : 'Payment transactions will appear here when processed.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Payment Summary */}
      <div className="bg-white dark:bg-surface rounded-lg shadow-sm border border-gray-200 dark:border-outline p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-fg mb-4">Payment Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalPayments}</div>
            <div className="text-sm text-gray-600 dark:text-muted">Total Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent600 dark:text-accent400">${stats.totalAmount.toLocaleString()}</div>
            <div className="text-sm text-gray-600 dark:text-muted">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent1 dark:text-accent2">{stats.completedPayments}</div>
            <div className="text-sm text-gray-600 dark:text-muted">Successful Payments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendingPayments}</div>
            <div className="text-sm text-gray-600 dark:text-muted">Pending Payments</div>
          </div>
        </div>
      </div>
    </div>
  );
}