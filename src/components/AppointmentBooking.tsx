import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  MessageCircle, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ArrowRight,
  Video,
  MapPin
} from 'lucide-react';
import { backendEmailService } from '../lib/backendEmailService';
import { AppointmentData } from '../lib/emailService';

const appointmentSchema = yup.object({
  name: yup.string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup.string()
    .required('Email address is required')
    .email('Please enter a valid email address'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number'),
  business: yup.string()
    .required('Business name is required')
    .min(2, 'Business name must be at least 2 characters'),
  serviceType: yup.string()
    .required('Please select a service type'),
  preferredDate: yup.string()
    .required('Please select a preferred date'),
  preferredTime: yup.string()
    .required('Please select a preferred time'),
  message: yup.string()
    .max(500, 'Message must be less than 500 characters')
    .optional()
});

interface AppointmentBookingProps {
  onSuccess?: () => void;
  className?: string;
}

export function AppointmentBooking({ onSuccess, className = '' }: AppointmentBookingProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [selectedService, setSelectedService] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue
  } = useForm({
    resolver: yupResolver(appointmentSchema),
    mode: 'onChange'
  });

  const watchedFields = watch();

  const serviceTypes = [
    { value: 'consultation', label: 'Free Consultation', duration: '30 min', icon: MessageCircle },
    { value: 'web-development', label: 'Web Development', duration: '60 min', icon: Briefcase },
    { value: 'seo-audit', label: 'SEO Audit', duration: '45 min', icon: MessageCircle },
    { value: 'google-business', label: 'Google Business Setup', duration: '30 min', icon: MapPin },
    { value: 'analytics-review', label: 'Analytics Review', duration: '45 min', icon: MessageCircle },
    { value: 'other', label: 'Other', duration: '30 min', icon: MessageCircle }
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM'
  ];

  const getNextWeekDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })
        });
      }
    }
    
    return dates;
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await backendEmailService.sendAppointmentRequest(data);
      
      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        reset();
        setSelectedService('');
        onSuccess?.();
        
        // Track successful appointment booking
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'appointment_booked', {
            event_category: 'Lead Generation',
            event_label: 'Appointment Booking',
            value: 1
          });
        }
      } else {
        setSubmitStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      console.error('Appointment booking error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'An unexpected error occurred. Please try again or contact us directly.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const isFieldValid = (fieldName: keyof AppointmentData) => {
    return !errors[fieldName] && watchedFields[fieldName];
  };

  return (
    <div className={`bg-white dark:bg-bg2 rounded-2xl shadow-xl border border-gray-200 dark:border-outline p-6 md:p-8 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-fg mb-2">
          Book Your Free Consultation
        </h3>
        <p className="text-gray-600 dark:text-muted">
          Schedule a call with our experts to discuss your project
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
            <CheckCircle className="h-5 w-5 text-accent1 dark:text-accent2 mr-3 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0" />
          )}
          <p className={`text-sm ${
            submitStatus.type === 'success' 
              ? 'text-emerald-800 dark:text-accent3' 
              : 'text-red-800 dark:text-red-300'
          }`}>
            {submitStatus.message}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Service Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-muted mb-3">
            Select Service Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {serviceTypes.map((service) => {
              const IconComponent = service.icon;
              return (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => {
                    setSelectedService(service.value);
                    setValue('serviceType', service.value);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedService === service.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-accent1'
                  }`}
                  disabled={isSubmitting}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <IconComponent className={`h-5 w-5 mr-3 ${
                        selectedService === service.value 
                          ? 'text-accent1 dark:text-accent2' 
                          : 'text-muted'
                      }`} />
                      <div>
                        <div className={`font-medium ${
                          selectedService === service.value 
                            ? 'text-emerald-900 dark:text-accent3' 
                            : 'text-gray-900 dark:text-fg'
                        }`}>
                          {service.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-muted">
                          {service.duration}
                        </div>
                      </div>
                    </div>
                    {selectedService === service.value && (
                      <CheckCircle className="h-5 w-5 text-accent1 dark:text-accent2" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          {errors.serviceType && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.serviceType.message}
            </p>
          )}
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isFieldValid('name') ? 'text-accent1' : 'text-muted'
              }`} />
              <input
                type="text"
                id="name"
                {...register('name')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-white dark:bg-surface text-gray-900 dark:text-fg transition-colors ${
                  errors.name 
                    ? 'border-red-300 dark:border-red-600' 
                    : isFieldValid('name')
                    ? 'border-emerald-300 dark:border-accent1'
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
            <label htmlFor="business" className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
              Business Name *
            </label>
            <div className="relative">
              <Briefcase className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isFieldValid('business') ? 'text-accent1' : 'text-muted'
              }`} />
              <input
                type="text"
                id="business"
                {...register('business')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-white dark:bg-surface text-gray-900 dark:text-fg transition-colors ${
                  errors.business 
                    ? 'border-red-300 dark:border-red-600' 
                    : isFieldValid('business')
                    ? 'border-emerald-300 dark:border-accent1'
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

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isFieldValid('email') ? 'text-accent1' : 'text-muted'
              }`} />
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-white dark:bg-surface text-gray-900 dark:text-fg transition-colors ${
                  errors.email 
                    ? 'border-red-300 dark:border-red-600' 
                    : isFieldValid('email')
                    ? 'border-emerald-300 dark:border-accent1'
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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isFieldValid('phone') ? 'text-accent1' : 'text-muted'
              }`} />
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-white dark:bg-surface text-gray-900 dark:text-fg transition-colors ${
                  errors.phone 
                    ? 'border-red-300 dark:border-red-600' 
                    : isFieldValid('phone')
                    ? 'border-emerald-300 dark:border-accent1'
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

        {/* Date and Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
              Preferred Date *
            </label>
            <div className="relative">
              <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isFieldValid('preferredDate') ? 'text-accent1' : 'text-muted'
              }`} />
              <select
                id="preferredDate"
                {...register('preferredDate')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-white dark:bg-surface text-gray-900 dark:text-fg transition-colors ${
                  errors.preferredDate 
                    ? 'border-red-300 dark:border-red-600' 
                    : isFieldValid('preferredDate')
                    ? 'border-emerald-300 dark:border-accent1'
                    : 'border-gray-300 dark:border-slate-600'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select a date</option>
                {getNextWeekDates().map((date) => (
                  <option key={date.value} value={date.value}>
                    {date.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.preferredDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.preferredDate.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
              Preferred Time *
            </label>
            <div className="relative">
              <Clock className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                isFieldValid('preferredTime') ? 'text-accent1' : 'text-muted'
              }`} />
              <select
                id="preferredTime"
                {...register('preferredTime')}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-white dark:bg-surface text-gray-900 dark:text-fg transition-colors ${
                  errors.preferredTime 
                    ? 'border-red-300 dark:border-red-600' 
                    : isFieldValid('preferredTime')
                    ? 'border-emerald-300 dark:border-accent1'
                    : 'border-gray-300 dark:border-slate-600'
                }`}
                disabled={isSubmitting}
              >
                <option value="">Select a time</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            {errors.preferredTime && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.preferredTime.message}
              </p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-muted mb-2">
            Additional Notes (Optional)
          </label>
          <div className="relative">
            <MessageCircle className="absolute left-3 top-3 h-5 w-5 text-muted" />
            <textarea
              id="message"
              rows={3}
              {...register('message')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-white dark:bg-surface text-gray-900 dark:text-fg resize-none transition-colors"
              placeholder="Tell us about your project goals or any specific questions you'd like to discuss..."
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

        {/* Meeting Type Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <Video className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">
                Meeting Details
              </h4>
              <p className="text-sm text-blue-800 dark:text-blue-400">
                All consultations are conducted via video call (Google Meet or Zoom). 
                We'll send you the meeting link after confirming your appointment.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full bg-gradient-to-r from-accent1 to-accent600 hover:from-emerald-600 hover:to-accent700 disabled:from-gray-400 disabled:to-gray-500 text-fg px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Booking Appointment...
            </>
          ) : (
            <>
              <Calendar className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Book Free Consultation
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Form Progress Indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-muted mb-2">
            <span>Form Progress</span>
            <span>{Object.keys(watchedFields).filter(key => watchedFields[key as keyof AppointmentData]).length}/8</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-accent1 to-accent600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(Object.keys(watchedFields).filter(key => watchedFields[key as keyof AppointmentData]).length / 8) * 100}%` 
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
