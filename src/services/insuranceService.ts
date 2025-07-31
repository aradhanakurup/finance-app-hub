import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

// Insurance Provider Configuration
export const INSURANCE_PROVIDERS = {
  ICICI_LOMBARD: {
    name: 'ICICI Lombard',
    apiEndpoint: 'https://api.icicilombard.com/v1',
    commissionRate: 0.20, // 20%
    supportedCoverageTypes: ['loan_protection', 'job_loss', 'critical_illness', 'asset_protection'],
    minPremium: 1000,
    maxCoverage: 5000000,
    responseTime: 30, // minutes
  },
  HDFC_ERGO: {
    name: 'HDFC Ergo',
    apiEndpoint: 'https://api.hdfcergo.com/v1',
    commissionRate: 0.18, // 18%
    supportedCoverageTypes: ['loan_protection', 'job_loss', 'asset_protection'],
    minPremium: 800,
    maxCoverage: 3000000,
    responseTime: 45, // minutes
  },
  BAJAJ_ALLIANZ: {
    name: 'Bajaj Allianz',
    apiEndpoint: 'https://api.bajajallianz.com/v1',
    commissionRate: 0.22, // 22%
    supportedCoverageTypes: ['loan_protection', 'critical_illness', 'asset_protection'],
    minPremium: 1200,
    maxCoverage: 4000000,
    responseTime: 60, // minutes
  },
  TATA_AIG: {
    name: 'Tata AIG',
    apiEndpoint: 'https://api.tataaig.com/v1',
    commissionRate: 0.25, // 25%
    supportedCoverageTypes: ['loan_protection', 'job_loss', 'critical_illness'],
    minPremium: 1500,
    maxCoverage: 2500000,
    responseTime: 90, // minutes
  },
};

// Risk Profile Interface
export interface RiskProfile {
  creditScore: number;
  employmentType: string;
  monthlyIncome: number;
  loanAmount: number;
  loanTenure: number;
  vehicleType: string;
  age: number;
  healthStatus: string;
  occupation: string;
  experience: number;
  existingEmis: number;
  customerId?: string;
}

// Insurance Quote Interface
export interface InsuranceQuote {
  providerId: string;
  providerName: string;
  coverageType: string;
  premium: number;
  coverage: number;
  terms: string[];
  commission: number;
  responseTime: number;
  rating: number;
}

// Insurance Policy Interface
export interface InsurancePolicy {
  id: string;
  applicationId: string;
  providerId: string;
  policyNumber: string;
  coverageType: string;
  premiumAmount: number;
  coverageAmount: number;
  startDate: Date;
  endDate: Date;
  status: string;
  customerId: string;
  loanAmount: number;
  monthlyPremium: number | null;
  autoRenewal: boolean;
}

// Claims Interface
export interface InsuranceClaim {
  id: string;
  policyId: string;
  providerId: string;
  claimNumber: string;
  claimType: string;
  claimAmount: number;
  status: string;
  description: string | null;
  documents: string | null;
  submittedAt: Date;
  processedAt: Date | null;
  approvedAt: Date | null;
  paidAt: Date | null;
  rejectionReason: string | null;
  payoutAmount: number | null;
}

// Insurance Service Class
export class InsuranceService {
  // Calculate risk multiplier based on profile
  private calculateRiskMultiplier(profile: RiskProfile): number {
    let multiplier = 1.0;

    // Credit score impact (0.7 - 1.3)
    if (profile.creditScore >= 750) multiplier *= 0.7;
    else if (profile.creditScore >= 650) multiplier *= 0.9;
    else if (profile.creditScore >= 550) multiplier *= 1.1;
    else multiplier *= 1.3;

    // Employment type impact
    if (profile.employmentType === 'salaried') multiplier *= 0.9;
    else if (profile.employmentType === 'self_employed') multiplier *= 1.1;
    else multiplier *= 1.2;

    // Age impact
    if (profile.age < 30) multiplier *= 0.9;
    else if (profile.age < 50) multiplier *= 1.0;
    else multiplier *= 1.2;

    // Income impact
    if (profile.monthlyIncome > 100000) multiplier *= 0.8;
    else if (profile.monthlyIncome > 50000) multiplier *= 0.9;
    else multiplier *= 1.1;

    // Existing EMIs impact
    if (profile.existingEmis > profile.monthlyIncome * 0.5) multiplier *= 1.3;
    else if (profile.existingEmis > profile.monthlyIncome * 0.3) multiplier *= 1.1;

    return Math.max(0.5, Math.min(2.0, multiplier));
  }

  // Calculate base premium for coverage type
  private getBasePremium(coverageType: string, loanAmount: number): number {
    const baseRates = {
      loan_protection: 0.025, // 2.5% of loan amount
      job_loss: 0.015, // 1.5% of loan amount
      critical_illness: 0.020, // 2.0% of loan amount
      asset_protection: 0.030, // 3.0% of loan amount
    };

    return loanAmount * (baseRates[coverageType as keyof typeof baseRates] || 0.025);
  }

