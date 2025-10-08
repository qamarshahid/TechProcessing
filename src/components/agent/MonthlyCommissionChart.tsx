import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3 } from 'lucide-react';

interface MonthlyStats {
  year: number;
  month: number;
  monthName: string;
  totalSales: number;
  totalSalesValue: number;
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
  isCurrentMonth: boolean;
}

export function MonthlyCommissionChart() {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  const fetchMonthlyStats = async () => {
    try {
      setLoading(true);
      const stats = await apiClient.getAgentMonthlyStats();
      setMonthlyStats(stats || []);
    } catch (err: any) {
      console.error('Error fetching monthly stats:', err);
      setError(err.message || 'Failed to load monthly stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-surface rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-surface2 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-surface2 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-surface rounded-lg shadow p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button
            onClick={fetchMonthlyStats}
            className="mt-2 px-4 py-2 bg-blue-600 text-fg rounded hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const currentMonth = monthlyStats.find(stat => stat.isCurrentMonth);
  const previousMonth = monthlyStats.find(stat => !stat.isCurrentMonth);

  const getCommissionChange = () => {
    if (!currentMonth || !previousMonth) return { change: 0, percentage: 0 };
    
    const change = currentMonth.totalCommission - previousMonth.totalCommission;
    const percentage = previousMonth.totalCommission > 0 
      ? (change / previousMonth.totalCommission) * 100 
      : 0;
    
    return { change, percentage };
  };

  const { change, percentage } = getCommissionChange();

  return (
    <div className="space-y-6">
      {/* Current Month Summary */}
      {currentMonth && (
        <div className="bg-white dark:bg-surface rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-fg flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {currentMonth.monthName} {currentMonth.year} Performance
            </h3>
            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full">
              Current Month
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-surface2 rounded-lg p-4">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-muted">Total Sales</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-fg">
                    {currentMonth.totalSales}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-surface2 rounded-lg p-4">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-accent600 dark:text-accent400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-muted">Sales Value</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-fg">
                    ${currentMonth.totalSalesValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-surface2 rounded-lg p-4">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-muted">Total Commission</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-fg">
                    ${currentMonth.totalCommission.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-surface2 rounded-lg p-4">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-muted">Pending</p>
                  <p className="text-xl font-semibold text-gray-900 dark:text-fg">
                    ${currentMonth.pendingCommission.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Month-over-Month Change */}
          {previousMonth && (
            <div className="border-t border-gray-200 dark:border-outline pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-muted">
                  vs {previousMonth.monthName} {previousMonth.year}
                </span>
                <div className="flex items-center">
                  {change >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-accent600 dark:text-accent400 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    change >= 0 
                      ? 'text-accent600 dark:text-accent400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {change >= 0 ? '+' : ''}${change.toLocaleString()} ({percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Monthly History Table */}
      <div className="bg-white dark:bg-surface rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-outline">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-fg">
            12-Month Commission History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-surface2">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                  Sales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                  Sales Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                  Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                  Pending
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-surface divide-y divide-gray-200 dark:divide-slate-700">
              {monthlyStats.map((stat, index) => (
                <tr key={`${stat.year}-${stat.month}`} className={stat.isCurrentMonth ? 'bg-blue-50 dark:bg-blue-900/10' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-fg">
                        {stat.monthName} {stat.year}
                      </span>
                      {stat.isCurrentMonth && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-full">
                          Current
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-fg">
                    {stat.totalSales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-fg">
                    ${stat.totalSalesValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-fg">
                    ${stat.totalCommission.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-accent600 dark:text-accent400">
                    ${stat.paidCommission.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 dark:text-orange-400">
                    ${stat.pendingCommission.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
