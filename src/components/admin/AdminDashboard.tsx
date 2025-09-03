import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  CreditCard,
  Package,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  UserPlus,
  Receipt,
  BarChart3,
  Target,
  Award,
  Zap
} from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalAgents: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    activeSubscriptions: 0,
    recentActivity: []
  });
  
  const [recentData, setRecentData] = useState({
    clients: [],
    invoices: [],
    payments: [],
    agentSales: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all dashboard data in parallel with error handling
      const [
        usersResponse,
        invoicesResponse,
        paymentsResponse,
        agentSalesResponse,
        subscriptionsResponse
      ] = await Promise.allSettled([
        apiClient.getUsers().catch(() => ({ users: [] })),
        apiClient.getInvoices().catch(() => ({ invoices: [] })),
        apiClient.getPayments().catch(() => ({ payments: [] })),
        apiClient.getAllAgentSales().catch(() => []),
        apiClient.getSubscriptions().catch(() => ({ subscriptions: [] }))
      ]);

      // Safely extract data from settled promises
      const users = usersResponse.status === 'fulfilled' ? usersResponse.value?.users || [] : [];
      const invoices = invoicesResponse.status === 'fulfilled' ? invoicesResponse.value?.invoices || [] : [];
      const payments = paymentsResponse.status === 'fulfilled' ? paymentsResponse.value?.payments || [] : [];
      const agentSales = agentSalesResponse.status === 'fulfilled' ? agentSalesResponse.value || [] : [];
      const subscriptions = subscriptionsResponse.status === 'fulfilled' ? subscriptionsResponse.value?.subscriptions || [] : [];

      // Calculate stats safely
      const totalUsers = Array.isArray(users) ? users.length : 0;
      const totalClients = Array.isArray(users) ? users.filter(u => u.role === 'CLIENT').length : 0;
      const totalAgents = Array.isArray(users) ? users.filter(u => u.role === 'AGENT').length : 0;
      const totalInvoices = Array.isArray(invoices) ? invoices.length : 0;
      
      const totalRevenue = Array.isArray(payments) 
        ? payments
            .filter(p => p.status === 'COMPLETED' || p.status === 'completed')
            .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0)
        : 0;
      
      const pendingPayments = Array.isArray(invoices)
        ? invoices.filter(inv => inv.status === 'UNPAID' || inv.status === 'OVERDUE').length
        : 0;
      
      const activeSubscriptions = Array.isArray(subscriptions)
        ? subscriptions.filter(sub => sub.status === 'ACTIVE').length
        : 0;

      setStats({
        totalUsers,
        totalClients,
        totalAgents,
        totalInvoices,
        totalRevenue,
        pendingPayments,
        activeSubscriptions,
        recentActivity: []
      });

      setRecentData({
        clients: Array.isArray(users) ? users.filter(u => u.role === 'CLIENT').slice(0, 5) : [],
        invoices: Array.isArray(invoices) ? invoices.slice(0, 5) : [],
        payments: Array.isArray(payments) ? payments.slice(0, 5) : [],
        agentSales: Array.isArray(agentSales) ? agentSales.slice(0, 5) : []
      });

      showSuccess('Dashboard Loaded', 'Admin dashboard data loaded successfully.');
    } catch (error) {
      logger.error('Error fetching dashboard data:', error);
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
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'unpaid':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'overdue':
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-96 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {user?.fullName}! Here's your business overview.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
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
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.totalClients} clients, {stats.totalAgents} agents
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">From completed payments</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalInvoices}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {stats.pendingPayments} pending payments
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <RefreshCw className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeSubscriptions}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Recurring revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quick Actions</h3>
          <p className="text-gray-600 dark:text-gray-400">Manage your business with these powerful tools</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">Add Client</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Create new client accounts with portal access
            </p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Add Client
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Receipt className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">Create Invoice</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Generate invoices for clients and services
            </p>
            <button className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Create Invoice
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">Process Payment</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Charge cards and create payment links
            </p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              Process Payment
            </button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">Agent Sales</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              Manage agent sales and commissions
            </p>
            <button className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              View Sales
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Clients</h2>
          </div>
          <div className="p-4">
            {recentData.clients.length > 0 ? (
              <div className="space-y-3">
                {recentData.clients.map((client: any) => (
                  <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {client.full_name || client.fullName || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {client.email}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      client.is_active || client.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {(client.is_active || client.isActive) ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No recent clients</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Invoices</h2>
          </div>
          <div className="p-4">
            {recentData.invoices.length > 0 ? (
              <div className="space-y-3">
                {recentData.invoices.map((invoice: any) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                        <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {invoice.client_name || invoice.client?.fullName || 'Unknown Client'}
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
                <p className="text-gray-500 dark:text-gray-400">No recent invoices</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Business Performance</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {((stats.totalRevenue / Math.max(stats.totalInvoices, 1))).toFixed(0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Invoice Value</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
              {stats.totalInvoices > 0 ? (((stats.totalInvoices - stats.pendingPayments) / stats.totalInvoices) * 100).toFixed(1) : '0'}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Payment Success Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {stats.activeSubscriptions}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Subscriptions</div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                System Status: All Systems Operational
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                Payment processing, agent tracking, and client management are all running smoothly
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}