// Signzy API Integration Service
// Unified middleware platform for all verification services

interface SignzyConfig {
  baseUrl: string
  apiKey: string
  clientId: string
  clientSecret: string
  timeout: number
}

interface SignzyResponse<T> {
  success: boolean
  data?: T
  error?: string
  requestId?: string
  timestamp: string
}

interface PANVerificationResponse {
  isValid: boolean
  name?: string
  status?: string
  dateOfIssue?: string
  error?: string
}

interface AadhaarVerificationResponse {
  isValid: boolean
  name?: string
  dob?: string
  status?: string
  maskedAadhaar?: string
  error?: string
}

interface CreditReportResponse {
  creditScore: number
  bureauName: string
  reportDate: string
  totalAccounts: number
  activeAccounts: number
  overdueAccounts: number
  paymentHistory: Array<{
    month: string
    status: string
  }>
  creditUtilization: number
  error?: string
}

interface BankStatementResponse {
  monthlyInflow: number
  monthlyOutflow: number
  averageBalance: number
  bouncedCheques: number
  inflowTrend: 'increasing' | 'decreasing' | 'stable'
  salaryCredits: number
  emiDebits: number
  categorizedTransactions: Array<{
    category: string
    amount: number
    count: number
  }>
  error?: string
}

interface VideoKYCResponse {
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  verificationId: string
  faceMatchScore: number
  livenessScore: number
  documentVerified: boolean
  error?: string
}

interface IncomeVerificationResponse {
  verifiedIncome: number
  verificationMethod: string
  confidence: number
  lastVerified: string
  itrData?: {
    totalIncome: number
    assessmentYear: string
    filingDate: string
  }
  epfoData?: {
    monthlySalary: number
    employerName: string
    uanNumber: string
  }
  error?: string
}

interface DocumentOCRResponse {
  extractedData: {
    [key: string]: string
  }
  confidence: number
  documentType: string
  error?: string
}

export class SignzyAPI {
  private config: SignzyConfig
  private accessToken: string | null = null
  private tokenExpiry: number = 0

  constructor() {
    this.config = {
      baseUrl: process.env.SIGNZY_BASE_URL || 'https://api.signzy.com',
      apiKey: process.env.SIGNZY_API_KEY || 'demo-key',
      clientId: process.env.SIGNZY_CLIENT_ID || 'demo-client-id',
      clientSecret: process.env.SIGNZY_CLIENT_SECRET || 'demo-secret',
      timeout: 30000
    }
  }

