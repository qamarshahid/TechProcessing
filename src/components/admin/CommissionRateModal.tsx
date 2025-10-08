import React, { useState } from 'react';
import { apiClient } from '../../lib/api';
import { Agent } from '../../types';
import { X, Percent, User } from 'lucide-react';

interface CommissionRateModalProps {
  agent: Agent;
  onClose: () => void;
  onSuccess: () => void;
}

export function CommissionRateModal({ agent, onClose, onSuccess }: CommissionRateModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agentCommissionRate, setAgentCommissionRate] = useState(agent.agentCommissionRate);
  const [closerCommissionRate, setCloserCommissionRate] = useState(agent.closerCommissionRate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (agentCommissionRate < 0 || agentCommissionRate > 100) {
      setError('Agent commission rate must be between 0 and 100');
      return;
    }

    if (closerCommissionRate < 0 || closerCommissionRate > 100) {
      setError('Closer commission rate must be between 0 and 100');
      return;
    }

    try {
      setLoading(true);
      setError('');

      await apiClient.updateAgentCommissionRates(
        agent.id,
        agentCommissionRate,
        closerCommissionRate
      );

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error updating commission rates:', err);
      setError(err.message || 'Failed to update commission rates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-surface rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-outline">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-fg">Update Commission Rates</h2>
            <p className="text-sm text-gray-600 dark:text-muted mt-1">
              Agent: {agent.salesPersonName}
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
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Agent Commission Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
              Agent Commission Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                value={agentCommissionRate}
                onChange={(e) => setAgentCommissionRate(parseFloat(e.target.value) || 0)}
                className="w-full pr-8 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
                max="100"
                required
              />
              <span className="absolute right-3 top-2 text-gray-500 dark:text-muted">
                <Percent className="h-4 w-4" />
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-muted mt-1">
              This is the percentage the agent receives from each sale
            </p>
          </div>

          {/* Closer Commission Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
              Closer Commission Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                value={closerCommissionRate}
                onChange={(e) => setCloserCommissionRate(parseFloat(e.target.value) || 0)}
                className="w-full pr-8 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-gray-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                step="0.01"
                min="0"
                max="100"
                required
              />
              <span className="absolute right-3 top-2 text-gray-500 dark:text-muted">
                <Percent className="h-4 w-4" />
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-muted mt-1">
              This is the percentage the closer receives from each sale
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> Changing commission rates will automatically recalculate commissions for all pending and resubmitted sales for this agent.
            </p>
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
              className="px-4 py-2 bg-blue-600 text-fg rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Rates'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
