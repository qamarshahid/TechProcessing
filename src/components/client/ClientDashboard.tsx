import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, DollarSign, Clock, CheckCircle, Package } from 'lucide-react';

export function ClientDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    unpaidCount: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchClientData();
      
      // Listen for invoice changes to refresh client dashboard
      const handleInvoiceChange = (event: any) => {
        const { clientId: changedClientId } = event.detail || {};
        // Only refresh if this client was affected
        if (!changedClientId || changedClientId === user?.id) {
          console.log('Invoice change detected for this client, refreshing dashboard...');
          fetchClientData();
        }
      };
      
      window.addEventListener('invoiceDeleted', handleInvoiceChange);
      window.addEventListener('invoiceCreated', handleInvoiceChange);
      window.addEventListener('invoiceUpdated', handleInvoiceChange);
      
      return () => {
        window.removeEventListener('invoiceDeleted', handleInvoiceChange);
        window.removeEventListener('invoiceCreated', handleInvoiceChange);
        window.removeEventListener('invoiceUpdated', handleInvoiceChange);
      };
    }
  }, [user]);

  const fetchClientData = async () => {
    try {
      // Fetch client-specific data including subscriptions
      const historyResponse = await apiClient.getClientTransactionHistory(user?.id || '');
      const userInvoices = historyResponse.invoices || [];
      
      // Fetch client subscriptions - only if user ID exists
      let userSubscriptions = [];
      if (user?.id) {
        try {
          const subscriptionsResponse = await apiClient.getClientSubscriptions(user.id);
          userSubscriptions = subscriptionsResponse.subscriptions || [];
        } catch (error) {
          console.error('Error fetching client subscriptions:', error);
          userSubscriptions = [];
        }
      }

      // Calculate stats
      const totalAmount = userInvoices.reduce((sum: number, inv: any) => sum + parseFloat(inv.amount), 0);
      const paidAmount = userInvoices
        .filter((inv: any) => inv.status === 'PAID')
        .reduce((sum: number, inv: any) => sum + parseFloat(inv.amount), 0);
      const unpaidCount = userInvoices.filter((inv: any) => inv.status === 'UNPAID').length;
      
      // Add subscription revenue to paid amount
      const subscriptionRevenue = userSubscriptions
        .filter((sub: any) => sub.status === 'ACTIVE')
        .reduce((sum: number, sub: any) => sum + parseFloat(sub.totalBilled || '0'), 0);

      setStats({
        totalInvoices: userInvoices.length,
        totalAmount,
        paidAmount: paidAmount + subscriptionRevenue,
        unpaidCount,
      });

      setRecentInvoices(userInvoices.slice(0, 5));
    } catch (error) {
      console.error('Error fetching client data:', error);
      // Set empty stats on error
      setStats({
        totalInvoices: 0,
        totalAmount: 0,
        paidAmount: 0,
        unpaidCount: 0,
      });
      setRecentInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'UNPAID':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.full_name}</h1>
          <p className="text-sm text-gray-600">Manage your projects and invoices</p>
        </div>
        <div className="flex items-center space-x-2">
          <Package className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Tech Processing LLC</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paid Amount</p>
              <p className="text-2xl font-bold text-gray-900">${stats.paidAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unpaid Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unpaidCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${parseFloat(invoice.amount).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.payment_method || 'Not specified'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}