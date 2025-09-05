// Application configuration
// All sensitive data should be moved to environment variables

export const appConfig = {
  // Contact Information - Configurable via environment variables
  contact: {
    phone: import.meta.env.VITE_CONTACT_PHONE || '+1 (727) 201-2658',
    email: import.meta.env.VITE_CONTACT_EMAIL || 'admin@techprocessingllc.com',
    address: import.meta.env.VITE_CONTACT_ADDRESS || '7901 4th St N, St. Petersburg, FL 33702',
  },
  
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8081',
  },
  
  // Application Settings
  app: {
    name: 'TechProcessing LLC',
    description: 'Professional IT services and digital solutions',
    version: '1.0.0',
  },
  
  // Security Settings
  security: {
    enableDemoCredentials: import.meta.env.VITE_ENABLE_DEMO_CREDS === 'true',
    maxFormSubmissions: 10, // Per hour
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  }
};

// Validation function to check if required environment variables are set
export const validateConfig = () => {
  const requiredVars = [
    'VITE_API_URL',
    'VITE_CONTACT_PHONE',
    'VITE_CONTACT_EMAIL',
    'VITE_CONTACT_ADDRESS'
  ];
  
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0 && import.meta.env.PROD) {
    console.warn('Missing required environment variables:', missing);
  }
  
  return missing.length === 0;
};
