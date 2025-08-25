import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api';
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
  ExternalLink
} from 'lucide-react';

export function PaymentLinkPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [paymentLink, setPaymentLink] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  const processPayment = async () => {
    if (!paymentLink) return;
    
    setProcessing(true);
    setError('');

    try {
      // In a real implementation, this would collect payment details from a form
      // For demo purposes, we'll use test card data
      const paymentData = {
        amount: paymentLink.amount,
        cardNumber: '4111111111111111', // Test card number
        expiryDate: '12/25',
        cvv: '123',
        cardholderName: 'Test User',
        billingAddress: {
          firstName: 'Test',
          lastName: 'User',
          address: '123 Test St',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'US'
        },
        email: 'test@example.com'
      };

      const result = await apiClient.processPaymentLinkPayment(token!, paymentData);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Payment processing failed');
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
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
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white py-3 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
          >
            Continue
          </button>
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
              <span className="font-semibold text-white">{paymentLink.client?.fullName}</span>
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
                  Your payment will be processed securely. We never store your card information.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={processPayment}
            disabled={processing}
            className="w-full relative overflow-hidden bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center border border-green-500/30 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            {processing ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span className="relative flex items-center">
                <CreditCard className="h-5 w-5 mr-3" />
                Pay ${parseFloat(paymentLink.amount).toLocaleString()} Securely
                <ExternalLink className="h-5 w-5 ml-3" />
              </span>
            )}
          </button>

          {/* Payment Methods */}
          <div className="text-center mt-6">
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
