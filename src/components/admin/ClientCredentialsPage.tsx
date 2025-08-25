import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { useNotifications } from '../common/NotificationSystem';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Shield, 
  Key, 
  Eye, 
  EyeOff, 
  Copy, 
  RefreshCw, 
  Save,
  Edit3,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export function ClientCredentialsPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    notes: '',
  });
  
  const [credentialsData, setCredentialsData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
    sendEmail: true,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  useEffect(() => {
    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  const fetchClientData = async () => {
    try {
      const response = await apiClient.getUsers({ role: 'CLIENT' });
      const foundClient = response.users.find(u => u.id === clientId);
      
      if (!foundClient) {
        showError('Client not found');
        navigate('/admin/clients');
        return;
      }
      
      setClient(foundClient);
      populateProfileForm(foundClient);
      populateCredentialsForm(foundClient);
    } catch (error) {
      console.error('Error fetching client:', error);
      showError('Failed to load client data');
    } finally {
      setLoading(false);
    }
  };

  const populateProfileForm = (clientData: any) => {
    setProfileData({
      fullName: clientData.full_name || clientData.fullName || '',
      email: clientData.email || '',
      phone: clientData.phone || 
             clientData.communicationDetails?.find?.(c => c.type === 'PHONE')?.detail || 
             clientData.communication_details?.find?.(c => c.type === 'PHONE')?.detail || '',
      company: clientData.company || clientData.companyName || clientData.company_name || '',
      address: typeof clientData.address === 'string' ? clientData.address : 
               clientData.address ? `${clientData.address.street || ''} ${clientData.address.city || ''} ${clientData.address.state || ''} ${clientData.address.postalCode || ''}`.trim() : '',
      notes: clientData.notes || '',
    });
  };

  const populateCredentialsForm = (clientData: any) => {
    setCredentialsData({
      email: clientData.email || '',
      newPassword: '',
      confirmPassword: '',
      sendEmail: true,
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {
        fullName: profileData.fullName,
        email: profileData.email,
        ...(profileData.company && { companyName: profileData.company }),
        ...(profileData.phone && { 
          communicationDetails: [
            { type: 'EMAIL', subType: 'WORK', detail: profileData.email },
            { type: 'PHONE', subType: 'WORK', detail: profileData.phone }
          ]
        }),
        ...(profileData.address && {
          address: {
            street: profileData.address,
            city: '',
            state: '',
            postalCode: '',
            country: ''
          }
        })
      };
      
      await apiClient.updateClient(client.id, updateData);
      showSuccess('Client profile updated successfully');
      fetchClientData(); // Refresh data
    } catch (error: any) {
      console.error('Error updating client:', error);
      showError('Failed to update client profile', error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (credentialsData.newPassword !== credentialsData.confirmPassword) {
      showError('Passwords do not match');
      setSaving(false);
      return;
    }

    if (credentialsData.newPassword.length < 8) {
      showError('Password must be at least 8 characters long');
      setSaving(false);
      return;
    }

    try {
      await apiClient.updateClientCredentials(client.id, {
        email: credentialsData.email,
        password: credentialsData.newPassword,
        sendEmail: credentialsData.sendEmail,
      });

      showSuccess(
        'Credentials updated successfully',
        credentialsData.sendEmail ? 'Email sent to client with new credentials' : undefined
      );
      
      setCredentialsData(prev => ({
        ...prev,
        newPassword: '',
        confirmPassword: '',
      }));
      setGeneratedPassword('');
    } catch (error: any) {
      console.error('Error updating credentials:', error);
      showError('Failed to update credentials', error.message);
    } finally {
      setSaving(false);
    }
  };

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    setCredentialsData(prev => ({
      ...prev,
      newPassword: password,
      confirmPassword: password,
    }));
    showSuccess('Secure password generated');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSuccess('Copied to clipboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Client Not Found</h2>
        <p className="text-gray-600 mb-4">The requested client could not be found.</p>
        <button
          onClick={() => navigate('/admin/clients')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Clients
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/clients')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {client.full_name || client.fullName}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage client profile and portal access
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            client.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {client.isActive ? 'Active' : 'Inactive'}
          </span>
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
            {client.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'profile', name: 'Profile Information', icon: User },
              { id: 'credentials', name: 'Portal Access', icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                      placeholder="ABC Company Inc."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    rows={2}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={profileData.notes}
                  onChange={(e) => setProfileData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                  placeholder="Additional notes about this client..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Update Profile
                </button>
              </div>
            </form>
          )}

          {activeTab === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Portal Access Management
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                      Manage client portal login credentials and access settings.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={credentialsData.email}
                    onChange={(e) => setCredentialsData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="client@example.com"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(credentialsData.email)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={credentialsData.newPassword}
                    onChange={(e) => setCredentialsData(prev => ({ ...prev, newPassword: e.target.value }))}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-20 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter new password"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex space-x-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(credentialsData.newPassword)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      disabled={!credentialsData.newPassword}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={credentialsData.confirmPassword}
                    onChange={(e) => setCredentialsData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <button
                  type="button"
                  onClick={generateSecurePassword}
                  className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Secure Password
                </button>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-2 text-center">
                  Click to generate a secure 12-character password
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={credentialsData.sendEmail}
                  onChange={(e) => setCredentialsData(prev => ({ ...prev, sendEmail: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Send login credentials via email
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Update Credentials
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}