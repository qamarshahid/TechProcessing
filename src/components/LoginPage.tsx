import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowLeft, 
  Shield, 
  CheckCircle,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  Globe,
  Cpu,
  Database,
  Brain,
  Rocket,
  Star,
  ChevronRight,
  Fingerprint,
  KeyRound,
  Layers3,
  Sparkle,
  Bot,
  Network,
  Code2,
  Lightning
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });
  const controls = useAnimation();

  // Floating particles animation
  useEffect(() => {
    const interval = setInterval(() => {
      controls.start({
        y: [0, -20, 0],
        opacity: [0.3, 0.8, 0.3],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [controls]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: Brain, title: 'AI-Powered', desc: 'Intelligent automation', gradient: 'from-blue-400 to-cyan-400' },
    { icon: Database, title: 'Real-Time', desc: 'Live insights', gradient: 'from-purple-400 to-pink-400' },
    { icon: Shield, title: 'Secure', desc: 'Military-grade', gradient: 'from-green-400 to-emerald-400' },
    { icon: Rocket, title: 'Fast', desc: 'Lightning speed', gradient: 'from-orange-400 to-red-400' }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <head>
        <title>Client Login - TechProcessing LLC</title>
        <meta name="description" content="Access your TechProcessing LLC client dashboard. Secure login for existing clients to manage projects and view analytics." />
        <meta name="robots" content="noindex, nofollow" />
      </head>

      <div className="min-h-screen bg-bg1 relative overflow-hidden">
        {/* Premium Animated Background */}
        <div className="absolute inset-0">
          {/* Base Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-bg1 via-bg2 to-bg1"></div>
          
          {/* Subtle Animated Grid with Glow */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
          
          {/* Premium Floating Orbs with Glow */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(96,165,250,0.2) 50%, transparent 70%)',
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -80, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ top: '5%', left: '5%' }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(96,165,250,0.4) 0%, rgba(147,197,253,0.2) 50%, transparent 70%)',
            }}
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 7
            }}
            style={{ top: '50%', right: '5%' }}
          />
          
          {/* Enhanced Floating Particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                background: `rgba(96, 165, 250, ${Math.random() * 0.5 + 0.2})`,
                boxShadow: '0 0 10px rgba(96, 165, 250, 0.5)',
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex">
          {/* Left Side - Premium Hero Section */}
          <div className="hidden lg:flex lg:w-1/2 relative" ref={heroRef}>
            <div className="w-full flex flex-col justify-center px-16 py-20">
              {/* Logo Section with Premium Animation */}
              <motion.div 
                className="mb-16"
                initial={{ opacity: 0, y: 40 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <div className="flex items-center space-x-5 mb-10">
                  <motion.div 
                    className="relative group"
                    whileHover={{ scale: 1.08 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-accent1 via-accent2 to-accent1 rounded-3xl flex items-center justify-center shadow-2xl shadow-accent1/30 relative overflow-hidden backdrop-blur-sm border border-accent1/20">
                      <div className="text-white font-black text-2xl z-10 tracking-tight">TP</div>
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          repeatDelay: 2
                        }}
                      />
                    </div>
                    <motion.div 
                      className="absolute -top-1 -right-1 w-5 h-5 bg-accent3 rounded-full"
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
                  </motion.div>
                  <div>
                    <div className="font-black text-3xl text-fg tracking-tight leading-none">TECHPROCESSING</div>
                    <div className="text-sm text-accent2 font-bold tracking-[0.4em] mt-1">LLC</div>
                  </div>
                </div>
              </motion.div>

              {/* Hero Content with Enhanced Typography */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              >
                <div className="mb-8">
                  <motion.span 
                    className="inline-flex items-center px-5 py-2.5 bg-accent1/15 backdrop-blur-xl text-accent2 rounded-full text-sm font-bold border border-accent1/20 shadow-lg shadow-accent1/10"
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Star className="h-4 w-4 mr-2 fill-accent2" />
                    Trusted by 500+ Enterprises
                  </motion.span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-black leading-[1.1] mb-8 tracking-tight">
                  <span className="text-fg block mb-2">Welcome to the</span>
                  <span className="bg-gradient-to-r from-accent2 via-accent1 to-accent2 bg-clip-text text-transparent block animate-gradient-x bg-[length:200%_auto]">
                    Future of Tech
                  </span>
                </h1>
                
                <p className="text-xl text-muted-strong mb-14 leading-relaxed max-w-lg font-medium">
                  Access your intelligent dashboard where AI meets innovation. 
                  Experience the next generation of business technology.
                </p>

                {/* Premium Features Grid */}
                <div className="grid grid-cols-2 gap-5 mb-14">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="group cursor-pointer"
                      initial={{ opacity: 0, y: 30 }}
                      animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1, ease: "easeOut" }}
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      <div className="p-5 bg-surface/60 backdrop-blur-xl rounded-2xl border border-outline group-hover:border-accent1/40 transition-all duration-500 shadow-lg group-hover:shadow-2xl group-hover:shadow-accent1/20 relative overflow-hidden">
                        {/* Hover Gradient Overlay */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-accent1/10 via-accent2/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        
                        <div className="relative">
                          <div className="flex items-center space-x-3 mb-3">
                            <motion.div 
                              className={`w-10 h-10 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                              whileHover={{ rotate: 5, scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            >
                              <feature.icon className="h-5 w-5 text-white" />
                            </motion.div>
                            <div className="font-bold text-fg text-lg">{feature.title}</div>
                          </div>
                          <div className="text-sm text-muted font-medium">{feature.desc}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Trust Indicators with Enhanced Design */}
                <motion.div
                  className="flex items-center space-x-10"
                  initial={{ opacity: 0 }}
                  animate={isHeroInView ? { opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 0.9 }}
                >
                  {['SOC 2 Certified', 'GDPR Compliant', '99.9% Uptime'].map((item, i) => (
                    <motion.div 
                      key={i}
                      className="flex items-center space-x-2 group cursor-pointer"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <CheckCircle className="h-5 w-5 text-accent2 group-hover:text-accent3 transition-colors" />
                      <span className="text-sm text-muted group-hover:text-muted-strong font-medium transition-colors">{item}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Right Side - Premium Login Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <motion.div 
              className="w-full max-w-md"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center space-x-4 mb-10">
                <div className="w-14 h-14 bg-gradient-to-br from-accent1 to-accent2 rounded-2xl flex items-center justify-center shadow-xl shadow-accent1/20">
                  <div className="text-white font-black text-xl">TP</div>
                </div>
                <div className="font-black text-2xl text-fg">
                  <span className="tracking-tight">TECHPROCESSING</span>
                  <div className="text-xs text-accent2 font-bold tracking-[0.3em]">LLC</div>
                </div>
              </div>

              {/* Back to Home with Enhanced Style */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link 
                  to="/" 
                  className="inline-flex items-center text-accent2 hover:text-accent3 transition-all mb-10 group font-medium"
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
                transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Premium Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent1/10 via-transparent to-accent2/10 pointer-events-none"></div>
                
                {/* Animated Border Glow */}
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
                  {/* Header with Premium Spacing */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <motion.div
                        className="w-16 h-16 bg-gradient-to-br from-accent1 to-accent2 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-accent1/30 relative overflow-hidden"
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <Fingerprint className="h-8 w-8 text-white" />
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
                      </motion.div>
                      <h2 className="text-3xl font-black text-fg mb-2 tracking-tight">
                        Secure Access
                      </h2>
                      <p className="text-muted-strong font-medium">
                        Enter your credentials to continue
                      </p>
                    </motion.div>
                  </div>

                  {/* Error Message with Premium Design */}
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        className="mb-8 p-4 bg-red-500/10 backdrop-blur-xl border border-red-500/30 text-red-300 rounded-2xl shadow-lg"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <p className="font-medium text-center">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Premium Login Form */}
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {/* Email Field with Premium Interactions */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-muted-strong mb-2 tracking-wide uppercase text-xs">
                        Email Address
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-accent2 transition-all duration-300 z-10" />
                        <motion.input
                          type="email"
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setIsFocused('email')}
                          onBlur={() => setIsFocused('')}
                          className="w-full pl-12 pr-4 py-3.5 bg-surface/50 backdrop-blur-xl border-2 border-outline rounded-xl focus:ring-4 focus:ring-accent1/20 focus:border-accent1 transition-all duration-300 text-fg placeholder-muted font-medium shadow-lg hover:shadow-xl hover:border-accent1/50"
                          placeholder="your@company.com"
                          disabled={isLoading}
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

                    {/* Password Field with Premium Interactions */}
                    <div>
                      <label htmlFor="password" className="block text-sm font-bold text-muted-strong mb-2 tracking-wide uppercase text-xs">
                        Password
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted group-focus-within:text-accent2 transition-all duration-300 z-10" />
                        <motion.input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setIsFocused('password')}
                          onBlur={() => setIsFocused('')}
                          className="w-full pl-12 pr-12 py-3.5 bg-surface/50 backdrop-blur-xl border-2 border-outline rounded-xl focus:ring-4 focus:ring-accent1/20 focus:border-accent1 transition-all duration-300 text-fg placeholder-muted font-medium shadow-lg hover:shadow-xl hover:border-accent1/50"
                          placeholder="Enter your password"
                          disabled={isLoading}
                          whileFocus={{ scale: 1.01 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted hover:text-fg transition-colors z-10"
                          disabled={isLoading}
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

                    {/* Remember Me & Forgot Password with Premium Spacing */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center group cursor-pointer">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-5 w-5 text-accent1 focus:ring-accent1 border-outline rounded-lg bg-surface cursor-pointer transition-all hover:scale-110"
                          disabled={isLoading}
                        />
                        <label htmlFor="remember-me" className="ml-3 block text-sm text-muted group-hover:text-muted-strong transition-colors font-medium cursor-pointer">
                          Remember me
                        </label>
                      </div>
                      <motion.button
                        type="button"
                        className="text-sm text-accent2 hover:text-accent3 transition-colors font-bold"
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        Forgot password?
                      </motion.button>
                    </div>

                    {/* Premium Login Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className="w-full relative overflow-hidden bg-gradient-to-r from-accent1 via-accent2 to-accent1 bg-[length:200%_auto] hover:bg-[length:100%_auto] text-white px-8 py-4 rounded-xl font-black transition-all duration-500 shadow-2xl shadow-accent1/30 hover:shadow-accent1/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center group mt-8"
                      whileHover={{ scale: 1.02, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: isLoading ? ['-100%', '200%'] : '-100%',
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: isLoading ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      />
                      {isLoading ? (
                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Shield className="h-5 w-5 mr-2" />
                          <span className="tracking-wide">ACCESS DASHBOARD</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <ChevronRight className="h-5 w-5 ml-2" />
                          </motion.div>
                        </>
                      )}
                    </motion.button>
                  </motion.form>

                  {/* Premium Security Features */}
                  <motion.div
                    className="mt-8 flex items-center justify-center space-x-6 text-xs text-muted-strong"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    {['SSL Encrypted', '2FA Ready', 'Zero Trust'].map((item, i) => (
                      <motion.div 
                        key={i}
                        className="flex items-center group cursor-pointer"
                        whileHover={{ y: -2 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      >
                        <CheckCircle className="h-4 w-4 text-accent2 mr-2 group-hover:text-accent3 transition-colors" />
                        <span className="font-bold group-hover:text-fg transition-colors">{item}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* Contact Support with Premium Style */}
              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3 }}
              >
                <p className="text-muted font-medium">
                  Need assistance?{' '}
                  <motion.a 
                    href="mailto:support@techprocessingllc.com" 
                    className="text-accent2 hover:text-accent3 transition-colors font-bold"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    Contact Support →
                  </motion.a>
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
