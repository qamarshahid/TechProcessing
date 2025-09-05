import React, { useState } from 'react';
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
  ChevronDown
} from 'lucide-react';

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const services = [
    {
      icon: Palette,
      title: 'Branding Design',
      percentage: '88%',
      description: 'Creative brand identity and visual design solutions'
    },
    {
      icon: Search,
      title: 'SEO',
      percentage: '85%',
      description: 'Search engine optimization for better visibility'
    },
    {
      icon: Code,
      title: 'Web Design',
      percentage: '96%',
      description: 'Modern, responsive website design and development'
    },
    {
      icon: TrendingUp,
      title: 'Digital Marketing',
      percentage: '99%',
      description: 'Comprehensive digital marketing strategies'
    },
    {
      icon: Shield,
      title: 'Google Guarantee',
      percentage: '97%',
      description: 'Google-certified advertising and marketing services'
    }
  ];

  const testimonials = [
    {
      name: 'Daniel Smith',
      content: 'Working with Tech Processing LLC was an absolute game-changer for our business! Their team took the time to understand our brand and delivered a stunning, user-friendly website that perfectly represents our vision. The attention to detail, fast turnaround, and ongoing support have been incredible. Our online presence has never been stronger, and we\'ve already seen a significant boost in engagement. Highly recommend their web design expertise!',
      avatar: '👨‍💼'
    },
    {
      name: 'Sarah',
      content: 'From start to finish, Tech Processing LLC exceeded our expectations. They transformed our outdated website into a modern, responsive, and conversion-focused masterpiece. Their creative approach, seamless communication, and technical skills made the entire process stress-free. Our customers love the new design, and we\'ve seen a noticeable increase in leads. If you want a website that stands out and delivers results, look no further!',
      avatar: '👩‍💼'
    },
    {
      name: 'Martin',
      content: 'Tech Processing LLC took our vague vision and turned it into a stunning, functional reality. The process was collaborative from start to finish, and their team went above and beyond to ensure every detail was perfect. Our bounce rate has dropped, and our conversion rate has never been higher. Truly top-notch service!',
      avatar: '👨‍💻'
    },
    {
      name: 'Amelia',
      content: 'I can\'t say enough good things about Tech Processing LLC. They were organized, insightful, and completely dedicated to our project. They made complex tasks look effortless, and the end result is a website that not only looks amazing but also performs beautifully. We\'ve already received countless compliments from clients and partners.',
      avatar: '👩‍🎨'
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
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                We Are Creative
                <br />
                <span className="text-emerald-600 dark:text-emerald-400">Digital Agency</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Your success is our mission. Let's design your future, develop your strategy, 
                and dominate your market together.
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
                <div className="w-full h-96 bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-2xl flex items-center justify-center">
                  <div className="text-8xl">🚀</div>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center">
                  <div className="text-4xl">💡</div>
                </div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-full flex items-center justify-center">
                  <div className="text-3xl">🎨</div>
                </div>
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
              <div className="text-6xl mb-6">🎨</div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                To Create Artistic & Creative Design
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Your success is our mission. Let's design your future, develop your strategy, 
                and dominate your market together.
              </p>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              {services.map((service, index) => (
                <div key={service.title} className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <service.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mr-3" />
                      <span className="font-semibold text-gray-900 dark:text-white">{service.title}</span>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{service.percentage}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: service.percentage }}
                    ></div>
                  </div>
                </div>
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
                className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.content}"</p>
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