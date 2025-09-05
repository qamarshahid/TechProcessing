import { motion } from 'framer-motion';
import { MapPin, Users, Star, Phone, CheckCircle, ArrowRight, TrendingUp, Target, BarChart3, Globe, Zap, Shield, Clock, MessageCircle } from 'lucide-react';
import { appConfig } from '../../config/app.config';

export function GoogleMyBusinessPage() {
  const features = [
    {
      icon: MapPin,
      title: 'Profile Optimization',
      description: 'Complete optimization of your Google My Business profile with accurate information, compelling descriptions, and high-quality photos.'
    },
    {
      icon: Star,
      title: 'Review Management',
      description: 'Professional management of customer reviews to build trust, improve ratings, and respond to feedback effectively.'
    },
    {
      icon: Globe,
      title: 'Local Citations',
      description: 'Ensure consistent business information across all major directories and local citation sources.'
    },
    {
      icon: Target,
      title: 'Local SEO Integration',
      description: 'Combine GMB optimization with local SEO strategies to dominate local search results.'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Detailed reporting on views, clicks, calls, and direction requests to measure your local presence success.'
    },
    {
      icon: MessageCircle,
      title: 'Customer Engagement',
      description: 'Active management of customer questions, posts, and updates to keep your profile fresh and engaging.'
    }
  ];

  const benefits = [
    'Increase local visibility by 250%',
    'Generate more calls and store visits',
    'Build trust with customer reviews',
    'Dominate Google Maps results',
    'Attract nearby ready-to-buy customers',
    'Outperform local competitors'
  ];

  const processSteps = [
    {
      step: 1,
      title: 'GMB Audit & Setup',
      description: 'Comprehensive audit of your current GMB profile and complete setup with optimized information.',
      duration: '1-2 days'
    },
    {
      step: 2,
      title: 'Content Optimization',
      description: 'Create compelling business descriptions, upload high-quality photos, and optimize all profile elements.',
      duration: '2-3 days'
    },
    {
      step: 3,
      title: 'Review Management',
      description: 'Implement review generation strategies and respond to existing reviews professionally.',
      duration: '1-2 weeks'
    },
    {
      step: 4,
      title: 'Ongoing Management',
      description: 'Regular posts, updates, and monitoring to maintain and improve your local presence.',
      duration: 'Ongoing'
    }
  ];

  const testimonials = [
    {
      name: 'Michael Chen',
      company: 'Almas',
      content: 'TechProcessing\'s GMB optimization helped us dominate local search results. We now get 3x more calls and store visits!',
      rating: 5,
      results: '+300% Local Visibility'
    },
    {
      name: 'Sarah Johnson',
      company: 'SAPPHIRE OCEAN LLC',
      content: 'The team\'s expertise in local SEO and GMB management transformed our local presence. Highly recommended!',
      rating: 5,
      results: '+250% Store Visits'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
      {/* SEO Meta Tags */}
      <head>
        <title>Google My Business Optimization Services | TechProcessing LLC</title>
        <meta name="description" content="Professional Google My Business optimization to increase local visibility, attract customers, and dominate Google Maps results. Free GMB audit available." />
        <meta name="keywords" content="Google My Business, GMB optimization, local SEO, Google Maps, local search, business profile optimization" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://techprocessingllc.com/services/google-my-business" />
      </head>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-900/20 dark:via-slate-950 dark:to-teal-900/20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 border-4 border-emerald-400/20 transform rotate-45 hidden lg:block"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-teal-400/20 transform rotate-12 hidden lg:block"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            >
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-semibold">
                  <MapPin className="h-4 w-4 mr-2" />
                  Google My Business
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="block">BRING YOUR</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
                  BUSINESS
                </span>
                <span className="block">TO THE MAP</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed">
                Are the locals who are searching your services finding your company on the results? Using Google My Business (GMB), it is possible to bring your business to the map, literally. With our help, your business will better take advantage of GMB optimization and optimize the local presence so that the business can attract more people in the vicinity.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="#contact"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  <MapPin className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Get Free GMB Audit
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a
                  href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`}
                  className="border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  {appConfig.contact.phone}
                </a>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">250%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Local Visibility</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">3x</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">More Calls</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">#1</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Maps Ranking</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <div className="w-full h-96 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-emerald-400 text-sm font-mono">GMB Dashboard</div>
                </div>
                
                <div className="h-32 bg-slate-800 rounded-lg mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-end justify-between px-4 pb-2">
                    {[60, 75, 55, 85, 70, 95, 80, 100].map((height, i) => (
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
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">250%</div>
                    <div className="text-xs text-gray-400">Visibility</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-400">3x</div>
                    <div className="text-xs text-gray-400">Calls</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">#1</div>
                    <div className="text-xs text-gray-400">Maps</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our GMB Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The optimization of a GMB profile is a must have in cases where the business concerned has the desire to pop out of the local search results and the Google Maps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose Our GMB Services?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We also take local knowledge of SEO and couple it with personal touch, we design our services based on your industry and objectives. Having one location or owning several branches, we will get you to rank above others, establish trust, and increase calls, visits, and clicks to your websites.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                className="flex items-center p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="h-6 w-6 text-emerald-500 mr-4 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our GMB Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A proven methodology to optimize your local presence
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
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 text-center relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 mt-4">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>
                  
                  <div className="inline-flex items-center px-3 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-medium">
                    <Clock className="h-4 w-4 mr-2" />
                    {step.duration}
                  </div>
                </div>
                
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 transform -translate-y-1/2"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it—hear from businesses we've helped achieve GMB success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-slate-700"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-gray-600 dark:text-gray-400">{testimonial.company}</div>
                  </div>
                  <div className="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-semibold">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    {testimonial.results}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Dominate Local Search?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              It is not advisable to have your business going unnoticed. Whether you are the owner of a company or a sole proprietor of a business, you can use Google My Business to help you optimize your business profile and turn local searches to real customers, courtesy of Tech Processing LLC.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <MapPin className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Get Free GMB Audit
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`}
                className="border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center"
              >
                <Phone className="h-5 w-5 mr-2" />
                {appConfig.contact.phone}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Get Your Free GMB Audit
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Get a free GMB audit of your business now and learn how we can help your business grow!
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Call Us</div>
                    <a href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">
                      {appConfig.contact.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Email Us</div>
                    <a href={`mailto:${appConfig.contact.email}`} className="text-emerald-600 dark:text-emerald-400 hover:underline">
                      {appConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Visit Us</div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {appConfig.contact.address}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Request Your Free GMB Audit</h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Your business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Address</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Your business address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Tell us about your local marketing goals..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  <MapPin className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Get Free GMB Audit
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
