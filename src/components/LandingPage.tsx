import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Search,
  Zap,
  Cpu,
  Globe,
  Shield,
  Cloud,
  Server,
  Smartphone,
  Monitor,
  Code,
  Settings,
  Users,
  Trophy,
  Clock,
  Sparkles,
  ChevronRight,
  Link as LinkIcon,
  Building,
  Briefcase,
  MessageCircle,
  Star,
  CheckCircle,
  ArrowUp,
  Send,
  Palette,
  BarChart3,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const slides = [
    {
      title: "WE ARE",
      highlight: "CREATIVE",
      subtitle: "DIGITAL AGENCY",
      description: "Transform your business with intelligent automation, cloud-native architectures, and cutting-edge cybersecurity solutions.",
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
      services: [
        "AI & Machine Learning",
        "Cloud Architecture", 
        "Cybersecurity Solutions",
        "Data Analytics"
      ]
    },
    {
      title: "WE BUILD",
      highlight: "INNOVATIVE",
      subtitle: "TECH SOLUTIONS",
      description: "Build scalable, resilient systems that adapt to tomorrow's challenges with our advanced cloud and edge computing solutions.",
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
      services: [
        "Web Development",
        "Mobile Applications",
        "System Integration",
        "DevOps Solutions"
      ]
    },
    {
      title: "WE CREATE",
      highlight: "ARTISTIC",
      subtitle: "DIGITAL EXPERIENCES",
      description: "Advanced threat detection, AI-powered monitoring, and quantum-encrypted communications to protect your digital assets.",
      image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
      services: [
        "UI/UX Design",
        "Brand Identity",
        "Digital Marketing",
        "Content Strategy"
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Top Contact Bar */}
      <motion.div 
        className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 py-3 px-6"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex items-center space-x-6 mb-2 md:mb-0">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-white font-bold text-xs">f</span>
              </motion.div>
              <motion.div 
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-white font-bold text-xs">t</span>
              </motion.div>
              <motion.div 
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-white font-bold text-xs">i</span>
              </motion.div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-8 text-center md:text-left">
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <span className="font-medium">CALL : +1 (727) 201-2658</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <span className="font-medium">MAIL : SUPPORT@TECHPROCESSINGLLC.COM</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.nav 
        className="relative z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-6">
            {/* Logo - Exact Recreation */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="text-slate-950 font-black text-lg">TP</div>
                </motion.div>
                <div className="font-black text-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                  TECH PROCESSING LLC
                </div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {['HOME', 'ABOUT US', 'SERVICES', 'BLOG', 'CONTACT US'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="relative text-white hover:text-emerald-400 font-bold text-sm transition-all duration-300 group"
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-500 group-hover:w-full transition-all duration-300"></div>
                </motion.a>
              ))}
            </div>

            {/* Search & Client Portal */}
            <div className="flex items-center space-x-4">
              <motion.button
                className="p-3 hover:bg-slate-800/50 rounded-xl transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Search className="h-5 w-5 text-white" />
              </motion.button>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/login" 
                  className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 flex items-center group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <Zap className="h-4 w-4 mr-2 relative z-10" />
                  <span className="relative z-10">Client Portal</span>
                </Link>
              </motion.div>
              
              <button
                className="lg:hidden p-2 rounded-xl hover:bg-slate-800/50 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t border-slate-800/50 py-4 overflow-hidden"
              >
                <div className="space-y-2">
                  {['HOME', 'ABOUT US', 'SERVICES', 'BLOG', 'CONTACT US'].map((item, index) => (
                    <motion.a
                      key={item}
                      href={`#${item.toLowerCase().replace(' ', '-')}`}
                      className="block py-3 px-4 text-white hover:text-emerald-400 hover:bg-slate-800/30 rounded-lg transition-all duration-300 font-bold"
                      onClick={() => setMobileMenuOpen(false)}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-slate-950"></div>
              
              {/* Decorative Elements */}
              <div className="absolute top-20 left-20 w-32 h-32 border-4 border-emerald-400/30 transform rotate-45"></div>
              <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-cyan-400/30 transform rotate-12"></div>
              <div className="absolute top-1/2 right-32 w-16 h-16 border-4 border-teal-400/30 transform -rotate-12"></div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center min-h-[80vh] py-12 lg:py-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-6xl lg:text-8xl font-black mb-6 leading-tight">
                  <span className="text-white">{slides[currentSlide].title} </span>
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400 bg-clip-text text-transparent">
                    {slides[currentSlide].highlight}
                  </span>
                  <br />
                  <span className="text-white">{slides[currentSlide].subtitle}</span>
                </h1>
                
                <div className="mb-8">
                  <div className="inline-block bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full px-6 py-2 text-sm font-bold text-black mb-4">
                    ABOUT TECH PROCESSING
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    To Create Artistic &<br />
                    Creative Design
                  </h2>
                  <p className="text-lg text-slate-300 leading-relaxed">
                    {slides[currentSlide].description}
                  </p>
                </div>

                {/* Services List */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">What We Do...</span>
                  </h3>
                  <div className="space-y-2">
                    {slides[currentSlide].services.map((service, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center text-slate-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <ChevronRight className="h-4 w-4 text-emerald-400 mr-2" />
                        <span className="font-medium">{service}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.button
                    className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl flex items-center group hover:shadow-emerald-500/30"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Zap className="h-5 w-5 mr-2 relative z-10" />
                    <span className="relative z-10">Get Started</span>
                    <ArrowRight className="h-5 w-5 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                  
                  <motion.button
                    className="bg-slate-800/50 backdrop-blur-xl border-2 border-emerald-400/50 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-400/10 hover:border-emerald-400 transition-all duration-300 flex items-center group"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                    Contact Us
                  </motion.button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Decorative Text */}
            <motion.div
              className="absolute -left-20 top-1/2 transform -translate-y-1/2 -rotate-90 text-slate-600 font-bold text-sm tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {slides[currentSlide].decorativeText}
            </motion.div>
          </motion.div>

          {/* Right Content - Images */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="grid grid-cols-2 gap-6">
              {/* Large Image */}
              <motion.div
                className="col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 p-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-slate-900 rounded-3xl overflow-hidden">
                  <img 
                    src={slides[currentSlide].image}
                    alt="Tech Solutions"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full px-4 py-2 text-sm font-bold text-black mb-2 inline-block">
                      We are
                    </div>
                    <h3 className="text-2xl font-black text-white">
                      Creative <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Digital</span><br />
                      Marketing
                    </h3>
                  </div>
                </div>
              </motion.div>

              {/* Small Image */}
              <motion.div
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 p-1"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-8 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-lg">Growth Analytics</h4>
                  </div>
                </div>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-800/50"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-2">
                    500+
                  </div>
                  <div className="text-slate-300 font-bold text-sm">
                    Happy Clients
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500' 
                  : 'bg-slate-600'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about-us" className="relative py-32 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full px-8 py-3 text-sm font-bold text-black mb-8 shadow-lg">
              ABOUT TECH PROCESSING
            </div>
            <h2 className="text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="text-white">To Create </span>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400 bg-clip-text text-transparent">
                Artistic
              </span>
              <span className="text-white"> & </span>
              <br />
              <span className="bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Creative Design
              </span>
            </h2>
            <p className="text-2xl text-slate-300 max-w-5xl mx-auto leading-relaxed font-medium">
              Your success is our mission. Let's design your future, develop your strategy, and dominate your market together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-black text-white mb-8 flex items-center">
                <Building className="h-10 w-10 text-emerald-400 mr-4" />
                Digital Excellence
              </h3>
              <p className="text-xl text-slate-300 mb-12 leading-relaxed">
                At Tech Processing LLC, we don't just build brands, we empower them to thrive in the digital world. 
                Rooted in innovation and fueled by creativity, we're a full-service agency dedicated to transforming 
                your vision into a powerful online presence.
              </p>
              
              <div className="grid grid-cols-2 gap-10">
                {[
                  { number: "15+", label: "Years Experience", icon: Trophy, color: "from-emerald-400 to-teal-500" },
                  { number: "500+", label: "Happy Clients", icon: Users, color: "from-teal-500 to-cyan-500" },
                  { number: "99.9%", label: " Rate", icon: CheckCircle, color: "from-cyan-500 to-emerald-400" },
                  { number: "24/7", label: "Support Available", icon: Clock, color: "from-emerald-500 to-teal-400" }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center group relative"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.08, y: -5 }}
                  >
                    <div className={`w-20 h-20 bg-gradient-to-br ${stat.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-2xl group-hover:shadow-emerald-500/30 transition-all duration-500 border border-white/10`}>
                      <stat.icon className="h-10 w-10 text-white drop-shadow-lg" />
                    </div>
                    <div className={`text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}>
                      {stat.number}
                    </div>
                    <div className="text-slate-300 font-bold text-lg">{stat.label}</div>
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl p-8 h-64 flex items-center justify-center"
                  whileHover={{ scale: 1.02, rotate: 1 }}
                >
                  <img 
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Team Meeting"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </motion.div>
                
                <motion.div
                  className="bg-gradient-to-br from-teal-500 to-cyan-500 rounded-3xl p-8 h-64 flex items-center justify-center"
                  whileHover={{ scale: 1.02, rotate: -1 }}
                >
                  <img 
                    src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Professional"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="relative py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full px-8 py-3 text-sm font-bold text-black mb-8 shadow-lg">
              OUR SERVICES
            </div>
            <h2 className="text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="text-white">What We </span>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400 bg-clip-text text-transparent">
                Do...
              </span>
            </h2>
            <p className="text-2xl text-slate-300 max-w-5xl mx-auto leading-relaxed font-medium">
              Comprehensive digital services designed to elevate your brand and accelerate your business growth
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: Globe,
                title: "Web Development",
                description: "Custom websites and web applications built with cutting-edge technologies",
                features: ["Responsive Design", "E-commerce Solutions", "Progressive Web Apps", "API Integration"],
                color: "from-emerald-400 to-teal-500",
                bgColor: "from-emerald-500/10 to-teal-600/10"
              },
              {
                icon: Palette,
                title: "Graphic Design",
                description: "Creative visual solutions that capture your brand's essence and engage your audience",
                features: ["Brand Identity", "Logo Design", "Print Materials", "Digital Graphics"],
                color: "from-teal-500 to-cyan-500",
                bgColor: "from-teal-500/10 to-cyan-600/10"
              },
              {
                icon: TrendingUp,
                title: "Digital Marketing",
                description: "Data-driven marketing strategies that amplify your reach and drive conversions",
                features: ["Social Media Marketing", "Content Strategy", "PPC Campaigns", "Email Marketing"],
                color: "from-cyan-500 to-emerald-400",
                bgColor: "from-cyan-500/10 to-emerald-400/10"
              },
              {
                icon: Search,
                title: "SEO Optimization",
                description: "Advanced SEO strategies to boost your search rankings and organic visibility",
                features: ["Keyword Research", "On-Page SEO", "Technical SEO", "Local SEO"],
                color: "from-emerald-400 to-cyan-500",
                bgColor: "from-emerald-500/10 to-cyan-400/10"
              },
              {
                icon: MapPin,
                title: "Google My Business",
                description: "Optimize your local presence and attract customers in your area",
                features: ["Profile Optimization", "Review Management", "Local Listings", "Map Rankings"],
                color: "from-cyan-400 to-teal-500",
                bgColor: "from-cyan-400/10 to-teal-500/10"
              },
              {
                icon: BarChart3,
                title: "Analytics & Insights",
                description: "Comprehensive analytics to track performance and optimize your digital strategy",
                features: ["Google Analytics", "Conversion Tracking", "Performance Reports", "ROI Analysis"],
                color: "from-teal-500 to-emerald-400",
                bgColor: "from-teal-500/10 to-emerald-400/10"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                className="group relative bg-slate-900/60 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/30 hover:border-emerald-400/50 transition-all duration-500 overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -15, scale: 1.05 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative">
                  <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl border border-white/10`}>
                    <service.icon className="h-10 w-10 text-white drop-shadow-lg" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-6 group-hover:text-emerald-400 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-slate-300 mb-8 leading-relaxed text-lg">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-3 mb-10">
                    {service.features.map((feature, idx) => (
                      <motion.li 
                        key={idx} 
                        className="flex items-center text-slate-200 font-medium"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        viewport={{ once: true }}
                      >
                        <div className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full mr-4 flex-shrink-0`}></div>
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <motion.button
                    className={`w-full bg-gradient-to-r ${service.color} text-white py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center group-hover:shadow-2xl shadow-lg border border-white/10 relative overflow-hidden hover:shadow-emerald-500/30`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative flex items-center">
                      Learn More
                      <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-32 bg-gradient-to-br from-slate-900/50 to-slate-800/30">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full px-8 py-3 text-sm font-bold text-black mb-8 shadow-lg">
              WHY CHOOSE US
            </div>
            <h2 className="text-6xl lg:text-7xl font-black mb-8 leading-tight">
              <span className="text-white">Excellence in </span>
              <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-400 bg-clip-text text-transparent">
                Every Detail
              </span>
            </h2>
            <p className="text-2xl text-slate-300 max-w-5xl mx-auto leading-relaxed font-medium">
              We combine cutting-edge technology with creative innovation to deliver exceptional results
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized performance and lightning-fast load times for superior user experience",
                color: "from-emerald-400 to-teal-500"
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Enterprise-grade security with 99.9% uptime guarantee and data protection",
                color: "from-teal-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Expert Team",
                description: "Dedicated professionals with 15+ years of experience in digital solutions",
                color: "from-cyan-500 to-emerald-400"
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Round-the-clock support and maintenance to keep your business running smoothly",
                color: "from-emerald-500 to-teal-400"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -15, scale: 1.05 }}
              >
                <div className="relative mb-10">
                  <div className={`w-28 h-28 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center mx-auto group-hover:shadow-2xl group-hover:shadow-emerald-500/30 transition-all duration-500 border-4 border-white/10 group-hover:border-white/20`}>
                    <feature.icon className="h-14 w-14 text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 drop-shadow-lg" />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500`}></div>
                </div>
                <h3 className="text-2xl font-black text-white mb-6 group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed text-lg font-medium">
                  {feature.description}
                </p>
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 border-2 border-emerald-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-2 border-teal-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-t border-emerald-500/20 py-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/5 to-teal-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-r from-teal-500/5 to-cyan-600/5 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            {/* About Us */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-black text-white mb-8 relative">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    About Us
                  </span>
                </div>
                <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-full shadow-lg"></div>
              </h3>
              <p className="text-slate-300 leading-relaxed text-base font-medium">
                At Tech Processing LLC, we don't just build brands, we empower them to thrive in the 
                digital world. Rooted in innovation and fueled by creativity, we're a full-service agency 
                dedicated to transforming your vision into a powerful online presence.
              </p>
              <div className="flex space-x-4 pt-4">
                {[
                  { label: "Facebook", color: "from-blue-500 to-blue-600", icon: "f" },
                  { label: "Twitter", color: "from-emerald-400 to-teal-500", icon: "t" },
                  { label: "Instagram", color: "from-pink-500 to-rose-600", icon: "i" },
                  { label: "LinkedIn", color: "from-blue-600 to-indigo-700", icon: "in" }
                ].map((social, index) => (
                  <motion.div
                    key={index}
                    className={`w-14 h-14 bg-gradient-to-br ${social.color} rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl hover:shadow-2xl border border-white/20 group relative overflow-hidden`}
                    whileHover={{ scale: 1.1, y: -5, rotate: 3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="text-white font-black text-sm relative z-10">{social.icon}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-black text-white mb-8 relative">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Link className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
                    Quick Links
                  </span>
                </div>
                <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-teal-400 via-cyan-500 to-emerald-500 rounded-full shadow-lg"></div>
              </h3>
              <ul className="space-y-3">
                {['About Us', 'Terms & Conditions', 'Privacy Policy', 'Contact Us'].map((item, index) => (
                  <motion.li
                    key={index}
                    className="group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 12 }}
                  >
                    <a href="#" className="flex items-center text-slate-300 hover:text-emerald-400 transition-all duration-300 group py-2 px-4 rounded-xl hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20">
                      <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mr-4 group-hover:scale-150 transition-transform duration-300"></div>
                      <span className="font-semibold text-base group-hover:translate-x-2 transition-transform duration-300">{item}</span>
                      <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-black text-white mb-8 relative">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Services
                  </span>
                </div>
                <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-teal-500 rounded-full shadow-lg"></div>
              </h3>
              <ul className="space-y-3">
                {['Graphic Designing', 'Web Development', 'Digital Marketing', 'SEO Optimization', 'Google My Business', 'Analytics & Insights'].map((item, index) => (
                  <motion.li
                    key={index}
                    className="group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 12 }}
                  >
                    <a href="#" className="flex items-center text-slate-300 hover:text-cyan-400 transition-all duration-300 group py-2 px-4 rounded-xl hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20">
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mr-4 group-hover:scale-150 transition-transform duration-300"></div>
                      <span className="font-semibold text-base group-hover:translate-x-2 transition-transform duration-300">{item}</span>
                      <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-black text-white mb-8 relative">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    Newsletter
                  </span>
                </div>
                <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg"></div>
              </h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                Subscribe to our weekly newsletter for the latest tech insights, industry trends, and exclusive updates.
              </p>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 font-medium"
                />
                <motion.button
                  className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-700 hover:from-emerald-400 hover:via-teal-500 hover:to-cyan-600 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 border border-emerald-500/30 group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center">
                    <Send className="h-5 w-5 mr-2" />
                    Subscribe Now
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </div>
          
          {/* Bottom Footer */}
          <motion.div
            className="border-t border-emerald-500/20 mt-20 pt-12 flex flex-col md:flex-row justify-between items-center relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-6 mb-8 md:mb-0">
              {/* Footer Logo - Same as Header */}
              <motion.div 
                className="bg-white rounded-2xl p-4 shadow-2xl border-4 border-emerald-400/20"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="text-black font-black text-3xl leading-none" style={{ fontFamily: 'Arial, sans-serif' }}>
                  P
                </div>
              </motion.div>
              <div>
                <div className="font-black text-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent leading-tight" style={{ fontFamily: 'Arial, sans-serif' }}>
                  TECH PROCESSING LLC
                </div>
                <div className="text-sm text-emerald-400 font-bold tracking-[0.3em] flex items-center">
                  DESIGN | DEVELOP | DOMINATE
                  <div className="ml-3 flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-1.5 h-1.5 bg-cyan-600 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
              <p className="text-slate-400 text-base font-medium">
                © All Copyright 2025 by{' '}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent font-bold">Tech Processing LLC</span>
              </p>
              <motion.button
                className="w-16 h-16 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 border-2 border-white/20 group relative overflow-hidden"
                whileHover={{ scale: 1.1, y: -8, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <ArrowUp className="h-7 w-7 text-white relative z-10 group-hover:-translate-y-1 transition-transform duration-300" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}