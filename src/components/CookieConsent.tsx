import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, Settings, Check } from 'lucide-react';

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
  onCustomize?: () => void;
}

export function CookieConsent({ onAccept, onDecline, onCustomize }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(allPreferences));
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    
    localStorage.setItem('cookie-consent', JSON.stringify(minimalPreferences));
    setIsVisible(false);
    onDecline?.();
  };

  const handleCustomize = () => {
    setShowCustomize(true);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setIsVisible(false);
    onCustomize?.();
  };

  const togglePreference = (key: keyof typeof preferences) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50"
      >
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {!showCustomize ? (
            <div className="p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0">
                  <Cookie className="h-5 w-5 text-accent1 mt-0.5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-fg mb-1">
                    We use cookies
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-muted leading-relaxed">
                    We use cookies to improve your experience and analyze our traffic. 
                    <a href="/privacy-policy" className="text-accent1 hover:text-accent1 underline ml-1">
                      Learn more
                    </a>
                  </p>
                </div>
              </div>
              
              {/* Mobile: Stack buttons vertically, Desktop: Keep horizontal */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleDecline}
                  className="w-full sm:flex-1 px-3 py-2 text-xs font-medium text-gray-700 dark:text-muted bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors touch-manipulation"
                >
                  Decline
                </button>
                <button
                  onClick={handleCustomize}
                  className="w-full sm:w-auto px-3 py-2 text-xs font-medium text-gray-700 dark:text-muted bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-1 touch-manipulation"
                >
                  <Settings className="h-3 w-3" />
                  Customize
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="w-full sm:flex-1 px-3 py-2 text-xs font-medium text-fg bg-accent2 hover:bg-accent1 rounded-lg transition-colors touch-manipulation"
                >
                  Accept All
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-fg">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowCustomize(false)}
                  className="p-1 text-muted hover:text-gray-600 dark:hover:text-muted transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-gray-900 dark:text-fg">Necessary</h4>
                    <p className="text-xs text-gray-600 dark:text-muted">
                      Essential for website functionality
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-3 w-3 text-accent1" />
                    <span className="text-xs text-gray-500">Always</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-gray-900 dark:text-fg">Analytics</h4>
                    <p className="text-xs text-gray-600 dark:text-muted">
                      Website performance tracking
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('analytics')}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      preferences.analytics ? 'bg-accent2' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        preferences.analytics ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-gray-900 dark:text-fg">Marketing</h4>
                    <p className="text-xs text-gray-600 dark:text-muted">
                      Advertising and targeting
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('marketing')}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      preferences.marketing ? 'bg-accent2' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        preferences.marketing ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-gray-900 dark:text-fg">Functional</h4>
                    <p className="text-xs text-gray-600 dark:text-muted">
                      Enhanced features
                    </p>
                  </div>
                  <button
                    onClick={() => togglePreference('functional')}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      preferences.functional ? 'bg-accent2' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        preferences.functional ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200 dark:border-gray-700 mt-4">
                <button
                  onClick={() => setShowCustomize(false)}
                  className="w-full sm:flex-1 px-3 py-2 text-xs font-medium text-gray-700 dark:text-muted bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="w-full sm:flex-1 px-3 py-2 text-xs font-medium text-fg bg-accent2 hover:bg-accent1 rounded-lg transition-colors touch-manipulation"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
