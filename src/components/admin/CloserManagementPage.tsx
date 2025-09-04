import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { useNotifications } from '../common/NotificationSystem';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { Closer } from '../../types';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';
import { AddCloserModal } from './AddCloserModal';
import { EditCloserModal } from './EditCloserModal';
import { CloserStatsModal } from './CloserStatsModal';

interface CloserStats {
  closer: Closer;
  totalSales: number;
  totalSalesValue: number;
  totalCommission: number;
  approvedSales: number;
  approvedSalesValue: number;
  approvedCommission: number;
  paidCommission: number;
  pendingCommission: number;
}

export function CloserManagementPage() {
  const { showSuccess, showError, showWarning } = useNotifications();
  const [closers, setClosers] = useState<Closer[]>([]);
  const [closerStats, setCloserStats] = useState<CloserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCloser, setSelectedCloser] = useState<Closer | null>(null);
  
  // Confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Advanced filtering
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });
  const [selectedMonth, setSelectedMonth] = useState('');
  const [commissionRange, setCommissionRange] = useState({
    min: '',
    max: '',
  });

  useEffect(() => {
    fetchClosers();
    fetchCloserStats();
  }, []);

  const fetchClosers = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAllClosers();
      setClosers(data);
      showSuccess('Closers Loaded', `Successfully loaded ${data?.length || 0} closers.`);
    } catch (err: any) {
      console.error('Error fetching closers:', err);
      setError('Failed to load closers');
      showError('Failed to Load Closers', 'Unable to load closers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCloserStats = async () => {
    try {
      const data = await apiClient.getAllClosersStats();
      setCloserStats(data);
      showSuccess('Closer Stats Loaded', 'Closer statistics loaded successfully.');
    } catch (err: any) {
      console.error('Error fetching closer stats:', err);
      showWarning('Stats Unavailable', 'Unable to load closer statistics. Some data may be incomplete.');
    }
  };

  const fetchFilteredCloserStats = async () => {
    try {
      const filters: any = {};
      
      if (dateRange.startDate && dateRange.endDate) {
        filters.startDate = dateRange.startDate;
        filters.endDate = dateRange.endDate;
      }
      
      if (selectedMonth) {
        filters.month = selectedMonth;
      }
      
      if (commissionRange.min || commissionRange.max) {
        if (commissionRange.min) filters.minCommission = parseFloat(commissionRange.min);
        if (commissionRange.max) filters.maxCommission = parseFloat(commissionRange.max);
      }
      
      const data = await apiClient.getFilteredCloserStats(filters);
      setCloserStats(data);
    } catch (err: any) {
      console.error('Error fetching filtered closer stats:', err);
    }
  };

  const handleDeleteClick = (closer: Closer) => {
    setSelectedCloser(closer);
    setShowDeleteModal(true);
  };

  const handleDeleteCloser = async () => {
    if (!selectedCloser) return;
    
    setIsDeleting(true);
    try {
      await apiClient.deleteCloser(selectedCloser.id);
      await fetchClosers();
      await fetchCloserStats();
      showSuccess('Closer Deleted', `Closer "${selectedCloser.closerName}" has been deleted successfully.`);
    } catch (err: any) {
      console.error('Error deleting closer:', err);
      showError('Delete Failed', `Failed to delete closer: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setSelectedCloser(null);
    }
  };

  const filteredClosers = closers.filter(closer => {
    const matchesSearch = closer.closerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         closer.closerCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || closer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCloserStats = (closerId: string) => {
    return closerStats.find(stats => stats.closer.id === closerId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-red-600 dark:text-red-400">
            <p className="text-lg mb-4">{error}</p>
            <button
              onClick={fetchClosers}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Closer Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage closers and track their performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setSelectedCloser(null);
                  setShowAddModal(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Closer
              </button>
              <button
                onClick={() => {
                  fetchClosers();
                  fetchCloserStats();
                }}
                className="inline-flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Closers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {closers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Closers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {closers.filter(c => c.status === 'ACTIVE').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Commission</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${closerStats.reduce((sum, stats) => sum + stats.totalCommission, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Commission</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${closerStats.reduce((sum, stats) => sum + stats.pendingCommission, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search closers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Advanced Filters</span>
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredClosers.length} of {closers.length} closers
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Month
                  </label>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Commission Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={commissionRange.min}
                      onChange={(e) => setCommissionRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-1/2 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={commissionRange.max}
                      onChange={(e) => setCommissionRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-1/2 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    setDateRange({ startDate: '', endDate: '' });
                    setSelectedMonth('');
                    setCommissionRange({ min: '', max: '' });
                    fetchCloserStats();
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Clear Filters
                </button>
                <button
                  onClick={fetchFilteredCloserStats}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Apply Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Closers Table */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
              <thead className="bg-gray-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Closer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Commission Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                {filteredClosers.map((closer) => {
                  const stats = getCloserStats(closer.id);
                  return (
                    <tr key={closer.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {closer.closerName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {closer.closerCode}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {closer.commissionRate}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          closer.status === 'ACTIVE'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                            : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                        }`}>
                          {closer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {stats ? (
                            <div>
                              <div>{stats.totalSales} total sales</div>
                              <div className="text-gray-500 dark:text-gray-400">
                                ${stats.totalSalesValue.toLocaleString()}
                              </div>
                              {stats.approvedSales !== stats.totalSales && (
                                <div className="text-xs text-blue-600 dark:text-blue-400">
                                  {stats.approvedSales} approved
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">No data</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {stats ? (
                            <div>
                              <div>${stats.totalCommission.toLocaleString()} total</div>
                              <div className="text-gray-500 dark:text-gray-400">
                                ${stats.pendingCommission.toLocaleString()} pending
                              </div>
                              {stats.approvedCommission !== stats.totalCommission && (
                                <div className="text-xs text-green-600 dark:text-green-400">
                                  ${stats.approvedCommission.toLocaleString()} approved
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">No data</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedCloser(closer);
                              setShowStatsModal(true);
                            }}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            title="View Stats"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCloser(closer);
                              setShowEditModal(true);
                            }}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(closer)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddCloserModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              fetchClosers();
              fetchCloserStats();
            }}
          />
        )}

        {showEditModal && selectedCloser && (
          <EditCloserModal
            closer={selectedCloser}
            onClose={() => {
              setShowEditModal(false);
              setSelectedCloser(null);
            }}
            onSuccess={() => {
              fetchClosers();
              fetchCloserStats();
            }}
          />
        )}

        {showStatsModal && selectedCloser && (
          <CloserStatsModal
            closer={selectedCloser}
            onClose={() => {
              setShowStatsModal(false);
              setSelectedCloser(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCloser(null);
          }}
          onConfirm={handleDeleteCloser}
          title="Delete Closer"
          message={`Are you sure you want to delete the closer "${selectedCloser?.closerName}"? This action cannot be undone and will permanently remove the closer from the system.`}
          confirmText="Delete Closer"
          cancelText="Cancel"
          type="danger"
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
}
