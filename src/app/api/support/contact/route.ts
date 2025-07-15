import { NextRequest, NextResponse } from 'next/server';
import { CustomError, errorHandler, AppError } from '@/middleware/errorHandler';

export async function POST(req: NextRequest, context: { params: Promise<Record<string, string>> }) {
  try {
    // ... your contact logic here ...
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorHandler(error as AppError, req);
  }
} 