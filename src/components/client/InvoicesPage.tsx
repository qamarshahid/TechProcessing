import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { FileText, Download, CreditCard, DollarSign } from 'lucide-react';

export function InvoicesPage() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  const fetchInvoices = async () => {
    try {
      // Get current user from auth context
      const { user } = useAuth();
      
      if (user?.id) {
        // Fetch client-specific invoices
        const response = await apiClient.getClientInvoices(user.id);
        let clientInvoices = response.invoices || [];
        
        // Filter by status if not 'ALL'
        if (filter !== 'ALL') {
          clientInvoices = clientInvoices.filter(invoice => invoice.status === filter);
        }
        
        setInvoices(clientInvoices);
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayInvoice = (invoice: any) => {
    navigate(`/payment/${invoice.id}`);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'UNPAID':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>
          <p className="text-sm text-gray-600">View and manage your project invoices</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['ALL', 'PAID', 'UNPAID', 'OVERDUE'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === status
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </nav>
      </div>

      {/* Invoices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">Invoice #{invoice.id}</h3>
                  <div className="flex items-center text-green-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-bold">{parseFloat(invoice.amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{invoice.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Due Date:</span>
                <span className="text-gray-900">{new Date(invoice.due_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Method:</span>
                <span className="text-gray-900">{invoice.payment_method || 'Not specified'}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Download
              </button>
              {invoice.status === 'UNPAID' && (
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                  onClick={() => handlePayInvoice(invoice)}
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}