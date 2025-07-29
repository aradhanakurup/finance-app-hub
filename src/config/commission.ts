export const COMMISSION_CONFIG = {
  // Platform Commission Split
  platformSplit: {
    platform: 0.70, // 70% for Fin5 platform
    dealer: 0.30,   // 30% for dealer
  },

  // Commission Rates by Lender Type
  lenderCommissionRates: {
    banks: {
      hdfc: { rate: 0.015, minAmount: 50000, maxAmount: 5000000 }, // 1.5% of loan amount
      icici: { rate: 0.014, minAmount: 50000, maxAmount: 3000000 }, // 1.4% of loan amount
      sbi: { rate: 0.012, minAmount: 50000, maxAmount: 2000000 },   // 1.2% of loan amount
      axis: { rate: 0.016, minAmount: 50000, maxAmount: 4000000 },  // 1.6% of loan amount
      kotak: { rate: 0.017, minAmount: 50000, maxAmount: 3500000 }, // 1.7% of loan amount
    },
    nbfcs: {
      bajaj: { rate: 0.020, minAmount: 30000, maxAmount: 1500000 }, // 2.0% of loan amount
      tata: { rate: 0.018, minAmount: 30000, maxAmount: 1200000 },  // 1.8% of loan amount
      mahindra: { rate: 0.019, minAmount: 30000, maxAmount: 1000000 }, // 1.9% of loan amount
      chola: { rate: 0.021, minAmount: 30000, maxAmount: 800000 },  // 2.1% of loan amount
      fullerton: { rate: 0.022, minAmount: 30000, maxAmount: 600000 }, // 2.2% of loan amount
    },
  },

  // Commission Tiers by Dealer Plan
  dealerCommissionTiers: {
    basic: {
      name: 'Basic Plan',
      commissionRate: 0.25, // 25% of total commission (instead of 30%)
      minApplications: 0,
      maxApplications: 50,
      features: [
        'Standard commission rate',
        'Monthly payout',
        'Basic reporting',
      ],
    },
    professional: {
      name: 'Professional Plan',
      commissionRate: 0.30, // 30% of total commission
      minApplications: 51,
      maxApplications: 200,
      features: [
        'Enhanced commission rate',
        'Bi-weekly payout',
        'Advanced reporting',
        'Commission analytics',
      ],
    },
    enterprise: {
      name: 'Enterprise Plan',
      commissionRate: 0.35, // 35% of total commission
      minApplications: 201,
      maxApplications: -1, // Unlimited
      features: [
        'Premium commission rate',
        'Weekly payout',
        'Premium reporting',
        'Commission analytics',
        'Dedicated account manager',
        'Custom commission structure',
      ],
    },
  },

  // Commission Calculation Rules
  calculationRules: {
    // Minimum commission amounts
    minCommission: {
      platform: 100, // Minimum ₹100 for platform
      dealer: 50,    // Minimum ₹50 for dealer
    },
    
    // Commission caps
    maxCommission: {
      platform: 50000, // Maximum ₹50,000 for platform
      dealer: 25000,   // Maximum ₹25,000 for dealer
    },

    // Processing fees
    processingFees: {
      platform: 0.05, // 5% of commission for platform processing
      dealer: 0.02,   // 2% of commission for dealer processing
    },

    // GST on commission
    gst: {
      rate: 0.18, // 18% GST
      appliesTo: 'platform', // GST applies to platform share only
    },
  },

  // Payout Schedule
  payoutSchedule: {
    basic: {
      frequency: 'monthly',
      dayOfMonth: 15, // 15th of every month
      processingDays: 3,
    },
    professional: {
      frequency: 'bi-weekly',
      dayOfWeek: 'friday', // Every other Friday
      processingDays: 2,
    },
    enterprise: {
      frequency: 'weekly',
      dayOfWeek: 'monday', // Every Monday
      processingDays: 1,
    },
  },

  // Commission Status
  status: {
    PENDING: 'pending',
    APPROVED: 'approved',
    PAID: 'paid',
    CANCELLED: 'cancelled',
    DISPUTED: 'disputed',
  },

  // Commission Types
  types: {
    LOAN_APPROVAL: 'loan_approval',
    LOAN_DISBURSEMENT: 'loan_disbursement',
    PROCESSING_FEE: 'processing_fee',
    REFERRAL: 'referral',
  },

  // Performance Bonuses
  performanceBonuses: {
    monthlyTargets: {
      applications: {
        50: { bonus: 0.02 }, // 2% bonus for 50+ applications
        100: { bonus: 0.05 }, // 5% bonus for 100+ applications
        200: { bonus: 0.10 }, // 10% bonus for 200+ applications
      },
      approvalRate: {
        0.80: { bonus: 0.03 }, // 3% bonus for 80%+ approval rate
        0.85: { bonus: 0.05 }, // 5% bonus for 85%+ approval rate
        0.90: { bonus: 0.08 }, // 8% bonus for 90%+ approval rate
      },
      loanAmount: {
        1000000: { bonus: 0.02 }, // 2% bonus for ₹10L+ total loans
        5000000: { bonus: 0.05 }, // 5% bonus for ₹50L+ total loans
        10000000: { bonus: 0.10 }, // 10% bonus for ₹1Cr+ total loans
      },
    },
  },
};

