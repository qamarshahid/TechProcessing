import { motion } from 'framer-motion';
import { Facebook, Users, TrendingUp, CheckCircle, ArrowRight, Star, Clock, Target, Award, BarChart3, Globe, ArrowLeft, Phone, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { appConfig } from '../../config/app.config';

export function SocialMediaMarketingPage() {
  const features = [
    {
      icon: Facebook,
      title: 'Social Media Strategy',
      description: 'Develop customized campaigns to attract brand awareness, lead generation, and ROI maximization on all mainstream social networks.'
    },
    {
      icon: Users,
      title: 'Audience Targeting',
      description: 'Reach your target audience with precision targeting and engagement strategies across multiple social platforms.'
    },
    {
      icon: TrendingUp,
      title: 'Content Creation',
      description: 'Create engaging, shareable content that resonates with your audience and drives meaningful interactions.'
    },
    {
      icon: Target,
      title: 'Campaign Management',
      description: 'Professional management of paid and organic social media campaigns for maximum reach and engagement.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Comprehensive tracking and reporting of social media performance with actionable insights for optimization.'
    },
    {
      icon: Globe,
      title: 'Multi-Platform Presence',
      description: 'Maintain consistent brand presence across Facebook, Instagram, LinkedIn, Twitter, and other relevant platforms.'
    }
  ];

  const benefits = [
    'Develop a strong brand using the power of social channels',
    'Increase your presence online and reach your target audience',
    'Increase results that matter in your business',
    'Build brand awareness and lead generation',
    'Maximize ROI on all mainstream social networks',
    'Create engaging content that drives conversions'
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Strategy Development',
      description: 'Create a comprehensive social media strategy tailored to your business goals and target audience.',
      duration: '1-2 days'
    },
    {
      step: 2,
      title: 'Content Planning',
      description: 'Develop content calendar and create engaging posts that align with your brand voice and objectives.',
      duration: '1 week'
    },
    {
      step: 3,
      title: 'Campaign Launch',
      description: 'Launch targeted campaigns across multiple social platforms with optimized content and targeting.',
      duration: '2-3 days'
    },
    {
      step: 4,
      title: 'Optimization & Growth',
      description: 'Continuous monitoring, optimization, and scaling of successful campaigns for sustained growth.',
      duration: 'Ongoing'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'SAPPHIRE OCEAN LLC',
      content: 'TechProcessing\'s social media marketing has transformed our online presence. We\'re now reaching 5x more people and generating quality leads consistently!',
      rating: 5,
      results: '+500% Reach'
    },
    {
      name: 'Michael Chen',
      company: 'Softowel Inc',
      content: 'The team\'s expertise in social media marketing is outstanding. Our campaigns are highly targeted and we\'re seeing excellent engagement and ROI.',
      rating: 5,
      results: '+300% Engagement'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* SEO Meta Tags */}
      <head>
        <title>Social Media Marketing Services | TechProcessing LLC</title>
        <meta name="description" content="Professional social media marketing services. Develop a strong brand using the power of social channels and increase your online presence with our expert strategies." />
        <meta name="keywords" content="social media marketing, social media strategy, Facebook marketing, Instagram marketing, LinkedIn marketing, social media campaigns" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://techprocessingllc.com/services/social-media-marketing" />
      </head>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors touch-manipulation">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-4">
              <a href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`} className="text-gray-300 hover:text-emerald-400 transition-colors touch-manipulation">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#contact" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors touch-manipulation">
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
              <span className="inline-flex items-center px-4 py-2 bg-emerald-900/20 text-emerald-300 rounded-full text-xs sm:text-sm font-semibold">
                <Facebook className="h-4 w-4 mr-2" />
                Social Media Marketing
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
              Develop a Strong Brand Using the Power of Social Channels
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Our Social Media Marketing services are intended to increase your presence online, reach your target audience and an increase in results that matter in your business. We develop customized campaigns to attract brand awareness, lead generation, and ROI maximization on all the mainstream social networks.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <a
                href="#contact"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                Get Free Social Media Audit
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`}
                className="border-2 border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {appConfig.contact.phone}
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-400">500%</div>
                <div className="text-xs sm:text-sm text-gray-400 font-medium">More Reach</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-400">300%</div>
                <div className="text-xs sm:text-sm text-gray-400 font-medium">Engagement</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">5+</div>
                <div className="text-xs sm:text-sm text-gray-400 font-medium">Platforms</div>
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
                The digital landscape of the present-day is all about social media where the talk is made, trends established and brands developed. At Tech Processing LLC, our professionals will assist your business in tapping into the potential of social media in connecting with your audience, solidifying your brand, and getting tangible results.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Our social media specialists develop custom-made plans in social platforms such as Facebook, Instagram, LinkedIn, Twitter, among others. We begin by knowing what your business wants to achieve and whom you want to reach so that we can design catchy content on a basis that promotes the voice and beliefs of your brand.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We also use eye-grabbing graphics and attractive captions, engaging stories, and even video content to make your business be seen in a busy stream. However, we do not stop there by posting. In your tech, Processing LLC is your lively community where we answer comments and messages and monitor trends to keep your brand on point.
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
            <h2 className="text-3xl font-bold text-white mb-8">Our Social Media Marketing Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
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
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{feature.title}</h3>
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
            <h2 className="text-3xl font-bold text-white mb-8">Why Choose Social Media Marketing?</h2>
            <div className="bg-emerald-900/20 rounded-xl p-8">
              <p className="text-base sm:text-lg text-gray-300 mb-6">
                Our social media marketing services can help you meet your objectives whether it is to create brand awareness, get leads, or more sales and are measurable to give you tangible growth. Here's what you can expect:
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
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 flex-shrink-0" />
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
            <h2 className="text-3xl font-bold text-white mb-8">Our Social Media Marketing Process</h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8">
              A proven methodology for achieving social media marketing success
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
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">{step.title}</h3>
                      <div className="inline-flex items-center px-3 py-1 bg-emerald-900/20 text-emerald-300 rounded-full text-xs sm:text-sm font-medium">
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
            <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-12 text-center">
              Don't just take our word for it—hear from businesses we've helped achieve social media success
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
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-base sm:text-lg text-gray-300 italic mb-6 leading-relaxed text-center">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{testimonial.name}</div>
                      <div className="text-gray-400">{testimonial.company}</div>
                    </div>
                    <div className="inline-flex items-center px-4 py-2 bg-emerald-900/20 text-emerald-300 rounded-full text-xs sm:text-sm font-semibold">
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
              Ready to Transform Your Social Media?
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8">
              You don not have to cede the discussion to your competitors. Join Tech Processing LLC and transform your social outlets into effective tools of audience engagement and expansion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <a
                href="#contact"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                Get Free Social Media Audit
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`}
                className="border-2 border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
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
              Get Your Free Social Media Audit
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-12 text-center">
              Read through our blog and understand how we can wrap your brand on the Internet, and drop us a line today to get a free social media audit!
            </p>

            <div className="bg-slate-800 rounded-2xl p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Business Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-700 text-white"
                      placeholder="Your business name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-700 text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Current Social Media Platforms</label>
                    <select className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-700 text-white">
                      <option>Facebook</option>
                      <option>Instagram</option>
                      <option>LinkedIn</option>
                      <option>Twitter</option>
                      <option>Multiple Platforms</option>
                      <option>None Currently</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Business Type</label>
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
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Social Media Goals</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-700 text-white"
                    placeholder="Tell us about your social media marketing goals and current challenges..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  <Facebook className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                  Get Free Social Media Audit
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