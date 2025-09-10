import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Shield, 
  Users,
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  Clock,
  AlertTriangle,
  Scale,
  Lock
} from 'lucide-react';
import { appConfig } from '../config/app.config';

const TermsConditions: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms & Conditions - TechProcessing LLC';
    
    // SEO Meta Tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'TechProcessing LLC Terms & Conditions - Legal agreement for our digital solutions, web development, and IT consulting services.');
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', 'terms and conditions, TechProcessing, legal agreement, digital solutions, web development, IT consulting, service terms');
    }

    // Open Graph Meta Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Terms & Conditions - TechProcessing LLC');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'TechProcessing LLC Terms & Conditions - Legal agreement for our digital solutions and services.');
    }

    // Twitter Card Meta Tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', 'Terms & Conditions - TechProcessing LLC');
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', 'TechProcessing LLC Terms & Conditions - Legal agreement for our digital solutions and services.');
    }

    // JSON-LD Structured Data
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Terms & Conditions - TechProcessing LLC",
      "description": "TechProcessing LLC Terms & Conditions - Legal agreement for our digital solutions and services.",
      "url": "https://www.techprocessingllc.com/terms-conditions",
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

  const termsFeatures = [
    {
      icon: FileText,
      title: 'Legal Agreement',
      description: 'Clear terms governing our digital solutions and services'
    },
    {
      icon: Shield,
      title: 'Service Protection',
      description: 'Comprehensive protection for both parties in our agreement'
    },
    {
      icon: Users,
      title: 'Customer Rights',
      description: 'Your rights and obligations clearly defined'
    },
    {
      icon: Scale,
      title: 'Fair Terms',
      description: 'Balanced terms that protect all parties involved'
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
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600/20 rounded-2xl mb-6">
              <FileText className="h-8 w-8 text-emerald-400" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Terms & <span className="text-emerald-400">Conditions</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Legal agreement governing our digital solutions, web development, and IT consulting services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center text-gray-300">
                <Clock className="h-4 w-4 mr-2 text-emerald-400" />
                <span className="text-sm">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {termsFeatures.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600/20 rounded-xl mb-4 group-hover:bg-emerald-600/30 transition-colors">
                  <feature.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Terms & Conditions Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-8">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Important Information</h3>
                  <p className="text-gray-300">
                    The availability of your devices, hardware, data network and internet provider is a prerequisite to continuous use of our services. Any constriction of these would curtail the quality of our services.
                  </p>
                  <p className="text-gray-300 mt-2">
                    In case you start the sign-up process and fail to complete it, we reserve the right to contact you in order to help you through completing your sign up process. You give us the permission to get in touch with you in such a situation.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-8">Terms & Conditions</h2>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Tech Processing LLC is an organization that offers digital solutions (among other programs) which can be operated by the Customer, and to which businesses and individuals can have access including, but not limited to, web development, digital marketing, SEO, and the IT consulting business.
            </p>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              We have registered an office at {appConfig.contact.address}.
            </p>

            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              These Terms and Conditions, along with our Privacy Policy form the entire legal agreement between you (the "Customer", "you", "your") and Tech Processing LLC. Using our services or accessing our services renders you to be bound by these terms. In case you disagree, then do not patronise our services.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">1. General Definitions</h3>
            <ul className="text-gray-300 text-lg leading-relaxed mb-8 space-y-2">
              <li><strong className="text-emerald-400">Agreement:</strong> The document between you and the Tech Processing LLC.</li>
              <li><strong className="text-emerald-400">Application:</strong> All our websites, any administration tools as well as software offered by us or our partners.</li>
              <li><strong className="text-emerald-400">Business Day:</strong> Day not including Saturday, Sunday or public holidays.</li>
              <li><strong className="text-emerald-400">Customer Information:</strong> All data or contents you give or utilize in our services.</li>
              <li><strong className="text-emerald-400">Intellectual Property Rights:</strong> All patents, trademarks, copyrights, designs, databases, know how and confidential information.</li>
              <li><strong className="text-emerald-400">Personal Data:</strong> According to the detailed data protection legislation.</li>
              <li><strong className="text-emerald-400">Service Fee:</strong> Any amount which we charge any person in connection with our services.</li>
              <li><strong className="text-emerald-400">Software:</strong> Any software that we use or which we have used on our behalf.</li>
              <li><strong className="text-emerald-400">Users:</strong> All users of your business that have a permission to utilize our services.</li>
            </ul>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">2. Our Obligations</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              You agree that we will supply the Service in exchange for your prompt performance of the duties listed in this Agreement. By accessing the Service the User is always bound by these Terms & Conditions. These terms or charges are subject to alteration by us at any time, with reasonable notice.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              We license to you on a non exclusive, non transferable basis to use the Service under the terms of the license agreement. Assistance is provided through our help-desk and internet knowledgebase.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">3. Customer Obligations</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              You are only allowed to use the Service in a legal manner before all the required laws. You undertake not to:
            </p>
            <ul className="text-gray-300 text-lg leading-relaxed mb-6 space-y-2">
              <li>• Send to or receive unacceptable or illegal materials using the Service.</li>
              <li>• Make a man-made increase in traffic or abuse the Service.</li>
              <li>• Exploit, sell or offer goods/services which contravene laws or codes of practice.</li>
              <li>• False impersonation of third parties or other people.</li>
              <li>• Abuse the Service in any way by usage that is excessive, automated or unreasonable.</li>
              <li>• Assign or grant rights to third parties in the Service.</li>
              <li>• Make unsolicited telemarketing use of the Service.</li>
            </ul>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              You bear the responsibility to ensure all Customer Information is correct and legal. You need to update your account details and be sure you have all the necessary rights and authority to conclude this Agreement. Failure to comply with any of the requirements of this section can lead to your immediate account and Service suspension or termination.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">4. Warranties</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Unless and to the extent required by law we make no express or implied warranties whatsoever, and we specifically disclaim warranties of merchantability and fitness or a particular purpose. We make no guarantee of the Service being error or virus-free, of compatibility with other equipment and software.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">5. Service Specific Conditions</h3>
            <ul className="text-gray-300 text-lg leading-relaxed mb-8 space-y-2">
              <li><strong className="text-emerald-400">Number Assignment:</strong> Numbers are assigned randomly or assigned to use with the Service.</li>
              <li><strong className="text-emerald-400">Number Usage:</strong> We will reclaim your number in case you stop using it within a 3 month period (free plan) or you stop paying your subscription fee (paid plan).</li>
              <li><strong className="text-emerald-400">Call and Voicemail Recording:</strong> Recordings will be stored according to your commands and destroyed after the required term.</li>
              <li><strong className="text-emerald-400">Support:</strong> Supports are offered through our help-desk or support email.</li>
              <li><strong className="text-emerald-400">Service Communications:</strong> We can email you with the updates and marketing communications and you can opt out anytime.</li>
            </ul>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">6. Charges</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              You will pay the Service Fee as indicated in the Application. There are possibilities of a change in prices and you will be informed, as much as possible. No VAT or any other taxes are included in our charges. The invoices may be played by e-mail, and they can be paid only in the ways that you have registered. Non-payment can lead to halting or cancellation of your account.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              The Service does not provide any refunds. Free trials or billing periods may be abused to evade payment and this may lead to cancellation.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">7. Service Provision</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              The service levels and plans are as stipulated in our web site. We can provide free trials or promotional services that have limited nature. In case you fail to upgrade following a free trial, your account will be deactivated or blocked.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">8. Security</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Do not even strive to bypass system security or look at source code. Security information and the passwords must remain a secret. Warn us at once in case of suspected unauthorized use. We can also block access in case we consider that there is a security threat.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">9. Agreement and Release</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              You can also end this Agreement by deleting your account or sending an email. When you leave, your number (s) will be cancelled and any remaining balance billed. We can avoid the Agreement without any warning in case you will break any of its aspects or go bankrupt.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">10. Liability Limitation</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Liability under this Agreement with respect to death, personal injury or fraud is not excluded. We do not have any liability to indirect, incidental, or consequential loss such as a loss of profits or business. We have limited liability according to this Agreement.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">11. Intellectual Property Rights</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              You reserve all the intellectual rights in Customer Information. We keep all rights about the Service, Software, and their materials. You license us to also use your intellectual property to deliver the Service.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">12. Third Party Dealings</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              The Service has nothing to do with any transactions, whatsoever, done with any third parties. You further agree to indemnify Tech Processing LLC, against any outsider claims caused by your usage of the Service or the Customer Information.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">13. Data Protection</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Both sides could agree to abide by all the relevant data protection regulations. We use personal information to process it as required in order to deliver the Service and as explained in our Privacy Policy. It is your duty to make sure you acquire all consents and rights to supply your personal data to us.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">14. Force Majeure</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Both parties will not be responsible in cases of failing to make obligations based on circumstances beyond their control e.g. natural catastrophes, warfare, or actions by governments.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">15. Confidentiality</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Both sides will retain all the information that one party will mark with the label confidential or any information that is confidential on its own in confidence. This requirement remains in continuance of two years even after the termination of this Agreement.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">16. Notices</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Each and every communication should be written and it should be sent either by email or by post to the registered office address or contact information.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">17. Assignment</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Neither we nor you may delegate or otherwise transfer your rights or your obligations or duties under this Agreement, without the written consent of the other. We can delegate our rights or duty through a written notice.
            </p>

            <h3 className="text-2xl font-bold text-white mt-12 mb-6">18. Entire Agreement</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              This Agreement and our Privacy Policy make the final statement regarding your relation to Tech Processing LLC. Any other agreements, promises, and representations are of non-binding character unless expressed in the written form. In case any of the provisions are invalid or unenforceable, the rest of the provisions take effect.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Questions About Our Terms & Conditions?</h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              If you have any questions or concerns about these Terms & Conditions, please don't hesitate to contact us.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600/20 rounded-xl mb-4">
                  <Phone className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
                <a href={`tel:${appConfig.contact.phone.replace(/\D/g, '')}`} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  {appConfig.contact.phone}
                </a>
              </div>
              
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600/20 rounded-xl mb-4">
                  <Mail className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
                <a href={`mailto:${appConfig.contact.email}`} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  {appConfig.contact.email}
                </a>
              </div>
              
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600/20 rounded-xl mb-4">
                  <MapPin className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Visit Us</h3>
                <p className="text-gray-300 text-sm">{appConfig.contact.address}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg">
                <div className="text-white font-black text-lg">TP</div>
              </div>
              <div className="font-black text-xl">
                <span className="tracking-wider">TECHPROCESSING</span>
                <div className="text-xs text-emerald-400 font-bold tracking-[0.2em]">LLC</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 TechProcessing LLC. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsConditions;
