import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { AddClientModal } from './AddClientModal';
import { AddInvoiceModal } from './AddInvoiceModal';
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Package,
  UserPlus,
  Plus,
  Eye,
  RefreshCw,
  ArrowRight,
  BarChart3,
  Activity,
  Shield,
  Target
} from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  
  const [dashboardData, setDashboardData] = useState({
    users: [],
    invoices: [],
    payments: [],
    agents: [],
    stats: {
      totalUsers: 0,
      totalClients: 0,
      totalInvoices: 0,
      totalRevenue: 0,
      pendingPayments: 0,
      activeAgents: 0,
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all admin data in parallel with error handling
      const [usersResponse, invoicesResponse, paymentsResponse, agentsResponse] = await Promise.all([
        apiClient.getUsers().catch(err => {
          logger.error('Error fetching users:', err);
          return { users: [] };
        }),
        apiClient.getInvoices().catch(err => {
          logger.error('Error fetching invoices:', err);
          return { invoices: [] };
        }),
        apiClient.getPayments().catch(err => {
          logger.error('Error fetching payments:', err);
          return { payments: [] };
        }),
        apiClient.getAgents().catch(err => {
          logger.error('Error fetching agents:', err);
          return [];
        })
      ]);

      const users = usersResponse?.users || [];
      const invoices = invoicesResponse?.invoices || [];
      const payments = paymentsResponse?.payments || [];
      const agents = Array.isArray(agentsResponse) ? agentsResponse : [];

      // Calculate stats safely
      const totalUsers = users.length;
      const totalClients = users.filter(u => u.role === 'CLIENT').length;
      const totalInvoices = invoices.length;
      const completedPayments = payments.filter(p => p.status === 'COMPLETED' || p.status === 'completed');
      const totalRevenue = completedPayments.reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);
      const pendingPayments = payments.filter(p => p.status === 'PENDING' || p.status === 'pending').length;
      const activeAgents = agents.filter(a => a.isActive || a.is_active).length;

      setDashboardData({
        users,
        invoices,
        payments,
        agents,
        stats: {
          totalUsers,
          totalClients,
          totalInvoices,
          totalRevenue,
          pendingPayments,
          activeAgents,
        }
      });

      showSuccess('Admin Dashboard Loaded', 'Dashboard data loaded successfully.');
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
      case 'completed':
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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'unpaid':
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleClientAdded = () => {
    setShowAddClientModal(false);
    fetchDashboardData(); // Refresh data
    showSuccess('Client Added', 'New client has been added successfully.');
  };

  const handleInvoiceAdded = () => {
    setShowAddInvoiceModal(false);
    fetchDashboardData(); // Refresh data
    showSuccess('Invoice Created', 'New invoice has been created successfully.');
  };

  if (loading) {
    return (
      <div className="space-y-6">
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
              Admin Dashboard 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Welcome back, {user?.fullName}! Here's your business overview.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Shield className="h-10 w-10 text-white" />
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
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${dashboardData.stats.totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.stats.activeAgents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setShowAddClientModal(true)}
            className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300 hover:-translate-y-1 border border-blue-200 dark:border-blue-800"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Add Client</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">Create new client</p>
            </div>
          </button>

          <button
            onClick={() => setShowAddInvoiceModal(true)}
            className="flex items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all duration-300 hover:-translate-y-1 border border-emerald-200 dark:border-emerald-800"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Create Invoice</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">Bill a client</p>
            </div>
          </button>

          <Link
            to="/admin/payment-processing"
            className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 hover:-translate-y-1 border border-purple-200 dark:border-purple-800"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">Process Payment</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">Charge cards</p>
            </div>
          </Link>

          <Link
            to="/admin/agent-sales"
            className="flex items-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-300 hover:-translate-y-1 border border-orange-200 dark:border-orange-800"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">Agent Sales</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">Manage agents</p>
            </div>
          </Link>
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
                to="/admin/invoices"
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
                          {invoice.client_name || invoice.client?.fullName || 'Unknown Client'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {invoice.description}
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
                <button
                  onClick={() => setShowAddInvoiceModal(true)}
                  className="mt-3 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Invoice
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Clients */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Clients</h2>
              <Link
                to="/admin/clients"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-4">
            {dashboardData.users.filter(u => u.role === 'CLIENT').length > 0 ? (
              <div className="space-y-3">
                {dashboardData.users
                  .filter(u => u.role === 'CLIENT')
                  .slice(0, 5)
                  .map((client: any) => (
                    <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {client.fullName || client.full_name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {client.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          client.isActive || client.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {(client.isActive || client.is_active) ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No clients yet</p>
                <button
                  onClick={() => setShowAddClientModal(true)}
                  className="mt-3 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Client
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Business Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Business Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {dashboardData.stats.totalClients}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              ${dashboardData.stats.totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {dashboardData.stats.pendingPayments}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pending Payments</div>
          </div>
        </div>
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onClientAdded={handleClientAdded}
      />

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        isOpen={showAddInvoiceModal}
        onClose={() => setShowAddInvoiceModal(false)}
        onInvoiceAdded={handleInvoiceAdded}
      />
    </div>
  );
}