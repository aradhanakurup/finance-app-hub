import { NextRequest, NextResponse } from 'next/server';
import { lenderIntegrationService } from '../../../../../services/lenderIntegrationService';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params;
    
    if (!applicationId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Application ID is required',
        },
        { status: 400 }
      );
    }

    // Get application status from all lenders
    const applications = await lenderIntegrationService.getApplicationStatus(applicationId);
    const submission = await lenderIntegrationService.getSubmissionDetails(applicationId);

    // Calculate summary statistics
    const totalLenders = applications.length;
    const approvedLenders = applications.filter(app => app.status === 'APPROVED').length;
    const pendingLenders = applications.filter(app => 
      ['PENDING', 'SUBMITTED', 'UNDER_REVIEW'].includes(app.status)
    ).length;
    const rejectedLenders = applications.filter(app => app.status === 'REJECTED').length;

    // Get best offers
    const approvedOffers = applications
      .filter(app => app.status === 'APPROVED' && app.interestRate)
      .sort((a, b) => (a.interestRate || 0) - (b.interestRate || 0));

    const bestOffer = approvedOffers[0];
    const allOffers = applications
      .filter(app => app.interestRate)
      .sort((a, b) => (a.interestRate || 0) - (b.interestRate || 0));

    return NextResponse.json({
      success: true,
      data: {
        applicationId,
        submission,
        applications,
        summary: {
          totalLenders,
          approvedLenders,
          pendingLenders,
          rejectedLenders,
          approvalRate: totalLenders > 0 ? approvedLenders / totalLenders : 0,
        },
        offers: {
          bestOffer,
          allOffers: allOffers.slice(0, 3), // Top 3 offers
          totalOffers: approvedOffers.length,
        },
      },
      message: 'Application status retrieved successfully',
    });

  } catch (error) {
    console.error('Error fetching application status:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch application status',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params;
    const body = await request.json();
    const { action, lenderId, data } = body;

    switch (action) {
      case 'retry':
        if (!lenderId) {
          return NextResponse.json(
            {
              success: false,
              message: 'Lender ID is required for retry',
            },
            { status: 400 }
          );
        }

        const success = await lenderIntegrationService.retryFailedApplication(applicationId, lenderId);
        
        return NextResponse.json({
          success: true,
          data: { success },
          message: success ? 'Application retry initiated' : 'Retry failed',
        });

      case 'simulate_webhook':
        if (!lenderId || !data?.status) {
          return NextResponse.json(
            {
              success: false,
              message: 'Lender ID and status are required for webhook simulation',
            },
            { status: 400 }
          );
        }

        await lenderIntegrationService.simulateLenderWebhook(
          applicationId,
          lenderId,
          data.status,
          data
        );

        return NextResponse.json({
          success: true,
          message: 'Webhook simulation completed',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid action',
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error processing application action:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process action',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 