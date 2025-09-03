import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../Layout';
import { AdminDashboard } from './AdminDashboard';
import AgentSalesPage from './AgentSalesPage'; // Default export
import { CloserManagementPage } from './CloserManagementPage';
import { CloserAuditPage } from './CloserAuditPage';
import { ClientsPage } from './ClientsPage';
import { ClientCredentialsPage } from './ClientCredentialsPage';
import { InvoicesPage } from './InvoicesPage';
import { PaymentHistoryPage } from './PaymentHistoryPage';
import { PaymentLinksPage } from './PaymentLinksPage';
import { PaymentProcessingPage } from './PaymentProcessingPage';
import { RefundsPage } from './RefundsPage';
import { ServicesPage } from './ServicesPage';
import { ServiceRequestsPage } from './ServiceRequestsPage';
import { SubscriptionsPage } from './SubscriptionsPage';
import { UserManagementPage } from './UserManagementPage';
import { AuditLogsPage } from './AuditLogsPage';
import { SystemSettingsPage } from './SystemSettingsPage';

export function AdminRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/agent-sales" element={<AgentSalesPage />} />
        <Route path="/closers" element={<CloserManagementPage />} />
        <Route path="/closer-audit" element={<CloserAuditPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/clients/:clientId" element={<ClientCredentialsPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/payments" element={<PaymentHistoryPage />} />
        <Route path="/payment-links" element={<PaymentLinksPage />} />
        <Route path="/payment-processing" element={<PaymentProcessingPage />} />
        <Route path="/refunds" element={<RefundsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/service-requests" element={<ServiceRequestsPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/audit" element={<AuditLogsPage />} />
        <Route path="/settings" element={<SystemSettingsPage />} />
      </Routes>
    </Layout>
  );
}