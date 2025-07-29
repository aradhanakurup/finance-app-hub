import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { calculateCommission, calculatePerformanceBonus } from '@/config/commission';

const prisma = new PrismaClient();

interface CommissionTrackingRequest {
  lenderId?: string;
  dealerId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  status?: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lenderId = searchParams.get('lenderId');
    const dealerId = searchParams.get('dealerId');
    const status = searchParams.get('status') as 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED' | null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build where clause
    const whereClause: any = {};
    
    if (lenderId) {
      whereClause.lenderId = lenderId;
    }
    
    if (dealerId) {
      whereClause.dealerId = dealerId;
    }
    
    if (status) {
      whereClause.status = status;
    }
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // In production, you would query the actual commission table
    // For now, we'll return mock data
    const mockCommissions = [
      {
        id: 'COM-001',
        applicationId: 'APP-001',
        lenderId: 'LENDER-001',
        dealerId: 'DEALER-001',
        customerName: 'Rahul Sharma',
        loanAmount: 850000,
        commissionAmount: 12750,
        status: 'PAID',
        createdAt: '2024-01-15T10:30:00Z',
        paidAt: '2024-02-01T09:00:00Z',
        lenderName: 'HDFC Bank',
        dealerName: 'ABC Motors',
        vehicleType: 'CAR',
        commissionRate: 1.5,
        platformCommission: 8925,
        dealerCommission: 3825,
      },
      {
        id: 'COM-002',
        applicationId: 'APP-002',
        lenderId: 'LENDER-001',
        dealerId: 'DEALER-002',
        customerName: 'Priya Patel',
        loanAmount: 650000,
        commissionAmount: 9750,
        status: 'APPROVED',
        createdAt: '2024-01-20T14:20:00Z',
        lenderName: 'HDFC Bank',
        dealerName: 'XYZ Dealers',
        vehicleType: 'BIKE',
        commissionRate: 1.5,
        platformCommission: 6825,
        dealerCommission: 2925,
      },
      {
        id: 'COM-003',
        applicationId: 'APP-003',
        lenderId: 'LENDER-002',
        dealerId: 'DEALER-001',
        customerName: 'Amit Kumar',
        loanAmount: 1200000,
        commissionAmount: 18000,
        status: 'PENDING',
        createdAt: '2024-01-25T11:45:00Z',
        lenderName: 'ICICI Bank',
        dealerName: 'ABC Motors',
        vehicleType: 'CAR',
        commissionRate: 1.5,
        platformCommission: 12600,
        dealerCommission: 5400,
      },
      {
        id: 'COM-004',
        applicationId: 'APP-004',
        lenderId: 'LENDER-003',
        dealerId: 'DEALER-003',
        customerName: 'Sneha Reddy',
        loanAmount: 450000,
        commissionAmount: 6750,
        status: 'PAID',
        createdAt: '2024-01-28T16:15:00Z',
        paidAt: '2024-02-05T10:30:00Z',
        lenderName: 'SBI',
        dealerName: 'PQR Auto',
        vehicleType: 'BIKE',
        commissionRate: 1.5,
        platformCommission: 4725,
        dealerCommission: 2025,
      },
    ];

    // Filter mock data based on parameters
    let filteredCommissions = mockCommissions;
    
    if (lenderId) {
      filteredCommissions = filteredCommissions.filter(com => com.lenderId === lenderId);
    }
    
    if (dealerId) {
      filteredCommissions = filteredCommissions.filter(com => com.dealerId === dealerId);
    }
    
    if (status) {
      filteredCommissions = filteredCommissions.filter(com => com.status === status);
    }

    // Calculate summary statistics
    const totalCommissions = filteredCommissions.reduce((sum, com) => sum + com.commissionAmount, 0);
    const paidCommissions = filteredCommissions.filter(com => com.status === 'PAID').reduce((sum, com) => sum + com.commissionAmount, 0);
    const pendingCommissions = filteredCommissions.filter(com => com.status === 'PENDING').reduce((sum, com) => sum + com.commissionAmount, 0);
    const approvedCommissions = filteredCommissions.filter(com => com.status === 'APPROVED').reduce((sum, com) => sum + com.commissionAmount, 0);

    const platformCommissions = filteredCommissions.reduce((sum, com) => sum + com.platformCommission, 0);
    const dealerCommissions = filteredCommissions.reduce((sum, com) => sum + com.dealerCommission, 0);

    // Group by lender
    const lenderStats = filteredCommissions.reduce((acc, com) => {
      if (!acc[com.lenderId]) {
        acc[com.lenderId] = {
          lenderId: com.lenderId,
          lenderName: com.lenderName,
          totalCommissions: 0,
          totalApplications: 0,
          paidCommissions: 0,
          pendingCommissions: 0,
        };
      }
      
      acc[com.lenderId].totalCommissions += com.commissionAmount;
      acc[com.lenderId].totalApplications += 1;
      
      if (com.status === 'PAID') {
        acc[com.lenderId].paidCommissions += com.commissionAmount;
      } else if (com.status === 'PENDING') {
        acc[com.lenderId].pendingCommissions += com.commissionAmount;
      }
      
      return acc;
    }, {} as Record<string, any>);

    // Group by dealer
    const dealerStats = filteredCommissions.reduce((acc, com) => {
      if (!acc[com.dealerId]) {
        acc[com.dealerId] = {
          dealerId: com.dealerId,
          dealerName: com.dealerName,
          totalCommissions: 0,
          totalApplications: 0,
          paidCommissions: 0,
          pendingCommissions: 0,
        };
      }
      
      acc[com.dealerId].totalCommissions += com.dealerCommission;
      acc[com.dealerId].totalApplications += 1;
      
      if (com.status === 'PAID') {
        acc[com.dealerId].paidCommissions += com.dealerCommission;
      } else if (com.status === 'PENDING') {
        acc[com.dealerId].pendingCommissions += com.dealerCommission;
      }
      
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      success: true,
      data: {
        commissions: filteredCommissions,
        summary: {
          totalCommissions,
          paidCommissions,
          pendingCommissions,
          approvedCommissions,
          platformCommissions,
          dealerCommissions,
          totalApplications: filteredCommissions.length,
        },
        lenderStats: Object.values(lenderStats),
        dealerStats: Object.values(dealerStats),
        pagination: {
          total: filteredCommissions.length,
          page: 1,
          limit: 50,
          totalPages: 1,
        },
      },
    });

  } catch (error) {
    console.error('Error tracking commissions:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to track commissions',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, lenderId, dealerId, loanAmount, commissionRate } = body;

    // Validate required fields
    if (!applicationId || !lenderId || !dealerId || !loanAmount || !commissionRate) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: applicationId, lenderId, dealerId, loanAmount, commissionRate',
        },
        { status: 400 }
      );
    }

    // Calculate commission
    const commissionAmount = loanAmount * (commissionRate / 100);
    
    // In production, you would save this to the database
    const commissionRecord = {
      id: `COM-${Date.now()}`,
      applicationId,
      lenderId,
      dealerId,
      commissionAmount,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      commissionRate,
    };

    // Mock database save
    console.log('Commission record created:', commissionRecord);

    return NextResponse.json({
      success: true,
      data: commissionRecord,
      message: 'Commission record created successfully',
    });

  } catch (error) {
    console.error('Error creating commission record:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create commission record',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 