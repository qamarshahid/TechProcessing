import React, { useState, useEffect } from 'react';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye, 
  Shield, 
  Mail, 
  Phone,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

export function UserManagementPage() {
  const { showSuccess, showError } = useNotifications();
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    dateRange: '',
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalClients: 0,
    totalAgents: 0,
    totalAdmins: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getUsers({ includeInactive: true });
      const usersList = response?.users || [];
      
      // Ensure we always have an array
      const safeUsersList = Array.isArray(usersList) ? usersList : [];
      setUsers(safeUsersList);
      setFilteredUsers(safeUsersList);
      calculateStats(safeUsersList);
      showSuccess('Users Data Loaded', `Successfully loaded ${safeUsersList.length} users.`);
    } catch (error) {
      logger.error('Error fetching users:', error);
      showError('Failed to Load Users', 'Unable to load users data. Please try again later.');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (usersList: any[]) => {
    if (!Array.isArray(usersList)) {
      usersList = [];
    }
    
    const totalUsers = usersList.length;
    const activeUsers = usersList.filter(u => u.isActive || u.is_active).length;
    const inactiveUsers = totalUsers - activeUsers;
    const totalClients = usersList.filter(u => u.role === 'CLIENT').length;
    const totalAgents = usersList.filter(u => u.role === 'AGENT').length;
    const totalAdmins = usersList.filter(u => u.role === 'ADMIN').length;

    setStats({
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalClients,
      totalAgents,
      totalAdmins,
    });
  };

  const filterUsers = () => {
    // Ensure users is always an array
    const safeUsers = Array.isArray(users) ? users : [];
    let filtered = [...safeUsers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user?.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (filters.role) {
      filtered = filtered.filter(user => 
        user?.role?.toLowerCase() === filters.role.toLowerCase()
      );
    }

    // Status filter
    if (filters.status) {
      if (filters.status === 'active') {
        filtered = filtered.filter(user => user?.isActive || user?.is_active);
      } else if (filters.status === 'inactive') {
        filtered = filtered.filter(user => !(user?.isActive || user?.is_active));
      }
    }

    setFilteredUsers(filtered);
  };

  const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      if (action === 'delete') {
        // This would typically call an API to delete the user
        showSuccess('User Deleted', 'User deleted successfully.');
        setUsers(prev => {
          const safePrev = Array.isArray(prev) ? prev : [];
          return safePrev.filter(u => u?.id !== userId);
        });
      } else {
        // This would typically call an API to update user status
        const newStatus = action === 'activate';
        showSuccess('User Updated', `User ${action}d successfully.`);
        
        setUsers(prev => {
          const safePrev = Array.isArray(prev) ? prev : [];
          return safePrev.map(user => 
            user?.id === userId 
              ? { ...user, isActive: newStatus, is_active: newStatus }
              : user
          );
        });
      }
      
      fetchUsers(); // Refresh data
    } catch (error) {
      logger.error(`Error ${action}ing user:`, error);
      showError('Action Failed', `Failed to ${action} user. Please try again.`);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-500" />;
      case 'agent':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'client':
        return <Users className="w-4 h-4 text-green-500" />;
      default:
        return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'agent':
        return 'bg-blue-100 text-blue-800';
      case 'client':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Ensure arrays are always safe
  const safeFilteredUsers = Array.isArray(filteredUsers) ? filteredUsers : [];
  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage system users, roles, and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
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
              <p className="text-2xl font-semibold text-gray-900">{stats.activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.inactiveUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clients</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Agents</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalAgents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalAdmins}</p>
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
                  placeholder="Search users by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="agent">Agent</option>
                <option value="client">Client</option>
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button
                onClick={fetchUsers}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                <UserPlus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">System Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
              {safeFilteredUsers.map((user) => (
                <tr key={user?.id || Math.random()} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.fullName || user?.full_name || 'Unknown User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user?.id || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        {user?.email || 'N/A'}
                      </div>
                      {user?.phone && (
                        <div className="flex items-center mt-1">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                      {getRoleIcon(user?.role)}
                      <span className="ml-1 capitalize">
                        {user?.role || 'Unknown'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user?.isActive || user?.is_active)}`}>
                      {user?.isActive || user?.is_active ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="ml-1">
                        {(user?.isActive || user?.is_active) ? 'Active' : 'Inactive'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user?.createdAt || user?.created_at ? 
                      new Date(user.createdAt || user.created_at).toLocaleDateString() : 
                      'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="View user details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {(user?.isActive || user?.is_active) ? (
                        <button
                          onClick={() => handleUserAction(user?.id, 'deactivate')}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Deactivate user"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user?.id, 'activate')}
                          className="text-green-600 hover:text-green-900"
                          title="Activate user"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleUserAction(user?.id, 'delete')}
                        className="text-red-600 hover:text-red-900"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {safeFilteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {safeUsers.length === 0 ? 'No users available.' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}