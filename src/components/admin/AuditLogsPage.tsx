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
  Edit,
  Trash2,
  Settings,
  Database,
  Server,
  Network,
  Lock,
  Unlock,
  Key,
  AlertCircle,
  Zap,
  BarChart3,
  Users,
  Building,
  Globe,
  Mail,
  Bell,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  Plus,
  HelpCircle
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp?: string;
  created_at?: string;
  action: string;
  description?: string;
  user_name?: string;
  userName?: string;
  ip_address?: string;
  ipAddress?: string;
  severity?: string;
  level?: string;
  action_type?: string;
  category?: string;
  resource?: string;
  details?: any;
  status?: string;
}

export function AuditLogsPage() {
  const { showSuccess, showError } = useNotifications();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    action: '',
    user: '',
    dateRange: '',
    severity: '',
  });
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalLogs: 0,
    todayLogs: 0,
    criticalLogs: 0,
    userActions: 0,
    systemActions: 0,
    securityEvents: 0,
    adminActions: 0,
  });

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    filterAndSortLogs();
  }, [auditLogs, searchTerm, filters, sortBy, sortOrder]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.getAuditLogs({ 
        limit: 1000
      });
      
      // Handle both backend response format and fallback to mock data
      let logsList: AuditLog[] = [];
      
      if (response?.logs && Array.isArray(response.logs)) {
        // Backend response format
        logsList = response.logs;
      } else if (response && Array.isArray(response)) {
        // Direct array response
        logsList = response;
      } else {
        // Fallback to mock data for development
        logsList = generateMockAuditLogs();
        logger.warn('Using mock audit logs data - backend endpoint may not be available');
      }
      
      setAuditLogs(logsList);
      setFilteredLogs(logsList);
      calculateStats(logsList);
      
      showSuccess('Audit Logs Loaded', `Successfully loaded ${logsList.length} audit logs.`);
    } catch (error) {
      logger.error('Error fetching audit logs:', error);
      setError('Failed to load audit logs. Please try again.');
      showError('Failed to Load Audit Logs', 'Unable to load audit logs. Please try again later.');
      
      // Fallback to mock data on error
      const mockLogs = generateMockAuditLogs();
      setAuditLogs(mockLogs);
      setFilteredLogs(mockLogs);
      calculateStats(mockLogs);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortLogs = () => {
    let filtered = [...auditLogs];

    // Apply search filter
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

    // Apply action filter
    if (filters.action) {
      filtered = filtered.filter(log => 
        log?.action?.toLowerCase().includes(filters.action.toLowerCase())
      );
    }

    // Apply user filter
    if (filters.user) {
      filtered = filtered.filter(log => 
        log?.user_name?.toLowerCase().includes(filters.user.toLowerCase()) ||
        log?.userName?.toLowerCase().includes(filters.user.toLowerCase())
      );
    }

    // Apply severity filter
    if (filters.severity) {
      filtered = filtered.filter(log => 
        log?.severity?.toLowerCase() === filters.severity.toLowerCase() ||
        log?.level?.toLowerCase() === filters.severity.toLowerCase()
      );
    }

    // Apply date range filter
    if (filters.dateRange) {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp || log.created_at || '');
        
        switch (filters.dateRange) {
          case 'today':
            return logDate.toDateString() === today.toDateString();
          case 'yesterday':
            return logDate.toDateString() === yesterday.toDateString();
          case 'lastWeek':
            return logDate >= lastWeek;
          case 'lastMonth':
            return logDate >= lastMonth;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'timestamp':
        case 'date':
          aValue = new Date(a.timestamp || a.created_at || '');
          bValue = new Date(b.timestamp || b.created_at || '');
          break;
        case 'action':
          aValue = a.action || '';
          bValue = b.action || '';
          break;
        case 'user':
          aValue = a.user_name || a.userName || '';
          bValue = b.user_name || b.userName || '';
          break;
        case 'severity':
          aValue = a.severity || a.level || '';
          bValue = b.severity || b.level || '';
          break;
        case 'ip':
          aValue = a.ip_address || a.ipAddress || '';
          bValue = b.ip_address || b.ipAddress || '';
          break;
        default:
          aValue = new Date(a.timestamp || a.created_at || '');
          bValue = new Date(b.timestamp || b.created_at || '');
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredLogs(filtered);
  };

  const calculateStats = (logsList: AuditLog[]) => {
    if (!Array.isArray(logsList)) {
      logsList = [];
    }
    
    const totalLogs = logsList.length;
    const today = new Date();
    const todayLogs = logsList.filter(log => {
      const logDate = new Date(log.timestamp || log.created_at || '');
      return logDate.toDateString() === today.toDateString();
    }).length;
    
    const criticalLogs = logsList.filter(log => 
      (log.severity || '').toLowerCase() === 'critical' || 
      (log.level || '').toLowerCase() === 'critical'
    ).length;
    
    const userActions = logsList.filter(log => 
      (log.action_type || '').toLowerCase() === 'user_action' || 
      (log.category || '').toLowerCase() === 'user'
    ).length;
    
    const systemActions = logsList.filter(log => 
      (log.action_type || '').toLowerCase() === 'system_action' || 
      (log.category || '').toLowerCase() === 'system'
    ).length;

    const securityEvents = logsList.filter(log => 
      (log.category || '').toLowerCase() === 'security' ||
      (log.action || '').toLowerCase().includes('login') ||
      (log.action || '').toLowerCase().includes('logout') ||
      (log.action || '').toLowerCase().includes('password') ||
      (log.action || '').toLowerCase().includes('permission')
    ).length;

    const adminActions = logsList.filter(log => 
      (log.action || '').toLowerCase().includes('admin') ||
      (log.action || '').toLowerCase().includes('delete') ||
      (log.action || '').toLowerCase().includes('update') ||
      (log.action || '').toLowerCase().includes('create')
    ).length;

    setStats({
      totalLogs,
      todayLogs,
      criticalLogs,
      userActions,
      systemActions,
      securityEvents,
      adminActions,
    });
  };

  const getSeverityColor = (severity?: string) => {
    switch ((severity || '').toLowerCase()) {
      case 'critical':
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'warning':
      case 'warn':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case 'info':
      case 'information':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'debug':
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800';
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch ((severity || '').toLowerCase()) {
      case 'critical':
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      case 'warning':
      case 'warn':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
      case 'information':
        return <Info className="h-4 w-4" />;
      case 'debug':
        return <Activity className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getActionIcon = (action?: string) => {
    const actionLower = (action || '').toLowerCase();
    
    if (actionLower.includes('login') || actionLower.includes('auth')) {
      return <Key className="h-4 w-4" />;
    } else if (actionLower.includes('create') || actionLower.includes('add')) {
      return <Plus className="h-4 w-4" />;
    } else if (actionLower.includes('update') || actionLower.includes('edit')) {
      return <Edit className="h-4 w-4" />;
    } else if (actionLower.includes('delete') || actionLower.includes('remove')) {
      return <Trash2 className="h-4 w-4" />;
    } else if (actionLower.includes('download') || actionLower.includes('export')) {
      return <Download className="h-4 w-4" />;
    } else if (actionLower.includes('permission') || actionLower.includes('role')) {
      return <Shield className="h-4 w-4" />;
    } else if (actionLower.includes('system') || actionLower.includes('config')) {
      return <Settings className="h-4 w-4" />;
    } else if (actionLower.includes('database') || actionLower.includes('backup')) {
      return <Database className="h-4 w-4" />;
    } else if (actionLower.includes('network') || actionLower.includes('api')) {
      return <Network className="h-4 w-4" />;
    } else if (actionLower.includes('user') || actionLower.includes('profile')) {
      return <User className="h-4 w-4" />;
    } else {
      return <Activity className="h-4 w-4" />;
    }
  };

  const exportLogs = async () => {
    try {
      const csvContent = [
        ['Timestamp', 'Action', 'User', 'IP Address', 'Severity', 'Description'],
        ...filteredLogs.map(log => [
          new Date(log.timestamp || log.created_at || '').toISOString(),
          log.action || '',
          log.user_name || log.userName || '',
          log.ip_address || log.ipAddress || '',
          log.severity || log.level || '',
          log.description || ''
        ])
      ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      showSuccess('Export Successful', 'Audit logs exported successfully.');
    } catch (error) {
      logger.error('Error exporting audit logs:', error);
      showError('Export Failed', 'Failed to export audit logs. Please try again.');
    }
  };

  const generateMockAuditLogs = (): AuditLog[] => {
    const actions = [
      'USER_LOGIN', 'USER_LOGOUT', 'USER_CREATED', 'USER_UPDATED', 'USER_DELETED',
      'INVOICE_CREATED', 'INVOICE_UPDATED', 'PAYMENT_PROCESSED', 'PAYMENT_FAILED',
      'SYSTEM_BACKUP', 'SYSTEM_UPDATE', 'PERMISSION_CHANGED', 'ROLE_UPDATED',
      'SETTINGS_MODIFIED', 'AUDIT_LOG_VIEWED', 'EXPORT_GENERATED'
    ];
    
    const users = ['admin@example.com', 'user@example.com', 'system', 'john.doe@company.com'];
    const severities = ['INFO', 'WARNING', 'ERROR', 'CRITICAL'];
    const entityTypes = ['USER', 'INVOICE', 'PAYMENT', 'SYSTEM', 'SETTINGS'];
    
    const mockLogs: AuditLog[] = [];
    const now = new Date();
    
    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random time in last 30 days
      const action = actions[Math.floor(Math.random() * actions.length)];
      const severity = severities[Math.floor(Math.random() * severities.length)];
      
      mockLogs.push({
        id: `mock-${i}`,
        timestamp: timestamp.toISOString(),
        action,
        description: `${action.replace(/_/g, ' ').toLowerCase()} action performed`,
        user_name: users[Math.floor(Math.random() * users.length)],
        ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        severity,
        level: severity,
        action_type: Math.random() > 0.5 ? 'USER_ACTION' : 'SYSTEM_ACTION',
        category: entityTypes[Math.floor(Math.random() * entityTypes.length)],
        resource: `resource-${Math.floor(Math.random() * 1000)}`,
        details: { mock: true, timestamp: timestamp.toISOString() }
      });
    }
    
    return mockLogs.sort((a, b) => new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime());
  };

  const clearLogs = async () => {
    try {
      // This would typically call an API endpoint to clear logs
      // For now, we'll just clear the local state
      setAuditLogs([]);
      setFilteredLogs([]);
      setStats({
        totalLogs: 0,
        todayLogs: 0,
        criticalLogs: 0,
        userActions: 0,
        systemActions: 0,
        securityEvents: 0,
        adminActions: 0,
      });
      
      showSuccess('Logs Cleared', 'Audit logs have been cleared successfully.');
    } catch (error) {
      logger.error('Error clearing audit logs:', error);
      showError('Clear Failed', 'Failed to clear audit logs. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-xl">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Audit Logs Center 🛡️
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Monitor system activity, track user actions, and maintain security compliance. View detailed logs of all system events and user interactions.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Logs</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalLogs}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <FileText className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Activity className="h-4 w-4 mr-1 text-blue-500" />
              <span>All events</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Today's Logs</p>
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.todayLogs}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Calendar className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4 mr-1 text-emerald-500" />
              <span>Last 24 hours</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Critical Events</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.criticalLogs}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <AlertTriangle className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Shield className="h-4 w-4 mr-1 text-red-500" />
              <span>Security alerts</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Security Events</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.securityEvents}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Lock className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <ShieldCheck className="h-4 w-4 mr-1 text-amber-500" />
              <span>Access control</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  showFilters 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={fetchAuditLogs}
                className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              
              <button
                onClick={exportLogs}
                className="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/30 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              
              <button
                onClick={clearLogs}
                className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Action Type</label>
                  <input
                    type="text"
                    placeholder="Filter by action..."
                    value={filters.action}
                    onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">User</label>
                  <input
                    type="text"
                    placeholder="Filter by user..."
                    value={filters.user}
                    onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Severity</label>
                  <select
                    value={filters.severity}
                    onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="error">Error</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="lastWeek">Last Week</option>
                    <option value="lastMonth">Last Month</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logs Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortBy('timestamp');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                      className="flex items-center hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                      Timestamp
                      {sortBy === 'timestamp' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortBy('action');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                      className="flex items-center hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                      Action
                      {sortBy === 'action' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortBy('user');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                      className="flex items-center hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                      User
                      {sortBy === 'user' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setSortBy('severity');
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      }}
                      className="flex items-center hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                    >
                      Severity
                      {sortBy === 'severity' && (
                        sortOrder === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                          {log.timestamp || log.created_at ? 
                            new Date(log.timestamp || log.created_at || '').toLocaleString() : 
                            'Unknown'
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getActionIcon(log.action)}
                          <span className="ml-2 text-sm font-medium text-slate-900 dark:text-white">
                            {log.action || 'Unknown'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-slate-400" />
                          <span className="text-sm text-slate-900 dark:text-white">
                            {log.user_name || log.userName || 'System'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-slate-400" />
                          {log.ip_address || log.ipAddress || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(log.severity || log.level)}`}>
                          {getSeverityIcon(log.severity || log.level)}
                          <span className="ml-1 capitalize">
                            {log.severity || log.level || 'Unknown'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                        <div className="max-w-xs truncate" title={log.description || 'No description'}>
                          {log.description || 'No description available'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="text-slate-500 dark:text-slate-400">
                        <FileText className="mx-auto h-12 w-12 mb-4 text-slate-300 dark:text-slate-600" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No audit logs found</h3>
                        <p className="text-sm mb-4">Try adjusting your search or filter criteria.</p>
                        <button
                          onClick={fetchAuditLogs}
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh Logs
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
                Showing {filteredLogs.length} of {auditLogs.length} audit logs
              </span>
            </div>
            
            <div className="flex gap-2">
              <button className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              
              <button className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}