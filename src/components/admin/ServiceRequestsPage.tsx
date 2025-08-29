import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../lib/api';
import { useNotifications } from '../common/NotificationSystem';
import { logger } from '../../lib/logger';
import { 
  Package, 
  User, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  Edit3,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  TrendingUp,
  TrendingDown,
  Paperclip
} from 'lucide-react';
import { PriceAdjustmentModal } from './PriceAdjustmentModal';
import { FileAttachmentModal } from '../common/FileAttachmentModal';

interface ServiceRequest {
  id: string;
  serviceId?: string;
  clientId: string;
  description: string;
  budget?: number;
  timeline?: string;
  additionalRequirements?: string;
  status: 'PENDING' | 'REVIEWING' | 'QUOTE_READY' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
  adminNotes?: string;
  estimatedCost?: number;
  estimatedTimeline?: string;
  expectedStartDate?: string;
  expectedDeliveryDate?: string;
  actualStartDate?: string;
  actualDeliveryDate?: string;
  quoteAmount?: number;
  paymentTerms?: string;
  priceAdjustments?: PriceAdjustment[];
  attachments?: FileAttachment[];
  createdAt: string;
  updatedAt: string;
  isCustomQuote?: boolean;
  requestType?: 'CUSTOM_QUOTE' | 'SERVICE_REQUEST';
  service?: {
    name: string;
    description: string;
    price: number;
  };
  client?: {
    fullName: string;
    email: string;
    companyName?: string;
  };
}

interface PriceAdjustment {
  id: string;
  requestId: string;
  previousAmount: number;
  newAmount: number;
  reason: string;
  adjustedBy: string;
  adjustedAt: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  clientNotes?: string;
}

interface FileAttachment {
  id: string;
  requestId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  description?: string;
  category: 'REQUIREMENTS' | 'QUOTE' | 'CONTRACT' | 'DELIVERABLE' | 'REFERENCE' | 'OTHER';
}

