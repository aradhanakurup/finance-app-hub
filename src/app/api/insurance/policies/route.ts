import { NextRequest, NextResponse } from 'next/server';
import { insuranceService, type RiskProfile } from '@/services/insuranceService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, providerId, coverageType, riskProfile } = body;

    if (!applicationId || !providerId || !coverageType || !riskProfile) {
      return NextResponse.json(
        { error: 'Application ID, provider ID, coverage type, and risk profile are required' },
        { status: 400 }
      );
    }

    // Validate provider
    const validProviders = ['ICICI_LOMBARD', 'HDFC_ERGO', 'BAJAJ_ALLIANZ', 'TATA_AIG'];
    if (!validProviders.includes(providerId)) {
      return NextResponse.json(
        { error: 'Invalid insurance provider' },
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

    // Create insurance policy
    const policy = await insuranceService.createPolicy(
      applicationId,
      providerId,
      coverageType,
      riskProfile as RiskProfile
    );

    return NextResponse.json({
      success: true,
      data: {
        policy,
        message: 'Insurance policy created successfully',
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error creating insurance policy:', error);
    return NextResponse.json(
      { error: 'Failed to create insurance policy' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');
    const customerId = searchParams.get('customerId');

    if (!applicationId && !customerId) {
      return NextResponse.json(
        { error: 'Application ID or customer ID is required' },
        { status: 400 }
      );
    }

    let policies: any[] = [];

    if (applicationId) {
      policies = await insuranceService.getPoliciesForApplication(applicationId);
    } else {
      // Get policies by customer ID (you might want to add this method to the service)
      policies = [];
    }

    return NextResponse.json({
      success: true,
      data: {
        policies,
        totalPolicies: policies.length,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error getting insurance policies:', error);
    return NextResponse.json(
      { error: 'Failed to get insurance policies' },
      { status: 500 }
    );
  }
} 