import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { useNotifications } from '../common/NotificationSystem';
import { logger } from '../../lib/logger';
import {
  FileText, DollarSign, Clock, CheckCircle, XCircle, RefreshCw, Search, Eye, Edit, Trash2, Filter, TrendingUp, BarChart3, Activity, Shield, AlertCircle, Info, Calendar, User, Building, ArrowUpDown, ChevronDown, ChevronUp, Settings, HelpCircle, Zap, Rocket, Plus, Star, Tag, Layers, CalendarDays, MessageSquare, Phone, Mail, MapPin, Clock3, Receipt, ArrowLeftRight, MessageCircle, AlertTriangle, CheckSquare, Ban, Play, Pause, Code, Palette
} from 'lucide-react';

interface ServiceRequest {
  id: string;
  client_name?: string;
  service_type?: string;
  description?: string;
  status: string;
  priority?: string;
  created_at?: string;
  updated_at?: string;
  assigned_to?: string;
  estimated_cost?: string;
  deadline?: string;
  contact_email?: string;
  contact_phone?: string;
}

export function ServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterAndSortRequests();
  }, [requests, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.getServiceRequests();
      const requestsList = response?.serviceRequests || [];
      
      setRequests(requestsList);
      setFilteredRequests(requestsList);
      
      showSuccess('Requests Loaded', 'Service request data loaded successfully.');
    } catch (error) {
      logger.error('Error fetching service requests:', error);
      setError('Failed to load service requests. Please try again.');
      showError('Request Error', 'Failed to load service requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortRequests = () => {
    let filtered = [...requests];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.service_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => (request.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(request => request.priority?.toLowerCase() === priorityFilter.toLowerCase());
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'cost':
          aValue = parseFloat(a.estimated_cost || '0');
          bValue = parseFloat(b.estimated_cost || '0');
          break;
        case 'date':
          aValue = new Date(a.created_at || a.updated_at || '');
          bValue = new Date(b.created_at || b.updated_at || '');
          break;
        case 'status':
          aValue = (a.status || '').toLowerCase();
          bValue = (b.status || '').toLowerCase();
          break;
        case 'priority':
          aValue = a.priority || '';
          bValue = b.priority || '';
          break;
        case 'deadline':
          aValue = new Date(a.deadline || '');
          bValue = new Date(b.deadline || '');
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

    setFilteredRequests(filtered);
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      // Update local state for now (API call would be implemented later)
      setRequests(prev => prev.map(r => 
        r.id === requestId ? { ...r, status: newStatus } : r
      ));
      
      showSuccess('Status Updated', `Request status updated to ${newStatus}`);
    } catch (error) {
      logger.error('Error updating request status:', error);
      showError('Update Failed', 'Failed to update request status. Please try again.');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'in_progress':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
      case 'pending':
      case 'under_review':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
      case 'in_progress':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
      case 'under_review':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckSquare className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'urgent':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case 'low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
      case 'urgent':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Clock className="h-4 w-4" />;
      case 'low':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getServiceTypeIcon = (serviceType: string) => {
    switch (serviceType?.toLowerCase()) {
      case 'consulting':
        return <User className="h-4 w-4" />;
      case 'development':
        return <Code className="h-4 w-4" />;
      case 'design':
        return <Palette className="h-4 w-4" />;
      case 'marketing':
        return <TrendingUp className="h-4 w-4" />;
      case 'support':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const calculateStats = () => {
    const total = requests.length;
    const pending = requests.filter(r => r.status.toLowerCase() === 'pending' || r.status.toLowerCase() === 'under_review').length;
    const inProgress = requests.filter(r => r.status.toLowerCase() === 'approved' || r.status.toLowerCase() === 'in_progress').length;
    const completed = requests.filter(r => r.status.toLowerCase() === 'completed').length;
    const totalValue = requests.reduce((sum, r) => sum + parseFloat(r.estimated_cost || '0'), 0);
    const avgValue = total > 0 ? totalValue / total : 0;

    return { total, pending, inProgress, completed, totalValue, avgValue };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="text-center">
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3 mx-auto mb-4"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
            </div>
            
            {/* Stats grid skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              ))}
            </div>
            
            {/* Table skeleton */}
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl mb-6 shadow-xl">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Service Request Center 📋
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Manage, track, and process client service requests efficiently. Monitor priorities, assign resources, and ensure timely delivery of exceptional service.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <FileText className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Activity className="h-4 w-4 mr-1 text-orange-500" />
              <span>All requests</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Pending</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Clock className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Clock3 className="h-4 w-4 mr-1 text-amber-500" />
              <span>Awaiting review</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.inProgress}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Zap className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <TrendingUp className="h-4 w-4 mr-1 text-emerald-500" />
              <span>Active work</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Value</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <BarChart3 className="h-4 w-4 mr-1 text-blue-500" />
              <span>Estimated value</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
                
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="urgent">Urgent</option>
                </select>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 rounded-xl border transition-all duration-200 flex items-center gap-2 ${
                    showFilters
                      ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-400'
                      : 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300'
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
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </button>
              
              <button
                onClick={fetchRequests}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date">Date</option>
                    <option value="cost">Cost</option>
                    <option value="status">Status</option>
                    <option value="priority">Priority</option>
                    <option value="deadline">Deadline</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Sort Order</label>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                  >
                    {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                    <ArrowUpDown className="h-4 w-4" />
                  </button>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Service Type</label>
                  <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">All Types</option>
                    <option value="consulting">Consulting</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="support">Support</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Requests Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Service Requests</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Request Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              {request.service_type || 'Unknown Service'}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {request.description ? (
                                <span className="line-clamp-1">{request.description}</span>
                              ) : 'No description'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 dark:text-white">
                          {request.client_name || 'Unknown Client'}
                        </div>
                        {request.contact_email && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                            <Mail className="h-3 w-3" />
                            {request.contact_email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                          {getPriorityIcon(request.priority)}
                          <span className="ml-1 capitalize">
                            {request.priority || 'Unknown'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">
                            {request.status || 'Unknown'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-2 text-slate-400" />
                          {request.deadline ? new Date(request.deadline).toLocaleDateString() : 'No deadline'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                                                                                {request.status?.toLowerCase() === 'pending' && (
                             <>
                               <button
                                 onClick={() => handleStatusChange(request.id, 'approved')}
                                 className="text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                                 title="Approve Request"
                               >
                                 <CheckCircle className="w-4 h-4" />
                               </button>
                               <button
                                 onClick={() => handleStatusChange(request.id, 'rejected')}
                                 className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                 title="Reject Request"
                               >
                                 <XCircle className="w-4 h-4" />
                               </button>
                             </>
                           )}
                           
                           {request.status?.toLowerCase() === 'approved' && (
                             <button
                               onClick={() => handleStatusChange(request.id, 'in_progress')}
                               className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                               title="Start Work"
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
                        <FileText className="mx-auto h-12 w-12 mb-4 text-slate-300 dark:text-slate-600" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No requests found</h3>
                        <p className="text-sm mb-4">Try adjusting your search or filter criteria.</p>
                        <button
                          onClick={() => setShowAddModal(true)}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create First Request
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
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Info className="h-5 w-5" />
              <span className="text-sm">
                Showing {filteredRequests.length} of {requests.length} requests
              </span>
            </div>
            
            <div className="flex gap-2">
              <button className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </button>
              
              <button className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
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