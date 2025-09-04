import React, { useState, useEffect } from 'react';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { 
  FileText, 
  User, 
  Calendar, 
  Filter, 
  Search, 
  RefreshCw, 
  Eye, 
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  MessageSquare,
  Phone,
  Mail,
  Building,
  Package,
  DollarSign,
  TrendingUp,
  Edit,
  Plus
} from 'lucide-react';

export function ServiceRequestsPage() {
  const { showSuccess, showError } = useNotifications();
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    dateRange: '',
  });
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    inProgressRequests: 0,
    completedRequests: 0,
    cancelledRequests: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [serviceRequests, searchTerm, filters]);

  const fetchServiceRequests = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getServiceRequests({ 
        includeAll: true,
        includeClientDetails: true 
      });
      const requestsList = response?.serviceRequests || [];
      
      // Ensure we always have an array
      const safeRequestsList = Array.isArray(requestsList) ? requestsList : [];
      setServiceRequests(safeRequestsList);
      setFilteredRequests(safeRequestsList);
      calculateStats(safeRequestsList);
      showSuccess('Service Requests Loaded', `Successfully loaded ${safeRequestsList.length} service requests.`);
    } catch (error) {
      logger.error('Error fetching service requests:', error);
      showError('Failed to Load Service Requests', 'Unable to load service requests. Please try again later.');
      setServiceRequests([]);
      setFilteredRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (requestsList: any[]) => {
    if (!Array.isArray(requestsList)) {
      requestsList = [];
    }
    
    const totalRequests = requestsList.length;
    const pendingRequests = requestsList.filter(r => 
      r.status === 'PENDING' || r.status === 'NEW'
    ).length;
    const inProgressRequests = requestsList.filter(r => 
      r.status === 'IN_PROGRESS' || r.status === 'WORKING'
    ).length;
    const completedRequests = requestsList.filter(r => 
      r.status === 'COMPLETED' || r.status === 'DONE'
    ).length;
    const cancelledRequests = requestsList.filter(r => 
      r.status === 'CANCELLED' || r.status === 'CLOSED'
    ).length;
    
    const totalRevenue = requestsList.reduce((sum, request) => 
      sum + parseFloat(request?.estimatedCost || request?.cost || '0'), 0
    );

    setStats({
      totalRequests,
      pendingRequests,
      inProgressRequests,
      completedRequests,
      cancelledRequests,
      totalRevenue,
    });
  };

  const filterRequests = () => {
    // Ensure serviceRequests is always an array
    const safeRequests = Array.isArray(serviceRequests) ? serviceRequests : [];
    let filtered = [...safeRequests];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request?.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request?.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request?.request_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request?.requestId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(request => 
        request?.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(request => 
        request?.priority?.toLowerCase() === filters.priority.toLowerCase()
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(request => 
        request?.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    setFilteredRequests(filtered);
  };

  const handleRequestAction = async (requestId: string, action: 'approve' | 'reject' | 'start' | 'complete' | 'cancel') => {
    try {
      let newStatus = '';
      let message = '';
      
      switch (action) {
        case 'approve':
          newStatus = 'APPROVED';
          message = 'Service request approved successfully.';
          break;
        case 'reject':
          newStatus = 'REJECTED';
          message = 'Service request rejected.';
          break;
        case 'start':
          newStatus = 'IN_PROGRESS';
          message = 'Service request started.';
          break;
        case 'complete':
          newStatus = 'COMPLETED';
          message = 'Service request completed.';
          break;
        case 'cancel':
          newStatus = 'CANCELLED';
          message = 'Service request cancelled.';
          break;
      }
      
      showSuccess('Request Updated', message);
      
      setServiceRequests(prev => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return safePrev.map(request => 
          request?.id === requestId || request?.request_id === requestId
            ? { ...request, status: newStatus }
            : request
        );
      });
      
      fetchServiceRequests(); // Refresh data
    } catch (error) {
      logger.error(`Error ${action}ing service request:`, error);
      showError('Action Failed', `Failed to ${action} service request. Please try again.`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'new':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
      case 'working':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'completed':
      case 'done':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
      case 'cancelled':
      case 'closed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
      case 'working':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
      case 'done':
        return 'bg-green-100 text-green-700';
      case 'rejected':
      case 'cancelled':
      case 'closed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
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
  const safeFilteredRequests = Array.isArray(filteredRequests) ? filteredRequests : [];
  const safeServiceRequests = Array.isArray(serviceRequests) ? serviceRequests : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Requests</h1>
        <p className="text-gray-600">Manage and track service requests from clients</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalRequests}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.inProgressRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedRequests}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{stats.cancelledRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests by title, description, client, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="consulting">Consulting</option>
                <option value="development">Development</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="support">Support</option>
              </select>
              <button
                onClick={fetchServiceRequests}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Requests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Client Service Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estimated Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeFilteredRequests.map((request) => (
                <tr key={request?.id || request?.request_id || Math.random()} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {request?.title || 'Untitled Request'}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {request?.description || 'No description'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request?.client_name || request?.clientName || 'Unknown Client'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request?.client_email || request?.clientEmail || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <Package className="w-3 h-3 mr-1" />
                      {request?.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request?.priority)}`}>
                      {request?.priority || 'Medium'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request?.status)}`}>
                      {getStatusIcon(request?.status)}
                      <span className="ml-1 capitalize">
                        {request?.status || 'Unknown'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${parseFloat(request?.estimatedCost || request?.cost || '0').toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(request?.created_at || request?.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="View request details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit request"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Send message"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      {request?.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleRequestAction(request?.id || request?.request_id, 'approve')}
                            className="text-green-600 hover:text-green-900"
                            title="Approve request"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRequestAction(request?.id || request?.request_id, 'reject')}
                            className="text-red-600 hover:text-red-900"
                            title="Reject request"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {request?.status === 'APPROVED' && (
                        <button
                          onClick={() => handleRequestAction(request?.id || request?.request_id, 'start')}
                          className="text-blue-600 hover:text-blue-900"
                          title="Start work"
                        >
                          <TrendingUp className="w-4 h-4" />
                        </button>
                      )}
                      {request?.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleRequestAction(request?.id || request?.request_id, 'complete')}
                          className="text-green-600 hover:text-green-900"
                          title="Mark complete"
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
        
        {safeFilteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No service requests found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {safeServiceRequests.length === 0 ? 'No service requests available.' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}