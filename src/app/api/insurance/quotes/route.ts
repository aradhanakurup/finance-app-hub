import { NextRequest, NextResponse } from 'next/server';
import { insuranceService, type RiskProfile } from '@/services/insuranceService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coverageType, riskProfile } = body;

    if (!coverageType || !riskProfile) {
      return NextResponse.json(
        { error: 'Coverage type and risk profile are required' },
        { status: 400 }
      );
    }

    // Validate coverage type
    const validCoverageTypes = ['loan_protection', 'job_loss', 'critical_illness', 'asset_protection'];
    if (!validCoverageTypes.includes(coverageType)) {
      return NextResponse.json(
        { error: 'Invalid coverage type' },
        { status: 400 }
      );
    }

    // Validate risk profile
    const requiredFields = [
      'creditScore', 'employmentType', 'monthlyIncome', 'loanAmount',
      'loanTenure', 'vehicleType', 'age', 'healthStatus', 'occupation',
      'experience', 'existingEmis'
    ];

    for (const field of requiredFields) {
      if (!(field in riskProfile)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get insurance quotes
    const quotes = await insuranceService.getInsuranceQuotes(coverageType, riskProfile as RiskProfile);

    return NextResponse.json({
      success: true,
      data: {
        coverageType,
        quotes,
        totalQuotes: quotes.length,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error getting insurance quotes:', error);
    return NextResponse.json(
      { error: 'Failed to get insurance quotes' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return available coverage types and providers
    const coverageTypes = [
      {
        id: 'loan_protection',
        name: 'Loan Protection Insurance',
        description: 'Covers loan amount in case of death or permanent disability',
        baseRate: 2.5,
      },
      {
        id: 'job_loss',
        name: 'Job Loss Protection',
        description: 'Covers EMIs during unemployment for up to 12 months',
        baseRate: 1.5,
      },
      {
        id: 'critical_illness',
        name: 'Critical Illness Coverage',
        description: 'Lump sum payout on diagnosis of critical illness',
        baseRate: 2.0,
      },
      {
        id: 'asset_protection',
        name: 'Asset Protection',
        description: 'Covers vehicle damage due to accident or theft',
        baseRate: 3.0,
      },
    ];

    const providers = [
      {
        id: 'ICICI_LOMBARD',
        name: 'ICICI Lombard',
        rating: 4.5,
        responseTime: 30,
        supportedCoverageTypes: ['loan_protection', 'job_loss', 'critical_illness', 'asset_protection'],
      },
      {
        id: 'HDFC_ERGO',
        name: 'HDFC Ergo',
        rating: 4.3,
        responseTime: 45,
        supportedCoverageTypes: ['loan_protection', 'job_loss', 'asset_protection'],
      },
      {
        id: 'BAJAJ_ALLIANZ',
        name: 'Bajaj Allianz',
        rating: 4.2,
        responseTime: 60,
        supportedCoverageTypes: ['loan_protection', 'critical_illness', 'asset_protection'],
      },
      {
        id: 'TATA_AIG',
        name: 'Tata AIG',
        rating: 4.0,
        responseTime: 90,
        supportedCoverageTypes: ['loan_protection', 'job_loss', 'critical_illness'],
      },
    ];

    return NextResponse.json({
      success: true,
      data: {
        coverageTypes,
        providers,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error getting insurance info:', error);
    return NextResponse.json(
      { error: 'Failed to get insurance information' },
      { status: 500 }
    );
  }
} 