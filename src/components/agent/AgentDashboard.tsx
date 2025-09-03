import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { logger } from '../../lib/logger';
import { useNotifications } from '../common/NotificationSystem';
import { Agent, AgentSale, SaleStatus } from '../../types';
import { AddSaleModal } from './AddSaleModal';
import { ResubmitSaleModal } from './ResubmitSaleModal';
import { AgentChargeCardModal } from './AgentChargeCardModal';
import { 
  User, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  RefreshCw,
  CreditCard
} from 'lucide-react';

export function AgentDashboard() {
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useNotifications();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [sales, setSales] = useState<AgentSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddSaleModal, setShowAddSaleModal] = useState(false);
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [selectedSaleForResubmit, setSelectedSaleForResubmit] = useState<AgentSale | null>(null);
  const [showChargeCardModal, setShowChargeCardModal] = useState(false);

  const fetchAgentData = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Fetch agent profile and sales in parallel
      const [agentResponse, salesResponse] = await Promise.all([
        apiClient.getOwnAgentProfile(),
        apiClient.getAgentSales()
      ]);

      setAgent(agentResponse);
      setSales(salesResponse);
      showSuccess('Agent Dashboard Loaded', 'Agent data loaded successfully.');
    } catch (err: unknown) {
      logger.error('Error fetching agent data:', err);
      setError('Failed to load agent data. Please try again.');
      showError('Agent Dashboard Error', 'Failed to load agent data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAgentData();
  }, [fetchAgentData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'REJECTED':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'PAID':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'CANCELLED':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getCommissionStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'APPROVED':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const handleSaleAdded = () => {
    setShowAddSaleModal(false);
    fetchAgentData(); // Refresh the data
    showSuccess('Sale Added', 'Sale has been submitted successfully and is pending approval.');
  };

  const handleResubmitSale = (sale: AgentSale) => {
    setSelectedSaleForResubmit(sale);
    setShowResubmitModal(true);
  };

  const handleResubmitSuccess = () => {
    setShowResubmitModal(false);
    setSelectedSaleForResubmit(null);
    fetchAgentData(); // Refresh the data
  };

  // Helper function to check if a rejected sale has already been resubmitted
  const hasBeenResubmitted = (rejectedSale: AgentSale) => {
    return sales.some(sale => 
      sale.originalSaleId === rejectedSale.id && 
      sale.saleStatus === SaleStatus.RESUBMITTED
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={fetchAgentData}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200 mb-2">Agent Profile Not Found</h3>
            <p className="text-yellow-600 dark:text-yellow-300">
              Your agent profile has not been set up yet. Please contact your administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Agent Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {agent.salesPersonName}! Here's your sales overview and recent activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{agent.totalSales}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Sales Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${agent.totalSalesValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <User className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${agent.totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Commission</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${agent.pendingCommission.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Profile */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Agent Profile</h2>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                agent.isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {agent.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Agent Code</p>
              <p className="text-lg text-gray-900 dark:text-white font-mono">{agent.agentCode}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Sales Person</p>
              <p className="text-lg text-gray-900 dark:text-white">{agent.salesPersonName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Commission Rate</p>
              <p className="text-lg text-gray-900 dark:text-white">
                {agent.agentCommissionRate}%
              </p>
            </div>
          </div>
          
          {/* Performance Summary */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {agent.totalSales > 0 ? ((agent.totalEarnings / agent.totalSalesValue) * 100).toFixed(1) : '0'}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Effective Commission Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${agent.totalSales > 0 ? (agent.totalSalesValue / agent.totalSales).toFixed(0) : '0'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Sale Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  ${agent.totalSales > 0 ? (agent.totalEarnings / agent.totalSales).toFixed(0) : '0'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average Commission per Sale</div>
              </div>
            </div>
          </div>
        </div>



        {/* Recent Sales */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Sales</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAddSaleModal(true)}
                  className="inline-flex items-center px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sale
                </button>
                <button
                  onClick={() => setShowChargeCardModal(true)}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Charge Card
                </button>
                <button
                  onClick={fetchAgentData}
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {sales.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No sales yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Start by adding your first sale to track your commissions.
              </p>
              <button
                onClick={() => setShowAddSaleModal(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Sale
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
                <thead className="bg-gray-50 dark:bg-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Sale Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Commission Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                  {sales.slice(0, 10).map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono text-gray-900 dark:text-white">
                          {sale.saleReference}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {sale.clientName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Closer: {sale.closerName}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {sale.serviceName}
                          </div>
                          {sale.serviceDescription && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {sale.serviceDescription}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${sale.saleAmount.toLocaleString()}
                        </span>
                        {sale.saleDate && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(sale.saleDate).toLocaleDateString()}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          ${sale.agentCommission.toLocaleString()}
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {sale.agentCommissionRate}% rate
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sale.saleStatus)}`}>
                          {sale.saleStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCommissionStatusColor(sale.commissionStatus)}`}>
                          {sale.commissionStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sale.saleStatus === SaleStatus.REJECTED && !hasBeenResubmitted(sale) && (
                          <button
                            onClick={() => handleResubmitSale(sale)}
                            className="inline-flex items-center px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Resubmit
                          </button>
                        )}
                        {sale.saleStatus === SaleStatus.REJECTED && hasBeenResubmitted(sale) && (
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                            Already Resubmitted
                          </span>
                        )}
                        {sale.saleStatus === SaleStatus.RESUBMITTED && (
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 rounded">
                            Resubmitted
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Sale Modal */}
      {showAddSaleModal && (
        <AddSaleModal
          onClose={() => setShowAddSaleModal(false)}
          onSuccess={handleSaleAdded}
        />
      )}

      {/* Resubmit Sale Modal */}
      {showResubmitModal && selectedSaleForResubmit && (
        <ResubmitSaleModal
          originalSale={selectedSaleForResubmit}
          onClose={() => {
            setShowResubmitModal(false);
            setSelectedSaleForResubmit(null);
          }}
          onSuccess={handleResubmitSuccess}
        />
      )}

      {/* Agent Charge Card Modal */}
      {showChargeCardModal && (
        <AgentChargeCardModal
          isOpen={showChargeCardModal}
          onClose={() => setShowChargeCardModal(false)}
          onPaymentProcessed={() => {
            setShowChargeCardModal(false);
            showSuccess('Payment Processed', 'Card has been charged successfully.');
          }}
        />
      )}
    </div>
  );
}