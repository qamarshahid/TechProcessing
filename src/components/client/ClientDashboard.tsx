import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { ServiceRequestModal } from './ServiceRequestModal';
import {
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Package,
  TrendingUp,
  User,
  Receipt,
  ShoppingBag,
  Plus,
  Eye,
  RefreshCw,
  ArrowRight,
  Target,
  Sparkles
} from 'lucide-react';

export function ClientDashboard() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  
  const [dashboardData, setDashboardData] = useState({
    invoices: [],
    payments: [],
    subscriptions: [],
    serviceRequests: [],
    stats: {
      totalInvoices: 0,
      paidAmount: 0,
      unpaidInvoices: 0,
      activeSubscriptions: 0,
      pendingRequests: 0,
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showServiceModal, setShowServiceModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all client data in parallel with error handling
      const [invoicesResponse, subscriptionsResponse, serviceRequestsResponse] = await Promise.all([
        apiClient.getInvoices().catch(err => {
          logger.error('Error fetching invoices:', err);
          return { invoices: [] };
        }),
        apiClient.getClientSubscriptions(user?.id || '').catch(err => {
          logger.error('Error fetching subscriptions:', err);
          return { subscriptions: [] };
        }),
        apiClient.getClientServiceRequests(user?.id || '').catch(err => {
          logger.error('Error fetching service requests:', err);
          return { serviceRequests: [] };
        })
      ]);

      const invoices = invoicesResponse?.invoices || [];
      const subscriptions = subscriptionsResponse?.subscriptions || [];
      const serviceRequests = serviceRequestsResponse?.serviceRequests || [];

      // Calculate stats safely
      const totalInvoices = invoices.length;
      const paidInvoices = invoices.filter(inv => inv.status === 'PAID' || inv.status === 'paid');
      const unpaidInvoices = invoices.filter(inv => 
        inv.status === 'UNPAID' || inv.status === 'OVERDUE' || 
        inv.status === 'unpaid' || inv.status === 'overdue'
      );
      const paidAmount = paidInvoices.reduce((sum, inv) => 
        sum + parseFloat(inv.amount || inv.total || '0'), 0
      );
      const activeSubscriptions = subscriptions.filter(sub => 
        sub.status === 'ACTIVE' || sub.status === 'active'
      ).length;
      const pendingRequests = serviceRequests.filter(req => 
        req.status === 'PENDING' || req.status === 'pending'
      ).length;

      setDashboardData({
        invoices,
        payments: [],
        subscriptions,
        serviceRequests,
        stats: {
          totalInvoices,
          paidAmount,
          unpaidInvoices: unpaidInvoices.length,
          activeSubscriptions,
          pendingRequests,
        }
      });

      showSuccess('Dashboard Loaded', 'Your dashboard data has been loaded successfully.');
    } catch (error) {
      logger.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
      showError('Dashboard Error', 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'active':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'unpaid':
      case 'overdue':
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleServiceRequested = () => {
    setShowServiceModal(false);
    showSuccess('Service Request Submitted', 'Your service request has been submitted successfully.');
    fetchDashboardData(); // Refresh data
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
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome, {user?.fullName || 'Valued Client'}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Here's your account overview and recent activity
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <User className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.stats.totalInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Paid Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${dashboardData.stats.paidAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Unpaid Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.stats.unpaidInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Services</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.stats.activeSubscriptions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/client/invoices"
            className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 hover:-translate-y-1 border border-blue-200 dark:border-blue-800"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">View Invoices</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">Manage your invoices</p>
            </div>
            <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 ml-auto" />
          </Link>

          <Link
            to="/client/services"
            className="flex items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all duration-300 hover:-translate-y-1 border border-emerald-200 dark:border-emerald-800"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Browse Services</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">Explore our offerings</p>
            </div>
            <ArrowRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400 ml-auto" />
          </Link>

          <button
            onClick={() => setShowServiceModal(true)}
            className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 hover:-translate-y-1 border border-purple-200 dark:border-purple-800"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">Request Service</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">Get custom quote</p>
            </div>
            <ArrowRight className="h-5 w-5 text-purple-600 dark:text-purple-400 ml-auto" />
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Invoices</h2>
              <Link
                to="/client/invoices"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-4">
            {dashboardData.invoices.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.invoices.slice(0, 5).map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {invoice.description}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Due: {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'No due date'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${parseFloat(invoice.amount || invoice.total || '0').toLocaleString()}
                      </div>
                      <div className="flex items-center justify-end">
                        {getStatusIcon(invoice.status)}
                        <span className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No invoices yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Invoices will appear here when created</p>
              </div>
            )}
          </div>
        </div>

        {/* Service Requests */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Service Requests</h2>
              <button
                onClick={() => setShowServiceModal(true)}
                className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 text-sm font-medium flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                New Request
              </button>
            </div>
          </div>
          <div className="p-4">
            {dashboardData.serviceRequests.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.serviceRequests.slice(0, 5).map((request: any) => (
                  <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mr-3">
                        <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.description?.substring(0, 50)}...
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {request.created_at ? new Date(request.created_at).toLocaleDateString() : 'Recent'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(request.status)}
                      <span className={`ml-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No service requests yet</p>
                <button
                  onClick={() => setShowServiceModal(true)}
                  className="mt-3 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Request Service
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Summary */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {dashboardData.stats.totalInvoices}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Invoices</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              ${dashboardData.stats.paidAmount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Paid</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {dashboardData.stats.activeSubscriptions}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Services</div>
          </div>
        </div>
      </div>

      {/* Service Request Modal */}
      <ServiceRequestModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        onServiceRequested={handleServiceRequested}
      />
    </div>
  );
}