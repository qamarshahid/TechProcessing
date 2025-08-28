import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { Users, FileText, Package, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    unpaidInvoices: 0,
    paidInvoices: 0,
    activeSubscriptions: 0,
    monthlyRecurringRevenue: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
    
    // Listen for invoice changes to refresh dashboard
    const handleInvoiceChange = () => {
      console.log('Invoice change detected, refreshing dashboard...');
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
      console.log('Fetching dashboard data...');
      
      // Fetch all required data
      const [clientsResponse, allInvoicesResponse, subscriptionsResponse] = await Promise.all([
        apiClient.getUsers({ role: 'CLIENT' }).catch(err => {
          console.error('Error fetching clients:', err);
          return { users: [] };
        }),
        apiClient.getInvoices().catch(err => {
          console.error('Error fetching invoices:', err);
          return { invoices: [] };
        }),
        apiClient.getSubscriptions().catch(err => {
          console.error('Error fetching subscriptions:', err);
          // Return empty subscriptions on error to prevent dashboard crash
          return { subscriptions: [], error: 'Subscriptions unavailable' };
        })
      ]);
      
      const allClients = clientsResponse.users.filter(u => u.role === 'CLIENT');
      const allInvoices = allInvoicesResponse.invoices || [];
      const allSubscriptions = subscriptionsResponse.subscriptions || [];
      
      console.log('Dashboard data:', {
        clients: allClients,
        invoices: allInvoices,
        subscriptions: allSubscriptions
      });
      
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
      
      console.log('Calculated stats:', {
        totalClients: allClients.length,
        totalInvoices,
        paidInvoices: paidInvoices.length,
        unpaidInvoices: unpaidInvoices.length,
        totalRevenue,
        activeSubscriptions,
        monthlyRecurringRevenue
      });
      
      setStats({
        totalClients: allClients.length,
        totalInvoices,
        totalRevenue,
        unpaidInvoices: unpaidInvoices.length,
        paidInvoices: paidInvoices.length,
        activeSubscriptions,
        monthlyRecurringRevenue,
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
      setError('');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
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
          <p className="text-sm text-gray-600 dark:text-gray-300">Welcome back to Tech Processing LLC</p>
        </div>
        <div className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">Tech Processing LLC</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalInvoices}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stats.paidInvoices} paid, {stats.unpaidInvoices} unpaid
              </p>
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
              <RefreshCw className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeSubscriptions}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">${stats.monthlyRecurringRevenue}/month MRR</p>
            </div>
          </div>
        </div>
      </div>

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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
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
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {invoice.client_name}
                        </div>
                        {invoice.client_company && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {invoice.client_company}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded border border-blue-200 dark:border-blue-700">
                        #{invoice.invoice_number || invoice.invoiceNumber || `INV-${invoice.id.slice(-8)}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {invoice.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${parseFloat(invoice.total || invoice.amount || '0').toFixed(2)}
                      </div>
                      {invoice.tax && parseFloat(invoice.tax) > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Tax: ${parseFloat(invoice.tax).toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {formatDate(invoice.due_date || invoice.dueDate)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Created: {formatDate(invoice.created_at || invoice.createdAt)}
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