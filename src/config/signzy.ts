// Signzy Configuration
// Unified API platform configuration for all verification services

export const SIGNZY_CONFIG = {
  // Base Configuration
  BASE: {
    baseUrl: process.env.SIGNZY_BASE_URL || 'https://api.signzy.com',
    apiKey: process.env.SIGNZY_API_KEY || 'demo-key',
    clientId: process.env.SIGNZY_CLIENT_ID || 'demo-client-id',
    clientSecret: process.env.SIGNZY_CLIENT_SECRET || 'demo-secret',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },

  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      token: '/auth/token',
      refresh: '/auth/refresh'
    },

    // Verification Services
    VERIFICATION: {
      pan: '/verification/pan',
      aadhaar: '/verification/aadhaar',
      drivingLicense: '/verification/driving-license',
      passport: '/verification/passport',
      voterId: '/verification/voter-id'
    },

    // Credit Bureau
    CREDIT: {
      report: '/credit/report',
      score: '/credit/score',
      history: '/credit/history'
    },

    // Bank Statement Analysis
    BANK: {
      statementAnalysis: '/bank/statement-analysis',
      accountAggregator: '/bank/aa',
      consent: '/bank/consent'
    },

    // KYC Services
    KYC: {
      videoKYC: '/kyc/video',
      documentKYC: '/kyc/document',
      faceMatch: '/kyc/face-match',
      liveness: '/kyc/liveness',
      ocr: '/kyc/ocr'
    },

    // Income Verification
    INCOME: {
      itr: '/income/itr',
      epfo: '/income/epfo',
      gst: '/income/gst',
      bankSalary: '/income/bank-salary'
    },

    // Document Processing
    DOCUMENT: {
      ocr: '/ocr/extract',
      verification: '/document/verify',
      classification: '/document/classify'
    },

    // Account Aggregator
    ACCOUNT_AGGREGATOR: {
      consent: '/aa/consent',
      fetch: '/aa/fetch',
      discover: '/aa/discover'
    }
  },

  // Service Configuration
  SERVICES: {
    // PAN Verification
    PAN: {
      providers: ['NSDL', 'UIDAI'],
      defaultProvider: 'NSDL',
      timeout: 10000
    },

    // Aadhaar Verification
    AADHAAR: {
      providers: ['UIDAI', 'DIGILOCKER'],
      defaultProvider: 'UIDAI',
      timeout: 10000,
      requireConsent: true
    },

    // Credit Bureau
    CREDIT_BUREAU: {
      providers: ['CIBIL', 'CRIF', 'EXPERIAN', 'EQUIFAX'],
      defaultProvider: 'CIBIL',
      timeout: 20000,
      maxRetries: 2
    },

    // Bank Statement
    BANK_STATEMENT: {
      providers: ['ACCOUNT_AGGREGATOR', 'YODLEE', 'PLAID'],
      defaultProvider: 'ACCOUNT_AGGREGATOR',
      timeout: 30000,
      maxDays: 90
    },

    // Video KYC
    VIDEO_KYC: {
      providers: ['SIGNZY', 'KARVY', 'CAMS'],
      defaultProvider: 'SIGNZY',
      timeout: 60000,
      maxDuration: 300 // 5 minutes
    },

    // Income Verification
    INCOME: {
      providers: ['EPFO', 'ITR', 'GST'],
      defaultProvider: 'EPFO',
      timeout: 15000
    }
  },

  // Rate Limiting
  RATE_LIMITS: {
    PAN_VERIFICATION: {
      requestsPerMinute: 60,
      requestsPerHour: 1000
    },
    AADHAAR_VERIFICATION: {
      requestsPerMinute: 30,
      requestsPerHour: 500
    },
    CREDIT_REPORT: {
      requestsPerMinute: 10,
      requestsPerHour: 100
    },
    BANK_STATEMENT: {
      requestsPerMinute: 20,
      requestsPerHour: 200
    },
    VIDEO_KYC: {
      requestsPerMinute: 5,
      requestsPerHour: 50
    },
    INCOME_VERIFICATION: {
      requestsPerMinute: 15,
      requestsPerHour: 150
    }
  },

  // Error Messages
  ERROR_MESSAGES: {
    AUTHENTICATION_FAILED: 'Signzy authentication failed. Please check your credentials.',
    PAN_VERIFICATION_FAILED: 'PAN verification service is temporarily unavailable.',
    AADHAAR_VERIFICATION_FAILED: 'Aadhaar verification service is temporarily unavailable.',
    CREDIT_REPORT_FAILED: 'Credit bureau data is temporarily unavailable.',
    BANK_STATEMENT_FAILED: 'Bank statement analysis is temporarily unavailable.',
    VIDEO_KYC_FAILED: 'Video KYC service is temporarily unavailable.',
    INCOME_VERIFICATION_FAILED: 'Income verification is temporarily unavailable.',
    RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    INVALID_REQUEST: 'Invalid request parameters.',
    CONSENT_REQUIRED: 'User consent is required for this operation.'
  },

  // Development Settings
  DEVELOPMENT: {
    enableMockData: process.env.ENABLE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development',
    mockDelay: 1000, // Simulate API delay
    mockErrorRate: 0.05 // 5% error rate for testing
  }
}

