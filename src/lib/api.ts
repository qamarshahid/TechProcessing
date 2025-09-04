class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    // Use production API URL for GitHub Pages deployment
    this.baseURL = import.meta.env.VITE_API_URL || 
      (window.location.hostname === 'qamarshahid.github.io' 
        ? 'https://techprocessing-backend-320817886283.northamerica-northeast2.run.app/api'
        : 'http://localhost:8081/api');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(response.access_token);
    return response;
  }

  async register(email: string, password: string, fullName: string, role: string) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, role }),
    });
    this.setToken(response.access_token);
    return response;
  }

  async logout() {
    this.setToken(null);
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Users Management (Admin only)
  async getUsers(params?: { role?: string; includeInactive?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params?.role) searchParams.append('role', params.role);
    if (params?.includeInactive) searchParams.append('includeInactive', 'true');
    
    const query = searchParams.toString();
    const response = await this.request(`/users${query ? `?${query}` : ''}`);
    // Ensure we always return an object with users array
    if (Array.isArray(response)) {
      return { users: response };
    }
    return { users: response?.users || [] };
  }

  async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userId: string, userData: any) {
    return this.request(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId: string, hardDelete: boolean = false) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
      body: JSON.stringify({ hardDelete }),
    });
  }

  async updateClient(clientId: string, clientData: any) {
    return this.request(`/users/${clientId}`, {
      method: 'PATCH',
      body: JSON.stringify(clientData),
    });
  }

  async updateClientCredentials(clientId: string, credentialsData: any) {
    return this.request(`/users/${clientId}/credentials`, {
      method: 'PATCH',
      body: JSON.stringify(credentialsData),
    });
  }

  // Agent Management (Admin only)
  async getAgents() {
    const response = await this.request('/agent-management');
    // Ensure we always return an array
    if (Array.isArray(response)) {
      return response;
    }
    return response?.agents || [];
  }

  async createAgent(agentData: any) {
    return this.request('/agent-management', {
      method: 'POST',
      body: JSON.stringify(agentData),
    });
  }

  async deleteAgent(agentId: string, hardDelete: boolean = false) {
    return this.request(`/agent-management/${agentId}`, {
      method: 'DELETE',
      body: JSON.stringify({ hardDelete }),
    });
  }

  async updateAgentStatus(agentId: string, isActive: boolean) {
    return this.request(`/agent-management/${agentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  }

  async updateAgentCommissionRates(agentId: string, agentRate: number, closerRate: number) {
    return this.request(`/agent-management/${agentId}/commission-rates`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        agentCommissionRate: agentRate, 
        closerCommissionRate: closerRate 
      }),
    });
  }

  // Agent Sales (Agent & Admin)
  async getOwnAgentProfile() {
    const response = await this.request('/agents/stats');
    // Handle both agent profile and stats response formats
    if (response?.agent) {
      return response.agent;
    }
    return response;
  }

  async getAgentSales() {
    const response = await this.request('/agents/sales/me');
    // Ensure we always return an array
    if (Array.isArray(response)) {
      return response;
    }
    return response?.sales || [];
  }

  async getAllAgentSales() {
    const response = await this.request('/agents/sales/all');
    // Ensure we always return an array
    if (Array.isArray(response)) {
      return response;
    }
    return response?.sales || [];
  }

  async createAgentSale(saleData: any) {
    return this.request('/agents/sales', {
      method: 'POST',
      body: JSON.stringify(saleData),
    });
  }

  async resubmitAgentSale(resubmitData: any) {
    return this.request('/agents/sales/resubmit', {
      method: 'POST',
      body: JSON.stringify(resubmitData),
    });
  }

  async updateSaleStatus(saleId: string, status: string) {
    return this.request(`/agents/sales/${saleId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateCommissionStatus(saleId: string, status: string) {
    return this.request(`/agents/sales/${saleId}/commission-status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateSaleNotes(saleId: string, notes: string) {
    return this.request(`/agents/sales/${saleId}/notes`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    });
  }

  async getAgentMonthlyStats() {
    return this.request('/agents/monthly-stats');
  }

  // Closer Management (Admin only)
  async getAllClosers() {
    return this.request('/closers');
  }

  async getActiveClosers() {
    return this.request('/agents/closers/active');
  }

  async createCloser(closerData: any) {
    return this.request('/closers', {
      method: 'POST',
      body: JSON.stringify(closerData),
    });
  }

  async updateCloser(closerId: string, closerData: any) {
    return this.request(`/closers/${closerId}`, {
      method: 'PATCH',
      body: JSON.stringify(closerData),
    });
  }

  async deleteCloser(closerId: string) {
    return this.request(`/closers/${closerId}`, {
      method: 'DELETE',
    });
  }

  async getCloserStats(closerId: string) {
    return this.request(`/closers/${closerId}/stats`);
  }

  async getCloserSales(closerId: string) {
    return this.request(`/closers/${closerId}/sales`);
  }

  async getAllClosersStats() {
    return this.request('/closers/stats');
  }

  async getFilteredCloserStats(filters: any) {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, String(value));
    });
    
    const query = searchParams.toString();
    return this.request(`/closers/stats/filtered${query ? `?${query}` : ''}`);
  }

  async getCloserAuditData(filters: any) {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, String(value));
    });
    
    const query = searchParams.toString();
    return this.request(`/closers/audit${query ? `?${query}` : ''}`);
  }

  // Service Packages
  async getServices() {
    const response = await this.request('/service-packages');
    // Ensure we always return an object with services array
    if (Array.isArray(response)) {
      return { services: response };
    }
    return { services: response?.services || [] };
  }

  async createService(serviceData: any) {
    return this.request('/service-packages', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    });
  }

  async updateService(serviceId: string, serviceData: any) {
    return this.request(`/service-packages/${serviceId}`, {
      method: 'PATCH',
      body: JSON.stringify(serviceData),
    });
  }

  async deleteService(serviceId: string) {
    return this.request(`/service-packages/${serviceId}`, {
      method: 'DELETE',
    });
  }

  // Service Requests (Client & Admin)
  async getServiceRequests(filters?: any) {
    const searchParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) searchParams.append(key, String(value));
      });
    }
    
    const query = searchParams.toString();
    const response = await this.request(`/service-requests${query ? `?${query}` : ''}`);
    // Ensure we always return an object with serviceRequests array
    if (Array.isArray(response)) {
      return { serviceRequests: response };
    }
    return { serviceRequests: response?.serviceRequests || [] };
  }

  async getClientServiceRequests(clientId: string) {
    const response = await this.request(`/service-requests/my-requests`);
    // Ensure we always return an object with serviceRequests array
    if (Array.isArray(response)) {
      return { serviceRequests: response };
    }
    return { serviceRequests: response?.serviceRequests || [] };
  }

  async createServiceRequest(requestData: any) {
    return this.request('/service-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  }

  async updateServiceRequest(requestId: string, updateData: any) {
    return this.request(`/service-requests/${requestId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  }

  async createPriceAdjustment(requestId: string, adjustmentData: any) {
    return this.request(`/service-requests/${requestId}/price-adjustments`, {
      method: 'POST',
      body: JSON.stringify(adjustmentData),
    });
  }

  async updatePriceAdjustmentStatus(adjustmentId: string, statusData: any) {
    return this.request(`/service-requests/price-adjustments/${adjustmentId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
  }

  async uploadAttachment(requestId: string, file: File, category: string, description?: string) {
    // In a real implementation, this would upload to cloud storage
    // For demo purposes, we'll simulate the upload
    const attachmentData = {
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      fileSize: file.size,
      fileType: file.type,
      category,
      description,
    };

    return this.request(`/service-requests/${requestId}/attachments`, {
      method: 'POST',
      body: JSON.stringify(attachmentData),
    });
  }

  async deleteAttachment(attachmentId: string) {
    return this.request(`/service-requests/attachments/${attachmentId}`, {
      method: 'DELETE',
    });
  }

  // Invoices
  async getInvoices(params?: { status?: string; clientId?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.clientId) searchParams.append('clientId', params.clientId);
    
    const query = searchParams.toString();
    const response = await this.request(`/invoices${query ? `?${query}` : ''}`);
    // Ensure we always return an object with invoices array
    if (Array.isArray(response)) {
      return { invoices: response };
    }
    return { invoices: response?.invoices || [] };
  }

  async getClientInvoices(clientId: string) {
    const response = await this.request(`/invoices?clientId=${clientId}`);
    // Ensure we always return an object with invoices array
    if (Array.isArray(response)) {
      return { invoices: response };
    }
    return { invoices: response?.invoices || [] };
  }

  async createInvoice(invoiceData: any) {
    return this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  async updateInvoice(invoiceId: string, invoiceData: any) {
    return this.request(`/invoices/${invoiceId}`, {
      method: 'PATCH',
      body: JSON.stringify(invoiceData),
    });
  }

  async updateInvoiceStatus(invoiceId: string, status: string) {
    return this.request(`/invoices/${invoiceId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteInvoice(invoiceId: string, deletePayments: boolean = false) {
    return this.request(`/invoices/${invoiceId}`, {
      method: 'DELETE',
      body: JSON.stringify({ deletePayments }),
    });
  }

  async generateInvoicePDF(invoiceId: string) {
    // Simulate PDF generation
    return {
      success: true,
      pdfUrl: '#',
      filename: `invoice-${invoiceId}.pdf`
    };
  }

  // Payments
  async getPayments() {
    const response = await this.request('/payments');
    // Ensure we always return an object with payments array
    if (Array.isArray(response)) {
      return { payments: response };
    }
    return { payments: response?.payments || [] };
  }

  async createHostedPaymentToken(paymentData: any) {
    return this.request('/payments/hosted-token', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async processPayment(paymentData: any) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getCompletedPayments() {
    return this.request('/payments?status=COMPLETED');
  }

  async processRefund(refundData: any) {
    // Simulate refund processing
    return { success: true, refundId: 'ref_' + Date.now() };
  }

  async getRefunds() {
    // Simulate refunds data
    return { refunds: [] };
  }

  // Payment Links (Admin only)
  async getPaymentLinks() {
    const response = await this.request('/payment-links');
    // Ensure we always return an object with links array
    if (Array.isArray(response)) {
      return { links: response };
    }
    return { links: response?.links || [] };
  }

  async createPaymentLink(linkData: any) {
    return this.request('/payment-links', {
      method: 'POST',
      body: JSON.stringify(linkData),
    });
  }

  async getPaymentLinkByToken(token: string) {
    return this.request(`/payment-links/token/${token}`);
  }

  async processPaymentLinkPayment(token: string, paymentData: any) {
    return this.request(`/payment-links/token/${token}/process-payment`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async deletePaymentLink(linkId: string) {
    return this.request(`/payment-links/${linkId}`, {
      method: 'DELETE',
    });
  }

  async resendPaymentLinkEmail(linkId: string) {
    return this.request(`/payment-links/${linkId}/resend-email`, {
      method: 'POST',
    });
  }

  async sendPaymentLinkEmail(emailData: any) {
    // Simulate email sending
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, messageId: 'email_' + Date.now() });
      }, 1000);
    });
  }

  async sendPaymentLinkSMS(smsData: any) {
    // Simulate SMS sending
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ success: true, messageId: 'sms_' + Date.now() });
      }, 1000);
    });
  }

  // Enhanced Card Charging
  async chargeCard(paymentData: any) {
    return this.request('/payments/charge-card', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async processDirectPayment(paymentData: any) {
    return this.request('/payments/direct', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async savePaymentMethod(clientId: string, cardData: any) {
    return this.request(`/payments/save-method/${clientId}`, {
      method: 'POST',
      body: JSON.stringify(cardData),
    });
  }

  async getClientPaymentMethods(clientId: string) {
    return this.request(`/payments/methods/${clientId}`);
  }

  async chargeStoredCard(clientId: string, paymentMethodId: string, amount: number, description?: string) {
    return this.request('/payments/charge-stored', {
      method: 'POST',
      body: JSON.stringify({
        clientId,
        paymentMethodId,
        amount,
        description,
      }),
    });
  }

  // Subscriptions
  async getSubscriptions() {
    const response = await this.request('/subscriptions');
    // Ensure we always return an object with subscriptions array
    if (Array.isArray(response)) {
      return { subscriptions: response };
    }
    return { subscriptions: response?.subscriptions || [] };
  }

  async getClientSubscriptions(clientId: string) {
    return this.request(`/subscriptions/client/${clientId}`);
  }

  async createSubscription(subscriptionData: any) {
    return this.request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    });
  }

  async updateSubscription(subscriptionId: string, subscriptionData: any) {
    return this.request(`/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      body: JSON.stringify(subscriptionData),
    });
  }

  async updateSubscriptionStatus(subscriptionId: string, status: string) {
    return this.request(`/subscriptions/${subscriptionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async deleteSubscription(subscriptionId: string) {
    return this.request(`/subscriptions/${subscriptionId}`, {
      method: 'DELETE',
    });
  }

  // Client Transaction History
  async getClientTransactionHistory(clientId: string) {
    try {
      const [invoicesResponse, paymentsResponse] = await Promise.all([
        this.getInvoices({ clientId }),
        this.getPayments()
      ]);

      const clientInvoices = invoicesResponse.invoices || [];
      const allPayments = paymentsResponse.payments || [];
      const clientPayments = allPayments.filter(payment => 
        clientInvoices.some(invoice => invoice.id === payment.invoice_id)
      );

      // Combine invoices and payments into transaction history
      const transactions = [
        ...clientInvoices.map(invoice => ({
          id: invoice.id,
          type: 'invoice',
          description: invoice.description,
          amount: parseFloat(invoice.amount || invoice.total || '0'),
          status: invoice.status.toLowerCase(),
          date: invoice.created_at || invoice.createdAt,
          invoice_number: invoice.invoice_number || invoice.invoiceNumber,
          payment_method: invoice.payment_method,
        })),
        ...clientPayments.map(payment => ({
          id: payment.id,
          type: 'payment',
          description: `Payment for ${payment.invoice?.description || 'Invoice'}`,
          amount: parseFloat(payment.amount || '0'),
          status: payment.status.toLowerCase(),
          date: payment.created_at || payment.createdAt,
          payment_method: payment.method,
          transaction_id: payment.transaction_id,
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return {
        transactions,
        invoices: clientInvoices,
        payments: clientPayments,
      };
    } catch (error) {
      console.error('Error fetching client transaction history:', error);
      return {
        transactions: [],
        invoices: [],
        payments: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Audit Logs (Admin only)
  async getAuditLogs(params?: any) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, String(value));
      });
    }
    
    const query = searchParams.toString();
    return this.request(`/audit${query ? `?${query}` : ''}`);
  }

  // System Settings (Admin only)
  async getSystemSettings() {
    try {
      return await this.request('/system/settings');
    } catch (error) {
      // Return default settings if API is not available
      return {
        settings: {
          general: {
            siteName: 'TechProcessing Platform',
            siteDescription: 'Professional IT Services Management Platform',
            timezone: 'UTC',
            language: 'en',
            maintenanceMode: false,
            debugMode: false,
          },
          security: {
            sessionTimeout: 30,
            maxLoginAttempts: 5,
            passwordMinLength: 8,
            requireTwoFactor: false,
            allowedIPs: [],
            sslRequired: true,
          },
          notifications: {
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            adminAlerts: true,
            userAlerts: false,
            systemAlerts: true,
          },
          performance: {
            cacheEnabled: true,
            cacheTTL: 3600,
            maxConnections: 100,
            compressionEnabled: true,
            imageOptimization: true,
          },
          backup: {
            autoBackup: true,
            backupFrequency: 'daily',
            backupRetention: 30,
            backupLocation: '/backups',
            encryptionEnabled: true,
          },
        }
      };
    }
  }

  async updateSystemSettings(settings: any) {
    try {
      return await this.request('/system/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    } catch (error) {
      // For now, just return success to simulate API call
      return { success: true, message: 'Settings updated successfully (simulated)' };
    }
  }

  async getSystemStatus() {
    try {
      const response = await this.request('/system/status');
      // The API returns the data directly, not wrapped in a 'status' object
      return response;
    } catch (error) {
      console.error('System status API error:', error);
      // Return mock system status if API is not available
      return {
        status: {
          uptime: '5 days, 12 hours',
          memoryUsage: '45%',
          cpuUsage: '23%',
          diskUsage: '67%',
          activeUsers: 12,
          databaseConnections: 8,
        }
      };
    }
  }

  async toggleMaintenanceMode(enabled: boolean) {
    try {
      return await this.request('/system/maintenance', {
        method: 'POST',
        body: JSON.stringify({ enabled }),
      });
    } catch (error) {
      // For now, just return success to simulate API call
      return { success: true, message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'} (simulated)` };
    }
  }

  async clearCache() {
    try {
      return await this.request('/system/cache/clear', {
        method: 'POST',
      });
    } catch (error) {
      // For now, just return success to simulate API call
      return { success: true, message: 'Cache cleared successfully (simulated)' };
    }
  }

  async createBackup() {
    try {
      return await this.request('/system/backup', {
        method: 'POST',
      });
    } catch (error) {
      // For now, just return success to simulate API call
      return { success: true, message: 'Backup created successfully (simulated)' };
    }
  }

  async restartSystem() {
    try {
      return await this.request('/system/restart', {
        method: 'POST',
      });
    } catch (error) {
      // For now, just return success to simulate API call
      return { success: true, message: 'System restart initiated (simulated)' };
    }
  }

  // Clients helper method
  async getClients() {
    return this.getUsers({ role: 'CLIENT' });
  }
}

export const apiClient = new ApiClient();