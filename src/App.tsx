import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Users, Link } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NotificationProvider } from './components/common/NotificationSystem';
import { LoginForm } from './components/LoginForm';
import { LandingPage } from './components/LandingPage';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ClientDashboard } from './components/client/ClientDashboard';
import { InvoicesPage as AdminInvoicesPage } from './components/admin/InvoicesPage';
import { ServicesPage as AdminServicesPage } from './components/admin/ServicesPage';
import { PaymentLinkPage as PaymentLinksPage } from './components/admin/PaymentLinksPage';
import { SubscriptionsPage } from './components/admin/SubscriptionsPage';
import { RefundsPage } from './components/admin/RefundsPage';
import { ClientsPage } from './components/admin/ClientsPage';
import { AuditLogsPage } from './components/admin/AuditLogsPage';
import { UserManagementPage } from './components/admin/UserManagementPage';
import { PaymentHistoryPage } from './components/admin/PaymentHistoryPage';
import { SystemSettingsPage } from './components/admin/SystemSettingsPage';
import { ClientCredentialsPage } from './components/admin/ClientCredentialsPage';
import { InvoicesPage as ClientInvoicesPage } from './components/client/InvoicesPage';
import { ServicesPage as ClientServicesPage } from './components/client/ServicesPage';
import { PaymentPage } from './components/client/PaymentPage';
import { PaymentLinkPage } from './components/PaymentLinkPage';

function App() {
  return (
    <ErrorBoundary>
    <ThemeProvider>
      <NotificationProvider>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
              <Route
                path="/payment/:invoiceId"
                element={
                  <ProtectedRoute requiredRole="CLIENT">
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/invoices"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout>
                  <AdminInvoicesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout>
                  <AdminServicesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payment-links"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout>
                  <PaymentLinksPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subscriptions"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout>
                  <SubscriptionsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/refunds"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout>
                  <RefundsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clients"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout>
                  <ClientsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clients/:clientId"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout>
                  <ClientCredentialsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout>
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-center">
                        <Users className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                          <h2 className="text-lg font-semibold text-blue-800">User Management Moved</h2>
                          <p className="text-blue-700 mt-1">
                            User management has been consolidated into Client Management for better workflow.
                          </p>
                          <div className="mt-3">
                            <Link 
                              to="/admin/clients" 
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Users className="h-4 w-4 mr-2" />
                              Go to Client Management
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout>
                  <PaymentHistoryPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout>
                  <AuditLogsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Layout>
                  <SystemSettingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client"
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <Layout>
                  <ClientDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/invoices"
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <Layout>
                  <ClientInvoicesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/services"
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <Layout>
                  <ClientServicesPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
        </Router>
      </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

// Component to redirect to appropriate dashboard based on role
function DashboardRedirect() {
  const { user } = useAuth();
  
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  } else if (user?.role === 'CLIENT') {
    return <Navigate to="/client" replace />;
  }
  
  return <Navigate to="/login" replace />;
}

export default App;