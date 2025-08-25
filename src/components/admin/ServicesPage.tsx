import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { Package, Plus, Edit, Trash2, DollarSign, CheckCircle } from 'lucide-react';
import { SearchFilters } from './SearchFilters';
import { AddServiceModal } from './AddServiceModal';
import { EditServiceModal } from './EditServiceModal';
import { AddInvoiceModal } from './AddInvoiceModal';

export function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    client: '',
    amount: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, filters]);

  const fetchServices = async () => {
    try {
      const response = await apiClient.getServices();
      setServices(response.services);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.features?.some((feature: string) => 
          feature.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Amount filter
    if (filters.amount) {
      filtered = filtered.filter(service => {
        const price = service.price;
        switch (filters.amount) {
          case '0-100': return price >= 0 && price <= 100;
          case '100-500': return price > 100 && price <= 500;
          case '500-1000': return price > 500 && price <= 1000;
          case '1000-5000': return price > 1000 && price <= 5000;
          case '5000+': return price > 5000;
          default: return true;
        }
      });
    }

    setFilteredServices(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      dateRange: '',
      client: '',
      amount: '',
    });
    setSearchTerm('');
  };

  const editService = (service: any) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  const deleteService = async (service: any) => {
    if (window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
      try {
        await apiClient.deleteService(service.id);
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service');
      }
    }
  };

  const createInvoiceFromService = (service: any) => {
    setSelectedService(service);
    setShowInvoiceModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Service Packages</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Manage your service offerings and pricing</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </button>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterOptions={{}}
        placeholder="Search services by name, description, or features..."
      />

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                  <div className="flex items-center text-green-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-bold">{service.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => editService(service)}
                  className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                  title="Edit Service"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => deleteService(service)}
                  className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                  title="Delete Service"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 dark:text-white">Features:</h4>
              <ul className="space-y-1">
                {service.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-600">
              <button 
                onClick={() => createInvoiceFromService(service)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Invoice
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Service Modal */}
      <AddServiceModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onServiceAdded={fetchServices}
      />

      {/* Edit Service Modal */}
      {selectedService && (
        <EditServiceModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedService(null);
          }}
          onServiceUpdated={fetchServices}
          service={selectedService}
        />
      )}

      {/* Create Invoice from Service Modal */}
      <AddInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false);
          setSelectedService(null);
        }}
        onInvoiceAdded={() => {
          setShowInvoiceModal(false);
          setSelectedService(null);
        }}
        preSelectedService={selectedService}
      />
    </div>
  );
}