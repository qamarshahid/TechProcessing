import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Linkedin, Users, TrendingUp, Target, BarChart3, CheckCircle, ArrowRight, Phone, Mail, MapPin, Star, Clock, MessageCircle, Zap } from 'lucide-react';
import { appConfig } from '../../config/app.config';

export function SocialMediaMarketingPage() {
  const platforms = [
    {
      icon: Facebook,
      name: 'Facebook',
      description: 'Reach your target audience with engaging Facebook campaigns and community building strategies.'
    },
    {
      icon: Instagram,
      name: 'Instagram',
      description: 'Visual storytelling and influencer partnerships to build brand awareness and engagement.'
    },
    {
      icon: Twitter,
      name: 'Twitter',
      description: 'Real-time engagement and thought leadership to establish your brand voice and authority.'
    },
    {
      icon: Linkedin,
      name: 'LinkedIn',
      description: 'B2B marketing and professional networking to generate high-quality leads and business connections.'
    }
  ];

  const features = [
    {
      icon: Target,
      title: 'Custom Campaign Development',
      description: 'Tailored social media campaigns designed to achieve your specific business objectives and target your ideal audience.'
    },
    {
      icon: Users,
      title: 'Audience Building',
      description: 'Strategic growth of your social media following with engaged, relevant followers who are likely to convert.'
    },
    {
      icon: TrendingUp,
      title: 'Brand Awareness',
      description: 'Increase your brand visibility and recognition across all major social media platforms.'
    },
    {
      icon: BarChart3,
      title: 'Lead Generation',
      description: 'Convert social media engagement into qualified leads and sales opportunities for your business.'
    },
    {
      icon: Zap,
      title: 'ROI Maximization',
      description: 'Optimize your social media investment to deliver maximum return on your marketing spend.'
    },
    {
      icon: MessageCircle,
      title: 'Community Engagement',
      description: 'Build meaningful relationships with your audience through authentic engagement and valuable content.'
    }
  ];

  const benefits = [
    'Increase brand awareness by up to 300%',
    'Generate high-quality leads and conversions',
    'Build engaged social media communities',
    'Improve brand recognition and loyalty',
    'Drive website traffic and sales',
    'Maximize ROI on marketing investments'
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Strategy Development',
      description: 'Create a comprehensive social media strategy based on your business goals and target audience.',
      duration: '1-2 days'
    },
    {
      step: 2,
      title: 'Content Creation',
      description: 'Develop engaging, platform-specific content that resonates with your audience and drives action.',
      duration: '1-2 weeks'
    },
    {
      step: 3,
      title: 'Campaign Launch',
      description: 'Execute targeted campaigns across selected platforms with optimized ad spend and targeting.',
      duration: '2-4 weeks'
    },
    {
      step: 4,
      title: 'Optimization & Growth',
      description: 'Monitor performance, optimize campaigns, and scale successful strategies for continued growth.',
      duration: 'Ongoing'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'SAPPHIRE OCEAN LLC',
      content: 'TechProcessing\'s social media marketing helped us build a strong online presence and generate 3x more leads than before!',
      rating: 5,
      results: '+300% Lead Generation'
    },
    {
      name: 'Michael Chen',
      company: 'Softowel Inc',
      content: 'The team\'s expertise in social media strategy and campaign management transformed our brand awareness. Highly recommended!',
      rating: 5,
      results: '+250% Brand Awareness'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
      {/* SEO Meta Tags */}
      <head>
        <title>Social Media Marketing Services | TechProcessing LLC</title>
        <meta name="description" content="Professional social media marketing services to build brand awareness, generate leads, and maximize ROI. Custom campaigns for Facebook, Instagram, LinkedIn, and more." />
        <meta name="keywords" content="social media marketing, Facebook marketing, Instagram marketing, LinkedIn marketing, social media strategy, brand awareness" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://techprocessingllc.com/services/social-media-marketing" />
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
                  <Users className="h-4 w-4 mr-2" />
                  Social Media Marketing
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="block">DEVELOP A</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
                  STRONG BRAND
                </span>
                <span className="block">USING SOCIAL CHANNELS</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl leading-relaxed">
                Our Social Media Marketing services are intended to increase your presence online, reach your target audience and an increase in results that matter in your business. We develop customized campaigns to attract brand awareness, lead generation, and ROI maximization on all the mainstream social networks.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a
                  href="#contact"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  <Users className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Get Free Strategy Session
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
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">300%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Brand Awareness</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">250%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Lead Generation</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">4+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Platforms</div>
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
                  <div className="text-emerald-400 text-sm font-mono">Social Media Dashboard</div>
                </div>
                
                <div className="h-32 bg-slate-800 rounded-lg mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-end justify-between px-4 pb-2">
                    {[50, 70, 60, 85, 75, 95, 80, 100].map((height, i) => (
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
                    <div className="text-2xl font-bold text-emerald-400">300%</div>
                    <div className="text-xs text-gray-400">Awareness</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-400">250%</div>
                    <div className="text-xs text-gray-400">Leads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">4+</div>
                    <div className="text-xs text-gray-400">Platforms</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
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
              Social Media Platforms We Master
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We develop customized campaigns to attract brand awareness, lead generation, and ROI maximization on all the mainstream social networks.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg mx-auto">
                  <platform.icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{platform.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{platform.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
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
              Our Social Media Marketing Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive social media solutions designed to build your brand and drive business results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
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
              Why Choose Our Social Media Marketing?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our social media marketing services can help you meet your objectives whether it is to create brand awareness, get leads, or more sales and are measurable to give you tangible growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                className="flex items-center p-6 bg-gray-50 dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700"
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
              Our Social Media Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              A proven methodology to build your social media presence and drive results
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
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 text-center relative">
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
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it—hear from businesses we've helped achieve social media success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-slate-700"
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
              Ready to Build Your Social Media Presence?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              You don't have to cede the discussion to your competitors. Join Tech Processing LLC and transform your social outlets into effective tools of audience engagement and expansion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <Users className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Get Free Social Media Audit
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
                Get Your Free Social Media Strategy
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Read through our blog and understand how we can wrap your brand on the Internet, and drop us a line today to get a free social media audit!
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
                    <Mail className="h-6 w-6 text-white" />
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
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Request Your Free Social Media Audit</h3>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Social Media Platforms</label>
                  <select className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white">
                    <option>Facebook</option>
                    <option>Instagram</option>
                    <option>LinkedIn</option>
                    <option>Twitter</option>
                    <option>Multiple Platforms</option>
                    <option>None Currently</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Goals</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Tell us about your social media goals..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  <Users className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Get Free Social Media Audit
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
