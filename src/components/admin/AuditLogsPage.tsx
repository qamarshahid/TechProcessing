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
  Download,
  AlertTriangle,
  CheckCircle,
  Info,
  Shield,
  Activity,
  Clock,
  TrendingUp,
  Edit
} from 'lucide-react';

export function AuditLogsPage() {
  const { showSuccess, showError } = useNotifications();
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    action: '',
    user: '',
    dateRange: '',
    severity: '',
  });
  const [stats, setStats] = useState({
    totalLogs: 0,
    todayLogs: 0,
    criticalLogs: 0,
    userActions: 0,
    systemActions: 0,
  });

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [auditLogs, searchTerm, filters]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAuditLogs({ 
        limit: 1000,
        includeDetails: true 
      });
      const logsList = response?.logs || [];
      
      // Ensure we always have an array
      const safeLogsList = Array.isArray(logsList) ? logsList : [];
      setAuditLogs(safeLogsList);
      setFilteredLogs(safeLogsList);
      calculateStats(safeLogsList);
      showSuccess('Audit Logs Loaded', `Successfully loaded ${safeLogsList.length} audit logs.`);
    } catch (error) {
      logger.error('Error fetching audit logs:', error);
      showError('Failed to Load Audit Logs', 'Unable to load audit logs. Please try again later.');
      setAuditLogs([]);
      setFilteredLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (logsList: any[]) => {
    if (!Array.isArray(logsList)) {
      logsList = [];
    }
    
    const totalLogs = logsList.length;
    const today = new Date();
    const todayLogs = logsList.filter(log => {
      const logDate = new Date(log.timestamp || log.created_at);
      return logDate.toDateString() === today.toDateString();
    }).length;
    
    const criticalLogs = logsList.filter(log => 
      log.severity === 'CRITICAL' || log.level === 'CRITICAL'
    ).length;
    
    const userActions = logsList.filter(log => 
      log.action_type === 'USER_ACTION' || log.category === 'USER'
    ).length;
    
    const systemActions = logsList.filter(log => 
      log.action_type === 'SYSTEM_ACTION' || log.category === 'SYSTEM'
    ).length;

    setStats({
      totalLogs,
      todayLogs,
      criticalLogs,
      userActions,
      systemActions,
    });
  };

  const filterLogs = () => {
    // Ensure auditLogs is always an array
    const safeLogs = Array.isArray(auditLogs) ? auditLogs : [];
    let filtered = [...safeLogs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log?.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log?.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log?.ip_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log?.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Action filter
    if (filters.action) {
      filtered = filtered.filter(log => 
        log?.action?.toLowerCase().includes(filters.action.toLowerCase())
      );
    }

    // User filter
    if (filters.user) {
      filtered = filtered.filter(log => 
        log?.user_name?.toLowerCase().includes(filters.user.toLowerCase()) ||
        log?.userName?.toLowerCase().includes(filters.user.toLowerCase())
      );
    }

    // Severity filter
    if (filters.severity) {
      filtered = filtered.filter(log => 
        log?.severity?.toLowerCase() === filters.severity.toLowerCase() ||
        log?.level?.toLowerCase() === filters.severity.toLowerCase()
      );
    }

    setFilteredLogs(filtered);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'error':
        return 'bg-red-100 text-red-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    const actionLower = action?.toLowerCase();
    if (actionLower?.includes('login') || actionLower?.includes('auth')) {
      return <Shield className="w-4 h-4 text-blue-500" />;
    } else if (actionLower?.includes('create') || actionLower?.includes('add')) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (actionLower?.includes('update') || actionLower?.includes('edit')) {
      return <Edit className="w-4 h-4 text-blue-500" />;
    } else if (actionLower?.includes('delete') || actionLower?.includes('remove')) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    } else if (actionLower?.includes('payment') || actionLower?.includes('transaction')) {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else {
      return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch {
      return timestamp;
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
  const safeFilteredLogs = Array.isArray(filteredLogs) ? filteredLogs : [];
  const safeAuditLogs = Array.isArray(auditLogs) ? auditLogs : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Logs</h1>
        <p className="text-gray-600">Monitor system activity and user actions for security and compliance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Logs</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalLogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.todayLogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.criticalLogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">User Actions</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.userActions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">System</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.systemActions}</p>
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
                  placeholder="Search logs by action, description, user, or IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Actions</option>
                <option value="login">Login</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="payment">Payment</option>
              </select>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Severities</option>
                <option value="critical">Critical</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
              </select>
              <button
                onClick={fetchAuditLogs}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">System Activity Log</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeFilteredLogs.map((log) => (
                <tr key={log?.id || Math.random()} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      {formatTimestamp(log?.timestamp || log?.created_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getActionIcon(log?.action)}
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {log?.action || 'Unknown Action'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {log?.user_name || log?.userName || 'System'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log?.severity || log?.level)}`}>
                      {getSeverityIcon(log?.severity || log?.level)}
                      <span className="ml-1 capitalize">
                        {log?.severity || log?.level || 'Unknown'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={log?.description || 'No description'}>
                      {log?.description || 'No description available'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log?.ip_address || log?.ipAddress || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="View log details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Download log entry"
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
        
        {safeFilteredLogs.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No audit logs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {safeAuditLogs.length === 0 ? 'No audit logs available.' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}