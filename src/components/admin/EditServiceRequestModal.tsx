import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { useNotifications } from '../common/NotificationSystem';
import { logger } from '../../lib/logger';
import { X, Save, AlertCircle } from 'lucide-react';

interface ServiceRequest {
  id: string;
  client_name?: string;
  service_type?: string;
  description?: string;
  status: string;
  priority?: string;
  created_at?: string;
  updated_at?: string;
  assigned_to?: string;
  estimated_cost?: string;
  deadline?: string;
  contact_email?: string;
  contact_phone?: string;
  // Nested objects from backend
  client?: {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
    companyName?: string;
  };
  service?: {
    id: string;
    name: string;
    description?: string;
    price?: string;
    category?: string;
  };
}

interface EditServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestUpdated: () => void;
  request: ServiceRequest | null;
}

export function EditServiceRequestModal({ isOpen, onClose, onRequestUpdated, request }: EditServiceRequestModalProps) {
  const [formData, setFormData] = useState({
    service_type: '',
    description: '',
    status: '',
    priority: '',
    estimated_cost: '',
    deadline: '',
    contact_email: '',
    contact_phone: '',
    assigned_to: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    if (request && isOpen) {
      setFormData({
        service_type: request.service?.name || request.service_type || '',
        description: request.description || '',
        status: request.status || '',
        priority: request.priority || '',
        estimated_cost: request.estimated_cost || '',
        deadline: request.deadline ? new Date(request.deadline).toISOString().split('T')[0] : '',
        contact_email: request.client?.email || request.contact_email || '',
        contact_phone: request.client?.phone || request.contact_phone || '',
        assigned_to: request.assigned_to || '',
      });
    }
  }, [request, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;

    setLoading(true);
    setError('');

    try {
      const updateData = {
        description: formData.description,
        budget: formData.estimated_cost && formData.estimated_cost.trim() !== '' ? parseFloat(formData.estimated_cost) : undefined,
        timeline: formData.deadline ? new Date(formData.deadline).toISOString().split('T')[0] : undefined,
        status: formData.status && formData.status.trim() !== '' ? formData.status : undefined,
        adminNotes: formData.priority ? `Priority: ${formData.priority}` : undefined,
        assignedTo: formData.assigned_to && formData.assigned_to.trim() !== '' ? formData.assigned_to : undefined,
      };

      console.log('Sending update data:', updateData);
      await apiClient.updateServiceRequest(request.id, updateData);
      
      showSuccess('Request Updated', 'Service request has been updated successfully.');
      onRequestUpdated();
      onClose();
    } catch (err: any) {
      logger.error('Error updating service request:', err);
      setError(err.message || 'Failed to update service request');
      showError('Update Failed', 'Failed to update service request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-surface rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-outline">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mr-3">
              <Save className="h-5 w-5 text-accent1 dark:text-accent2" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-fg">Edit Service Request</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">Error</p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Service Type
              </label>
              <input
                type="text"
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Enter service type"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="reviewing">Reviewing</option>
                <option value="quote_ready">Quote Ready</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Estimated Cost ($)
              </label>
              <input
                type="number"
                name="estimated_cost"
                value={formData.estimated_cost}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Assigned To
              </label>
              <input
                type="text"
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Enter assignee name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="Enter service request description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="client@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-surface2 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-accent1 text-fg rounded-lg hover:bg-accent1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
