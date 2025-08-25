import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { Package, CheckCircle, DollarSign, MessageCircle } from 'lucide-react';

export function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

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
          <h1 className="text-2xl font-bold text-gray-900">Available Services</h1>
          <p className="text-sm text-gray-600">Explore our service packages and request quotes</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                  <div className="flex items-center text-green-600">
                    <span className="text-sm">Starting at </span>
                    <DollarSign className="h-4 w-4 ml-1" />
                    <span className="font-bold">{service.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{service.description}</p>
            
            <div className="space-y-2 mb-6">
              <h4 className="font-medium text-gray-900">What's included:</h4>
              <ul className="space-y-1">
                {service.features.slice(0, 4).map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {service.features.length > 4 && (
                  <li className="text-sm text-gray-500 ml-6">
                    +{service.features.length - 4} more features
                  </li>
                )}
              </ul>
            </div>
            
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Request Quote
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Us
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need a Custom Solution?</h3>
          <p className="text-gray-600 mb-4">
            Don't see what you're looking for? We create custom solutions tailored to your specific needs.
          </p>
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
            Get Custom Quote
          </button>
        </div>
      </div>
    </div>
  );
}