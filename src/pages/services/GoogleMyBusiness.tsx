import { motion } from 'framer-motion';
import { MapPin, Users, Star, Phone, CheckCircle, ArrowRight, Target, BarChart3, Globe, Shield, Clock, MessageCircle, ArrowLeft, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      description: 'Strategic integration with local SEO efforts to maximize visibility in local search results.'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Detailed tracking and reporting of GMB performance metrics and customer engagement data.'
    },
    {
      icon: Shield,
      title: 'Business Verification',
      description: 'Complete business verification process and ongoing maintenance of your GMB listing.'
    }
  ];

  const benefits = [
    'Get your business on the map, literally',
    'Attract more people in the vicinity',
    'Pop out of local search results and Google Maps',
    'Establish trust and increase calls, visits, and clicks',
    'Rank above others in your local area',
    'Turn local searches into real customers'
  ];

  const processSteps = [
    {
      step: 1,
      title: 'GMB Profile Audit',
      description: 'Comprehensive analysis of your current Google My Business profile and optimization opportunities.',
      duration: '1-2 days'
    },
    {
      step: 2,
      title: 'Profile Optimization',
      description: 'Complete optimization of your GMB profile with accurate information, photos, and engaging content.',
      duration: '2-3 days'
    },
    {
      step: 3,
      title: 'Review & Citation Management',
      description: 'Set up review management systems and ensure consistent citations across all platforms.',
      duration: '1 week'
    },
    {
      step: 4,
      title: 'Ongoing Management',
      description: 'Continuous monitoring, optimization, and management for sustained local visibility.',
      duration: 'Ongoing'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'SAPPHIRE OCEAN LLC',
      content: 'TechProcessing\'s GMB optimization has transformed our local visibility. We\'re now ranking #1 for local searches and getting 3x more calls from nearby customers!',
      rating: 5,
      results: '+300% Local Calls'
    },
    {
      name: 'Michael Chen',
      company: 'Softowel Inc',
      content: 'Our Google My Business profile is now fully optimized and we\'re getting consistent local traffic. The team\'s expertise in GMB is outstanding.',
      rating: 5,
      results: '#1 Local Ranking'
    }
  ];

  return (
    <div className="min-h-screen bg-bg1 text-fg">
      {/* SEO Meta Tags */}
      <head>
        <title>Google My Business Optimization Services | TechProcessing LLC</title>
        <meta name="description" content="Professional Google My Business optimization services. Are the locals who are searching your services finding your company on the results? Get your business on the map with our GMB expertise." />
        <meta name="keywords" content="Google My Business, GMB optimization, local business listing, Google Maps, local SEO, business profile optimization" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://techprocessingllc.com/services/google-my-business" />
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
                <MapPin className="h-4 w-4 mr-2" />
                Google My Business Optimization
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-fg mb-6 leading-tight">
              Are the Locals Who Are Searching Your Services Finding Your Company?
            </h1>
            
            <p className="text-lg sm:text-xl text-muted mb-8 max-w-3xl mx-auto leading-relaxed">
              Using Google My Business (GMB), it is possible to bring your business to the map, literally. With our help, your business will better take advantage of GMB optimization and optimize the local presence so that the business can attract more people in the vicinity.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <a
                href="#contact"
                className="bg-gradient-to-r from-accent1 to-accent600 hover:from-emerald-600 hover:to-accent700 text-fg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                Get Free GMB Audit
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
                <div className="text-xs sm:text-sm text-muted font-medium">More Calls</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent400">#1</div>
                <div className="text-xs sm:text-sm text-muted font-medium">Local Ranking</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent400">24/7</div>
                <div className="text-xs sm:text-sm text-muted font-medium">Local Presence</div>
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
                The optimization of a GMB profile is a must have in cases where the business concerned has the desire to pop out of the local search results and the Google Maps. We will make sure you have a complete profile that contains accurate and interesting information of your business, updated information of your business, good quality photos and very interesting descriptions.
              </p>
              <p className="text-muted leading-relaxed mb-6">
                We also assist you to address your customer feedback and rate your comments, make frequent updates, as well as monitor important data and information on how customers are discovering and engaging your business.
              </p>
              <p className="text-muted leading-relaxed">
                We also take local knowledge of SEO and couple it with personal touch, we design our services based on your industry and objectives. Having one location or owning several branches, we will get you to rank above others, establish trust, and increase calls, visits, and clicks to your websites.
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
            <h2 className="text-3xl font-bold text-fg mb-8">Our GMB Services</h2>
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
            <h2 className="text-3xl font-bold text-fg mb-8">Why Choose GMB Optimization?</h2>
            <div className="bg-emerald-900/20 rounded-xl p-8">
              <p className="text-base sm:text-lg text-muted mb-6">
                It is not advisable to have your business going unnoticed. Whether you are the owner of a company or a sole proprietor of a business, you can use Google My Business to help you optimize your business profile and turn local searches to real customers. Here's what you can expect:
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
            <h2 className="text-3xl font-bold text-fg mb-8">Our GMB Process</h2>
            <p className="text-base sm:text-lg text-muted mb-8">
              A proven methodology for dominating Google My Business
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
              Don't just take our word for it—hear from businesses we've helped dominate Google My Business
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
              Ready to Get Your Business on the Map?
            </h2>
            <p className="text-base sm:text-lg text-muted mb-8">
              Get a free GMB audit of your business now and learn how we can help your business grow! We will make sure you have a complete profile that contains accurate and interesting information of your business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="#contact"
                className="bg-gradient-to-r from-accent1 to-accent600 hover:from-emerald-600 hover:to-accent700 text-fg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                Get Free GMB Audit
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
              Get Your Free GMB Audit
            </h2>
            <p className="text-base sm:text-lg text-muted mb-8 sm:mb-12 text-center">
              Get a free GMB audit of your business now and learn how we can help your business grow!
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
                    <label className="block text-xs sm:text-sm font-medium text-muted mb-2">Business Address</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-surface2 text-fg"
                      placeholder="Your business address"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-muted mb-2">Business Type</label>
                    <select className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-surface2 text-fg">
                      <option>Restaurant</option>
                      <option>Retail Store</option>
                      <option>Healthcare</option>
                      <option>Professional Services</option>
                      <option>Home Services</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-muted mb-2">Current GMB Challenges</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-surface2 text-fg"
                    placeholder="Tell us about your current GMB challenges and goals..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-accent1 to-accent600 hover:from-emerald-600 hover:to-accent700 text-fg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                  Get Free GMB Audit
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