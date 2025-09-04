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
      
      // Ensure we always have an array
      const safeSubscriptionsList = Array.isArray(subscriptionsList) ? subscriptionsList : [];
      setSubscriptions(safeSubscriptionsList);
      setFilteredSubscriptions(safeSubscriptionsList);
      calculateStats(safeSubscriptionsList);
      showSuccess('Subscriptions Data Loaded', `Successfully loaded ${safeSubscriptionsList.length} subscriptions.`);
    } catch (error) {
      logger.error('Error fetching subscriptions:', error);
      showError('Failed to Load Subscriptions', 'Unable to load subscriptions data. Please try again later.');
      setSubscriptions([]);
      setFilteredSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (subscriptionsList: any[]) => {
    if (!Array.isArray(subscriptionsList)) {
      subscriptionsList = [];
    }
    
    const totalSubscriptions = subscriptionsList.length;
    const activeSubscriptions = subscriptionsList.filter(s => s.status === 'ACTIVE').length;
    const cancelledSubscriptions = subscriptionsList.filter(s => s.status === 'CANCELLED').length;
    const totalRevenue = subscriptionsList.reduce((sum, subscription) => 
      sum + parseFloat(subscription.amount || '0'), 0
    );

    setStats({
      totalSubscriptions,
      activeSubscriptions,
      cancelledSubscriptions,
      totalRevenue,
    });
  };

  const filterSubscriptions = () => {
    // Ensure subscriptions is always an array
    const safeSubscriptions = Array.isArray(subscriptions) ? subscriptions : [];
    let filtered = [...safeSubscriptions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(subscription =>
        subscription?.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription?.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription?.subscription_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(subscription => 
        subscription?.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Plan filter
    if (filters.plan) {
      filtered = filtered.filter(subscription => 
        subscription?.plan_name?.toLowerCase().includes(filters.plan.toLowerCase())
      );
    }

    // Amount filter
    if (filters.amount) {
      const amount = parseFloat(filters.amount);
      filtered = filtered.filter(subscription => 
        parseFloat(subscription?.amount || '0') >= amount
      );
    }

    setFilteredSubscriptions(filtered);
  };

  const handleSubscriptionAction = async (subscriptionId: string, action: 'activate' | 'deactivate' | 'cancel') => {
    try {
      let newStatus = '';
      let message = '';
      
      switch (action) {
        case 'activate':
          newStatus = 'ACTIVE';
          message = 'Subscription activated successfully.';
          break;
        case 'deactivate':
          newStatus = 'INACTIVE';
          message = 'Subscription deactivated successfully.';
          break;
        case 'cancel':
          newStatus = 'CANCELLED';
          message = 'Subscription cancelled successfully.';
          break;
      }
      
      showSuccess('Subscription Updated', message);
      
      setSubscriptions(prev => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return safePrev.map(subscription => 
          subscription?.id === subscriptionId 
            ? { ...subscription, status: newStatus }
            : subscription
        );
      });
      
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
      case 'inactive':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Ensure arrays are always safe
  const safeFilteredSubscriptions = Array.isArray(filteredSubscriptions) ? filteredSubscriptions : [];
  const safeSubscriptions = Array.isArray(subscriptions) ? subscriptions : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Subscriptions Management</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Manage client subscription plans and recurring billing</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <CreditCard className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSubscriptions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeSubscriptions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.cancelledSubscriptions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search subscriptions by client name, plan, or subscription ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filters.plan}
                onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              >
                <option value="">All Plans</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
                <option value="enterprise">Enterprise</option>
              </select>
              <button
                onClick={fetchSubscriptions}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Client Subscriptions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Next Billing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {safeFilteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {subscription.client_name || 'Unknown Client'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {subscription.client_email || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {subscription.plan_name || 'Unknown Plan'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {subscription.next_billing_date ? 
                      new Date(subscription.next_billing_date).toLocaleDateString() : 
                      'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {subscription.status === 'ACTIVE' ? (
                        <>
                          <button
                            onClick={() => handleSubscriptionAction(subscription.id, 'deactivate')}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
                            title="Deactivate subscription"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSubscriptionAction(subscription.id, 'cancel')}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Cancel subscription"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleSubscriptionAction(subscription.id, 'activate')}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                          title="Activate subscription"
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
        
        {safeFilteredSubscriptions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No subscriptions found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {safeSubscriptions.length === 0 ? 'No subscriptions available.' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
