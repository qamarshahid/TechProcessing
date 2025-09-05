import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Phone, 
  Mail, 
  ChevronUp,
  Hand,
  ArrowUp,
  MousePointer
} from 'lucide-react';

interface MobileOptimizedProps {
  children: React.ReactNode;
}

export function MobileOptimized({ children }: MobileOptimizedProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50;
    const isDownSwipe = distance < -50;

    if (isUpSwipe) {
      // Swipe up - could trigger some action
      console.log('Swipe up detected');
    }
    if (isDownSwipe) {
      // Swipe down - could trigger some action
      console.log('Swipe down detected');
    }
  };

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div 
      className="mobile-optimized"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}

      {/* Mobile-specific enhancements */}
      <MobileEnhancements />
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-20 right-4 z-50 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg flex items-center justify-center touch-manipulation"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileEnhancements() {
  const [showTouchHints, setShowTouchHints] = useState(false);

  useEffect(() => {
    // Show touch hints for first-time mobile users
    const hasSeenHints = localStorage.getItem('mobile-touch-hints-seen');
    if (!hasSeenHints && window.innerWidth < 768) {
      setTimeout(() => {
        setShowTouchHints(true);
        localStorage.setItem('mobile-touch-hints-seen', 'true');
      }, 3000);
    }
  }, []);

  return (
    <>
      {/* Touch hints for new mobile users */}
      <AnimatePresence>
        {showTouchHints && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Hand className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Mobile Tips</h3>
              </div>
              <button
                onClick={() => setShowTouchHints(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <ArrowUp className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Swipe up to scroll faster</span>
              </div>
              <div className="flex items-center">
                <MousePointer className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Tap buttons for quick actions</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile contact shortcuts */}
      <div className="fixed bottom-4 left-4 z-40 flex flex-col space-y-2">
        <motion.a
          href={`tel:${import.meta.env.VITE_CONTACT_PHONE?.replace(/\D/g, '') || '+17272012658'}`}
          className="w-12 h-12 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center touch-manipulation"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Call us"
        >
          <Phone className="h-6 w-6" />
        </motion.a>
        
        <motion.a
          href={`mailto:${import.meta.env.VITE_CONTACT_EMAIL || 'support@techprocessingllc.com'}`}
          className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center touch-manipulation"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Email us"
        >
          <Mail className="h-6 w-6" />
        </motion.a>
      </div>
    </>
  );
}

// Mobile-specific CSS enhancements
export const mobileStyles = `
  .mobile-optimized {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .mobile-optimized input,
  .mobile-optimized textarea,
  .mobile-optimized select {
    -webkit-user-select: text;
    -khtml-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
  }

  .touch-manipulation {
    touch-action: manipulation;
  }

  @media (max-width: 768px) {
    .mobile-optimized button,
    .mobile-optimized a {
      min-height: 44px;
      min-width: 44px;
    }
    
    .mobile-optimized input,
    .mobile-optimized textarea,
    .mobile-optimized select {
      font-size: 16px; /* Prevents zoom on iOS */
    }
    
    .mobile-optimized .form-input {
      padding: 12px 16px;
    }
  }
`;
