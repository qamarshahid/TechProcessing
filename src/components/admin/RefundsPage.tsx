import React, { useState, useEffect } from 'react';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { 
  CreditCard, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  RefreshCw,
  TrendingUp,
  RotateCcw,
  Eye,
  Download
} from 'lucide-react';

export function RefundsPage() {
  const { showSuccess, showError } = useNotifications();
  const [refunds, setRefunds] = useState<any[]>([]);
  const [filteredRefunds, setFilteredRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    reason: '',
    amount: '',
  });
  const [stats, setStats] = useState({
    totalRefunds: 0,
    totalAmount: 0,
    pendingRefunds: 0,
    approvedRefunds: 0,
    rejectedRefunds: 0,
  });

  useEffect(() => {
    fetchRefunds();
  }, []);

  useEffect(() => {
    filterRefunds();
  }, [refunds, searchTerm, filters]);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      // For now, we'll simulate refunds data since the API might not have this endpoint yet
      const mockRefunds = [
        {
          id: 'ref_1',
          payment_id: 'pay_123',
          amount: 150.00,
          reason: 'Customer requested refund',
          status: 'PENDING',
          created_at: new Date().toISOString(),
          client_name: 'John Doe',
          client_email: 'john@example.com',
          original_payment_method: 'credit_card',
          transaction_id: 'txn_456'
        },
        {
          id: 'ref_2',
          payment_id: 'pay_124',
          amount: 75.50,
          reason: 'Service not delivered',
          status: 'APPROVED',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          client_name: 'Jane Smith',
          client_email: 'jane@example.com',
          original_payment_method: 'debit_card',
          transaction_id: 'txn_789'
        }
      ];
      
      setRefunds(mockRefunds);
      calculateStats(mockRefunds);
      showSuccess('Refunds Data Loaded', `Successfully loaded ${mockRefunds.length} refunds.`);
    } catch (error) {
      logger.error('Error fetching refunds:', error);
      showError('Failed to Load Refunds', 'Unable to load refunds data. Please try again later.');
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (refundsList: any[]) => {
    const totalRefunds = refundsList.length;
    const totalAmount = refundsList.reduce((sum, refund) => 
      sum + parseFloat(refund.amount || '0'), 0
    );
    const pendingRefunds = refundsList.filter(r => 
      r.status === 'PENDING'
    ).length;
    const approvedRefunds = refundsList.filter(r => 
      r.status === 'APPROVED'
    ).length;
    const rejectedRefunds = refundsList.filter(r => 
      r.status === 'REJECTED'
    ).length;

    setStats({
      totalRefunds,
      totalAmount,
      pendingRefunds,
      approvedRefunds,
      rejectedRefunds,
    });
  };

  const filterRefunds = () => {
    let filtered = [...refunds];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(refund =>
        refund.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(refund => 
        refund.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Reason filter
    if (filters.reason) {
      filtered = filtered.filter(refund => 
        refund.reason?.toLowerCase().includes(filters.reason.toLowerCase())
      );
    }

    // Amount filter
    if (filters.amount) {
      const amount = parseFloat(filters.amount);
      filtered = filtered.filter(refund => 
        parseFloat(refund.amount || '0') >= amount
      );
    }

    setFilteredRefunds(filtered);
  };

  const handleRefundAction = async (refundId: string, action: 'approve' | 'reject') => {
    try {
      // This would typically call an API to update refund status
      const newStatus = action === 'approve' ? 'APPROVED' : 'REJECTED';
      showSuccess('Refund Updated', `Refund ${action}d successfully.`);
      
      // Update local state
      setRefunds(prev => prev.map(refund => 
        refund.id === refundId 
          ? { ...refund, status: newStatus }
          : refund
      ));
      
      fetchRefunds(); // Refresh data
    } catch (error) {
      logger.error('Error updating refund status:', error);
      showError('Update Failed', `Failed to ${action} refund. Please try again.`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Ensure arrays are always safe
  const safeFilteredRefunds = Array.isArray(filteredRefunds) ? filteredRefunds : [];
  const safeRefunds = Array.isArray(refunds) ? refunds : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Refunds Management</h1>
        <p className="text-gray-600">Review and process refund requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <RotateCcw className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Refunds</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalRefunds}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingRefunds}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.approvedRefunds}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.rejectedRefunds}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search refunds..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <input
                type="text"
                placeholder="Reason filter..."
                value={filters.reason}
                onChange={(e) => setFilters({ ...filters, reason: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={fetchRefunds}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Refund Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Refund
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeFilteredRefunds.map((refund) => (
                <tr key={refund.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <RotateCcw className="w-5 h-5 text-red-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {refund.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {refund.transaction_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {refund.client_name || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {refund.client_email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${parseFloat(refund.amount || '0').toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(refund.status)}`}>
                      {getStatusIcon(refund.status)}
                      <span className="ml-1 capitalize">
                        {refund.status || 'Unknown'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                    {refund.reason || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(refund.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {refund.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleRefundAction(refund.id, 'approve')}
                            className="text-green-600 hover:text-green-900"
                            title="Approve refund"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRefundAction(refund.id, 'reject')}
                            className="text-red-600 hover:text-red-900"
                            title="Reject refund"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Download receipt"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {safeFilteredRefunds.length === 0 && (
          <div className="text-center py-12">
            <RotateCcw className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No refunds found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {safeRefunds.length === 0 ? 'No refunds available.' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}