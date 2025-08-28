import React, { useState, useEffect } from 'react';
import { X, Receipt, TrendingUp, Calendar, CreditCard, CheckCircle, Clock, AlertCircle, Activity, Banknote, ArrowUpCircle, ArrowDownCircle, Download, Sparkles, RefreshCw } from 'lucide-react';
import { apiClient } from '../../lib/api';

interface ClientTransactionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
}

export function ClientTransactionHistory({ isOpen, onClose, clientId, clientName }: ClientTransactionHistoryProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    lastPayment: null
  });

  useEffect(() => {
    if (isOpen && clientId) {
      fetchClientHistory();
      
      // Listen for invoice changes to refresh client history
      const handleInvoiceChange = (event: any) => {
        const { clientId: changedClientId } = event.detail || {};
        // Only refresh if this client was affected
        if (!changedClientId || changedClientId === clientId) {
          console.log('Invoice change detected for this client, refreshing history...');
          fetchClientHistory();
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
  }, [isOpen, clientId]);

  const fetchClientHistory = async () => {
    try {
      console.log('Fetching history for client:', clientId, clientName);
      
      // Get comprehensive client data including subscriptions
      const historyResponse = await apiClient.getClientTransactionHistory(clientId);
      const subscriptionsResponse = await apiClient.getSubscriptions();
      
      console.log('History response:', historyResponse);
      
      // Check if there was an error in the response
      if (historyResponse.error) {
        console.error('Error in history response:', historyResponse.error);
      }
      
      setTransactions(historyResponse.transactions || []);
      
      // Get client subscriptions
      const allSubscriptions = subscriptionsResponse.subscriptions || [];
      const clientSubscriptions = allSubscriptions.filter(sub => sub.client_id === clientId);
      
      // Calculate stats from the client's specific data including subscriptions
      const clientInvoices = historyResponse.invoices || [];
      const clientPayments = historyResponse.payments || [];
      
      console.log('Processing stats:', { clientInvoices, clientPayments });
      
      const totalInvoices = clientInvoices.length;
      
      // Calculate total paid from completed payments
      const completedPayments = clientPayments.filter(payment => 
        payment.status === 'COMPLETED' || payment.status === 'completed'
      );
      const totalPaid = completedPayments
        .reduce((sum, payment) => sum + parseFloat(payment.amount || '0'), 0);
      
      // Calculate outstanding from unpaid invoices
      const unpaidInvoices = clientInvoices.filter(inv => 
        inv.status === 'UNPAID' || inv.status === 'OVERDUE' || inv.status === 'DRAFT' ||
        inv.status === 'unpaid' || inv.status === 'overdue' || inv.status === 'draft'
      );
      const totalOutstanding = unpaidInvoices
        .reduce((sum, inv) => sum + parseFloat(inv.amount || inv.total || '0'), 0);
      
      // Add subscription revenue to total paid
      const subscriptionRevenue = clientSubscriptions
        .reduce((sum, sub) => sum + parseFloat(sub.total_billed || '0'), 0);
      
      // Find the most recent completed payment
      const lastPayment = completedPayments.length > 0 
        ? completedPayments
            .sort((a, b) => new Date(b.created_at || b.createdAt).getTime() - new Date(a.created_at || a.createdAt).getTime())[0]
            .created_at || completedPayments[0].createdAt
        : null;
      
      console.log('Calculated stats:', {
        totalInvoices,
        totalPaid: totalPaid + subscriptionRevenue,
        totalOutstanding,
        lastPayment,
        subscriptions: clientSubscriptions.length,
        unpaidInvoices,
        completedPayments
      });
      
      setStats({
        totalInvoices,
        totalPaid: totalPaid + subscriptionRevenue,
        totalOutstanding,
        lastPayment
      });
    } catch (error) {
      console.error('Error fetching client history:', error);
      // Set empty data on error
      setTransactions([]);
      setStats({
        totalInvoices: 0,
        totalPaid: 0,
        totalOutstanding: 0,
        lastPayment: null
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return <ArrowUpCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <ArrowDownCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Receipt className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'completed':
        return 'bg-gradient-to-r from-emerald-100 dark:from-emerald-900/30 to-green-100 dark:to-green-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700';
      case 'pending':
        return 'bg-gradient-to-r from-amber-100 dark:from-amber-900/30 to-yellow-100 dark:to-yellow-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700';
      case 'failed':
        return 'bg-gradient-to-r from-red-100 dark:from-red-900/30 to-rose-100 dark:to-rose-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700';
      default:
        return 'bg-gradient-to-r from-gray-100 dark:from-slate-700 to-slate-100 dark:to-slate-600 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-slate-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-slate-600">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-600">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-xl relative">
              <Activity className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 dark:from-white to-gray-700 dark:to-gray-300 bg-clip-text text-transparent">Transaction History</h2>
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{clientName}</p>
                <Sparkles className="h-4 w-4 text-purple-500" />
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-indigo-50 dark:to-indigo-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Receipt className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Total Invoices</p>
                  <p className="text-2xl font-black text-blue-900 dark:text-blue-100">{stats.totalInvoices}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 dark:from-emerald-900/20 to-green-50 dark:to-green-900/20 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Total Paid</p>
                  <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100">${stats.totalPaid.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 dark:from-amber-900/20 to-orange-50 dark:to-orange-900/20 rounded-xl p-5 border border-amber-100 dark:border-amber-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Banknote className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">Outstanding</p>
                  <p className="text-2xl font-black text-amber-900 dark:text-amber-100">${stats.totalOutstanding.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-50 dark:from-violet-900/20 to-purple-50 dark:to-purple-900/20 rounded-xl p-5 border border-violet-100 dark:border-violet-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-violet-700 dark:text-violet-300">Last Payment</p>
                  <p className="text-sm font-black text-violet-900 dark:text-violet-100">
                    {stats.lastPayment ? new Date(stats.lastPayment).toLocaleDateString() : 'None'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-600 overflow-hidden shadow-lg">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-600 bg-gradient-to-r from-gray-50 dark:from-slate-700 to-gray-100 dark:to-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transaction History</h3>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-32 bg-gradient-to-br from-blue-50 dark:from-slate-800 to-indigo-50 dark:to-slate-700">
                <div className="relative">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-20 animate-pulse"></div>
                </div>
              </div>
            ) : transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 bg-gradient-to-br from-gray-50 dark:from-slate-800 to-slate-50 dark:to-slate-700">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Receipt className="h-8 w-8 text-white" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">No transactions found for this client</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Invoices and payments will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-slate-600">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-6 hover:bg-gradient-to-r hover:from-blue-50 dark:hover:from-blue-900/20 hover:to-indigo-50 dark:hover:to-indigo-900/20 transition-all duration-300 hover:shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          {getStatusIcon(transaction.status)}
                          <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {transaction.description}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {transaction.date && !isNaN(new Date(transaction.date).getTime()) 
                                ? new Date(transaction.date).toLocaleDateString()
                                : 'No date'
                              }
                            </p>
                            {transaction.payment_method && (
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center mr-2">
                                  <CreditCard className="h-3 w-3 text-white" />
                                </div>
                                <span className="font-medium">{transaction.payment_method}</span>
                              </div>
                            )}
                            {transaction.invoice_number && (
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                                #{transaction.invoice_number}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-black bg-gradient-to-r from-gray-900 dark:from-white to-gray-700 dark:to-gray-300 bg-clip-text text-transparent">
                            ${transaction.amount.toLocaleString()}
                          </p>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-5 border-t border-gray-200 dark:border-slate-600 bg-gradient-to-r from-gray-50 dark:from-slate-700 to-gray-100 dark:to-slate-700">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 hover:shadow-md transition-all duration-200 font-semibold"
            >
              Close
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}