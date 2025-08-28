import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../Layout';
import { AdminDashboard } from './AdminDashboard';
import AgentSalesPage from './AgentSalesPage'; // Default export
import { CloserManagementPage } from './CloserManagementPage';
import { CloserAuditPage } from './CloserAuditPage';
import { ClientsPage } from './ClientsPage';
import { InvoicesPage } from './InvoicesPage';
import { ServicesPage } from './ServicesPage';
import { SubscriptionsPage } from './SubscriptionsPage';
import { PaymentHistoryPage } from './PaymentHistoryPage';
import { PaymentLinksPage } from './PaymentLinksPage';
import { RefundsPage } from './RefundsPage';
import { AuditLogsPage } from './AuditLogsPage';
import { SystemSettingsPage } from './SystemSettingsPage';
import { ClientCredentialsPage } from './ClientCredentialsPage';

export function AdminRoutes() {
  return (
    <Layout>
      <Routes>
        {/* Main Dashboard */}
        <Route index element={<AdminDashboard />} />
        
        {/* Overview Section */}
        <Route path="agent-sales" element={<AgentSalesPage />} />
        <Route path="closers" element={<CloserManagementPage />} />
        <Route path="closer-audit" element={<CloserAuditPage />} />
        
        {/* Client Management */}
        <Route path="clients" element={<ClientsPage />} />
        <Route path="clients/:clientId" element={<ClientCredentialsPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        
        {/* Services & Products */}
        <Route path="services" element={<ServicesPage />} />
        <Route path="subscriptions" element={<SubscriptionsPage />} />
        
        {/* Payment Management */}
        <Route path="payments" element={<PaymentHistoryPage />} />
        <Route path="payment-links" element={<PaymentLinksPage />} />
        <Route path="refunds" element={<RefundsPage />} />
        
        {/* System */}
        <Route path="audit" element={<AuditLogsPage />} />
        <Route path="settings" element={<SystemSettingsPage />} />
        
        {/* Catch all - redirect to main dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Layout>
  );
}
