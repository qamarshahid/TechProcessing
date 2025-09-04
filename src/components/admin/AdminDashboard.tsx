import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { AddClientModal } from './AddClientModal';
import { AddInvoiceModal } from './AddInvoiceModal';
import {
  Users, FileText, DollarSign, TrendingUp, Calendar, CheckCircle, Clock, AlertCircle, CreditCard, Package, UserPlus, Plus, Eye, RefreshCw, ArrowRight, BarChart3, Activity, Shield, Target, Zap, Star, Award, Briefcase, Globe, Layers, Cpu, Database, Server, Code, Palette, Settings
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
      totalAgents: 0,
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
      const totalAgents = agents.filter((a: any) => a.isActive || a.is_active).length;
      const totalClients = users.filter((u: any) => u.role === 'CLIENT').length;
      const totalInvoices = invoices.length;
      const completedPayments = payments.filter((p: any) => p.status === 'COMPLETED' || p.status === 'completed');
      const totalRevenue = completedPayments.reduce((sum: number, p: any) => sum + parseFloat(p.amount || '0'), 0);
      const pendingPayments = payments.filter((p: any) => p.status === 'PENDING' || p.status === 'pending').length;
      const activeAgents = agents.filter((a: any) => a.isActive || a.is_active).length;

      setDashboardData({
        users,
        invoices,
        payments,
        agents,
        stats: {
          totalUsers,
          totalAgents,
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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
      case 'unpaid':
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case 'overdue':
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="text-center">
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3 mx-auto mb-4"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
            </div>
            
            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              ))}
            </div>
            
            {/* Content grid skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mb-1">
                Welcome back, {user?.fullName || user?.full_name || 'Admin'}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Platform overview and management dashboard
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-slate-500 dark:text-slate-400">System Online</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setShowAddClientModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </button>
          <button
            onClick={() => setShowAddInvoiceModal(true)}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <FileText className="h-4 w-4 mr-2" />
            Create Invoice
          </button>
          <button
            onClick={fetchDashboardData}
            className="inline-flex items-center px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Users */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Total Users</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{dashboardData.stats.totalUsers}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-slate-500 dark:text-slate-400">
              <TrendingUp className="h-3 w-3 mr-1 text-emerald-500" />
              <span>Active platform users</span>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Total Revenue</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">${dashboardData.stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-slate-500 dark:text-slate-400">
              <BarChart3 className="h-3 w-3 mr-1 text-emerald-500" />
              <span>Lifetime earnings</span>
            </div>
          </div>

          {/* Total Invoices */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Total Invoices</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{dashboardData.stats.totalInvoices}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-slate-500 dark:text-slate-400">
              <Activity className="h-3 w-3 mr-1 text-purple-500" />
              <span>Documents created</span>
            </div>
          </div>

          {/* Active Agents */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Active Agents</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{dashboardData.stats.activeAgents}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-3 flex items-center text-xs text-slate-500 dark:text-slate-400">
              <Shield className="h-3 w-3 mr-1 text-orange-500" />
              <span>Team members</span>
            </div>
          </div>
        </div>

        {/* Detailed Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <h3 className="text-base font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">User Breakdown</h3>
              </div>
              <Users className="h-4 w-4 text-blue-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Users</span>
                <span className="font-semibold text-slate-900 dark:text-white">{dashboardData.stats.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Clients</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{dashboardData.stats.totalClients}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Agents</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{dashboardData.stats.totalAgents}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                <h3 className="text-base font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Financial Overview</h3>
              </div>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Revenue</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">${dashboardData.stats.totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Pending Payments</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">{dashboardData.stats.pendingPayments}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Total Invoices</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{dashboardData.stats.totalInvoices}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                <h3 className="text-base font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Platform Health</h3>
              </div>
              <Activity className="h-4 w-4 text-orange-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Active Agents</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">{dashboardData.stats.activeAgents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">System Status</span>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Last Updated</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Invoices */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Invoices</h3>
                <Link to="/admin/invoices" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                  View All <ArrowRight className="h-4 w-4 inline ml-1" />
                </Link>
              </div>
            </div>
            <div className="p-4">
              {dashboardData.invoices.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.invoices.slice(0, 5).map((invoice: any) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-white">
                            {invoice.invoice_number || invoice.id}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            ${parseFloat(invoice.amount || '0').toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1 capitalize">
                            {invoice.status || 'Unknown'}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                  <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No invoices yet</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create your first invoice to get started.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Clients */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Clients</h3>
                <Link to="/admin/users" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                  View All <ArrowRight className="h-4 w-4 inline ml-1" />
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
                      <div key={client.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mr-3">
                            <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              {client.fullName || client.full_name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {client.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                            client.isActive || client.is_active
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                              : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                          }`}>
                            {(client.isActive || client.is_active) ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-500" />
                  <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No clients yet</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add your first client to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {dashboardData.stats.totalClients}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Active Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                ${dashboardData.stats.totalRevenue.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {dashboardData.stats.pendingPayments}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Pending Payments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddClientModal && (
        <AddClientModal
          isOpen={showAddClientModal}
          onClose={() => setShowAddClientModal(false)}
          onSuccess={handleClientAdded}
        />
      )}

      {showAddInvoiceModal && (
        <AddInvoiceModal
          isOpen={showAddInvoiceModal}
          onClose={() => setShowAddInvoiceModal(false)}
          onSuccess={handleInvoiceAdded}
        />
      )}
    </div>
  );
}