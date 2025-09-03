import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import {
  Menu,
  X,
  Package,
  LogOut,
  ChevronDown,
  User,
  BarChart3,
  Users,
  FileText,
  Settings,
  Link as LinkIcon,
  RotateCcw,
  Undo2,
  Shield,
  CreditCard,
  UserCheck,
  Home,
  Receipt,
  ShoppingBag,
  Zap,
  Activity,
  Cpu,
  TrendingUp
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleSignOut = async () => {
    await signOut();
  };

  const adminNavSections = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      items: [
        { path: '/admin', label: 'Dashboard', icon: BarChart3 },
        { path: '/admin/agent-sales', label: 'Agent Sales', icon: Activity },
        { path: '/admin/closers', label: 'Closer Management', icon: Users },
        { path: '/admin/closer-audit', label: 'Closer Audit', icon: TrendingUp },
      ]
    },
    {
      id: 'clients',
      label: 'Client Management',
      icon: Users,
      items: [
        { path: '/admin/clients', label: 'Clients', icon: Users },
        { path: '/admin/invoices', label: 'Invoices', icon: FileText },
      ]
    },
    {
      id: 'services',
      label: 'Services & Products',
      icon: Package,
      items: [
        { path: '/admin/services', label: 'Service Packages', icon: Package },
        { path: '/admin/service-requests', label: 'Service Requests', icon: ShoppingBag },
        { path: '/admin/subscriptions', label: 'Subscriptions', icon: RotateCcw },
      ]
    },
    {
      id: 'payments',
      label: 'Payment Management',
      icon: CreditCard,
      items: [
        { path: '/admin/payments', label: 'Payment History', icon: CreditCard },
        { path: '/admin/payment-links', label: 'Payment Links', icon: LinkIcon },
        { path: '/admin/payment-processing', label: 'Process Payments', icon: Zap },
        { path: '/admin/refunds', label: 'Refunds', icon: Undo2 },
      ]
    },

    {
      id: 'system',
      label: 'System',
      icon: Settings,
      items: [
        { path: '/admin/audit', label: 'Audit Logs', icon: Shield },
        { path: '/admin/settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const clientNavItems = [
    { path: '/client', label: 'Dashboard', icon: Home },
    { path: '/client/invoices', label: 'My Invoices', icon: Receipt },
    { path: '/client/services', label: 'Services', icon: ShoppingBag },
  ];

  const agentNavItems = [
    { path: '/agent', label: 'Dashboard', icon: Home },
    { path: '/agent/performance', label: 'Performance', icon: TrendingUp },
  ];

  const isAdmin = user?.role === 'ADMIN';
  const isAgent = user?.role === 'AGENT';
  const navSections = isAdmin ? adminNavSections : null;
  const navItems = isAdmin ? [] : (isAgent ? agentNavItems : clientNavItems);

  const toggleDropdown = (sectionId: string) => {
    setActiveDropdown(activeDropdown === sectionId ? null : sectionId);
  };

  const isPathInSection = (section: any) => {
    return section.items.some((item: any) => location.pathname === item.path);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"></div>
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-600/5 dark:from-cyan-500/10 dark:to-blue-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-purple-500/5 to-pink-600/5 dark:from-purple-500/10 dark:to-pink-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
          style={{ top: '60%', right: '10%' }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.01)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Navigation Header */}
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl border-b border-gray-200/50 dark:border-slate-800/50 transition-colors sticky top-0 z-40">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-2xl flex items-center justify-center shadow-2xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="text-white font-black text-lg">TP</div>
                </motion.div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
                </div>
              <div className="flex flex-col">
                <div className="font-black text-xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent leading-tight">
                  TECH PROCESSING
                </div>
                <div className="text-xs text-emerald-400 font-bold tracking-[0.2em] leading-tight">
                  LLC
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
              {/* Admin Navigation with Dropdowns */}
              {isAdmin && navSections ? (
                navSections.map((section) => {
                  const SectionIcon = section.icon;
                  const isActive = isPathInSection(section);
                  const isOpen = activeDropdown === section.id;
                  
                  return (
                    <div key={section.id} className="relative">
                      <button
                        onClick={() => toggleDropdown(section.id)}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                            : 'text-gray-700 dark:text-slate-300 hover:text-emerald-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50'
                        }`}
                      >
                        <SectionIcon className="h-4 w-4" />
                        <span>{section.label}</span>
                        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setActiveDropdown(null)}
                          ></div>
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 z-20">
                            <div className="p-2">
                              {section.items.map((item) => {
                                const ItemIcon = item.icon;
                                const isItemActive = location.pathname === item.path;
                                
                                return (
                                  <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                                      isItemActive
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                                        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100/50 dark:hover:bg-slate-800/50 hover:text-emerald-400'
                                    }`}
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    <ItemIcon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        </>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              ) : (
                /* Client Navigation - Simple Items */
                navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                          : 'text-gray-700 dark:text-slate-300 hover:text-emerald-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })
              )}
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-3">
              {/* User Info - Desktop */}
              <div className="hidden lg:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {user?.fullName || 'User'}
                  </p>
                  <div className="flex items-center justify-end">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                      user?.role === 'ADMIN' 
                        ? 'bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-gradient-to-r from-teal-500/20 to-cyan-600/20 text-teal-400 border border-teal-500/30'
                    }`}>
                      {user?.role}
                    </span>
                  </div>
                </div>
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse"></div>
                </motion.div>
              </div>

              {/* User Dropdown */}
              <div className="relative">
                                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-3 bg-gray-100/50 dark:bg-slate-800/50 backdrop-blur-sm text-gray-700 dark:text-slate-300 rounded-xl hover:bg-gray-200/50 dark:hover:bg-slate-700/50 hover:text-emerald-400 transition-all duration-300 text-sm font-bold border border-emerald-400/30"
                  >
                  <User className="w-4 h-4" />
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setUserMenuOpen(false)}
                    ></div>
                      <div className="absolute right-0 mt-2 w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-slate-700/50 z-20">
                        <div className="p-6 border-b border-gray-200/50 dark:border-slate-700/50">
                        <div className="flex items-center space-x-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                              {user?.fullName || 'User'}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-slate-400 truncate">{user?.email}</p>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-2 ${
                              user?.role === 'ADMIN' 
                                ? 'bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-400 border border-emerald-500/30' 
                                : 'bg-gradient-to-r from-teal-500/20 to-cyan-600/20 text-teal-400 border border-teal-500/30'
                            }`}>
                              {user?.role || 'USER'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <div className="px-4 py-3 border-b border-gray-200/50 dark:border-slate-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Theme</span>
                            <ThemeToggle />
                          </div>
                        </div>
                        
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-all duration-300 mt-2 font-bold"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
                              <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden relative w-12 h-12 bg-gray-100/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-gray-200/50 dark:hover:bg-slate-700/50 transition-all duration-300 shadow-lg border border-emerald-400/30"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5 text-gray-700 dark:text-slate-300" /> : <Menu className="h-5 w-5 text-gray-700 dark:text-slate-300" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="lg:hidden border-t border-gray-200/50 dark:border-slate-800/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
              <div className="px-4 py-3 space-y-1">
                {/* Mobile Admin Navigation with Sections */}
                {isAdmin && navSections ? (
                  navSections.map((section) => (
                    <div key={section.id} className="space-y-1">
                        <div className="px-4 py-2 text-xs font-bold text-gray-500 dark:text-slate-500 uppercase tracking-wider">
                        {section.label}
                      </div>
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-6 py-3 rounded-xl text-base font-bold transition-all duration-300 ${
                              isActive
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                                : 'text-gray-700 dark:text-slate-300 hover:text-emerald-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50'
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  ))
                ) : (
                  /* Client Mobile Navigation */
                  navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-bold transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                            : 'text-gray-700 dark:text-slate-300 hover:text-emerald-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })
                )}
                
                {/* Mobile User Section */}
                <div className="pt-4 mt-4 border-t border-gray-200/50 dark:border-slate-700/50">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-sm font-bold shadow-lg">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {user?.fullName || 'User'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-slate-400">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="px-4 py-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-gray-700 dark:text-slate-300">Theme</span>
                      <ThemeToggle />
                    </div>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-xl transition-all duration-300 font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 relative">
        <div className="max-w-full mx-auto relative">
          {/* Content Background */}
          <div className="absolute inset-0 bg-gray-100/20 dark:bg-slate-900/20 backdrop-blur-3xl rounded-3xl border border-gray-200/30 dark:border-slate-800/30 -z-10"></div>
          {children}
        </div>
      </main>
    </div>
  );   
}