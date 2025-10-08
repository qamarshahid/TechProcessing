import React, { useState, useEffect } from 'react';
import { X, FileText, User, DollarSign, Calendar, Package, CreditCard, Plus, UserPlus } from 'lucide-react';
import { apiClient } from '../../lib/api';

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvoiceAdded: () => void;
  preSelectedClientId?: string;
  preSelectedService?: any;
}

export function AddInvoiceModal({ isOpen, onClose, onInvoiceAdded, preSelectedClientId, preSelectedService }: AddInvoiceModalProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [showCreateClient, setShowCreateClient] = useState(false);
  const [newClientData, setNewClientData] = useState({
    fullName: '',
    email: '',
    company: '',
  });
  const [creatingClient, setCreatingClient] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    servicePackageId: '',
    description: '',
    amount: '',
    tax: '',
    dueDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchClients();
      fetchServices();
      if (preSelectedClientId) {
        setFormData(prev => ({
          ...prev,
          clientId: preSelectedClientId
        }));
      }
      if (preSelectedService) {
        setFormData(prev => ({
          ...prev,
          servicePackageId: preSelectedService.id,
          amount: preSelectedService.price.toString(),
          description: preSelectedService.name
        }));
      }
    }
  }, [isOpen, preSelectedClientId, preSelectedService]);

  const fetchClients = async () => {
    try {
      const response = await apiClient.getUsers({ role: 'CLIENT' });
      const clientUsers = response.users.filter(user => user.role === 'CLIENT');
      setClients(clientUsers);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await apiClient.getServices();
      setServices(response.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServices([]);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingClient(true);
    setError('');

    try {
      const response = await apiClient.createUser({
        email: newClientData.email,
        password: '', // Password will be generated securely
        fullName: newClientData.fullName,
        role: 'CLIENT',
      });

      // Add the new client to the list
      const newClient = {
        id: response.user.id,
        full_name: newClientData.fullName,
        fullName: newClientData.fullName,
        email: newClientData.email,
        company: newClientData.company,
        role: 'CLIENT'
      };
      
      setClients(prev => [newClient, ...prev]);
      
      // Select the new client
      setFormData(prev => ({
        ...prev,
        clientId: newClient.id
      }));
      
      // Reset and hide create client form
      setNewClientData({ fullName: '', email: '', company: '' });
      setShowCreateClient(false);
    } catch (err: any) {
      setError(err.message || 'Failed to create client');
    } finally {
      setCreatingClient(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const invoiceData = {
        clientId: formData.clientId,
        servicePackageId: formData.servicePackageId || undefined,
        description: formData.description,
        amount: parseFloat(formData.amount),
        tax: formData.tax ? parseFloat(formData.tax) : 0,
        dueDate: formData.dueDate,
        notes: formData.notes || undefined,
      };

      console.log('Creating invoice with data:', invoiceData);
      const result = await apiClient.createInvoice(invoiceData);
      console.log('Invoice created:', result);
      
      onInvoiceAdded();
      onClose();
      setFormData({
        clientId: '',
        servicePackageId: '',
        description: '',
        amount: '',
        tax: '',
        dueDate: '',
        notes: '',
      });
      setShowCreateClient(false);
      setNewClientData({ fullName: '', email: '', company: '' });
    } catch (err: any) {
      console.error('Error creating invoice:', err);
      setError(err.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill amount when service is selected
    if (name === 'servicePackageId' && value) {
      const selectedService = services.find(s => s.id === value);
      if (selectedService) {
        setFormData(prev => ({
          ...prev,
          amount: selectedService.price.toString(),
          description: selectedService.name
        }));
      }
    }
  };

  const handleNewClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewClientData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  const calculateTotal = () => {
    const amount = parseFloat(formData.amount) || 0;
    const tax = parseFloat(formData.tax) || 0;
    return amount + tax;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-surface rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-600">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-fg">Create New Invoice</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-gray-600 dark:hover:text-muted transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                Client *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted dark:text-gray-500" />
                <select
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors bg-white dark:bg-surface2 text-gray-900 dark:text-fg"
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.full_name || client.fullName} ({client.email})
                    </option>
                  ))}
                  <option value="__create_new__" className="font-semibold text-blue-600">
                    + Create New Client
                  </option>
                </select>
              </div>
              
              {/* Show create client form when "Create New Client" is selected */}
              {(formData.clientId === '__create_new__' || showCreateClient) && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center mb-3">
                    <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Create New Client</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        name="fullName"
                        value={newClientData.fullName}
                        onChange={handleNewClientChange}
                        placeholder="Full Name *"
                        required
                        className="w-full px-3 py-2 border border-blue-200 dark:border-blue-700 bg-white dark:bg-surface2 text-gray-900 dark:text-fg rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        value={newClientData.email}
                        onChange={handleNewClientChange}
                        placeholder="Email Address *"
                        required
                        className="w-full px-3 py-2 border border-blue-200 dark:border-blue-700 bg-white dark:bg-surface2 text-gray-900 dark:text-fg rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="company"
                        value={newClientData.company}
                        onChange={handleNewClientChange}
                        placeholder="Company (Optional)"
                        className="w-full px-3 py-2 border border-blue-200 dark:border-blue-700 bg-white dark:bg-surface2 text-gray-900 dark:text-fg rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handleCreateClient}
                        disabled={creatingClient || !newClientData.fullName || !newClientData.email}
                        className="flex-1 bg-blue-600 dark:bg-blue-500 text-fg py-2 px-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {creatingClient ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Create
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCreateClient(false);
                          setFormData(prev => ({ ...prev, clientId: '' }));
                          setNewClientData({ fullName: '', email: '', company: '' });
                        }}
                        className="px-3 py-2 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-muted bg-white dark:bg-surface2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {clients.length === 0 && !showCreateClient && formData.clientId !== '__create_new__' && (
                <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    No clients found. 
                    <button
                      type="button"
                      onClick={() => setShowCreateClient(true)}
                      className="ml-1 font-semibold text-yellow-900 dark:text-yellow-200 hover:text-yellow-700 dark:hover:text-yellow-100 underline"
                    >
                      Create your first client
                    </button>
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                Service Package (Optional)
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted dark:text-gray-500" />
                <select
                  name="servicePackageId"
                  value={formData.servicePackageId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-surface2 text-gray-900 dark:text-fg rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                >
                  <option value="">Select a service (optional)</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </option>
                  ))}
                </select>
              </div>
              
              {services.length === 0 && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-surface2 border border-gray-200 dark:border-slate-600 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-muted">
                    No service packages available. You can still create a custom invoice.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-surface2 text-gray-900 dark:text-fg rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Enter invoice description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted dark:text-gray-500" />
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-surface2 text-gray-900 dark:text-fg rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                Tax (Optional)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted dark:text-gray-500" />
                <input
                  type="number"
                  name="tax"
                  value={formData.tax}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-surface2 text-gray-900 dark:text-fg rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                Total
              </label>
              <div className="w-full px-4 py-3 bg-gray-50 dark:bg-surface2 border border-gray-200 dark:border-slate-600 rounded-lg text-gray-900 dark:text-fg font-semibold">
                ${calculateTotal().toFixed(2)}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
              Due Date *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted dark:text-gray-500" />
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-surface2 text-gray-900 dark:text-fg rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-muted mt-1">
              Due date must be today or later
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-surface2 text-gray-900 dark:text-fg rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Additional notes or payment instructions"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-muted bg-white dark:bg-surface2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.clientId === '__create_new__'}
              className="flex-1 px-4 py-3 bg-blue-600 dark:bg-blue-500 text-fg rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Create Invoice'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}