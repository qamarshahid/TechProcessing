import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageCircle, 
  HelpCircle, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  Users,
  Clock,
  Shield
} from 'lucide-react';
import { appConfig } from '../config/app.config';

const FAQ: React.FC = () => {
  useEffect(() => {
    document.title = 'Frequently Asked Questions - TechProcessing LLC';
    
    // SEO Meta Tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Get answers to common questions about TechProcessing LLC services, pricing, process, and support. Find everything you need to know about our digital marketing and web development solutions.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'FAQ, frequently asked questions, TechProcessing, digital marketing, web development, SEO, social media, pricing, support, process');
    }

    // Open Graph Meta Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Frequently Asked Questions - TechProcessing LLC');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Get answers to common questions about TechProcessing LLC services, pricing, process, and support.');
    }

    // Twitter Card Meta Tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', 'Frequently Asked Questions - TechProcessing LLC');
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'Get answers to common questions about TechProcessing LLC services, pricing, process, and support.');
    }

    // JSON-LD Structured Data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const faqs = [
    {
      question: 'What services does TechProcessing LLC offer?',
      answer: 'TechProcessing LLC provides comprehensive digital solutions including SEO services, Google My Business optimization, social media marketing and management, LLC formation services, graphic design, local search optimization, and Google Ads management. We also offer web development and custom software solutions for businesses of all sizes.'
    },
    {
      question: 'How do I get started with TechProcessing LLC?',
      answer: 'Getting started is easy! Simply visit our website, fill out our contact form, or call us directly. We offer a free consultation where we discuss your business goals and provide customized solutions that fit your needs and budget. No lengthy research required - we handle everything for you.'
    },
    {
      question: 'Do you work with small businesses and startups?',
      answer: 'Absolutely! We specialize in working with startups, small businesses, and large enterprises. Our flexible packages and pricing are designed to accommodate businesses at every stage of growth. We believe every business deserves professional digital marketing services.'
    },
    {
      question: 'How long does it take to see results from SEO services?',
      answer: 'SEO is a long-term strategy, and results typically start showing within 3-6 months. However, some improvements like technical SEO fixes and local search optimization can show results within 4-8 weeks. We provide monthly reports to track progress and keep you informed of all improvements.'
    },
    {
      question: 'What is included in your social media management packages?',
      answer: 'Our social media management includes content creation, posting schedules, community management, engagement monitoring, performance analytics, and monthly strategy reviews. We manage all major platforms including Facebook, Instagram, LinkedIn, Twitter, and TikTok based on your target audience.'
    },
    {
      question: 'How much do your services cost?',
      answer: 'Our pricing varies based on the scope and scale of your project. We offer flexible packages starting from basic plans for small businesses to comprehensive enterprise solutions. Contact us for a personalized quote that fits your budget and business goals.'
    },
    {
      question: 'Do you provide ongoing support and maintenance?',
      answer: 'Yes! We provide comprehensive after-sales support including website maintenance, regular updates, performance monitoring, and ongoing optimization. Our support team is available to help with any questions or issues that may arise.'
    },
    {
      question: 'Can you help with both paid and organic marketing?',
      answer: 'Absolutely! We offer a complete digital marketing suite including both organic strategies (SEO, content marketing, social media) and paid advertising (Google Ads, Facebook Ads, LinkedIn Ads). We can create integrated campaigns that maximize your ROI across all channels.'
    },
    {
      question: 'How do you ensure project quality?',
      answer: 'We maintain strict quality control through our transparent processes, use of latest technologies, and experienced team of professionals. Every project goes through multiple review stages, and we provide regular updates and detailed reports to ensure you\'re satisfied with the results.'
    },
    {
      question: 'What makes TechProcessing LLC different from other agencies?',
      answer: 'We are an in-house team that focuses on ROI-driven strategies, transparent reporting, and client-oriented service. Unlike many agencies, we provide honest assessments, realistic timelines, and personalized attention to each client. Our success is measured by your success.'
    },
    {
      question: 'Do you offer Google My Business optimization?',
      answer: 'Yes! Our Google My Business optimization services include profile setup and optimization, review management, local SEO, posting regular updates, managing photos and videos, and monitoring performance metrics. This helps improve your local search visibility and attract more customers.'
    },
    {
      question: 'Can you help with LLC formation?',
      answer: 'Absolutely! We provide complete LLC formation services including business name availability check, filing with the state, obtaining necessary permits and licenses, and ongoing compliance support. We make the process simple and stress-free so you can focus on growing your business.'
    },
    {
      question: 'How often will I receive updates on my project?',
      answer: 'We provide regular updates through multiple channels. You\'ll receive weekly progress reports, monthly strategy reviews, and have access to your dedicated project manager. We also use project management tools where you can track progress in real-time.'
    },
    {
      question: 'Do you work with businesses outside the United States?',
      answer: 'While we primarily serve US-based businesses, we do work with international clients for digital marketing services. However, our LLC formation services are specifically for US businesses. Contact us to discuss your specific needs and location.'
    },
    {
      question: 'What if I\'m not satisfied with the results?',
      answer: 'Your satisfaction is our priority. We work closely with you throughout the project to ensure expectations are met. If you\'re not satisfied, we\'ll work with you to make adjustments and improvements. We offer revision rounds and are committed to delivering results that exceed your expectations.'
    },
    {
      question: 'How do I contact TechProcessing LLC for support?',
      answer: 'You can reach us through multiple channels: call us directly, email us, use our contact form on the website, or schedule a consultation. Our support team is available during business hours and responds to inquiries within 24 hours. We\'re here to help with any questions or concerns.'
    },
    {
      question: 'Do you provide custom web development services?',
      answer: 'Yes! We offer custom web development services including responsive websites, e-commerce platforms, web applications, and mobile-responsive designs. Our development team uses the latest technologies and follows best practices to create fast, secure, and user-friendly websites.'
    },
    {
      question: 'What is your typical project timeline?',
      answer: 'Project timelines vary based on scope and complexity. SEO campaigns typically run 6-12 months, website development takes 4-12 weeks, and social media management is ongoing. We provide detailed timelines during the consultation phase and keep you updated on progress throughout the project.'
    },
    {
      question: 'Do you offer graphic design services?',
      answer: 'Yes! Our graphic design services include logo design, branding packages, marketing materials, social media graphics, website graphics, and print materials. We create visually appealing designs that align with your brand identity and marketing goals.'
    },
    {
      question: 'Can you help improve my local search rankings?',
      answer: 'Absolutely! Our local search optimization services include Google My Business optimization, local citation building, review management, local content creation, and local link building. We help businesses rank higher in local search results and attract more customers in their area.'
    }
  ];

  const features = [
    {
      icon: CheckCircle,
      title: 'Expert Team',
      description: 'Professional developers and marketers with years of experience'
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Quick turnaround times without compromising quality'
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Rigorous testing and quality control processes'
    },
    {
      icon: Users,
      title: 'Client Support',
      description: 'Dedicated support team available when you need help'
    }
  ];

  return (
    <div className="min-h-screen bg-bg1 text-fg">
      {/* Navigation Header */}
      <nav className="bg-bg2/95 backdrop-blur-xl shadow-sm border-b border-outline/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-accent2 hover:text-accent3 transition-colors touch-manipulation">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-semibold text-sm sm:text-base">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <a href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`} className="text-muted hover:text-accent2 transition-colors p-2 touch-manipulation">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#contact" className="bg-accent1 hover:bg-accent1 text-fg px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base touch-manipulation">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 bg-emerald-900/20 text-accent3 rounded-full text-sm font-semibold">
                <HelpCircle className="h-4 w-4 mr-2" />
                Support Center
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-fg mb-6">
              Frequently Asked Questions
            </h1>
            
            <p className="text-lg sm:text-xl text-muted mb-8 max-w-3xl mx-auto leading-relaxed">
              Get answers to common questions about our services, process, and support. Can't find what you're looking for? Contact us directly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <a
                href="#contact"
                className="bg-gradient-to-r from-accent1 to-accent600 hover:from-emerald-600 hover:to-accent700 text-fg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                Contact Support
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

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-bg2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-fg mb-4">Why Choose TechProcessing?</h2>
            <p className="text-muted max-w-2xl mx-auto">
              We're committed to providing exceptional service and support to all our clients
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-accent1 to-accent600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <feature.icon className="h-8 w-8 text-fg" />
                </div>
                <h3 className="text-lg font-semibold text-fg mb-2">{feature.title}</h3>
                <p className="text-muted text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-fg mb-6">
              Common Questions
            </h2>
            <p className="text-lg sm:text-xl text-muted">
              Find answers to the most frequently asked questions about our services
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-surface rounded-xl p-6 sm:p-8 border border-outline hover:border-emerald-500/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg sm:text-xl font-bold text-fg mb-4 flex items-start">
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-accent2 mr-3 mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-muted leading-relaxed ml-8">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-gradient-to-br from-emerald-900/20 to-accent900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-fg mb-6">
              Still Have Questions?
            </h2>
            <p className="text-lg sm:text-xl text-muted mb-8">
              Our team is here to help. Get in touch with us for personalized assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`}
                className="bg-gradient-to-r from-accent1 to-accent600 hover:from-emerald-600 hover:to-accent700 text-fg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                Call Us Now
              </a>
              
              <a
                href={`mailto:${appConfig.contact.email}`}
                className="border-2 border-accent1 text-accent2 hover:bg-accent1 hover:text-fg px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Email Us
              </a>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent1 to-accent600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-fg" />
                </div>
                <div className="font-semibold text-fg mb-2">Call Us</div>
                <a href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`} className="text-accent2 hover:underline">
                  {appConfig.contact.phone}
                </a>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent1 to-accent600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-fg" />
                </div>
                <div className="font-semibold text-fg mb-2">Email Us</div>
                <a href={`mailto:${appConfig.contact.email}`} className="text-accent2 hover:underline">
                  {appConfig.contact.email}
                </a>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent1 to-accent600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-fg" />
                </div>
                <div className="font-semibold text-fg mb-2">Visit Us</div>
                <div className="text-muted text-sm">
                  {appConfig.contact.address}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
