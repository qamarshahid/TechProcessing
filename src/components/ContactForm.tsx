import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  User, 
  Briefcase, 
  Mail, 
  Phone, 
  FileText, 
  Send, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Clock
} from 'lucide-react';
import { backendEmailService } from '../lib/backendEmailService';
import { ContactFormData } from '../lib/emailService';

const contactFormSchema = yup.object({
  name: yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  business: yup.string()
    .required('Business name is required')
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters'),
  email: yup.string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  projectType: yup.string()
    .required('Please select a project type'),
  timeline: yup.string()
    .required('Please select a timeline'),
  message: yup.string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional(),
  consent: yup.boolean()
    .oneOf([true], 'You must agree to receive communications')
    .required()
});

interface ContactFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function ContactForm({ onSuccess, className = '' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm({
    resolver: yupResolver(contactFormSchema),
    mode: 'onChange'
  });

  const watchedFields = watch();

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await backendEmailService.sendContactForm(data);
      
      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        reset();
        onSuccess?.();
        
        // Track successful form submission
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'form_submit_success', {
            event_category: 'Lead Generation',
            event_label: 'Contact Form',
            value: 1
          });
        }
      } else {
        setSubmitStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'An unexpected error occurred. Please try again or call us directly at (727) 201-2658.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const isFieldValid = (fieldName: keyof ContactFormData) => {
    return !errors[fieldName] && watchedFields[fieldName];
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 p-6 md:p-8 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Get Your Free Quote
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Tell us about your project and we'll provide a custom solution
        </p>
      </div>

      {/* Success/Error Messages */}
      {submitStatus.type && (
        <div className={`mb-6 p-4 rounded-lg flex items-start ${
          submitStatus.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' 
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          {submitStatus.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
          )}
          <p className={`text-sm ${
            submitStatus.type === 'success' 
              ? 'text-emerald-800 dark:text-emerald-300' 
              : 'text-red-800 dark:text-red-300'
          }`}>
            {submitStatus.message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name and Business */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isFieldValid('name') ? 'text-emerald-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                id="name"
                {...register('name')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors ${
                  errors.name 
                    ? 'border-red-300 dark:border-red-600' 
                    : isFieldValid('name')
                    ? 'border-emerald-300 dark:border-emerald-600'
                    : 'border-gray-300 dark:border-slate-600'
                }`}
                placeholder="Your full name"
                disabled={isSubmitting}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="business" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Business Name *
            </label>
            <div className="relative">
              <Briefcase className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isFieldValid('business') ? 'text-emerald-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                id="business"
                {...register('business')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors ${
                  errors.business 
                    ? 'border-red-300 dark:border-red-600' 
                    : isFieldValid('business')
                    ? 'border-emerald-300 dark:border-emerald-600'
                    : 'border-gray-300 dark:border-slate-600'
                }`}
                placeholder="Your business name"
                disabled={isSubmitting}
              />
            </div>
            {errors.business && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.business.message}
              </p>
            )}
          </div>
        </div>

        {/* Email and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isFieldValid('email') ? 'text-emerald-500' : 'text-gray-400'
              }`} />
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors ${
                  errors.email 
                    ? 'border-red-300 dark:border-red-600' 
                    : isFieldValid('email')
                    ? 'border-emerald-300 dark:border-emerald-600'
                    : 'border-gray-300 dark:border-slate-600'
                }`}
                placeholder="your@email.com"
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isFieldValid('phone') ? 'text-emerald-500' : 'text-gray-400'
              }`} />
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors ${
                  errors.phone 
                    ? 'border-red-300 dark:border-red-600' 
                    : isFieldValid('phone')
                    ? 'border-emerald-300 dark:border-emerald-600'
                    : 'border-gray-300 dark:border-slate-600'
                }`}
                placeholder="(727) 555-0123"
                disabled={isSubmitting}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Project Type and Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Type *
            </label>
            <div className="relative">
              <Briefcase className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isFieldValid('projectType') ? 'text-emerald-500' : 'text-gray-400'
              }`} />
              <select
                id="projectType"
                {...register('projectType')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors ${
                  errors.projectType 
                    ? 'border-red-300 dark:border-red-600' 
                    : isFieldValid('projectType')
                    ? 'border-emerald-300 dark:border-emerald-600'
                    : 'border-gray-300 dark:border-slate-600'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select project type</option>
                <option value="web-development">Web Development</option>
                <option value="seo">SEO & Digital Marketing</option>
                <option value="google-business">Google Business Profile</option>
                <option value="analytics">Analytics & Tracking</option>
                <option value="maintenance">Maintenance & Support</option>
                <option value="other">Other</option>
              </select>
            </div>
            {errors.projectType && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.projectType.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timeline *
            </label>
            <div className="relative">
              <Clock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isFieldValid('timeline') ? 'text-emerald-500' : 'text-gray-400'
              }`} />
              <select
                id="timeline"
                {...register('timeline')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white transition-colors ${
                  errors.timeline 
                    ? 'border-red-300 dark:border-red-600' 
                    : isFieldValid('timeline')
                    ? 'border-emerald-300 dark:border-emerald-600'
                    : 'border-gray-300 dark:border-slate-600'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select timeline</option>
                <option value="asap">ASAP</option>
                <option value="1-month">Within 1 month</option>
                <option value="2-3-months">2-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="6-months-plus">6+ months</option>
              </select>
            </div>
            {errors.timeline && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.timeline.message}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Project Details
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              id="message"
              rows={4}
              {...register('message')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white resize-none transition-colors"
              placeholder="Tell us about your project goals, current challenges, and what success looks like for your business..."
              disabled={isSubmitting}
            />
          </div>
          {errors.message && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Consent Checkbox */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="consent"
              type="checkbox"
              {...register('consent')}
              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 dark:focus:ring-emerald-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              disabled={isSubmitting}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="consent" className="text-gray-700 dark:text-gray-300">
              I agree to receive communications from TechProcessing LLC and understand that I can unsubscribe at any time. *
            </label>
            {errors.consent && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.consent.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
              Get My Free Quote
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Form Progress Indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Form Progress</span>
            <span>{Object.keys(watchedFields).filter(key => watchedFields[key as keyof ContactFormData]).length}/8</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(Object.keys(watchedFields).filter(key => watchedFields[key as keyof ContactFormData]).length / 8) * 100}%` 
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
