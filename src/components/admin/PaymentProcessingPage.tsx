import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { useNotifications } from '../common/NotificationSystem';
import { logger } from '../../lib/logger';
import {
  CreditCard, DollarSign, Clock, CheckCircle, XCircle, RefreshCw, Search, Eye, Download, Filter, TrendingUp, BarChart3, Activity, Shield, AlertCircle, Info, Calendar, User, Building, ArrowUpDown, ChevronDown, ChevronUp, Settings, HelpCircle, Zap, Rocket
} from 'lucide-react';

interface Payment {
  id: string;
  amount: string;
  status: string;
  client_name?: string;
  client?: { fullName: string };
  created_at?: string;
  updated_at?: string;
  payment_method?: string;
  reference?: string;
  description?: string;
}

export function PaymentProcessingPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterAndSortPayments();
  }, [payments, searchTerm, statusFilter, sortBy, sortOrder]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.getPayments();
      const paymentsList = response?.payments || [];
      
      setPayments(paymentsList);
      setFilteredPayments(paymentsList);
      
      showSuccess('Payments Loaded', 'Payment data loaded successfully.');
    } catch (error) {
      logger.error('Error fetching payments:', error);
      setError('Failed to load payments. Please try again.');
      showError('Payment Error', 'Failed to load payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPayments = () => {
    let filtered = [...payments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => (payment.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'amount':
          aValue = parseFloat(a.amount || '0');
          bValue = parseFloat(b.amount || '0');
          break;
        case 'date':
          aValue = new Date(a.created_at || a.updated_at || '');
          bValue = new Date(b.created_at || b.updated_at || '');
          break;
        case 'status':
          aValue = (a.status || '').toLowerCase();
          bValue = (b.status || '').toLowerCase();
          break;
        default:
          aValue = a.client_name || a.client?.fullName || '';
          bValue = b.client_name || b.client?.fullName || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredPayments(filtered);
  };

  const handleStatusChange = async (paymentId: string, newStatus: string) => {
    try {
      // Update local state for now (API call would be implemented later)
      setPayments(prev => prev.map(p => 
        p.id === paymentId ? { ...p, status: newStatus } : p
      ));
      
      showSuccess('Status Updated', `Payment status updated to ${newStatus}`);
    } catch (error) {
      logger.error('Error updating payment status:', error);
      showError('Update Failed', 'Failed to update payment status. Please try again.');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-accent2 dark:border-emerald-800';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case 'failed':
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-bg2/20 dark:text-slate-400 dark:border-outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'failed':
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'processing':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'credit_card':
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'bank_transfer':
      case 'transfer':
        return <Building className="h-4 w-4" />;
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const calculateStats = () => {
    const total = payments.length;
    const completed = payments.filter(p => p.status.toLowerCase() === 'completed' || p.status.toLowerCase() === 'paid').length;
    const pending = payments.filter(p => p.status.toLowerCase() === 'pending').length;
    const failed = payments.filter(p => p.status.toLowerCase() === 'failed' || p.status.toLowerCase() === 'cancelled').length;
    const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);
    const completedAmount = payments
      .filter(p => p.status.toLowerCase() === 'completed' || p.status.toLowerCase() === 'paid')
      .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);

    return { total, completed, pending, failed, totalAmount, completedAmount };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="text-center">
              <div className="h-12 bg-slate-200 dark:bg-surface2 rounded-lg w-1/3 mx-auto mb-4"></div>
              <div className="h-6 bg-slate-200 dark:bg-surface2 rounded w-1/2 mx-auto"></div>
            </div>
            
            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-surface2 rounded-xl"></div>
              ))}
            </div>
            
            {/* Table skeleton */}
            <div className="h-96 bg-slate-200 dark:bg-surface2 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent1 to-accent600 rounded-2xl mb-6 shadow-xl">
            <CreditCard className="h-10 w-10 text-fg" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-fg mb-4">
            Payment Processing Center 💳
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Monitor, manage, and process all payment transactions. Track payment statuses, handle disputes, and ensure smooth financial operations.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Payments</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-fg">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <CreditCard className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Activity className="h-4 w-4 mr-1 text-blue-500" />
              <span>All transactions</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Completed</p>
                <p className="text-3xl font-bold text-accent1 dark:text-accent2">{stats.completed}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-accent1 to-accent600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <CheckCircle className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <TrendingUp className="h-4 w-4 mr-1 text-accent1" />
              <span>Successful payments</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Clock className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
              <span>Awaiting processing</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">${stats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <DollarSign className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <BarChart3 className="h-4 w-4 mr-1 text-purple-500" />
              <span>Transaction volume</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-surface2 text-slate-900 dark:text-fg placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-xl border transition-all duration-200 flex items-center gap-2 ${
                    showFilters
                      ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400'
                      : 'bg-white dark:bg-surface2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={fetchPayments}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-fg font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              
              <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent1 to-accent600 text-fg font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-outline">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="status">Status</option>
                    <option value="client">Client</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sort Order</label>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                  >
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Method</label>
                  <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">All Methods</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payments Table */}
        <div className="bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-outline bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-fg">
                Payment Transactions ({filteredPayments.length})
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Shield className="h-4 w-4" />
                <span>Secure processing</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-surface2/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface divide-y divide-slate-200 dark:divide-slate-700">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-surface2/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-fg">
                              {payment.client_name || payment.client?.fullName || 'Unknown Client'}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {payment.reference || 'No reference'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900 dark:text-fg">
                          ${parseFloat(payment.amount || '0').toFixed(2)}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">
                            {payment.status || 'Unknown'}
                          </span>
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-slate-600 dark:text-slate-400">
                          {getPaymentMethodIcon(payment.payment_method)}
                          <span className="ml-2 text-sm capitalize">
                            {payment.payment_method?.replace('_', ' ') || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {payment.created_at || payment.updated_at ? (
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                            {new Date((payment.created_at || payment.updated_at)!).toLocaleDateString()}
                          </div>
                        ) : (
                          'Unknown'
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPayment(payment)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          
                          {(payment.status || '').toLowerCase() === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(payment.id, 'completed')}
                                className="text-accent1 hover:text-emerald-900 dark:text-accent2 dark:hover:text-accent3 p-1 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                title="Approve Payment"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              
                              <button
                                onClick={() => handleStatusChange(payment.id, 'failed')}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Reject Payment"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          
                          <button className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-surface2 transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-slate-500 dark:text-slate-400">
                        <CreditCard className="mx-auto h-12 w-12 mb-4 text-slate-300 dark:text-slate-600" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-fg mb-2">No payments found</h3>
                        <p className="text-sm">Try adjusting your search or filter criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="mt-8 bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Info className="h-5 w-5" />
              <span className="text-sm">
                Showing {filteredPayments.length} of {payments.length} payments
              </span>
            </div>
            
            <div className="flex gap-2">
              <button className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-surface2 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </button>
              
              <button className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-surface2 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
