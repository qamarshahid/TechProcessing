import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import {
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Package,
  RefreshCw,
  TrendingUp,
  User,
  Receipt,
  ShoppingBag,
  Plus
} from 'lucide-react';

export function ClientDashboard() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidAmount: 0,
    unpaidInvoices: 0,
    activeSubscriptions: 0,
    serviceRequests: 0,
    lastPayment: null as string | null
  });
  
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchClientData();
    }
  }, [user]);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch client-specific data with error handling
      const [
        invoicesResponse,
        subscriptionsResponse,
        serviceRequestsResponse
      ] = await Promise.allSettled([
        apiClient.getInvoices().catch(() => ({ invoices: [] })),
        apiClient.getClientSubscriptions(user?.id || '').catch(() => ({ subscriptions: [] })),
        apiClient.getClientServiceRequests(user?.id || '').catch(() => ({ serviceRequests: [] }))
      ]);

      // Safely extract data
      const invoices = invoicesResponse.status === 'fulfilled' ? invoicesResponse.value?.invoices || [] : [];
      const subscriptions = subscriptionsResponse.status === 'fulfilled' ? subscriptionsResponse.value?.subscriptions || [] : [];
      const serviceRequests = serviceRequestsResponse.status === 'fulfilled' ? serviceRequestsResponse.value?.serviceRequests || [] : [];

      // Calculate stats safely
      const totalInvoices = Array.isArray(invoices) ? invoices.length : 0;
      
      const paidInvoices = Array.isArray(invoices) 
        ? invoices.filter(inv => inv.status === 'PAID' || inv.status === 'paid')
        : [];
      const paidAmount = paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount || inv.total || '0'), 0);
      
      const unpaidInvoices = Array.isArray(invoices)
        ? invoices.filter(inv => inv.status === 'UNPAID' || inv.status === 'OVERDUE' || inv.status === 'unpaid' || inv.status === 'overdue').length
        : 0;
      
      const activeSubscriptions = Array.isArray(subscriptions)
        ? subscriptions.filter(sub => sub.status === 'ACTIVE' || sub.status === 'active').length
        : 0;

      const lastPayment = paidInvoices.length > 0 
        ? paidInvoices
            .sort((a, b) => new Date(b.paid_date || b.created_at).getTime() - new Date(a.paid_date || a.created_at).getTime())[0]
            .paid_date || paidInvoices[0].created_at
        : null;

      setStats({
        totalInvoices,
        paidAmount,
        unpaidInvoices,
        activeSubscriptions,
        serviceRequests: Array.isArray(serviceRequests) ? serviceRequests.length : 0,
        lastPayment
      });

      setRecentInvoices(Array.isArray(invoices) ? invoices.slice(0, 5) : []);
      setRecentRequests(Array.isArray(serviceRequests) ? serviceRequests.slice(0, 3) : []);

      showSuccess('Dashboard Loaded', 'Client dashboard data loaded successfully.');
    } catch (error) {
      logger.error('Error fetching client data:', error);
      setError('Failed to load dashboard data. Some features may be unavailable.');
      showError('Dashboard Error', 'Failed to load some dashboard data. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'unpaid':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6" role="status" aria-label="Loading dashboard">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.fullName || 'Client'}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your account overview and recent activity.
          </p>
        </div>
        <button
          onClick={fetchClientData}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <p className="text-yellow-800 dark:text-yellow-200">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Paid Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.paidAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Unpaid Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.unpaidInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Service Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.serviceRequests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quick Actions</h3>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and services</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Receipt className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">View Invoices</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Check your invoices and payment status
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              View Invoices
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">Browse Services</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Explore our service packages and solutions
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Browse Services
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">Request Service</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Submit a new service request or custom quote
            </p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Request Service
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Invoices</h2>
          </div>
          <div className="p-4">
            {recentInvoices.length > 0 ? (
              <div className="space-y-3">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {invoice.description}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ${parseFloat(invoice.amount || invoice.total || '0').toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No invoices yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Invoices will appear here when created</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Service Requests */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Service Requests</h2>
          </div>
          <div className="p-4">
            {recentRequests.length > 0 ? (
              <div className="space-y-3">
                {recentRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                        <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.service?.name || 'Custom Request'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(request.created_at || request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No service requests</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Submit a request to get started</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                Account Status: Active
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                {stats.lastPayment 
                  ? `Last payment: ${new Date(stats.lastPayment).toLocaleDateString()}`
                  : 'Welcome to Tech Processing LLC'
                }
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}