  // Authentication
  private async authenticate(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': this.config.apiKey
        },
        body: JSON.stringify({
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret
        })
      })

      const data = await response.json()
      
      if (data.success) {
        this.accessToken = data.accessToken
        this.tokenExpiry = Date.now() + (data.expiresIn * 1000)
        return this.accessToken
      } else {
        throw new Error('Authentication failed')
      }
    } catch (error) {
      console.error('Signzy authentication error:', error)
      throw error
    }
  }

  // Generic API call method
  private async makeRequest<T>(endpoint: string, method: string = 'GET', body?: any): Promise<SignzyResponse<T>> {
    try {
      const token = await this.authenticate()
      
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-API-KEY': this.config.apiKey
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(this.config.timeout)
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`Signzy API error (${endpoint}):`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }
    }
  }

  // PAN Verification
  async verifyPAN(panNumber: string): Promise<PANVerificationResponse> {
    try {
      const response = await this.makeRequest<PANVerificationResponse>('/verification/pan', 'POST', {
        panNumber,
        verificationType: 'NSDL'
      })

      if (response.success && response.data) {
        return response.data
      } else {
        return {
          isValid: false,
          error: response.error || 'PAN verification failed'
        }
      }
    } catch (error) {
      console.error('PAN verification error:', error)
      return {
        isValid: false,
        error: 'PAN verification service unavailable'
      }
    }
  }

  // Aadhaar Verification
  async verifyAadhaar(aadhaarNumber: string, consent: boolean = true): Promise<AadhaarVerificationResponse> {
    try {
      const response = await this.makeRequest<AadhaarVerificationResponse>('/verification/aadhaar', 'POST', {
        aadhaarNumber,
        consent,
        verificationType: 'UIDAI'
      })

      if (response.success && response.data) {
        return response.data
      } else {
        return {
          isValid: false,
          error: response.error || 'Aadhaar verification failed'
        }
      }
    } catch (error) {
      console.error('Aadhaar verification error:', error)
      return {
        isValid: false,
        error: 'Aadhaar verification service unavailable'
      }
    }
  }

  // Credit Report (Multi-bureau)
  async getCreditReport(panNumber: string, aadhaarNumber: string): Promise<CreditReportResponse> {
    try {
      const response = await this.makeRequest<CreditReportResponse>('/credit/report', 'POST', {
        panNumber,
        aadhaarNumber,
        bureaus: ['CIBIL', 'CRIF', 'EXPERIAN'],
        consent: true
      })

      if (response.success && response.data) {
        return response.data
      } else {
        return {
          creditScore: 0,
          bureauName: 'Unknown',
          reportDate: new Date().toISOString(),
          totalAccounts: 0,
          activeAccounts: 0,
          overdueAccounts: 0,
          paymentHistory: [],
          creditUtilization: 0,
          error: response.error || 'Credit report fetch failed'
        }
      }
    } catch (error) {
      console.error('Credit report error:', error)
      return {
        creditScore: 0,
        bureauName: 'Unknown',
        reportDate: new Date().toISOString(),
        totalAccounts: 0,
        activeAccounts: 0,
        overdueAccounts: 0,
        paymentHistory: [],
        creditUtilization: 0,
        error: 'Credit report service unavailable'
      }
    }
  }

  // Bank Statement Analysis (Account Aggregator)
  async analyzeBankStatement(
    consentHandle: string,
    accountId: string,
    fromDate: string,
    toDate: string
  ): Promise<BankStatementResponse> {
    try {
      const response = await this.makeRequest<BankStatementResponse>('/bank/statement-analysis', 'POST', {
        consentHandle,
        accountId,
        fromDate,
        toDate,
        analysisType: 'COMPREHENSIVE'
      })

      if (response.success && response.data) {
        return response.data
      } else {
        return {
          monthlyInflow: 0,
          monthlyOutflow: 0,
          averageBalance: 0,
          bouncedCheques: 0,
          inflowTrend: 'stable',
          salaryCredits: 0,
          emiDebits: 0,
          categorizedTransactions: [],
          error: response.error || 'Bank statement analysis failed'
        }
      }
    } catch (error) {
      console.error('Bank statement analysis error:', error)
      return {
        monthlyInflow: 0,
        monthlyOutflow: 0,
        averageBalance: 0,
        bouncedCheques: 0,
        inflowTrend: 'stable',
        salaryCredits: 0,
        emiDebits: 0,
        categorizedTransactions: [],
        error: 'Bank statement analysis service unavailable'
      }
    }
  }

  // Video KYC
  async initiateVideoKYC(
    customerId: string,
    documentType: 'PAN' | 'AADHAAR' | 'DRIVING_LICENSE' | 'PASSPORT'
  ): Promise<VideoKYCResponse> {
    try {
      const response = await this.makeRequest<VideoKYCResponse>('/kyc/video/initiate', 'POST', {
        customerId,
        documentType,
        kycType: 'VIDEO_KYC'
      })

      if (response.success && response.data) {
        return response.data
      } else {
        return {
          kycStatus: 'PENDING',
          verificationId: '',
          faceMatchScore: 0,
          livenessScore: 0,
          documentVerified: false,
          error: response.error || 'Video KYC initiation failed'
        }
      }
    } catch (error) {
      console.error('Video KYC error:', error)
      return {
        kycStatus: 'PENDING',
        verificationId: '',
        faceMatchScore: 0,
        livenessScore: 0,
        documentVerified: false,
        error: 'Video KYC service unavailable'
      }
    }
  }

  // Document OCR
  async extractDocumentData(
    documentFile: File,
    documentType: string
  ): Promise<DocumentOCRResponse> {
    try {
      const formData = new FormData()
      formData.append('document', documentFile)
      formData.append('documentType', documentType)

      const token = await this.authenticate()
      
      const response = await fetch(`${this.config.baseUrl}/ocr/extract`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-API-KEY': this.config.apiKey
        },
        body: formData,
        signal: AbortSignal.timeout(this.config.timeout)
      })

      const data = await response.json()

      if (data.success && data.data) {
        return data.data
      } else {
        return {
          extractedData: {},
          confidence: 0,
          documentType,
          error: data.error || 'Document OCR failed'
        }
      }
    } catch (error) {
      console.error('Document OCR error:', error)
      return {
        extractedData: {},
        confidence: 0,
        documentType,
        error: 'Document OCR service unavailable'
      }
    }
  }

  // Income Verification
  async verifyIncome(
    panNumber: string,
    verificationType: 'ITR' | 'EPFO' | 'BOTH'
  ): Promise<IncomeVerificationResponse> {
    try {
      const response = await this.makeRequest<IncomeVerificationResponse>('/income/verify', 'POST', {
        panNumber,
        verificationType,
        consent: true
      })

      if (response.success && response.data) {
        return response.data
      } else {
        return {
          verifiedIncome: 0,
          verificationMethod: 'manual',
          confidence: 0,
          lastVerified: new Date().toISOString(),
          error: response.error || 'Income verification failed'
        }
      }
    } catch (error) {
      console.error('Income verification error:', error)
      return {
        verifiedIncome: 0,
        verificationMethod: 'manual',
        confidence: 0,
        lastVerified: new Date().toISOString(),
        error: 'Income verification service unavailable'
      }
    }
  }

  // Account Aggregator Consent
  async createAAConsent(
    customerId: string,
    accountTypes: string[],
    purpose: string
  ): Promise<{ consentHandle: string; consentUrl: string }> {
    try {
      const response = await this.makeRequest<{ consentHandle: string; consentUrl: string }>('/aa/consent/create', 'POST', {
        customerId,
        accountTypes,
        purpose,
        validity: '1 year'
      })

      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.error || 'AA consent creation failed')
      }
    } catch (error) {
      console.error('AA consent creation error:', error)
      throw error
    }
  }

  // Mock responses for development
  private getMockResponse<T>(type: string, data: any): SignzyResponse<T> {
    if (process.env.NODE_ENV === 'development' && process.env.ENABLE_MOCK_DATA === 'true') {
      return {
        success: true,
        data: data as T,
        requestId: `mock-${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    }
    return {
      success: false,
      error: 'Mock data disabled',
      timestamp: new Date().toISOString()
    }
  }

  // Development mode methods
  async getMockPANVerification(panNumber: string): Promise<PANVerificationResponse> {
    // Always return mock data in development
    return {
      isValid: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber),
      name: 'MOCK USER NAME',
      status: 'ACTIVE',
      dateOfIssue: '2010-01-01'
    }
  }

  async getMockCreditReport(panNumber: string): Promise<CreditReportResponse> {
    const panHash = panNumber.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0)
    return {
      creditScore: 650 + (panHash % 200),
      bureauName: 'CIBIL',
      reportDate: new Date().toISOString(),
      totalAccounts: 3 + (panHash % 5),
      activeAccounts: 2 + (panHash % 3),
      overdueAccounts: panHash % 2,
      paymentHistory: [
        { month: '2024-01', status: 'PAID' },
        { month: '2023-12', status: 'PAID' },
        { month: '2023-11', status: 'PAID' }
      ],
      creditUtilization: 30 + (panHash % 40)
    }
  }
}

// Export singleton instance
export const signzyAPI = new SignzyAPI() 