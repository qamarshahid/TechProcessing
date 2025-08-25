import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api';
import { 
  Plus, 
  Search, 
  Filter, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  Trash2,
  Edit,
  Eye,
  Calendar,
  DollarSign,
  User,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Clock,
  Mail
} from 'lucide-react';
import { CreatePaymentLinkModal } from './CreatePaymentLinkModal';

interface PaymentLink {
  id: string;
  title: string;
  description?: string;
  amount: string;
  clientId: string;
  client?: {
    id: string;
    fullName: string;
    email: string;
  };
  status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED';
  secureToken: string;
  token?: string; // For backward compatibility
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export function PaymentLinksPage() {
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    fetchPaymentLinks();
  }, []);

  const fetchPaymentLinks = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getPaymentLinks();
      const links = response.links || response;
      setPaymentLinks(links);
      setError('');
    } catch (error) {
      console.error('Error fetching payment links:', error);
      setError('Failed to load payment links');
      setPaymentLinks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment link?')) return;
    
    try {
      await apiClient.deletePaymentLink(id);
      setPaymentLinks(prev => prev.filter(link => link.id !== id));
    } catch (error) {
      console.error('Error deleting payment link:', error);
      alert('Failed to delete payment link');
    }
  };

  const handleResendEmail = async (id: string) => {
    try {
      await apiClient.resendPaymentLinkEmail(id);
      alert('Email sent successfully');
    } catch (error) {
      console.error('Error resending email:', error);
      alert('Failed to resend email');
    }
  };

  const copyToClipboard = async (text: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(linkId);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'USED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
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

  const filteredPaymentLinks = paymentLinks.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.client?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.amount.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || link.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: paymentLinks.length,
    active: paymentLinks.filter(link => link.status === 'ACTIVE').length,
    used: paymentLinks.filter(link => link.status === 'USED').length,
    expired: paymentLinks.filter(link => link.status === 'EXPIRED').length,
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Links</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Create and manage payment links for clients</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPaymentLinks}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-slate-600 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Payment Link
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <LinkIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Links</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.used}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Expired</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.expired}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, client, or amount..."
                className="pl-10 w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

      {/* Results Summary */}
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Showing {filteredPaymentLinks.length} of {paymentLinks.length} payment links
      </div>

      {/* Payment Links Grid */}
      {filteredPaymentLinks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaymentLinks.map((link) => (
            <div key={link.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{link.title}</h3>
                  {link.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{link.description}</p>
                  )}
                  <div className="flex items-center">
                    {getStatusIcon(link.status)}
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(link.status)}`}>
                      {link.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(`${window.location.origin}/payment-link/${link.secureToken || link.token}`, link.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="Copy link"
                  >
                    {copiedLink === link.id ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <a
                    href={`/payment-link/${link.secureToken || link.token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    title="View payment link"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleResendEmail(link.id)}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="Resend email"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePaymentLink(link.id)}
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Delete payment link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <User className="h-4 w-4 mr-2" />
                    Client
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {link.client?.fullName || 'Unknown'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Amount
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${parseFloat(link.amount).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    Expires
                  </div>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {new Date(link.expires_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-slate-700 p-12 text-center">
          <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No payment links found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || statusFilter !== 'ALL' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first payment link.'
            }
          </p>
          {!searchTerm && statusFilter === 'ALL' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Payment Link
            </button>
          )}
        </div>
      )}

      {/* Create Payment Link Modal */}
      {showCreateModal && (
        <CreatePaymentLinkModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newLink) => {
            setPaymentLinks(prev => [newLink, ...prev]);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}