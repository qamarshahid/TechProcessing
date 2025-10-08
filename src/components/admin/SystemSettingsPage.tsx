import React, { useState, useEffect } from 'react';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import {
  Settings,
  Shield,
  Bell,
  Database,
  Server,
  Globe,
  Lock,
  Unlock,
  Key,
  Users,
  Activity,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Calendar,
  Mail,
  Smartphone,
  Monitor,
  HardDrive,
  Zap,
  Wifi,
  Database as DatabaseIcon,
  FileText,
  Download,
  Upload,
  Trash2,
  Play,
  Pause,
  RotateCcw,
  Power,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Edit,
  HelpCircle,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckSquare,
  XCircle
} from 'lucide-react';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    timezone: string;
    language: string;
    maintenanceMode: boolean;
    debugMode: boolean;
  };
  security: {
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireTwoFactor: boolean;
    allowedIPs: string[];
    sslRequired: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    adminAlerts: boolean;
    userAlerts: boolean;
    systemAlerts: boolean;
  };
  performance: {
    cacheEnabled: boolean;
    cacheTTL: number;
    maxConnections: number;
    compressionEnabled: boolean;
    imageOptimization: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: string;
    backupRetention: number;
    backupLocation: string;
    encryptionEnabled: boolean;
  };
}

