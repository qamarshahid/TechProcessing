import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Code,
  Palette,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  Server,
  Wrench,
  Lightbulb,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Menu,
  X,
  Search,
  MessageCircle,
  ChevronDown,
  Search as SearchIcon,
  MapPin as LocationIcon,
  Building2,
  MousePointer,
  Layers,
  PieChart,
  Activity,
  Gauge,
  Target as TargetIcon,
  Award as AwardIcon,
  TrendingUp as TrendingUpIcon,
  Users as UsersIcon,
  CheckCircle2,
  ArrowUpRight,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const services = [
    {
      icon: LocationIcon,
      title: 'Google My Business',
      percentage: '99%',
      description: 'Complete GMB optimization, management, and local SEO dominance',
      features: ['Profile Optimization', 'Review Management', 'Local Rankings', 'Business Insights']
    },
    {
      icon: SearchIcon,
      title: 'SEO & Citations',
      percentage: '97%',
      description: 'Advanced search engine optimization and citation building',
      features: ['Technical SEO', 'Citation Building', 'Link Building', 'Ranking Analysis']
    },
    {
      icon: Code,
      title: 'Web Development',
      percentage: '98%',
      description: 'Custom websites and web applications that convert',
      features: ['Responsive Design', 'E-commerce', 'CMS Development', 'Performance Optimization']
    },
    {
      icon: TrendingUp,
      title: 'Digital Marketing',
      percentage: '96%',
      description: 'Comprehensive digital marketing strategies that drive results',
      features: ['PPC Campaigns', 'Social Media', 'Content Marketing', 'Analytics']
    },
    {
      icon: Building2,
      title: 'Business Solutions',
      percentage: '95%',
      description: 'Complete business digital transformation services',
      features: ['Brand Strategy', 'Lead Generation', 'Conversion Optimization', 'Growth Hacking']
    }
  ];

  const testimonials = [
    {
      name: 'Daniel Smith',
      company: 'TechStart Inc.',
      role: 'CEO',
      content: 'Working with Tech Processing LLC was an absolute game-changer for our business! Their team took the time to understand our brand and delivered a stunning, user-friendly website that perfectly represents our vision. The attention to detail, fast turnaround, and ongoing support have been incredible. Our online presence has never been stronger, and we\'ve already seen a significant boost in engagement. Highly recommend their web design expertise!',
      rating: 5,
      results: '+300% Traffic Increase'
    },
    {
      name: 'Sarah Johnson',
      company: 'Digital Solutions',
      role: 'Marketing Director',
      content: 'From start to finish, Tech Processing LLC exceeded our expectations. They transformed our outdated website into a modern, responsive, and conversion-focused masterpiece. Their creative approach, seamless communication, and technical skills made the entire process stress-free. Our customers love the new design, and we\'ve seen a noticeable increase in leads. If you want a website that stands out and delivers results, look no further!',
      rating: 5,
      results: '+250% Lead Generation'
    },
    {
      name: 'Martin Chen',
      company: 'HealthTech Corp',
      role: 'CTO',
      content: 'Tech Processing LLC took our vague vision and turned it into a stunning, functional reality. The process was collaborative from start to finish, and their team went above and beyond to ensure every detail was perfect. Our bounce rate has dropped, and our conversion rate has never been higher. Truly top-notch service!',
      rating: 5,
      results: '+180% Conversion Rate'
    },
    {
      name: 'Amelia Rodriguez',
      company: 'E-commerce Plus',
      role: 'Operations Manager',
      content: 'I can\'t say enough good things about Tech Processing LLC. They were organized, insightful, and completely dedicated to our project. They made complex tasks look effortless, and the end result is a website that not only looks amazing but also performs beautifully. We\'ve already received countless compliments from clients and partners.',
      rating: 5,
      results: '+400% Revenue Growth'
    }
  ];

  const faqs = [
    {
      question: 'What types of websites do you develop?',
      answer: 'We build a wide range of websites, including business sites, e-commerce stores, landing pages, and custom platforms. Our development process is tailored to meet your goals, whether you need a simple informational site or a full-featured web application.'
    },
    {
      question: 'How does your graphic design process work?',
      answer: 'Our design process starts with understanding your brand, audience, and goals. We then present initial concepts, gather feedback, and refine the designs until you\'re satisfied. We can create everything from logos and branding kits to brochures and social media visuals.'
    },
    {
      question: 'Can you manage our Google Ads campaigns?',
      answer: 'Absolutely. We offer full-service Google Ads management, including keyword research, ad copywriting, campaign setup, A/B testing, and performance optimization. Our goal is to help you get the highest ROI for your ad spend.'
    },
    {
      question: 'What\'s included in your digital marketing services?',
      answer: 'Our digital marketing services include SEO, social media marketing, content creation, email campaigns, analytics tracking, and more. We customize strategies to align with your business objectives and industry trends.'
    },
    {
      question: 'How long does it take to see results from your services?',
      answer: 'Timeframes vary based on the service. For web development, most projects take 2–6 weeks depending on complexity. Marketing results, such as increased traffic or conversions, can take 1–3 months, but we focus on long-term sustainable growth.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-lg flex items-center justify-center">
                <div className="text-white font-bold text-sm">TP</div>
              </div>
              <div className="font-bold text-xl text-gray-900 dark:text-white">
                <span className="tracking-widest">T E C H P R O C E S S I N G</span>
                <br />
                <span className="text-sm text-emerald-600 dark:text-emerald-400">LLC</span>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div
              className="hidden md:flex items-center space-x-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <a href="#home" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</a>
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About Us</a>
              <a href="#services" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Services</a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Blog</a>
              <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact Us</a>
            </motion.div>

            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to="/login"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Get In Touch
              </Link>
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-600 dark:text-gray-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </motion.div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              className="md:hidden py-4 border-t border-gray-200 dark:border-slate-800"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</a>
                <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About Us</a>
                <a href="#services" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Services</a>
                <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Blog</a>
                <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact Us</a>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                DOMINATE
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
                  GOOGLE
                </span>
                <br />
                <span className="text-gray-600 dark:text-gray-300">RANKINGS</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                We don't just build websites – we build digital empires. From Google My Business domination 
                to SEO mastery, we make your competition irrelevant.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
                
                <a
                  href="#contact"
                  className="border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Let's Talk
                </a>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="relative">
                {/* Main Dashboard Mockup */}
                <div className="w-full h-96 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-emerald-400 text-sm font-mono">Google Analytics Dashboard</div>
                  </div>
                  
                  {/* Chart Area */}
                  <div className="h-32 bg-slate-800 rounded-lg mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-end justify-between px-4 pb-2">
                      {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                        <motion.div
                          key={i}
                          className="bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t"
                          style={{ width: '12px', height: `${height}%` }}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">99%</div>
                      <div className="text-xs text-gray-400">GMB Rankings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-400">97%</div>
                      <div className="text-xs text-gray-400">SEO Success</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">98%</div>
                      <div className="text-xs text-gray-400">Web Performance</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <TrendingUp className="h-8 w-8 text-white" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Target className="h-6 w-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Media & Contact Bar */}
      <section className="py-4 bg-emerald-600 dark:bg-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-white">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <a href="#" className="hover:text-emerald-200 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-emerald-200 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-emerald-200 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8 text-sm">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>Call: +1 (727) 201-2658</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>support@techprocessingllc.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Target className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Digital Domination
                <br />
                <span className="text-emerald-600 dark:text-emerald-400">That Actually Works</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                We don't just promise results – we deliver them. Our data-driven approach 
                ensures your business dominates Google rankings and crushes the competition.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-emerald-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">Google Certified</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-emerald-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">Results Guaranteed</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-emerald-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">24/7 Support</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-emerald-500 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">ROI Focused</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {services.map((service, index) => (
                <motion.div 
                  key={service.title} 
                  className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-6 border border-gray-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-4">
                        <service.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 dark:text-white text-lg">{service.title}</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{service.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{service.percentage}</span>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-3 mb-4">
                    <motion.div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: service.percentage }}
                      transition={{ duration: 2, delay: 0.5 + index * 0.2 }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Client's Testimonial</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-xl">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{testimonial.results}</div>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">"{testimonial.content}"</p>
                
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Verified Client</div>
                    <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Success Story</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Let's Talk!</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Ready to start your project? Get in touch with us today.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Phone & Fax</h3>
              <p className="text-gray-600 dark:text-gray-300">Mobile: (727) 201-2658</p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Mail Address</h3>
              <p className="text-gray-600 dark:text-gray-300">support@techprocessingllc.com</p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Our Location</h3>
              <p className="text-gray-600 dark:text-gray-300">7901 4TH ST N, PETERSBURG, FL 33702</p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 text-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Office Hours</h3>
              <p className="text-gray-600 dark:text-gray-300">Mon - Fri 09 am - 06pm</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-slate-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-lg flex items-center justify-center">
                  <div className="text-white font-bold text-sm">TP</div>
                </div>
                <div>
                  <div className="font-bold text-lg">Tech Processing LLC</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                At Tech Processing LLC, we don't just build brands, we empower them to thrive in the digital world. 
                Rooted in innovation and fueled by creativity, we're a full-service agency dedicated to transforming 
                your vision into a powerful online presence.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#about" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#contact" className="hover:text-emerald-400 transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#services" className="hover:text-emerald-400 transition-colors">Graphic Designing</a></li>
                <li><a href="#services" className="hover:text-emerald-400 transition-colors">Web Development</a></li>
                <li><a href="#services" className="hover:text-emerald-400 transition-colors">Digital Marketing</a></li>
                <li><a href="#services" className="hover:text-emerald-400 transition-colors">SEO Optimization</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-emerald-400" />
                  <span>7901 4th St N St. Petersburg, FL 33702, USA</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-emerald-400" />
                  <span>Support@techprocessingllc.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-emerald-400" />
                  <span>+1 (727) 201-2658</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© All Copyright 2025 by Tech Processing LLC</p>
          </div>
        </div>
      </footer>
    </div>
  );
}