import React, { useState, useEffect } from 'react';
import { X, CreditCard, User, DollarSign, Lock, Calendar, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { apiClient } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../common/NotificationSystem';

interface AgentChargeCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentProcessed: () => void;
}

export function AgentChargeCardModal({ isOpen, onClose, onPaymentProcessed }: AgentChargeCardModalProps) {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    amount: '',
    description: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
    sendReceipt: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: Client Info, 2: Card Details, 3: Confirmation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const paymentData = {
        type: 'agent_direct',
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        amount: parseFloat(formData.amount),
        method: 'CARD',
        cardDetails: {
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          cardholderName: formData.cardholderName,
          billingAddress: formData.billingAddress,
        },
        notes: formData.description,
        metadata: {
          sendReceipt: formData.sendReceipt,
          chargedBy: 'agent',
          agentId: user?.id,
        },
      };

      const result = await apiClient.chargeCard(paymentData);
      
      if (result.success) {
        setSuccess(`Payment of $${parseFloat(formData.amount).toLocaleString()} processed successfully!`);
        onPaymentProcessed();
        setTimeout(() => {
          onClose();
          resetForm();
        }, 2000);
      } else {
        setError(result.error || 'Payment failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientEmail: '',
      amount: '',
      description: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      billingAddress: {
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
      },
      sendReceipt: true,
    });
    setError('');
    setSuccess('');
    setStep(1);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.clientName || !formData.clientEmail || !formData.amount) {
        setError('Please fill in all required fields');
        return;
      }
      if (parseFloat(formData.amount) <= 0) {
        setError('Amount must be greater than 0');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
        setError('Please fill in all card details');
        return;
      }
      setError('');
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('billingAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value
        }
      }));
    } else if (e.target.type === 'checkbox') {
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

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData(prev => ({
      ...prev,
      expiryDate: formatted
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-600">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
              <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Agent Card Charge</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Step {step} of 3</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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

          {success && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          {/* Step 1: Client Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Agent Direct Charge
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      Charge any client's card directly as an agent
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Enter client name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Client Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="email"
                      name="clientEmail"
                      value={formData.clientEmail}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="Enter client email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Amount *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Payment description"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Card Information */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Secure Card Processing
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      All card information is encrypted and processed securely through Authorize.Net
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Name on card"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Card Number *
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    required
                    maxLength={19}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Expiry Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleExpiryChange}
                      required
                      maxLength={5}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="MM/YY"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CVV *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                      maxLength={4}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors placeholder-gray-500 dark:placeholder-gray-400"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Billing Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="billingAddress.firstName"
                    value={formData.billingAddress.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    name="billingAddress.lastName"
                    value={formData.billingAddress.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Last Name"
                  />
                  <input
                    type="text"
                    name="billingAddress.address"
                    value={formData.billingAddress.address}
                    onChange={handleChange}
                    className="md:col-span-2 w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Street Address"
                  />
                  <input
                    type="text"
                    name="billingAddress.city"
                    value={formData.billingAddress.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    name="billingAddress.state"
                    value={formData.billingAddress.state}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="State"
                  />
                  <input
                    type="text"
                    name="billingAddress.zipCode"
                    value={formData.billingAddress.zipCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="ZIP Code"
                  />
                  <select
                    name="billingAddress.country"
                    value={formData.billingAddress.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="sendReceipt"
                    checked={formData.sendReceipt}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-slate-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Send receipt via email</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                      Ready to Process Payment
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      Please review the details below before processing the payment
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Payment Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Client:</span>
                    <span className="text-gray-900 dark:text-white">{formData.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="text-gray-900 dark:text-white">{formData.clientEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="text-xl font-bold text-green-600 dark:text-green-400">
                      ${parseFloat(formData.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Card:</span>
                    <span className="text-gray-900 dark:text-white">
                      **** **** **** {formData.cardNumber.slice(-4)}
                    </span>
                  </div>
                  {formData.description && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Description:</span>
                      <span className="text-gray-900 dark:text-white">{formData.description}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 dark:text-yellow-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                      Confirm Payment Processing
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                      <p>This will immediately charge the card for ${parseFloat(formData.amount).toLocaleString()}. This action cannot be undone.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-3 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors font-medium"
                >
                  Previous
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                Cancel
              </button>
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Process Payment'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}