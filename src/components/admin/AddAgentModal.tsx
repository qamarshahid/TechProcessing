import React, { useState } from 'react';
import { X } from 'lucide-react';
import { apiClient } from '../../lib/api';

interface AddAgentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AddAgentModal: React.FC<AddAgentModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    agentCode: '',
    salesPersonName: '',
    closerName: '',
    agentCommissionRate: 6.00,
    closerCommissionRate: 10.00,
    companyName: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const updatedValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : type === 'number' ? parseFloat(value) : value;
    
    setFormData({
      ...formData,
      [name]: updatedValue,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password || !formData.fullName || !formData.agentCode) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiClient.createAgent(formData);
      onSuccess();
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to create agent. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-fg">Add New Agent</h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-gray-600 dark:hover:text-muted"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                Email Address*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-emerald-500 dark:bg-gray-700 dark:text-fg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                Password*
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-emerald-500 dark:bg-gray-700 dark:text-fg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                Full Name*
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-emerald-500 dark:bg-gray-700 dark:text-fg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                Agent Code*
              </label>
              <input
                type="text"
                name="agentCode"
                value={formData.agentCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-emerald-500 dark:bg-gray-700 dark:text-fg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                Sales Person Name
              </label>
              <input
                type="text"
                name="salesPersonName"
                value={formData.salesPersonName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-emerald-500 dark:bg-gray-700 dark:text-fg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                Closer Name
              </label>
              <input
                type="text"
                name="closerName"
                value={formData.closerName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-emerald-500 dark:bg-gray-700 dark:text-fg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                Agent Commission Rate (%)
              </label>
              <input
                type="number"
                name="agentCommissionRate"
                value={formData.agentCommissionRate}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-emerald-500 dark:bg-gray-700 dark:text-fg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                Closer Commission Rate (%)
              </label>
              <input
                type="number"
                name="closerCommissionRate"
                value={formData.closerCommissionRate}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-emerald-500 dark:bg-gray-700 dark:text-fg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-emerald-500 dark:bg-gray-700 dark:text-fg"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center text-sm font-medium text-gray-700 dark:text-muted">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-accent1 focus:ring-ring border-gray-300 dark:border-gray-600 rounded mr-2"
                />
                Active Account
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-muted rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent1 text-fg rounded-lg hover:bg-accent1 transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-opacity-25 border-t-white rounded-full animate-spin mr-2"></span>
              ) : null}
              Create Agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAgentModal;
