import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { useNotifications } from '../common/NotificationSystem';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { RefreshCw, Plus, Edit, Trash2, DollarSign, Calendar, User, Pause, Play, Save, X, Package, FileText } from 'lucide-react';
import { CreateSubscriptionModal } from './CreateSubscriptionModal';

export function SubscriptionsPage() {
  const { showSuccess, showError, showWarning } = useNotifications();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [frequencyFilter, setFrequencyFilter] = useState('ALL');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    amount: '',
    frequency: '',
    description: '',
    notes: '',
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  
  // Confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
    
    // Listen for subscription changes
    const handleSubscriptionChange = () => {
      fetchSubscriptions();
    };
    
    window.addEventListener('subscriptionCreated', handleSubscriptionChange);
    window.addEventListener('subscriptionUpdated', handleSubscriptionChange);
    
    return () => {
      window.removeEventListener('subscriptionCreated', handleSubscriptionChange);
      window.removeEventListener('subscriptionUpdated', handleSubscriptionChange);
    };
  }, []);

  // Filter subscriptions when search term or filters change
  useEffect(() => {
    let filtered = subscriptions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(subscription =>
        subscription.client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.client?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.client?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.servicePackage?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(subscription => subscription.status === statusFilter);
    }

    // Apply frequency filter
    if (frequencyFilter !== 'ALL') {
      filtered = filtered.filter(subscription => subscription.frequency === frequencyFilter);
    }

    // Sort by status priority (ACTIVE first, then PAUSED, then CANCELLED)
    filtered.sort((a, b) => {
      const statusPriority = { ACTIVE: 0, PAUSED: 1, CANCELLED: 2 };
      const aPriority = statusPriority[a.status] ?? 3;
      const bPriority = statusPriority[b.status] ?? 3;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // If same status, sort by creation date (newest first)
      return new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime();
    });

    setFilteredSubscriptions(filtered);
  }, [subscriptions, searchTerm, statusFilter, frequencyFilter]);

  const fetchSubscriptions = async () => {
    try {
      const response = await apiClient.getSubscriptions();
      console.log('Subscriptions response:', response);
      setSubscriptions(response.subscriptions || []);
      showSuccess('Subscriptions Loaded', `Successfully loaded ${response.subscriptions?.length || 0} subscriptions.`);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      showError('Failed to Load Subscriptions', 'Unable to load subscriptions. Please try again later.');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubscription = async (subscriptionId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
      
      await apiClient.updateSubscriptionStatus(subscriptionId, newStatus);
      await fetchSubscriptions();
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Failed to update subscription status. Please try again.');
    }
  };

  const handleDeleteClick = (subscription: any) => {
    setSubscriptionToDelete(subscription);
    setShowDeleteModal(true);
  };

  const cancelSubscription = async () => {
    if (!subscriptionToDelete) return;
    
    const currentStatus = subscriptionToDelete.status;
    const actionText = currentStatus === 'ACTIVE' ? 'cancel' : 'permanently delete';
    
    setIsDeleting(true);
    try {
      if (currentStatus === 'ACTIVE' || currentStatus === 'PAUSED') {
        // Cancel the subscription (set status to CANCELLED)
        await apiClient.updateSubscriptionStatus(subscriptionToDelete.id, 'CANCELLED');
        showSuccess('Subscription Cancelled', 'Subscription has been cancelled successfully.');
      } else {
        // Actually delete the subscription if it's already cancelled
        await apiClient.deleteSubscription(subscriptionToDelete.id);
        showSuccess('Subscription Deleted', 'Subscription has been permanently deleted.');
      }
      await fetchSubscriptions();
    } catch (error) {
      console.error(`Error ${actionText}ing subscription:`, error);
      showError('Operation Failed', `Failed to ${actionText} subscription. Please try again.`);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSubscriptionToDelete(null);
    }
  };

  const editSubscription = (subscription: any) => {
    setSelectedSubscription(subscription);
    setEditFormData({
      amount: subscription.amount?.toString() || '0',
      frequency: subscription.frequency || 'MONTHLY',
      description: subscription.description || '',
      notes: subscription.notes || subscription.metadata?.notes || '',
    });
    setEditError('');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');

    try {
      const updateData = {
        amount: parseFloat(editFormData.amount),
        frequency: editFormData.frequency,
        description: editFormData.description,
        metadata: {
          notes: editFormData.notes,
        },
      };

      await apiClient.updateSubscription(selectedSubscription.id, updateData);
      await fetchSubscriptions();
      setShowEditModal(false);
      setSelectedSubscription(null);
    } catch (error: any) {
      console.error('Error updating subscription:', error);
      setEditError(error.message || 'Failed to update subscription. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'MONTHLY':
        return 'Monthly';
      case 'QUARTERLY':
        return 'Quarterly';
      case 'YEARLY':
        return 'Yearly';
      default:
        return frequency || 'Monthly';
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

  const getClientName = (subscription: any): string => {
    return subscription.client?.fullName || 
           subscription.client?.full_name || 
           subscription.client_name || 
           subscription.clientName || 
           'Unknown Client';
  };

  const getServiceName = (subscription: any): string => {
    return subscription.servicePackage?.name || 
           subscription.service_package?.name || 
           subscription.service_name || 
           subscription.serviceName || 
           subscription.description || 
           'Custom Service';
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription Billing</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Manage recurring monthly services</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchSubscriptions}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Subscription
          </button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by client name, email, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          
          {/* Frequency Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Frequency
            </label>
            <select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            >
              <option value="ALL">All Frequencies</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSubscriptions.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            {subscriptions.length === 0 ? 'No subscriptions found' : 'No subscriptions match your search criteria'}
          </div>
        ) : (
          filteredSubscriptions.map((subscription) => (
          <div key={subscription.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{getServiceName(subscription)}</h3>
                  <div className="flex items-center text-green-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-bold">{parseFloat(subscription.amount || '0').toLocaleString()}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/{getFrequencyText(subscription.frequency).toLowerCase()}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(subscription.status)}`}>
                {subscription.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <User className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                {getClientName(subscription)}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Next Billing:</span>
                <span className="text-gray-900 dark:text-white">{formatDate(subscription.nextBillingDate || subscription.next_billing_date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Started:</span>
                <span className="text-gray-900 dark:text-white">{formatDate(subscription.startDate || subscription.start_date || subscription.createdAt || subscription.created_at)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total Billed:</span>
                <span className="text-gray-900 dark:text-white">${parseFloat(subscription.totalBilled || subscription.total_billed || '0').toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => toggleSubscription(subscription.id, subscription.status)}
                className={`flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center text-sm ${
                  subscription.status === 'ACTIVE' 
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {subscription.status === 'ACTIVE' ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </>
                )}
              </button>
              <button 
                onClick={() => editSubscription(subscription)}
                className="px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Subscription"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                                  onClick={() => handleDeleteClick(subscription)}
                className={`px-3 py-2 rounded-lg transition-colors ${
                  subscription.status === 'CANCELLED' 
                    ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
                    : 'text-orange-600 hover:text-orange-800 hover:bg-orange-50'
                }`}
                title={subscription.status === 'CANCELLED' ? 'Permanently Delete' : 'Cancel Subscription'}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Empty State */}
      {subscriptions.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Subscriptions</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first subscription to get started with recurring billing.</p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Subscription
          </button>
        </div>
      )}

      {/* Create Subscription Modal */}
      <CreateSubscriptionModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubscriptionCreated={fetchSubscriptions}
      />

      {/* Edit Subscription Modal */}
      {showEditModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-600">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                  <Edit className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Subscription</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{getClientName(selectedSubscription)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              {editError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{editError}</p>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Client Information</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">{getClientName(selectedSubscription)}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="number"
                      value={editFormData.amount}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, amount: e.target.value }))}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      value={editFormData.frequency}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, frequency: e.target.value }))}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={3}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Subscription description"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Additional notes about this subscription..."
                  />
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Subscription Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="ml-2 text-gray-900">{selectedSubscription.status}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Started:</span>
                    <span className="ml-2 text-gray-900">{formatDate(selectedSubscription.startDate || selectedSubscription.start_date || selectedSubscription.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Next Billing:</span>
                    <span className="ml-2 text-gray-900">{formatDate(selectedSubscription.nextBillingDate || selectedSubscription.next_billing_date)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Total Billed:</span>
                    <span className="ml-2 text-gray-900">${parseFloat(selectedSubscription.totalBilled || selectedSubscription.total_billed || '0').toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {editLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Subscription
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSubscriptionToDelete(null);
        }}
        onConfirm={cancelSubscription}
        title={subscriptionToDelete?.status === 'CANCELLED' ? 'Delete Subscription' : 'Cancel Subscription'}
        message={
          subscriptionToDelete?.status === 'CANCELLED' 
            ? `Are you sure you want to permanently delete the subscription for ${subscriptionToDelete?.client?.fullName || 'Unknown Client'}? This action cannot be undone and will permanently remove the subscription from the system.`
            : `Are you sure you want to cancel the subscription for ${subscriptionToDelete?.client?.fullName || 'Unknown Client'}? It will be moved to cancelled status but kept for records.`
        }
        confirmText={subscriptionToDelete?.status === 'CANCELLED' ? 'Delete Subscription' : 'Cancel Subscription'}
        cancelText="Cancel"
        type={subscriptionToDelete?.status === 'CANCELLED' ? 'danger' : 'warning'}
        isLoading={isDeleting}
      />
    </div>
  );
}