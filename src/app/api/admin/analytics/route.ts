import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { asyncHandler } from '@/middleware/errorHandler';

const prisma = new PrismaClient();

async function getAnalytics(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get('range') || '30d';

  // Calculate date range
  const now = new Date();
  let startDate = new Date();
  
  switch (range) {
    case '7d':
      startDate.setDate(now.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(now.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setDate(now.getDate() - 30);
  }

  // Get application statistics
  const applications = await prisma.application.findMany({
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    include: {
      lenderApplications: true,
    },
  });

  const totalApplications = applications.length;
  const submittedApplications = applications.filter(app => app.status === 'SUBMITTED').length;
  const approvedApplications = applications.filter(app => 
    app.lenderApplications.some(la => la.status === 'APPROVED')
  ).length;
  const rejectedApplications = applications.filter(app => 
    app.lenderApplications.every(la => la.status === 'REJECTED')
  ).length;
  const pendingApplications = applications.filter(app => 
    app.lenderApplications.some(la => la.status === 'PENDING' || la.status === 'UNDER_REVIEW')
  ).length;

  // Get lender performance
  const lenderStats = await prisma.lenderApplication.groupBy({
    by: ['lenderId'],
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    _count: {
      id: true,
    },
    _avg: {
      responseTime: true,
    },
  });

  const lenders = await prisma.lender.findMany({
    where: {
      id: {
        in: lenderStats.map(stat => stat.lenderId),
      },
    },
  });

  const lenderPerformance = lenders.map(lender => {
    const stats = lenderStats.find(stat => stat.lenderId === lender.id);
    const approvedCount = applications.filter(app =>
      app.lenderApplications.some(la => 
        la.lenderId === lender.id && la.status === 'APPROVED'
      )
    ).length;
    
    return {
      name: lender.name,
      applications: stats?._count.id || 0,
      approvalRate: stats?._count.id ? (approvedCount / stats._count.id) * 100 : 0,
      avgResponseTime: stats?._avg.responseTime || 0,
    };
  });

  // Get monthly trends
  const monthlyData = await prisma.application.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: startDate,
      },
    },
    _count: {
      id: true,
    },
  });

  const monthlyTrends = monthlyData.reduce((acc, data) => {
    const month = new Date(data.createdAt).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.applications += data._count.id;
    } else {
      acc.push({
        month,
        applications: data._count.id,
        approvals: 0, // Calculate based on approved applications
        revenue: 0, // Calculate based on processing fees
      });
    }
    return acc;
  }, [] as Array<{ month: string; applications: number; approvals: number; revenue: number }>);

  // Calculate time metrics
  const approvedLenderApps = await prisma.lenderApplication.findMany({
    where: {
      status: 'APPROVED',
      createdAt: {
        gte: startDate,
      },
    },
    select: {
      submittedAt: true,
      respondedAt: true,
    },
  });

  const avgProcessingTime = approvedLenderApps.length > 0
    ? approvedLenderApps.reduce((sum, app) => {
        const processingTime = app.respondedAt 
          ? (new Date(app.respondedAt).getTime() - new Date(app.submittedAt).getTime()) / (1000 * 60 * 60)
          : 0;
        return sum + processingTime;
      }, 0) / approvedLenderApps.length
    : 0;

  // Mock customer satisfaction data (in production, this would come from actual reviews)
  const customerSatisfaction = {
    rating: 4.2,
    totalReviews: 156,
    positiveFeedback: 87,
  };

  return NextResponse.json({
    applications: {
      total: totalApplications,
      submitted: submittedApplications,
      approved: approvedApplications,
      rejected: rejectedApplications,
      pending: pendingApplications,
    },
    timeMetrics: {
      avgProcessingTime: Math.round(avgProcessingTime),
      avgApprovalTime: Math.round(avgProcessingTime * 0.8),
      timeSavings: Math.round(avgProcessingTime * 2), // Assuming 2x faster than traditional
    },
    lenderPerformance,
    monthlyTrends,
    customerSatisfaction,
  });
}

export const GET = asyncHandler(getAnalytics); 