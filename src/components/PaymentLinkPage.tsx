import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
import { useNotifications } from './common/NotificationSystem';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  Clock,
  User,
  DollarSign,
  Calendar,
  Lock,
  ExternalLink,
  Eye,
  EyeOff,
  Building,
  MapPin,
  Phone
} from 'lucide-react';

export function PaymentLinkPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  
  const [paymentLink, setPaymentLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: Review, 2: Payment Details, 3: Processing
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: '',
    billingAddress: {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
    saveCard: false,
  });
  const [showCardDetails, setShowCardDetails] = useState(false);

  useEffect(() => {
    if (token) {
      fetchPaymentLink();
    }
  }, [token]);

  const fetchPaymentLink = async () => {
    try {
      const response = await apiClient.getPaymentLinkByToken(token!);
      const link = response.link;

      if (!link) {
        setError('Payment link not found or has expired');
        return;
      }

      // Check if link is expired
      if (new Date(link.expires_at) < new Date()) {
        setError('This payment link has expired');
        return;
      }

      // Check if link is already used
      if (link.status === 'USED') {
        setError('This payment link has already been used');
        return;
      }

      // Check if link is cancelled
      if (link.status === 'CANCELLED') {
        setError('This payment link has been cancelled');
        return;
      }
      
      setError(''); // Clear any previous errors
      setPaymentLink(link);
    } catch (error) {
      setError('Payment links feature is currently unavailable. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!paymentLink) return;
    
    // Validate payment form
    if (!paymentForm.cardNumber || !paymentForm.expiryDate || !paymentForm.cvv || !paymentForm.cardholderName) {
      setError('Please fill in all required card details');
      return;
    }
    
    if (!paymentForm.email) {
      setError('Please provide an email address for receipt');
      return;
    }
    
    setProcessing(true);
    setError('');
    setStep(3);

    try {
      const paymentData = {
        amount: paymentLink.amount,
        cardNumber: paymentForm.cardNumber,
        expiryDate: paymentForm.expiryDate,
        cvv: paymentForm.cvv,
        cardholderName: paymentForm.cardholderName,
        billingAddress: paymentForm.billingAddress,
        email: paymentForm.email,
        phone: paymentForm.phone,
        saveCard: paymentForm.saveCard,
      };

      const result = await apiClient.processPaymentLinkPayment(token!, paymentData);
      
      if (result.success) {
        setSuccess(true);
        showSuccess('Payment Successful', `Your payment of $${parseFloat(paymentLink.amount).toLocaleString()} has been processed successfully.`);
      } else {
        setError(result.message || 'Payment processing failed');
        showError('Payment Failed', result.message || 'Payment processing failed');
        setStep(2); // Go back to payment form
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
      showError('Payment Failed', err.message || 'Payment processing failed');
      setStep(2); // Go back to payment form
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('billingAddress.')) {
      const field = name.split('.')[1];
      setPaymentForm(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value
        }
      }));
    } else if (e.target.type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPaymentForm(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setPaymentForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setPaymentForm(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setPaymentForm(prev => ({
      ...prev,
      expiryDate: formatted
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">Payment Link Error</h1>
          <p className="text-white/80 mb-8">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">Payment Successful!</h1>
          <p className="text-white/80 mb-8">
            Your payment of ${parseFloat(paymentLink?.amount || '0').toLocaleString()} has been processed successfully.
            A receipt has been sent to your email address.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
            >
              Continue
            </button>
            <p className="text-sm text-white/60">
              Transaction ID: {Date.now().toString(36).toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (processing && step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold text-white mb-4">Processing Payment...</h1>
          <p className="text-white/80 mb-8">
            Please wait while we securely process your payment of ${parseFloat(paymentLink?.amount || '0').toLocaleString()}.
          </p>
          <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-lg p-4">
            <div className="flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-sm text-blue-300">Secure Processing via Authorize.Net</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full text-sm font-semibold mb-6 border border-white/20 shadow-lg">
            <Shield className="h-4 w-4 mr-2" />
            Secure Payment Portal
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Complete Your Payment</h1>
          <p className="text-white/80">Secure payment processing via Tech Processing LLC</p>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 mb-6">
          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{paymentLink.title}</h2>
                {paymentLink.description && (
                  <p className="text-white/80">{paymentLink.description}</p>
                )}
              </div>

              {/* Payment Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-white/60 mr-3" />
                    <span className="text-white/80">Client</span>
                  </div>
                  <span className="font-semibold text-white">{paymentLink.client?.fullName || 'Guest'}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-white/60 mr-3" />
                    <span className="text-white/80">Amount</span>
                  </div>
                  <span className="font-bold text-2xl text-green-400">${parseFloat(paymentLink.amount).toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-white/60 mr-3" />
                    <span className="text-white/80">Expires</span>
                  </div>
                  <span className="font-semibold text-white">{new Date(paymentLink.expires_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4 mb-8">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-300">Secure Payment Processing</h3>
                    <p className="text-sm text-blue-200 mt-1">
                      Your payment will be processed securely via Authorize.Net. We never store your card information.
                    </p>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => setStep(2)}
                className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center border border-blue-500/30 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative flex items-center">
                  <CreditCard className="h-5 w-5 mr-3" />
                  Continue to Payment
                  <ExternalLink className="h-5 w-5 ml-3" />
                </span>
              </button>
            </>
          )}

          {/* Step 2: Payment Form */}
          {step === 2 && (
            <form onSubmit={processPayment} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Payment Details</h2>
                <p className="text-white/80">Amount: ${parseFloat(paymentLink.amount).toLocaleString()}</p>
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    name="email"
                    value={paymentForm.email}
                    onChange={handlePaymentFormChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email address *"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={paymentForm.phone}
                    onChange={handlePaymentFormChange}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              {/* Card Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Card Information</h3>
                
                <input
                  type="text"
                  name="cardholderName"
                  value={paymentForm.cardholderName}
                  onChange={handlePaymentFormChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cardholder name *"
                />

                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                  <input
                    type="text"
                    name="cardNumber"
                    value={paymentForm.cardNumber}
                    onChange={handleCardNumberChange}
                    required
                    maxLength={19}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input
                      type="text"
                      name="expiryDate"
                      value={paymentForm.expiryDate}
                      onChange={handleExpiryChange}
                      required
                      maxLength={5}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                    <input
                      type={showCardDetails ? 'text' : 'password'}
                      name="cvv"
                      value={paymentForm.cvv}
                      onChange={handlePaymentFormChange}
                      required
                      maxLength={4}
                      className="w-full pl-12 pr-12 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="CVV"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCardDetails(!showCardDetails)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                    >
                      {showCardDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Billing Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="billingAddress.firstName"
                    value={paymentForm.billingAddress.firstName}
                    onChange={handlePaymentFormChange}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="First name"
                  />
                  <input
                    type="text"
                    name="billingAddress.lastName"
                    value={paymentForm.billingAddress.lastName}
                    onChange={handlePaymentFormChange}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Last name"
                  />
                  <input
                    type="text"
                    name="billingAddress.address"
                    value={paymentForm.billingAddress.address}
                    onChange={handlePaymentFormChange}
                    className="md:col-span-2 w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street address"
                  />
                  <input
                    type="text"
                    name="billingAddress.city"
                    value={paymentForm.billingAddress.city}
                    onChange={handlePaymentFormChange}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    name="billingAddress.state"
                    value={paymentForm.billingAddress.state}
                    onChange={handlePaymentFormChange}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="State"
                  />
                  <input
                    type="text"
                    name="billingAddress.zipCode"
                    value={paymentForm.billingAddress.zipCode}
                    onChange={handlePaymentFormChange}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ZIP code"
                  />
                  <select
                    name="billingAddress.country"
                    value={paymentForm.billingAddress.country}
                    onChange={handlePaymentFormChange}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="US" className="bg-gray-800">United States</option>
                    <option value="CA" className="bg-gray-800">Canada</option>
                    <option value="GB" className="bg-gray-800">United Kingdom</option>
                  </select>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-3">
                <label className="flex items-center text-white">
                  <input
                    type="checkbox"
                    name="saveCard"
                    checked={paymentForm.saveCard}
                    onChange={handlePaymentFormChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white/20"
                  />
                  <span className="ml-2 text-sm">Save card for future payments</span>
                </label>
              </div>

              {/* Navigation */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/10 backdrop-blur-sm text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 border border-white/20 hover:bg-white/20"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 border border-green-500/30 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay ${parseFloat(paymentLink.amount).toLocaleString()}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Payment Methods */}
          <div className="text-center mt-8">
            <p className="text-sm text-white/70 mb-3">We accept:</p>
            <div className="flex justify-center space-x-4">
              {['Visa', 'Mastercard', 'American Express', 'Discover'].map((card) => (
                <div key={card} className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded text-xs font-medium text-white/80 border border-white/20">
                  {card}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-white/70">
            Powered by{' '}
            <span className="font-bold text-white">Tech Processing LLC</span>
            {' • '}
            <a href="mailto:support@techprocessing.com" className="text-blue-400 hover:text-blue-300 transition-colors">
              Need help?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}