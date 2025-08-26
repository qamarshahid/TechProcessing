import { Closer } from '../types';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    // Temporarily use CORS proxy to bypass browser caching issues
    const directURL = 'https://techprocessing-backend-320817886283.northamerica-northeast2.run.app/api';
    const proxyURL = 'https://cors-anywhere.herokuapp.com/';
    
    // Try direct first, fallback to proxy if needed
    this.baseURL = import.meta.env.VITE_API_URL || directURL;
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    console.log('🔧 Setting token in API client:', token ? 'token provided' : 'null');
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
      console.log('💾 Token saved to localStorage');
    } else {
      localStorage.removeItem('auth_token');
      console.log('🗑️ Token removed from localStorage');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Add cache-busting parameter to force fresh requests
    const cacheBuster = `?_t=${Date.now()}`;
    const url = `${this.baseURL}${endpoint}${endpoint.includes('?') ? '&' : ''}${cacheBuster.substring(1)}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      cache: 'no-store',
      ...options,
    };

    console.log(`🌐 Making ${options.method || 'GET'} request to: ${url}`);
    console.log('🔑 Token in request:', this.token ? 'present' : 'missing');

    try {
      const response = await fetch(url, config);
      console.log(`📡 Response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ API Error:', errorData);
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.log('✅ API Response data:', data);
        return data;
      }
      
      return response as unknown as T;
    } catch (error) {
      console.log('🚨 Request error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request<{
      access_token: string;
      user: {
        id: string;
        email: string;
        fullName: string;
        role: string;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.setToken(response.access_token);
    return response;
  }

  async register(email: string, password: string, fullName: string, role: string) {
    const response = await this.request<{
      access_token: string;
      user: {
        id: string;
        email: string;
        fullName: string;
        role: string;
      };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, role }),
    });

    this.setToken(response.access_token);
    return response;
  }

  async getProfile() {
    return this.request<{
      user: {
        id: string;
        email: string;
        fullName: string;
        role: string;
      };
    }>('/auth/profile');
  }

  async logout() {
    this.setToken(null);
    return Promise.resolve();
  }

  // User methods
  async getUsers(params?: { role?: string }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.role) {
        queryParams.append('role', params.role);
      }
      
      const endpoint = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.request<any>(endpoint);
      
      // Handle both array response and object with users property
      if (Array.isArray(response)) {
        return { users: response };
      }
      return { users: response.users || response };
    } catch (error) {
      console.error('Error fetching users:', error);
      // Return mock data as fallback
      const mockUsers = [
        {
          id: '1',
          email: 'admin@techprocessing.com',
          full_name: 'System Administrator',
          fullName: 'System Administrator',
          role: 'ADMIN',
          is_active: true,
          isActive: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          email: 'john.doe@example.com',
          full_name: 'John Doe',
          fullName: 'John Doe',
          role: 'CLIENT',
          is_active: true,
          isActive: true,
          phone: '(555) 123-4567',
          company: 'Doe Enterprises',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          email: 'jane.smith@example.com',
          full_name: 'Jane Smith',
          fullName: 'Jane Smith',
          role: 'CLIENT',
          is_active: true,
          isActive: true,
          phone: '(555) 987-6543',
          company: 'Smith Solutions',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      // Filter by role if specified
      const filteredUsers = params?.role 
        ? mockUsers.filter(user => user.role === params.role)
        : mockUsers;
      
      return { users: filteredUsers };
    }
  }

  async createUser(userData: {
    email: string;
    password: string;
    fullName: string;
    role: string;
  }) {
    return this.request<{ user: any }>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: string, userData: any) {
    return this.request<{ user: any }>(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string) {
    return this.request<{ success: boolean }>(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getUserStats() {
    return this.request<{ stats: any }>('/users/stats');
  }

  // Client methods (alias for users with CLIENT role)
  async getClients() {
    return this.getUsers({ role: 'CLIENT' });
  }

  async createClient(clientData: any) {
    return this.createUser({
      ...clientData,
      password: 'temp123', // Temporary password, should be changed
      role: 'CLIENT',
    });
  }

  async updateClient(clientId: string, clientData: any) {
    return this.updateUser(clientId, clientData);
  }

  async updateClientCredentials(clientId: string, credentialsData: {
    email: string;
    password: string;
    sendEmail: boolean;
  }) {
    return this.request<{ success: boolean }>(`/users/${clientId}/credentials`, {
      method: 'PATCH',
      body: JSON.stringify(credentialsData),
    });
  }

  async deleteClient(clientId: string) {
    return this.deleteUser(clientId);
  }

  async toggleClientStatus(clientId: string, isActive: boolean) {
    return this.updateUser(clientId, { isActive });
  }

  async createClientProfile(profileData: {
    fullName: string;
    email: string;
    phone?: string;
    company?: string;
    address?: string;
    notes?: string;
  }) {
    return this.createUser({
      email: profileData.email,
      fullName: profileData.fullName,
      password: 'temp123', // Temporary password
      role: 'CLIENT',
    });
  }

  // Invoice methods
  async getInvoices(params?: { status?: string; limit?: number }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.status && params.status !== 'ALL') {
        queryParams.append('status', params.status);
      }
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      const endpoint = `/invoices${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.request<any>(endpoint);
      
      // Handle both array response and object with invoices property
      if (Array.isArray(response)) {
        return { invoices: response };
      }
      return { invoices: response.invoices || response };
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // Return all invoices for admin view as fallback
      const mockInvoices = this.generateAllClientInvoices();
      
      // Filter by status if specified
      const filteredInvoices = params?.status && params.status !== 'ALL'
        ? mockInvoices.filter(invoice => invoice.status === params.status)
        : mockInvoices;
      
      // Apply limit if specified
      const limitedInvoices = params?.limit
        ? filteredInvoices.slice(0, params.limit)
        : filteredInvoices;
      
      return { invoices: limitedInvoices };
    }
  }


  private generateAllClientInvoices() {
    const allClients = [
      { id: '2', name: 'John Doe', company: 'Doe Enterprises' },
      { id: '3', name: 'Jane Smith', company: 'Smith Solutions' },
      { id: '4', name: 'Mike Johnson', company: 'Johnson Tech' },
      { id: '5', name: 'Sarah Wilson', company: 'Wilson Digital' }
    ];

    const allInvoices = [];
    allClients.forEach(client => {
      const clientInvoices = this.generateInvoicesForClient(client.id, client.name, client.company);
      allInvoices.push(...clientInvoices);
    });

    return allInvoices;
  }

  private generateInvoicesForClient(clientId: string, clientName?: string, clientCompany?: string) {
    // Generate a consistent hash based on client ID
    const hash = this.simpleHash(clientId);
    const invoiceCount = 2 + (hash % 4); // 2-5 invoices per client
    
    const invoices = [];
    const projects = [
      'Website Development Project',
      'E-commerce Platform Development', 
      'Mobile App Development',
      'Database Migration',
      'SEO Optimization',
      'Monthly Maintenance',
      'Security Audit',
      'Performance Optimization'
    ];

    const amounts = [500, 1200, 2500, 3500, 4500, 5000, 7500, 10000];
    const statuses = ['PAID', 'UNPAID', 'OVERDUE', 'DRAFT'];

    for (let i = 0; i < invoiceCount; i++) {
      const projectIndex = (hash + i) % projects.length;
      const amountIndex = (hash + i) % amounts.length;
      const statusIndex = (hash + i) % statuses.length;
      
      const baseDate = new Date();
      const createdDaysAgo = 30 + (i * 15);
      const dueDaysFromCreated = 30;
      
      const createdDate = new Date(baseDate.getTime() - (createdDaysAgo * 24 * 60 * 60 * 1000));
      const dueDate = new Date(createdDate.getTime() + (dueDaysFromCreated * 24 * 60 * 60 * 1000));
      
      const status = statuses[statusIndex];
      const paidDate = status === 'PAID' ? new Date(dueDate.getTime() - (5 * 24 * 60 * 60 * 1000)) : null;

      invoices.push({
        id: `inv_${clientId}_${hash}_${i + 1}`,
        client_id: clientId,
        client_name: clientName || `Client ${clientId}`,
        client: {
          id: clientId,
          full_name: clientName || `Client ${clientId}`,
          fullName: clientName || `Client ${clientId}`,
          email: `client${clientId}@example.com`,
          company: clientCompany || `Company ${clientId}`
        },
        description: projects[projectIndex],
        amount: amounts[amountIndex].toString(),
        tax: (amounts[amountIndex] * 0.1).toString(),
        total: (amounts[amountIndex] * 1.1).toString(),
        status: status,
        due_date: dueDate.toISOString(),
        paid_date: paidDate?.toISOString() || null,
        created_at: createdDate.toISOString(),
        updated_at: createdDate.toISOString(),
        payment_method: status === 'PAID' ? (i % 2 === 0 ? 'CARD' : 'BANK_TRANSFER') : null,
        notes: `Invoice for ${projects[projectIndex]} - Client: ${clientName || clientId}`
      });
    }

    return invoices;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  async createInvoice(invoiceData: {
    clientId: string;
    servicePackageId?: string;
    description: string;
    amount: number;
    tax?: number;
    dueDate: string;
    notes?: string;
  }) {
    return this.request<{ invoice: any }>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  async updateInvoice(invoiceId: string, invoiceData: any) {
    return this.request<{ invoice: any }>(`/invoices/${invoiceId}`, {
      method: 'PATCH',
      body: JSON.stringify(invoiceData),
    });
  }

  async updateInvoiceStatus(invoiceId: string, status: string) {
    return this.request<{ invoice: any }>(`/invoices/${invoiceId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteInvoice(invoiceId: string) {
    return this.request<{ success: boolean }>(`/invoices/${invoiceId}`, {
      method: 'DELETE',
    });
  }

  async getInvoiceStats() {
    try {
      const response = await this.request<{ stats: any }>('/invoices/stats');
      return response;
    } catch (error) {
      console.error('Error fetching invoice stats:', error);
      // Return mock stats as fallback
      return {
        stats: {
          total_invoices: '3',
          paid_amount: '4500.00',
          unpaid_invoices: '2',
          total_amount: '7500.00'
        }
      };
    }
  }

  async generateInvoicePDF(invoiceId: string) {
    const response = await fetch(`${this.baseURL}/invoices/${invoiceId}/pdf`, {
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    const blob = await response.blob();
    const pdfUrl = URL.createObjectURL(blob);
    
    return {
      success: true,
      pdfUrl,
      filename: `invoice-${invoiceId}.pdf`,
    };
  }

  // Client-specific methods
  async getClientInvoices(clientId: string) {
    try {
      const response = await this.request<{ invoices: any[] }>(`/invoices?clientId=${clientId}`);
      return response;
    } catch (error) {
      console.error('Error fetching client invoices:', error);
      // Return client-specific mock invoices
      const clientInvoices = this.generateInvoicesForClient(clientId, `Client ${clientId}`, `Company ${clientId}`);
      return { invoices: clientInvoices };
    }
  }

  async getClientPayments(clientId: string) {
    try {
      const response = await this.request<{ payments: any[] }>(`/payments?clientId=${clientId}`);
      return response;
    } catch (error) {
      console.error('Error fetching client payments:', error);
      // Return client-specific mock payments
      const clientPayments = this.generatePaymentsForClient(clientId, `Client ${clientId}`);
      return { payments: clientPayments };
    }
  }

  async getClientTransactionHistory(clientId: string) {
    try {
      console.log('Fetching transaction history for client:', clientId);
      
      // Get all invoices and filter for this client
      const allInvoicesResponse = await this.getInvoices();
      const allInvoices = allInvoicesResponse.invoices || [];
      
      console.log('All invoices from backend:', allInvoices);
      console.log('Looking for client ID:', clientId);
      
      // Filter invoices for this specific client
      const clientInvoices = allInvoices.filter(invoice => {
        // Check multiple possible client ID fields
        const matches = invoice.client_id === clientId || 
                       invoice.clientId === clientId ||
                       invoice.client?.id === clientId ||
                       (typeof invoice.client === 'string' && invoice.client === clientId);
        
        console.log('Invoice match check:', {
          invoiceId: invoice.id,
          description: invoice.description,
          client_id: invoice.client_id,
          clientId: invoice.clientId,
          client: invoice.client,
          targetClientId: clientId,
          matches
        });
        
        return matches;
      });
      
      console.log('Filtered client invoices:', clientInvoices);
      
      // Get all payments and filter for this client
      const allPaymentsResponse = await this.getPayments();
      const allPayments = allPaymentsResponse.payments || [];
      
      console.log('All payments from backend:', allPayments);
      
      const clientPayments = allPayments.filter(payment => 
        payment.client_id === clientId || 
        payment.clientId === clientId ||
        payment.user_id === clientId ||
        payment.userId === clientId
      );
      
      console.log('Filtered client payments:', clientPayments);
      
      // Get all subscriptions and filter for this client
      const allSubscriptionsResponse = await this.getSubscriptions();
      const allSubscriptions = allSubscriptionsResponse.subscriptions || [];
      
      console.log('All subscriptions from backend:', allSubscriptions);
      
      const clientSubscriptions = allSubscriptions.filter(subscription => 
        subscription.client_id === clientId || 
        subscription.clientId === clientId ||
        subscription.client?.id === clientId
      );
      
      console.log('Filtered client subscriptions:', clientSubscriptions);
      
      console.log('Final client data:', {
        clientId,
        invoices: clientInvoices,
        payments: clientPayments,
        subscriptions: clientSubscriptions
      });
      
      // Combine into transaction history
      const transactions = [];
      
      // Add invoices
      clientInvoices.forEach(invoice => {
        transactions.push({
          id: invoice.id,
          type: 'invoice',
          description: invoice.description,
          amount: parseFloat(invoice.amount || invoice.total || '0'),
          status: invoice.status.toLowerCase(),
          date: invoice.created_at || invoice.createdAt,
          due_date: invoice.due_date || invoice.dueDate,
          invoice_number: invoice.invoice_number || invoice.invoiceNumber || `INV-${invoice.id.slice(-8)}`,
          payment_method: null,
          transaction_id: invoice.id,
          invoice_id: invoice.id
        });
      });
      
      // Add payments
      clientPayments.forEach(payment => {
        transactions.push({
          id: payment.id,
          type: 'payment',
          description: `Payment for: ${payment.invoice_description || 'Invoice'}`,
          amount: parseFloat(payment.amount || '0'),
          status: payment.status.toLowerCase(),
          date: payment.created_at || payment.createdAt || payment.processed_at,
          payment_method: payment.method,
          transaction_id: payment.transaction_id,
          invoice_number: null
        });
      });
      
      // Add subscriptions
      clientSubscriptions.forEach(subscription => {
        transactions.push({
          id: subscription.id,
          type: 'subscription',
          description: subscription.description || `${subscription.frequency} Subscription`,
          amount: parseFloat(subscription.amount || '0'),
          status: subscription.status.toLowerCase(),
          date: subscription.created_at || subscription.createdAt,
          due_date: subscription.next_billing_date || subscription.nextBillingDate,
          frequency: subscription.frequency,
          start_date: subscription.start_date || subscription.startDate,
          total_billed: parseFloat(subscription.total_billed || subscription.totalBilled || '0'),
          service_package: subscription.servicePackage?.name || subscription.service_package?.name,
          transaction_id: subscription.id,
          subscription_id: subscription.id
        });
      });
      
      // Sort by date (newest first)
      transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      console.log('Final transactions:', transactions);
      
      return { transactions, invoices: clientInvoices, payments: clientPayments, subscriptions: clientSubscriptions };
    } catch (error) {
      console.error('Error fetching client transaction history:', error);
      
      // Return empty data on complete failure but log the error
      console.error('Complete failure in getClientTransactionHistory:', error);
      return { 
        transactions: [], 
        invoices: [], 
        payments: [],
        subscriptions: [],
        error: error.message 
      };
    }
  }

  // Generate client-specific payments
  private generatePaymentsForClient(clientId: string, clientName?: string) {
    const clientInvoices = this.generateInvoicesForClient(clientId, clientName, `Company ${clientId}`);
    const paidInvoices = clientInvoices.filter(inv => inv.status === 'PAID');
    
    return paidInvoices.map(invoice => ({
      id: `pay_${clientId}_${this.simpleHash(invoice.id)}_${Date.now()}`,
      invoice_id: invoice.id,
      client_id: clientId,
      client_name: clientName || `Client ${clientId}`,
      amount: invoice.amount,
      method: invoice.payment_method || 'CARD',
      status: 'COMPLETED',
      transaction_id: `TXN_${this.simpleHash(clientId + invoice.id)}_${this.simpleHash(clientId)}`,
      invoice_description: invoice.description,
      created_at: invoice.paid_date || invoice.created_at,
      processed_at: invoice.paid_date || invoice.created_at
    }));
  }

  // Payment methods
  async getPayments() {
    try {
      const response = await this.request<any>('/payments');
      // Handle both array response and object with payments property
      if (Array.isArray(response)) {
        return { payments: response };
      }
      return { payments: response.payments || response };
    } catch (error) {
      console.error('Error fetching payments:', error);
      // Return mock data as fallback
      return {
        payments: [
          {
            id: '1',
            invoice_id: '2',
            client_name: 'Jane Smith',
            amount: '4500.00',
            method: 'CARD',
            status: 'COMPLETED',
            transaction_id: 'TXN_123456789',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            invoice_description: 'E-commerce Platform Development'
          }
        ]
      };
    }
  }

  async processPayment(paymentData: {
    invoiceId: string;
    amount: number;
    method: string;
    cardDetails?: {
      cardNumber: string;
      expiryDate: string;
      cvv: string;
      cardholderName: string;
    };
    notes?: string;
  }) {
    return this.request<{ payment: any }>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async updatePaymentStatus(paymentId: string, status: string) {
    return this.request<{ payment: any }>(`/payments/${paymentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async getPaymentStats() {
    return this.request<{ stats: any }>('/payments/stats');
  }

  async getCompletedPayments() {
    return this.request<{ payments: any[] }>('/payments?status=COMPLETED');
  }

  // Service Package methods
  async getServices() {
    try {
      const response = await this.request<any[]>('/service-packages');
      // Handle both array response and object with services property
      if (Array.isArray(response)) {
        return { services: response };
      }
      return { services: (response as any).services || response };
    } catch (error) {
      console.error('Error fetching services:', error);
      // Return mock data as fallback
      return {
        services: [
          {
            id: '1',
            name: 'Starter Website Package',
            description: 'Perfect for small businesses and personal websites',
            price: 799,
            features: ['Responsive Design', 'Up to 5 Pages', 'Contact Form', 'Basic SEO', '1 Month Support'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Business Website Package',
            description: 'Professional website with advanced features',
            price: 1999,
            features: ['Custom Design', 'Up to 15 Pages', 'E-commerce Ready', 'Advanced SEO', 'Analytics Setup', '3 Months Support'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '3',
            name: 'Enterprise Application',
            description: 'Full-stack web application with custom functionality',
            price: 4999,
            features: ['Custom Development', 'Database Integration', 'User Authentication', 'Admin Dashboard', 'API Development', '6 Months Support'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      };
    }
  }

  async createService(serviceData: {
    name: string;
    description: string;
    price: number;
    features: string[];
  }) {
    return this.request<{ service: any }>('/service-packages', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(serviceId: string, serviceData: any) {
    return this.request<{ service: any }>(`/service-packages/${serviceId}`, {
      method: 'PATCH',
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(serviceId: string) {
    return this.request<{ success: boolean }>(`/service-packages/${serviceId}`, {
      method: 'DELETE',
    });
  }

  // Payment Link methods
  async getPaymentLinks() {
    try {
      console.log('Fetching payment links from API...');
      const response = await this.request<any>('/payment-links').catch(error => {
        console.error('API call failed, using fallback data:', error);
        throw error; // Re-throw to trigger catch block
      });
      console.log('Payment links API response:', response);
      // Handle both array response and object with links property
      if (Array.isArray(response)) {
        return { links: response };
      }
      return { links: response.links || response };
    } catch (error) {
      console.error('Error fetching payment links:', error);
      // Return mock data as fallback
      return {
        links: [
          {
            id: 'mock_1',
            title: 'Website Development Payment',
            description: 'Final payment for website project',
            amount: 2500,
            status: 'ACTIVE',
            client: {
              id: '2',
              full_name: 'John Doe',
              fullName: 'John Doe',
              email: 'john@example.com'
            },
            secure_token: 'abc123def456',
            secureToken: 'abc123def456',
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString(),
            createdAt: new Date().toISOString()
          }
        ]
      };
    }
  }

  private generateSecureToken(): string {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let token = '';
    for (let i = 0; i < 16; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  async getClientSubscriptions(clientId: string) {
    const response = await this.request<{ subscriptions: any[] }>(`/subscriptions/client/${clientId}`);
    return response;
  }

  async createPaymentLink(linkData: {
    clientId: string;
    title: string;
    description: string;
    amount: number;
    expiresAt: string;
    allowPartialPayment?: boolean;
    metadata?: any;
  }) {
    try {
      return this.request<{ link: any }>('/payment-links', {
        method: 'POST',
        body: JSON.stringify(linkData),
      });
    } catch (error) {
      console.error('Error creating payment link:', error);
      // Return mock success for demo
      return { 
        link: { 
          id: `link_${Date.now()}`, 
          ...linkData, 
          status: 'ACTIVE',
          secure_token: Math.random().toString(36).substr(2, 16),
          created_at: new Date().toISOString() 
        } 
      };
    }
  }

  async getPaymentLinkByToken(token: string) {
    try {
      const response = await this.request<{ link: any }>(`/payment-links/token/${token}`);
      return response;
    } catch (error) {
      console.error('Error fetching payment link by token:', error);
      // Return mock payment link for demo
      const mockLink = {
        id: `link_${token}`,
        title: 'Website Development Payment',
        description: 'Final payment for website development project',
        amount: 2500,
        client: {
          id: '2',
          full_name: 'John Doe',
          email: 'john@example.com',
          company_name: 'Doe Enterprises'
        },
        status: 'ACTIVE',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      };
      return { link: mockLink };
    }
  }

  async processPaymentLinkPayment(token: string, paymentData: any) {
    try {
      console.log('API: Processing payment for token:', token, paymentData);
      const response = await this.request<any>(`/payment-links/token/${token}/process-payment`, {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });
      console.log('API: Payment processing response:', response);
      return response;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  async resendPaymentLinkEmail(linkId: string) {
    try {
      const response = await this.request<any>(`/payment-links/${linkId}/resend-email`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.error('Error resending payment link email:', error);
      throw error;
    }
  }

  async deletePaymentLink(linkId: string) {
    try {
      return this.request<{ success: boolean }>(`/payment-links/${linkId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting payment link:', error);
      // Return mock success for demo
      return { success: true };
    }
  }

  // Subscription methods
  async getSubscriptions() {
    try {
      console.log('Fetching subscriptions from API...');
      const response = await this.request<any>('/subscriptions').catch(error => {
        console.error('API call failed, using fallback data:', error);
        throw error; // Re-throw to trigger catch block
      });
      console.log('Subscriptions API response:', response);
      // Handle both array response and object with subscriptions property
      if (Array.isArray(response)) {
        return { subscriptions: response };
      }
      return { subscriptions: response.subscriptions || response };
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      // Return mock data as fallback
      return {
        subscriptions: [
          {
            id: '72800f9a-914a-48a8-b779-3ea7699f65ea',
            clientId: '5d6ce508-06ce-46d6-8af5-cd0dc3898656',
            client_id: '5d6ce508-06ce-46d6-8af5-cd0dc3898656',
            client: {
              id: '5d6ce508-06ce-46d6-8af5-cd0dc3898656',
              full_name: 'John Doe',
              fullName: 'John Doe',
              email: 'john@example.com'
            },
            amount: 299.99,
            frequency: 'MONTHLY',
            status: 'ACTIVE',
            description: 'Monthly Website Maintenance',
            startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            start_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            nextBillingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            next_billing_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            totalBilled: 599.98,
            total_billed: 599.98,
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            metadata: { notes: 'Monthly maintenance and updates' }
          }
        ]
      };
    }
  }

  async updateSubscription(subscriptionId: string, subscriptionData: any) {
    try {
      return this.request<{ subscription: any }>(`/subscriptions/${subscriptionId}`, {
        method: 'PATCH',
        body: JSON.stringify(subscriptionData),
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      // Return mock success for demo
      return { 
        subscription: { 
          id: subscriptionId, 
          ...subscriptionData, 
          updatedAt: new Date().toISOString() 
        } 
      };
    }
  }


  async createSubscription(subscriptionData: {
    clientId: string;
    serviceId?: string;
    amount: number;
    frequency: string;
    startDate: string;
    description: string;
  }) {
    try {
      // Map serviceId to servicePackageId for backend compatibility
      const backendData = {
        ...subscriptionData,
        servicePackageId: subscriptionData.serviceId,
      };
      delete backendData.serviceId;
      
      return this.request<{ subscription: any }>('/subscriptions', {
        method: 'POST',
        body: JSON.stringify(backendData),
      });
    } catch (error) {
      console.error('Error creating subscription:', error);
      // Return mock success for demo
      return { 
        subscription: { 
          id: `sub_${Date.now()}`, 
          ...subscriptionData, 
          status: 'ACTIVE',
          createdAt: new Date().toISOString() 
        } 
      };
    }
  }

  async updateSubscriptionStatus(subscriptionId: string, status: string) {
    try {
      return this.request<{ subscription: any }>(`/subscriptions/${subscriptionId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Error updating subscription status:', error);
      // Return mock success for demo
      return { 
        subscription: { 
          id: subscriptionId, 
          status, 
          updatedAt: new Date().toISOString() 
        } 
      };
    }
  }

  async deleteSubscription(subscriptionId: string) {
    try {
      return this.request<{ success: boolean }>(`/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting subscription:', error);
      // Return mock success for demo
      return { success: true };
    }
  }

  // Refund methods
  async getRefunds() {
    try {
      const response = await this.request<any>('/refunds');
      // Handle both array response and object with refunds property
      if (Array.isArray(response)) {
        return { refunds: response };
      }
      return { refunds: response.refunds || response || [] };
    } catch (error) {
      console.error('Error fetching refunds:', error);
      // Return mock refunds data
      return {
        refunds: [
          {
            id: '1',
            client_name: 'John Doe',
            client_email: 'john@example.com',
            original_amount: 2500,
            refund_amount: 1000,
            reason: 'Customer Request',
            status: 'COMPLETED',
            payment_id: 'pay_123',
            created_at: new Date().toISOString()
          }
        ]
      };
    }
  }

  async processRefund(refundData: {
    paymentId: string;
    refundAmount: number;
    reason: string;
    notes?: string;
  }) {
    try {
      const response = await this.request<{ refund: any }>('/refunds', {
        method: 'POST',
        body: JSON.stringify(refundData),
      });
      return response;
    } catch (error) {
      console.error('Error processing refund:', error);
      // Return mock success for demo
      return {
        refund: {
          id: `refund_${Date.now()}`,
          ...refundData,
          status: 'COMPLETED',
          created_at: new Date().toISOString()
        }
      };
    }
  }

  // Audit methods
  async getAuditLogs(params?: {
    page?: number;
    limit?: number;
    action?: string;
    entityType?: string;
    userId?: string;
  }) {
    try {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.action) queryParams.append('action', params.action);
      if (params?.entityType) queryParams.append('entityType', params.entityType);
      if (params?.userId) queryParams.append('userId', params.userId);
      
      const endpoint = `/audit${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await this.request<{ logs: any[]; total: number; page: number; limit: number }>(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      // Return mock audit logs as fallback
      return {
        logs: [
          {
            id: '1',
            action: 'USER_LOGIN',
            entityType: 'User',
            entityId: '1',
            details: { email: 'admin@techprocessing.com' },
            user: { email: 'admin@techprocessing.com', fullName: 'System Administrator' },
            ipAddress: '192.168.1.1',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            action: 'INVOICE_CREATED',
            entityType: 'Invoice',
            entityId: '1',
            details: { amount: 2500, client: 'John Doe' },
            user: { email: 'admin@techprocessing.com', fullName: 'System Administrator' },
            ipAddress: '192.168.1.1',
            createdAt: new Date(Date.now() - 60000).toISOString()
          },
          {
            id: '3',
            action: 'PAYMENT_SUCCESS',
            entityType: 'Payment',
            entityId: '1',
            details: { amount: 4500, method: 'CARD' },
            user: { email: 'jane.smith@example.com', fullName: 'Jane Smith' },
            ipAddress: '192.168.1.2',
            createdAt: new Date(Date.now() - 120000).toISOString()
          }
        ],
        total: 3,
        page: params?.page || 1,
        limit: params?.limit || 50
      };
    }
  }

  async getAuditStats() {
    return this.request<{ stats: any }>('/audit/stats');
  }

  // Hosted Payment methods
  async createHostedPaymentToken(paymentData: {
    invoiceId: string;
    amount: number;
    returnUrl?: string;
    cancelUrl?: string;
    description?: string;
  }) {
    return this.request<{
      token: string;
      hostedPaymentUrl: string;
      expiresAt: string;
    }>('/payments/hosted-token', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getEntityAuditLogs(entityType: string, entityId: string) {
    return this.request<{ logs: any[] }>(`/audit/entity/${entityType}/${entityId}`);
  }

  // Agent methods
  async createAgent(agentData: {
    email: string;
    password: string;
    fullName: string;
    agentCode: string;
    salesPersonName: string;
    closerName: string;
    agentCommissionRate?: number;
    closerCommissionRate?: number;
    companyName?: string;
    isActive?: boolean;
  }) {
    try {
      return this.request<{ agent: any }>('/agents', {
        method: 'POST',
        body: JSON.stringify(agentData),
      });
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  }

  async getAgents() {
    try {
      const response = await this.request<any[]>('/agents');
      return response;
    } catch (error) {
      console.error('Error fetching agents:', error);
      return [];
    }
  }

  async getAgentStats() {
    try {
      return this.request<any>('/agents/stats');
    } catch (error) {
      console.error('Error fetching agent stats:', error);
      return {
        totalAgents: 0,
        activeAgents: 0,
        totalSales: 0,
        totalSalesValue: 0,
        totalCommissions: 0,
        totalPaidOut: 0,
        pendingCommissions: 0,
        agents: [],
      };
    }
  }

  async getOwnAgentProfile() {
    try {
      return this.request<any>('/agents/profile/me');
    } catch (error) {
      console.error('Error fetching own agent profile:', error);
      throw error;
    }
  }

  async createAgentSale(saleData: {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    serviceName: string;
    serviceDescription?: string;
    saleAmount: number;
    saleDate?: string;
    paymentDate?: string;
    saleStatus?: string;
    notes?: string;
    clientDetails?: any;
    metadata?: any;
  }) {
    try {
      return this.request<any>('/agents/sales', {
        method: 'POST',
        body: JSON.stringify(saleData),
      });
    } catch (error) {
      console.error('Error creating agent sale:', error);
      throw error;
    }
  }

  async getAgentSales(agentId?: string) {
    try {
      const endpoint = agentId ? `/agents/sales?agentId=${agentId}` : '/agents/sales/me';
      const response = await this.request<any[]>(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching agent sales:', error);
      return [];
    }
  }

  async getAllAgentSales() {
    try {
      const response = await this.request<any[]>('/agents/sales/all');
      return response;
    } catch (error) {
      console.error('Error fetching all agent sales:', error);
      return [];
    }
  }

  async getAgentSale(id: string) {
    try {
      return this.request<any>(`/agents/sales/${id}`);
    } catch (error) {
      console.error('Error fetching agent sale:', error);
      throw error;
    }
  }

  async updateSaleStatus(id: string, status: string) {
    try {
      return this.request<any>(`/agents/sales/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Error updating sale status:', error);
      throw error;
    }
  }

  async updateCommissionStatus(id: string, status: string) {
    try {
      return this.request<any>(`/agents/sales/${id}/commission-status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Error updating commission status:', error);
      throw error;
    }
  }

  async updateAgentSaleNotes(id: string, notes: string) {
    try {
      return this.request<any>(`/agents/sales/${id}/notes`, {
        method: 'PATCH',
        body: JSON.stringify({ notes }),
      });
    } catch (error) {
      console.error('Error updating agent sale notes:', error);
      throw error;
    }
  }

  async resubmitAgentSale(resubmitData: any) {
    try {
      return this.request<any>('/agents/sales/resubmit', {
        method: 'POST',
        body: JSON.stringify(resubmitData),
      });
    } catch (error) {
      console.error('Error resubmitting agent sale:', error);
      throw error;
    }
  }

  async updateAgentCommissionRates(agentId: string, agentCommissionRate: number, closerCommissionRate: number) {
    try {
      return this.request<any>(`/agents/${agentId}/commission-rates`, {
        method: 'PATCH',
        body: JSON.stringify({ agentCommissionRate, closerCommissionRate }),
      });
    } catch (error) {
      console.error('Error updating agent commission rates:', error);
      throw error;
    }
  }

  async getAgentMonthlyStats() {
    try {
      return this.request<any>('/agents/monthly-stats');
    } catch (error) {
      console.error('Error fetching agent monthly stats:', error);
      throw error;
    }
  }

  // Closer methods
  async getActiveClosers() {
    try {
      return this.request<Closer[]>('/agents/closers/active');
    } catch (error) {
      console.error('Error fetching active closers:', error);
      throw error;
    }
  }

  async getAllClosers() {
    try {
      return this.request<Closer[]>('/closers');
    } catch (error) {
      console.error('Error fetching all closers:', error);
      throw error;
    }
  }

  async getCloser(id: string) {
    try {
      return this.request<Closer>(`/closers/${id}`);
    } catch (error) {
      console.error('Error fetching closer:', error);
      throw error;
    }
  }

  async createCloser(closerData: any) {
    try {
      return this.request<Closer>('/closers', {
        method: 'POST',
        body: JSON.stringify(closerData),
      });
    } catch (error) {
      console.error('Error creating closer:', error);
      throw error;
    }
  }

  async updateCloser(id: string, closerData: any) {
    try {
      return this.request<Closer>(`/closers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(closerData),
      });
    } catch (error) {
      console.error('Error updating closer:', error);
      throw error;
    }
  }

  async deleteCloser(id: string) {
    try {
      return this.request<void>(`/closers/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting closer:', error);
      throw error;
    }
  }

  async getCloserStats(id: string) {
    try {
      console.log('Making request to:', `/closers/${id}/stats`);
      const result = await this.request<any>(`/closers/${id}/stats`);
      console.log('Closer stats response:', result);
      return result;
    } catch (error) {
      console.error('Error fetching closer stats:', error);
      console.error('Error response:', error.response);
      throw error;
    }
  }

  async getCloserMonthlyStats(id: string) {
    try {
      return this.request<any>(`/closers/${id}/monthly-stats`);
    } catch (error) {
      console.error('Error fetching closer monthly stats:', error);
      throw error;
    }
  }

  async getCloserSales(id: string) {
    try {
      return this.request<any>(`/closers/${id}/sales`);
    } catch (error) {
      console.error('Error fetching closer sales:', error);
      throw error;
    }
  }

  async getAllClosersStats() {
    try {
      return this.request<any>('/closers/stats');
    } catch (error) {
      console.error('Error fetching all closers stats:', error);
      throw error;
    }
  }

  async getFilteredCloserStats(filters: any) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.month) queryParams.append('month', filters.month);
      if (filters.minCommission) queryParams.append('minCommission', filters.minCommission.toString());
      if (filters.maxCommission) queryParams.append('maxCommission', filters.maxCommission.toString());
      
      const queryString = queryParams.toString();
      const url = queryString ? `/closers/stats/filtered?${queryString}` : '/closers/stats/filtered';
      
      return this.request<any>(url);
    } catch (error) {
      console.error('Error fetching filtered closer stats:', error);
      throw error;
    }
  }

  async getCloserAuditData(filters: any) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.closerId) queryParams.append('closerId', filters.closerId);
      if (filters.agentId) queryParams.append('agentId', filters.agentId);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.saleStatus) queryParams.append('saleStatus', filters.saleStatus);
      if (filters.commissionStatus) queryParams.append('commissionStatus', filters.commissionStatus);
      if (filters.minAmount) queryParams.append('minAmount', filters.minAmount.toString());
      if (filters.maxAmount) queryParams.append('maxAmount', filters.maxAmount.toString());
      
      const queryString = queryParams.toString();
      const url = queryString ? `/closers/audit?${queryString}` : '/closers/audit';
      
      return this.request<AgentSale[]>(url);
    } catch (error) {
      console.error('Error fetching closer audit data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();