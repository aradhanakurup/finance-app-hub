import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { errorHandler, AppError } from '@/middleware/errorHandler';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, context: { params: Promise<Record<string, string>> }) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build where clause
    const where: Record<string, unknown> = {};
    if (status) {
      where.status = status;
    }

    // Get dealers with documents
    const dealers = await prisma.dealer.findMany({
      where,
      include: {
        documents: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: limit,
    });

    // Get total count
    const total = await prisma.dealer.count({ where });

    return NextResponse.json({
      dealers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorHandler(error as AppError, req);
  }
} 