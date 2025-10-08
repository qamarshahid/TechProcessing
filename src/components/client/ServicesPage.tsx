import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import {
  Package,
  DollarSign,
  CheckCircle,
  Plus,
  FileText,
  Send,
  RefreshCw,
  Search,
  Filter,
  Star,
  ArrowRight,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { ServiceRequestModal } from './ServiceRequestModal';

export function ServicesPage() {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('ALL');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchServices();
    }
  }, [user]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await apiClient.getServices();
      const serviceList = response?.services || [];
      
      setServices(Array.isArray(serviceList) ? serviceList : []);
      showSuccess('Services Loaded', `Successfully loaded ${serviceList.length} services.`);
    } catch (error) {
      logger.error('Error fetching services:', error);
      setError('Failed to load services. Please try again.');
      showError('Failed to Load Services', 'Unable to load services. Please try again later.');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const requestService = (service: any) => {
    setSelectedService(service);
    setShowRequestModal(true);
  };

  const requestCustomQuote = () => {
    setSelectedService(null);
    setShowRequestModal(true);
  };

  const handleServiceRequested = () => {
    setShowRequestModal(false);
    setSelectedService(null);
    showSuccess('Service Request Submitted', 'Your service request has been submitted successfully. We will review it and get back to you soon.');
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.features?.some((feature: string) => 
                           feature.toLowerCase().includes(searchTerm.toLowerCase())
                         );

    const matchesPrice = priceFilter === 'ALL' || 
      (priceFilter === 'UNDER_1000' && service.price < 1000) ||
      (priceFilter === '1000_5000' && service.price >= 1000 && service.price <= 5000) ||
      (priceFilter === 'OVER_5000' && service.price > 5000);

    return matchesSearch && matchesPrice;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-surface2 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-surface2 rounded-lg"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-fg">Our Services</h1>
          <p className="text-sm text-gray-600 dark:text-muted">Explore our service packages and request custom quotes</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchServices}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-fg rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={requestCustomQuote}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-accent1 to-accent600 text-fg rounded-lg hover:from-emerald-600 hover:to-accent700 transition-all duration-300 shadow-lg hover:shadow-accent500/25"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Get Custom Quote
          </button>
        </div>
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

      {/* Search and Filters */}
      <div className="bg-white dark:bg-surface rounded-lg shadow-sm border border-gray-200 dark:border-outline p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted dark:text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search services..."
                className="pl-10 w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-surface2 text-gray-900 dark:text-fg placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-surface2 text-gray-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Prices</option>
              <option value="UNDER_1000">Under $1,000</option>
              <option value="1000_5000">$1,000 - $5,000</option>
              <option value="OVER_5000">Over $5,000</option>
            </select>
          </div>
        </div>
      </div>

      {/* Custom Quote CTA */}
      <div className="bg-gradient-to-r from-emerald-50 to-accent50 dark:from-emerald-900/20 dark:to-accent900/20 rounded-xl p-8 border border-emerald-200 dark:border-emerald-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-accent1 to-accent600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Target className="h-8 w-8 text-fg" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-fg mb-4">Need Something Custom?</h3>
          <p className="text-gray-600 dark:text-muted mb-6 max-w-2xl mx-auto">
            Don't see exactly what you need? Our team specializes in custom solutions tailored to your specific requirements. 
            Get a personalized quote for your unique project.
          </p>
          <button
            onClick={requestCustomQuote}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-accent1 to-accent600 text-fg rounded-xl hover:from-emerald-600 hover:to-accent700 transition-all duration-300 shadow-lg hover:shadow-accent500/25 font-bold text-lg"
          >
            <Zap className="h-5 w-5 mr-3" />
            Request Custom Quote
            <ArrowRight className="h-5 w-5 ml-3" />
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white dark:bg-surface rounded-xl shadow-sm border border-gray-200 dark:border-outline p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Package className="h-6 w-6 text-fg" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-fg">{service.name}</h3>
                    <div className="flex items-center text-accent600 dark:text-accent400">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-bold text-xl">{service.price?.toLocaleString() || '0'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 dark:text-muted ml-1">Popular</span>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-muted mb-6 leading-relaxed">{service.description}</p>
              
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-fg flex items-center">
                  <CheckCircle className="h-4 w-4 text-accent500 mr-2" />
                  What's Included:
                </h4>
                <ul className="space-y-2">
                  {(service.features || []).map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-sm text-gray-600 dark:text-muted">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                onClick={() => requestService(service)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-fg py-3 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Request This Service
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-surface rounded-lg shadow-sm border border-gray-200 dark:border-outline p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-surface2 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-muted dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-fg mb-2">No Services Found</h3>
          <p className="text-gray-500 dark:text-muted mb-6">
            {searchTerm || priceFilter !== 'ALL' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No services are currently available. Please check back later.'
            }
          </p>
          <button
            onClick={requestCustomQuote}
            className="inline-flex items-center px-6 py-3 bg-accent1 text-fg rounded-lg hover:bg-accent1 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Request Custom Quote
          </button>
        </div>
      )}

      {/* Service Request Modal */}
      <ServiceRequestModal
        isOpen={showRequestModal}
        onClose={() => {
          setShowRequestModal(false);
          setSelectedService(null);
        }}
        onServiceRequested={handleServiceRequested}
        selectedService={selectedService}
      />
    </div>
  );
}