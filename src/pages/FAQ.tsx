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
      question: 'What do TechProcessing provide?',
      answer: 'TechProcessing is a digital marketing, web development, SEO, social media management and custom software solution provider to all types of businesses.'
    },
    {
      question: 'So, what to start with TechProcessing?',
      answer: 'No need to do lots of research, just visit us through our site or schedule a free strategy session. We will be talking to your business about your desires and giving the best available solutions.'
    },
    {
      question: 'Would TechProcessing be appropriate to small enterprises and startups?',
      answer: 'Yes! We are innovative to work with startups, small businesses, and big enterprises; we can provide you with a solution that fits your needs and budget, depending on them.'
    },
    {
      question: 'What steps does TechProcessing take in order to assure project quality?',
      answer: 'Our procedure is open and transparent, we employ the latest technologies and provide an exceptional team of professionals who check each project in terms of quality and performance.'
    },
    {
      question: 'Will I have access to the rating of the progress of my project?',
      answer: 'Absolutely. We maintain frequent updates and deliver elaborate reports and even communicate with your project manager to keep you in touch with what is going on.'
    },
    {
      question: 'Is there after-sales service and maintenance by TechProcessing?',
      answer: 'Indeed, we also provide follow up services and maintenance of the websites and maintenance of your online marketing.'
    },
    {
      question: 'Why is TechProcessing not another agency?',
      answer: 'We are a team working in-house, we are honest in our reporting, our merchandising strategies are ROI-driven and we are client-oriented.'
    },
    {
      question: 'What are the charges of your services?',
      answer: 'The cost is pegged on the size and scale of your project. Get in touch with us to get a personalised quote or learn about our flexible packages.'
    },
    {
      question: 'Is it possible to use TechProcessing to help in paid and organic marketing?',
      answer: 'Yes! We provide a full package of digital marketing services, with the involvement of SEO, content marketing, social media management, and paid advertising campaigns.'
    },
    {
      question: 'What is the way to contact TechProcessing in case of support or questions?',
      answer: 'You can also contact us with the help of the contact form at our site, email, or call. We are also available to answer your questions or require any help.'
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
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation Header */}
      <nav className="bg-slate-900/95 backdrop-blur-xl shadow-sm border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors touch-manipulation">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-semibold text-sm sm:text-base">Back to Home</span>
            </Link>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <a href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`} className="text-gray-300 hover:text-emerald-400 transition-colors p-2 touch-manipulation">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              </a>
              <a href="#contact" className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base touch-manipulation">
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
              <span className="inline-flex items-center px-4 py-2 bg-emerald-900/20 text-emerald-300 rounded-full text-sm font-semibold">
                <HelpCircle className="h-4 w-4 mr-2" />
                Support Center
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get answers to common questions about our services, process, and support. Can't find what you're looking for? Contact us directly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12">
              <a
                href="#contact"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                Contact Support
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

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Why Choose TechProcessing?</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
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
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Common Questions
            </h2>
            <p className="text-lg sm:text-xl text-gray-300">
              Find answers to the most frequently asked questions about our services
            </p>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-slate-800 rounded-xl p-6 sm:p-8 border border-slate-700 hover:border-emerald-500/50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-start">
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-300 leading-relaxed ml-8">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-gradient-to-br from-emerald-900/20 to-teal-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Still Have Questions?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-8">
              Our team is here to help. Get in touch with us for personalized assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:animate-pulse" />
                Call Us Now
              </a>
              
              <a
                href={`mailto:${appConfig.contact.email}`}
                className="border-2 border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 flex items-center justify-center"
              >
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Email Us
              </a>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="font-semibold text-white mb-2">Call Us</div>
                <a href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`} className="text-emerald-400 hover:underline">
                  {appConfig.contact.phone}
                </a>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div className="font-semibold text-white mb-2">Email Us</div>
                <a href={`mailto:${appConfig.contact.email}`} className="text-emerald-400 hover:underline">
                  {appConfig.contact.email}
                </a>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="font-semibold text-white mb-2">Visit Us</div>
                <div className="text-gray-300 text-sm">
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
