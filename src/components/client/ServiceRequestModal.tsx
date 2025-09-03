import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { 
  X, 
  Package, 
  DollarSign, 
  FileText, 
  Calendar, 
  Send,
  AlertCircle,
  CheckCircle,
  User,
  Target,
  Sparkles
} from 'lucide-react';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onServiceRequested: () => void;
  selectedService?: any;
}

export function ServiceRequestModal({ 
  isOpen, 
  onClose, 
  onServiceRequested, 
  selectedService 
}: ServiceRequestModalProps) {
  const { user } = useAuth();
  const { showError, showSuccess } = useNotifications();
  
  const [formData, setFormData] = useState({
    serviceId: '',
    description: '',
    budget: '',
    timeline: '',
    additionalRequirements: '',
    isCustomQuote: false,
    requestType: 'SERVICE_REQUEST'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedService) {
      setFormData(prev => ({
        ...prev,
        serviceId: selectedService.id,
        description: `Request for ${selectedService.name}`,
        isCustomQuote: false,
        requestType: 'SERVICE_REQUEST'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        serviceId: '',
        description: '',
        isCustomQuote: true,
        requestType: 'CUSTOM_QUOTE'
      }));
    }
  }, [selectedService]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.budget && parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        serviceId: formData.serviceId || undefined,
        description: formData.description.trim(),
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        timeline: formData.timeline.trim() || undefined,
        additionalRequirements: formData.additionalRequirements.trim() || undefined,
        isCustomQuote: formData.isCustomQuote,
        requestType: formData.requestType,
      };

      await apiClient.createServiceRequest(requestData);
      
      showSuccess(
        'Service Request Submitted', 
        'Your request has been submitted successfully. We will review it and get back to you soon.'
      );
      
      // Reset form
      setFormData({
        serviceId: '',
        description: '',
        budget: '',
        timeline: '',
        additionalRequirements: '',
        isCustomQuote: false,
        requestType: 'SERVICE_REQUEST'
      });
      setErrors({});
      
      onServiceRequested();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit service request';
      logger.error('Error creating service request:', error);
      showError('Request Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 dark:from-blue-900/20 to-indigo-50 dark:to-indigo-900/20">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4 shadow-xl">
              {selectedService ? <Package className="h-6 w-6 text-white" /> : <Target className="h-6 w-6 text-white" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedService ? 'Request Service' : 'Custom Quote Request'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedService ? selectedService.name : 'Tell us about your custom project'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Selected Service Info */}
            {selectedService && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Selected Service</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">{selectedService.name} - ${selectedService.price?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Quote Info */}
            {!selectedService && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Custom Quote Request</h3>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">Describe your project and we'll provide a tailored solution</p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Description *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-none ${
                    errors.description ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-slate-600'
                  }`}
                  rows={4}
                  placeholder={selectedService 
                    ? `Describe your requirements for ${selectedService.name}...`
                    : "Describe your custom project requirements in detail..."
                  }
                />
              </div>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Budget and Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                      errors.budget ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.budget}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Timeline (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                    placeholder="e.g., 2-3 weeks, ASAP, etc."
                  />
                </div>
              </div>
            </div>

            {/* Additional Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Requirements (Optional)
              </label>
              <textarea
                value={formData.additionalRequirements}
                onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white resize-none"
                rows={3}
                placeholder="Any specific requirements, preferences, or constraints..."
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">What Happens Next?</h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 mt-2 space-y-1">
                    <li>• Our team will review your request within 24 hours</li>
                    <li>• We'll provide a detailed quote and timeline</li>
                    <li>• You can approve, request changes, or ask questions</li>
                    <li>• Work begins once the quote is approved</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-emerald-500/25"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}