  // Get volume discount based on total policies
  private async getVolumeDiscount(providerId: string): Promise<number> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const monthlyPolicies = await prisma.insurancePolicy.count({
      where: {
        providerId,
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

    if (monthlyPolicies >= 1000) return 0.8; // 20% discount
    if (monthlyPolicies >= 500) return 0.85; // 15% discount
    if (monthlyPolicies >= 100) return 0.9; // 10% discount
    return 1.0; // No discount
  }

  // Calculate premium for a specific provider and coverage
  async calculatePremium(
    providerId: string,
    coverageType: string,
    profile: RiskProfile
  ): Promise<number> {
    const provider = INSURANCE_PROVIDERS[providerId as keyof typeof INSURANCE_PROVIDERS];
    if (!provider) throw new Error('Invalid insurance provider');

    const basePremium = this.getBasePremium(coverageType, profile.loanAmount);
    const riskMultiplier = this.calculateRiskMultiplier(profile);
    const volumeDiscount = await this.getVolumeDiscount(providerId);

    let premium = basePremium * riskMultiplier * volumeDiscount;

    // Apply minimum premium constraint
    premium = Math.max(premium, provider.minPremium);

    // Apply maximum coverage constraint
    const maxCoverage = Math.min(premium / 0.025, provider.maxCoverage);
    if (profile.loanAmount > maxCoverage) {
      premium = (maxCoverage * 0.025) * riskMultiplier * volumeDiscount;
    }

    return Math.round(premium);
  }

  // Get insurance quotes from multiple providers
  async getInsuranceQuotes(
    coverageType: string,
    profile: RiskProfile
  ): Promise<InsuranceQuote[]> {
    const quotes: InsuranceQuote[] = [];

    for (const [providerId, provider] of Object.entries(INSURANCE_PROVIDERS)) {
      if (provider.supportedCoverageTypes.includes(coverageType)) {
        try {
          const premium = await this.calculatePremium(providerId, coverageType, profile);
          const commission = premium * provider.commissionRate;

          quotes.push({
            providerId,
            providerName: provider.name,
            coverageType,
            premium,
            coverage: profile.loanAmount,
            terms: this.getTermsForCoverage(coverageType),
            commission,
            responseTime: provider.responseTime,
            rating: this.calculateProviderRating(providerId),
          });
        } catch (error) {
          console.error(`Error calculating premium for ${provider.name}:`, error);
        }
      }
    }

    // Sort by premium (lowest first)
    return quotes.sort((a, b) => a.premium - b.premium);
  }

  // Get terms and conditions for coverage type
  private getTermsForCoverage(coverageType: string): string[] {
    const terms = {
      loan_protection: [
        'Covers loan amount in case of death or permanent disability',
        'Waiting period of 30 days for natural death',
        'No waiting period for accidental death',
        'Coverage valid for entire loan tenure',
      ],
      job_loss: [
        'Covers EMIs for up to 12 months during unemployment',
        'Waiting period of 90 days from policy start',
        'Requires proof of involuntary job loss',
        'Maximum coverage period of 12 months',
      ],
      critical_illness: [
        'Covers 37 critical illnesses as per standard definition',
        'Waiting period of 90 days',
        'Lump sum payout on diagnosis',
        'Coverage amount up to loan amount',
      ],
      asset_protection: [
        'Covers vehicle damage due to accident or theft',
        'Includes roadside assistance',
        'Covers repair costs up to vehicle value',
        '24/7 customer support',
      ],
    };

    return terms[coverageType as keyof typeof terms] || [];
  }

  // Calculate provider rating based on performance
  private calculateProviderRating(providerId: string): number {
    // This would typically be based on historical data
    const ratings = {
      ICICI_LOMBARD: 4.5,
      HDFC_ERGO: 4.3,
      BAJAJ_ALLIANZ: 4.2,
      TATA_AIG: 4.0,
    };

    return ratings[providerId as keyof typeof ratings] || 4.0;
  }

  // Create insurance policy
  async createPolicy(
    applicationId: string,
    providerId: string,
    coverageType: string,
    profile: RiskProfile
  ): Promise<InsurancePolicy> {
    const premium = await this.calculatePremium(providerId, coverageType, profile);
    const provider = INSURANCE_PROVIDERS[providerId as keyof typeof INSURANCE_PROVIDERS];

    // Generate policy number
    const policyNumber = `POL-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate policy dates
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + Math.ceil(profile.loanTenure / 12));

    const policy = await prisma.insurancePolicy.create({
      data: {
        applicationId,
        providerId,
        policyNumber,
        coverageType,
        premiumAmount: premium,
        coverageAmount: profile.loanAmount,
        startDate,
        endDate,
        status: 'ACTIVE',
        customerId: profile.customerId || '',
        loanAmount: profile.loanAmount,
        monthlyPremium: premium / Math.ceil(profile.loanTenure / 12),
        autoRenewal: true,
      },
    });

    // Update analytics
    await this.updateInsuranceAnalytics(providerId, 'policy_created', premium);

    return policy;
  }

  // Submit insurance claim
  async submitClaim(
    policyId: string,
    claimType: string,
    claimAmount: number,
    description: string,
    documents: string[]
  ): Promise<InsuranceClaim> {
    const policy = await prisma.insurancePolicy.findUnique({
      where: { id: policyId },
    });

    if (!policy) throw new Error('Policy not found');
    if (policy.status !== 'ACTIVE') throw new Error('Policy is not active');

    const claimNumber = `CLM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const claim = await prisma.insuranceClaim.create({
      data: {
        policyId,
        providerId: policy.providerId,
        claimNumber,
        claimType,
        claimAmount,
        status: 'PENDING',
        description,
        documents: JSON.stringify(documents),
        submittedAt: new Date(),
      },
    });

    // Update analytics
    await this.updateInsuranceAnalytics(policy.providerId, 'claim_submitted', claimAmount);

    return claim;
  }

  // Process insurance claim (simulate provider processing)
  async processClaim(claimId: string, approved: boolean, payoutAmount?: number): Promise<InsuranceClaim> {
    const claim = await prisma.insuranceClaim.findUnique({
      where: { id: claimId },
    });

    if (!claim) throw new Error('Claim not found');

    const updateData: any = {
      status: approved ? 'APPROVED' : 'REJECTED',
      processedAt: new Date(),
    };

    if (approved) {
      updateData.approvedAt = new Date();
      updateData.payoutAmount = payoutAmount || claim.claimAmount;
      updateData.paidAt = new Date();
      updateData.status = 'PAID';
    } else {
      updateData.rejectionReason = 'Claim rejected based on policy terms';
    }

    const updatedClaim = await prisma.insuranceClaim.update({
      where: { id: claimId },
      data: updateData,
    });

    // Update analytics
    await this.updateInsuranceAnalytics(claim.providerId, 'claim_processed', payoutAmount || 0);

    return updatedClaim;
  }

  // Update insurance analytics
  private async updateInsuranceAnalytics(providerId: string, action: string, amount: number): Promise<void> {
    const today = new Date();
    const dateKey = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const existing = await prisma.insuranceAnalytics.findUnique({
      where: {
        providerId_date: {
          providerId,
          date: dateKey,
        },
      },
    });

    if (existing) {
      const updateData: any = {};
      
      if (action === 'policy_created') {
        updateData.totalPolicies = { increment: 1 };
        updateData.activePolicies = { increment: 1 };
        updateData.totalPremium = { increment: amount };
      } else if (action === 'claim_submitted') {
        updateData.totalClaims = { increment: 1 };
      } else if (action === 'claim_processed') {
        updateData.approvedClaims = { increment: 1 };
        updateData.totalPayout = { increment: amount };
      }

      await prisma.insuranceAnalytics.update({
        where: { id: existing.id },
        data: updateData,
      });
    } else {
      const initialData: any = {
        providerId,
        date: dateKey,
        totalPolicies: action === 'policy_created' ? 1 : 0,
        activePolicies: action === 'policy_created' ? 1 : 0,
        totalClaims: action === 'claim_submitted' ? 1 : 0,
        approvedClaims: action === 'claim_processed' ? 1 : 0,
        totalPremium: action === 'policy_created' ? amount : 0,
        totalPayout: action === 'claim_processed' ? amount : 0,
      };

      await prisma.insuranceAnalytics.create({
        data: initialData,
      });
    }
  }

  // Get insurance analytics for dashboard
  async getInsuranceAnalytics(providerId?: string, dateRange?: { start: Date; end: Date }) {
    const where: any = {};
    
    if (providerId) where.providerId = providerId;
    if (dateRange) {
      where.date = {
        gte: dateRange.start,
        lte: dateRange.end,
      };
    }

    const analytics = await prisma.insuranceAnalytics.findMany({
      where,
      include: {
        provider: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return analytics;
  }

  // Get policies for an application
  async getPoliciesForApplication(applicationId: string): Promise<InsurancePolicy[]> {
    return await prisma.insurancePolicy.findMany({
      where: { applicationId },
      include: {
        provider: true,
        claims: true,
      },
    });
  }

  // Get claims for a policy
  async getClaimsForPolicy(policyId: string): Promise<InsuranceClaim[]> {
    return await prisma.insuranceClaim.findMany({
      where: { policyId },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }
}

// Export singleton instance
export const insuranceService = new InsuranceService(); 