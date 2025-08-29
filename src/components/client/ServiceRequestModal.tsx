import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { X, Send, AlertCircle, Upload, Paperclip, File } from 'lucide-react';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    name: string;
    description: string;
    price: number;
  };
  onRequestSubmitted?: () => void;
}

export function ServiceRequestModal({ 
  isOpen, 
  onClose, 
  service, 
  onRequestSubmitted 
}: ServiceRequestModalProps) {
  const { user } = useAuth();
  const { showError, showSuccess } = useNotifications();
  
  const [formData, setFormData] = useState({
    description: '',
    budget: '',
    timeline: '',
    additionalRequirements: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required';
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

    if (!user?.id) {
      showError('Authentication Error', 'Please log in to submit a service request.');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        serviceId: service.id,
        clientId: user.id,
        description: formData.description.trim(),
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        timeline: formData.timeline.trim() || undefined,
        additionalRequirements: formData.additionalRequirements.trim() || undefined,
      };

      await apiClient.createServiceRequest(requestData);
      
      showSuccess(
        'Request Submitted', 
        `Your request for "${service.name}" has been submitted successfully. We'll review it and get back to you soon.`
      );
      
      // Reset form
      setFormData({
        description: '',
        budget: '',
        timeline: '',
        additionalRequirements: ''
      });
      setErrors({});
      
      onRequestSubmitted?.();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit request';
      logger.error('Error submitting service request:', error);
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Request Service
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {service.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Info */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
            <h3 className="font-medium text-emerald-900 dark:text-emerald-100 mb-2">
              {service.id === 'custom' ? 'Custom Solution Request' : 'Service Details'}
            </h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              {service.description}
            </p>
            {service.id !== 'custom' && (
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mt-2">
                Starting at ${service.price?.toLocaleString() || '0'}
              </p>
            )}
            {service.id === 'custom' && (
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mt-2">
                Custom pricing will be provided based on your requirements
              </p>
            )}
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {service.id === 'custom' ? 'Project Requirements *' : 'Project Description *'}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                errors.description ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-slate-600'
              }`}
              rows={4}
              placeholder={service.id === 'custom' 
                ? "Describe your project requirements, goals, timeline, and any specific features or technologies you need. Be as detailed as possible to help us provide an accurate quote."
                : "Describe your project requirements, goals, and any specific features you need..."
              }
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {service.id === 'custom' ? 'Budget Range (Optional)' : 'Budget (Optional)'}
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${
                  errors.budget ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-slate-600'
                }`}
                placeholder={service.id === 'custom' ? "e.g., 5000-15000" : "0.00"}
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

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {service.id === 'custom' ? 'Project Timeline (Optional)' : 'Preferred Timeline (Optional)'}
            </label>
            <select
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
            >
              <option value="">Select timeline</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="1 month">1 month</option>
              <option value="2-3 months">2-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6+ months">6+ months</option>
              <option value="No specific timeline">No specific timeline</option>
            </select>
          </div>

                           {/* Additional Requirements */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     {service.id === 'custom' ? 'Additional Details (Optional)' : 'Additional Requirements (Optional)'}
                   </label>
                   <textarea
                     value={formData.additionalRequirements}
                     onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                     className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-slate-700 dark:text-white"
                     rows={3}
                     placeholder={service.id === 'custom' 
                       ? "Any additional details, preferences, technologies, integrations, or specific requirements that would help us provide a more accurate quote..."
                       : "Any additional requirements, preferences, or questions..."
                     }
                   />
                 </div>

                 {/* File Attachments */}
                 <div>
                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                     Attach Files (Optional)
                   </label>
                   <div className="space-y-3">
                     <div className="flex items-center space-x-3">
                       <input
                         ref={fileInputRef}
                         type="file"
                         onChange={handleFileSelect}
                         className="hidden"
                         multiple
                         accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                       />
                       <button
                         type="button"
                         onClick={() => fileInputRef.current?.click()}
                         className="inline-flex items-center px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                       >
                         <Upload className="h-4 w-4 mr-2" />
                         Choose Files
                       </button>
                       <span className="text-sm text-gray-500 dark:text-gray-400">
                         Upload requirements, references, or mockups
                       </span>
                     </div>
                     
                     {selectedFiles.length > 0 && (
                       <div className="space-y-2">
                         <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                           Selected Files ({selectedFiles.length}):
                         </div>
                         {selectedFiles.map((file, index) => (
                           <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700 rounded border">
                             <div className="flex items-center space-x-2">
                               <File className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                               <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                               <span className="text-xs text-gray-500 dark:text-gray-400">
                                 ({formatFileSize(file.size)})
                               </span>
                             </div>
                             <button
                               type="button"
                               onClick={() => removeFile(index)}
                               className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                             >
                               <X className="h-4 w-4" />
                             </button>
                           </div>
                         ))}
                       </div>
                     )}
                   </div>
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
              className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  {service.id === 'custom' ? 'Submit Quote Request' : 'Submit Request'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
