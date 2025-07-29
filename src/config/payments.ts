export const PAYMENT_CONFIG = {
  // Razorpay Configuration
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_test_key',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'your_test_secret',
    currency: 'INR',
  },
  
  // Dealer Registration Fee Structure
  dealerRegistration: {
    basic: {
      name: 'Basic Plan',
      price: 9999, // ₹9,999
      duration: '1 year',
      features: [
        'Up to 50 applications per month',
        'Basic analytics dashboard',
        'Email support',
        'Standard onboarding',
      ],
      description: 'Perfect for small dealerships getting started with digital financing',
    },
    professional: {
      name: 'Professional Plan',
      price: 19999, // ₹19,999
      duration: '1 year',
      features: [
        'Up to 200 applications per month',
        'Advanced analytics dashboard',
        'Priority support',
        'Dedicated account manager',
        'Custom integrations',
        'Training sessions',
      ],
      description: 'Ideal for growing dealerships with higher application volumes',
    },
    enterprise: {
      name: 'Enterprise Plan',
      price: 49999, // ₹49,999
      duration: '1 year',
      features: [
        'Unlimited applications',
        'Premium analytics dashboard',
        '24/7 phone support',
        'Dedicated success manager',
        'Custom integrations',
        'API access',
        'White-label solutions',
        'On-site training',
      ],
      description: 'For large dealerships requiring maximum features and support',
    },
  },
  
  // Payment Methods
  paymentMethods: [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, RuPay',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'All major Indian banks',
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'Google Pay, PhonePe, Paytm',
    },
    {
      id: 'wallet',
      name: 'Digital Wallets',
      icon: '👛',
      description: 'Paytm, PhonePe, Amazon Pay',
    },
  ],
  
  // Payment Status
  status: {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
    REFUNDED: 'refunded',
  },
  
  // GST Configuration (18% GST)
  gst: {
    rate: 0.18, // 18%
    description: 'GST @ 18%',
  },
  
  // Refund Policy
  refundPolicy: {
    description: '30-day money-back guarantee',
    terms: [
      'Full refund within 30 days of registration',
      'No questions asked refund policy',
      'Processing time: 5-7 business days',
      'Refund will be processed to original payment method',
    ],
  },
};

export const calculatePaymentBreakdown = (baseAmount: number) => {
  const gstAmount = Math.round(baseAmount * PAYMENT_CONFIG.gst.rate);
  const totalAmount = baseAmount + gstAmount;
  
  return {
    baseAmount,
    gstAmount,
    totalAmount,
    breakdown: [
      { label: 'Registration Fee', amount: baseAmount },
      { label: 'GST (18%)', amount: gstAmount },
      { label: 'Total Amount', amount: totalAmount, isTotal: true },
    ],
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}; 