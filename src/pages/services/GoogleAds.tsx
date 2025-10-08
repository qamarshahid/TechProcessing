import { motion } from 'framer-motion';
import { Target, Search, TrendingUp, CheckCircle, ArrowRight, Phone, Mail, MapPin, Star, Clock, Users, BarChart3, Zap, Award, DollarSign, ArrowLeft, MousePointer, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { appConfig } from '../../config/app.config';

export function GoogleAdsPage() {
  const features = [
    {
      icon: Target,
      title: 'Campaign Strategy & Setup',
      description: 'Strategic Google Ads campaign development with precise targeting and optimization for maximum ROI.'
    },
    {
      icon: Search,
      title: 'Keyword Research & Management',
      description: 'Comprehensive keyword research and ongoing management to ensure your ads reach the right audience.'
    },
    {
      icon: TrendingUp,
      title: 'Ad Creation & Optimization',
      description: 'Compelling ad copy and creative development with continuous optimization for better performance.'
    },
    {
      icon: BarChart3,
      title: 'Performance Monitoring',
      description: 'Real-time campaign monitoring and detailed analytics to track performance and identify opportunities.'
    },
    {
      icon: DollarSign,
      title: 'Budget Management',
      description: 'Strategic budget allocation and bid management to maximize your advertising investment.'
    },
    {
      icon: Award,
      title: 'Conversion Optimization',
      description: 'Landing page optimization and conversion tracking to turn clicks into customers.'
    }
  ];

  const benefits = [
    'Go straight to your customers directly',
    'Max ROI-wise advertising maximization',
    'Be the first result in search outcomes',
    'Monitor, measure and tune performance',
    'Pay only when your ad is clicked',
    'Get transparent reporting and insights'
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Campaign Strategy',
      description: 'Develop a comprehensive Google Ads strategy based on your business goals and target audience.',
      duration: '1-2 days'
    },
    {
      step: 2,
      title: 'Campaign Setup',
      description: 'Create and launch optimized campaigns with strategic keyword targeting and compelling ad copy.',
      duration: '2-3 days'
    },
    {
      step: 3,
      title: 'Launch & Monitor',
      description: 'Launch campaigns and begin real-time monitoring with initial optimization adjustments.',
      duration: '1 week'
    },
    {
      step: 4,
      title: 'Optimize & Scale',
      description: 'Continuous optimization, performance analysis, and scaling of successful campaigns.',
      duration: 'Ongoing'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'SAPPHIRE OCEAN LLC',
      content: 'TechProcessing\'s Google Ads management has transformed our online visibility. We\'re now getting 5x more qualified leads and our ROI has improved by 300%!',
      rating: 5,
      results: '+300% ROI'
    },
    {
      name: 'Michael Chen',
      company: 'Softowel Inc',
      content: 'The team\'s expertise in Google Ads is outstanding. Our campaigns are highly targeted and we\'re seeing excellent results with measurable ROI.',
      rating: 5,
      results: '+500% Leads'
    }
  ];

  return (
    <div className="min-h-screen bg-bg1 text-fg">
      {/* SEO Meta Tags */}
      <head>
        <title>Google Ads Services | TechProcessing LLC</title>
        <meta name="description" content="Professional Google Ads services. Go straight to your customers directly with max ROI-wise advertising maximization and be the first result in search outcomes." />
        <meta name="keywords" content="Google Ads, PPC advertising, paid search, Google advertising, search ads, display ads, campaign management" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://techprocessingllc.com/services/google-ads" />
      </head>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-bg1/90 backdrop-blur-md border-b border-outline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-accent2 hover:text-accent3 transition-colors touch-manipulation">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-4">
              <a href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`} className="text-muted hover:text-accent2 transition-colors touch-manipulation">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#contact" className="bg-accent1 hover:bg-accent1 text-fg px-4 py-2 rounded-lg font-medium transition-colors touch-manipulation">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Simplified */}
      <section className="py-16 bg-gradient-to-br from-emerald-900/20 to-accent900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-emerald-900/20 text-accent3 rounded-full text-xs sm:text-sm font-semibold">
                <Target className="h-4 w-4 mr-2" />
                Google Ads
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-fg mb-6 leading-tight">
              Go Straight to Your Customers Directly
            </h1>
            
            <p className="text-lg sm:text-xl text-muted mb-8 max-w-3xl mx-auto leading-relaxed">
              When you are dealing with the rat race of the online marketplace, having your business noticed by the correct viewer at the correct moment is of the essence. One of the best techniques to get instant visibility and transport high-quality traffic to your site is to make use of Google Ads.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <a
                href="#contact"
                className="bg-gradient-to-r from-accent1 to-accent600 hover:from-emerald-600 hover:to-accent700 text-fg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                Get Free Google Ads Consultation
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`}
                className="border-2 border-accent1 text-accent2 hover:bg-accent1 hover:text-fg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {appConfig.contact.phone}
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent2">300%</div>
                <div className="text-xs sm:text-sm text-muted font-medium">ROI Increase</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent400">#1</div>
                <div className="text-xs sm:text-sm text-muted font-medium">Search Results</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent400">24/7</div>
                <div className="text-xs sm:text-sm text-muted font-medium">Monitoring</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Single Column Layout */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* What We Do Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-fg mb-8">What We Do</h2>
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-muted leading-relaxed mb-6">
                In Tech Processing LLC, we excel in the development and management of Google Ads campaigns that provide quantifiable results and actual business development. We begin our work by learning more about your business objectives and the target audience.
              </p>
              <p className="text-muted leading-relaxed mb-6">
                We carry out extensive keyword research to make sure your advertisements are shown by most relevant searches. Our well phased ad copy and bidding will enable you to target potential customers when they want to search the use of your products or services.
              </p>
              <p className="text-muted leading-relaxed">
                However we do not just leave with launching your campaign. We constantly observe and evaluate performance and data and make modifications to give you the best returns on investment. Our Google Ads specialists customize each campaign as per your specific needs whether you are trying to increase your website visits, leads, or even make more online sales.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-fg mb-8">Our Google Ads Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start space-x-4 p-6 bg-surface rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-accent1 to-accent600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-fg" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-fg mb-2">{feature.title}</h3>
                    <p className="text-muted leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-fg mb-8">Why Choose Google Ads?</h2>
            <div className="bg-emerald-900/20 rounded-xl p-8">
              <p className="text-base sm:text-lg text-muted mb-6">
                Google Ads is one where you can spend money only when your commercial is clicked, so it is a way to expand your company without wasting a lot of money. On top of that, we use transparent reporting to keep you updated at all times. Here's what you can expect:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-accent2 flex-shrink-0" />
                    <span className="text-muted">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Process Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-fg mb-8">Our Google Ads Process</h2>
            <p className="text-base sm:text-lg text-muted mb-8">
              A proven methodology for achieving Google Ads success
            </p>
            
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  className="flex items-start space-x-6 p-6 bg-surface rounded-xl border border-outline"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-accent1 to-accent600 rounded-full flex items-center justify-center text-fg font-bold text-base sm:text-lg flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-fg">{step.title}</h3>
                      <div className="inline-flex items-center px-3 py-1 bg-emerald-900/20 text-accent3 rounded-full text-xs sm:text-sm font-medium">
                        <Clock className="h-4 w-4 mr-2" />
                        {step.duration}
                      </div>
                    </div>
                    <p className="text-muted leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* Testimonials Section */}
      <section className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-fg mb-8 text-center">What Our Clients Say</h2>
            <p className="text-base sm:text-lg text-muted mb-8 sm:mb-12 text-center">
              Don't just take our word for it—hear from businesses we've helped achieve Google Ads success
            </p>

            <div className="space-y-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-bg2 rounded-xl p-8 shadow-lg border border-outline"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-base sm:text-lg text-muted italic mb-6 leading-relaxed text-center">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-fg">{testimonial.name}</div>
                      <div className="text-muted">{testimonial.company}</div>
                    </div>
                    <div className="inline-flex items-center px-4 py-2 bg-emerald-900/20 text-accent3 rounded-full text-xs sm:text-sm font-semibold">
                      <Award className="h-4 w-4 mr-2" />
                      {testimonial.results}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-900/20 to-accent900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-fg mb-6">
              Ready to Dominate Google Ads?
            </h2>
            <p className="text-base sm:text-lg text-muted mb-8">
              Do not allow your competitors to have an upper hand. Collaborate with Tech Processing LLC on Google Ads marketing and see your company on the first list of search results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="#contact"
                className="bg-gradient-to-r from-accent1 to-accent600 hover:from-emerald-600 hover:to-accent700 text-fg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                Get Free Google Ads Consultation
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`}
                className="border-2 border-accent1 text-accent2 hover:bg-accent1 hover:text-fg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {appConfig.contact.phone}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-bg2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-fg mb-8 text-center">
              Get Your Free Google Ads Consultation
            </h2>
            <p className="text-base sm:text-lg text-muted mb-8 sm:mb-12 text-center">
              Book a free Google Ads consultation at any given time and achieve your target customer base.
            </p>

            <div className="bg-surface rounded-2xl p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-muted mb-2">Business Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-surface2 text-fg"
                      placeholder="Your business name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-muted mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-surface2 text-fg"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-muted mb-2">Website URL</label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-surface2 text-fg"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-muted mb-2">Monthly Ad Budget</label>
                    <select className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-surface2 text-fg">
                      <option>$1,000 - $5,000</option>
                      <option>$5,000 - $10,000</option>
                      <option>$10,000 - $25,000</option>
                      <option>$25,000+</option>
                      <option>Not Sure</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-muted mb-2">Google Ads Goals</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-surface2 text-fg"
                    placeholder="Tell us about your Google Ads goals and current challenges..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-accent1 to-accent600 hover:from-emerald-600 hover:to-accent700 text-fg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                  Get Free Google Ads Consultation
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}