// Signzy API Response Types
export interface SignzyAPIResponse<T> {
  success: boolean
  data?: T
  error?: string
  requestId?: string
  timestamp: string
  metadata?: {
    provider?: string
    processingTime?: number
    confidence?: number
  }
}

// Signzy Error Types
export enum SignzyErrorType {
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PROVIDER_ERROR = 'PROVIDER_ERROR',
  CONSENT_ERROR = 'CONSENT_ERROR'
}

export interface SignzyError {
  type: SignzyErrorType
  message: string
  code?: string
  details?: any
  retryable: boolean
}

// Signzy Pricing (approximate)
export const SIGNZY_PRICING = {
  PAN_VERIFICATION: {
    perVerification: 2, // ₹2 per verification
    bulkDiscount: {
      '1000+': 1.5,
      '5000+': 1.2,
      '10000+': 1.0
    }
  },
  AADHAAR_VERIFICATION: {
    perVerification: 1.5, // ₹1.5 per verification
    bulkDiscount: {
      '1000+': 1.2,
      '5000+': 1.0,
      '10000+': 0.8
    }
  },
  CREDIT_REPORT: {
    perReport: 50, // ₹50 per report
    bulkDiscount: {
      '100+': 45,
      '500+': 40,
      '1000+': 35
    }
  },
  BANK_STATEMENT: {
    perAnalysis: 15, // ₹15 per analysis
    bulkDiscount: {
      '100+': 12,
      '500+': 10,
      '1000+': 8
    }
  },
  VIDEO_KYC: {
    perKYC: 25, // ₹25 per KYC
    bulkDiscount: {
      '100+': 20,
      '500+': 18,
      '1000+': 15
    }
  },
  INCOME_VERIFICATION: {
    perVerification: 10, // ₹10 per verification
    bulkDiscount: {
      '100+': 8,
      '500+': 7,
      '1000+': 6
    }
  }
}

// Signzy Compliance & Security
export const SIGNZY_COMPLIANCE = {
  // Data Protection
  DATA_PROTECTION: {
    encryption: 'AES-256',
    dataRetention: '7 years',
    dataLocalization: 'India',
    auditTrail: true
  },

  // Regulatory Compliance
  REGULATORY: {
    rbiCompliant: true,
    uidaiCompliant: true,
    pdpbCompliant: true,
    iso27001: true,
    soc2: true
  },

  // Security Features
  SECURITY: {
    sslTls: true,
    apiKeyRotation: true,
    ipWhitelisting: true,
    rateLimiting: true,
    requestSigning: true
  }
}

// Signzy Integration Checklist
export const SIGNZY_INTEGRATION_CHECKLIST = [
  'Sign up for Signzy developer account',
  'Complete KYC and compliance verification',
  'Get API credentials (API Key, Client ID, Secret)',
  'Set up webhook endpoints for async responses',
  'Configure rate limiting and error handling',
  'Test all verification services in sandbox',
  'Implement proper consent management',
  'Set up monitoring and alerting',
  'Configure data retention policies',
  'Train team on Signzy dashboard usage'
] 