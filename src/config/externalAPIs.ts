// External API Configuration
// This file contains all the configuration for external API integrations

export const EXTERNAL_API_CONFIG = {
  // PAN/Aadhaar Verification APIs
  PAN_AADHAAR: {
    // NSDL PAN Verification API
    NSDL_PAN: {
      baseUrl: process.env.NSDL_PAN_API_URL || 'https://api.nsdl.co.in/pan-verification',
      apiKey: process.env.NSDL_PAN_API_KEY || 'demo-key',
      timeout: 10000
    },
    // UIDAI Aadhaar Verification API
    UIDAI_AADHAAR: {
      baseUrl: process.env.UIDAI_AADHAAR_API_URL || 'https://api.uidai.gov.in/aadhaar-verification',
      apiKey: process.env.UIDAI_AADHAAR_API_KEY || 'demo-key',
      timeout: 10000
    },
    // Alternative: DigiLocker API
    DIGILOCKER: {
      baseUrl: process.env.DIGILOCKER_API_URL || 'https://api.digilocker.gov.in',
      clientId: process.env.DIGILOCKER_CLIENT_ID || 'demo-client-id',
      clientSecret: process.env.DIGILOCKER_CLIENT_SECRET || 'demo-secret',
      timeout: 15000
    }
  },

  // Credit Bureau APIs
  CREDIT_BUREAU: {
    // CIBIL API
    CIBIL: {
      baseUrl: process.env.CIBIL_API_URL || 'https://api.cibil.com',
      apiKey: process.env.CIBIL_API_KEY || 'demo-key',
      username: process.env.CIBIL_USERNAME || 'demo-user',
      password: process.env.CIBIL_PASSWORD || 'demo-pass',
      timeout: 20000
    },
    // Experian API
    EXPERIAN: {
      baseUrl: process.env.EXPERIAN_API_URL || 'https://api.experian.com',
      apiKey: process.env.EXPERIAN_API_KEY || 'demo-key',
      timeout: 20000
    },
    // Equifax API
    EQUIFAX: {
      baseUrl: process.env.EQUIFAX_API_URL || 'https://api.equifax.com',
      apiKey: process.env.EQUIFAX_API_KEY || 'demo-key',
      timeout: 20000
    },
    // CRIF High Mark API
    CRIF: {
      baseUrl: process.env.CRIF_API_URL || 'https://api.crifhighmark.com',
      apiKey: process.env.CRIF_API_KEY || 'demo-key',
      timeout: 20000
    }
  },

  // Bank Statement Analysis APIs
  BANK_STATEMENT: {
    // Account Aggregator APIs
    ACCOUNT_AGGREGATOR: {
      baseUrl: process.env.AA_API_URL || 'https://api.accountaggregator.org',
      clientId: process.env.AA_CLIENT_ID || 'demo-client-id',
      clientSecret: process.env.AA_CLIENT_SECRET || 'demo-secret',
      timeout: 30000
    },
    // Yodlee API for bank data
    YODLEE: {
      baseUrl: process.env.YODLEE_API_URL || 'https://api.yodlee.com',
      apiKey: process.env.YODLEE_API_KEY || 'demo-key',
      timeout: 30000
    },
    // Plaid API (if available in India)
    PLAID: {
      baseUrl: process.env.PLAID_API_URL || 'https://api.plaid.com',
      clientId: process.env.PLAID_CLIENT_ID || 'demo-client-id',
      secret: process.env.PLAID_SECRET || 'demo-secret',
      timeout: 30000
    }
  },

  // Income Verification APIs
  INCOME_VERIFICATION: {
    // EPFO API for salary verification
    EPFO: {
      baseUrl: process.env.EPFO_API_URL || 'https://api.epfo.gov.in',
      apiKey: process.env.EPFO_API_KEY || 'demo-key',
      timeout: 15000
    },
    // IT Department API for income verification
    INCOME_TAX: {
      baseUrl: process.env.INCOME_TAX_API_URL || 'https://api.incometax.gov.in',
      apiKey: process.env.INCOME_TAX_API_KEY || 'demo-key',
      timeout: 15000
    },
    // GST API for business income verification
    GST: {
      baseUrl: process.env.GST_API_URL || 'https://api.gst.gov.in',
      apiKey: process.env.GST_API_KEY || 'demo-key',
      timeout: 15000
    }
  },

  // Document Verification APIs
  DOCUMENT_VERIFICATION: {
    // OCR APIs for document processing
    OCR: {
      // Google Vision API
      GOOGLE_VISION: {
        apiKey: process.env.GOOGLE_VISION_API_KEY || 'demo-key',
        timeout: 10000
      },
      // AWS Textract
      AWS_TEXTRACT: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'demo-key',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'demo-secret',
        region: process.env.AWS_REGION || 'us-east-1',
        timeout: 10000
      }
    }
  },

  // General Settings
  GENERAL: {
    retryAttempts: 3,
    retryDelay: 1000,
    defaultTimeout: 15000,
    enableMockData: process.env.ENABLE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development'
  }
}