export function ServiceRequestsPage() {
  const { showError, showSuccess, showWarning } = useNotifications();
  
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPriceAdjustmentModalOpen, setIsPriceAdjustmentModalOpen] = useState(false);
  const [isFileAttachmentModalOpen, setIsFileAttachmentModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    adminNotes: '',
    estimatedCost: '',
    estimatedTimeline: '',
    expectedStartDate: '',
    expectedDeliveryDate: '',
    quoteAmount: '',
    paymentTerms: ''
  });

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filters: any = {};
      if (filter !== 'ALL') {
        filters.status = filter;
      }
      
      const response = await apiClient.getServiceRequests(filters);
      setRequests(response.serviceRequests || []);
      showSuccess('Requests Loaded', `Successfully loaded ${response.serviceRequests?.length || 0} service requests.`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error('Error fetching service requests:', error);
      setError(errorMessage);
      showError('Failed to Load Requests', 'Unable to load service requests. Please try again later.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [filter, showError, showSuccess]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      const updateData: any = {};
      if (editForm.status) updateData.status = editForm.status;
      if (editForm.adminNotes !== undefined) updateData.adminNotes = editForm.adminNotes;
      if (editForm.estimatedCost) updateData.estimatedCost = parseFloat(editForm.estimatedCost);
      if (editForm.estimatedTimeline) updateData.estimatedTimeline = editForm.estimatedTimeline;
      if (editForm.quoteAmount) updateData.quoteAmount = parseFloat(editForm.quoteAmount);
      if (editForm.expectedStartDate) updateData.expectedStartDate = editForm.expectedStartDate;
      if (editForm.expectedDeliveryDate) updateData.expectedDeliveryDate = editForm.expectedDeliveryDate;
      if (editForm.paymentTerms) updateData.paymentTerms = editForm.paymentTerms;

      // Auto-set actual start date when moving to IN_PROGRESS
      if (editForm.status === 'IN_PROGRESS' && !selectedRequest.actualStartDate) {
        updateData.actualStartDate = new Date().toISOString().split('T')[0];
      }

      // Auto-set actual delivery date when moving to COMPLETED
      if (editForm.status === 'COMPLETED' && !selectedRequest.actualDeliveryDate) {
        updateData.actualDeliveryDate = new Date().toISOString().split('T')[0];
      }

      await apiClient.updateServiceRequest(selectedRequest.id, updateData);
      
      showSuccess('Request Updated', 'Service request has been updated successfully.');
      setIsEditModalOpen(false);
      setSelectedRequest(null);
      setEditForm({ 
        status: '', 
        adminNotes: '', 
        estimatedCost: '', 
        estimatedTimeline: '',
        expectedStartDate: '',
        expectedDeliveryDate: '',
        quoteAmount: '',
        paymentTerms: ''
      });
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      let errorMessage = 'Failed to update request';
      
      if (error.message?.includes('Cannot start work until the invoice is paid')) {
        errorMessage = 'Cannot start work until the invoice is paid. Please ensure the invoice is paid before marking as IN_PROGRESS.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      logger.error('Error updating service request:', error);
      showError('Update Failed', errorMessage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
      case 'REVIEWING':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
      case 'QUOTE_READY':
        return 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800';
      case 'APPROVED':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800';
      case 'REJECTED':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-800';
      case 'REVIEW':
        return 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 border border-orange-200 dark:border-orange-800';
      case 'COMPLETED':
        return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />;
      case 'REVIEWING':
        return <Eye className="h-4 w-4" />;
      case 'QUOTE_READY':
        return <DollarSign className="h-4 w-4" />;
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />;
      case 'IN_PROGRESS':
        return <Package className="h-4 w-4" />;
      case 'REVIEW':
        return <Eye className="h-4 w-4" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading service requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Requests</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => fetchRequests()}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Requests</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage client service requests and quotes</p>
        </div>
        <button
          onClick={() => fetchRequests()}
          disabled={loading}
          className="inline-flex items-center px-3 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8">
          {['ALL', 'PENDING', 'REVIEWING', 'QUOTE_READY', 'APPROVED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                filter === status
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {status}
            </button>
          ))}
        </nav>
      </div>

      {/* Requests List */}
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                                     <div className="flex items-center gap-3 mb-2">
                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                       {request.isCustomQuote ? 'Custom Quote Request' : (request.service?.name || 'Unknown Service')}
                     </h3>
                     <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                       {getStatusIcon(request.status)}
                       <span className="ml-1">{request.status}</span>
                     </span>
                     {request.isCustomQuote && (
                       <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                         <Package className="h-3 w-3 mr-1" />
                         CUSTOM
                       </span>
                     )}
                   </div>
                  
                                     <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                     <div className="flex items-center">
                       <User className="h-4 w-4 mr-1" />
                       {request.client?.fullName || 'Unknown Client'}
                     </div>
                     <div className="flex items-center">
                       <Calendar className="h-4 w-4 mr-1" />
                       {new Date(request.createdAt).toLocaleDateString()}
                     </div>
                     {request.budget && (
                       <div className="flex items-center">
                         <DollarSign className="h-4 w-4 mr-1" />
                         ${request.budget.toLocaleString()}
                       </div>
                     )}
                     {request.quoteAmount && (
                       <div className="flex items-center">
                         <DollarSign className="h-4 w-4 mr-1" />
                         Quote: ${request.quoteAmount.toLocaleString()}
                       </div>
                     )}
                   </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                    {request.description}
                  </p>
                  
                                     {/* Delivery Information */}
                   {(request.expectedStartDate || request.expectedDeliveryDate) && (
                     <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 mb-3">
                       <div className="text-sm text-blue-800 dark:text-blue-200">
                         <div className="flex items-center gap-4">
                           {request.expectedStartDate && (
                             <div>
                               <strong>Expected Start:</strong> {new Date(request.expectedStartDate).toLocaleDateString()}
                             </div>
                           )}
                           {request.expectedDeliveryDate && (
                             <div>
                               <strong>Expected Delivery:</strong> {new Date(request.expectedDeliveryDate).toLocaleDateString()}
                             </div>
                           )}
                         </div>
                         {request.actualStartDate && (
                           <div className="mt-1">
                             <strong>Actual Start:</strong> {new Date(request.actualStartDate).toLocaleDateString()}
                           </div>
                         )}
                         {request.actualDeliveryDate && (
                           <div className="mt-1">
                             <strong>Actual Delivery:</strong> {new Date(request.actualDeliveryDate).toLocaleDateString()}
                           </div>
                         )}
                       </div>
                     </div>
                   )}

                   {/* Payment Information */}
                   {(request.quoteAmount || request.paymentTerms) && (
                     <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800 mb-3">
                       <div className="text-sm text-green-800 dark:text-green-200">
                         {request.quoteAmount && (
                           <div className="mb-1">
                             <strong>Quote Amount:</strong> ${request.quoteAmount.toLocaleString()}
                           </div>
                         )}
                         {request.paymentTerms && (
                           <div>
                             <strong>Payment Terms:</strong> {request.paymentTerms}
                           </div>
                         )}
                       </div>
                     </div>
                   )}

                   {/* Price Adjustment History */}
                   {request.priceAdjustments && request.priceAdjustments.length > 0 && (
                     <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800 mb-3">
                       <div className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                         <strong>Price Adjustment History:</strong>
                       </div>
                       <div className="space-y-2">
                         {request.priceAdjustments.map((adjustment) => (
                           <div key={adjustment.id} className="text-xs bg-white dark:bg-slate-700 rounded p-2">
                             <div className="flex items-center justify-between mb-1">
                               <span className="font-medium">
                                 ${adjustment.previousAmount.toLocaleString()} → ${adjustment.newAmount.toLocaleString()}
                               </span>
                               <span className={`px-2 py-1 rounded text-xs ${
                                 adjustment.status === 'APPROVED' 
                                   ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
                                   : adjustment.status === 'REJECTED'
                                   ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                                   : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                               }`}>
                                 {adjustment.status}
                               </span>
                             </div>
                             <div className="text-gray-600 dark:text-gray-400">
                               <strong>Reason:</strong> {adjustment.reason}
                             </div>
                             <div className="text-gray-500 dark:text-gray-500 text-xs">
                               {new Date(adjustment.adjustedAt).toLocaleDateString()}
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   )}

                   {/* File Attachments Summary */}
                   {request.attachments && request.attachments.length > 0 && (
                     <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 mb-3">
                       <div className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                         <strong>Attached Files ({request.attachments.length}):</strong>
                       </div>
                       <div className="grid grid-cols-2 gap-2">
                         {request.attachments.slice(0, 4).map((attachment) => (
                           <div key={attachment.id} className="text-xs bg-white dark:bg-slate-700 rounded p-2">
                             <div className="font-medium truncate">{attachment.fileName}</div>
                             <div className="text-gray-500 dark:text-gray-400">{attachment.category}</div>
                           </div>
                         ))}
                         {request.attachments.length > 4 && (
                           <div className="text-xs text-gray-500 dark:text-gray-400 col-span-2">
                             +{request.attachments.length - 4} more files
                           </div>
                         )}
                       </div>
                     </div>
                   )}

                   {request.adminNotes && (
                     <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-800">
                       <p className="text-sm text-yellow-800 dark:text-yellow-200">
                         <strong>Admin Notes:</strong> {request.adminNotes}
                       </p>
                     </div>
                   )}
                </div>
                
                                       <div className="flex items-center space-x-2">
                         <button
                           onClick={() => {
                             setSelectedRequest(request);
                             setIsFileAttachmentModalOpen(true);
                           }}
                           className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
                         >
                           <Paperclip className="h-4 w-4 mr-2" />
                           Files
                         </button>
                         {request.quoteAmount && (
                           <button
                             onClick={() => {
                               setSelectedRequest(request);
                               setIsPriceAdjustmentModalOpen(true);
                             }}
                             className="inline-flex items-center px-3 py-2 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white rounded-lg transition-colors"
                           >
                             <TrendingUp className="h-4 w-4 mr-2" />
                             Adjust Price
                           </button>
                         )}
                         <button
                           onClick={() => {
                             setSelectedRequest(request);
                             setEditForm({
                               status: request.status,
                               adminNotes: request.adminNotes || '',
                               estimatedCost: request.estimatedCost?.toString() || '',
                               estimatedTimeline: request.estimatedTimeline || '',
                               expectedStartDate: request.expectedStartDate || '',
                               expectedDeliveryDate: request.expectedDeliveryDate || '',
                               quoteAmount: request.quoteAmount?.toString() || '',
                               paymentTerms: request.paymentTerms || ''
                             });
                             setIsEditModalOpen(true);
                           }}
                           className="inline-flex items-center px-3 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg transition-colors"
                         >
                           <Edit3 className="h-4 w-4 mr-2" />
                           Update
                         </button>
                       </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Service Requests</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {filter === 'ALL' 
              ? "No service requests have been submitted yet." 
              : `No ${filter.toLowerCase()} requests found.`
            }
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Update Request
              </h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedRequest(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="REVIEWING">Reviewing</option>
                  <option value="QUOTE_READY">Quote Ready</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">Ready for Review</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={editForm.adminNotes}
                  onChange={(e) => setEditForm(prev => ({ ...prev, adminNotes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                  rows={3}
                  placeholder="Add notes for the client..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                  <input
                    type="number"
                    value={editForm.estimatedCost}
                    onChange={(e) => setEditForm(prev => ({ ...prev, estimatedCost: e.target.value }))}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Timeline
                </label>
                <input
                  type="text"
                  value={editForm.estimatedTimeline}
                  onChange={(e) => setEditForm(prev => ({ ...prev, estimatedTimeline: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                  placeholder="e.g., 2-3 weeks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quote Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                  <input
                    type="number"
                    value={editForm.quoteAmount}
                    onChange={(e) => setEditForm(prev => ({ ...prev, quoteAmount: e.target.value }))}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expected Start Date
                </label>
                <input
                  type="date"
                  value={editForm.expectedStartDate}
                  onChange={(e) => setEditForm(prev => ({ ...prev, expectedStartDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={editForm.expectedDeliveryDate}
                  onChange={(e) => setEditForm(prev => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Terms
                </label>
                <textarea
                  value={editForm.paymentTerms}
                  onChange={(e) => setEditForm(prev => ({ ...prev, paymentTerms: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                  rows={2}
                  placeholder="e.g., 50% upfront, 50% upon completion"
                />
              </div>

              {/* Invoice Information */}
              {editForm.status === 'APPROVED' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Invoice Auto-Generation
                      </h3>
                      <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                        When you approve this request, an invoice will be automatically generated for the client with the quote amount.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {editForm.status === 'IN_PROGRESS' && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-orange-800 dark:text-orange-300">
                        Payment Required
                      </h3>
                      <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                        Work cannot start until the invoice is paid. Please ensure the client has paid the invoice before marking as IN_PROGRESS.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRequest}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  Update Request
                </button>
              </div>
            </div>
          </div>
        </div>
                   )}

             {/* Price Adjustment Modal */}
             {isPriceAdjustmentModalOpen && selectedRequest && (
               <PriceAdjustmentModal
                 isOpen={isPriceAdjustmentModalOpen}
                 onClose={() => {
                   setIsPriceAdjustmentModalOpen(false);
                   setSelectedRequest(null);
                 }}
                 requestId={selectedRequest.id}
                 currentAmount={selectedRequest.quoteAmount || 0}
                 onAdjustmentCreated={() => {
                   fetchRequests();
                 }}
               />
             )}

             {/* File Attachment Modal */}
             {isFileAttachmentModalOpen && selectedRequest && (
               <FileAttachmentModal
                 isOpen={isFileAttachmentModalOpen}
                 onClose={() => {
                   setIsFileAttachmentModalOpen(false);
                   setSelectedRequest(null);
                 }}
                 requestId={selectedRequest.id}
                 attachments={selectedRequest.attachments || []}
                 onAttachmentsUpdated={() => {
                   fetchRequests();
                 }}
               />
             )}
           </div>
         );
       }
