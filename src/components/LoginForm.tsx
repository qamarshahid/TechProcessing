import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useNotifications } from './common/NotificationSystem';
import { apiClient } from '../lib/api';
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
  ShieldCheck,
  Smartphone,
  Key,
  MapPin,
  MessageSquare
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
        
        const response = await signUp(registrationData);
        console.log('Registration response:', response);
        setRegistrationEmail(email);
        setShowEmailVerification(true);
        console.log('Email verification modal should show now');
        showSuccess('Registration Successful', 'Please check your email to verify your account.');
      } else {
        const response = await signIn(email, password);
        
        // Check if MFA is required
        if (response.requires_mfa) {
          setMfaData(response);
          setMfaRequired(true);
        } else {
          showSuccess('Login Successful', 'Welcome back!');
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      // Enhanced error handling for login/register
      if (err instanceof Error && err.message) {
        setError(err.message);
        
        // Handle specific error cases
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

  const handleMfaSuccess = (token: string, user: any) => {
    localStorage.setItem('auth_token', token);
    showSuccess('Login Successful', 'Welcome back!');
    navigate('/dashboard');
  };

  const handleEmailVerified = () => {
    setShowEmailVerification(false);
    showSuccess('Email Verified', 'Your email has been verified successfully!');
    // Navigate to dashboard after email verification
    navigate('/dashboard');
  };

  const handlePasswordResetSuccess = () => {
    setShowPasswordReset(false);
    showSuccess('Password Reset', 'Your password has been reset successfully!');
  };

  // Address autocomplete functionality
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

  // Handle click outside to close suggestions
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
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-bold text-slate-300 mb-2">
                            First Name *
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                            </div>
                            <input
                              id="firstName"
                              name="firstName"
                              type="text"
                              required={showRegister}
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium"
                              placeholder="John"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-bold text-slate-300 mb-2">
                            Last Name *
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <User className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                            </div>
                            <input
                              id="lastName"
                              name="lastName"
                              type="text"
                              required={showRegister}
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium"
                              placeholder="Doe"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="middleName" className="block text-sm font-bold text-slate-300 mb-2">
                          Middle Name (Optional)
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                          </div>
                          <input
                            id="middleName"
                            name="middleName"
                            type="text"
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium"
                            placeholder="M"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Company Name Field (only for registration) */}
              <AnimatePresence>
                {showRegister && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <label htmlFor="companyName" className="block text-sm font-bold text-slate-300">
                      Company Name *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Globe className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                      </div>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        required={showRegister}
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium"
                        placeholder="Enter your company name"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Phone Number Field (only for registration) */}
              <AnimatePresence>
                {showRegister && (
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <label htmlFor="phoneNumber" className="block text-sm font-bold text-slate-300">
                      Phone Number *
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MessageSquare className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                      </div>
                      <input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required={showRegister}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Address Fields (only for registration) */}
              <AnimatePresence>
                {showRegister && (
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-emerald-400" />
                      <h3 className="text-lg font-semibold text-white">Address Information</h3>
                    </div>
                    
                    {/* Street Address with Autocomplete */}
                    <div className="space-y-2">
                      <label htmlFor="street" className="block text-sm font-bold text-slate-300">
                        Street Address
                      </label>
                      <div className="relative" ref={addressSearchRef}>
                        <input
                          id="street"
                          name="street"
                          type="text"
                          value={address.street}
                          onChange={(e) => handleAddressSearchChange(e.target.value)}
                          onFocus={() => setShowSuggestions(addressSuggestions.length > 0)}
                          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium"
                          placeholder="Start typing your address..."
                        />
                        
                        {/* Address Suggestions Dropdown */}
                        {showSuggestions && addressSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                            {addressSuggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => selectAddress(suggestion)}
                                className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0"
                              >
                                <div className="font-medium">{suggestion.formatted}</div>
                                <div className="text-sm text-gray-400">
                                  {suggestion.city}, {suggestion.state} {suggestion.postalCode}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-400 flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>Select from suggestions or continue typing manually</span>
                      </div>
                    </div>

                    {/* City and State */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="city" className="block text-sm font-bold text-slate-300">
                          City
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          value={address.city}
                          onChange={(e) => setAddress({...address, city: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium"
                          placeholder="Enter city"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="state" className="block text-sm font-bold text-slate-300">
                          State
                        </label>
                        <input
                          id="state"
                          name="state"
                          type="text"
                          value={address.state}
                          onChange={(e) => setAddress({...address, state: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium"
                          placeholder="Enter state"
                        />
                      </div>
                    </div>

                    {/* Postal Code and Country */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="postalCode" className="block text-sm font-bold text-slate-300">
                          Postal Code
                        </label>
                        <input
                          id="postalCode"
                          name="postalCode"
                          type="text"
                          value={address.postalCode}
                          onChange={(e) => setAddress({...address, postalCode: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium"
                          placeholder="Enter postal code"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="country" className="block text-sm font-bold text-slate-300">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={address.country}
                          onChange={(e) => setAddress({...address, country: e.target.value})}
                          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium"
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="France">France</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
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
                <button
                  type="button"
                  onClick={() => setShowPasswordReset(true)}
                  className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Forgot password?
                </button>
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
                <a href="mailto:support@techprocessingllc.com" className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
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
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'fixed', top: 0, right: 0, background: 'black', color: 'white', padding: '10px', zIndex: 9999 }}>
          showEmailVerification: {showEmailVerification.toString()}
          <br />
          registrationEmail: {registrationEmail}
        </div>
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