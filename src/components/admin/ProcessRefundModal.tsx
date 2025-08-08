import React, { useState, useEffect } from 'react';
import { X, RotateCcw, User, DollarSign, FileText, CreditCard } from 'lucide-react';
import { apiClient } from '../../lib/api';

interface ProcessRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefundProcessed: () => void;
}

export function ProcessRefundModal({ isOpen, onClose, onRefundProcessed }: ProcessRefundModalProps) {
  const [payments, setPayments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    paymentId: '',
    refundAmount: '',
    reason: '',
    notes: '',
  });
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchPayments();
    }
  }, [isOpen]);

  const fetchPayments = async () => {
    try {
      const response = await apiClient.getCompletedPayments();
      setPayments(response.payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const refundData = {
        paymentId: formData.paymentId,
        refundAmount: parseFloat(formData.refundAmount),
        reason: formData.reason,
        notes: formData.notes,
      };

      await apiClient.processRefund(refundData);
      onRefundProcessed();
      onClose();
      setFormData({
        paymentId: '',
        refundAmount: '',
        reason: '',
        notes: '',
      });
      setSelectedPayment(null);
    } catch (err: any) {
      setError(err.message || 'Failed to process refund');
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

    // Auto-fill refund amount when payment is selected
    if (name === 'paymentId' && value) {
      const payment = payments.find(p => p.id === value);
      if (payment) {
        setSelectedPayment(payment);
        setFormData(prev => ({
          ...prev,
          refundAmount: payment.amount.toString()
        }));
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <RotateCcw className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Process Refund</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Payment to Refund *
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                name="paymentId"
                value={formData.paymentId}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a completed payment</option>
                {payments.map(payment => (
                  <option key={payment.id} value={payment.id}>
                    {payment.client_name} - ${payment.amount} ({new Date(payment.created_at).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedPayment && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Client:</span>
                  <span className="ml-2 text-gray-900">{selectedPayment.client_name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Amount:</span>
                  <span className="ml-2 text-gray-900">${selectedPayment.amount}</span>
                </div>
                <div>
                  <span className="text-gray-500">Method:</span>
                  <span className="ml-2 text-gray-900">{selectedPayment.method}</span>
                </div>
                <div>
                  <span className="text-gray-500">Date:</span>
                  <span className="ml-2 text-gray-900">{new Date(selectedPayment.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  name="refundAmount"
                  value={formData.refundAmount}
                  onChange={handleChange}
                  required
                  min="0"
                  max={selectedPayment?.amount || undefined}
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
              {selectedPayment && (
                <p className="text-sm text-gray-500 mt-1">
                  Maximum: ${selectedPayment.amount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason *
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a reason</option>
                <option value="Customer Request">Customer Request</option>
                <option value="Service Not Delivered">Service Not Delivered</option>
                <option value="Billing Error">Billing Error</option>
                <option value="Duplicate Payment">Duplicate Payment</option>
                <option value="Quality Issues">Quality Issues</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes about this refund..."
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <RotateCcw className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Refund Processing
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Refunds will be processed back to the original payment method. Processing time may vary depending on the payment provider.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Process Refund'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}