import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../lib/api';
import { useNotifications } from '../common/NotificationSystem';
import { logger } from '../../lib/logger';
import { Package, CheckCircle, DollarSign, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { ServiceRequestModal } from './ServiceRequestModal';

export function ServicesPage() {
  const { showError, showSuccess, showWarning } = useNotifications();
  
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getServices();
      setServices(response.services || []);
      showSuccess('Services Loaded', `Successfully loaded ${response.services?.length || 0} services.`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error('Error fetching services:', error);
      setError(errorMessage);
      showError('Failed to Load Services', 'Unable to load services. Please try again later.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleRequestService = (service: any) => {
    setSelectedService(service);
    setIsRequestModalOpen(true);
  };

  const handleCustomQuote = () => {
    // Create a custom service object for the custom quote request
    const customService = {
      id: 'custom',
      name: 'Custom Solution',
      description: 'Custom solution tailored to your specific needs',
      price: 0
    };
    setSelectedService(customService);
    setIsRequestModalOpen(true);
  };

  const handleRequestSubmitted = () => {
    // Show different messages based on the type of request
    if (selectedService?.id === 'custom') {
      showSuccess('Quote Request Submitted', 'Your custom quote request has been submitted successfully! Our team will review your requirements and provide you with a detailed quote soon.');
    } else {
      showSuccess('Request Submitted', 'Your service request has been submitted successfully!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading services...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Services</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => fetchServices()}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Available Services</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Explore our service packages and request quotes</p>
        </div>
        <button
          onClick={() => fetchServices()}
          disabled={loading}
          className="inline-flex items-center px-3 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Services Grid */}
      {services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                      <span className="text-sm">Starting at </span>
                      <DollarSign className="h-4 w-4 ml-1" />
                      <span className="font-bold">{service.price?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
              
              <div className="space-y-2 mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white">What's included:</h4>
                <ul className="space-y-1">
                  {service.features?.slice(0, 4).map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {service.features && service.features.length > 4 && (
                    <li className="text-sm text-gray-500 dark:text-gray-500 ml-6">
                      +{service.features.length - 4} more features
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="space-y-2">
                <button 
                  onClick={() => handleRequestService(service)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Request Quote
                </button>
                <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Us
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Services Available</h3>
          <p className="text-gray-500 dark:text-gray-400">No services are currently available.</p>
        </div>
      )}

      {/* Contact Section */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Need a Custom Solution?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Don't see what you're looking for? We create custom solutions tailored to your specific needs.
          </p>
          <button 
            onClick={handleCustomQuote}
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-2 px-6 rounded-lg transition-colors"
          >
            Get Custom Quote
          </button>
        </div>
      </div>

      {/* Service Request Modal */}
      {selectedService && (
        <ServiceRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => {
            setIsRequestModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
          onRequestSubmitted={handleRequestSubmitted}
        />
      )}
    </div>
  );
}