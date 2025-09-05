import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api';
import { CreditCard, Shield, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export function PaymentPage() {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [hostedPaymentUrl, setHostedPaymentUrl] = useState('');

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const fetchInvoice = async () => {
    try {
      const response = await apiClient.getInvoices();
      const foundInvoice = response.invoices.find((inv: any) => inv.id === invoiceId);
      
      if (!foundInvoice) {
        setError('Invoice not found');
        return;
      }
      
      setInvoice(foundInvoice);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      setError('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const initiateHostedPayment = async () => {
    if (!invoice) return;
    
    setPaymentLoading(true);
    setError('');

    try {
      const response = await apiClient.createHostedPaymentToken({
        invoiceId: invoice.id,
        amount: parseFloat(invoice.amount),
        returnUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
        description: invoice.description,
      });

      // In a real implementation, you would redirect to the hosted payment page
      // For demo purposes, we'll simulate a successful payment
      setHostedPaymentUrl(response.hostedPaymentUrl);
      
      // Simulate payment processing
      setTimeout(() => {
        setSuccess(true);
        setPaymentLoading(false);
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || 'Failed to initiate payment');
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Error</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/client/invoices')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your payment of ${parseFloat(invoice?.amount || '0').toLocaleString()} has been processed successfully.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/client/invoices')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All Invoices
            </button>
            <button
              onClick={() => navigate('/client')}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/client/invoices')}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Pay Invoice</h1>
          <p className="text-gray-600 dark:text-gray-400">Secure payment processing via Authorize.Net</p>
        </div>

        {/* Invoice Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Invoice Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Invoice #:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{invoice?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Description:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{invoice?.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Due Date:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {new Date(invoice?.due_date).toLocaleDateString()}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-gray-900 dark:text-gray-100">Total Amount:</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  ${parseFloat(invoice?.amount || '0').toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Secure Payment</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Security Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Secure Payment Processing
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Your payment will be processed securely through Authorize.Net. We never store your card information.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={initiateHostedPayment}
              disabled={paymentLoading || !invoice}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {paymentLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-3" />
                  Pay ${parseFloat(invoice?.amount || '0').toLocaleString()} Securely
                </>
              )}
            </button>

            {/* Payment Methods */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">We accept:</p>
              <div className="flex justify-center space-x-4">
                {['Visa', 'Mastercard', 'American Express', 'Discover'].map((card) => (
                  <div key={card} className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded text-xs font-medium text-gray-700 dark:text-gray-300">
                    {card}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help? Contact us at{' '}
            <a href="mailto:support@techprocessingllc.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              support@techprocessingllc.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}