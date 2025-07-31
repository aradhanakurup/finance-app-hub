import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {};
    
    if (email) {
      where.user = { email: { contains: email, mode: 'insensitive' } };
    }
    
    if (phone) {
      where.user = { ...where.user, phone: { contains: phone, mode: 'insensitive' } };
    }
    
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Fetch applications with related data
    const applications = await prisma.application.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          }
        },
        vehicle: true,
        insurancePolicies: {
          include: {
            provider: true
          }
        },
        lenderApplications: {
          include: {
            lender: true
          }
        },
        payments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data for frontend
    const transformedApplications = applications.map((app: any) => {
      const customerName = `${app.user?.firstName || ''} ${app.user?.lastName || ''}`.trim();
      
      // Get selected lenders
      const selectedLenders = app.lenderApplications.map((la: any) => la.lender.name);
      
      // Get insurance policy info
      const insurancePolicy = app.insurancePolicies[0] ? {
        providerName: app.insurancePolicies[0].provider.name,
        coverageType: app.insurancePolicies[0].coverageType,
        premium: app.insurancePolicies[0].premium,
        status: app.insurancePolicies[0].status
      } : undefined;

      // Get payment status
      const latestPayment = app.payments[app.payments.length - 1];
      const paymentStatus = latestPayment ? latestPayment.status : 'PENDING';

      // Determine application type based on features
      const applicationType = app.premiumFeatures ? 'PREMIUM' : 'FREE';

      // Determine priority based on loan amount and features
      let priority: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
      if (app.vehicle?.loanAmount && app.vehicle.loanAmount > 800000) {
        priority = 'HIGH';
      } else if (app.vehicle?.loanAmount && app.vehicle.loanAmount < 300000) {
        priority = 'LOW';
      }

      return {
        id: app.id,
        customerName: customerName || 'Unknown',
        email: app.user?.email || '',
        phone: app.user?.phone || '',
        loanAmount: app.vehicle?.loanAmount || 0,
        vehicleMake: app.vehicle?.make || '',
        vehicleModel: app.vehicle?.model || '',
        status: app.status,
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
        submittedAt: app.submittedAt?.toISOString(),
        approvedAt: app.approvedAt?.toISOString(),
        rejectedAt: app.rejectedAt?.toISOString(),
        paidAt: app.paidAt?.toISOString(),
        completedAt: app.completedAt?.toISOString(),
        selectedLenders,
        insurancePolicy,
        paymentStatus,
        applicationType,
        priority
      };
    });

    // Calculate statistics
    const stats = {
      total: applications.length,
      approved: applications.filter((app: any) => app.status === 'APPROVED').length,
      processing: applications.filter((app: any) => app.status === 'PROCESSING').length,
      pending: applications.filter((app: any) => app.status === 'SUBMITTED').length,
      rejected: applications.filter((app: any) => app.status === 'REJECTED').length,
      draft: applications.filter((app: any) => app.status === 'DRAFT').length,
      paid: applications.filter((app: any) => app.status === 'PAID').length,
      completed: applications.filter((app: any) => app.status === 'COMPLETED').length
    };

    return NextResponse.json({
      success: true,
      data: {
        applications: transformedApplications,
        stats,
        total: transformedApplications.length
      }
    });

  } catch (error) {
    console.error('Error fetching applications for tracker:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone is required' },
        { status: 400 }
      );
    }

    // Build where clause
    const where: any = {};
    
    if (email) {
      where.user = { email: { contains: email, mode: 'insensitive' } };
    }
    
    if (phone) {
      where.user = { ...where.user, phone: { contains: phone, mode: 'insensitive' } };
    }

    // Fetch applications
    const applications = await prisma.application.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          }
        },
        vehicle: true,
        insurancePolicies: {
          include: {
            provider: true
          }
        },
        lenderApplications: {
          include: {
            lender: true
          }
        },
        payments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (applications.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No applications found with the provided email or phone number.'
      });
    }

    // Transform data (same as GET)
    const transformedApplications = applications.map((app: any) => {
      const customerName = `${app.user?.firstName || ''} ${app.user?.lastName || ''}`.trim();
      
      const selectedLenders = app.lenderApplications.map((la: any) => la.lender.name);
      
      const insurancePolicy = app.insurancePolicies[0] ? {
        providerName: app.insurancePolicies[0].provider.name,
        coverageType: app.insurancePolicies[0].coverageType,
        premium: app.insurancePolicies[0].premium,
        status: app.insurancePolicies[0].status
      } : undefined;

      const latestPayment = app.payments[app.payments.length - 1];
      const paymentStatus = latestPayment ? latestPayment.status : 'PENDING';

      const applicationType = app.premiumFeatures ? 'PREMIUM' : 'FREE';

      let priority: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM';
      if (app.vehicle?.loanAmount && app.vehicle.loanAmount > 800000) {
        priority = 'HIGH';
      } else if (app.vehicle?.loanAmount && app.vehicle.loanAmount < 300000) {
        priority = 'LOW';
      }

      return {
        id: app.id,
        customerName: customerName || 'Unknown',
        email: app.user?.email || '',
        phone: app.user?.phone || '',
        loanAmount: app.vehicle?.loanAmount || 0,
        vehicleMake: app.vehicle?.make || '',
        vehicleModel: app.vehicle?.model || '',
        status: app.status,
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
        submittedAt: app.submittedAt?.toISOString(),
        approvedAt: app.approvedAt?.toISOString(),
        rejectedAt: app.rejectedAt?.toISOString(),
        paidAt: app.paidAt?.toISOString(),
        completedAt: app.completedAt?.toISOString(),
        selectedLenders,
        insurancePolicy,
        paymentStatus,
        applicationType,
        priority
      };
    });

    const stats = {
      total: applications.length,
      approved: applications.filter((app: any) => app.status === 'APPROVED').length,
      processing: applications.filter((app: any) => app.status === 'PROCESSING').length,
      pending: applications.filter((app: any) => app.status === 'SUBMITTED').length,
      rejected: applications.filter((app: any) => app.status === 'REJECTED').length,
      draft: applications.filter((app: any) => app.status === 'DRAFT').length,
      paid: applications.filter((app: any) => app.status === 'PAID').length,
      completed: applications.filter((app: any) => app.status === 'COMPLETED').length
    };

    return NextResponse.json({
      success: true,
      data: {
        applications: transformedApplications,
        stats,
        total: transformedApplications.length
      }
    });

  } catch (error) {
    console.error('Error searching applications:', error);
    return NextResponse.json(
      { error: 'Failed to search applications' },
      { status: 500 }
    );
  }
} 