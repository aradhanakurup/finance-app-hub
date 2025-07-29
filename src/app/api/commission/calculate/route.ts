import { NextRequest, NextResponse } from 'next/server';
import { calculateCommission, calculatePerformanceBonus, COMMISSION_CONFIG } from '@/config/commission';

interface CommissionCalculationRequest {
  loanAmount: number;
  lenderId: string;
  dealerId: string;
  dealerPlan: 'basic' | 'professional' | 'enterprise';
  applicationId: string;
  customerName: string;
  vehicleDetails: {
    make: string;
    model: string;
    variant: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CommissionCalculationRequest = await request.json();
    const {
      loanAmount,
      lenderId,
      dealerId,
      dealerPlan,
      applicationId,
      customerName,
      vehicleDetails,
    } = body;

    // Validate required fields
    if (!loanAmount || !lenderId || !dealerId || !dealerPlan || !applicationId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: loanAmount, lenderId, dealerId, dealerPlan, applicationId',
        },
        { status: 400 }
      );
    }

    // Calculate base commission
    const commissionDetails = calculateCommission(loanAmount, lenderId, dealerPlan);

    // In production, you would fetch monthly stats from database
    const monthlyStats = {
      applications: 25, // Mock data - would come from database
      approvalRate: 0.85, // Mock data - would come from database
      totalLoanAmount: 2500000, // Mock data - would come from database
    };

    // Calculate performance bonus
    const bonusDetails = calculatePerformanceBonus(monthlyStats, commissionDetails.dealerCommission);

    // Calculate GST on platform commission
    const gstAmount = commissionDetails.platformCommission * COMMISSION_CONFIG.calculationRules.gst.rate;

    // Final commission breakdown
    const finalCommission = {
      applicationId,
      dealerId,
      customerName,
      vehicleDetails,
      loanDetails: {
        amount: loanAmount,
        lenderId,
        lenderName: getLenderName(lenderId),
      },
      commissionBreakdown: {
        totalCommission: commissionDetails.totalCommission,
        platformCommission: commissionDetails.platformCommission,
        dealerCommission: commissionDetails.dealerCommission,
        platformProcessingFee: commissionDetails.platformProcessingFee,
        dealerProcessingFee: commissionDetails.dealerProcessingFee,
        gstAmount,
        netPlatformCommission: commissionDetails.platformCommission - gstAmount,
      },
      performanceBonus: {
        bonusRate: bonusDetails.bonusRate,
        bonusAmount: bonusDetails.bonusAmount,
        totalDealerCommission: bonusDetails.totalAmount,
      },
      dealerPlan,
      commissionRate: commissionDetails.commissionRate,
      status: COMMISSION_CONFIG.status.PENDING,
      calculatedAt: new Date().toISOString(),
    };

    // In production, you would save this to the database
    // await saveCommissionRecord(finalCommission);

    return NextResponse.json({
      success: true,
      data: finalCommission,
      message: 'Commission calculated successfully',
    });

  } catch (error) {
    console.error('Error calculating commission:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to calculate commission',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper function to get lender name
function getLenderName(lenderId: string): string {
  const lenderNames: Record<string, string> = {
    hdfc: 'HDFC Bank',
    icici: 'ICICI Bank',
    sbi: 'State Bank of India',
    axis: 'Axis Bank',
    kotak: 'Kotak Mahindra Bank',
    bajaj: 'Bajaj Finance',
    tata: 'Tata Capital',
    mahindra: 'Mahindra Finance',
    chola: 'Cholamandalam Finance',
    fullerton: 'Fullerton India',
  };

  return lenderNames[lenderId] || lenderId.toUpperCase();
} 