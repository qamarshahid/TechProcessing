import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { useNotifications } from '../common/NotificationSystem';
import { Users, FileText, Package, DollarSign, AlertCircle, RefreshCw, TrendingUp, Activity, UserCheck, CreditCard, Target, Award } from 'lucide-react';

export function AdminDashboard() {
  const { showSuccess, showError, showWarning } = useNotifications();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    unpaidInvoices: 0,
    paidInvoices: 0,
    activeSubscriptions: 0,
    monthlyRecurringRevenue: 0,
    totalAgents: 0,
    activeAgents: 0,
    totalSales: 0,
    totalCommissions: 0,
    pendingCommissions: 0,
    serviceRequests: 0,
    pendingRequests: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [recentServiceRequests, setRecentServiceRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    
    // Listen for invoice changes to refresh dashboard
    const handleInvoiceChange = () => {
      fetchDashboardData();
    };
    
    window.addEventListener('invoiceDeleted', handleInvoiceChange);
    window.addEventListener('invoiceCreated', handleInvoiceChange);
    window.addEventListener('invoiceUpdated', handleInvoiceChange);
    
    return () => {
      window.removeEventListener('invoiceDeleted', handleInvoiceChange);
      window.removeEventListener('invoiceCreated', handleInvoiceChange);
      window.removeEventListener('invoiceUpdated', handleInvoiceChange);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all required data
      const [
        clientsResponse, 
        allInvoicesResponse, 
        subscriptionsResponse,
        agentStatsResponse,
        agentSalesResponse,
        serviceRequestsResponse
      ] = await Promise.all([
        apiClient.getUsers({ role: 'CLIENT' }).catch(err => {
          logger.error('Error fetching clients:', err);
          showWarning('Clients Unavailable', 'Unable to load client information. Some data may be incomplete.');
          return { users: [] };
        }),
        apiClient.getInvoices().catch(err => {
          logger.error('Error fetching invoices:', err);
          showWarning('Invoices Unavailable', 'Unable to load invoice information. Some data may be incomplete.');
          return { invoices: [] };
        }),
        apiClient.getSubscriptions().catch(err => {
          console.error('Error fetching subscriptions:', err);
          showWarning('Subscriptions Unavailable', 'Unable to load subscription information. Some data may be incomplete.');
          return { subscriptions: [], error: 'Subscriptions unavailable' };
        }),
        apiClient.getAgents().catch(err => {
          console.error('Error fetching agents:', err);
          showWarning('Agent Data Unavailable', 'Unable to load agent information. Some data may be incomplete.');
          return [];
        }),
        apiClient.getAllAgentSales().catch(err => {
          console.error('Error fetching agent sales:', err);
          showWarning('Sales Data Unavailable', 'Unable to load sales information. Some data may be incomplete.');
          return [];
        }),
        apiClient.getServiceRequests().catch(err => {
          console.error('Error fetching service requests:', err);
          showWarning('Service Requests Unavailable', 'Unable to load service request information. Some data may be incomplete.');
          return { serviceRequests: [] };
        })
      ]);
      
      const allClients = clientsResponse.users.filter((u: any) => u.role === 'CLIENT');
      const allInvoices = allInvoicesResponse.invoices || [];
      const allSubscriptions = subscriptionsResponse.subscriptions || [];
      const allAgents = agentStatsResponse || [];
      const allSales = agentSalesResponse || [];
      const allServiceRequests = serviceRequestsResponse.serviceRequests || [];
      
      // Calculate stats from actual invoice data
      const totalInvoices = allInvoices.length;
      const paidInvoices = allInvoices.filter(inv => 
        inv.status === 'PAID' || inv.status === 'paid'
      );
      const unpaidInvoices = allInvoices.filter(inv => 
        inv.status === 'UNPAID' || inv.status === 'OVERDUE' || 
        inv.status === 'DRAFT' || inv.status === 'unpaid' || 
        inv.status === 'overdue' || inv.status === 'draft'
      );
      
      // Calculate revenue from paid invoices
      const totalRevenue = paidInvoices.reduce((sum, inv) => {
        const amount = parseFloat(inv.total || inv.amount || '0');
        return sum + amount;
      }, 0);
      
      // Calculate subscription stats
      const activeSubscriptions = allSubscriptions.filter(sub => sub.status === 'ACTIVE').length;
      const monthlyRecurringRevenue = allSubscriptions
        .filter(sub => sub.status === 'ACTIVE')
        .reduce((sum, sub) => {
          const amount = parseFloat(sub.amount || '0');
          // Convert to monthly amount based on frequency
          switch (sub.frequency) {
            case 'YEARLY': return sum + (amount / 12);
            case 'QUARTERLY': return sum + (amount / 3);
            default: return sum + amount; // MONTHLY
          }
        }, 0);
      
      // Calculate agent stats
      const totalAgents = allAgents.length;
      const activeAgents = allAgents.filter((agent: any) => agent.isActive || agent.user?.isActive).length;
      const totalSales = allSales.length;
      const totalCommissions = allSales.reduce((sum: number, sale: any) => {
        return sum + parseFloat(sale.agentCommission || '0');
      }, 0);
      const pendingCommissions = allSales
        .filter((sale: any) => sale.commissionStatus === 'PENDING' || sale.commissionStatus === 'APPROVED')
        .reduce((sum: number, sale: any) => sum + parseFloat(sale.agentCommission || '0'), 0);
      
      // Calculate service request stats
      const serviceRequests = allServiceRequests.length;
      const pendingRequests = allServiceRequests.filter((req: any) => 
        req.status === 'PENDING' || req.status === 'REVIEWING'
      ).length;
      
      setStats({
        totalClients: allClients.length,
        totalInvoices,
        totalRevenue,
        unpaidInvoices: unpaidInvoices.length,
        paidInvoices: paidInvoices.length,
        activeSubscriptions,
        monthlyRecurringRevenue,
        totalAgents,
        activeAgents,
        totalSales,
        totalCommissions,
        pendingCommissions,
        serviceRequests,
        pendingRequests,
      });

      // Get recent invoices with proper client data
      const recentInvoicesWithClients = allInvoices
        .sort((a, b) => {
          const dateA = new Date(a.created_at || a.createdAt || 0);
          const dateB = new Date(b.created_at || b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 5)
        .map(invoice => {
          // Find the client for this invoice
          const client = allClients.find(c => 
            c.id === invoice.client_id || 
            c.id === invoice.clientId ||
            c.id === invoice.client?.id
          );
          
          return {
            ...invoice,
            client_name: client?.full_name || client?.fullName || invoice.client_name || 'Unknown Client',
            client_email: client?.email || invoice.client_email || '',
            client_company: client?.company_name || client?.companyName || ''
          };
        });
      
      setRecentInvoices(recentInvoicesWithClients);
      
      // Get recent sales
      const recentSalesData = allSales
        .sort((a: any, b: any) => {
          const dateA = new Date(a.created_at || a.createdAt || 0);
          const dateB = new Date(b.created_at || b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 5);
      
      setRecentSales(recentSalesData);
      
      // Get recent service requests
      const recentRequestsData = allServiceRequests
        .sort((a: any, b: any) => {
          const dateA = new Date(a.created_at || a.createdAt || 0);
          const dateB = new Date(b.created_at || b.createdAt || 0);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 5);
      
      setRecentServiceRequests(recentRequestsData);
      setError('');
      showSuccess('Dashboard Loaded', 'Admin dashboard data loaded successfully.');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
      showError('Dashboard Error', 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'No date';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'UNPAID':
      case 'unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'DRAFT':
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Welcome back to Tech Processing LLC</p>
          </div>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Dashboard Error</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button 
                onClick={fetchDashboardData}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
    
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Complete business overview and management control</p>
        </div>
        <div className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">Tech Processing LLC</span>
        </div>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">From paid invoices</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Agents</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeAgents}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.totalSales} total sales</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Service Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.serviceRequests}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stats.pendingRequests} pending review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalInvoices}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.paidInvoices} paid, {stats.unpaidInvoices} unpaid
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Commissions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.totalCommissions.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ${stats.pendingCommissions.toLocaleString()} pending
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <RefreshCw className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeSubscriptions}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ${stats.monthlyRecurringRevenue.toFixed(0)}/month MRR
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Performance Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalSales > 0 ? Math.round((stats.totalCommissions / stats.totalSales) * 10) : 0}/10
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Based on sales efficiency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-600">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Invoices</h2>
              <button 
                onClick={fetchDashboardData}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Refresh
              </button>
            </div>
          </div>
        
          {recentInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Recent Invoices</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Recent invoices will appear here once they are created.
              </p>
            </div>
          ) : (
            <div className="p-4">
              <div className="space-y-3">
                {recentInvoices.slice(0, 3).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {invoice.client_name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {invoice.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${parseFloat(invoice.total || invoice.amount || '0').toFixed(2)}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Agent Sales */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-600">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Agent Sales</h2>
          </div>
          
          {recentSales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Recent Sales</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Agent sales will appear here once they are submitted.
              </p>
            </div>
          ) : (
            <div className="p-4">
              <div className="space-y-3">
                {recentSales.slice(0, 3).map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {sale.clientName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {sale.serviceName} • {sale.agent?.salesPersonName || 'Unknown Agent'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${parseFloat(sale.saleAmount || '0').toLocaleString()}
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        sale.saleStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        sale.saleStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sale.saleStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Service Requests Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-600">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Service Requests</h2>
        </div>
        
        {recentServiceRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Recent Requests</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Service requests will appear here once clients submit them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                {recentServiceRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {request.client?.fullName || 'Unknown Client'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {request.isCustomQuote ? 'Custom Quote' : (request.service?.name || 'Service Request')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {request.budget ? `$${request.budget.toLocaleString()}` : 'TBD'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(request.created_at || request.createdAt)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}