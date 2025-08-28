import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './components/common/NotificationSystem';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './components/LandingPage';
import { LoginForm } from './components/LoginForm';
import { AdminRoutes } from './components/admin/AdminRoutes';
import { AgentDashboard } from './components/agent/AgentDashboard';
import { ClientDashboard } from './components/client/ClientDashboard';

function App() {
  // Determine base path for Router - use /TechProcessing in production, / in development
  const basename = import.meta.env.PROD ? '/TechProcessing' : '';
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router basename={basename}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginForm />} />
                
                {/* Protected Dashboard Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardRedirect />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/*" element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <AdminRoutes />
                  </ProtectedRoute>
                } />
                
                <Route path="/agent/*" element={
                  <ProtectedRoute requiredRole="AGENT">
                    <AgentDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/client/*" element={
                  <ProtectedRoute requiredRole="CLIENT">
                    <ClientDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Component to redirect to appropriate dashboard based on user role
function DashboardRedirect() {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to role-specific dashboard
  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />;
  } else if (user.role === 'AGENT') {
    return <Navigate to="/agent" replace />;
  } else if (user.role === 'CLIENT') {
    return <Navigate to="/client" replace />;
  } else {
    // Default to client dashboard for any other role
    return <Navigate to="/client" replace />;
  }
}

export default App;