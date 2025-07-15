import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export function errorHandler(
  error: AppError,
  req: NextRequest
): NextResponse {
  // Log error to Sentry in production
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      extra: {
        url: req.url,
        method: req.method,
        headers: Object.fromEntries(req.headers.entries()),
      },
    });
  }

  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
  }

  const statusCode = error.statusCode || 500;
  const message = error.isOperational 
    ? error.message 
    : 'Internal Server Error';

  return NextResponse.json(
    {
      error: message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.url,
    },
    { status: statusCode }
  );
}

export function asyncHandler(fn: (req: NextRequest, context?: { params?: Record<string, string> }) => Promise<NextResponse>) {
  return async (req: NextRequest, context?: { params?: Record<string, string> }) => {
    try {
      return await fn(req, context);
    } catch (error) {
      return errorHandler(error as AppError, req);
    }
  };
} 