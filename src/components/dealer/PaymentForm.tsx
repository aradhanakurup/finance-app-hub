'use client';

import React, { useEffect, useState } from 'react';
import { PAYMENT_CONFIG, formatCurrency } from '@/config/payments';

interface PaymentFormProps {
  planType: string;
  dealerData: any;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentForm({ planType, dealerData, onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  const plan = PAYMENT_CONFIG.dealerRegistration[planType as keyof typeof PAYMENT_CONFIG.dealerRegistration];

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createOrder = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          dealerData,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setOrderData(result);
        return result;
      } else {
        throw new Error(result.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      onPaymentError('Failed to create payment order. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    const order = await createOrder();
    if (!order) return;

    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Fin5',
      description: `${plan.name} - Dealer Registration`,
      image: '/fin5-logo.png', // Add your logo path
      order_id: order.orderId,
      handler: async function (response: any) {
        try {
          // Verify payment
          const verifyResponse = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              dealerData,
            }),
          });

          const verifyResult = await verifyResponse.json();
          
          if (verifyResult.success) {
            onPaymentSuccess({
              ...verifyResult,
              planDetails: order.planDetails,
              paymentBreakdown: order.paymentBreakdown,
            });
          } else {
            onPaymentError('Payment verification failed. Please contact support.');
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          onPaymentError('Payment verification failed. Please contact support.');
        }
      },
      prefill: {
        name: dealerData.ownerName,
        email: dealerData.email,
        contact: dealerData.phone,
      },
      notes: {
        planType,
        businessName: dealerData.businessName,
      },
      theme: {
        color: '#3B82F6',
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed');
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  if (!plan) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Invalid plan selected</p>
      </div>
    );
  }

  const paymentBreakdown = calculatePaymentBreakdown(plan.price);

  return (
    <div className="space-y-6">
      {/* Plan Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Selected Plan:</span>
            <span className="font-medium">{plan.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-medium">{plan.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Registration Fee:</span>
            <span className="font-medium">{formatCurrency(plan.price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">GST (18%):</span>
            <span className="font-medium">{formatCurrency(paymentBreakdown.gstAmount)}</span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span className="font-semibold text-gray-900">Total Amount:</span>
            <span className="font-bold text-blue-600 text-lg">
              {formatCurrency(paymentBreakdown.totalAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PAYMENT_CONFIG.paymentMethods.map((method) => (
            <div
              key={method.id}
              className="border rounded-lg p-4 text-center hover:border-blue-300 transition-colors"
            >
              <div className="text-2xl mb-2">{method.icon}</div>
              <div className="text-sm font-medium text-gray-900">{method.name}</div>
              <div className="text-xs text-gray-500">{method.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <svg
            className="w-5 h-5 text-blue-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="font-medium text-blue-800">Secure Payment</span>
        </div>
        <p className="text-sm text-blue-700">
          Your payment is secured by Razorpay, a PCI DSS Level 1 compliant payment gateway. 
          All transactions are encrypted and secure.
        </p>
      </div>

      {/* Payment Button */}
      <div className="text-center">
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            `Pay ${formatCurrency(paymentBreakdown.totalAmount)}`
          )}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          By proceeding, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

// Helper function to calculate payment breakdown
function calculatePaymentBreakdown(baseAmount: number) {
  const gstAmount = Math.round(baseAmount * 0.18);
  const totalAmount = baseAmount + gstAmount;
  
  return {
    baseAmount,
    gstAmount,
    totalAmount,
  };
} 