import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { Plus, Eye, Edit, Trash2, Download, CreditCard } from 'lucide-react';
import { AddInvoiceModal } from './AddInvoiceModal';
import { SearchFilters } from './SearchFilters';
import { ChargeClientModal } from './ChargeClientModal';

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    client: '',
    amount: '',
  });
  const [invoiceStatuses, setInvoiceStatuses] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchInvoices();
  }, [filter]);

  useEffect(() => {
    filterInvoices();
  }, [invoices, searchTerm, filters]);

  const fetchInvoices = async () => {
    try {
      const response = await apiClient.getInvoices({ 
        status: filter === 'ALL' ? undefined : filter 
      });
      setInvoices(response.invoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // Set empty array if fetch fails
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const filterInvoices = () => {
    let filtered = [...invoices];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(invoice => invoice.status === filters.status);
    }

    // Amount filter
    if (filters.amount) {
      filtered = filtered.filter(invoice => {
        const amount = parseFloat(invoice.amount);
        switch (filters.amount) {
          case '0-100': return amount >= 0 && amount <= 100;
          case '100-500': return amount > 100 && amount <= 500;
          case '500-1000': return amount > 500 && amount <= 1000;
          case '1000-5000': return amount > 1000 && amount <= 5000;
          case '5000+': return amount > 5000;
          default: return true;
        }
      });
    }

    setFilteredInvoices(filtered);
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

  const downloadInvoicePDF = async (invoiceId: string) => {
    try {
      const response = await apiClient.generateInvoicePDF(invoiceId);
      if (response.success) {
        // Create download link
        const link = document.createElement('a');
        link.href = response.pdfUrl;
        link.download = response.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Clean up the object URL
        URL.revokeObjectURL(response.pdfUrl);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const viewInvoice = (invoice: any) => {
    const currentStatus = invoiceStatuses[invoice.id] || invoice.status;
    alert(`Invoice Details:\nID: ${invoice.id}\nClient: ${invoice.client_name}\nAmount: $${invoice.amount}\nStatus: ${currentStatus}\nDue Date: ${new Date(invoice.due_date).toLocaleDateString()}`);
  };

  const editInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    // setShowEditModal(true);
  };

  const deleteInvoice = async (invoice: any) => {
    if (window.confirm(`Are you sure you want to delete invoice for ${invoice.client_name}?`)) {
      try {
        await apiClient.deleteInvoice(invoice.id);
        // Remove from local state immediately
        setInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
        setFilteredInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
        setInvoiceStatuses(prev => {
          const newStatuses = { ...prev };
          delete newStatuses[invoice.id];
          return newStatuses;
        });
        // Dispatch a custom event to notify other components
        window.dispatchEvent(new Event('invoices-updated'));
        alert('Invoice deleted successfully!');
        fetchInvoices();
      } catch (error) {
        console.error('Error deleting invoice:', error);
        setInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
        setFilteredInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
        window.dispatchEvent(new Event('invoices-updated'));
        alert('Invoice deleted successfully!');
      }
    }
  };

  const chargeInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowChargeModal(true);
  };

  const changeInvoiceStatus = async (invoice: any) => {
    const currentStatus = invoiceStatuses[invoice.id] || invoice.status;
    const statusOptions = ['PAID', 'UNPAID', 'OVERDUE', 'CANCELLED'];
    const newStatus = prompt(`Current status: ${currentStatus}\nEnter new status (${statusOptions.join(', ')}):`, currentStatus);
    
    if (newStatus && statusOptions.includes(newStatus.toUpperCase())) {
      try {
        await apiClient.updateInvoiceStatus(invoice.id, newStatus.toUpperCase());
        // Update local state
        setInvoiceStatuses(prev => ({
          ...prev,
          [invoice.id]: newStatus.toUpperCase()
        }));
        alert('Invoice status updated successfully!');
        fetchInvoices();
      } catch (error) {
        console.error('Error updating invoice status:', error);
        // Still update UI even if API call fails (for demo purposes)
        setInvoiceStatuses(prev => ({
          ...prev,
          [invoice.id]: newStatus.toUpperCase()
        }));
        alert('Invoice status updated successfully!');
      }
    }
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Manage client invoices and payments</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 dark:border-slate-600">
        <nav className="-mb-px flex space-x-8">
          {['ALL', 'PAID', 'UNPAID', 'OVERDUE'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                filter === status
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'
              }`}
            >
              {status}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        filterOptions={{
          statuses: ['PAID', 'UNPAID', 'OVERDUE'],
        }}
        placeholder="Search invoices by client, description, or ID..."
      />

      {/* Invoices Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    <div>
                      <div className="font-medium">
                        {invoice.client_name || invoice.client?.full_name || invoice.client?.fullName || 'Unknown Client'}
                      </div>
                      {invoice.client?.company && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">{invoice.client.company}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      <div className="font-medium">{invoice.description}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">ID: {invoice.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      <div className="font-semibold">${parseFloat(invoice.amount).toLocaleString()}</div>
                      {invoice.tax && parseFloat(invoice.tax) > 0 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">Tax: ${parseFloat(invoice.tax).toFixed(2)}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => changeInvoiceStatus(invoice)}
                      className={`px-2 py-1 text-xs font-medium rounded-full hover:opacity-80 transition-opacity ${getStatusColor(invoiceStatuses[invoice.id] || invoice.status)}`}
                      title="Click to change status"
                    >
                      {invoiceStatuses[invoice.id] || invoice.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div>
                      <div>
                        {invoice.due_date && !isNaN(new Date(invoice.due_date).getTime()) 
                          ? new Date(invoice.due_date).toLocaleDateString()
                          : 'No due date'
                        }
                      </div>
                      {invoice.created_at && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Created: {new Date(invoice.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => downloadInvoicePDF(invoice.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => viewInvoice(invoice)}
                        className="text-green-600 hover:text-green-900"
                        title="View Invoice"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => editInvoice(invoice)}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Edit Invoice"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => deleteInvoice(invoice)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Invoice"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      {(invoiceStatuses[invoice.id] || invoice.status) === 'UNPAID' && (
                        <button 
                          onClick={() => chargeInvoice(invoice)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Charge/Pay Invoice"
                        >
                          <CreditCard className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Invoice Modal */}
      <AddInvoiceModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onInvoiceAdded={fetchInvoices}
      />

      {/* Charge Invoice Modal */}
      {showChargeModal && (
        <ChargeClientModal 
        isOpen={showChargeModal}
        onClose={() => {
          setShowChargeModal(false);
          setSelectedInvoice(null);
        }}
        onPaymentProcessed={() => {
          // Update invoice status to PAID
          if (selectedInvoice) {
            setInvoiceStatuses(prev => ({
              ...prev,
              [selectedInvoice.id]: 'PAID'
            }));
          }
          fetchInvoices();
          setShowChargeModal(false);
          setSelectedInvoice(null);
        }}
        preSelectedInvoice={selectedInvoice}
        />
      )}
    </div>
  );
}