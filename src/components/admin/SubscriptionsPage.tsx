import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { useNotifications } from '../common/NotificationSystem';
import { logger } from '../../lib/logger';
import {
  CreditCard, DollarSign, Clock, CheckCircle, XCircle, RefreshCw, Search, Eye, Edit, Trash2, Filter, TrendingUp, BarChart3, Activity, Shield, AlertCircle, Info, Calendar, User, Building, ArrowUpDown, ChevronDown, ChevronUp, Settings, HelpCircle, Zap, Rocket, Plus, Star, Tag, Layers, CalendarDays, Repeat, Pause, Play, Ban, Crown, Clock3, Receipt, ArrowLeftRight, CreditCard as CreditCardIcon, Calendar as CalendarIcon, Gem
} from 'lucide-react';

interface Subscription {
  id: string;
  client_name?: string;
  plan_name?: string;
  amount: string;
  status: string;
  billing_cycle?: string;
  next_billing_date?: string;
  created_at?: string;
  updated_at?: string;
  start_date?: string;
  end_date?: string;
  auto_renew?: boolean;
  payment_method?: string;
}

export function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    filterAndSortSubscriptions();
  }, [subscriptions, searchTerm, statusFilter, planFilter, sortBy, sortOrder]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.getSubscriptions();
      const subscriptionsList = response?.subscriptions || [];
      
      setSubscriptions(subscriptionsList);
      setFilteredSubscriptions(subscriptionsList);
      
      showSuccess('Subscriptions Loaded', 'Subscription data loaded successfully.');
    } catch (error) {
      logger.error('Error fetching subscriptions:', error);
      setError('Failed to load subscriptions. Please try again.');
      showError('Subscription Error', 'Failed to load subscriptions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortSubscriptions = () => {
    let filtered = [...subscriptions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(subscription => 
        subscription.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.payment_method?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(subscription => (subscription.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply plan filter
    if (planFilter !== 'all') {
      filtered = filtered.filter(subscription => subscription.plan_name?.toLowerCase() === planFilter.toLowerCase());
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'amount':
          aValue = parseFloat(a.amount || '0');
          bValue = parseFloat(b.amount || '0');
          break;
        case 'date':
          aValue = new Date(a.created_at || a.updated_at || '');
          bValue = new Date(b.created_at || b.updated_at || '');
          break;
        case 'status':
          aValue = (a.status || '').toLowerCase();
          bValue = (b.status || '').toLowerCase();
          break;
        case 'client':
          aValue = a.client_name || '';
          bValue = b.client_name || '';
          break;
        case 'next_billing':
          aValue = new Date(a.next_billing_date || '');
          bValue = new Date(b.next_billing_date || '');
          break;
        default:
          aValue = new Date(a.created_at || a.updated_at || '');
          bValue = new Date(b.created_at || b.updated_at || '');
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredSubscriptions(filtered);
  };

  const handleStatusChange = async (subscriptionId: string, newStatus: string) => {
    try {
      // Update local state for now (API call would be implemented later)
      setSubscriptions(prev => prev.map(s => 
        s.id === subscriptionId ? { ...s, status: newStatus } : s
      ));
      
      showSuccess('Status Updated', `Subscription status updated to ${newStatus}`);
    } catch (error) {
      logger.error('Error updating subscription status:', error);
      showError('Update Failed', 'Failed to update subscription status. Please try again.');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'active_trial':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-accent2 dark:border-emerald-800';
      case 'paused':
      case 'suspended':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case 'cancelled':
      case 'expired':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'pending':
      case 'processing':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-bg2/20 dark:text-slate-400 dark:border-outline';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'active_trial':
        return <CheckCircle className="h-4 w-4" />;
      case 'paused':
      case 'suspended':
        return <Pause className="h-4 w-4" />;
      case 'cancelled':
      case 'expired':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
      case 'processing':
        return <Clock className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName?.toLowerCase()) {
      case 'basic':
        return <Star className="h-4 w-4" />;
      case 'pro':
        return <Zap className="h-4 w-4" />;
      case 'enterprise':
        return <Crown className="h-4 w-4" />;
      case 'premium':
        return <Gem className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getBillingCycleIcon = (cycle: string) => {
    switch (cycle?.toLowerCase()) {
      case 'monthly':
        return <CalendarDays className="h-4 w-4" />;
      case 'quarterly':
        return <Calendar className="h-4 w-4" />;
      case 'yearly':
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return <Repeat className="h-4 w-4" />;
    }
  };

  const calculateStats = () => {
    const total = subscriptions.length;
    const active = subscriptions.filter(s => s.status.toLowerCase() === 'active' || s.status.toLowerCase() === 'active_trial').length;
    const paused = subscriptions.filter(s => s.status.toLowerCase() === 'paused' || s.status.toLowerCase() === 'suspended').length;
    const cancelled = subscriptions.filter(s => s.status.toLowerCase() === 'cancelled' || s.status.toLowerCase() === 'expired').length;
    const totalRevenue = subscriptions.reduce((sum, s) => sum + parseFloat(s.amount || '0'), 0);
    const avgRevenue = total > 0 ? totalRevenue / total : 0;

    return { total, active, paused, cancelled, totalRevenue, avgRevenue };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-accent50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="text-center">
              <div className="h-12 bg-slate-200 dark:bg-surface2 rounded-lg w-1/3 mx-auto mb-4"></div>
              <div className="h-6 bg-slate-200 dark:bg-surface2 rounded w-1/2 mx-auto"></div>
            </div>
            
            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-surface2 rounded-xl"></div>
              ))}
            </div>
            
            {/* Table skeleton */}
            <div className="h-96 bg-slate-200 dark:bg-surface2 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-accent50 to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent1 to-accent600 rounded-2xl mb-6 shadow-xl">
            <CreditCard className="h-10 w-10 text-fg" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-fg mb-4">
            Subscription Management Center 💳
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Monitor, manage, and optimize your subscription ecosystem. Track recurring revenue, manage billing cycles, and ensure customer retention.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Subscriptions</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-fg">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-accent1 to-accent600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <CreditCard className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Activity className="h-4 w-4 mr-1 text-accent1" />
              <span>All plans</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Active</p>
                <p className="text-3xl font-bold text-accent1 dark:text-accent2">{stats.active}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-accent1 to-accent600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <CheckCircle className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <TrendingUp className="h-4 w-4 mr-1 text-accent1" />
              <span>Generating revenue</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Monthly Revenue</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <DollarSign className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <BarChart3 className="h-4 w-4 mr-1 text-amber-500" />
              <span>Recurring income</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Avg Revenue</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${stats.avgRevenue.toFixed(0)}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Tag className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Star className="h-4 w-4 mr-1 text-blue-500" />
              <span>Per subscription</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search subscriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-surface2 text-slate-900 dark:text-fg placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>
                
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Plans</option>
                  <option value="basic">Basic</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="premium">Premium</option>
                </select>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-xl border transition-all duration-200 flex items-center gap-2 ${
                    showFilters
                      ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400'
                      : 'bg-white dark:bg-surface2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent1 to-accent600 text-fg font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Subscription
              </button>
              
              <button
                onClick={fetchSubscriptions}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-fg font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-outline">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                    <option value="status">Status</option>
                    <option value="client">Client</option>
                    <option value="next_billing">Next Billing</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sort Order</label>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                  >
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Billing Cycle</label>
                  <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">All Cycles</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Subscriptions Table */}
        <div className="bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-outline">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-fg">Active Subscriptions</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-surface2">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Subscription Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Next Billing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface divide-y divide-slate-200 dark:divide-slate-700">
                {filteredSubscriptions.length > 0 ? (
                  filteredSubscriptions.map((subscription) => (
                    <tr key={subscription.id} className="hover:bg-slate-50 dark:hover:bg-surface2 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-accent1 dark:text-accent2" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900 dark:text-fg">
                              {subscription.plan_name || 'Unknown Plan'}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {subscription.billing_cycle ? (
                                <span className="flex items-center gap-1">
                                  {getBillingCycleIcon(subscription.billing_cycle)}
                                  {subscription.billing_cycle}
                                </span>
                              ) : 'No cycle info'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-fg">
                        {subscription.client_name || 'Unknown Client'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-fg">
                        ${parseFloat(subscription.amount || '0').toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}>
                          {getStatusIcon(subscription.status)}
                          <span className="ml-1 capitalize">
                            {subscription.status || 'Unknown'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-2 text-slate-400" />
                          {subscription.next_billing_date ? new Date(subscription.next_billing_date).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedSubscription(subscription)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {subscription.status.toLowerCase() === 'active' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(subscription.id, 'paused')}
                                className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                                title="Pause Subscription"
                              >
                                <Pause className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(subscription.id, 'cancelled')}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                title="Cancel Subscription"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          
                          {subscription.status.toLowerCase() === 'paused' && (
                            <button
                              onClick={() => handleStatusChange(subscription.id, 'active')}
                              className="text-accent1 hover:text-emerald-900 dark:text-accent2 dark:hover:text-accent3 transition-colors"
                              title="Resume Subscription"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300 transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-slate-500 dark:text-slate-400">
                        <CreditCard className="mx-auto h-12 w-12 mb-4 text-slate-300 dark:text-slate-600" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-fg mb-2">No subscriptions found</h3>
                        <p className="text-sm mb-4">Try adjusting your search or filter criteria.</p>
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent1 to-accent600 text-fg font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Subscription
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Footer */}
        <div className="bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Info className="h-5 w-5" />
              <span className="text-sm">
                Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
              </span>
            </div>
            
            <div className="flex gap-2">
              <button className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-surface2 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </button>
              
              <button className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-surface2 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
