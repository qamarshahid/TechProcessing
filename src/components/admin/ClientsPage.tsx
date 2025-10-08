import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { Users, UserPlus, Edit3, Trash2, Mail, Calendar, CreditCard, User, X, Check, Phone, Building, MapPin, FileText, Shield, Send, UserCheck, Eye, Activity, Receipt, Pause, Play, RefreshCcw } from 'lucide-react';
import { SearchFilters } from './SearchFilters';
import { ChargeClientModal } from './ChargeClientModal';
import { ClientTransactionHistory } from './ClientTransactionHistory';
import { AddInvoiceModal } from './AddInvoiceModal';
import { EditClientModal } from './EditClientModal';
import { ClientCredentialsModal } from './ClientCredentialsModal';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import { logger } from '../../lib/logger';

export function ClientsPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    client: '',
    amount: '',
  });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
  });
  const [formError, setFormError] = useState('');
  const [creatingClient, setCreatingClient] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Client statuses state
  const [clientStatuses, setClientStatuses] = useState<{[key: string]: boolean}>({});
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchClients();
    
    // Listen for invoice changes to refresh client data
    const handleInvoiceChange = () => {
      logger.info('Invoice change detected, refreshing clients');
      fetchClients();
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

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, filters]);

  const fetchClients = async () => {
    try {
      // Fetch clients including inactive so soft-deleted users remain listed
      const response = await apiClient.getUsers({ role: 'CLIENT', includeInactive: true });
      // Double-check to ensure only CLIENT role users are shown
      const actualClients = response.users.filter(user => user.role === 'CLIENT');
      setClients(actualClients);
      // Sync local status map with server truth to avoid stale overrides
      const statusMap: Record<string, boolean> = {};
      actualClients.forEach((u: any) => {
        statusMap[u.id] = (u.is_active ?? u.isActive) as boolean;
      });
      setClientStatuses(statusMap);
      logger.info(`Fetched ${actualClients.length} clients with CLIENT role`);
    } catch (error) {
      logger.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchClients();
  };

  const filterClients = () => {
    let filtered = [...clients];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      const isActive = filters.status === 'ACTIVE';
      filtered = filtered.filter(client => {
        const current = clientStatuses[client.id] ?? client.is_active ?? client.isActive;
        return current === isActive;
      });
    }

    setFilteredClients(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      dateRange: '',
      client: '',
      amount: '',
    });
    setSearchTerm('');
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingClient(true);
    setFormError('');

    try {
      // Create both user account and client profile in one step
      const response = await apiClient.createUser({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password || '', // Password will be generated securely
        role: 'CLIENT',
        companyName: formData.company,
        address: formData.address ? {
          street: formData.address,
          city: '',
          state: '',
          postalCode: '',
          country: ''
        } : undefined,
        communicationDetails: [
          { type: 'EMAIL', subType: 'WORK', detail: formData.email },
          ...(formData.phone ? [{ type: 'PHONE', subType: 'WORK', detail: formData.phone }] : [])
        ]
      });
      
      // Reset form and hide modal
      setFormData({ fullName: '', email: '', password: '', phone: '', company: '', address: '', notes: '' });
      setShowCreateModal(false);
      showSuccess('Client created successfully', 'New client account has been created');
      fetchClients();
    } catch (err: any) {
      logger.error('Error creating client:', err);
      setFormError(err.message || 'Failed to create client');
      showError('Failed to create client', err.message);
    } finally {
      setCreatingClient(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const showClientHistory = (client: any) => {
    setSelectedClient(client);
    setShowHistoryModal(true);
  };

  const createInvoiceForClient = (client: any) => {
    setSelectedClient(client);
    setShowInvoiceModal(true);
  };

  const editClient = (client: any) => {
    navigate(`/admin/clients/${client.id}`);
  };

  const handleDeleteClick = (client: any) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const deleteClient = async (hardDelete: boolean) => {
    if (!clientToDelete) return;
    
    setIsDeleting(true);
    try {
      await apiClient.deleteUser(clientToDelete.id, hardDelete);
      const clientName = clientToDelete.full_name || clientToDelete.fullName;
      const actionType = hardDelete ? 'permanently deleted' : 'deactivated';
      showSuccess('Client Action Completed', `${clientName} has been ${actionType} successfully.`);
      // Immediate UI feedback: on soft delete, mark status inactive locally
      if (!hardDelete) {
        setClientStatuses(prev => ({
          ...prev,
          [clientToDelete.id]: false,
        }));
      }
      // On hard delete, optimistically remove from local list
      if (hardDelete) {
        setClients(prev => prev.filter(c => c.id !== clientToDelete.id));
      }
      fetchClients();
    } catch (error: any) {
      logger.error('Error deleting client:', error);
      const actionType = hardDelete ? 'permanently delete' : 'deactivate';
      showError('Action Failed', `Failed to ${actionType} client. Please try again.`);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setClientToDelete(null);
    }
  };

  const toggleClientStatus = async (client: any) => {
    try {
      const currentStatus = clientStatuses[client.id] ?? client.is_active ?? client.isActive;
      const newStatus = !currentStatus;
      await apiClient.updateUser(client.id, { isActive: newStatus });
      setClientStatuses(prev => ({
        ...prev,
        [client.id]: newStatus
      }));
      showSuccess(`Client ${newStatus ? 'activated' : 'deactivated'} successfully`);
      fetchClients();
    } catch (error) {
      logger.error('Error updating client status:', error);
      showError('Failed to update client status');
      // Still update UI even if API call fails (for demo purposes)
      const currentStatus = clientStatuses[client.id] ?? client.is_active ?? client.isActive;
      const newStatus = !currentStatus;
      setClientStatuses(prev => ({
        ...prev,
        [client.id]: newStatus
      }));
    }
  };

  const sendLoginCredentials = async (client: any) => {
    setSelectedClient(client);
    setShowCredentialsModal(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'CLIENT':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent1"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-fg">Client Management</h1>
          <p className="text-sm text-gray-600 dark:text-muted">Manage client accounts, invoices, and portal access</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-surface2 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            {isRefreshing ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                Refreshing
              </>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </button>
          <button 
            onClick={() => setShowChargeModal(true)}
            className="inline-flex items-center px-4 py-2 bg-accent600 text-fg rounded-lg hover:bg-accent700 transition-colors"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Charge Client
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-fg rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Client
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterOptions={{
          statuses: ['ACTIVE', 'INACTIVE'],
        }}
        placeholder="Search clients by name, email, or company..."
      />

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white dark:bg-surface rounded-lg shadow-sm border border-gray-200 dark:border-outline p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-fg" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-fg">{client.full_name || client.fullName}</h3>
                  {(client.company || client.companyName) && (
                    <p className="text-sm text-gray-600 dark:text-muted">{client.company || client.companyName}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  (clientStatuses[client.id] ?? client.is_active ?? client.isActive)
                    ? 'bg-accent100 text-accent800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {(clientStatuses[client.id] ?? client.is_active ?? client.isActive) ? 'ACTIVE' : 'INACTIVE'}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(client.role)}`}>
                  {client.role}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-muted">
                <Mail className="h-4 w-4 mr-2 text-muted dark:text-gray-500" />
                {client.email}
              </div>
              {client.phone && (
                <div className="flex items-center text-sm text-gray-600 dark:text-muted">
                  <Phone className="h-4 w-4 mr-2 text-muted dark:text-gray-500" />
                  {client.phone}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600 dark:text-muted">
                <Calendar className="h-4 w-4 mr-2 text-muted dark:text-gray-500" />
                Joined {new Date(client.created_at || client.createdAt).toLocaleDateString()}
              </div>
              {client.lastLogin && (
                <div className="flex items-center text-sm text-gray-600 dark:text-muted">
                  <UserCheck className="h-4 w-4 mr-2 text-muted dark:text-gray-500" />
                  Last login: {new Date(client.lastLogin).toLocaleDateString()}
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-600">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button 
                  onClick={() => showClientHistory(client)}
                  className="bg-blue-600 text-fg py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center"
                >
                  <Activity className="h-4 w-4 mr-1" />
                  History
                </button>
                <button 
                  onClick={() => createInvoiceForClient(client)}
                  className="bg-accent600 text-fg py-2 px-3 rounded-lg hover:bg-accent700 transition-colors text-sm flex items-center justify-center"
                >
                  <Receipt className="h-4 w-4 mr-1" />
                  Invoice
                </button>
              </div>
              
              <div className="flex space-x-1">
                <button 
                  onClick={() => editClient(client)}
                  className="flex-1 bg-blue-50 text-blue-700 py-2 px-2 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center justify-center"
                  title="Edit Client Profile"
                >
                  <User className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => sendLoginCredentials(client)}
                  className="flex-1 bg-purple-100 text-purple-700 py-2 px-2 rounded-lg hover:bg-purple-200 transition-colors text-sm flex items-center justify-center"
                  title="Set Portal Password"
                >
                  <Shield className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => toggleClientStatus(client)}
                  className={`flex-1 py-2 px-2 rounded-lg transition-colors text-sm flex items-center justify-center ${
                    (clientStatuses[client.id] ?? client.is_active ?? client.isActive)
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                      : 'bg-accent100 text-accent700 hover:bg-accent200'
                  }`}
                  title={(clientStatuses[client.id] ?? client.is_active ?? client.isActive) ? 'Deactivate' : 'Activate'}
                >
                  {(clientStatuses[client.id] ?? client.is_active ?? client.isActive) ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button 
                  onClick={() => handleDeleteClick(client)}
                  className="flex-1 bg-red-100 text-red-700 py-2 px-2 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center justify-center"
                  title="Delete Client"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="bg-white dark:bg-surface rounded-lg shadow-sm border border-gray-200 dark:border-outline p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-fg mb-4">Client Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{clients.length}</div>
              <div className="text-sm text-gray-600 dark:text-muted">Total Clients</div>
            </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent600">
              {clients.filter(c => clientStatuses[c.id] ?? c.is_active ?? c.isActive).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-muted">Active Accounts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {clients.filter(c => c.lastLogin && new Date(c.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-muted">Active This Month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {clients.filter(c => !c.lastLogin).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-muted">Never Logged In</div>
          </div>
        </div>
      </div>

      {/* Create Client Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-outline">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-outline">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                  <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-fg">Create New Client Account</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Create both client profile and portal access</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-muted dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
              </div>
            )}

            <form onSubmit={handleCreateClient} className="p-6 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Portal Access</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">This will create both a client profile and portal login access.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted dark:text-slate-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted dark:text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Portal Password (Optional)
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted dark:text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleFormChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="Leave blank for auto-generated"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">If blank, a temporary password will be generated</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted dark:text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted dark:text-slate-400" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleFormChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                    placeholder="ABC Company Inc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted dark:text-slate-400" />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    rows={2}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-muted dark:text-slate-400" />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows={2}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg placeholder-gray-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                    placeholder="Additional notes about this client..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-outline">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-surface2 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingClient}
                  className="px-6 py-2 bg-blue-600 dark:bg-blue-600 text-fg rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {creatingClient ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Create Client Account
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Invoice Modal for Selected Client */}
      <AddInvoiceModal 
        isOpen={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false);
          setSelectedClient(null);
        }}
        onInvoiceAdded={() => {
          console.log('Invoice created for client');
        }}
        preSelectedClientId={selectedClient?.id}
      />

      {/* Edit Client Modal */}
      {selectedClient && (
        <EditClientModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedClient(null);
          }}
          onClientUpdated={fetchClients}
          client={selectedClient}
        />
      )}

      {/* Client Credentials Modal */}
      {selectedClient && (
        <ClientCredentialsModal
          isOpen={showCredentialsModal}
          onClose={() => {
            setShowCredentialsModal(false);
            setSelectedClient(null);
          }}
          onCredentialsUpdated={fetchClients}
          client={selectedClient}
        />
      )}

      {/* Charge Client Modal */}
      <ChargeClientModal 
        isOpen={showChargeModal}
        onClose={() => setShowChargeModal(false)}
        onPaymentProcessed={() => {
          console.log('Payment processed successfully');
        }}
      />

      {/* Client Transaction History Modal */}
      {selectedClient && (
        <ClientTransactionHistory
          isOpen={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedClient(null);
          }}
          clientId={selectedClient.id}
          clientName={selectedClient.full_name || selectedClient.fullName}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setClientToDelete(null);
        }}
        onConfirm={deleteClient}
        title="Delete Client"
        message={`Are you sure you want to delete ${clientToDelete?.full_name || clientToDelete?.fullName}?`}
        entityName={clientToDelete?.full_name || clientToDelete?.fullName || 'Client'}
        entityType="client"
        isLoading={isDeleting}
      />
    </div>
  );
}