import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { ServiceRequestModal } from './ServiceRequestModal';
import {
  Package,
  DollarSign,
  CheckCircle,
  Plus,
  RefreshCw,
  AlertCircle,
  Star,
  Target,
  Zap,
  Globe,
  Shield,
  Cpu
} from 'lucide-react';

export function ServicesPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await apiClient.getServices();
      const serviceList = response?.services || [];
      
      // Add custom quote option
      const customQuoteService = {
        id: 'custom',
        name: 'Custom Solution',
        description: 'Need something specific? Get a custom quote tailored to your exact requirements.',
        price: 0,
        features: [
          'Personalized consultation',
          'Custom development',
          'Tailored pricing',
          'Dedicated support',
          'Flexible timeline'
        ]
      };
      
      setServices([customQuoteService, ...(Array.isArray(serviceList) ? serviceList : [])]);
      showSuccess('Services Loaded', `Successfully loaded ${serviceList.length} service packages.`);
    } catch (error) {
      logger.error('Error fetching services:', error);
      setError('Failed to load services. Please try again.');
      showError('Failed to Load Services', 'Unable to load service packages. Please try again later.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const requestService = (service: any) => {
    setSelectedService(service);
    setShowRequestModal(true);
  };

  const handleRequestSubmitted = () => {
    setShowRequestModal(false);
    setSelectedService(null);
    showSuccess('Request Submitted', 'Your service request has been submitted successfully.');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Our Services</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Explore our service packages and request custom solutions</p>
        </div>
        <button
          onClick={fetchServices}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      )}

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className={`rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${
              service.id === 'custom' 
                ? 'bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800' 
                : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                    service.id === 'custom'
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}>
                    {service.id === 'custom' ? (
                      <Target className="h-6 w-6 text-white" />
                    ) : (
                      <Package className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                    {service.id !== 'custom' && (
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-bold">{service.price?.toLocaleString() || '0'}</span>
                      </div>
                    )}
                    {service.id === 'custom' && (
                      <div className="flex items-center text-purple-600 dark:text-purple-400">
                        <Star className="h-4 w-4 mr-1" />
                        <span className="font-bold text-sm">Custom Pricing</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
              
              <div className="space-y-2 mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {service.id === 'custom' ? 'What You Get:' : 'Features:'}
                </h4>
                <ul className="space-y-1">
                  {(service.features || []).map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                onClick={() => requestService(service)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  service.id === 'custom'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg'
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white'
                }`}
              >
                {service.id === 'custom' ? 'Get Custom Quote' : 'Request Service'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Services Available</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Service packages are currently being updated. Please check back later.
          </p>
          <button
            onClick={fetchServices}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Services
          </button>
        </div>
      )}

      {/* Service Request Modal */}
      {showRequestModal && selectedService && (
        <ServiceRequestModal
          isOpen={showRequestModal}
          onClose={() => {
            setShowRequestModal(false);
            setSelectedService(null);
          }}
          service={selectedService}
          onRequestSubmitted={handleRequestSubmitted}
        />
      )}
    </div>
  );
}