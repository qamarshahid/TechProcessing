import { motion } from 'framer-motion';
import { Sparkles, Palette, Image, CheckCircle, ArrowRight, Phone, Mail, MapPin, Star, Clock, Users, Target, Zap, Award, Brush, ArrowLeft, Camera, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';
import { appConfig } from '../../config/app.config';

export function GraphicDesignPage() {
  const features = [
    {
      icon: Sparkles,
      title: 'Logo Design & Branding',
      description: 'Create memorable logos and comprehensive brand identities that make a lasting impression on your audience.'
    },
    {
      icon: Palette,
      title: 'Visual Identity Design',
      description: 'Develop cohesive visual identities including color schemes, typography, and brand guidelines.'
    },
    {
      icon: Image,
      title: 'Marketing Materials',
      description: 'Design professional marketing materials including brochures, flyers, business cards, and promotional content.'
    },
    {
      icon: Camera,
      title: 'Digital Content Creation',
      description: 'Create engaging digital content for social media, websites, and online marketing campaigns.'
    },
    {
      icon: Brush,
      title: 'Print Design',
      description: 'Professional print design services for business cards, letterheads, packaging, and large format materials.'
    },
    {
      icon: PenTool,
      title: 'Custom Illustrations',
      description: 'Unique custom illustrations and graphics tailored to your brand and marketing needs.'
    }
  ];

  const benefits = [
    'Create memorable visual impressions that grab attention',
    'Communicate your brand message effectively',
    'Stand out from competitors with unique designs',
    'Build professional credibility and trust',
    'Increase brand recognition and recall',
    'Drive engagement and conversions'
  ];

  const processSteps = [
    {
      step: 1,
      title: 'Discovery & Strategy',
      description: 'Understand your brand, target audience, and design requirements through comprehensive consultation.',
      duration: '1-2 days'
    },
    {
      step: 2,
      title: 'Concept Development',
      description: 'Create initial design concepts and present multiple creative directions for your review.',
      duration: '3-5 days'
    },
    {
      step: 3,
      title: 'Design Refinement',
      description: 'Refine and perfect the chosen design based on your feedback and requirements.',
      duration: '2-3 days'
    },
    {
      step: 4,
      title: 'Final Delivery',
      description: 'Provide final design files in all required formats for immediate use across all platforms.',
      duration: '1 day'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'SAPPHIRE OCEAN LLC',
      content: 'TechProcessing\'s graphic design team created an amazing brand identity for us. Our new logo and marketing materials have significantly improved our professional image!',
      rating: 5,
      results: 'Brand Identity Complete'
    },
    {
      name: 'Michael Chen',
      company: 'Softowel Inc',
      content: 'The creative team delivered exceptional designs that perfectly captured our brand vision. The quality and attention to detail exceeded our expectations.',
      rating: 5,
      results: 'Exceeded Expectations'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-white">
      {/* SEO Meta Tags */}
      <head>
        <title>Graphic Design Services | TechProcessing LLC</title>
        <meta name="description" content="Professional graphic design services. Creative visual solutions that grab attention and communicate your brand message effectively with logos, branding, and marketing materials." />
        <meta name="keywords" content="graphic design, logo design, branding, visual identity, marketing materials, print design, digital design" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://techprocessingllc.com/services/graphic-design" />
      </head>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-4">
              <a href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`} className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
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
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-semibold">
                <Sparkles className="h-4 w-4 mr-2" />
                Graphic Design
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Creative Visual Solutions That Grab and Communicate
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Our Graphic Designing solutions create your ideas into life as interactive visuals perfect for your business. Logos and branding, marketing materials, and digital content both look creative and attract attention, which creates a memorable impression.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="#contact"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <Sparkles className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Get Free Design Consultation
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

            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">100%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Custom Design</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">5+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Revisions</div>
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">What We Do</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                Great design is more than just aesthetics - it's about creating visual solutions that communicate your message effectively and leave a lasting impression. Our graphic design services transform your ideas into compelling visual content that resonates with your audience.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                From logo design and brand identity to marketing materials and digital content, we create designs that not only look great but also drive results. Every design we create is tailored to your brand, target audience, and business objectives.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our creative team combines artistic vision with strategic thinking to deliver designs that grab attention, communicate clearly, and create memorable impressions that help your business stand out from the competition.
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Our Graphic Design Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start space-x-4 p-6 bg-gray-50 dark:bg-slate-800 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Why Choose Our Graphic Design Services?</h2>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                Professional graphic design is essential for building a strong brand presence and connecting with your audience. Here's what you can expect:
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
                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Our Design Process</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              A proven methodology for creating exceptional visual designs
            </p>
            
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  className="flex items-start space-x-6 p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700"
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
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                      <div className="inline-flex items-center px-3 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-medium">
                        <Clock className="h-4 w-4 mr-2" />
                        {step.duration}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-center">
              Don't just take our word for it—hear from businesses we've helped with exceptional design
            </p>

            <div className="space-y-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-slate-700"
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
                  <blockquote className="text-lg text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed text-center">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-gray-600 dark:text-gray-400">{testimonial.company}</div>
                    </div>
                    <div className="inline-flex items-center px-4 py-2 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 rounded-full text-sm font-semibold">
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
      <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Transform Your Visual Identity?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Let us create compelling visual designs that grab attention, communicate your message effectively, and create memorable impressions that help your business stand out.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <Sparkles className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Get Free Design Consultation
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
      <section id="contact" className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Get Your Free Design Consultation
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-center">
              Let us understand your design needs and create a custom solution that perfectly represents your brand.
            </p>

            <div className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Design Type</label>
                    <select className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white">
                      <option>Logo Design</option>
                      <option>Brand Identity</option>
                      <option>Marketing Materials</option>
                      <option>Website Design</option>
                      <option>Print Design</option>
                      <option>Multiple Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Type</label>
                    <select className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Design Requirements</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                    placeholder="Tell us about your design needs, style preferences, and project goals..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  <Sparkles className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                  Get Free Design Consultation
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