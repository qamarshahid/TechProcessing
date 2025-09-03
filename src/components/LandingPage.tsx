import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  BarChart3,
  CheckCircle,
  Star,
  Globe,
  Cpu,
  Brain,
  Sparkles,
  Rocket,
  Target,
  Award,
  TrendingUp,
  DollarSign,
  CreditCard,
  FileText,
  Package,
  UserCheck,
  Settings,
  Lock,
  Eye,
  Clock,
  RefreshCw
} from 'lucide-react';

export function LandingPage() {
  const features = [
    {
      icon: Users,
      title: 'Multi-Role Management',
      description: 'Comprehensive role-based system for Admins, Agents, and Clients with secure access controls.',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: TrendingUp,
      title: 'Agent Sales Tracking',
      description: 'Complete sales pipeline management with commission tracking and performance analytics.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: DollarSign,
      title: 'Advanced Billing',
      description: 'Automated invoicing, payment processing, and subscription management with multiple payment methods.',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboards with performance metrics, revenue tracking, and business insights.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with JWT authentication, audit logging, and role-based permissions.',
      color: 'from-gray-600 to-gray-800'
    },
    {
      icon: RefreshCw,
      title: 'Automated Workflows',
      description: 'Streamlined processes from quote requests to project delivery with automated notifications.',
      color: 'from-pink-500 to-rose-600'
    }
  ];

  const roles = [
    {
      title: 'Admin Dashboard',
      description: 'Complete system control with user management, sales oversight, and business analytics.',
      features: [
        'User & Agent Management',
        'Sales & Commission Tracking',
        'Invoice & Payment Control',
        'System Analytics & Audit Logs',
        'Service Package Management',
        'Client Relationship Management'
      ],
      icon: Settings,
      color: 'from-purple-600 to-indigo-700',
      role: 'ADMIN'
    },
    {
      title: 'Agent Portal',
      description: 'Sales-focused interface for managing leads, tracking commissions, and performance metrics.',
      features: [
        'Sales Entry & Tracking',
        'Commission Dashboard',
        'Performance Analytics',
        'Client Lead Management',
        'Closer Collaboration',
        'Monthly Performance Reports'
      ],
      icon: Target,
      color: 'from-emerald-600 to-teal-700',
      role: 'AGENT'
    },
    {
      title: 'Client Portal',
      description: 'Streamlined client experience for project management and service requests.',
      features: [
        'Service Request Submission',
        'Custom Quote Requests',
        'Invoice Management',
        'Payment Processing',
        'Project Status Tracking',
        'Subscription Management'
      ],
      icon: UserCheck,
      color: 'from-blue-600 to-cyan-700',
      role: 'CLIENT'
    }
  ];

  const stats = [
    { label: 'Active Clients', value: '500+', icon: Users },
    { label: 'Projects Completed', value: '1,200+', icon: CheckCircle },
    { label: 'Revenue Processed', value: '$2.5M+', icon: DollarSign },
    { label: 'System Uptime', value: '99.9%', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
          style={{ top: '60%', right: '10%' }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-2xl flex items-center justify-center shadow-2xl">
                  <div className="text-white font-black text-lg">TP</div>
                </div>
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
            </motion.div>

            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link
                to="/login"
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 border border-emerald-500/30"
              >
                Access Portal
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-emerald-500/10 backdrop-blur-md text-emerald-400 rounded-full text-sm font-semibold mb-8 border border-emerald-500/20 shadow-lg">
              <Sparkles className="h-4 w-4 mr-2" />
              Next-Generation IT Services Platform
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                DESIGN
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                DEVELOP
              </span>
              <br />
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                DOMINATE
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Revolutionary IT services management platform with advanced agent sales tracking, 
              automated billing, and intelligent client management. Built for the future of business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 border border-emerald-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative flex items-center">
                  <Rocket className="h-5 w-5 mr-2" />
                  Launch Platform
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <a
                href="#features"
                className="px-8 py-4 bg-slate-800/50 backdrop-blur-xl text-white rounded-xl font-bold text-lg transition-all duration-300 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50"
              >
                Explore Features
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <stat.icon className="h-8 w-8 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Dashboards */}
      <section id="features" className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Intelligent Role-Based
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                Dashboard System
              </span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Tailored experiences for every user type with advanced permissions and workflow automation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={role.title}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl backdrop-blur-xl border border-slate-700/50 group-hover:border-emerald-500/30 transition-all duration-500"></div>
                <div className="relative p-8">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                      <role.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold text-white mb-1">{role.title}</h3>
                      <span className="text-emerald-400 font-semibold text-sm tracking-wider uppercase">
                        {role.role}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-slate-400 mb-8 leading-relaxed">
                    {role.description}
                  </p>
                  
                  <div className="space-y-3">
                    {role.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                        <span className="text-slate-300 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-700/50">
                    <Link
                      to="/login"
                      className={`w-full bg-gradient-to-r ${role.color} hover:shadow-lg hover:shadow-emerald-500/25 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center group-hover:scale-105`}
                    >
                      Access {role.role} Portal
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Advanced Platform
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/30 to-slate-900/30 rounded-2xl backdrop-blur-xl border border-slate-700/30 group-hover:border-emerald-500/30 transition-all duration-500"></div>
                <div className="relative p-8">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-5xl font-black mb-8">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                Your Business?
              </span>
            </h2>
            
            <p className="text-xl text-slate-400 mb-12 leading-relaxed">
              Join the future of IT services management with our comprehensive platform designed for modern businesses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/login"
                className="group relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 border border-emerald-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative flex items-center">
                  <Shield className="h-6 w-6 mr-3" />
                  Start Your Journey
                  <ArrowRight className="h-6 w-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <a
                href="mailto:contact@techprocessing.com"
                className="px-10 py-5 bg-slate-800/50 backdrop-blur-xl text-white rounded-xl font-bold text-xl transition-all duration-300 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 flex items-center justify-center"
              >
                <Globe className="h-6 w-6 mr-3" />
                Contact Sales
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 bg-slate-900/30 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-xl flex items-center justify-center">
                <div className="text-white font-black text-sm">TP</div>
              </div>
              <div>
                <div className="font-black text-lg text-white">TECH PROCESSING LLC</div>
                <div className="text-xs text-emerald-400 font-bold tracking-wider">
                  DESIGN • DEVELOP • DOMINATE
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-8 text-sm text-slate-400">
              <a href="mailto:contact@techprocessing.com" className="hover:text-emerald-400 transition-colors">
                Contact
              </a>
              <a href="mailto:support@techprocessing.com" className="hover:text-emerald-400 transition-colors">
                Support
              </a>
              <span>© 2025 Tech Processing LLC</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}