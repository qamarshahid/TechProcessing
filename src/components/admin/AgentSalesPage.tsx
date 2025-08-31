import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../common/NotificationSystem';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import AddAgentModal from './AddAgentModal';

interface Agent {
  id: string;
  userId: string;
  agentCode: string;
  salesPersonName: string;
  closerName: string;
  agentCommissionRate: number;
  closerCommissionRate: number;
  totalEarnings: number;
  totalPaidOut: number;
  pendingCommission: number;
  totalSales: number;
  totalSalesValue: number;
  isActive: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    companyName?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface AgentSale {
  id: string;
  amount: number;
  commission: number;
  clientName: string;
  agentName: string;
  createdAt: string;
  status: string;
}

export default function AgentSalesPage() {
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useNotifications();
  const [activeTab, setActiveTab] = useState<'sales' | 'manage'>('sales');
  const [agentSales, setAgentSales] = useState<AgentSale[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  
  // Confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if user has admin access
  const isAdmin = user?.role === 'ADMIN';

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    if (!isAdmin) {
      setError('Access denied. You need admin privileges to view this page.');
      setLoading(false);
      return;
    }

    try {
      // Fetch both agent sales and agents using admin endpoints
      const [salesResponse, agentsResponse] = await Promise.all([
        apiClient.getAllAgentSales(),
        apiClient.getAgents() // returns both active and inactive agents now
      ]);
      
      setAgentSales(salesResponse || []);
      setAgents(agentsResponse || []);
      showSuccess('Agent Data Loaded', `Successfully loaded ${salesResponse?.length || 0} sales and ${agentsResponse?.length || 0} agents.`);
    } catch (err) {
      logger.error('Failed to fetch agent data', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('Forbidden')) {
        setError('Access denied. You need admin privileges to view this page.');
        showError('Access Denied', 'You need admin privileges to view this page.');
      } else {
        setError('Failed to load agent data. Please try again.');
        showError('Failed to Load Data', 'Failed to load agent data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  const handleToggleAgentStatus = async (agentId: string, currentStatus: boolean) => {
    try {
      await apiClient.updateAgentStatus(agentId, !currentStatus);
      
      // Update local state
      setAgents(prev => prev.map(agent => 
        agent.id === agentId 
          ? { ...agent, isActive: !currentStatus }
          : agent
      ));
      
      logger.info(`Agent status updated successfully`, { agentId, newStatus: !currentStatus });
      showSuccess('Agent Status Updated', `Agent status has been ${!currentStatus ? 'activated' : 'deactivated'} successfully.`);
    } catch (err) {
      logger.error('Failed to update agent status', err);
      setError('Failed to update agent status. Please try again.');
      showError('Update Failed', 'Failed to update agent status. Please try again.');
    }
  };

  const handleAgentAdded = () => {
    setShowAddAgentModal(false);
    fetchData(); // Refresh the agents list
    showSuccess('Agent Added', 'New agent has been added successfully.');
  };

  const handleDeleteClick = (agent: Agent) => {
    setAgentToDelete(agent);
    setShowDeleteModal(true);
  };

  const deleteAgent = async (hardDelete: boolean) => {
    if (!agentToDelete) return;
    
    setIsDeleting(true);
    try {
      // Use the proper agent delete endpoint with hardDelete parameter
      await apiClient.deleteAgent(agentToDelete.id, hardDelete);
      
      // Immediately remove from local state for instant UI feedback
      setAgents(prev => prev.filter(agent => agent.id !== agentToDelete.id));
      
      const agentName = agentToDelete.user?.fullName || 'Agent';
      const actionType = hardDelete ? 'permanently deleted' : 'deactivated';
      showSuccess('Agent Action Completed', `${agentName} has been ${actionType} successfully.`);
      
      // Also refresh data to ensure consistency
      fetchData();
    } catch (error: any) {
      logger.error('Error deleting agent:', error);
      const actionType = hardDelete ? 'permanently delete' : 'deactivate';
      showError('Action Failed', `Failed to ${actionType} agent. Please try again.`);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setAgentToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Agent Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage agent sales and agent accounts
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-400 hover:text-red-600 dark:hover:text-red-300"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('sales')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sales'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Agent Sales
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'manage'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Manage Agents
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'sales' ? (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Agent Sales History
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {agentSales.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="text-gray-500 dark:text-gray-400">
                          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium">No sales data</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Agent sales will appear here once they start making sales.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    agentSales.map((sale) => (
                      <tr key={sale.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {sale.agentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {sale.clientName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${sale.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          ${sale.commission.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            sale.status === 'completed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : sale.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          }`}>
                            {sale.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(sale.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Agent Accounts
              </h2>
              <button
                onClick={() => setShowAddAgentModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add Agent
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {agents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="text-gray-500 dark:text-gray-400">
                          <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium">No agents</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Get started by adding your first agent.
                          </p>
                          <div className="mt-6">
                            <button
                              onClick={() => setShowAddAgentModal(true)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Add Agent
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    agents.map((agent) => {
                      return (
                        <tr key={agent.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {agent.user.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {agent.user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              agent.user.isActive
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            }`}>
                              {agent.user.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {new Date(agent.user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleToggleAgentStatus(agent.user.id, agent.user.isActive)}
                                className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                  agent.user.isActive
                                    ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30'
                                    : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                                }`}
                              >
                                {agent.user.isActive ? 'Disable' : 'Enable'}
                              </button>
                              <button
                                onClick={() => handleDeleteClick(agent)}
                                className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                                title="Delete Agent"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Agent Modal */}
        {showAddAgentModal && (
          <AddAgentModal
            onClose={() => setShowAddAgentModal(false)}
            onSuccess={handleAgentAdded}
          />
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setAgentToDelete(null);
          }}
          onConfirm={deleteAgent}
          title="Delete Agent"
          message={`Are you sure you want to delete ${agentToDelete?.user?.fullName || 'this agent'}?`}
          entityName={agentToDelete?.user?.fullName || 'Agent'}
          entityType="agent"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
