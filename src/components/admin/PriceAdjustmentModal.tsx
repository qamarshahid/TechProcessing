import React, { useState } from 'react';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { X, DollarSign, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface PriceAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  currentAmount: number;
  onAdjustmentCreated?: () => void;
}

export function PriceAdjustmentModal({ 
  isOpen, 
  onClose, 
  requestId, 
  currentAmount,
  onAdjustmentCreated 
}: PriceAdjustmentModalProps) {
  const { showError, showSuccess } = useNotifications();
  
  const [formData, setFormData] = useState({
    newAmount: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.newAmount || parseFloat(formData.newAmount) <= 0) {
      newErrors.newAmount = 'New amount must be greater than 0';
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reason for adjustment is required';
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
      const adjustmentData = {
        previousAmount: currentAmount,
        newAmount: parseFloat(formData.newAmount),
        reason: formData.reason.trim(),
      };

      await apiClient.createPriceAdjustment(requestId, adjustmentData);
      
      showSuccess(
        'Price Adjustment Created', 
        'Price adjustment has been created and sent to the client for approval.'
      );
      
      // Reset form
      setFormData({
        newAmount: '',
        reason: ''
      });
      setErrors({});
      
      onAdjustmentCreated?.();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create price adjustment';
      logger.error('Error creating price adjustment:', error);
      showError('Adjustment Failed', errorMessage);
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

  const newAmount = parseFloat(formData.newAmount) || 0;
  const difference = newAmount - currentAmount;
  const isIncrease = difference > 0;
  const isDecrease = difference < 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-surface rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-outline">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-fg">
              Price Adjustment
            </h2>
            <p className="text-sm text-gray-600 dark:text-muted mt-1">
              Adjust the quote amount for this request
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-gray-600 dark:hover:text-muted transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Amount Display */}
          <div className="bg-gray-50 dark:bg-surface2 rounded-lg p-4">
            <div className="text-sm text-gray-600 dark:text-muted mb-1">Current Amount</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-fg">
              ${currentAmount.toLocaleString()}
            </div>
          </div>

          {/* New Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
              New Amount *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500 dark:text-muted">$</span>
              <input
                type="number"
                value={formData.newAmount}
                onChange={(e) => handleInputChange('newAmount', e.target.value)}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-emerald-500 dark:bg-surface2 dark:border-slate-600 dark:text-fg ${
                  errors.newAmount ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-slate-600'
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            {errors.newAmount && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.newAmount}
              </p>
            )}
          </div>

          {/* Difference Display */}
          {formData.newAmount && !errors.newAmount && (
            <div className={`rounded-lg p-4 border ${
              isIncrease 
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' 
                : isDecrease 
                ? 'bg-accent50 dark:bg-accent900/20 border-accent200 dark:border-accent800'
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-muted">
                  {isIncrease ? 'Price Increase' : isDecrease ? 'Price Decrease' : 'No Change'}
                </span>
                <div className={`flex items-center text-lg font-bold ${
                  isIncrease 
                    ? 'text-red-600 dark:text-red-400' 
                    : isDecrease 
                    ? 'text-accent600 dark:text-accent400'
                    : 'text-gray-600 dark:text-muted'
                }`}>
                  {isIncrease && <TrendingUp className="h-5 w-5 mr-1" />}
                  {isDecrease && <TrendingDown className="h-5 w-5 mr-1" />}
                  ${Math.abs(difference).toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-gray-600 dark:text-muted mt-1">
                {isIncrease 
                  ? `New total: $${newAmount.toLocaleString()}`
                  : isDecrease 
                  ? `New total: $${newAmount.toLocaleString()}`
                  : 'Amount unchanged'
                }
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
              Reason for Adjustment *
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-emerald-500 dark:bg-surface2 dark:border-slate-600 dark:text-fg ${
                errors.reason ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-slate-600'
              }`}
              rows={3}
              placeholder="Explain why this price adjustment is necessary..."
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.reason}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-outline">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-muted bg-gray-100 dark:bg-surface2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 bg-accent1 hover:bg-accent1 dark:bg-accent2 dark:hover:bg-accent1 text-fg rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Create Adjustment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
