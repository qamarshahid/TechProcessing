import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useNotifications } from './common/NotificationSystem';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  User,
  CheckCircle,
  Cpu,
  Zap,
  Sparkles,
  Globe,
  ArrowLeft,
  Brain,
  ShieldCheck
} from 'lucide-react';

export function LoginForm() {
  const { showSuccess, showError } = useNotifications();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (showRegister) {
        if (!fullName.trim()) {
          setError('Full name is required');
          showError('Registration Error', 'Full name is required');
          setLoading(false);
          return;
        }
        await signUp(email, password, fullName, 'CLIENT');
        showSuccess('Registration Successful', 'Account created successfully! Welcome to Tech Processing.');
      } else {
        await signIn(email, password);
        showSuccess('Login Successful', 'Welcome back!');
      }
      navigate('/dashboard');
    } catch (err: any) {
      // Enhanced error handling for login/register
      if (err instanceof Error && err.message) {
        setError(err.message);
        showError(showRegister ? 'Registration Failed' : 'Login Failed', err.message);
      } else {
        const errorMessage = showRegister ? 'Registration failed. Please try again.' : 'Invalid email or password';
        setError(errorMessage);
        showError(showRegister ? 'Registration Failed' : 'Login Failed', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '10%', left: '10%' }}
        />
        <motion.div
          className="absolute w-80 h-80 bg-gradient-to-r from-teal-500/20 to-cyan-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{ top: '60%', right: '10%' }}
        />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 border-4 border-emerald-400/20 transform rotate-45"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-teal-400/20 transform rotate-12"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md z-10">
        {/* Back to Home */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center text-slate-400 hover:text-emerald-400 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>

        {/* Login Card */}
        <motion.div
          className="bg-gray-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-800/50 p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-600/5 to-cyan-700/5 pointer-events-none"></div>
          
          <div className="relative">
            {/* Header with Logo */}
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="relative group inline-block mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl relative">
                  <div className="text-slate-950 font-black text-2xl">TP</div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
              </motion.div>
              
              <div className="mb-6">
                <div className="font-black text-3xl text-white mb-2">
                  TECH PROCESSING LLC
                </div>
                <div className="text-sm text-emerald-400 font-bold tracking-[0.3em]">
                  DESIGN | DEVELOP | DOMINATE
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-2">
                {showRegister ? 'Join the Future' : 'Welcome Back'}
              </h1>
              <p className="text-slate-400">
                {showRegister ? 'Create your account to access next-gen solutions' : 'Access your intelligent dashboard'}
              </p>
            </motion.div>

            {/* Toggle Register/Login */}
            <motion.div
              className="mb-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-slate-400">
                {showRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setShowRegister(!showRegister)}
                  className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors underline"
                >
                  {showRegister ? 'Sign in here' : 'Register here'}
                </button>
              </p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-sm text-red-300 font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {/* Full Name Field (only for registration) */}
              <AnimatePresence>
                {showRegister && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label htmlFor="fullName" className="block text-sm font-bold text-slate-300">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                      </div>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required={showRegister}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-bold text-slate-300">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-bold text-slate-300">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-500 hover:text-slate-300 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-500 hover:text-slate-300 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-600 rounded bg-gray-800/50"
                  />
                  <label htmlFor="remember-me" className="ml-3 text-sm font-medium text-slate-400">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border border-emerald-500/30 group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="relative flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    {showRegister ? 'Create Account' : 'Access Portal'}
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </motion.button>
            </motion.form>

            {/* Divider */}

            {/* Footer */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-slate-500">
                Need assistance?{' '}
                <a href="mailto:support@techprocessing.com" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Contact Support
                </a>
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Security Badge */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="inline-flex items-center px-6 py-3 bg-gray-800/50 backdrop-blur-xl rounded-full border border-emerald-400/30 shadow-lg">
            <ShieldCheck className="h-4 w-4 text-emerald-400 mr-2" />
            <span className="text-sm font-medium text-slate-300">Quantum-Encrypted Security</span>
            <div className="w-2 h-2 bg-emerald-400 rounded-full ml-3 animate-pulse"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}