// Commission calculation functions
export const calculateCommission = (
  loanAmount: number,
  lenderId: string,
  dealerPlan: 'basic' | 'professional' | 'enterprise'
) => {
  // Find lender commission rate
  const lenderRates = COMMISSION_CONFIG.lenderCommissionRates;
  let commissionRate = 0.015; // Default rate

  // Check banks first
  if (lenderRates.banks[lenderId as keyof typeof lenderRates.banks]) {
    commissionRate = lenderRates.banks[lenderId as keyof typeof lenderRates.banks].rate;
  }
  // Check NBFCs
  else if (lenderRates.nbfcs[lenderId as keyof typeof lenderRates.nbfcs]) {
    commissionRate = lenderRates.nbfcs[lenderId as keyof typeof lenderRates.nbfcs].rate;
  }

  // Calculate total commission
  const totalCommission = loanAmount * commissionRate;

  // Get dealer commission rate based on plan
  const dealerRate = COMMISSION_CONFIG.dealerCommissionTiers[dealerPlan].commissionRate;

  // Calculate splits
  const dealerCommission = totalCommission * dealerRate;
  const platformCommission = totalCommission - dealerCommission;

  // Apply processing fees
  const dealerProcessingFee = dealerCommission * COMMISSION_CONFIG.calculationRules.processingFees.dealer;
  const platformProcessingFee = platformCommission * COMMISSION_CONFIG.calculationRules.processingFees.platform;

  // Final amounts
  const finalDealerCommission = dealerCommission - dealerProcessingFee;
  const finalPlatformCommission = platformCommission - platformProcessingFee;

  return {
    loanAmount,
    lenderId,
    commissionRate,
    totalCommission,
    dealerCommission: finalDealerCommission,
    platformCommission: finalPlatformCommission,
    dealerProcessingFee,
    platformProcessingFee,
    dealerPlan,
  };
};

// Performance bonus calculation
export const calculatePerformanceBonus = (
  monthlyStats: {
    applications: number;
    approvalRate: number;
    totalLoanAmount: number;
  },
  baseCommission: number
) => {
  let totalBonus = 0;

  // Application count bonus
  if (monthlyStats.applications >= 200) {
    totalBonus += COMMISSION_CONFIG.performanceBonuses.monthlyTargets.applications[200].bonus;
  } else if (monthlyStats.applications >= 100) {
    totalBonus += COMMISSION_CONFIG.performanceBonuses.monthlyTargets.applications[100].bonus;
  } else if (monthlyStats.applications >= 50) {
    totalBonus += COMMISSION_CONFIG.performanceBonuses.monthlyTargets.applications[50].bonus;
  }

  // Approval rate bonus
  if (monthlyStats.approvalRate >= 0.90) {
    totalBonus += COMMISSION_CONFIG.performanceBonuses.monthlyTargets.approvalRate[0.90].bonus;
  } else if (monthlyStats.approvalRate >= 0.85) {
    totalBonus += COMMISSION_CONFIG.performanceBonuses.monthlyTargets.approvalRate[0.85].bonus;
  } else if (monthlyStats.approvalRate >= 0.80) {
    totalBonus += COMMISSION_CONFIG.performanceBonuses.monthlyTargets.approvalRate[0.80].bonus;
  }

  // Loan amount bonus
  if (monthlyStats.totalLoanAmount >= 10000000) {
    totalBonus += COMMISSION_CONFIG.performanceBonuses.monthlyTargets.loanAmount[10000000].bonus;
  } else if (monthlyStats.totalLoanAmount >= 5000000) {
    totalBonus += COMMISSION_CONFIG.performanceBonuses.monthlyTargets.loanAmount[5000000].bonus;
  } else if (monthlyStats.totalLoanAmount >= 1000000) {
    totalBonus += COMMISSION_CONFIG.performanceBonuses.monthlyTargets.loanAmount[1000000].bonus;
  }

  return {
    bonusRate: totalBonus,
    bonusAmount: baseCommission * totalBonus,
    totalAmount: baseCommission * (1 + totalBonus),
  };
};

// Payout calculation
export const calculatePayout = (
  dealerId: string,
  dealerPlan: 'basic' | 'professional' | 'enterprise',
  commissionAmount: number
) => {
  const schedule = COMMISSION_CONFIG.payoutSchedule[dealerPlan];
  
  return {
    dealerId,
    dealerPlan,
    commissionAmount,
    payoutFrequency: schedule.frequency,
    processingDays: schedule.processingDays,
    estimatedPayoutDate: new Date(Date.now() + schedule.processingDays * 24 * 60 * 60 * 1000),
  };
};

// Format currency
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}; 