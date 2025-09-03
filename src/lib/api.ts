class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8081/api';
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
    return this.request(`/users${query ? `?${query}` : ''}`);
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
    return this.request('/agent-management');
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
    return this.request('/agents/stats');
  }

  async getAgentSales() {
    return this.request('/agents/sales/me');
  }

  async getAllAgentSales() {
    return this.request('/agents/sales/all');
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
    return this.request('/service-packages');
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
    return this.request(`/service-requests${query ? `?${query}` : ''}`);
  }

  async getClientServiceRequests(clientId: string) {
    return this.request(`/service-requests/my-requests`);
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
    return this.request(`/invoices${query ? `?${query}` : ''}`);
  }

  async getClientInvoices(clientId: string) {
    return this.request(`/invoices?clientId=${clientId}`);
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
    return this.request('/payments');
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
    return this.request('/payment-links');
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

  // Subscriptions
  async getSubscriptions() {
    return this.request('/subscriptions');
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

  // Clients helper method
  async getClients() {
    return this.getUsers({ role: 'CLIENT' });
  }
}

export const apiClient = new ApiClient();