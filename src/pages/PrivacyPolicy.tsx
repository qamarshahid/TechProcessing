import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Eye, 
  Users,
  Phone, 
  Mail, 
  MapPin,
  Clock
} from 'lucide-react';
import { appConfig } from '../config/app.config';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy - TechProcessing LLC';
    
    // SEO Meta Tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'TechProcessing LLC Privacy Policy - Learn how we collect, use, and protect your personal information. Your privacy is our priority.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'privacy policy, TechProcessing, data protection, personal information, privacy rights, data security, GDPR compliance');
    }

    // Open Graph Meta Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Privacy Policy - TechProcessing LLC');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'TechProcessing LLC Privacy Policy - Learn how we collect, use, and protect your personal information.');
    }

    // Twitter Card Meta Tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', 'Privacy Policy - TechProcessing LLC');
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'TechProcessing LLC Privacy Policy - Learn how we collect, use, and protect your personal information.');
    }

    // JSON-LD Structured Data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Privacy Policy - TechProcessing LLC",
      "description": "TechProcessing LLC Privacy Policy - Learn how we collect, use, and protect your personal information.",
      "url": "https://www.techprocessingllc.com/privacy-policy",
      "publisher": {
        "@type": "Organization",
        "name": "TechProcessing LLC",
        "url": "https://www.techprocessingllc.com"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const privacyFeatures = [
    {
      icon: Shield,
      title: 'Data Protection',
      description: 'Advanced security measures to protect your personal information'
    },
    {
      icon: Lock,
      title: 'Secure Storage',
      description: 'Your data is stored using industry-standard encryption'
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Clear policies on how we collect and use your information'
    },
    {
      icon: Users,
      title: 'User Control',
      description: 'You have full control over your personal data and preferences'
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
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent1/10 via-transparent to-blue-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent1/20 rounded-2xl mb-6">
              <Shield className="h-8 w-8 text-accent2" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-fg mb-6">
              Privacy <span className="text-accent2">Policy</span>
            </h1>
            <p className="text-xl text-muted max-w-3xl mx-auto mb-8">
              Your privacy is our priority. Learn how TechProcessing LLC collects, uses, and protects your personal information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center text-muted">
                <Clock className="h-4 w-4 mr-2 text-accent2" />
                <span className="text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-bg2/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {privacyFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent1/20 rounded-xl mb-4 group-hover:bg-accent1/30 transition-colors">
                  <feature.icon className="h-6 w-6 text-accent2" />
                </div>
                <h3 className="text-lg font-semibold text-fg mb-2">{feature.title}</h3>
                <p className="text-muted text-sm">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <h2 className="text-3xl font-bold text-fg mb-8">Privacy Policy</h2>
              
              <p className="text-muted text-lg leading-relaxed mb-8">
                Tech Processing LLC is glad to have you here. At Tech Processing, we also commit ourselves to delivering innovative creative designs, digital marketing and technical solutions that will assist your company to succeed in the digital world. We value your privacy and are very serious about making sure you know how/why/what we do with your information as you use our Services provided through our online meeting and collaboration platforms (the Services).
              </p>

              <p className="text-muted text-lg leading-relaxed mb-8">
                Having decided to use Tech Processing, you agree to pass your information to us, and we are determined to keep this trust avoiding any violations of your privacy on the way. To know how Tech Processing uses your information, read through this Privacy Policy. In case you disagree with any terms of this Privacy Policy, please avoid using our Services.
              </p>

              <h2 className="text-2xl font-bold text-fg mt-12 mb-6">What Information Tech Processing Retrieves</h2>
              <p className="text-muted text-lg leading-relaxed mb-6">
                The information used at Tech Processing is gathered to offer quality services to all our clients and users. The following is what we gather:
              </p>

              <h3 className="text-xl font-semibold text-accent2 mt-8 mb-4">Personal Information:</h3>
              <p className="text-muted text-lg leading-relaxed mb-6">
                On occurrence of Tech Processing Services, personal information that we may gather is correspondence name, post, telephone, company name, and other information of your choice. This details assists Tech Processing in offering customized creative design, Internet marketing, and technical Ways and Means to you.
              </p>

              <h3 className="text-xl font-semibold text-accent2 mt-8 mb-4">Communication Information:</h3>
              <p className="text-muted text-lg leading-relaxed mb-6">
                Tech Processing can contact you to provide information on updates, news, promotions, and other relevant services of our Services using your contact information. We are transparent and will never interfere with the privacy practices you have.
              </p>

              <h3 className="text-xl font-semibold text-accent2 mt-8 mb-4">SMS and Mobile Communications:</h3>
              <p className="text-muted text-lg leading-relaxed mb-4">
                When you provide your mobile phone number to Tech Processing and opt-in to receive SMS communications, you expressly consent to receive text messages from us regarding appointment reminders, service updates, notifications, and other business-related communications. We obtain your explicit consent before sending any SMS messages to your mobile device.
              </p>
              <p className="text-muted text-lg leading-relaxed mb-4">
                <strong className="text-fg">Important Privacy Guarantee:</strong> Tech Processing will NOT share, sell, rent, or otherwise disclose your mobile phone number or any mobile opt-in data to any third parties or affiliates for marketing or any other purposes. Your mobile opt-in information remains strictly confidential and is used solely by Tech Processing to communicate with you directly.
              </p>
              <p className="text-muted text-lg leading-relaxed mb-6">
                You may opt-out of receiving SMS messages at any time by replying "STOP" to any text message you receive from us, or by contacting us directly at support@techprocessingllc.com. Message and data rates may apply based on your mobile carrier's plan. We comply with all applicable SMS carrier policies and regulations, including TCPA (Telephone Consumer Protection Act) requirements.
              </p>

              <h3 className="text-xl font-semibold text-accent2 mt-8 mb-4">Usage Data and Analytics:</h3>
              <p className="text-muted text-lg leading-relaxed mb-6">
                Tech Processing is an SDK that has third-party analytical tools to understand the user behavior and pattern. This assists us in enhancing our creative design, electronic marketing, and technological solutions so as to ensure that Tech Processing offers to you the best digital experiences that your brand can offer.
              </p>

              <h3 className="text-xl font-semibold text-accent2 mt-8 mb-4">Technical Information:</h3>
              <p className="text-muted text-lg leading-relaxed mb-6">
                Technical data may be obtained by the time you have to communicate with Tech Processing, which includes: your IP address, the type of browser, information related to a device, and operating system. This data assists Tech Processing to perfect our Services and improve your privacy and security.
              </p>

              <h2 className="text-2xl font-bold text-fg mt-12 mb-6">How Tech Processing Uses Your Information</h2>
              <p className="text-muted text-lg leading-relaxed mb-6">
                Tech Processing needs your information to:
              </p>
              <ul className="text-muted text-lg leading-relaxed mb-6 space-y-2">
                <li>• Provide, sustain and enhance our innovative design, electronic promotion, and techie products.</li>
                <li>• Tailor your experience at Tech Processing and bring interesting content to you.</li>
                <li>• Send promotional messages to you about your account, our Services and new information you need to know.</li>
                <li>• Observe the trends and user behavior in order to improve the efficiency of Tech Processing brand-building solutions.</li>
                <li>• Maintain security and privacy of your information using Tech Processing Services.</li>
              </ul>

              <h2 className="text-2xl font-bold text-fg mt-12 mb-6">Tech Processing Information Sharing</h2>
              <p className="text-muted text-lg leading-relaxed mb-6">
                Tech Processing cares about your confidentiality and exchange your data only under the following conditions:
              </p>

              <div className="bg-accent1/20 border border-accent1/30 rounded-lg p-6 mb-8">
                <p className="text-accent2 font-semibold text-lg mb-2">⚠️ Mobile Opt-In Data Protection:</p>
                <p className="text-muted">
                  We want to make it absolutely clear: <strong className="text-fg">Your mobile phone number and any mobile opt-in data will NEVER be shared, sold, rented, or disclosed to any third parties or affiliates under any circumstances.</strong> This information is kept strictly confidential and used only by Tech Processing to communicate with you directly about our services.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-accent2 mt-8 mb-4">Service Providers:</h3>
              <p className="text-muted text-lg leading-relaxed mb-4">
                Tech Processing is likely to provide your personal data to trusted third party service providers who have been engaged by us to help us run our Services, run our business, or serve you. Those suppliers are bound to your privacy and they can use your data the only way they are contracted to utilise it on the instructions of Tech Processing.
              </p>
              <p className="text-muted text-lg leading-relaxed mb-6">
                <strong className="text-fg">Important Exception:</strong> Your mobile phone number and mobile opt-in data are specifically excluded from any data sharing with service providers, third parties, or affiliates. This information remains confidential within Tech Processing only.
              </p>

              <h3 className="text-xl font-semibold text-accent2 mt-8 mb-4">Legal Compliance:</h3>
              <p className="text-muted text-lg leading-relaxed mb-6">
                Tech Processing can share your information with legal requests, subpoenas or court orders or in order to comply with the required laws and regulations. We shall strive to respect your privacy and at the same time honor our legal requirements.
              </p>

              <h3 className="text-xl font-semibold text-accent2 mt-8 mb-4">Business Transfers:</h3>
              <p className="text-muted text-lg leading-relaxed mb-6">
                In the event of a merger, acquisition or sale of assets by Tech Processing and liabilities, your information may be transferred in such a transaction. We will inform you and make sure that your privacy will be guaranteed.
              </p>

              <h2 className="text-2xl font-bold text-fg mt-12 mb-6">Tech Processing Data Security</h2>
              <p className="text-muted text-lg leading-relaxed mb-6">
                Tech Processing regards its privacy and data security as a top priority. We use sensible physical, technical and administrational controls to safeguard the integrity and security of your personal information. But please note that there are no data or Internet transfer systems that are more secure over the Internet or any electronic storage. Although Tech Processing does everything possible to ensure that commercially acceptable ways are used to keep your privacy, we do not promise that we will be able to achieve total security.
              </p>

              <h2 className="text-2xl font-bold text-fg mt-12 mb-6">Tech Processing Privacy of Children</h2>
              <p className="text-muted text-lg leading-relaxed mb-6">
                These Tech Processing Services are not meant to be used by children of age below 13. We are unaware of collecting personal information of children below 13 years of age. Should you feel that Tech Processing has obtained information about a child aged under 13, then do contact us at once and we will take action to have such information deleted and to preserve the privacy of the child.
              </p>

              <h2 className="text-2xl font-bold text-fg mt-12 mb-6">Your Privacy Preferences with Tech Processing</h2>
              <p className="text-muted text-lg leading-relaxed mb-6">
                We value your privacy decisions at Tech Processing. You can:
              </p>
              <ul className="text-muted text-lg leading-relaxed mb-6 space-y-2">
                <li>• To unsubscribe at any time to receipt of promotional communications, please follow directions in our emails.</li>
                <li>• Ask Tech Processing to give you access to, correct or delete any personal information that it holds about you.</li>
                <li>• To reach Contact Tech Processing with any questions or concerns regarding your privacy or in relation to this Privacy Policy.</li>
              </ul>

              <h2 className="text-2xl font-bold text-fg mt-12 mb-6">Cookies and Monitoring Services</h2>
              <p className="text-muted text-lg leading-relaxed mb-6">
                Tech Processing and our partners (including third party service providers), uses cookies or similar technologies to store information about user preferences, trends, and web viewing activity on the site, as well as to deliver personalized content. The use of cookies can be governed by the setting of your browser. When using Tech Processing Services, you agree that we may use cookies as explained in this Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold text-fg mt-12 mb-6">International Data Transfers</h2>
              <p className="text-muted text-lg leading-relaxed mb-6">
                Tech Processing can process and store your information in other countries than your own. We also do whatever is necessary to make sure your privacy is afforded to you in compliance with this Privacy Policy no matter where your data is contained.
              </p>

              <h2 className="text-2xl font-bold text-fg mt-12 mb-6">Variations in This Privacy Policy</h2>
              <p className="text-muted text-lg leading-relaxed mb-6">
                Tech Processing also holds the right to revise or change this Privacy Policy at any time without any background information. We shall notify you of the changes by updating the Privacy Policy published on our site. By the fact that you use Tech Processing Services after the changes have been introduced, you agree to the amended Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold text-fg mt-12 mb-6">Reasons to Choose Tech Processing</h2>
              <p className="text-muted text-lg leading-relaxed mb-6">
                Tech Processing LLC is not only a digital creative agency. We are your collaborators in innovative design, online marketing and technological solutions. Our brand-building services will help your company grow online with a different strategy and successful digital experiences. As a company, we are client-focused and believe in having to offer secure, innovative and personalized services at Tech Processing.
              </p>

              <p className="text-muted text-lg leading-relaxed mb-8">
                Be part of Tech Processing, and you are able to put your business to the next level. Be a part of the difference and feel it in the way we creatively design and digitally market our solutions and take you confidently through the processes of ensuring your privacy in every little step.
              </p>

              <h2 className="text-2xl font-bold text-fg mt-12 mb-6">Get in Touch with Tech Processing</h2>
              <p className="text-muted text-lg leading-relaxed mb-6">
                Should you want to know more about this Privacy Policy or our data protection practices, please contact Tech Processing:
              </p>
              
              <div className="bg-accent1/20 border border-accent1/30 rounded-lg p-6 mb-8">
                <p className="text-accent2 font-semibold text-lg mb-2">Contact Information:</p>
                <p className="text-muted">
                  Email: <a href="mailto:support@techprocessingllc.com" className="text-accent2 hover:text-accent3 transition-colors">support@techprocessingllc.com</a>
                </p>
              </div>

              <p className="text-muted text-lg leading-relaxed mb-8">
                We thank you and your decision to use our Tech Processing. We will do everything possible to ensure your privacy and ensure you a good experience, risk-free and innovative experience.
              </p>

              <p className="text-muted text-lg leading-relaxed">
                Tech Processing is a creative and digital marketing as well as technical solutions provider. Your privacy is our concern, make Tech Processing your choice and have a unique digital experience.
              </p>

          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-bg2/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-fg mb-8">Questions About Our Privacy Policy?</h2>
            <p className="text-xl text-muted mb-12 max-w-3xl mx-auto">
              If you have any questions or concerns about this Privacy Policy or our data protection practices, please don't hesitate to contact us.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-surface/50 rounded-2xl p-6 border border-outline/50">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent1/20 rounded-xl mb-4">
                  <Phone className="h-6 w-6 text-accent2" />
                </div>
                <h3 className="text-lg font-semibold text-fg mb-2">Call Us</h3>
                <a href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`} className="text-accent2 hover:text-accent3 transition-colors">
                  {appConfig.contact.phone}
                </a>
              </div>
              
              <div className="bg-surface/50 rounded-2xl p-6 border border-outline/50">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent1/20 rounded-xl mb-4">
                  <Mail className="h-6 w-6 text-accent2" />
                </div>
                <h3 className="text-lg font-semibold text-fg mb-2">Email Us</h3>
                <a href={`mailto:${appConfig.contact.email}`} className="text-accent2 hover:text-accent3 transition-colors">
                  {appConfig.contact.email}
                </a>
              </div>
              
              <div className="bg-surface/50 rounded-2xl p-6 border border-outline/50">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent1/20 rounded-xl mb-4">
                  <MapPin className="h-6 w-6 text-accent2" />
                </div>
                <h3 className="text-lg font-semibold text-fg mb-2">Visit Us</h3>
                <p className="text-muted text-sm">{appConfig.contact.address}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg1 border-t border-outline/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-accent1 via-accent2 to-accent1 rounded-xl flex items-center justify-center shadow-lg">
                <div className="text-fg font-black text-lg">TP</div>
              </div>
              <div className="font-black text-xl">
                <span className="tracking-wider">TECHPROCESSING</span>
                <div className="text-xs text-accent2 font-bold tracking-[0.2em]">LLC</div>
              </div>
            </div>
            <div className="text-muted text-sm">
              © 2024 TechProcessing LLC. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
