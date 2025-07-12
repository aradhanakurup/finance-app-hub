import { NextRequest, NextResponse } from 'next/server';
import { mockLenderService } from '../../../services/mockLenderService';

export async function GET(request: NextRequest) {
  try {
    const lenders = await mockLenderService.getAllLenders();
    
    return NextResponse.json({
      success: true,
      data: lenders,
      message: 'Lenders retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching lenders:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch lenders',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, lenderId, data } = body;

    switch (action) {
      case 'update_status':
        // Update lender status (activate/deactivate)
        return NextResponse.json({
          success: true,
          message: 'Lender status updated successfully',
        });

      case 'test_connection':
        // Test lender API connection
        const lender = await mockLenderService.getLenderStatus(lenderId);
        if (!lender) {
          return NextResponse.json(
            {
              success: false,
              message: 'Lender not found',
            },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Lender connection test successful',
          data: {
            lenderId,
            status: 'connected',
            responseTime: lender.avgResponseTime,
          },
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
    console.error('Error processing lender request:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process request',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 