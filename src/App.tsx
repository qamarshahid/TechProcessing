import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './components/common/NotificationSystem';
import { ThemeProvider } from './components/ThemeProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './components/LandingPage';
import { LoginForm } from './components/LoginForm';
import { AdminRoutes } from './components/admin/AdminRoutes';
import { AgentRoutes } from './components/agent/AgentRoutes';
import { ClientRoutes } from './components/client/ClientRoutes';
import { SEOPage } from './pages/services/SEO';
import { GoogleMyBusinessPage } from './pages/services/GoogleMyBusiness';
import { SocialMediaMarketingPage } from './pages/services/SocialMediaMarketing';
import { SocialMediaManagementPage } from './pages/services/SocialMediaManagement';
import { LLCFormationPage } from './pages/services/LLCFormation';
import { GraphicDesignPage } from './pages/services/GraphicDesign';
import { LocalSearchPage } from './pages/services/LocalSearch';
import { GoogleAdsPage } from './pages/services/GoogleAds';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';

// Component to handle GitHub Pages 404 redirects
function RedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // Check if we have a redirect stored in sessionStorage (from 404.html)
    const redirect = sessionStorage.redirect;
    if (redirect) {
      sessionStorage.removeItem('redirect');
      // Navigate to the original URL
      navigate(redirect, { replace: true });
    }
  }, [navigate]);

  return null;
}

function App() {
  // Determine base path for Router - use root path for custom domain
  const basename = '';
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice);
    };

    checkMobile();

    // Add mobile-specific optimizations
    if (isMobile) {
      // Prevent zoom on double tap
      let lastTouchEnd = 0;
      document.addEventListener('touchend', (event) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      }, false);

      // Improve touch scrolling
      document.body.style.webkitOverflowScrolling = 'touch';
    }

    // Simulate loading time for mobile optimization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [isMobile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="text-white font-black text-xl">TP</div>
          </div>
          <div className="text-white text-lg font-semibold">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router basename={basename}>
              <RedirectHandler />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-conditions" element={<TermsConditions />} />
                
                {/* Service Pages */}
                <Route path="/services/seo" element={<SEOPage />} />
                <Route path="/services/google-my-business" element={<GoogleMyBusinessPage />} />
                <Route path="/services/social-media-marketing" element={<SocialMediaMarketingPage />} />
                <Route path="/services/social-media-management" element={<SocialMediaManagementPage />} />
                <Route path="/services/llc-formation" element={<LLCFormationPage />} />
                <Route path="/services/graphic-design" element={<GraphicDesignPage />} />
                <Route path="/services/local-search" element={<LocalSearchPage />} />
                <Route path="/services/google-ads" element={<GoogleAdsPage />} />
                
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
                    <AgentRoutes />
                  </ProtectedRoute>
                } />
                
                <Route path="/client/*" element={
                  <ProtectedRoute requiredRole="CLIENT">
                    <ClientRoutes />
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