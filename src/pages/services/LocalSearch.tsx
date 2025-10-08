import { motion } from 'framer-motion';
import { MapPin, Search, Phone, Users, CheckCircle, ArrowRight, Star, Clock, Target, Award, BarChart3, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { appConfig } from '../../config/app.config';

export function LocalSearchPage() {
  const features = [
    {
      icon: MapPin,
      title: 'Google My Business Optimization',
      description: 'Complete optimization of your Google My Business profile for maximum local visibility and engagement.'
    },
    {
      icon: Search,
      title: 'Local Citation Management',
      description: 'Ensure consistent business information across all major directories and local search platforms.'
    },
    {
      icon: Users,
      title: 'Review Management',
      description: 'Professional review collection and management to build trust and improve local rankings.'
    },
    {
      icon: Target,
      title: 'Location-Based Keywords',
      description: 'Strategic use of location-based keywords to attract nearby customers searching for your services.'
    },
    {
      icon: Globe,
      title: 'Local Content Strategy',
      description: 'Create locally relevant content that resonates with your community and improves search visibility.'
    },
    {
      icon: BarChart3,
      title: 'Local Analytics & Reporting',
      description: 'Detailed tracking and reporting of local search performance and customer engagement metrics.'
    }
  ];

  const benefits = [
    'Increase your online presence in your area',
    'Draw nearby, ready-to-buy customers',
    'Be more prominent in Google Maps',
    'Generate more calls and store visits',
    'Build trust with local customers',
    'Outperform local competitors'
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Local SEO Audit',
      description: 'Comprehensive analysis of your current local search presence and competitor landscape.',
      duration: '2-3 days'
    },
    {
      step: 2,
      title: 'GMB Optimization',
      description: 'Complete optimization of your Google My Business profile with accurate information and engaging content.',
      duration: '1-2 days'
    },
    {
      step: 3,
      title: 'Citation Building',
      description: 'Build and manage local citations across major directories and platforms.',
      duration: '1 week'
    },
    {
      step: 4,
      title: 'Ongoing Management',
      description: 'Continuous monitoring, optimization, and review management for sustained local visibility.',
      duration: 'Ongoing'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'SAPPHIRE OCEAN LLC',
      content: 'TechProcessing\'s local search optimization has transformed our local visibility. We\'re now the top result for local searches and getting 3x more calls!',
      rating: 5,
      results: '+300% Local Calls'
    },
    {
      name: 'Michael Chen',
      company: 'Softowel Inc',
      content: 'Our Google My Business profile is now fully optimized and we\'re ranking #1 for local searches. The team\'s expertise in local SEO is outstanding.',
      rating: 5,
      results: '#1 Local Ranking'
    }
  ];

  return (
    <div className="min-h-screen bg-bg1 text-fg">
      {/* SEO Meta Tags */}
      <head>
        <title>Local Search Optimization Services | TechProcessing LLC</title>
        <meta name="description" content="Professional local search optimization services. Increase your online presence in your area and draw nearby, ready-to-buy customers with our local SEO expertise." />
        <meta name="keywords" content="local search optimization, local SEO, Google My Business, local marketing, local visibility, local citations" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://techprocessingllc.com/services/local-search" />
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
                Local Search Optimization
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-fg mb-6 leading-tight">
              Increase Your Online Presence in Your Area
            </h1>
            
            <p className="text-lg sm:text-xl text-muted mb-8 max-w-3xl mx-auto leading-relaxed">
              In the current world of competition, it is imperative to be discovered by local customers. Our Local Search services at Tech Processing LLC are aimed at ensuring that your business is put in the frontline, whenever your products or services are being sought locally.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <a
                href="#contact"
                className="bg-gradient-to-r from-accent1 to-accent600 hover:from-emerald-600 hover:to-accent700 text-fg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                Get Free Local Search Audit
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
                You might have a restaurant, retail shop, clinic or a company that provides services, in whichever case, local search optimization will make sure that you are noticed by people around you who care the most about you, and they are willing to make a move.
              </p>
              <p className="text-muted leading-relaxed mb-6">
                The process begins with our optimization of your Google My Business profile, ensuring your business information is correct, exhaustive and enticing. We also take care of your local citations, so that your name, address and phone number are the same in all the major directories.
              </p>
              <p className="text-muted leading-relaxed">
                We also assist you in collection and responsive to the customer reviews, which will not only generate trust but also improve your local ranking. Tech Processing LLC does things a little further by using location-based keywords, organizing locally unique content, and mobilizing your webpage.
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
            <h2 className="text-3xl font-bold text-fg mb-8">Our Local Search Services</h2>
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
            <h2 className="text-3xl font-bold text-fg mb-8">Why Choose Local Search Optimization?</h2>
            <div className="bg-emerald-900/20 rounded-xl p-8">
              <p className="text-base sm:text-lg text-muted mb-6">
                Local search optimization helps you connect with customers in your area who are actively looking for your services. Here's what you can expect:
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
            <h2 className="text-3xl font-bold text-fg mb-8">Our Local Search Process</h2>
            <p className="text-base sm:text-lg text-muted mb-8">
              A proven methodology for dominating local search results
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
              Don't just take our word for it—hear from businesses we've helped dominate local search
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
              Ready to Dominate Local Search?
            </h2>
            <p className="text-base sm:text-lg text-muted mb-8">
              Don't let your competitors take up the local market. By using Local Search services provided by Tech Processing LLC, you will get increased calls and visits as well as loyal residents of your local community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="#contact"
                className="bg-gradient-to-r from-accent1 to-accent600 hover:from-emerald-600 hover:to-accent700 text-fg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                Get Free Local Search Audit
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
              Get Your Free Local Search Audit
            </h2>
            <p className="text-base sm:text-lg text-muted mb-8 sm:mb-12 text-center">
              Do it now and get a local search audit at no cost and see what we can do to make your business successful in the local arena!
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
                    <label className="block text-xs sm:text-sm font-medium text-muted mb-2">Business Location</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-surface2 text-fg"
                      placeholder="City, State"
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
                  <label className="block text-xs sm:text-sm font-medium text-muted mb-2">Current Local Search Challenges</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-surface2 text-fg"
                    placeholder="Tell us about your current local search challenges and goals..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-accent1 to-accent600 hover:from-emerald-600 hover:to-accent700 text-fg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                  Get Free Local Search Audit
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
