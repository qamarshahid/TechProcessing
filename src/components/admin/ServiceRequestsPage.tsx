import React, { useState, useEffect } from 'react';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { PriceAdjustmentModal } from './PriceAdjustmentModal';
import { FileAttachmentModal } from '../common/FileAttachmentModal';
import { 
  Package, 
  Plus, 
  Edit, 
  Eye, 
  DollarSign, 
  Calendar, 
  User, 
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Paperclip,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';

export function ServiceRequestsPage() {
  const { showSuccess, showError, showWarning } = useNotifications();
  
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  
  // Modal states
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [editingRequest, setEditingRequest] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    status: '',
    adminNotes: '',
    estimatedCost: '',
    estimatedTimeline: '',
    quoteAmount: '',
    paymentTerms: '',
  });

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [serviceRequests, searchTerm, statusFilter, typeFilter]);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.getServiceRequests();
      const requests = response?.serviceRequests || [];
      
      setServiceRequests(Array.isArray(requests) ? requests : []);
      showSuccess('Service Requests Loaded', `Successfully loaded ${requests.length} service requests.`);
    } catch (error) {
      logger.error('Error fetching service requests:', error);
      setError('Failed to load service requests. Please try again.');
      showError('Failed to Load Service Requests', 'Unable to load service requests. Please try again later.');
      setServiceRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...serviceRequests];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(request => request.request_type === typeFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleUpdateRequest = async (requestId: string, updateData: any) => {
    try {
      await apiClient.updateServiceRequest(requestId, updateData);
      await fetchServiceRequests();
      showSuccess('Request Updated', 'Service request has been updated successfully.');
    } catch (error) {
      logger.error('Error updating service request:', error);
      showError('Update Failed', 'Failed to update service request. Please try again.');
    }
  };

  const openEditModal = (request: any) => {
    setEditingRequest(request);
    setEditForm({
      status: request.status || '',
      adminNotes: request.admin_notes || '',
      estimatedCost: request.estimated_cost?.toString() || '',
      estimatedTimeline: request.estimated_timeline || '',
      quoteAmount: request.quote_amount?.toString() || '',
      paymentTerms: request.payment_terms || '',
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;

    try {
      const updateData = {
        status: editForm.status,
        adminNotes: editForm.adminNotes,
        estimatedCost: editForm.estimatedCost ? parseFloat(editForm.estimatedCost) : undefined,
        estimatedTimeline: editForm.estimatedTimeline || undefined,
        quoteAmount: editForm.quoteAmount ? parseFloat(editForm.quoteAmount) : undefined,
        paymentTerms: editForm.paymentTerms || undefined,
      };

      await handleUpdateRequest(editingRequest.id, updateData);
      setEditingRequest(null);
    } catch (error) {
      logger.error('Error updating request:', error);
    }
  };

  const openPriceAdjustment = (request: any) => {
    setSelectedRequest(request);
    setShowPriceModal(true);
  };

  const openAttachments = (request: any) => {
    setSelectedRequest(request);
    setShowAttachmentModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'REVIEWING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'QUOTE_READY':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'IN_PROGRESS':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'REVIEWING':
        return <Eye className="h-4 w-4" />;
      case 'QUOTE_READY':
        return <FileText className="h-4 w-4" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <TrendingUp className="h-4 w-4" />;
      case 'COMPLETED':
        return <Award className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SERVICE_REQUEST':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'CUSTOM_QUOTE':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Requests</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Manage client service requests and custom quotes</p>
        </div>
        <button
          onClick={fetchServiceRequests}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <button
              onClick={fetchServiceRequests}
              className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search requests by description, client, or ID..."
                className="pl-10 w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWING">Reviewing</option>
              <option value="QUOTE_READY">Quote Ready</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Types</option>
              <option value="SERVICE_REQUEST">Service Request</option>
              <option value="CUSTOM_QUOTE">Custom Quote</option>
            </select>
          </div>
        </div>
      </div>

      {/* Service Requests Table */}
      {filteredRequests.length > 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Request
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Quote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.description?.substring(0, 60)}...
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          #{request.request_number || request.id?.substring(0, 8)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {request.created_at ? new Date(request.created_at).toLocaleDateString() : 'Recent'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {request.client_name || 'Unknown Client'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(request.request_type || 'SERVICE_REQUEST')}`}>
                        {request.request_type === 'CUSTOM_QUOTE' ? 'Custom Quote' : 'Service Request'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {request.budget ? `$${parseFloat(request.budget).toLocaleString()}` : 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(request.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {request.quote_amount ? (
                        <div>
                          <div className="font-semibold">${parseFloat(request.quote_amount).toLocaleString()}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Quote ready</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">No quote</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(request)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Edit Request"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openPriceAdjustment(request)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Price Adjustment"
                        >
                          <DollarSign className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openAttachments(request)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="File Attachments"
                        >
                          <Paperclip className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Service Requests Found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL'
              ? 'Try adjusting your search or filter criteria.'
              : 'Service requests from clients will appear here.'
            }
          </p>
        </div>
      )}

      {/* Edit Request Modal */}
      {editingRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Service Request
              </h2>
              <button
                onClick={() => setEditingRequest(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="REVIEWING">Reviewing</option>
                    <option value="QUOTE_READY">Quote Ready</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quote Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="number"
                      value={editForm.quoteAmount}
                      onChange={(e) => setEditForm(prev => ({ ...prev, quoteAmount: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={editForm.adminNotes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  rows={3}
                  placeholder="Internal notes about this request..."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingRequest(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Price Adjustment Modal */}
      {showPriceModal && selectedRequest && (
        <PriceAdjustmentModal
          isOpen={showPriceModal}
          onClose={() => {
            setShowPriceModal(false);
            setSelectedRequest(null);
          }}
          requestId={selectedRequest.id}
          currentAmount={selectedRequest.quote_amount || selectedRequest.budget || 0}
          onAdjustmentCreated={() => {
            fetchServiceRequests();
            setShowPriceModal(false);
            setSelectedRequest(null);
          }}
        />
      )}

      {/* File Attachment Modal */}
      {showAttachmentModal && selectedRequest && (
        <FileAttachmentModal
          isOpen={showAttachmentModal}
          onClose={() => {
            setShowAttachmentModal(false);
            setSelectedRequest(null);
          }}
          requestId={selectedRequest.id}
          attachments={selectedRequest.attachments || []}
          onAttachmentsUpdated={() => {
            fetchServiceRequests();
          }}
        />
      )}
    </div>
  );
}