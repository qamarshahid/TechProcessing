import React, { useState, useEffect } from 'react';
import { useNotifications } from '../common/NotificationSystem';
import { apiClient } from '../../lib/api';
import { logger } from '../../lib/logger';
import { CreatePaymentLinkModal } from './CreatePaymentLinkModal';
import { PaymentLinkDetailsModal } from './PaymentLinkDetailsModal';
import { SendPaymentLinkModal } from './SendPaymentLinkModal';
import { 
  Link as LinkIcon, 
  Plus, 
  Eye, 
  Send, 
  Trash2, 
  Copy, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertCircle,
  DollarSign,
  Calendar,
  User,
  RefreshCw,
  Search,
  Filter,
  ExternalLink,
  Mail,
  MessageSquare
} from 'lucide-react';

export function PaymentLinksPage() {
  const { showSuccess, showError } = useNotifications();
  const [paymentLinks, setPaymentLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>(null);

  useEffect(() => {
    fetchPaymentLinks();
  }, []);

  const fetchPaymentLinks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getPaymentLinks();
      const linksList = response?.links || [];
      
      setPaymentLinks(Array.isArray(linksList) ? linksList : []);
      showSuccess('Payment Links Loaded', `Successfully loaded ${linksList.length} payment links.`);
    } catch (error) {
      logger.error('Error fetching payment links:', error);
      showError('Failed to Load Payment Links', 'Unable to load payment links. Please try again later.');
      setPaymentLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = (newLink: any) => {
    setShowCreateModal(false);
    fetchPaymentLinks(); // Refresh the list
    showSuccess('Payment Link Created', 'New payment link has been created successfully.');
  };

  const handleViewDetails = (link: any) => {
    setSelectedLink(link);
    setShowDetailsModal(true);
  };

  const handleSendLink = (link: any) => {
    setSelectedLink(link);
    setShowSendModal(true);
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this payment link?')) {
      return;
    }

    try {
      await apiClient.deletePaymentLink(linkId);
      setPaymentLinks(prev => prev.filter(link => link.id !== linkId));
      showSuccess('Payment Link Deleted', 'Payment link has been deleted successfully.');
    } catch (error) {
      logger.error('Error deleting payment link:', error);
      showError('Delete Failed', 'Failed to delete payment link. Please try again.');
    }
  };

  const copyLinkToClipboard = async (link: any) => {
    const paymentUrl = `${window.location.origin}/payment-link/${link.secureToken || link.token}`;
    
    try {
      await navigator.clipboard.writeText(paymentUrl);
      showSuccess('Link Copied', 'Payment link has been copied to clipboard.');
    } catch (error) {
      showError('Copy Failed', 'Failed to copy link to clipboard.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-accent100 text-accent800 dark:bg-accent900/20 dark:text-accent400';
      case 'USED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-muted';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4" />;
      case 'USED':
        return <CheckCircle className="h-4 w-4" />;
      case 'EXPIRED':
        return <XCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredLinks = paymentLinks.filter(link => {
    const matchesSearch = link.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.client?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || link.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-surface2 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-surface2 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-surface2 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-fg">Payment Links</h1>
          <p className="text-sm text-gray-600 dark:text-muted">Create and manage secure payment links</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchPaymentLinks}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-fg rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-accent1 text-fg rounded-lg hover:bg-accent1 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Payment Link
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-gray-200 dark:border-outline p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <LinkIcon className="h-6 w-6 text-fg" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-muted">Total Links</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-fg">{paymentLinks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-gray-200 dark:border-outline p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-accent500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="h-6 w-6 text-fg" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-muted">Active Links</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-fg">
                {paymentLinks.filter(link => link.status === 'ACTIVE').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-gray-200 dark:border-outline p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="h-6 w-6 text-fg" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-muted">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-fg">
                ${paymentLinks.reduce((sum, link) => sum + parseFloat(link.amount || '0'), 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface rounded-xl shadow-sm border border-gray-200 dark:border-outline p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="h-6 w-6 text-fg" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-muted">Used Links</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-fg">
                {paymentLinks.filter(link => link.status === 'USED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

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
                placeholder="Search payment links..."
                className="pl-10 w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-surface2 text-gray-900 dark:text-fg placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-surface2 text-gray-900 dark:text-fg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="USED">Used</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Links Table */}
      <div className="bg-white dark:bg-surface rounded-lg shadow-sm border border-gray-200 dark:border-outline">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-outline">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-fg">
            Payment Links ({filteredLinks.length})
          </h2>
        </div>
        
        {filteredLinks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
              <thead className="bg-gray-50 dark:bg-surface2">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                    Expires
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface divide-y divide-gray-200 dark:divide-slate-600">
                {filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50 dark:hover:bg-surface2">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-fg">
                          {link.title}
                        </div>
                        {link.description && (
                          <div className="text-xs text-gray-500 dark:text-muted truncate max-w-xs">
                            {link.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-fg">
                        {link.client?.fullName || 'Guest Payment'}
                      </div>
                      {link.client?.email && (
                        <div className="text-xs text-gray-500 dark:text-muted">
                          {link.client.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-fg">
                        ${parseFloat(link.amount).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(link.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(link.status)}`}>
                          {link.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-fg">
                      {link.created_at && !isNaN(new Date(link.created_at).getTime()) 
                        ? new Date(link.created_at).toLocaleDateString()
                        : 'No date'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-fg">
                      <div>
                        <div>
                          {link.expires_at && !isNaN(new Date(link.expires_at).getTime()) 
                            ? new Date(link.expires_at).toLocaleDateString()
                            : 'No expiry'
                          }
                        </div>
                        {link.expires_at && new Date(link.expires_at) < new Date() && (
                          <div className="text-xs text-red-500 dark:text-red-400">Expired</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(link)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => copyLinkToClipboard(link)}
                          className="text-accent600 hover:text-accent900 dark:text-accent400 dark:hover:text-accent300"
                          title="Copy Link"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleSendLink(link)}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="Send Link"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteLink(link.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete Link"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-surface2 rounded-full flex items-center justify-center mx-auto mb-4">
              <LinkIcon className="h-8 w-8 text-muted dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-fg mb-2">No Payment Links Found</h3>
            <p className="text-gray-500 dark:text-muted mb-6">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first payment link to start accepting payments.'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-accent1 text-fg rounded-lg hover:bg-accent1 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Payment Link
            </button>
          </div>
        )}
      </div>

      {/* Payment Link Usage Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
            <LinkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Payment Link Features</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-blue-800 dark:text-blue-200">Send to anyone via email or SMS</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-blue-800 dark:text-blue-200">Secure token-based authentication</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span className="text-blue-800 dark:text-blue-200">Automatic expiration and tracking</span>
          </div>
        </div>
      </div>

      {/* Create Payment Link Modal */}
      {showCreateModal && (
        <CreatePaymentLinkModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateLink}
        />
      )}

      {/* Payment Link Details Modal */}
      {showDetailsModal && selectedLink && (
        <PaymentLinkDetailsModal
          link={selectedLink}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedLink(null);
          }}
          onLinkUpdated={fetchPaymentLinks}
        />
      )}

      {/* Send Payment Link Modal */}
      {showSendModal && selectedLink && (
        <SendPaymentLinkModal
          link={selectedLink}
          onClose={() => {
            setShowSendModal(false);
            setSelectedLink(null);
          }}
          onSent={fetchPaymentLinks}
        />
      )}
    </div>
  );
}