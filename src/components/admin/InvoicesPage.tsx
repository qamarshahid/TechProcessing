import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { useNotifications } from '../common/NotificationSystem';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { Plus, Eye, Edit, Trash2, Download, CreditCard, X, AlertTriangle } from 'lucide-react';
import { AddInvoiceModal } from './AddInvoiceModal';
import { SearchFilters } from './SearchFilters';
import { ChargeClientModal } from './ChargeClientModal';

export function InvoicesPage() {
  const { showSuccess, showError, showWarning } = useNotifications();
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
  
  // Confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePayments, setDeletePayments] = useState(false);
  
  // Status change modal state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [invoiceToUpdate, setInvoiceToUpdate] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

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
      showSuccess('Invoices Loaded', `Successfully loaded ${response.invoices?.length || 0} invoices.`);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      showError('Failed to Load Invoices', 'Unable to load invoices. Please try again later.');
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

  const handleDeleteClick = (invoice: any) => {
    setInvoiceToDelete(invoice);
    setShowDeleteModal(true);
  };

  const deleteInvoice = async () => {
    if (!invoiceToDelete) return;
    
    setIsDeleting(true);
    try {
      await apiClient.deleteInvoice(invoiceToDelete.id, deletePayments);
      // Remove from local state immediately
      setInvoices(prev => prev.filter(inv => inv.id !== invoiceToDelete.id));
      setFilteredInvoices(prev => prev.filter(inv => inv.id !== invoiceToDelete.id));
      setInvoiceStatuses(prev => {
        const newStatuses = { ...prev };
        delete newStatuses[invoiceToDelete.id];
        return newStatuses;
      });
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event('invoices-updated'));
      
      const message = deletePayments 
        ? `Invoice and associated payments for ${invoiceToDelete.client_name} have been deleted successfully.`
        : `Invoice for ${invoiceToDelete.client_name} has been deleted successfully.`;
      
      showSuccess('Invoice Deleted', message);
      fetchInvoices();
    } catch (error: any) {
      console.error('Error deleting invoice:', error);
      
      // Handle specific error messages from the backend
      if (error.message && error.message.includes('associated payments')) {
        showError('Cannot Delete Invoice', 'This invoice has associated payments and cannot be deleted. Please delete the payments first or check the "Delete Associated Payments" option.');
      } else if (error.message && error.message.includes('paid invoice')) {
        showError('Cannot Delete Invoice', 'Paid invoices cannot be deleted.');
      } else {
        showError('Delete Failed', 'Failed to delete invoice. Please try again.');
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setInvoiceToDelete(null);
      setDeletePayments(false);
    }
  };

  const chargeInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowChargeModal(true);
  };

  const handleStatusChangeClick = (invoice: any) => {
    const currentStatus = invoiceStatuses[invoice.id] || invoice.status;
    setInvoiceToUpdate(invoice);
    setNewStatus(currentStatus);
    setShowStatusModal(true);
  };

  const changeInvoiceStatus = async () => {
    if (!invoiceToUpdate || !newStatus) return;
    
    const statusOptions = ['PAID', 'UNPAID', 'OVERDUE', 'CANCELLED'];
    if (!statusOptions.includes(newStatus.toUpperCase())) {
      showError('Invalid Status', 'Please select a valid status from the dropdown.');
      return;
    }
    
    setIsUpdatingStatus(true);
    try {
      await apiClient.updateInvoiceStatus(invoiceToUpdate.id, newStatus.toUpperCase());
      // Update local state
      setInvoiceStatuses(prev => ({
        ...prev,
        [invoiceToUpdate.id]: newStatus.toUpperCase()
      }));
      showSuccess('Status Updated', `Invoice status has been updated to ${newStatus.toUpperCase()} successfully.`);
      fetchInvoices();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      showError('Update Failed', 'Failed to update invoice status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
      setShowStatusModal(false);
      setInvoiceToUpdate(null);
      setNewStatus('');
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
                      onClick={() => handleStatusChangeClick(invoice)}
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
                        onClick={() => handleDeleteClick(invoice)}
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && invoiceToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => !isDeleting && setShowDeleteModal(false)}
            />
            
            {/* Modal */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all">
              {/* Header */}
              <div className="px-6 py-4 border-b border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="h-6 w-6 text-red-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Delete Invoice
                    </h3>
                  </div>
                  <button
                    onClick={() => !isDeleting && setShowDeleteModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    disabled={isDeleting}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Are you sure you want to delete the invoice for <span className="font-semibold text-gray-900 dark:text-white">{invoiceToDelete.client_name}</span>? This action cannot be undone and will permanently remove the invoice from the system.
                </p>
                
                {/* Payment Deletion Option */}
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Associated Payments
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        This invoice may have associated payments. Check the option below to delete them as well.
                      </p>
                      <div className="mt-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={deletePayments}
                            onChange={(e) => setDeletePayments(e.target.checked)}
                            disabled={isDeleting}
                            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-yellow-800 dark:text-yellow-200">
                            Delete associated payments as well
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteInvoice}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Invoice</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      {showStatusModal && invoiceToUpdate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => !isUpdatingStatus && setShowStatusModal(false)}
            />
            
            {/* Modal */}
            <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all">
              {/* Header */}
              <div className="px-6 py-4 border-b border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">!</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Update Invoice Status
                    </h3>
                  </div>
                  <button
                    onClick={() => !isUpdatingStatus && setShowStatusModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    disabled={isUpdatingStatus}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Update the status for invoice <span className="font-semibold text-gray-900 dark:text-white">#{invoiceToUpdate.id}</span> 
                    for client <span className="font-semibold text-gray-900 dark:text-white">{invoiceToUpdate.client_name}</span>.
                  </p>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Status
                    </label>
                    <div className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(invoiceStatuses[invoiceToUpdate.id] || invoiceToUpdate.status)}`}>
                      {invoiceStatuses[invoiceToUpdate.id] || invoiceToUpdate.status}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Status *
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      disabled={isUpdatingStatus}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select a status...</option>
                      <option value="PAID">PAID</option>
                      <option value="UNPAID">UNPAID</option>
                      <option value="OVERDUE">OVERDUE</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
                <button
                  onClick={() => setShowStatusModal(false)}
                  disabled={isUpdatingStatus}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={changeInvoiceStatus}
                  disabled={isUpdatingStatus || !newStatus}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isUpdatingStatus ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Update Status</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}