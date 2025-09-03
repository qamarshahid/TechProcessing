import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { X, DollarSign, Calendar, User, FileText, Mail, Phone, CreditCard, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Client {
  id: string;
  fullName: string;
  email: string;
}

interface CreatePaymentLinkModalProps {
  onClose: () => void;
  onSuccess: (paymentLink: any) => void;
}

export function CreatePaymentLinkModal({ onClose, onSuccess }: CreatePaymentLinkModalProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [clientId, setClientId] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    title: '',
    description: '',
    amount: '',
    expiresAt: '',
    sendEmail: true,
    sendSMS: false,
    allowPartialPayment: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isNewClient, setIsNewClient] = useState(false);

  useEffect(() => {
    if (user) {
      fetchClients();
    }
    // Set default expiration to 30 days from now
    const defaultExpiry = new Date();
    defaultExpiry.setDate(defaultExpiry.getDate() + 30);
    setExpiresAt(defaultExpiry.toISOString().split('T')[0]);
  }, [user]);

  const fetchClients = async () => {
    try {
      console.log('Fetching clients...');
      const response = await apiClient.getUsers({ role: 'CLIENT' });
      console.log('Clients response:', response);
      const clientList = response.users || [];
      console.log('Client list:', clientList);
      setClients(Array.isArray(clientList) ? clientList : []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.amount.trim() || !formData.expiresAt) {
      setError('Please fill in all required fields');
      return;
    }

    if (isNewClient && (!formData.clientName.trim() || !formData.clientEmail.trim())) {
      setError('Please provide client name and email for new client');
      return;
    }

    if (!isNewClient && !formData.clientId) {
      setError('Please select a client or choose to create a new one');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const paymentLinkData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        expiresAt: new Date(formData.expiresAt).toISOString(),
        allowPartialPayment: formData.allowPartialPayment,
        metadata: {
          sendEmail: formData.sendEmail,
          sendSMS: formData.sendSMS,
          createdBy: user?.id,
          ...(isNewClient && {
            newClient: {
              name: formData.clientName,
              email: formData.clientEmail,
              phone: formData.clientPhone,
            }
          })
        },
        ...(isNewClient ? {
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhone: formData.clientPhone,
        } : {
          clientId: formData.clientId,
        })
      };
      
      const paymentLink = await apiClient.createPaymentLink(paymentLinkData);

      onSuccess(paymentLink);
    } catch (error: any) {
      console.error('Error creating payment link:', error);
      setError(error.message || 'Failed to create payment link');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (e.target.type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-600">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg mr-3">
              <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create Payment Link</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Generate secure payment link for anyone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Client Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Client Information
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!isNewClient}
                    onChange={() => setIsNewClient(false)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Existing Client</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={isNewClient}
                    onChange={() => setIsNewClient(true)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">New Client</span>
                </label>
              </div>

              {!isNewClient ? (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <select
                    name="clientId"
                    value={formData.clientId}
                    onChange={handleChange}
                    className="pl-10 w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select existing client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.fullName} ({client.email})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Client full name *"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Client email *"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <input
                      type="tel"
                      name="clientPhone"
                      value={formData.clientPhone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Client phone (optional)"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter payment link title"
                className="pl-10 w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter payment link description (optional)"
              rows={3}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount *
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className="pl-10 w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Expiration Date */}
          <div>
            <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expires At *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="date"
                id="expiresAt"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="pl-10 w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Options</h3>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="allowPartialPayment"
                  checked={formData.allowPartialPayment}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Allow partial payments</span>
              </label>
            </div>
          </div>

          {/* Notification Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Notification Options</h3>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="sendEmail"
                  checked={formData.sendEmail}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Send email notification</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="sendSMS"
                  checked={formData.sendSMS}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Send SMS notification</span>
              </label>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Secure Payment Processing
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  All payments are processed securely through Authorize.Net with bank-grade encryption.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Payment Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}