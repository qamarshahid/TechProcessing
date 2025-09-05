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
  ChevronRight
} from 'lucide-react';

export function LandingPage() {
  const services = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies and best practices.',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Mobile First'],
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Smartphone,
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications for iOS and Android devices.',
      features: ['iOS & Android', 'Cross-Platform', 'App Store Ready', 'Performance Optimized'],
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Database,
      title: 'Database Solutions',
      description: 'Robust database design, optimization, and management for scalable applications.',
      features: ['Database Design', 'Performance Tuning', 'Data Migration', 'Backup & Recovery'],
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: Cloud,
      title: 'Cloud Services',
      description: 'Cloud infrastructure setup, migration, and management for modern businesses.',
      features: ['AWS & Azure', 'Server Setup', 'Auto Scaling', '24/7 Monitoring'],
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Shield,
      title: 'Cybersecurity',
      description: 'Comprehensive security solutions to protect your business from cyber threats.',
      features: ['Security Audit', 'Penetration Testing', 'Compliance', 'Incident Response'],
      color: 'from-gray-600 to-gray-800'
    },
    {
      icon: Wrench,
      title: 'IT Support',
      description: 'Professional IT support and maintenance services for your business operations.',
      features: ['24/7 Support', 'Remote Assistance', 'System Maintenance', 'Troubleshooting'],
      color: 'from-pink-500 to-rose-600'
    }
  ];

  const portfolio = [
    {
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration and inventory management.',
      image: '🛒',
      category: 'Web Development',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe']
    },
    {
      title: 'Healthcare Management System',
      description: 'Comprehensive patient management system with appointment scheduling and records.',
      image: '🏥',
      category: 'Web Application',
      technologies: ['Vue.js', 'PostgreSQL', 'Express', 'JWT']
    },
    {
      title: 'Mobile Banking App',
      description: 'Secure mobile banking application with biometric authentication and real-time transactions.',
      image: '🏦',
      category: 'Mobile Development',
      technologies: ['React Native', 'Firebase', 'Node.js', 'AWS']
    },
    {
      title: 'IoT Dashboard',
      description: 'Real-time monitoring dashboard for IoT devices with data visualization and alerts.',
      image: '📊',
      category: 'IoT Solutions',
      technologies: ['Angular', 'Python', 'MQTT', 'Chart.js']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'TechStart Inc.',
      role: 'CEO',
      content: 'Tech Processing LLC transformed our business with their innovative solutions. Their team delivered exceptional results and exceeded our expectations.',
      rating: 5,
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      company: 'Digital Solutions',
      role: 'CTO',
      content: 'Professional, reliable, and incredibly skilled. They helped us scale our infrastructure and improve our system performance significantly.',
      rating: 5,
      avatar: '👨‍💻'
    },
    {
      name: 'Emily Rodriguez',
      company: 'HealthTech Corp',
      role: 'Operations Director',
      content: 'Outstanding service and support. Their cybersecurity solutions gave us peace of mind and protected our sensitive data effectively.',
      rating: 5,
      avatar: '👩‍⚕️'
    }
  ];

  const stats = [
    { label: 'Projects Completed', value: '500+', icon: CheckCircle },
    { label: 'Happy Clients', value: '200+', icon: Users },
    { label: 'Years Experience', value: '10+', icon: Award },
    { label: 'Support Hours', value: '24/7', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
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
              <div className="font-bold text-xl text-gray-900">Tech Processing LLC</div>
            </motion.div>

            <motion.div
              className="hidden md:flex items-center space-x-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <a href="#services" className="text-gray-600 hover:text-emerald-600 transition-colors">Services</a>
              <a href="#portfolio" className="text-gray-600 hover:text-emerald-600 transition-colors">Portfolio</a>
              <a href="#testimonials" className="text-gray-600 hover:text-emerald-600 transition-colors">Testimonials</a>
              <a href="#contact" className="text-gray-600 hover:text-emerald-600 transition-colors">Contact</a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link
                to="/login"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Professional IT Services
                <br />
                <span className="text-emerald-600">That Drive Results</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                We provide comprehensive technology solutions to help your business grow, 
                scale, and succeed in the digital world.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Your Project
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
                
                <a
                  href="#services"
                  className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  View Our Services
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-teal-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive technology solutions tailored to meet your business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Link
                  to="/login"
                  className={`w-full bg-gradient-to-r ${service.color} hover:shadow-lg text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group-hover:scale-105`}
                >
                  Get Started
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Portfolio</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Showcasing our successful projects and the technologies we use
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolio.map((project, index) => (
              <motion.div
                key={project.title}
                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="text-6xl mb-4">{project.image}</div>
                <div className="text-sm text-emerald-600 font-semibold mb-2">{project.category}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{project.title}</h3>
                <p className="text-gray-600 mb-6">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <Link
                  to="/login"
                  className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center group-hover:translate-x-2 transition-transform duration-300"
                >
                  View Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Client Testimonials</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What our clients say about working with us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white rounded-xl shadow-lg p-8"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="flex items-center mb-4">
                  <div className="text-4xl mr-4">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to start your next project? Contact us today for a free consultation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">contact@techprocessing.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-600">123 Tech Street, Innovation City, IC 12345</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-50 rounded-xl p-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8">Start Your Project</h3>
              
              <div className="space-y-6">
                <Link
                  to="/login"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Get Started Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
                
                <div className="text-center">
                  <p className="text-gray-600 mb-4">Or call us directly</p>
                  <a
                    href="tel:+15551234567"
                    className="text-emerald-600 hover:text-emerald-700 font-semibold text-lg flex items-center justify-center"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-lg flex items-center justify-center">
                <div className="text-white font-bold text-sm">TP</div>
              </div>
              <div>
                <div className="font-bold text-lg">Tech Processing LLC</div>
                <div className="text-sm text-gray-400">Professional IT Services</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-8 text-sm text-gray-400">
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