// API Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  PAN_VERIFICATION: {
    requestsPerMinute: 60,
    requestsPerHour: 1000
  },
  AADHAAR_VERIFICATION: {
    requestsPerMinute: 30,
    requestsPerHour: 500
  },
  CREDIT_BUREAU: {
    requestsPerMinute: 10,
    requestsPerHour: 100
  },
  BANK_STATEMENT: {
    requestsPerMinute: 20,
    requestsPerHour: 200
  },
  INCOME_VERIFICATION: {
    requestsPerMinute: 15,
    requestsPerHour: 150
  }
}

// Error Messages for different API failures
export const API_ERROR_MESSAGES = {
  PAN_VERIFICATION_FAILED: 'PAN verification service is temporarily unavailable. Please try again later.',
  AADHAAR_VERIFICATION_FAILED: 'Aadhaar verification service is temporarily unavailable. Please try again later.',
  CREDIT_BUREAU_FAILED: 'Credit bureau data is temporarily unavailable. Using estimated credit score.',
  BANK_STATEMENT_FAILED: 'Bank statement analysis is temporarily unavailable. Using provided data.',
  INCOME_VERIFICATION_FAILED: 'Income verification is temporarily unavailable. Using provided income details.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.'
}

// Production API Endpoints (replace with actual endpoints)
export const PRODUCTION_ENDPOINTS = {
  // Real PAN verification endpoints
  PAN_VERIFICATION: {
    NSDL: 'https://api.nsdl.co.in/pan-verification/v1/verify',
    UIDAI: 'https://api.uidai.gov.in/pan-verification/v1/verify'
  },
  
  // Real Aadhaar verification endpoints
  AADHAAR_VERIFICATION: {
    UIDAI: 'https://api.uidai.gov.in/aadhaar-verification/v1/verify',
    DIGILOCKER: 'https://api.digilocker.gov.in/aadhaar-verification/v1/verify'
  },
  
  // Real Credit Bureau endpoints
  CREDIT_BUREAU: {
    CIBIL: 'https://api.cibil.com/credit-report/v1/fetch',
    EXPERIAN: 'https://api.experian.com/credit-report/v1/fetch',
    EQUIFAX: 'https://api.equifax.com/credit-report/v1/fetch',
    CRIF: 'https://api.crifhighmark.com/credit-report/v1/fetch'
  },
  
  // Real Bank Statement endpoints
  BANK_STATEMENT: {
    ACCOUNT_AGGREGATOR: 'https://api.accountaggregator.org/consent/v1/fetch',
    YODLEE: 'https://api.yodlee.com/accounts/v1/fetch'
  },
  
  // Real Income Verification endpoints
  INCOME_VERIFICATION: {
    EPFO: 'https://api.epfo.gov.in/salary/v1/verify',
    INCOME_TAX: 'https://api.incometax.gov.in/income/v1/verify',
    GST: 'https://api.gst.gov.in/business/v1/verify'
  }
} 