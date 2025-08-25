import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { AgentSale, SaleStatus, CommissionStatus, Agent } from '../../types';
import { X, MessageSquare, CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react';
import { CommissionRateModal } from './CommissionRateModal';

const AgentSalesPage: React.FC = () => {
  const [sales, setSales] = useState<AgentSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<SaleStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSale, setSelectedSale] = useState<AgentSale | null>(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showViewNotesModal, setShowViewNotesModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [showCommissionRateModal, setShowCommissionRateModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionFeedback, setRejectionFeedback] = useState('');

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAllAgentSales();
      setSales(response || []);
    } catch (error) {
      console.error('Error fetching agent sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (saleId: string, newStatus: SaleStatus) => {
    try {
      await apiClient.updateSaleStatus(saleId, newStatus);
      await fetchSales(); // Refresh the list
    } catch (error) {
      console.error('Error updating sale status:', error);
    }
  };

  const handleCommissionStatusUpdate = async (saleId: string, newStatus: CommissionStatus) => {
    try {
      await apiClient.updateCommissionStatus(saleId, newStatus);
      await fetchSales(); // Refresh the list
    } catch (error) {
      console.error('Error updating commission status:', error);
    }
  };

  const handleAddNotes = async () => {
    if (!selectedSale || !adminNotes.trim()) return;
    
    try {
      await apiClient.updateAgentSaleNotes(selectedSale.id, adminNotes);
      setShowNotesModal(false);
      setAdminNotes('');
      setSelectedSale(null);
      await fetchSales(); // Refresh the list
    } catch (error) {
      console.error('Error adding notes:', error);
    }
  };

  const openNotesModal = (sale: AgentSale) => {
    setSelectedSale(sale);
    setAdminNotes(sale.notes || '');
    setShowNotesModal(true);
  };

  const openChangesModal = (sale: AgentSale) => {
    setSelectedSale(sale);
    setShowChangesModal(true);
  };

  const openCommissionRateModal = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowCommissionRateModal(true);
  };

  const handleRejectSale = async () => {
    if (!selectedSale) return;
    
    try {
      await apiClient.updateSaleStatus(selectedSale.id, SaleStatus.REJECTED);
      if (rejectionFeedback.trim()) {
        await apiClient.updateAgentSaleNotes(selectedSale.id, `REJECTION FEEDBACK: ${rejectionFeedback}`);
      }
      setShowRejectionModal(false);
      setRejectionFeedback('');
      setSelectedSale(null);
      await fetchSales(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting sale:', error);
    }
  };

  const filteredSales = sales.filter(sale => {
    const matchesFilter = filter === 'ALL' || sale.saleStatus === filter;
    const matchesSearch = searchTerm === '' || 
      sale.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.saleReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: SaleStatus) => {
    switch (status) {
      case SaleStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case SaleStatus.APPROVED: return 'bg-green-100 text-green-800';
      case SaleStatus.REJECTED: return 'bg-red-100 text-red-800';
      case SaleStatus.RESUBMITTED: return 'bg-orange-100 text-orange-800';
      case SaleStatus.PAID: return 'bg-blue-100 text-blue-800';
      case SaleStatus.CANCELLED: return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCommissionStatusColor = (status: CommissionStatus) => {
    switch (status) {
      case CommissionStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
      case CommissionStatus.APPROVED: return 'bg-green-100 text-green-800';
      case CommissionStatus.PAID: return 'bg-blue-100 text-blue-800';
      case CommissionStatus.CANCELLED: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agent Sales Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status Filter
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as SaleStatus | 'ALL')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="ALL">All Statuses</option>
              <option value={SaleStatus.PENDING}>Pending</option>
              <option value={SaleStatus.APPROVED}>Approved</option>
              <option value={SaleStatus.REJECTED}>Rejected</option>
              <option value={SaleStatus.RESUBMITTED}>Resubmitted</option>
              <option value={SaleStatus.PAID}>Paid</option>
              <option value={SaleStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by client name, reference, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sale Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Agent & Closer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Financial
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white flex items-center">
                            {sale.saleReference}
                            {sale.notes && (
                              <span className="ml-2 text-blue-600 dark:text-blue-400" title="Has notes">
                                📝
                              </span>
                            )}
                            {sale.saleStatus === SaleStatus.RESUBMITTED && (
                              <span className="ml-2 text-orange-600 dark:text-orange-400" title="Resubmitted">
                                🔄
                              </span>
                            )}
                            {sale.resubmissionCount && sale.resubmissionCount > 0 && (
                              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                                (Resubmission #{sale.resubmissionCount})
                              </span>
                            )}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {sale.serviceName}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(sale.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white flex items-center">
                            Agent: {sale.agent?.salesPersonName || 'N/A'}
                            {sale.agent && (
                              <button
                                onClick={() => openCommissionRateModal(sale.agent!)}
                                className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Adjust Commission Rates"
                              >
                                <Settings className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            Closer: {sale.closerName || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Code: {sale.agent?.agentCode || 'N/A'}
                          </div>
                          {sale.agent && (
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              Rates: {sale.agent.agentCommissionRate}% / {sale.agent.closerCommissionRate}%
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {sale.clientName}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {sale.clientEmail}
                          </div>
                          {sale.clientPhone && (
                            <div className="text-gray-500 dark:text-gray-400">
                              {sale.clientPhone}
                            </div>
                          )}
                        </div>
                      </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">
                            ${sale.saleAmount}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            Agent: ${sale.agentCommission}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            Closer: ${sale.closerCommission}
                          </div>
                          {sale.notes && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              📝 Has notes
                            </div>
                          )}
                        </div>
                      </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sale.saleStatus)}`}>
                        {sale.saleStatus}
                      </span>
                      <br />
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCommissionStatusColor(sale.commissionStatus)}`}>
                        {sale.commissionStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="space-y-2">
                      {sale.saleStatus === SaleStatus.PENDING && (
                        <div className="space-y-1">
                          <button
                            onClick={() => handleStatusUpdate(sale.id, SaleStatus.APPROVED)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSale(sale);
                              setShowRejectionModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                      {sale.saleStatus === SaleStatus.APPROVED && sale.commissionStatus === CommissionStatus.PENDING && (
                        <button
                          onClick={() => handleCommissionStatusUpdate(sale.id, CommissionStatus.APPROVED)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          Approve Commission
                        </button>
                      )}
                      {sale.saleStatus === SaleStatus.RESUBMITTED && (
                        <div className="space-y-1">
                          <button
                            onClick={() => handleStatusUpdate(sale.id, SaleStatus.APPROVED)}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 mr-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSale(sale);
                              setShowRejectionModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Reject
                          </button>
                          {sale.changesMade && Object.keys(sale.changesMade).length > 0 && (
                            <button
                              onClick={() => openChangesModal(sale)}
                              className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                              title="View Changes"
                            >
                              View Changes
                            </button>
                          )}
                        </div>
                      )}
                      <div className="flex space-x-1">
                        {sale.notes && (
                          <button
                            onClick={() => {
                              setSelectedSale(sale);
                              setShowViewNotesModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            title="View Notes"
                          >
                            📝
                          </button>
                        )}
                        <button
                          onClick={() => openNotesModal(sale)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="Edit Notes"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSales.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No sales found matching your criteria.</p>
        </div>
      )}

      {/* Notes Modal */}
      {showNotesModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add Notes</h3>
              <button
                onClick={() => {
                  setShowNotesModal(false);
                  setSelectedSale(null);
                  setAdminNotes('');
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes for {selectedSale.saleReference}
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  rows={6}
                  placeholder="Add or edit admin notes..."
                />
                {selectedSale.notes && (
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Previous notes will be replaced with new content
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowNotesModal(false);
                    setSelectedSale(null);
                    setAdminNotes('');
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNotes}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Add Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Notes Modal */}
      {showViewNotesModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">View Notes</h3>
              <button
                onClick={() => {
                  setShowViewNotesModal(false);
                  setSelectedSale(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes for {selectedSale.saleReference}
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white min-h-[100px] whitespace-pre-wrap">
                  {selectedSale.notes}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowViewNotesModal(false);
                    setSelectedSale(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Reject Sale</h3>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setSelectedSale(null);
                  setRejectionFeedback('');
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rejection Feedback (Optional)
                </label>
                <textarea
                  value={rejectionFeedback}
                  onChange={(e) => setRejectionFeedback(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:text-white"
                  rows={4}
                  placeholder="Provide feedback for rejection..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectionModal(false);
                    setSelectedSale(null);
                    setRejectionFeedback('');
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSale}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reject Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Changes Modal */}
      {showChangesModal && selectedSale && selectedSale.changesMade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Changes Made</h3>
              <button
                onClick={() => {
                  setShowChangesModal(false);
                  setSelectedSale(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Changes made to {selectedSale.saleReference} (Resubmission #{selectedSale.resubmissionCount || 1})
                </p>
                <div className="space-y-4">
                  {Object.entries(selectedSale.changesMade).map(([field, change]: [string, any]) => (
                    <div key={field} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2 capitalize">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-red-600 dark:text-red-400 font-medium">From:</span>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">{change.from || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-green-600 dark:text-green-400 font-medium">To:</span>
                          <p className="text-gray-700 dark:text-gray-300 mt-1">{change.to || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowChangesModal(false);
                    setSelectedSale(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Commission Rate Modal */}
      {showCommissionRateModal && selectedAgent && (
        <CommissionRateModal
          agent={selectedAgent}
          onClose={() => {
            setShowCommissionRateModal(false);
            setSelectedAgent(null);
          }}
          onSuccess={() => {
            fetchSales(); // Refresh the data
          }}
        />
      )}
    </div>
  );
};

export default AgentSalesPage;
