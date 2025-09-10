import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Target, TrendingUp, Phone, Mail, MapPin, Code, Search, Facebook, Twitter, Instagram, Linkedin as LinkedIn, Menu, X, Clock, Rocket, Gauge, CheckCircle2, Sparkles, Megaphone, Settings, Briefcase, Brush, BarChart3, Map, Globe2, MousePointer, Shield, FileText } from 'lucide-react';
import { ContactForm } from './ContactForm';
import { AppointmentBooking } from './AppointmentBooking';
import { MobileOptimized } from './MobileOptimized';
import { CookieConsent } from './CookieConsent';
import { appConfig } from '../config/app.config';

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeTab, setActiveTab] = useState<'contact' | 'appointment'>('contact');
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isLegalDropdownOpen, setIsLegalDropdownOpen] = useState(false);

  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const servicesDropdown = [
    {
      title: 'SEO Services',
      description: 'Search Engine Optimization',
      href: '/services/seo',
      icon: BarChart3
    },
    {
      title: 'Google My Business',
      description: 'Local Business Optimization',
      href: '/services/google-my-business',
      icon: Map
    },
    {
      title: 'Social Media Marketing',
      description: 'Build Your Brand Online',
      href: '/services/social-media-marketing',
      icon: Megaphone
    },
    {
      title: 'Social Media Management',
      description: 'Ongoing Social Success',
      href: '/services/social-media-management',
      icon: Settings
    },
    {
      title: 'LLC Formation',
      description: 'Start Your Business Right',
      href: '/services/llc-formation',
      icon: Briefcase
    },
    {
      title: 'Graphic Design',
      description: 'Creative Visual Solutions',
      href: '/services/graphic-design',
      icon: Brush
    },
    {
      title: 'Local Search',
      description: 'Dominate Local Results',
      href: '/services/local-search',
      icon: Globe2
    },
    {
      title: 'Google Ads',
      description: 'Paid Search Advertising',
      href: '/services/google-ads',
      icon: MousePointer
    }
  ];

  const legalDropdown = [
    {
      title: 'Privacy Policy',
      description: 'How we protect your data',
      href: '/privacy-policy',
      icon: Shield
    },
    {
      title: 'Terms & Conditions',
      description: 'Service terms and conditions',
      href: '/terms-conditions',
      icon: FileText
    }
  ];

  const services = [
    {
      icon: Megaphone,
      title: 'Social Media Marketing',
      description: 'Develop a strong brand using the power of social channels',
      features: ['Brand Awareness', 'Lead Generation', 'ROI Maximization', 'Custom Campaigns'],
      outcome: 'Increase your online presence and reach your target audience'
    },
    {
      icon: Settings,
      title: 'Social Media Management',
      description: 'Non-stop management of your social success',
      features: ['Strategic Content', 'Community Management', 'Audience Engagement', 'Performance Monitoring'],
      outcome: 'Keep your brand active, relevant, and responsive'
    },
    {
      icon: Briefcase,
      title: 'LLC Formation',
      description: 'Go into business intelligently and lawfully',
      features: ['Legal Formation', 'Documentation', 'Compliance', 'Ongoing Support'],
      outcome: 'Solid legal foundation for your business'
    },
    {
      icon: Brush,
      title: 'Graphic Designing',
      description: 'Creative visuals that grab attention and communicate effectively',
      features: ['Logo Design', 'Branding Materials', 'Marketing Graphics', 'Digital Content'],
      outcome: 'Create memorable visual impressions'
    },
    {
      icon: BarChart3,
      title: 'SEO (Search Engine Optimization)',
      description: 'Improve your market presence and rise on search results',
      features: ['Technical SEO', 'Content Optimization', 'Keyword Research', 'Performance Tracking'],
      outcome: 'Increase search engine visibility and organic traffic'
    },
    {
      icon: Map,
      title: 'Google My Business (GMB)',
      description: 'Bring your business to the map, literally',
      features: ['Profile Optimization', 'Local Citations', 'Review Management', 'Local SEO'],
      outcome: 'Attract more local customers and increase visibility'
    }
  ];

  const caseStudies = [
    {
      client: 'SAPPHIRE OCEAN LLC',
      industry: 'Business Services',
      challenge: 'Needed comprehensive digital marketing strategy',
      solution: 'Complete digital transformation with SEO, social media, and GMB optimization',
      results: {
        traffic: '+300%',
        leads: '+250%',
        revenue: '+180%',
        timeline: '3 months'
      },
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      client: 'Softowel Inc',
      industry: 'Technology',
      challenge: 'Poor local search visibility and brand awareness',
      solution: 'Google Business Profile optimization and social media management campaign',
      results: {
        visibility: '+400%',
        calls: '+220%',
        appointments: '+190%',
        timeline: '2 months'
      },
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      client: 'Almas',
      industry: 'Retail',
      challenge: 'Low conversion rates and poor online presence',
      solution: 'Graphic design overhaul, SEO optimization, and social media strategy',
      results: {
        conversions: '+350%',
        revenue: '+280%',
        pageSpeed: '+150%',
        timeline: '6 weeks'
      },
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600'
    }
  ];

  const testimonials = [
    {
      name: 'Daniel Smith',
      company: 'SAPPHIRE OCEAN LLC',
      role: 'CEO',
      content: 'TechProcessing transformed our digital presence completely. Their strategic approach and technical expertise delivered results beyond our expectations.',
      rating: 5,
      results: '+300% Traffic Growth',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Sarah Johnson',
      company: 'Softowel Inc',
      role: 'Marketing Director',
      content: 'The team at TechProcessing doesn\'t just deliver projects—they deliver business growth. Our ROI has been exceptional.',
      rating: 5,
      results: '+250% Lead Generation',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150'
    },
    {
      name: 'Martin Chen',
      company: 'Almas',
      role: 'CTO',
      content: 'Professional, reliable, and results-driven. TechProcessing helped us dominate our local market with their Google Business optimization.',
      rating: 5,
      results: '+400% Local Visibility',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Discovery & Strategy',
      description: 'We analyze your business, competitors, and market to create a winning strategy.',
      icon: Target,
      duration: '1-2 days'
    },
    {
      step: 2,
      title: 'Design & Development',
      description: 'Our expert team brings your vision to life with cutting-edge technology.',
      icon: Code,
      duration: '2-4 weeks'
    },
    {
      step: 3,
      title: 'Testing & Optimization',
      description: 'Rigorous testing ensures perfect performance across all devices and browsers.',
      icon: Gauge,
      duration: '3-5 days'
    },
    {
      step: 4,
      title: 'Launch & Growth',
      description: 'We launch your project and provide ongoing support to ensure continued success.',
      icon: Rocket,
      duration: 'Ongoing'
    }
  ];


  const handleFormSuccess = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'form_submit_success', {
        event_category: 'Lead Generation',
        event_label: 'Contact Form',
        value: 1
      });
    }
  };

  const handleCTAClick = (ctaType: string) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_click', {
        event_category: 'Engagement',
        event_label: ctaType,
        value: 1
      });
    }
  };

  useEffect(() => {
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.services-dropdown-container')) {
        setIsServicesDropdownOpen(false);
      }
    };

    if (isServicesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServicesDropdownOpen]);

  return (
    <MobileOptimized>
      {/* SEO Meta Tags */}
      <head>
        <title>TechProcessing LLC - Digital Marketing & IT Services | St Petersburg, FL</title>
        <meta name="description" content="TechProcessing LLC - Leading digital marketing agency in St Petersburg, FL. Expert SEO, social media marketing, web design, and IT consulting services. Design. Develop. Dominate. Trusted by 500+ businesses." />
        <meta name="keywords" content="techprocessing, tech processing, techprocessing llc, tech processing llc, digital marketing, SEO services, social media marketing, web design, IT consulting, St Petersburg Florida, business growth, online marketing, web development, graphic design, google ads, local SEO" />
        <meta name="author" content="TechProcessing LLC" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.techprocessingllc.com" />
        
        {/* Open Graph */}
        <meta property="og:title" content="TechProcessing LLC - Web Development & Digital Marketing" />
        <meta property="og:description" content="Professional web development, SEO, and digital marketing services. Design. Develop. Dominate." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.techprocessingllc.com" />
        <meta property="og:image" content="https://www.techprocessingllc.com/og-image.jpg" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="TechProcessing LLC" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TechProcessing LLC - Web Development & Digital Marketing" />
        <meta name="twitter:description" content="Professional web development, SEO, and digital marketing services. Design. Develop. Dominate." />
        <meta name="twitter:image" content="https://www.techprocessingllc.com/twitter-image.jpg" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://techprocessingllc.com/#organization",
                "name": "TechProcessing LLC",
                "alternateName": ["Tech Processing LLC", "TechProcessing", "Tech Processing"],
                "url": "https://www.techprocessingllc.com",
                "logo": "https://techprocessingllc.com/logo.png",
                "description": "Leading digital marketing agency in St Petersburg, FL. Expert SEO, social media marketing, web design, and IT consulting services.",
                "foundingDate": "2020",
                "numberOfEmployees": "11-50",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": appConfig.contact.phone,
                  "contactType": "customer service",
                  "email": "support@techprocessingllc.com",
                  "availableLanguage": "English"
                },
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": appConfig.contact.address,
                  "addressLocality": "St. Petersburg",
                  "addressRegion": "FL",
                  "postalCode": "33702",
                  "addressCountry": "US"
                },
                "sameAs": [
                  "https://www.linkedin.com/company/tech-processing-llc",
                  "https://facebook.com/techprocessingllc",
                  "https://twitter.com/techprocessingllc"
                ]
              },
              {
                "@type": "LocalBusiness",
                "@id": "https://techprocessingllc.com/#localbusiness",
                "name": "TechProcessing LLC",
                "alternateName": ["Tech Processing LLC", "TechProcessing", "Tech Processing"],
                "description": "Leading digital marketing agency in St Petersburg, FL. Expert SEO, social media marketing, web design, and IT consulting services. Design. Develop. Dominate.",
                "url": "https://www.techprocessingllc.com",
                "telephone": appConfig.contact.phone,
                "email": "support@techprocessingllc.com",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": appConfig.contact.address,
                  "addressLocality": "St. Petersburg",
                  "addressRegion": "FL",
                  "postalCode": "33702",
                  "addressCountry": "US"
                },
                "geo": {
                  "@type": "GeoCoordinates",
                  "latitude": "27.7676",
                  "longitude": "-82.6403"
                },
                "areaServed": [
                  "St. Petersburg, FL",
                  "Tampa, FL",
                  "Clearwater, FL",
                  "Florida",
                  "United States"
                ],
                "openingHours": "Mo-Fr 09:00-18:00",
                "priceRange": "$$"
              },
            ]
          })}
        </script>
      </head>

      <div className="min-h-screen bg-slate-950 text-white">
        {/* Navigation */}
        <nav className="bg-slate-900/95 backdrop-blur-xl shadow-sm border-b border-slate-800/50 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <motion.div 
                className="flex items-center space-x-2 sm:space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <div className="text-white font-black text-xs sm:text-sm">TP</div>
                </div>
                <div className="font-black text-base sm:text-lg md:text-xl text-white">
                  <span className="tracking-wider hidden sm:inline">TECHPROCESSING</span>
                  <span className="tracking-wider sm:hidden">TECH</span>
                  <div className="text-xs text-emerald-400 font-bold tracking-[0.2em]">LLC</div>
                </div>
              </motion.div>

              {/* Desktop Navigation */}
              <motion.div
                className="hidden md:flex items-center space-x-8"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Services Dropdown */}
                <div 
                  className="relative services-dropdown-container"
                  onMouseEnter={() => setIsServicesDropdownOpen(true)}
                  onMouseLeave={() => setIsServicesDropdownOpen(false)}
                >
                  <button 
                    className="text-gray-300 hover:text-emerald-400 transition-colors font-medium flex items-center py-2"
                    onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                  >
                    Services
                    <ArrowRight className={`h-4 w-4 ml-1 transform transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-90' : 'rotate-0'}`} />
                  </button>
                  
                  {/* Invisible bridge to prevent dropdown from closing */}
                  {isServicesDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 h-2 bg-transparent" />
                  )}
                  
                  {/* Dropdown Menu */}
                  <motion.div
                    className="absolute top-full left-0 w-80 bg-slate-800 rounded-xl shadow-xl border border-slate-700 z-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: isServicesDropdownOpen ? 1 : 0, 
                      y: isServicesDropdownOpen ? 0 : 10 
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ 
                      pointerEvents: isServicesDropdownOpen ? 'auto' : 'none',
                      marginTop: '8px'
                    }}
                  >
                    <div className="p-4">
                      <div className="grid grid-cols-1 gap-2">
                        {servicesDropdown.map((service) => (
                          <Link
                            key={service.title}
                            to={service.href}
                            className="flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors group"
                            onClick={() => setIsServicesDropdownOpen(false)}
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                              <service.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                {service.title}
                              </div>
                              <div className="text-sm text-gray-400">
                                {service.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Legal Dropdown */}
                <div 
                  className="relative legal-dropdown-container"
                  onMouseEnter={() => setIsLegalDropdownOpen(true)}
                  onMouseLeave={() => setIsLegalDropdownOpen(false)}
                >
                  <button 
                    className="text-gray-300 hover:text-emerald-400 transition-colors font-medium flex items-center py-2"
                    onClick={() => setIsLegalDropdownOpen(!isLegalDropdownOpen)}
                  >
                    Legal
                    <ArrowRight className={`h-4 w-4 ml-1 transform transition-transform duration-200 ${isLegalDropdownOpen ? 'rotate-90' : 'rotate-0'}`} />
                  </button>
                  
                  {/* Invisible bridge to prevent dropdown from closing */}
                  {isLegalDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 h-2 bg-transparent" />
                  )}
                  
                  {/* Dropdown Menu */}
                  <motion.div
                    className="absolute top-full left-0 w-64 bg-slate-800 rounded-xl shadow-xl border border-slate-700 z-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: isLegalDropdownOpen ? 1 : 0, 
                      y: isLegalDropdownOpen ? 0 : 10 
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ 
                      pointerEvents: isLegalDropdownOpen ? 'auto' : 'none',
                      marginTop: '8px'
                    }}
                  >
                    <div className="p-4">
                      <div className="grid grid-cols-1 gap-2">
                        {legalDropdown.map((legal) => (
                          <Link
                            key={legal.title}
                            to={legal.href}
                            className="flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors group"
                            onClick={() => setIsLegalDropdownOpen(false)}
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                              <legal.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                {legal.title}
                              </div>
                              <div className="text-sm text-gray-400">
                                {legal.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <a href="#portfolio" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium">Portfolio</a>
                <a href="#process" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium">Process</a>
                <a href="#about" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium">About</a>
                <Link to="/faq" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium">FAQ</Link>
                <a href="#contact" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium">Contact</a>
              </motion.div>

              {/* Desktop CTA Buttons */}
              <motion.div
                className="hidden md:flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-emerald-400 transition-colors font-medium"
                  onClick={() => handleCTAClick('Client Login')}
                >
                  Client Login
                </Link>
                <a
                  href="#contact"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                  onClick={() => handleCTAClick('Get Free Quote')}
                >
                  Get Free Quote
                </a>
              </motion.div>
              
              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-300 p-2 touch-manipulation rounded-lg hover:bg-slate-800 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <motion.div
                className="md:hidden py-6 border-t border-slate-800"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex flex-col space-y-6">
                  {/* Mobile CTA Buttons */}
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/login"
                      className="w-full bg-slate-800 hover:bg-slate-700 text-white px-4 py-3 rounded-lg font-medium transition-colors text-center touch-manipulation"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Client Login
                    </Link>
                    <a
                      href="#contact"
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg text-center touch-manipulation"
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleCTAClick('Get Free Quote');
                      }}
                    >
                      Get Free Quote
                    </a>
                  </div>
                  
                  {/* Services Section */}
                  <div className="space-y-3">
                    <div className="text-gray-300 font-semibold text-sm uppercase tracking-wider px-2">Our Services</div>
                    <div className="grid grid-cols-1 gap-2">
                      {servicesDropdown.map((service) => (
                        <Link
                          key={service.title}
                          to={service.href}
                          className="flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors group touch-manipulation"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <service.icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white group-hover:text-emerald-400 transition-colors text-sm">
                              {service.title}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                              {service.description}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Legal Section */}
                  <div className="space-y-3">
                    <div className="text-gray-300 font-semibold text-sm uppercase tracking-wider px-2">Legal</div>
                    <div className="grid grid-cols-1 gap-2">
                      {legalDropdown.map((legal) => (
                        <Link
                          key={legal.title}
                          to={legal.href}
                          className="flex items-center p-3 rounded-lg hover:bg-slate-700 transition-colors group touch-manipulation"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <legal.icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white group-hover:text-emerald-400 transition-colors text-sm">
                              {legal.title}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                              {legal.description}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  {/* Navigation Links */}
                  <div className="border-t border-slate-700 pt-4 space-y-2">
                    <a href="#portfolio" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium block py-3 px-2 touch-manipulation">Portfolio</a>
                    <a href="#process" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium block py-3 px-2 touch-manipulation">Process</a>
                    <a href="#about" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium block py-3 px-2 touch-manipulation">About</a>
                    <Link to="/faq" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium block py-3 px-2 touch-manipulation" onClick={() => setIsMenuOpen(false)}>FAQ</Link>
                    <a href="#contact" className="text-gray-300 hover:text-emerald-400 transition-colors font-medium block py-3 px-2 touch-manipulation">Contact</a>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section ref={heroRef} className="relative py-20 lg:py-32 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-32 h-32 border-4 border-emerald-400/20 transform rotate-45 hidden lg:block"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-teal-400/20 transform rotate-12 hidden lg:block"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1 }}
              >
                <div className="mb-6">
                  <span className="inline-flex items-center px-4 py-2 bg-emerald-900/20 text-emerald-300 rounded-full text-sm font-semibold">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Trusted by 500+ Businesses
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-tight">
                  <span className="block">TRANSFORM YOUR</span>
                  <span className="block">BUSINESS WITH</span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
                    TECHPROCESSING LLC.
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                  TechProcessing LLC is your digital transformation partner, combining strategic expertise with cutting-edge technology to drive measurable results. From SEO and social media to business formation and design, we deliver solutions that grow your business.
                </p>

                <div className="mb-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-emerald-400">300%</div>
                      <div className="text-xs sm:text-sm text-gray-400">Avg Traffic Increase</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-teal-400">99%</div>
                      <div className="text-xs sm:text-sm text-gray-400">Client Satisfaction</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-cyan-400">24/7</div>
                      <div className="text-xs sm:text-sm text-gray-400">Support Available</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <a
                    href="#contact"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group touch-manipulation"
                    onClick={() => handleCTAClick('Get My Free Quote')}
                  >
                    <Rocket className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                    <span className="hidden sm:inline">Get My Free Quote</span>
                    <span className="sm:hidden">Free Quote</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                  
                  <a
                    href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`}
                    className="border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center touch-manipulation"
                    onClick={() => handleCTAClick('Contact Us')}
                  >
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span className="hidden sm:inline">{appConfig.contact.phone}</span>
                    <span className="sm:hidden">Call Now</span>
                  </a>
                </div>

                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-400">
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mr-2 flex-shrink-0" />
                    <span>Free Consultation</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mr-2 flex-shrink-0" />
                    <span>No Long-term Contracts</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mr-2 flex-shrink-0" />
                    <span>Results Guaranteed</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 50 }}
                animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <div className="relative">
                  {/* Simplified Dashboard Mockup */}
                  <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl border border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-emerald-400 text-xs sm:text-sm font-mono">Business Dashboard</div>
                    </div>
                    
                    {/* Chart Area */}
                    <div className="h-20 sm:h-24 lg:h-32 bg-slate-800 rounded-lg mb-3 sm:mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-end justify-between px-4 pb-2">
                        {[40, 65, 45, 80, 60, 90, 75, 95].map((height, i) => (
                          <motion.div
                            key={i}
                            className="bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t"
                            style={{ width: '10px', height: `${height}%` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div className="text-center">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-400">300%</div>
                        <div className="text-xs text-gray-400">Growth</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-teal-400">99%</div>
                        <div className="text-xs text-gray-400">Satisfaction</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-400">24/7</div>
                        <div className="text-xs text-gray-400">Support</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Our Services
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
                From social media marketing to LLC formation, we provide comprehensive digital solutions that transform your business
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                    <service.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                    {service.title === 'SEO (Search Engine Optimization)' ? (
                      <Link to="/services/seo" className="hover:text-emerald-400 transition-colors">
                        {service.title}
                      </Link>
                    ) : service.title === 'Google My Business (GMB)' ? (
                      <Link to="/services/google-my-business" className="hover:text-emerald-400 transition-colors">
                        {service.title}
                      </Link>
                    ) : service.title === 'Social Media Marketing' ? (
                      <Link to="/services/social-media-marketing" className="hover:text-emerald-400 transition-colors">
                        {service.title}
                      </Link>
                    ) : (
                      service.title
                    )}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed">{service.description}</p>
                  
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-500 mr-2 sm:mr-3 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-emerald-900/20 rounded-lg p-3 sm:p-4 border border-emerald-800">
                    <div className="flex items-center">
                      <Target className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-emerald-300 font-semibold">{service.outcome}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Marketing Services Section */}
        <section className="py-20 bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Our Marketing Services
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Comprehensive digital marketing solutions to boost your online presence and drive results
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Search Engine Optimization */}
              <motion.div
                className="bg-slate-900 rounded-2xl shadow-lg border border-slate-700 p-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  <Link to="/services/seo" className="hover:text-emerald-400 transition-colors">
                    Search Engine Optimization
                  </Link>
                </h3>
                <p className="text-gray-300 mb-6">Boost Your Visibility with Expert SEO</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Optimize your website for higher search engine rankings</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Develop targeted content strategies to attract and engage your audience</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Implement technical SEO improvements to enhance site performance</span>
                  </li>
                </ul>
                <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-800">
                  <p className="text-emerald-300 text-sm">
                    Our Search Engine Optimization (SEO) services are aimed at ensuring that your business has found its way up the staging posts, more quality traffic is drawn to the business and that the business converts the visitors into customers.
                  </p>
                </div>
              </motion.div>

              {/* Local Search */}
              <motion.div
                className="bg-slate-900 rounded-2xl shadow-lg border border-slate-700 p-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Local Search</h3>
                <p className="text-gray-300 mb-6">Increase Your Online Presence in your area</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Please draw Nearby, Ready-to-Buy Customers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Be More Prominent in Google Maps</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Generate More Calls and store visits</span>
                  </li>
                </ul>
                <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-800">
                  <p className="text-emerald-300 text-sm">
                    Our Local Search services at Tech Processing LLC are aimed at ensuring that your business is put in the frontline, whenever your products or services are being sought locally.
                  </p>
                </div>
              </motion.div>

              {/* Social Media */}
              <motion.div
                className="bg-slate-900 rounded-2xl shadow-lg border border-slate-700 p-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Facebook className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  <Link to="/services/social-media-marketing" className="hover:text-emerald-400 transition-colors">
                    Social Media
                  </Link>
                </h3>
                <p className="text-gray-300 mb-6">Build genuine relationships with the customers</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Increase brand recognition and brand loyalty</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Promote interaction with innovative contents</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Monitor success in real-time analytics</span>
                  </li>
                </ul>
                <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-800">
                  <p className="text-emerald-300 text-sm">
                    Our social media specialists develop custom-made plans in social platforms such as Facebook, Instagram, LinkedIn, Twitter, among others.
                  </p>
                </div>
              </motion.div>

              {/* Google Ads */}
              <motion.div
                className="bg-slate-900 rounded-2xl shadow-lg border border-slate-700 p-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Google ADS</h3>
                <p className="text-gray-300 mb-6">Go straight to your customers directly</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Max ROI-wise advertising maximization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Be the first result in the search outcomes</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">Monitor, measure and tune performance</span>
                  </li>
                </ul>
                <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-800">
                  <p className="text-emerald-300 text-sm">
                    In Tech Processing LLC, we excel in the development and management of Google Ads campaigns that provide quantifiable results and actual business development.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Portfolio/Case Studies Section */}
        <section id="portfolio" className="py-20 bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                We have worked with some of the biggest names in USA
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                See how we've helped businesses like SAPPHIRE OCEAN LLC, Softowel Inc, and Almas achieve extraordinary growth
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {caseStudies.map((study, index) => (
                <motion.div
                  key={study.client}
                  className="bg-slate-900 rounded-2xl shadow-lg border border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="aspect-video bg-gradient-to-br from-emerald-500 to-teal-600 relative overflow-hidden">
                    <img 
                      src={study.image} 
                      alt={`${study.client} case study`}
                      className="w-full h-full object-cover opacity-80"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-lg font-bold">{study.client}</div>
                      <div className="text-sm opacity-90">{study.industry}</div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3">The Challenge</h3>
                    <p className="text-gray-300 mb-4">{study.challenge}</p>
                    
                    <h4 className="text-lg font-semibold text-white mb-3">Our Solution</h4>
                    <p className="text-gray-300 mb-6">{study.solution}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(study.results).map(([key, value]) => (
                        <div key={key} className="text-center p-3 bg-slate-800 rounded-lg">
                          <div className="text-lg font-bold text-emerald-400">{value}</div>
                          <div className="text-xs text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                What Our Clients Say
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Don't just take our word for it—hear from businesses we've helped succeed
              </p>
            </motion.div>

            <div className="relative">
              <div className="overflow-hidden">
                <motion.div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <div className="bg-slate-800 rounded-2xl p-8 max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                          <div className="flex-shrink-0">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-24 h-24 rounded-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 text-center md:text-left">
                            <div className="flex justify-center md:justify-start mb-4">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <blockquote className="text-lg lg:text-xl text-gray-300 italic mb-6 leading-relaxed">
                              "{testimonial.content}"
                            </blockquote>
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <div className="font-bold text-white">{testimonial.name}</div>
                                <div className="text-gray-400">{testimonial.role}, {testimonial.company}</div>
                              </div>
                              <div className="mt-4 md:mt-0">
                                <div className="inline-flex items-center px-4 py-2 bg-emerald-900/20 text-emerald-300 rounded-full text-sm font-semibold">
                                  <TrendingUp className="h-4 w-4 mr-2" />
                                  {testimonial.results}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>
              
              {/* Testimonial Navigation */}
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === activeTestimonial ? 'bg-emerald-600' : 'bg-gray-600'
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-20 bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Our Proven Process
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                A streamlined approach that delivers exceptional results every time
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  className="relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-700 text-center relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {step.step}
                      </div>
                    </div>
                    
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                    <p className="text-gray-300 mb-4">{step.description}</p>
                    
                    <div className="inline-flex items-center px-3 py-1 bg-emerald-900/20 text-emerald-300 rounded-full text-sm font-medium">
                      <Clock className="h-4 w-4 mr-2" />
                      {step.duration}
                    </div>
                  </div>
                  
                  {/* Connector Line */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 transform -translate-y-1/2"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* Contact/Lead Form Section */}
        <section id="contact" className="py-20 bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Let's work together to take your business to the next level with our proven digital solutions and expert team.
                </p>

                <div className="space-y-6 mb-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Call Us</div>
                      <a href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`} className="text-emerald-400 hover:underline">
                        {appConfig.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Email Us</div>
                      <a href={`mailto:${appConfig.contact.email}`} className="text-emerald-400 hover:underline">
                        {appConfig.contact.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">Visit Us</div>
                      <div className="text-gray-300">
                        {appConfig.contact.address}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors" aria-label="Facebook">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors" aria-label="Twitter">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors" aria-label="LinkedIn">
                    <LinkedIn className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors" aria-label="Instagram">
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </motion.div>

              {/* Form Tabs and Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                {/* Tab Navigation */}
                <div className="flex mb-6 bg-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('contact')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === 'contact'
                        ? 'bg-slate-700 text-emerald-400 shadow-sm'
                        : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Get Quote
                  </button>
                  <button
                    onClick={() => setActiveTab('appointment')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === 'appointment'
                        ? 'bg-slate-700 text-emerald-400 shadow-sm'
                        : 'text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Book Call
                  </button>
                </div>

                {/* Form Content */}
                {activeTab === 'contact' ? (
                  <ContactForm onSuccess={handleFormSuccess} />
                ) : (
                  <AppointmentBooking onSuccess={handleFormSuccess} />
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg">
                    <div className="text-white font-black text-lg">TP</div>
                  </div>
                  <div className="font-black text-2xl">
                    <span className="tracking-wider">TECHPROCESSING</span>
                    <div className="text-xs text-emerald-400 font-bold tracking-[0.2em]">LLC</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 max-w-md">
                  Your digital transformation partners, delivering innovative solutions in design, marketing, and technology to help your business grow and succeed online.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors" aria-label="Facebook">
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors" aria-label="Twitter">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors" aria-label="LinkedIn">
                    <LinkedIn className="h-5 w-5" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-colors" aria-label="Instagram">
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Services</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><a href="#services" className="hover:text-emerald-400 transition-colors">Social Media Marketing</a></li>
                  <li><a href="#services" className="hover:text-emerald-400 transition-colors">Social Media Management</a></li>
                  <li><a href="#services" className="hover:text-emerald-400 transition-colors">LLC Formation</a></li>
                  <li><a href="#services" className="hover:text-emerald-400 transition-colors">Graphic Designing</a></li>
                  <li><a href="#services" className="hover:text-emerald-400 transition-colors">SEO & GMB</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4">Contact Info</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-emerald-400" />
                    <a href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`} className="hover:text-emerald-400 transition-colors">
                      {appConfig.contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-emerald-400" />
                    <a href={`mailto:${appConfig.contact.email}`} className="hover:text-emerald-400 transition-colors">
                      {appConfig.contact.email}
                    </a>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 text-emerald-400 mt-1" />
                    <div>
                      {appConfig.contact.address}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <a 
                      href="https://www.linkedin.com/company/tech-processing-llc" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      Follow us on LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2024 TechProcessing LLC. All rights reserved.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link to="/privacy-policy" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Privacy Policy</Link>
                <Link to="/terms-conditions" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Terms & Conditions</Link>
                <Link to="/login" className="text-gray-400 hover:text-emerald-400 text-sm transition-colors">Client Login</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Cookie Consent Banner */}
      <CookieConsent 
        onAccept={() => {
          console.log('All cookies accepted');
          // Here you can initialize analytics, marketing tools, etc.
        }}
        onDecline={() => {
          console.log('All cookies declined');
          // Here you can ensure no tracking scripts are loaded
        }}
        onCustomize={() => {
          console.log('Custom preferences saved');
          // Here you can load only the selected cookie types
        }}
      />
    </MobileOptimized>
  );
}