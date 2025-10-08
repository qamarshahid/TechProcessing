import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { useNotifications } from '../common/NotificationSystem';
import { logger } from '../../lib/logger';
import { EditServiceModal } from './EditServiceModal';
import {
  Package, DollarSign, Clock, CheckCircle, XCircle, RefreshCw, Search, Eye, Edit, Trash2, Filter, TrendingUp, BarChart3, Activity, Shield, AlertCircle, Info, Calendar, User, Building, ArrowUpDown, ChevronDown, ChevronUp, Settings, HelpCircle, Zap, Rocket, Plus, Star, Tag, Layers, Code, Palette, X
} from 'lucide-react';

interface Service {
  id: string;
  name?: string;
  description?: string;
  price?: string;
  status?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
  duration?: string;
  features?: string[];
}

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [newServiceForm, setNewServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    status: 'active',
    duration: '',
    features: [''],
  });
  const { showSuccess, showError } = useNotifications();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterAndSortServices();
  }, [services, searchTerm, statusFilter, categoryFilter, sortBy, sortOrder]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.getServices();
      const servicesList = response?.services || [];
      
      setServices(servicesList);
      setFilteredServices(servicesList);
      
      showSuccess('Services Loaded', 'Service data loaded successfully.');
    } catch (error) {
      logger.error('Error fetching services:', error);
      setError('Failed to load services. Please try again.');
      showError('Service Error', 'Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortServices = () => {
    let filtered = [...services];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(service => 
        (service.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.category || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(service => (service.status || '').toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(service => (service.category || '').toLowerCase() === categoryFilter.toLowerCase());
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'price':
          aValue = parseFloat(a.price || '0');
          bValue = parseFloat(b.price || '0');
          break;
        case 'date':
          aValue = new Date(a.created_at || a.updated_at || '');
          bValue = new Date(b.created_at || b.updated_at || '');
          break;
        case 'status':
          aValue = (a.status || '').toLowerCase();
          bValue = (b.status || '').toLowerCase();
          break;
        case 'category':
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        default:
          aValue = (a.name || '').toLowerCase();
          bValue = (b.name || '').toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredServices(filtered);
  };

  const handleStatusChange = async (serviceId: string, newStatus: string) => {
    try {
      // Update local state for now (API call would be implemented later)
      setServices(prev => prev.map(s => 
        s.id === serviceId ? { ...s, status: newStatus } : s
      ));
      
      showSuccess('Status Updated', `Service status updated to ${newStatus}`);
    } catch (error) {
      logger.error('Error updating service status:', error);
      showError('Update Failed', 'Failed to update service status. Please try again.');
    }
  };

  const handleViewService = (service: Service) => {
    setViewingService(service);
    setShowViewModal(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setShowEditModal(true);
  };

  const handleDeleteService = (service: Service) => {
    setDeletingService(service);
    setShowDeleteModal(true);
  };

  const confirmDeleteService = async () => {
    if (!deletingService) return;

    try {
      await apiClient.deleteService(deletingService.id);
      setServices(prev => prev.filter(s => s.id !== deletingService.id));
      showSuccess('Service Deleted', 'Service has been deleted successfully.');
      setShowDeleteModal(false);
      setDeletingService(null);
    } catch (error) {
      logger.error('Error deleting service:', error);
      showError('Delete Failed', 'Failed to delete service. Please try again.');
    }
  };

  const handleServiceUpdated = () => {
    fetchServices(); // Refresh the services list
    showSuccess('Service Updated', 'Service has been updated successfully.');
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const serviceData = {
        name: newServiceForm.name,
        description: newServiceForm.description,
        price: parseFloat(newServiceForm.price),
        category: newServiceForm.category,
        status: newServiceForm.status,
        duration: newServiceForm.duration,
        features: newServiceForm.features.filter(feature => feature.trim() !== ''),
      };

      await apiClient.createService(serviceData);
      
      showSuccess('Service Created', 'The service has been created successfully.');
      
      // Reset form
      setNewServiceForm({
        name: '',
        description: '',
        price: '',
        category: '',
        status: 'active',
        duration: '',
        features: [''],
      });
      
      setShowAddModal(false);
      fetchServices();
    } catch (error) {
      logger.error('Error creating service:', error);
      setError('Failed to create service. Please try again.');
      showError('Creation Error', 'Failed to create service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-accent2 dark:border-emerald-800';
      case 'inactive':
      case 'draft':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      case 'archived':
      case 'deleted':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-bg2/20 dark:text-slate-400 dark:border-outline';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'published':
        return <CheckCircle className="h-4 w-4" />;
      case 'inactive':
      case 'draft':
        return <Clock className="h-4 w-4" />;
      case 'archived':
      case 'deleted':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'consulting':
        return <User className="h-4 w-4" />;
      case 'development':
        return <Code className="h-4 w-4" />;
      case 'design':
        return <Palette className="h-4 w-4" />;
      case 'marketing':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const calculateStats = () => {
    const total = services.length;
    const active = services.filter(s => (s.status || '').toLowerCase() === 'active' || (s.status || '').toLowerCase() === 'published').length;
    const inactive = services.filter(s => (s.status || '').toLowerCase() === 'inactive' || (s.status || '').toLowerCase() === 'draft').length;
    const archived = services.filter(s => (s.status || '').toLowerCase() === 'archived' || (s.status || '').toLowerCase() === 'deleted').length;
    const totalValue = services.reduce((sum, s) => sum + parseFloat(s.price || '0'), 0);
    const avgPrice = total > 0 ? totalValue / total : 0;

    return { total, active, inactive, archived, totalValue, avgPrice };
  };

  const stats = calculateStats();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-6 shadow-xl">
            <Package className="h-10 w-10 text-fg" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-fg mb-4">
            Service Management Center 🚀
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Create, manage, and optimize your service offerings. Track performance, manage pricing, and deliver exceptional value to your clients.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Services</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-fg">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Package className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Activity className="h-4 w-4 mr-1 text-purple-500" />
              <span>All offerings</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Active Services</p>
                <p className="text-3xl font-bold text-accent1 dark:text-accent2">{stats.active}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-accent1 to-accent600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <CheckCircle className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <TrendingUp className="h-4 w-4 mr-1 text-accent1" />
              <span>Published offerings</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Value</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">${stats.totalValue.toLocaleString()}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <DollarSign className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <BarChart3 className="h-4 w-4 mr-1 text-amber-500" />
              <span>Combined pricing</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Avg Price</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${stats.avgPrice.toFixed(0)}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Tag className="h-7 w-7 text-fg" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-slate-500 dark:text-slate-400">
              <Star className="h-4 w-4 mr-1 text-blue-500" />
              <span>Per service</span>
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
                  placeholder="Search services..."
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
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="archived">Archived</option>
                </select>
                
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Categories</option>
                  <option value="consulting">Consulting</option>
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
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
                Add Service
              </button>
              
              <button
                onClick={fetchServices}
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
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="date">Date</option>
                    <option value="status">Status</option>
                    <option value="category">Category</option>
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
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price Range</label>
                  <select className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-surface2 text-slate-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">All Prices</option>
                    <option value="0-100">$0 - $100</option>
                    <option value="100-500">$100 - $500</option>
                    <option value="500-1000">$500 - $1000</option>
                    <option value="1000+">$1000+</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div key={service.id} className="group bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                {/* Service Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                      <Package className="h-6 w-6 text-fg" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-fg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                          {getStatusIcon(service.status)}
                          <span className="ml-1 capitalize">
                            {service.status || 'Unknown'}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleViewService(service)}
                      className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-surface2 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditService(service)}
                      className="text-slate-600 hover:text-accent1 dark:text-slate-400 dark:hover:text-accent2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-surface2 transition-colors"
                      title="Edit Service"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteService(service)}
                      className="text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-surface2 transition-colors"
                      title="Delete Service"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Service Description */}
                {service.description && (
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>
                )}

                {/* Service Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Price</span>
                    <span className="text-lg font-bold text-accent1 dark:text-accent2">
                      ${parseFloat(service.price || '0').toFixed(2)}
                    </span>
                  </div>
                  
                  {service.category && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Category</span>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(service.category)}
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                          {service.category}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {service.duration && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Duration</span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {service.duration}
                      </span>
                    </div>
                  )}
                </div>

                {/* Service Actions */}
                <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-outline">
                  {(service.status || '').toLowerCase() === 'inactive' && (
                    <button
                      onClick={() => handleStatusChange(service.id, 'active')}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-accent2 font-medium rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Activate
                    </button>
                  )}
                  
                  {(service.status || '').toLowerCase() === 'active' && (
                    <button
                      onClick={() => handleStatusChange(service.id, 'inactive')}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 font-medium rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors text-sm"
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Deactivate
                    </button>
                  )}
                  
                  <button className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-slate-50 text-slate-700 dark:bg-surface2 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors text-sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-slate-500 dark:text-slate-400">
                <Package className="mx-auto h-12 w-12 mb-4 text-slate-300 dark:text-slate-600" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-fg mb-2">No services found</h3>
                <p className="text-sm mb-4">Try adjusting your search or filter criteria.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent1 to-accent600 text-fg font-medium rounded-lg hover:shadow-lg transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Service
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="bg-white dark:bg-surface rounded-2xl shadow-sm border border-slate-200 dark:border-outline p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Info className="h-5 w-5" />
              <span className="text-sm">
                Showing {filteredServices.length} of {services.length} services
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

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-outline">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center mr-3">
                  <Plus className="h-5 w-5 text-accent1 dark:text-accent2" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-fg">Create New Service</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="p-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={newServiceForm.name}
                    onChange={(e) => setNewServiceForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-emerald-500 dark:bg-surface2 dark:text-fg"
                    placeholder="e.g., Web Development"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newServiceForm.price}
                    onChange={(e) => setNewServiceForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-emerald-500 dark:bg-surface2 dark:text-fg"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newServiceForm.category}
                    onChange={(e) => setNewServiceForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-emerald-500 dark:bg-surface2 dark:text-fg"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="consulting">Consulting</option>
                    <option value="development">Development</option>
                    <option value="design">Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="support">Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={newServiceForm.status}
                    onChange={(e) => setNewServiceForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-emerald-500 dark:bg-surface2 dark:text-fg"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newServiceForm.duration}
                    onChange={(e) => setNewServiceForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-emerald-500 dark:bg-surface2 dark:text-fg"
                    placeholder="e.g., 2-4 weeks"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={newServiceForm.description}
                  onChange={(e) => setNewServiceForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-emerald-500 dark:bg-surface2 dark:text-fg"
                  placeholder="Describe the service in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Features
                </label>
                <div className="space-y-2">
                  {newServiceForm.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...newServiceForm.features];
                          newFeatures[index] = e.target.value;
                          setNewServiceForm(prev => ({ ...prev, features: newFeatures }));
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-emerald-500 dark:bg-surface2 dark:text-fg"
                        placeholder={`Feature ${index + 1}`}
                      />
                      {newServiceForm.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newFeatures = newServiceForm.features.filter((_, i) => i !== index);
                            setNewServiceForm(prev => ({ ...prev, features: newFeatures }));
                          }}
                          className="px-3 py-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setNewServiceForm(prev => ({ ...prev, features: [...prev.features, ''] }))}
                    className="inline-flex items-center px-3 py-2 text-accent1 hover:text-emerald-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Feature
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-surface2 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-accent1 text-fg rounded-lg hover:bg-accent1 transition-colors font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Service
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && editingService && (
        <EditServiceModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingService(null);
          }}
          onServiceUpdated={handleServiceUpdated}
          service={editingService}
        />
      )}

      {/* View Service Modal */}
      {showViewModal && viewingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-outline">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-fg">Service Details</h2>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewingService(null);
                }}
                className="text-muted hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Service Name
                </label>
                <div className="p-3 bg-gray-50 dark:bg-surface2 rounded-lg">
                  <p className="text-gray-900 dark:text-fg font-medium">{viewingService.name}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <div className="p-3 bg-gray-50 dark:bg-surface2 rounded-lg">
                  <p className="text-gray-900 dark:text-fg">{viewingService.description}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Price
                </label>
                <div className="p-3 bg-gray-50 dark:bg-surface2 rounded-lg">
                  <p className="text-gray-900 dark:text-fg font-semibold text-lg">
                    ${parseFloat(viewingService.price || '0').toFixed(2)}
                  </p>
                </div>
              </div>

              {viewingService.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Category
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-surface2 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(viewingService.category)}
                      <span className="text-gray-900 dark:text-fg capitalize">
                        {viewingService.category}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {viewingService.status && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-surface2 rounded-lg">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(viewingService.status)}`}>
                      {getStatusIcon(viewingService.status)}
                      <span className="ml-1 capitalize">
                        {viewingService.status}
                      </span>
                    </span>
                  </div>
                </div>
              )}

              {viewingService.features && viewingService.features.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Features
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-surface2 rounded-lg">
                    <ul className="space-y-2">
                      {viewingService.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-900 dark:text-fg">
                          <CheckCircle className="h-4 w-4 text-accent1 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingService(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-surface2 transition-colors font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingService(null);
                    handleEditService(viewingService);
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 text-fg rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-outline">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mr-3">
                  <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-fg">Delete Service</h2>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingService(null);
                }}
                className="text-muted hover:text-gray-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-gray-600 dark:text-slate-400 mb-2">
                  Are you sure you want to delete this service?
                </p>
                <div className="p-3 bg-gray-50 dark:bg-surface2 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-fg">{deletingService.name}</p>
                  {deletingService.description && (
                    <p className="text-sm text-gray-600 dark:text-slate-400 mt-1 line-clamp-2">
                      {deletingService.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">
                      This action cannot be undone
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      The service will be permanently removed from the system.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingService(null);
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-surface2 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteService}
                  className="flex-1 px-4 py-3 bg-red-600 text-fg rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}