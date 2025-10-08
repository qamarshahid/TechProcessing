import React, { useState, useEffect, useRef } from 'react';
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
  Globe,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  MessageSquare,
  Building2,
  Phone,
  Sparkles,
  Star,
  Bot,
  Brain,
  Database,
  Cpu,
  Network,
  Zap,
  CheckCircle,
  Fingerprint,
  KeyRound,
  ChevronRight,
  Layers3,
  Code2
} from 'lucide-react';
import { MfaVerification } from './auth/MfaVerification';
import { EmailVerification } from './auth/EmailVerification';
import { PasswordReset } from './auth/PasswordReset';
import { searchAddresses, AddressSuggestion } from '../lib/addressService';

export function LoginForm() {
  const { showSuccess, showError } = useNotifications();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States'
  });
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressSearchRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaData, setMfaData] = useState<any>(null);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [isFocused, setIsFocused] = useState('');
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (showRegister) {
        if (!firstName.trim()) {
          setError('First name is required');
          showError('Registration Error', 'First name is required');
          setLoading(false);
          return;
        }
        if (!lastName.trim()) {
          setError('Last name is required');
          showError('Registration Error', 'Last name is required');
          setLoading(false);
          return;
        }
        
        if (!companyName.trim()) {
          setError('Company name is required');
          showError('Registration Error', 'Company name is required');
          setLoading(false);
          return;
        }
        
        if (!phoneNumber.trim()) {
          setError('Phone number is required');
          showError('Registration Error', 'Phone number is required');
          setLoading(false);
          return;
        }
        
        const registrationData = {
          email,
          password,
          firstName,
          middleName: middleName.trim() || undefined,
          lastName,
          role: 'CLIENT',
          companyName,
          phoneNumber,
          address
        };
        
        await signUp(registrationData);
        setRegistrationEmail(email);
        setShowEmailVerification(true);
        console.log('Email verification modal should show now');
        showSuccess('Registration Successful', 'Please check your email to verify your account.');
      } else {
        const response = await signIn(email, password);
        
        if (response.requires_mfa) {
          setMfaData(response);
          setMfaRequired(true);
        } else {
          showSuccess('Login Successful', 'Welcome back!');
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      if (err instanceof Error && err.message) {
        setError(err.message);
        
        if (err.message.includes('verify your email') || err.message.includes('not verified')) {
          setShowEmailVerification(true);
          setRegistrationEmail(email);
        }
        
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

  const handleMfaSuccess = (token: string) => {
    localStorage.setItem('auth_token', token);
    showSuccess('Login Successful', 'Welcome back!');
    navigate('/dashboard');
  };

  const handleEmailVerified = () => {
    setShowEmailVerification(false);
    showSuccess('Email Verified', 'Your email has been verified successfully!');
    navigate('/dashboard');
  };

  const handlePasswordResetSuccess = () => {
    setShowPasswordReset(false);
    showSuccess('Password Reset', 'Your password has been reset successfully!');
  };

  const searchAddress = async (query: string) => {
    if (query.length < 2) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const suggestions = await searchAddresses(query);
      setAddressSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (error) {
      console.log('Address search error:', error);
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectAddress = (suggestion: AddressSuggestion) => {
    setAddress({
      street: suggestion.street,
      city: suggestion.city,
      state: suggestion.state,
      postalCode: suggestion.postalCode,
      country: suggestion.country
    });
    setShowSuggestions(false);
  };

  const handleAddressSearchChange = (value: string) => {
    setAddress({...address, street: value});
    searchAddress(value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressSearchRef.current && !addressSearchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className="min-h-screen bg-bg1 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-bg1 via-bg2 to-bg1"></div>
        
        {/* Subtle Grid with Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 top-[10%] left-[10%]"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(96,165,250,0.2) 50%, transparent 70%)',
          }}
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full blur-3xl opacity-20 top-[60%] right-[10%]"
          style={{
            background: 'radial-gradient(circle, rgba(96,165,250,0.4) 0%, rgba(147,197,253,0.2) 50%, transparent 70%)',
          }}
          animate={{
            x: [0, -60, 0],
            y: [0, 80, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: `rgba(96, 165, 250, ${Math.random() * 0.5 + 0.2})`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, (Math.random() - 0.5) * 150],
              y: [0, (Math.random() - 0.5) * 150],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 12 + 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 4
            }}
          />
        ))}
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
            className="inline-flex items-center text-accent2 hover:text-accent3 transition-colors group font-medium"
          >
            <motion.div
              whileHover={{ x: -5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
            </motion.div>
            <span>Back to Home</span>
          </Link>
        </motion.div>

        {/* Premium Login Card */}
        <motion.div
          className="bg-surface/70 backdrop-blur-3xl rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.4)] border border-outline/50 p-8 relative overflow-hidden"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent1/10 via-transparent to-accent2/10 pointer-events-none"></div>
          
          {/* Animated Border */}
          <motion.div 
            className="absolute inset-0 rounded-[2rem] opacity-50"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)',
              backgroundSize: '200% 100%',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '200% 0%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
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
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-accent1 to-accent2 rounded-2xl flex items-center justify-center shadow-2xl shadow-accent1/30 relative overflow-hidden">
                  <div className="text-white font-black text-xl z-10">TP</div>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 1
                    }}
                  />
                </div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-5 h-5 bg-accent3 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              
              <div className="mb-4">
                <div className="font-black text-2xl text-fg mb-1 tracking-tight">
                  TECH PROCESSING LLC
                </div>
                <div className="text-xs text-accent2 font-bold tracking-[0.3em]">
                  DESIGN • DEVELOP • DOMINATE
                </div>
              </div>
              
              <h1 className="text-2xl font-black text-fg mb-2 tracking-tight">
                {showRegister ? 'Join the Future' : 'Welcome Back'}
              </h1>
              <p className="text-muted font-medium text-sm">
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
              <p className="text-muted font-medium">
                {showRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                <motion.button
                  onClick={() => setShowRegister(!showRegister)}
                  className="font-bold text-accent2 hover:text-accent3 transition-colors"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {showRegister ? 'Sign in here' : 'Register here'}
                </motion.button>
              </p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-6 p-4 bg-red-500/10 backdrop-blur-xl border border-red-500/30 rounded-xl shadow-lg"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <p className="text-sm text-red-300 font-medium text-center">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {/* Registration Fields */}
              <AnimatePresence>
                {showRegister && (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-xs font-bold text-muted-strong mb-2 tracking-wide uppercase">
                          First Name *
                        </label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted group-focus-within:text-accent2 transition-colors z-10" />
                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required={showRegister}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-surface/50 backdrop-blur-xl border-2 border-outline rounded-xl text-fg placeholder-muted focus:outline-none focus:ring-4 focus:ring-accent1/20 focus:border-accent1 transition-all duration-300 font-medium hover:border-accent1/50 shadow-lg"
                            placeholder="John"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-xs font-bold text-muted-strong mb-2 tracking-wide uppercase">
                          Last Name *
                        </label>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted group-focus-within:text-accent2 transition-colors z-10" />
                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required={showRegister}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-surface/50 backdrop-blur-xl border-2 border-outline rounded-xl text-fg placeholder-muted focus:outline-none focus:ring-4 focus:ring-accent1/20 focus:border-accent1 transition-all duration-300 font-medium hover:border-accent1/50 shadow-lg"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Company Name */}
                    <div>
                      <label htmlFor="companyName" className="block text-xs font-bold text-muted-strong mb-2 tracking-wide uppercase">
                        Company Name *
                      </label>
                      <div className="relative group">
                        <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted group-focus-within:text-accent2 transition-colors z-10" />
                        <input
                          id="companyName"
                          name="companyName"
                          type="text"
                          required={showRegister}
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-surface/50 backdrop-blur-xl border-2 border-outline rounded-xl text-fg placeholder-muted focus:outline-none focus:ring-4 focus:ring-accent1/20 focus:border-accent1 transition-all duration-300 font-medium hover:border-accent1/50 shadow-lg"
                          placeholder="Your Company"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label htmlFor="phoneNumber" className="block text-xs font-bold text-muted-strong mb-2 tracking-wide uppercase">
                        Phone Number *
                      </label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted group-focus-within:text-accent2 transition-colors z-10" />
                        <input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          required={showRegister}
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 bg-surface/50 backdrop-blur-xl border-2 border-outline rounded-xl text-fg placeholder-muted focus:outline-none focus:ring-4 focus:ring-accent1/20 focus:border-accent1 transition-all duration-300 font-medium hover:border-accent1/50 shadow-lg"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-muted-strong mb-2 tracking-wide uppercase">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-accent2 transition-all duration-300 z-10" />
                  <motion.input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused('email')}
                    onBlur={() => setIsFocused('')}
                    className="w-full pl-12 pr-4 py-3.5 bg-surface/50 backdrop-blur-xl border-2 border-outline rounded-xl text-fg placeholder-muted focus:outline-none focus:ring-4 focus:ring-accent1/20 focus:border-accent1 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:border-accent1/50"
                    placeholder="your@company.com"
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                  <AnimatePresence>
                    {isFocused === 'email' && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent1/10 to-accent2/10 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs font-bold text-muted-strong mb-2 tracking-wide uppercase">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-accent2 transition-all duration-300 z-10" />
                  <motion.input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused('password')}
                    onBlur={() => setIsFocused('')}
                    className="w-full pl-12 pr-12 py-3.5 bg-surface/50 backdrop-blur-xl border-2 border-outline rounded-xl text-fg placeholder-muted focus:outline-none focus:ring-4 focus:ring-accent1/20 focus:border-accent1 transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:border-accent1/50"
                    placeholder="Enter your password"
                    whileFocus={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  />
                  <motion.button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted hover:text-fg transition-colors z-10"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </motion.button>
                  <AnimatePresence>
                    {isFocused === 'password' && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent1/10 to-accent2/10 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              {!showRegister && (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center group cursor-pointer">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-5 w-5 text-accent1 focus:ring-accent1 border-outline rounded-lg bg-surface cursor-pointer transition-all hover:scale-110"
                    />
                    <label htmlFor="remember-me" className="ml-3 text-sm text-muted group-hover:text-muted-strong transition-colors font-medium cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => setShowPasswordReset(true)}
                    className="text-sm text-accent2 hover:text-accent3 transition-colors font-bold"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    Forgot password?
                  </motion.button>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-accent1 via-accent2 to-accent1 bg-[length:200%_auto] hover:bg-[length:100%_auto] text-white py-4 px-6 rounded-xl font-black transition-all duration-500 shadow-2xl shadow-accent1/30 hover:shadow-accent1/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group mt-6"
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{
                    x: loading ? ['-100%', '200%'] : '-100%',
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: loading ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span className="relative flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    <span className="tracking-wide">{showRegister ? 'CREATE ACCOUNT' : 'ACCESS PORTAL'}</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </motion.div>
                  </span>
                )}
              </motion.button>
            </motion.form>


            {/* Security Badge */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-surface/50 backdrop-blur-xl rounded-full border border-accent1/30 shadow-xl">
                <ShieldCheck className="h-4 w-4 text-accent2 mr-2" />
                <span className="text-xs font-bold text-muted">Quantum-Encrypted Security</span>
                <motion.div 
                  className="w-2 h-2 bg-accent2 rounded-full ml-3"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [1, 0.5, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <p className="text-muted font-medium">
            Need assistance?{' '}
            <motion.a 
              href="mailto:support@techprocessingllc.com" 
              className="font-bold text-accent2 hover:text-accent3 transition-colors"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              Contact Support →
            </motion.a>
          </p>
        </motion.div>
      </div>

      {/* MFA Verification Modal */}
      {mfaRequired && mfaData && (
        <MfaVerification
          mfaMethod={mfaData.mfa_method}
          tempToken={mfaData.temp_token}
          onSuccess={handleMfaSuccess}
          onBack={() => setMfaRequired(false)}
          onCancel={() => {
            setMfaRequired(false);
            setMfaData(null);
          }}
        />
      )}

      {/* Email Verification Modal */}
      {showEmailVerification && (
        <EmailVerification
          email={registrationEmail}
          onVerified={handleEmailVerified}
          onResend={() => {}}
          onCancel={() => setShowEmailVerification(false)}
        />
      )}

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <PasswordReset
          onSuccess={handlePasswordResetSuccess}
          onCancel={() => setShowPasswordReset(false)}
        />
      )}
    </div>
  );
}
