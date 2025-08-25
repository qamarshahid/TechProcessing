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
  const [activeSubscriptions, setActiveSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);

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
      setActiveSubscriptions(userSubscriptions.filter((sub: any) => sub.status === 'ACTIVE' || sub.status === 'PAUSED'));
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
      setActiveSubscriptions([]);
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

      {/* Active Subscriptions */}
      {activeSubscriptions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Active Subscriptions</h2>
            <button
              onClick={() => setShowSubscriptionsModal(true)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All ({activeSubscriptions.length})
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeSubscriptions.slice(0, 2).map((subscription) => (
                <div key={subscription.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          {subscription.servicePackage?.name || subscription.description || 'Custom Service'}
                        </h3>
                        <p className="text-xs text-gray-500">{subscription.frequency} Billing</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      subscription.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {subscription.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-gray-900">
                        ${parseFloat(subscription.amount || '0').toLocaleString()}/{subscription.frequency.toLowerCase()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next Billing:</span>
                      <span className="text-gray-900">
                        {subscription.nextBillingDate || subscription.next_billing_date 
                          ? new Date(subscription.nextBillingDate || subscription.next_billing_date).toLocaleDateString()
                          : 'Not set'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Billed:</span>
                      <span className="text-gray-900">
                        ${parseFloat(subscription.totalBilled || subscription.total_billed || '0').toLocaleString()}
                      </span>
                    </div>
                    {subscription.description && (
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-600">{subscription.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subscriptions Modal */}
      {showSubscriptionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Active Subscriptions</h2>
                  <p className="text-sm text-gray-600">Manage your recurring services</p>
                </div>
              </div>
              <button
                onClick={() => setShowSubscriptionsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeSubscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscriptions</h3>
                  <p className="text-gray-500">You don't have any active subscriptions at the moment.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeSubscriptions.map((subscription) => (
                    <div key={subscription.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <Package className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {subscription.servicePackage?.name || subscription.description || 'Custom Service'}
                            </h3>
                            <p className="text-sm text-gray-500">{subscription.frequency} Billing</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          subscription.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {subscription.status}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-semibold text-gray-900">
                            ${parseFloat(subscription.amount || '0').toLocaleString()}/{subscription.frequency.toLowerCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Billing:</span>
                          <span className="text-gray-900">
                            {subscription.nextBillingDate || subscription.next_billing_date 
                              ? new Date(subscription.nextBillingDate || subscription.next_billing_date).toLocaleDateString()
                              : 'Not set'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Start Date:</span>
                          <span className="text-gray-900">
                            {subscription.startDate || subscription.start_date
                              ? new Date(subscription.startDate || subscription.start_date).toLocaleDateString()
                              : 'Not set'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Billed:</span>
                          <span className="text-gray-900">
                            ${parseFloat(subscription.totalBilled || subscription.total_billed || '0').toLocaleString()}
                          </span>
                        </div>
                        {subscription.servicePackage?.features && subscription.servicePackage.features.length > 0 && (
                          <div className="pt-3 border-t border-gray-100">
                            <span className="text-sm text-gray-600 block mb-2">Features:</span>
                            <div className="flex flex-wrap gap-1">
                              {subscription.servicePackage.features.map((feature, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {subscription.description && (
                          <div className="pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600">{subscription.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {activeSubscriptions.length} active subscription{activeSubscriptions.length !== 1 ? 's' : ''}
                </div>
                <button
                  onClick={() => setShowSubscriptionsModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}