export function SystemSettingsPage() {
  const { showSuccess, showError } = useNotifications();
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'TechProcessing Platform',
      siteDescription: 'Professional IT Services Management Platform',
      timezone: 'UTC',
      language: 'en',
      maintenanceMode: false,
      debugMode: false,
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      requireTwoFactor: false,
      allowedIPs: [],
      sslRequired: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminAlerts: true,
      userAlerts: false,
      systemAlerts: true,
    },
    performance: {
      cacheEnabled: true,
      cacheTTL: 3600,
      maxConnections: 100,
      compressionEnabled: true,
      imageOptimization: true,
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      backupRetention: 30,
      backupLocation: '/backups',
      encryptionEnabled: true,
    },
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['general']));
  const [systemStatus, setSystemStatus] = useState({
    uptime: '0 days, 0 hours',
    memoryUsage: '0%',
    cpuUsage: '0%',
    diskUsage: '0%',
    activeUsers: 0,
    activeUsersByRole: {
      total: 0,
      byRole: { ADMIN: 0, AGENT: 0, CLIENT: 0, CLOSER: 0 },
      details: { admins: [], agents: [], clients: [], closers: [] }
    },
    databaseConnections: 0,
    // Enhanced system data
    memory: {
      usage: '0%',
      total: 0,
      used: 0,
      free: 0,
      processHeap: 0,
      processRss: 0,
    },
    cpu: {
      usage: '0%',
      loadAverage: 0,
      cores: 0,
      model: 'Unknown',
    },
    disk: {
      usage: '0%',
      total: 0,
      used: 0,
      free: 0,
    },
    system: {
      platform: 'Unknown',
      arch: 'Unknown',
      nodeVersion: 'Unknown',
      pid: 0,
    },
    network: {
      interfaces: 0,
      hostname: 'Unknown',
    },
  });

  useEffect(() => {
    fetchSettings();
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getSystemSettings();
      if (response?.settings) {
        setSettings(response.settings);
      }
      showSuccess('Settings Loaded', 'System settings loaded successfully.');
    } catch (error) {
      logger.error('Error fetching system settings:', error);
      showError('Failed to Load Settings', 'Unable to load system settings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const response = await apiClient.getSystemStatus();
      console.log('System Status Response:', response); // Debug log
      // The API returns the data directly - use the full response object
      const status = response;
      console.log('System Status Data:', status); // Debug log
      console.log('Active Users Data:', status.activeUsers); // Debug log
      setSystemStatus({
        uptime: status.uptime || '0 days, 0 hours',
        memoryUsage: status.memory?.usage || '0%',
        cpuUsage: status.cpu?.usage || '0%',
        diskUsage: status.disk?.usage || '0%',
        activeUsers: status.activeUsers?.total || 0,
        activeUsersByRole: status.activeUsers || {
          total: 0,
          byRole: { ADMIN: 0, AGENT: 0, CLIENT: 0, CLOSER: 0 },
          details: { admins: [], agents: [], clients: [], closers: [] }
        },
        databaseConnections: status.databaseConnections || 0,
        // Enhanced system data
        memory: {
          usage: status.memory?.usage || '0%',
          total: status.memory?.total || 0,
          used: status.memory?.used || 0,
          free: status.memory?.free || 0,
          processHeap: status.memory?.processHeap || 0,
          processRss: status.memory?.processRss || 0,
        },
        cpu: {
          usage: status.cpu?.usage || '0%',
          loadAverage: status.cpu?.loadAverage || 0,
          cores: status.cpu?.cores || 0,
          model: status.cpu?.model || 'Unknown',
        },
        disk: {
          usage: status.disk?.usage || '0%',
          total: status.disk?.total || 0,
          used: status.disk?.used || 0,
          free: status.disk?.free || 0,
        },
        system: {
          platform: status.system?.platform || 'Unknown',
          arch: status.system?.arch || 'Unknown',
          nodeVersion: status.system?.nodeVersion || 'Unknown',
          pid: status.system?.pid || 0,
        },
        network: {
          interfaces: status.network?.interfaces || 0,
          hostname: status.network?.hostname || 'Unknown',
        },
      });
    } catch (error) {
      logger.error('Error fetching system status:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await apiClient.updateSystemSettings(settings);
      showSuccess('Settings Saved', 'System settings updated successfully.');
    } catch (error) {
      logger.error('Error saving system settings:', error);
      showError('Save Failed', 'Failed to save system settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateSetting = (category: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const addAllowedIP = () => {
    const newIP = prompt('Enter IP address:');
    if (newIP && /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(newIP)) {
      updateSetting('security', 'allowedIPs', [...settings.security.allowedIPs, newIP]);
    }
  };

  const removeAllowedIP = (index: number) => {
    const newIPs = settings.security.allowedIPs.filter((_, i) => i !== index);
    updateSetting('security', 'allowedIPs', newIPs);
  };

  const toggleMaintenanceMode = async () => {
    try {
      const newMode = !settings.general.maintenanceMode;
      updateSetting('general', 'maintenanceMode', newMode);
      await apiClient.toggleMaintenanceMode(newMode);
      showSuccess(
        newMode ? 'Maintenance Mode Enabled' : 'Maintenance Mode Disabled',
        `System is now ${newMode ? 'in maintenance mode' : 'operational'}`
      );
    } catch (error) {
      logger.error('Error toggling maintenance mode:', error);
      showError('Toggle Failed', 'Failed to toggle maintenance mode. Please try again.');
      // Revert the change
      updateSetting('general', 'maintenanceMode', !settings.general.maintenanceMode);
    }
  };

  const clearCache = async () => {
    try {
      await apiClient.clearCache();
      showSuccess('Cache Cleared', 'System cache has been cleared successfully.');
    } catch (error) {
      logger.error('Error clearing cache:', error);
      showError('Clear Failed', 'Failed to clear cache. Please try again.');
    }
  };

  const createBackup = async () => {
    try {
      await apiClient.createBackup();
      showSuccess('Backup Created', 'System backup has been created successfully.');
    } catch (error) {
      logger.error('Error creating backup:', error);
      showError('Backup Failed', 'Failed to create backup. Please try again.');
    }
  };

  const restartSystem = async () => {
    if (confirm('Are you sure you want to restart the system? This will cause temporary downtime.')) {
      try {
        await apiClient.restartSystem();
        showSuccess('System Restart', 'System restart initiated. Please wait a few minutes.');
      } catch (error) {
        logger.error('Error restarting system:', error);
        showError('Restart Failed', 'Failed to restart system. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="text-center">
              <div className="h-12 bg-slate-200 dark:bg-surface2 rounded-lg w-1/3 mx-auto mb-4"></div>
              <div className="h-6 bg-slate-200 dark:bg-surface2 rounded w-1/2 mx-auto"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="h-96 bg-slate-200 dark:bg-surface2 rounded-xl"></div>
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
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 shadow-xl">
            <Settings className="h-10 w-10 text-fg" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-fg mb-4">
            System Settings Center ⚙️
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Configure system preferences, security settings, and performance options. Manage notifications, backups, and system maintenance.
          </p>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">System Uptime</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-fg">{systemStatus.uptime}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-accent1 to-accent600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Clock className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Activity className="h-4 w-4 mr-1 text-accent1" />
              <span>Stable operation</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Memory Usage</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{systemStatus.memoryUsage}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {systemStatus.memory.used}GB / {systemStatus.memory.total}GB
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <HardDrive className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-1 text-amber-500" />
                <span>RAM utilization</span>
              </div>
              <div className="text-xs">
                Process: {systemStatus.memory.processRss}MB
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">CPU Usage</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{systemStatus.cpuUsage}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Load: {systemStatus.cpu.loadAverage.toFixed(2)} ({systemStatus.cpu.cores} cores)
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Zap className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                <span>Processor load</span>
              </div>
              <div className="text-xs">
                {systemStatus.cpu.model}
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Active Users</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{systemStatus.activeUsers}</p>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span>Admin: {systemStatus.activeUsersByRole?.byRole?.ADMIN || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Agent: {systemStatus.activeUsersByRole?.byRole?.AGENT || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-accent500 rounded-full"></span>
                    <span>Client: {systemStatus.activeUsersByRole?.byRole?.CLIENT || 0}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Closer: {systemStatus.activeUsersByRole?.byRole?.CLOSER || 0}</span>
                  </div>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Users className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center">
                <Activity className="h-4 w-4 mr-1 text-purple-500" />
                <span>Current sessions</span>
              </div>
              <div className="text-xs">
                DB: {systemStatus.databaseConnections}
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Disk Usage</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{systemStatus.diskUsage}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {systemStatus.disk.used}GB / {systemStatus.disk.total}GB
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Database className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-1 text-indigo-500" />
                <span>Storage utilization</span>
              </div>
              <div className="text-xs">
                Free: {systemStatus.disk.free}GB
              </div>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-slate-200 dark:border-outline">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'general', label: 'General', icon: Settings },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'performance', label: 'Performance', icon: Zap },
                { id: 'backup', label: 'Backup', icon: Database },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 inline mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.general.siteName}
                      onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Timezone
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.general.siteDescription}
                    onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface2/50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-fg">Maintenance Mode</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Enable to show maintenance page to users
                    </p>
                  </div>
                  <button
                    onClick={toggleMaintenanceMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.general.maintenanceMode ? 'bg-red-600' : 'bg-slate-200 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.general.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="1440"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Max Login Attempts
                    </label>
                    <input
                      type="number"
                      min="3"
                      max="10"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface2/50 rounded-lg">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-fg">Two-Factor Authentication</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Require 2FA for all users
                    </p>
                  </div>
                  <button
                    onClick={() => updateSetting('security', 'requireTwoFactor', !settings.security.requireTwoFactor)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.security.requireTwoFactor ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.security.requireTwoFactor ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Allowed IP Addresses
                  </label>
                  <div className="space-y-2">
                    {settings.security.allowedIPs.map((ip, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={ip}
                          onChange={(e) => {
                            const newIPs = [...settings.security.allowedIPs];
                            newIPs[index] = e.target.value;
                            updateSetting('security', 'allowedIPs', newIPs);
                          }}
                          className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => removeAllowedIP(index)}
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addAllowedIP}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add IP Address
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface2/50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-fg">Email Notifications</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Send notifications via email</p>
                    </div>
                    <button
                      onClick={() => updateSetting('notifications', 'emailNotifications', !settings.notifications.emailNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.emailNotifications ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface2/50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-fg">SMS Notifications</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Send notifications via SMS</p>
                    </div>
                    <button
                      onClick={() => updateSetting('notifications', 'smsNotifications', !settings.notifications.smsNotifications)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.smsNotifications ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface2/50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-fg">Admin Alerts</h3>
                    </div>
                    <button
                      onClick={() => updateSetting('notifications', 'adminAlerts', !settings.notifications.adminAlerts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.adminAlerts ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications.adminAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface2/50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-fg">User Alerts</h3>
                    </div>
                    <button
                      onClick={() => updateSetting('notifications', 'userAlerts', !settings.notifications.userAlerts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.userAlerts ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications.userAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface2/50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-fg">System Alerts</h3>
                    </div>
                    <button
                      onClick={() => updateSetting('notifications', 'systemAlerts', !settings.notifications.systemAlerts)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.systemAlerts ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications.systemAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Settings */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface2/50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-fg">Enable Caching</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Improve performance with caching</p>
                    </div>
                    <button
                      onClick={() => updateSetting('performance', 'cacheEnabled', !settings.performance.cacheEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.performance.cacheEnabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.performance.cacheEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface2/50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-fg">Image Optimization</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Optimize images automatically</p>
                    </div>
                    <button
                      onClick={() => updateSetting('performance', 'imageOptimization', !settings.performance.imageOptimization)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.performance.imageOptimization ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.performance.imageOptimization ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Cache TTL (seconds)
                    </label>
                    <input
                      type="number"
                      min="60"
                      max="86400"
                      value={settings.performance.cacheTTL}
                      onChange={(e) => updateSetting('performance', 'cacheTTL', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Max Connections
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      value={settings.performance.maxConnections}
                      onChange={(e) => updateSetting('performance', 'maxConnections', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={clearCache}
                    className="inline-flex items-center px-4 py-2 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-medium rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/30 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Clear Cache
                  </button>
                </div>
              </div>
            )}

            {/* Backup Settings */}
            {activeTab === 'backup' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface2/50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-fg">Auto Backup</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Enable automatic backups</p>
                    </div>
                    <button
                      onClick={() => updateSetting('backup', 'autoBackup', !settings.backup.autoBackup)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.backup.autoBackup ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.backup.autoBackup ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-surface2/50 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 dark:text-fg">Encryption</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Encrypt backup files</p>
                    </div>
                    <button
                      onClick={() => updateSetting('backup', 'encryptionEnabled', !settings.backup.encryptionEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.backup.encryptionEnabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.backup.encryptionEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Backup Frequency
                    </label>
                    <select
                      value={settings.backup.backupFrequency}
                      onChange={(e) => updateSetting('backup', 'backupFrequency', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Retention (days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={settings.backup.backupRetention}
                      onChange={(e) => updateSetting('backup', 'backupRetention', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={createBackup}
                    className="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-accent2 font-medium rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/30 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Create Backup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* System Actions */}
        <div className="mt-8 bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-fg mb-4">System Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={clearCache}
              className="flex items-center justify-center px-4 py-3 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-medium rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/30 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear Cache
            </button>
            
            <button
              onClick={createBackup}
              className="flex items-center justify-center px-4 py-3 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-accent2 font-medium rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/30 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Create Backup
            </button>
            
            <button
              onClick={restartSystem}
              className="flex items-center justify-center px-4 py-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
            >
              <Power className="h-4 w-4 mr-2" />
              Restart System
            </button>
            
            <button
              onClick={fetchSystemStatus}
              className="flex items-center justify-center px-4 py-3 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Activity className="h-4 w-4 mr-2" />
              Refresh Status
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-fg font-medium rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save All Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}