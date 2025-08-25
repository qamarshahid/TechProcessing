import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Agent, AgentSale } from '../../types';
import { X, DollarSign, User, FileText, Calendar, Phone, Mail, AlertTriangle } from 'lucide-react';

interface ResubmitSaleModalProps {
  originalSale: AgentSale;
  onClose: () => void;
  onSuccess: (sale: any) => void;
}

export function ResubmitSaleModal({ originalSale, onClose, onSuccess }: ResubmitSaleModalProps) {
  const { user } = useAuth();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields - pre-populated with original sale data
  const [clientName, setClientName] = useState(originalSale.clientName);
  const [clientEmail, setClientEmail] = useState(originalSale.clientEmail);
  const [clientPhone, setClientPhone] = useState(originalSale.clientPhone || '');
  const [closerName, setCloserName] = useState(originalSale.closerName);
  const [serviceName, setServiceName] = useState(originalSale.serviceName);
  const [serviceDescription, setServiceDescription] = useState(originalSale.serviceDescription || '');
  const [saleAmount, setSaleAmount] = useState(originalSale.saleAmount.toString());
  const [saleDate, setSaleDate] = useState(originalSale.saleDate ? new Date(originalSale.saleDate).toISOString().split('T')[0] : '');
  const [paymentDate, setPaymentDate] = useState(originalSale.paymentDate ? new Date(originalSale.paymentDate).toISOString().split('T')[0] : '');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAgentProfile();
  }, []);

  const fetchAgentProfile = async () => {
    try {
      const agentData = await apiClient.getOwnAgentProfile();
      setAgent(agentData);
    } catch (err: any) {
      console.error('Error fetching agent profile:', err);
      setError('Failed to load agent profile');
    }
  };

  const calculateCommission = () => {
    if (!agent || !saleAmount) return { agentCommission: 0 };
    
    const amount = parseFloat(saleAmount);
    const agentCommission = (amount * agent.agentCommissionRate) / 100;
    
    return { agentCommission };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agent) {
      setError('Agent profile not found');
      return;
    }

    if (!clientName.trim() || !clientEmail.trim() || !closerName.trim() || !serviceName.trim() || !saleAmount.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(saleAmount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid sale amount');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const resubmitData = {
        originalSaleId: originalSale.id,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        clientPhone: clientPhone.trim() || undefined,
        closerName: closerName.trim(),
        serviceName: serviceName.trim(),
        serviceDescription: serviceDescription.trim() || undefined,
        saleAmount: amount,
        saleDate: saleDate || undefined,
        paymentDate: paymentDate || undefined,
        notes: notes.trim() || undefined,
      };

      const resubmittedSale = await apiClient.resubmitAgentSale(resubmitData);
      onSuccess(resubmittedSale);
      onClose();
    } catch (err: any) {
      console.error('Error resubmitting sale:', err);
      setError(err.message || 'Failed to resubmit sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const { agentCommission } = calculateCommission();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Resubmit Sale</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Original Sale: {originalSale.saleReference}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Warning */}
        <div className="mx-6 mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Please make the necessary changes to address the rejection feedback. All changes will be tracked and visible to the admin.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Client Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Client Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter client name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Email *
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter client email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Phone
                </label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter client phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Closer Name *
                </label>
                <input
                  type="text"
                  value={closerName}
                  onChange={(e) => setCloserName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter closer name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Service Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Service Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter service name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Description
                </label>
                <textarea
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter service description"
                />
              </div>
            </div>
          </div>

          {/* Sale Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Sale Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sale Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
                  <input
                    type="number"
                    value={saleAmount}
                    onChange={(e) => setSaleAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sale Date
                </label>
                <input
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Commission Preview */}
          {agent && saleAmount && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">Your Commission Preview</h4>
              <div className="text-sm">
                <div>
                  <span className="text-blue-600 dark:text-blue-300">Your Commission ({agent.agentCommissionRate}%):</span>
                  <span className="block font-medium text-blue-800 dark:text-blue-200 text-lg">
                    ${agentCommission.toFixed(2)}
                  </span>
                </div>
                <div className="mt-2 text-xs text-blue-600 dark:text-blue-300">
                  Note: Closer commission will be calculated separately and managed by admin.
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (Explain the changes made)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Explain what changes you made to address the rejection feedback..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Resubmitting...' : 'Resubmit Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
