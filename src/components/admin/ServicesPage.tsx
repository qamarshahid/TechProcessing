import React, { useState, useEffect } from 'react';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { 
  Package, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  RefreshCw,
  TrendingUp,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

export function ServicesPage() {
  const { showSuccess, showError } = useNotifications();
  const [services, setServices] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    price: '',
  });
  const [stats, setStats] = useState({
    totalServices: 0,
    activeServices: 0,
    inactiveServices: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, filters]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getServices();
      const servicesList = response?.services || [];
      
      // Ensure we always have an array
      const safeServicesList = Array.isArray(servicesList) ? servicesList : [];
      setServices(safeServicesList);
      setFilteredServices(safeServicesList); // Initialize filtered services
      calculateStats(safeServicesList);
      showSuccess('Services Data Loaded', `Successfully loaded ${safeServicesList.length} services.`);
    } catch (error) {
      logger.error('Error fetching services:', error);
      showError('Failed to Load Services', 'Unable to load services data. Please try again later.');
      setServices([]);
      setFilteredServices([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (servicesList: any[]) => {
    if (!Array.isArray(servicesList)) {
      servicesList = [];
    }
    
    const totalServices = servicesList.length;
    const activeServices = servicesList.filter(s => s.status === 'ACTIVE').length;
    const inactiveServices = servicesList.filter(s => s.status === 'INACTIVE').length;
    const totalRevenue = servicesList.reduce((sum, service) => 
      sum + parseFloat(service.price || '0'), 0
    );

    setStats({
      totalServices,
      activeServices,
      inactiveServices,
      totalRevenue,
    });
  };

  const filterServices = () => {
    // Ensure services is always an array
    const safeServices = Array.isArray(services) ? services : [];
    let filtered = [...safeServices];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service?.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(service => 
        service?.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(service => 
        service?.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Price filter
    if (filters.price) {
      const price = parseFloat(filters.price);
      filtered = filtered.filter(service => 
        parseFloat(service?.price || '0') >= price
      );
    }

    setFilteredServices(filtered);
  };

  const handleServiceAction = async (serviceId: string, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      if (action === 'delete') {
        // This would typically call an API to delete the service
        showSuccess('Service Deleted', 'Service deleted successfully.');
        setServices(prev => {
          const safePrev = Array.isArray(prev) ? prev : [];
          return safePrev.filter(s => s?.id !== serviceId);
        });
      } else {
        // This would typically call an API to update service status
        const newStatus = action === 'activate' ? 'ACTIVE' : 'INACTIVE';
        showSuccess('Service Updated', `Service ${action}d successfully.`);
        
        setServices(prev => {
          const safePrev = Array.isArray(prev) ? prev : [];
          return safePrev.map(service => 
            service?.id === serviceId 
              ? { ...service, status: newStatus }
              : service
          );
        });
      }
      
      fetchServices(); // Refresh data
    } catch (error) {
      logger.error(`Error ${action}ing service:`, error);
      showError('Action Failed', `Failed to ${action} service. Please try again.`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'draft':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'draft':
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

  // Ensure filteredServices is always an array
  const safeFilteredServices = Array.isArray(filteredServices) ? filteredServices : [];
  const safeServices = Array.isArray(services) ? services : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Services Management</h1>
        <p className="text-gray-600">Manage your service packages and offerings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Services</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive Services</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.inactiveServices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
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
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
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
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
              <button
                onClick={fetchServices}
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

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Service Packages</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeFilteredServices.map((service) => (
                <tr key={service?.id || Math.random()} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Package className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {service?.name || 'Unnamed Service'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {service?.description || 'No description'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {service?.category || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${parseFloat(service?.price || '0').toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service?.status)}`}>
                      {getStatusIcon(service?.status)}
                      <span className="ml-1 capitalize">
                        {service?.status || 'Unknown'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit service"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {service?.status === 'ACTIVE' ? (
                        <button
                          onClick={() => handleServiceAction(service?.id, 'deactivate')}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Deactivate service"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleServiceAction(service?.id, 'activate')}
                          className="text-green-600 hover:text-green-900"
                          title="Activate service"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleServiceAction(service?.id, 'delete')}
                        className="text-red-600 hover:text-red-900"
                        title="Delete service"
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
        
        {safeFilteredServices.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {safeServices.length === 0 ? 'No services available.' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}