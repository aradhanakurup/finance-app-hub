import { NextRequest, NextResponse } from 'next/server';
import { insuranceService } from '@/services/insuranceService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { policyId, claimType, claimAmount, description, documents } = body;

    if (!policyId || !claimType || !claimAmount) {
      return NextResponse.json(
        { error: 'Policy ID, claim type, and claim amount are required' },
        { status: 400 }
      );
    }

    // Validate claim type
    const validClaimTypes = ['death', 'disability', 'job_loss', 'asset_damage'];
    if (!validClaimTypes.includes(claimType)) {
      return NextResponse.json(
        { error: 'Invalid claim type' },
        { status: 400 }
      );
    }

    // Validate claim amount
    if (claimAmount <= 0) {
      return NextResponse.json(
        { error: 'Claim amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Submit claim
    const claim = await insuranceService.submitClaim(
      policyId,
      claimType,
      claimAmount,
      description || '',
      documents || []
    );

    return NextResponse.json({
      success: true,
      data: {
        claim,
        message: 'Insurance claim submitted successfully',
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error submitting insurance claim:', error);
    return NextResponse.json(
      { error: 'Failed to submit insurance claim' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const policyId = searchParams.get('policyId');
    const claimId = searchParams.get('claimId');

    if (!policyId && !claimId) {
      return NextResponse.json(
        { error: 'Policy ID or claim ID is required' },
        { status: 400 }
      );
    }

    let claims: any[] = [];

    if (policyId) {
      claims = await insuranceService.getClaimsForPolicy(policyId);
    } else if (claimId) {
      // Get specific claim (you might want to add this method to the service)
      claims = [];
    }

    return NextResponse.json({
      success: true,
      data: {
        claims,
        totalClaims: claims.length,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error getting insurance claims:', error);
    return NextResponse.json(
      { error: 'Failed to get insurance claims' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimId, approved, payoutAmount } = body;

    if (!claimId || typeof approved !== 'boolean') {
      return NextResponse.json(
        { error: 'Claim ID and approval status are required' },
        { status: 400 }
      );
    }

    // Process claim
    const claim = await insuranceService.processClaim(claimId, approved, payoutAmount);

    return NextResponse.json({
      success: true,
      data: {
        claim,
        message: `Claim ${approved ? 'approved' : 'rejected'} successfully`,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error processing insurance claim:', error);
    return NextResponse.json(
      { error: 'Failed to process insurance claim' },
      { status: 500 }
    );
  }
} 