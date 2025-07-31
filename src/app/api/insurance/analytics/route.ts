import { NextRequest, NextResponse } from 'next/server';
import { insuranceService } from '@/services/insuranceService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const providerId = searchParams.get('providerId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let dateRange;
    if (startDate && endDate) {
      dateRange = {
        start: new Date(startDate),
        end: new Date(endDate),
      };
    }

    // Get insurance analytics
    const analytics = await insuranceService.getInsuranceAnalytics(providerId || undefined, dateRange);

    // Calculate summary metrics
    const summary: any = {
      totalPolicies: analytics.reduce((sum, item) => sum + item.totalPolicies, 0),
      activePolicies: analytics.reduce((sum, item) => sum + item.activePolicies, 0),
      totalClaims: analytics.reduce((sum, item) => sum + item.totalClaims, 0),
      approvedClaims: analytics.reduce((sum, item) => sum + item.approvedClaims, 0),
      totalPremium: analytics.reduce((sum, item) => sum + item.totalPremium, 0),
      totalPayout: analytics.reduce((sum, item) => sum + item.totalPayout, 0),
      commissionEarned: analytics.reduce((sum, item) => sum + item.commissionEarned, 0),
    };

    // Calculate claims ratio
    summary.claimsRatio = summary.totalPremium > 0 ? (summary.totalPayout / summary.totalPremium) * 100 : 0;

    // Get provider performance
    const providerPerformance = analytics.map(item => ({
      providerId: item.providerId,
      providerName: item.provider.name,
      totalPolicies: item.totalPolicies,
      activePolicies: item.activePolicies,
      totalClaims: item.totalClaims,
      approvedClaims: item.approvedClaims,
      totalPremium: item.totalPremium,
      totalPayout: item.totalPayout,
      claimsRatio: item.claimsRatio,
      commissionEarned: item.commissionEarned,
    }));

    return NextResponse.json({
      success: true,
      data: {
        summary,
        providerPerformance,
        analytics,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error getting insurance analytics:', error);
    return NextResponse.json(
      { error: 'Failed to get insurance analytics' },
      { status: 500 }
    );
  }
} 