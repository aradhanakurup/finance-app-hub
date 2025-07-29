export const PRICING_CONFIG = {
  // Main Page Application Pricing
  mainPageApplications: {
    free: {
      name: 'Free Tier',
      applicationsPerMonth: 3,
      price: 0,
      features: [
        'Basic prescreening',
        'Standard processing time',
        'Email support',
        'Basic eligibility check',
      ],
      limitations: [
        'Limited to 3 applications per month',
        'Standard processing (24-48 hours)',
        'No priority support',
        'No advanced analytics',
      ],
    },
    premium: {
      name: 'Premium Tier',
      applicationsPerMonth: 'Unlimited',
      price: 499, // Per application
      monthlyPrice: 2999, // Unlimited monthly
      features: [
        'Unlimited applications',
        'Priority processing (4-8 hours)',
        'Advanced prescreening',
        'Priority support',
        'Detailed analytics',
        'Application tracking',
        'SMS notifications',
      ],
      benefits: [
        'Faster processing time',
        'Higher approval rates',
        'Dedicated support',
        'Advanced reporting',
      ],
    },
  },

  // Dealer Registration Pricing (Current)
  dealerRegistration: {
    basic: {
      name: 'Basic Plan',
      price: 9999,
      duration: '1 year',
      applicationsPerMonth: 50,
      features: [
        'Up to 50 applications per month',
        'Basic analytics dashboard',
        'Email support',
        'Standard onboarding',
        'Bulk application processing',
        'Dealer-specific tracking',
      ],
    },
    professional: {
      name: 'Professional Plan',
      price: 19999,
      duration: '1 year',
      applicationsPerMonth: 200,
      features: [
        'Up to 200 applications per month',
        'Advanced analytics dashboard',
        'Priority support',
        'Dedicated account manager',
        'Custom integrations',
        'Training sessions',
        'API access',
      ],
    },
    enterprise: {
      name: 'Enterprise Plan',
      price: 49999,
      duration: '1 year',
      applicationsPerMonth: 'Unlimited',
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
    },
  },

  // Usage Tracking
  usageLimits: {
    freeTier: {
      monthlyApplications: 3,
      prescreeningChecks: 5,
      documentUploads: 2,
    },
    premiumTier: {
      monthlyApplications: -1, // Unlimited
      prescreeningChecks: -1, // Unlimited
      documentUploads: -1, // Unlimited
    },
  },

  // Payment Methods
  paymentMethods: {
    mainPage: [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        icon: '💳',
        description: 'Visa, Mastercard, RuPay',
      },
      {
        id: 'upi',
        name: 'UPI',
        icon: '📱',
        description: 'Google Pay, PhonePe, Paytm',
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        icon: '🏦',
        description: 'All major Indian banks',
      },
    ],
  },

  // GST Configuration
  gst: {
    rate: 0.18, // 18%
    description: 'GST @ 18%',
  },

  // Refund Policy
  refundPolicy: {
    mainPage: {
      description: '7-day money-back guarantee for premium applications',
      terms: [
        'Full refund within 7 days of payment',
        'No questions asked refund policy',
        'Processing time: 3-5 business days',
        'Refund will be processed to original payment method',
      ],
    },
    dealer: {
      description: '30-day money-back guarantee for dealer registration',
      terms: [
        'Full refund within 30 days of registration',
        'No questions asked refund policy',
        'Processing time: 5-7 business days',
        'Refund will be processed to original payment method',
      ],
    },
  },
};

export const calculateApplicationPrice = (tier: 'free' | 'premium', quantity: number = 1) => {
  if (tier === 'free') return 0;
  
  const config = PRICING_CONFIG.mainPageApplications.premium;
  return quantity * config.price;
};

export const calculateMonthlyPrice = (tier: 'free' | 'premium') => {
  if (tier === 'free') return 0;
  return PRICING_CONFIG.mainPageApplications.premium.monthlyPrice;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const getUsageStatus = (currentUsage: number, tier: 'free' | 'premium') => {
  const limits = PRICING_CONFIG.usageLimits[tier === 'free' ? 'freeTier' : 'premiumTier'];
  
  if (limits.monthlyApplications === -1) {
    return { canSubmit: true, remaining: 'Unlimited', percentage: 0 };
  }
  
  const remaining = Math.max(0, limits.monthlyApplications - currentUsage);
  const percentage = (currentUsage / limits.monthlyApplications) * 100;
  
  return {
    canSubmit: remaining > 0,
    remaining,
    percentage: Math.min(100, percentage),
  };
}; 