import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { Closer } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { X, TrendingUp, DollarSign, Users, Calendar, BarChart3 } from 'lucide-react';

interface CloserStats {
  closer: Closer;
  totalSales: number;
  totalSalesValue: number;
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
}

interface CloserStatsModalProps {
  closer: Closer;
  onClose: () => void;
}

export function CloserStatsModal({ closer, onClose }: CloserStatsModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<CloserStats | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    fetchCloserStats();
    fetchCloserSales();
  }, [closer.id]);

  const fetchCloserStats = async () => {
    try {
      setLoading(true);
      console.log('Fetching stats for closer:', closer.id);
      console.log('Current user:', user);
      
      if (!user || user.role !== 'ADMIN') {
        setError('You must be logged in as an admin to view closer statistics');
        return;
      }
      
      const data = await apiClient.getCloserStats(closer.id);
      console.log('Closer stats received:', data);
      setStats(data);
    } catch (err: any) {
      console.error('Error fetching closer stats:', err);
      console.error('Error details:', err.response || err.message);
      
      if (err.response?.status === 401) {
        setError('Authentication required. Please log in as an admin.');
      } else {
        setError('Failed to load closer statistics');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCloserSales = async () => {
    try {
      const data = await apiClient.getCloserSales(closer.id);
      setSalesData(data);
    } catch (err: any) {
      console.error('Error fetching closer sales:', err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Closer Statistics
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {closer.closerName} ({closer.closerCode})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
                  {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            <button
              onClick={fetchCloserStats}
              className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

          {!stats && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No statistics available for this closer.</p>
            </div>
          )}
          
          {stats && stats.closer && (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Sales</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {stats.totalSales || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                      <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">Sales Value</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        ${(stats.totalSalesValue || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Commission</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        ${(stats.totalCommission || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                      <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Pending</p>
                      <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                        ${(stats.pendingCommission || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Commission Breakdown */}
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Commission Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      ${(stats.paidCommission || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Paid Commission</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      ${(stats.pendingCommission || 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Pending Commission</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.totalSales || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Sales</div>
                  </div>
                </div>
              </div>

              {/* Sales Details */}
              {salesData.length > 0 && (
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Sales Details ({salesData.length} sales)
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total: ${salesData.reduce((sum, sale) => sum + Number(sale.saleAmount), 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
                      <thead className="bg-gray-100 dark:bg-slate-600">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Agent
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Client
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Commission
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Sale Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Commission Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-700 divide-y divide-gray-200 dark:divide-slate-600">
                        {salesData.map((sale) => (
                          <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-slate-600">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {new Date(sale.saleDate || sale.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {sale.agent?.salesPersonName || 'N/A'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {sale.clientName}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {sale.serviceName}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              ${Number(sale.saleAmount).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              ${Number(sale.closerCommission).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                sale.saleStatus === 'APPROVED'
                                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                                  : sale.saleStatus === 'PENDING'
                                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                                  : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                              }`}>
                                {sale.saleStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                sale.commissionStatus === 'PAID'
                                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                                  : sale.commissionStatus === 'APPROVED'
                                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                                  : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
                              }`}>
                                {sale.commissionStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {salesData.length === 0 && (
                <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">No sales found for this closer.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
