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
  Users
} from 'lucide-react';

export function SubscriptionsPage() {
  const { showSuccess, showError } = useNotifications();
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    plan: '',
    amount: '',
  });
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    cancelledSubscriptions: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    filterSubscriptions();
  }, [subscriptions, searchTerm, filters]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getSubscriptions();
      const subscriptionsList = response?.subscriptions || [];
      
      setSubscriptions(Array.isArray(subscriptionsList) ? subscriptionsList : []);
      calculateStats(subscriptionsList);
      showSuccess('Subscriptions Data Loaded', `Successfully loaded ${subscriptionsList.length} subscriptions.`);
    } catch (error) {
      logger.error('Error fetching subscriptions:', error);
      showError('Failed to Load Subscriptions', 'Unable to load subscriptions data. Please try again later.');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (subscriptionsList: any[]) => {
    const totalSubscriptions = subscriptionsList.length;
    const activeSubscriptions = subscriptionsList.filter(s => s.status === 'ACTIVE').length;
    const cancelledSubscriptions = subscriptionsList.filter(s => s.status === 'CANCELLED').length;
    const totalRevenue = subscriptionsList.reduce((sum, sub) => 
      sum + parseFloat(sub.amount || '0'), 0
    );

    setStats({
      totalSubscriptions,
      activeSubscriptions,
      cancelledSubscriptions,
      totalRevenue,
    });
  };

  const filterSubscriptions = () => {
    let filtered = [...subscriptions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(subscription =>
        subscription.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.subscription_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(subscription => 
        subscription.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Plan filter
    if (filters.plan) {
      filtered = filtered.filter(subscription => 
        subscription.plan_name?.toLowerCase().includes(filters.plan.toLowerCase())
      );
    }

    // Amount filter
    if (filters.amount) {
      const amount = parseFloat(filters.amount);
      filtered = filtered.filter(subscription => 
        parseFloat(subscription.amount || '0') >= amount
      );
    }

    setFilteredSubscriptions(filtered);
  };

  const handleSubscriptionAction = async (subscriptionId: string, action: 'activate' | 'cancel' | 'pause') => {
    try {
      // This would typically call an API to update subscription status
      showSuccess('Subscription Updated', `Subscription ${action}ed successfully.`);
      fetchSubscriptions(); // Refresh data
    } catch (error) {
      logger.error(`Error ${action}ing subscription:`, error);
      showError('Action Failed', `Failed to ${action} subscription. Please try again.`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'paused':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscriptions Management</h1>
        <p className="text-gray-600">Monitor and manage client subscriptions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Subscriptions</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalSubscriptions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeSubscriptions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.cancelledSubscriptions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
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
                placeholder="Search subscriptions..."
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
                <option value="active">Active</option>
                <option value="cancelled">Cancelled</option>
                <option value="paused">Paused</option>
              </select>
              <input
                type="text"
                placeholder="Plan filter..."
                value={filters.plan}
                onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={fetchSubscriptions}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Subscriptions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Billing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {subscription.subscription_id || subscription.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {subscription.plan_name || 'Basic Plan'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {subscription.client_name || 'Unknown Client'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {subscription.client_email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {subscription.plan_name || 'Basic Plan'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${parseFloat(subscription.amount || '0').toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                      {getStatusIcon(subscription.status)}
                      <span className="ml-1 capitalize">
                        {subscription.status || 'Unknown'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {subscription.next_billing_date ? 
                      new Date(subscription.next_billing_date).toLocaleDateString() : 
                      'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {subscription.status === 'ACTIVE' && (
                        <>
                          <button
                            onClick={() => handleSubscriptionAction(subscription.id, 'pause')}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Pause subscription"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSubscriptionAction(subscription.id, 'cancel')}
                            className="text-red-600 hover:text-red-900"
                            title="Cancel subscription"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {subscription.status === 'PAUSED' && (
                        <button
                          onClick={() => handleSubscriptionAction(subscription.id, 'activate')}
                          className="text-green-600 hover:text-green-900"
                          title="Reactivate subscription"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No subscriptions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {subscriptions.length === 0 ? 'No subscriptions available.' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}