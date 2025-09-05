import { motion } from 'framer-motion';
import { Search, Phone, Users, CheckCircle, ArrowRight, Star, Clock, Target, Award, BarChart3, Globe, ArrowLeft, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { appConfig } from '../../config/app.config';

export function SEOPage() {
  const features = [
    {
      icon: Search,
      title: 'Keyword Research & Strategy',
      description: 'Comprehensive keyword research to identify high-value opportunities and develop targeted content strategies.'
    },
    {
      icon: BarChart3,
      title: 'Technical SEO Optimization',
      description: 'Site speed optimization, mobile responsiveness, and technical improvements for better search engine crawling.'
    },
    {
      icon: Globe,
      title: 'On-Page SEO',
      description: 'Optimize title tags, meta descriptions, headers, and content structure for maximum search visibility.'
    },
    {
      icon: Target,
      title: 'Link Building',
      description: 'High-quality backlink acquisition to improve domain authority and search engine rankings.'
    },
    {
      icon: TrendingUp,
      title: 'Local SEO',
      description: 'Location-based optimization to help local customers find your business in search results.'
    },
    {
      icon: Award,
      title: 'Performance Monitoring',
      description: 'Regular tracking and reporting of rankings, traffic, and conversion metrics with actionable insights.'
    }
  ];

  const benefits = [
    'Improve your market presence and rise on search results',
    'Gain search engine visibility and organic traffic',
    'Increase conversion rates with targeted traffic',
    'Build long-term sustainable growth',
    'Outperform competitors in search rankings',
    'Get measurable ROI from your marketing investment'
  ];

  const processSteps = [
    {
      step: 1,
      title: 'SEO Audit & Analysis',
      description: 'Comprehensive analysis of your current SEO performance and competitor landscape.',
      duration: '3-5 days'
    },
    {
      step: 2,
      title: 'Strategy Development',
      description: 'Create a customized SEO strategy based on your business goals and target audience.',
      duration: '1-2 days'
    },
    {
      step: 3,
      title: 'Implementation',
      description: 'Execute technical optimizations, content improvements, and link building campaigns.',
      duration: '2-4 weeks'
    },
    {
      step: 4,
      title: 'Monitoring & Optimization',
      description: 'Continuous monitoring, reporting, and optimization for sustained growth.',
      duration: 'Ongoing'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'SAPPHIRE OCEAN LLC',
      content: 'TechProcessing\'s SEO services have transformed our online visibility. We\'re now ranking #1 for our target keywords and getting 400% more organic traffic!',
      rating: 5,
      results: '+400% Organic Traffic'
    },
    {
      name: 'Michael Chen',
      company: 'Softowel Inc',
      content: 'The team\'s expertise in SEO is outstanding. Our website now ranks on the first page for all our important keywords and we\'re getting quality leads consistently.',
      rating: 5,
      results: '#1 Page Rankings'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* SEO Meta Tags */}
      <head>
        <title>SEO Services | TechProcessing LLC</title>
        <meta name="description" content="Professional SEO services. Improve your market presence and rise on search results with our expert search engine optimization strategies." />
        <meta name="keywords" content="SEO services, search engine optimization, keyword research, technical SEO, local SEO, link building" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://techprocessingllc.com/services/seo" />
      </head>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-4">
              <a href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`} className="text-gray-300 hover:text-emerald-400 transition-colors">
                <Phone className="h-5 w-5" />
              </a>
              <a href="#contact" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Simplified */}
      <section className="py-16 bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-emerald-900/20 text-emerald-300 rounded-full text-sm font-semibold">
                <Search className="h-4 w-4 mr-2" />
                Search Engine Optimization
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Improve Your Market Presence and Rise on Search Results
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Our SEO gurus will be working on making your site more search engine-friendly to gain search engine visibility, organic traffic and rise conversion. We leverage time-tested approaches and the most modern methods to make sure that your business is easy to notice in the world of the internet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="#contact"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <Search className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Get Free SEO Audit
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`}
                className="border-2 border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                {appConfig.contact.phone}
              </a>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">400%</div>
                <div className="text-sm text-gray-400 font-medium">More Traffic</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-400">#1</div>
                <div className="text-sm text-gray-400 font-medium">Page Rankings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">24/7</div>
                <div className="text-sm text-gray-400 font-medium">Monitoring</div>
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
            <h2 className="text-3xl font-bold text-white mb-8">What We Do</h2>
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-6">
                Websites are everywhere in the digital world these days and it is not sufficient just to have one. The most effective way in which you can actually expand your business online is to ensure that you are present in the same place your customers are searching, which is through Google and other major search engines.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Here at Tech Processing LLC we consider SEO in a broad manner. We begin with a thorough audit of your site and of your competitors and see where you can improve. We streamline the structure, content and technical aspects of your site to make it as crawler-friendly as possible.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We also specialize in keyword research, on-site efforts, link building of high-quality, and local SEO efforts that are industry and goals-oriented. Our philosophy is open communication, evidence-based approaches, and metric outcomes.
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
            <h2 className="text-3xl font-bold text-white mb-8">Our SEO Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start space-x-4 p-6 bg-slate-800 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
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
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose Our SEO Services?</h2>
            <div className="bg-emerald-900/20 rounded-xl p-8">
              <p className="text-lg text-gray-300 mb-6">
                Our SEO services are designed to deliver measurable results and long-term growth for your business. Here's what you can expect:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
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
            <h2 className="text-3xl font-bold text-white mb-8">Our SEO Process</h2>
            <p className="text-lg text-gray-300 mb-8">
              A proven methodology for achieving sustainable SEO success
            </p>
            
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  className="flex items-start space-x-6 p-6 bg-slate-800 rounded-xl border border-slate-700"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                      <div className="inline-flex items-center px-3 py-1 bg-emerald-900/20 text-emerald-300 rounded-full text-sm font-medium">
                        <Clock className="h-4 w-4 mr-2" />
                        {step.duration}
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* Testimonials Section */}
      <section className="py-16 bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">What Our Clients Say</h2>
            <p className="text-lg text-gray-300 mb-12 text-center">
              Don't just take our word for it—hear from businesses we've helped achieve SEO success
            </p>

            <div className="space-y-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-slate-900 rounded-xl p-8 shadow-lg border border-slate-700"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg text-gray-300 italic mb-6 leading-relaxed text-center">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-gray-400">{testimonial.company}</div>
                    </div>
                    <div className="inline-flex items-center px-4 py-2 bg-emerald-900/20 text-emerald-300 rounded-full text-sm font-semibold">
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
      <section className="py-16 bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Dominate Search Results?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Do not allow your competition to be ranking higher than you. Collaborate with Tech Processing LLC and make your online presence close to perfection.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <Search className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Get Free SEO Audit
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`}
                className="border-2 border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                {appConfig.contact.phone}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Get Your Free SEO Audit
            </h2>
            <p className="text-lg text-gray-300 mb-12 text-center">
              Get in touch with us now to take a free search engine optimization review and watch us make your business boom!
            </p>

            <div className="bg-slate-800 rounded-2xl p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Business Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-700 text-white"
                      placeholder="Your business name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-700 text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
                    <input
                      type="url"
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-700 text-white"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Business Type</label>
                    <select className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-700 text-white">
                      <option>E-commerce</option>
                      <option>Professional Services</option>
                      <option>Healthcare</option>
                      <option>Real Estate</option>
                      <option>Technology</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">SEO Goals</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-700 text-white"
                    placeholder="Tell us about your SEO goals and current challenges..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  <Search className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Get Free SEO Audit
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}