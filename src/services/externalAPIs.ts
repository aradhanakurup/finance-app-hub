// External API Integration Service
// This service handles all external API calls for prescreening

interface PANVerificationResponse {
  isValid: boolean
  name?: string
  status?: string
  error?: string
}

interface AadhaarVerificationResponse {
  isValid: boolean
  name?: string
  dob?: string
  status?: string
  error?: string
}

interface CreditBureauResponse {
  creditScore: number
  bureauName: string
  reportDate: string
  totalAccounts: number
  activeAccounts: number
  overdueAccounts: number
  paymentHistory: any[]
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
  error?: string
}

interface IncomeVerificationResponse {
  verifiedIncome: number
  verificationMethod: string
  confidence: number
  lastVerified: string
  error?: string
}

export class ExternalAPIService {
  private apiKeys: {
    panAadhaarAPI: string
    creditBureauAPI: string
    bankStatementAPI: string
    incomeVerificationAPI: string
  }

  constructor() {
    // In production, these would come from environment variables
    this.apiKeys = {
      panAadhaarAPI: process.env.PAN_AADHAAR_API_KEY || 'demo-key',
      creditBureauAPI: process.env.CREDIT_BUREAU_API_KEY || 'demo-key',
      bankStatementAPI: process.env.BANK_STATEMENT_API_KEY || 'demo-key',
      incomeVerificationAPI: process.env.INCOME_VERIFICATION_API_KEY || 'demo-key'
    }
  }

  // PAN Verification API
  async verifyPAN(panNumber: string): Promise<PANVerificationResponse> {
    try {
      // For demo purposes, we'll use a mock response
      // In production, this would call the actual PAN verification API
      
      if (process.env.NODE_ENV === 'development') {
        // Mock response for development
        return this.mockPANVerification(panNumber)
      }

      // Production API call would look like this:
      /*
      const response = await fetch('https://api.pan-verification.com/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.panAadhaarAPI}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pan: panNumber })
      })
      
      const data = await response.json()
      return data
      */

      return this.mockPANVerification(panNumber)
    } catch (error) {
      console.error('PAN verification error:', error)
      return {
        isValid: false,
        error: 'PAN verification service unavailable'
      }
    }
  }

  // Aadhaar Verification API
  async verifyAadhaar(aadhaarNumber: string): Promise<AadhaarVerificationResponse> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return this.mockAadhaarVerification(aadhaarNumber)
      }

      // Production API call would be similar to PAN verification
      return this.mockAadhaarVerification(aadhaarNumber)
    } catch (error) {
      console.error('Aadhaar verification error:', error)
      return {
        isValid: false,
        error: 'Aadhaar verification service unavailable'
      }
    }
  }

  // Credit Bureau API (CIBIL, Experian, Equifax)
  async getCreditBureauData(panNumber: string, aadhaarNumber: string): Promise<CreditBureauResponse> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return this.mockCreditBureauData(panNumber)
      }

      // Production API call would fetch from multiple bureaus
      return this.mockCreditBureauData(panNumber)
    } catch (error) {
      console.error('Credit bureau data error:', error)
      return {
        creditScore: 0,
        bureauName: 'Unknown',
        reportDate: new Date().toISOString(),
        totalAccounts: 0,
        activeAccounts: 0,
        overdueAccounts: 0,
        paymentHistory: [],
        error: 'Credit bureau service unavailable'
      }
    }
  }

  // Bank Statement Analysis API
  async analyzeBankStatement(
    bankName: string, 
    accountNumber: string, 
    statementFile?: File
  ): Promise<BankStatementResponse> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return this.mockBankStatementAnalysis(bankName, accountNumber)
      }

      // Production API call would analyze actual bank statements
      return this.mockBankStatementAnalysis(bankName, accountNumber)
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
        error: 'Bank statement analysis service unavailable'
      }
    }
  }

  // Income Verification API
  async verifyIncome(
    companyName: string, 
    employeeId: string, 
    salarySlip?: File
  ): Promise<IncomeVerificationResponse> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return this.mockIncomeVerification(companyName, employeeId)
      }

      // Production API call would verify with employer or salary slip
      return this.mockIncomeVerification(companyName, employeeId)
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

  // Mock responses for development
  private mockPANVerification(panNumber: string): PANVerificationResponse {
    // Basic PAN format validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
    const isValid = panRegex.test(panNumber)
    
    return {
      isValid,
      name: isValid ? 'MOCK USER NAME' : undefined,
      status: isValid ? 'ACTIVE' : 'INVALID'
    }
  }

  private mockAadhaarVerification(aadhaarNumber: string): AadhaarVerificationResponse {
    // Basic Aadhaar format validation
    const aadhaarRegex = /^\d{12}$/
    const isValid = aadhaarRegex.test(aadhaarNumber)
    
    return {
      isValid,
      name: isValid ? 'MOCK USER NAME' : undefined,
      dob: isValid ? '1990-01-01' : undefined,
      status: isValid ? 'ACTIVE' : 'INVALID'
    }
  }

  private mockCreditBureauData(panNumber: string): CreditBureauResponse {
    // Generate a realistic credit score based on PAN
    const panHash = panNumber.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const creditScore = 650 + (panHash % 200) // Score between 650-850
    
    return {
      creditScore,
      bureauName: 'CIBIL',
      reportDate: new Date().toISOString(),
      totalAccounts: 3 + (panHash % 5),
      activeAccounts: 2 + (panHash % 3),
      overdueAccounts: panHash % 2,
      paymentHistory: [
        { month: '2024-01', status: 'PAID' },
        { month: '2023-12', status: 'PAID' },
        { month: '2023-11', status: 'PAID' }
      ]
    }
  }

  private mockBankStatementAnalysis(bankName: string, accountNumber: string): BankStatementResponse {
    // Generate realistic bank statement data
    const accountHash = accountNumber.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    
    return {
      monthlyInflow: 75000 + (accountHash % 50000),
      monthlyOutflow: 45000 + (accountHash % 30000),
      averageBalance: 150000 + (accountHash % 200000),
      bouncedCheques: accountHash % 3,
      inflowTrend: accountHash % 3 === 0 ? 'increasing' : accountHash % 3 === 1 ? 'decreasing' : 'stable',
      salaryCredits: 1 + (accountHash % 2),
      emiDebits: accountHash % 4
    }
  }

  private mockIncomeVerification(companyName: string, employeeId: string): IncomeVerificationResponse {
    // Generate realistic income verification data
    const employeeHash = employeeId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    
    return {
      verifiedIncome: 60000 + (employeeHash % 40000),
      verificationMethod: 'employer_verification',
      confidence: 85 + (employeeHash % 15),
      lastVerified: new Date().toISOString()
    }
  }
}

// Export singleton instance
export const externalAPIService = new ExternalAPIService() 