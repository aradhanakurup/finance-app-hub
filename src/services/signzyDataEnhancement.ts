// Signzy Data Enhancement Service
// Enhances existing application data with Signzy verification without redundant API calls

import { signzyAPI } from './signzyAPI'

interface ApplicationData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    aadhaar: string
    pan: string
    dateOfBirth: string
    address: {
      street: string
      city: string
      state: string
      pincode: string
    }
  }
  employment: {
    employmentType: string
    companyName: string
    designation: string
    monthlyIncome: number
    experience: number
  }
  expenses: {
    rent: number
    utilities: number
    food: number
    transportation: number
    healthcare: number
    other: number
  }
  vehicle: {
    make: string
    model: string
    year: number
    variant: string
    price: number
    downPayment: number
    loanAmount: number
    tenure: number
  }
  income: {
    monthlyIncome: number
    existingEmis: number
    bankAccount?: {
      bankName: string
      accountNumber: string
      accountId?: string
      consentHandle?: string
    }
  }
  documents?: {
    panCard?: File
    aadhaarCard?: File
    salarySlip?: File
    bankStatement?: File
    addressProof?: File
  }
}

interface EnhancedApplicationData extends ApplicationData {
  verification: {
    pan: {
      isValid: boolean
      verifiedName?: string
      status?: string
      confidence: number
      lastVerified: string
    }
    aadhaar: {
      isValid: boolean
      verifiedName?: string
      status?: string
      confidence: number
      lastVerified: string
    }
    income: {
      verifiedIncome?: number
      verificationMethod?: string
      confidence: number
      lastVerified: string
    }
    credit: {
      creditScore?: number
      bureauName?: string
      totalAccounts?: number
      activeAccounts?: number
      overdueAccounts?: number
      confidence: number
      lastVerified: string
    }
    bankStatement?: {
      monthlyInflow?: number
      monthlyOutflow?: number
      averageBalance?: number
      bouncedCheques?: number
      inflowTrend?: string
      confidence: number
      lastVerified: string
    }
    kyc?: {
      status: 'PENDING' | 'APPROVED' | 'REJECTED'
      verificationId?: string
      faceMatchScore?: number
      livenessScore?: number
      confidence: number
      lastVerified: string
    }
  }
  riskAssessment: {
    overallRiskScore: number
    riskCategory: 'LOW' | 'MEDIUM' | 'HIGH'
    riskFactors: string[]
    recommendations: string[]
  }
}

interface VerificationCache {
  [key: string]: {
    data: any
    timestamp: number
    ttl: number
  }
}

export class SignzyDataEnhancement {
  private verificationCache: VerificationCache = {}
  private readonly CACHE_TTL = {
    PAN: 30 * 24 * 60 * 60 * 1000, // 30 days
    AADHAAR: 30 * 24 * 60 * 60 * 1000, // 30 days
    CREDIT: 7 * 24 * 60 * 60 * 1000, // 7 days
    INCOME: 7 * 24 * 60 * 60 * 1000, // 7 days
    BANK: 1 * 24 * 60 * 60 * 1000, // 1 day
    KYC: 90 * 24 * 60 * 60 * 1000 // 90 days
  }

  // Enhance application data with Signzy verification
  async enhanceApplicationData(applicationData: ApplicationData): Promise<EnhancedApplicationData> {
    const enhancedData: EnhancedApplicationData = {
      ...applicationData,
      verification: {
        pan: { isValid: false, confidence: 0, lastVerified: new Date().toISOString() },
        aadhaar: { isValid: false, confidence: 0, lastVerified: new Date().toISOString() },
        income: { confidence: 0, lastVerified: new Date().toISOString() },
        credit: { confidence: 0, lastVerified: new Date().toISOString() },
        bankStatement: { confidence: 0, lastVerified: new Date().toISOString() },
        kyc: { status: 'PENDING', confidence: 0, lastVerified: new Date().toISOString() }
      },
      riskAssessment: {
        overallRiskScore: 0,
        riskCategory: 'HIGH',
        riskFactors: [],
        recommendations: []
      }
    }

    try {
      // Parallel verification of all data points
      const [
        panVerification,
        aadhaarVerification,
        creditVerification,
        incomeVerification,
        bankVerification
      ] = await Promise.allSettled([
        this.verifyPAN(applicationData.personalInfo.pan),
        this.verifyAadhaar(applicationData.personalInfo.aadhaar),
        this.verifyCredit(applicationData.personalInfo.pan, applicationData.personalInfo.aadhaar),
        this.verifyIncome(applicationData.personalInfo.pan, applicationData.employment),
        this.verifyBankStatement(applicationData.income.bankAccount)
      ])

      // Update verification results
      if (panVerification.status === 'fulfilled') {
        enhancedData.verification.pan = panVerification.value
      }
      if (aadhaarVerification.status === 'fulfilled') {
        enhancedData.verification.aadhaar = aadhaarVerification.value
      }
      if (creditVerification.status === 'fulfilled') {
        enhancedData.verification.credit = creditVerification.value
      }
      if (incomeVerification.status === 'fulfilled') {
        enhancedData.verification.income = incomeVerification.value
      }
      if (bankVerification.status === 'fulfilled') {
        enhancedData.verification.bankStatement = bankVerification.value
      }

      // Calculate risk assessment
      enhancedData.riskAssessment = this.calculateRiskAssessment(enhancedData)

      return enhancedData
    } catch (error) {
      console.error('Error enhancing application data:', error)
      return enhancedData
    }
  }

  // Verify PAN with caching
  private async verifyPAN(pan: string): Promise<EnhancedApplicationData['verification']['pan']> {
    const cacheKey = `PAN:${pan}`
    const cached = this.getFromCache(cacheKey)
    
    if (cached) {
      return cached
    }

    // Use mock data in development
    if (process.env.NODE_ENV === 'development') {
      const verification = {
        isValid: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan),
        verifiedName: 'MOCK USER NAME',
        status: 'ACTIVE',
        confidence: 95,
        lastVerified: new Date().toISOString()
      }
      this.setCache(cacheKey, verification, this.CACHE_TTL.PAN)
      return verification
    }

    try {
      const result = await signzyAPI.verifyPAN(pan)
      const verification = {
        isValid: result.isValid,
        verifiedName: result.name,
        status: result.status,
        confidence: result.isValid ? 95 : 0,
        lastVerified: new Date().toISOString()
      }

      this.setCache(cacheKey, verification, this.CACHE_TTL.PAN)
      return verification
    } catch (error) {
      console.error('PAN verification error:', error)
      return {
        isValid: false,
        confidence: 0,
        lastVerified: new Date().toISOString()
      }
    }
  }

  // Verify Aadhaar with caching
  private async verifyAadhaar(aadhaar: string): Promise<EnhancedApplicationData['verification']['aadhaar']> {
    const cacheKey = `AADHAAR:${aadhaar}`
    const cached = this.getFromCache(cacheKey)
    
    if (cached) {
      return cached
    }

    // Use mock data in development
    if (process.env.NODE_ENV === 'development') {
      const verification = {
        isValid: /^\d{12}$/.test(aadhaar),
        verifiedName: 'MOCK USER NAME',
        status: 'ACTIVE',
        confidence: 95,
        lastVerified: new Date().toISOString()
      }
      this.setCache(cacheKey, verification, this.CACHE_TTL.AADHAAR)
      return verification
    }

    try {
      const result = await signzyAPI.verifyAadhaar(aadhaar)
      const verification = {
        isValid: result.isValid,
        verifiedName: result.name,
        status: result.status,
        confidence: result.isValid ? 95 : 0,
        lastVerified: new Date().toISOString()
      }

      this.setCache(cacheKey, verification, this.CACHE_TTL.AADHAAR)
      return verification
    } catch (error) {
      console.error('Aadhaar verification error:', error)
      return {
        isValid: false,
        confidence: 0,
        lastVerified: new Date().toISOString()
      }
    }
  }

  // Verify credit with caching
  private async verifyCredit(pan: string, aadhaar: string): Promise<EnhancedApplicationData['verification']['credit']> {
    const cacheKey = `CREDIT:${pan}`
    const cached = this.getFromCache(cacheKey)
    
    if (cached) {
      return cached
    }

    // Use mock data in development
    if (process.env.NODE_ENV === 'development') {
      const panHash = pan.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0)
      const verification = {
        creditScore: 650 + (panHash % 200),
        bureauName: 'CIBIL',
        totalAccounts: 3 + (panHash % 5),
        activeAccounts: 2 + (panHash % 3),
        overdueAccounts: panHash % 2,
        confidence: 90,
        lastVerified: new Date().toISOString()
      }
      this.setCache(cacheKey, verification, this.CACHE_TTL.CREDIT)
      return verification
    }

    try {
      const result = await signzyAPI.getCreditReport(pan, aadhaar)
      const verification = {
        creditScore: result.creditScore,
        bureauName: result.bureauName,
        totalAccounts: result.totalAccounts,
        activeAccounts: result.activeAccounts,
        overdueAccounts: result.overdueAccounts,
        confidence: result.creditScore > 0 ? 90 : 0,
        lastVerified: new Date().toISOString()
      }

      this.setCache(cacheKey, verification, this.CACHE_TTL.CREDIT)
      return verification
    } catch (error) {
      console.error('Credit verification error:', error)
      return {
        confidence: 0,
        lastVerified: new Date().toISOString()
      }
    }
  }

  // Verify income with caching
  private async verifyIncome(pan: string, employment: ApplicationData['employment']): Promise<EnhancedApplicationData['verification']['income']> {
    const cacheKey = `INCOME:${pan}`
    const cached = this.getFromCache(cacheKey)
    
    if (cached) {
      return cached
    }

    try {
      const result = await signzyAPI.verifyIncome(pan, 'BOTH')
      const verification = {
        verifiedIncome: result.verifiedIncome,
        verificationMethod: result.verificationMethod,
        confidence: result.confidence,
        lastVerified: new Date().toISOString()
      }

      this.setCache(cacheKey, verification, this.CACHE_TTL.INCOME)
      return verification
    } catch (error) {
      console.error('Income verification error:', error)
      return {
        confidence: 0,
        lastVerified: new Date().toISOString()
      }
    }
  }

  // Verify bank statement with caching
  private async verifyBankStatement(bankAccount?: ApplicationData['income']['bankAccount']): Promise<EnhancedApplicationData['verification']['bankStatement']> {
    if (!bankAccount?.consentHandle || !bankAccount?.accountId) {
      return {
        confidence: 0,
        lastVerified: new Date().toISOString()
      }
    }

    const cacheKey = `BANK:${bankAccount.accountId}`
    const cached = this.getFromCache(cacheKey)
    
    if (cached) {
      return cached
    }

    try {
      const fromDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const toDate = new Date().toISOString().split('T')[0]
      
      const result = await signzyAPI.analyzeBankStatement(
        bankAccount.consentHandle,
        bankAccount.accountId,
        fromDate,
        toDate
      )

      const verification = {
        monthlyInflow: result.monthlyInflow,
        monthlyOutflow: result.monthlyOutflow,
        averageBalance: result.averageBalance,
        bouncedCheques: result.bouncedCheques,
        inflowTrend: result.inflowTrend,
        confidence: 85,
        lastVerified: new Date().toISOString()
      }

      this.setCache(cacheKey, verification, this.CACHE_TTL.BANK)
      return verification
    } catch (error) {
      console.error('Bank statement verification error:', error)
      return {
        confidence: 0,
        lastVerified: new Date().toISOString()
      }
    }
  }

  // Calculate comprehensive risk assessment
  private calculateRiskAssessment(data: EnhancedApplicationData): EnhancedApplicationData['riskAssessment'] {
    let riskScore = 0
    const riskFactors: string[] = []
    const recommendations: string[] = []

    // PAN verification (20 points)
    if (data.verification.pan.isValid) {
      riskScore += 20
    } else {
      riskFactors.push('PAN verification failed')
      recommendations.push('Please provide a valid PAN card')
    }

    // Aadhaar verification (20 points)
    if (data.verification.aadhaar.isValid) {
      riskScore += 20
    } else {
      riskFactors.push('Aadhaar verification failed')
      recommendations.push('Please provide a valid Aadhaar card')
    }

    // Credit score (25 points)
    if (data.verification.credit.creditScore) {
      if (data.verification.credit.creditScore >= 750) {
        riskScore += 25
      } else if (data.verification.credit.creditScore >= 700) {
        riskScore += 20
      } else if (data.verification.credit.creditScore >= 650) {
        riskScore += 15
      } else {
        riskScore += 5
        riskFactors.push('Low credit score')
        recommendations.push('Consider improving your credit score before applying')
      }
    } else {
      riskFactors.push('Credit report unavailable')
      recommendations.push('Unable to verify credit history')
    }

    // Income verification (15 points)
    if (data.verification.income.verifiedIncome) {
      const incomeRatio = data.verification.income.verifiedIncome / data.employment.monthlyIncome
      if (incomeRatio >= 0.9) {
        riskScore += 15
      } else if (incomeRatio >= 0.7) {
        riskScore += 10
      } else {
        riskScore += 5
        riskFactors.push('Income verification discrepancy')
        recommendations.push('Please provide additional income proof')
      }
    } else {
      riskFactors.push('Income verification unavailable')
      recommendations.push('Unable to verify income details')
    }

    // Bank statement health (20 points)
    if (data.verification.bankStatement?.monthlyInflow) {
      const bankHealth = this.calculateBankHealth(data.verification.bankStatement)
      riskScore += bankHealth.score
      if (bankHealth.factors.length > 0) {
        riskFactors.push(...bankHealth.factors)
      }
    } else {
      riskFactors.push('Bank statement analysis unavailable')
      recommendations.push('Please provide bank statements for better assessment')
    }

    // Determine risk category
    let riskCategory: 'LOW' | 'MEDIUM' | 'HIGH' = 'HIGH'
    if (riskScore >= 80) {
      riskCategory = 'LOW'
    } else if (riskScore >= 60) {
      riskCategory = 'MEDIUM'
    }

    return {
      overallRiskScore: riskScore,
      riskCategory,
      riskFactors,
      recommendations
    }
  }

  // Calculate bank health score
  private calculateBankHealth(bankStatement: EnhancedApplicationData['verification']['bankStatement']) {
    let score = 0
    const factors: string[] = []

    if (!bankStatement) return { score: 0, factors: [] }

    // Bounced cheques
    if (bankStatement.bouncedCheques === 0) {
      score += 8
    } else if (bankStatement.bouncedCheques <= 1) {
      score += 4
    } else {
      factors.push('Multiple bounced cheques detected')
    }

    // Inflow trend
    if (bankStatement.inflowTrend === 'increasing') {
      score += 6
    } else if (bankStatement.inflowTrend === 'stable') {
      score += 4
    } else {
      factors.push('Declining cash flow trend')
    }

    // Balance maintenance
    if (bankStatement.averageBalance && bankStatement.averageBalance > 50000) {
      score += 6
    } else if (bankStatement.averageBalance && bankStatement.averageBalance > 25000) {
      score += 3
    } else {
      factors.push('Low average bank balance')
    }

    return { score, factors }
  }

  // Cache management
  private getFromCache(key: string): any {
    const cached = this.verificationCache[key]
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data
    }
    return null
  }

  private setCache(key: string, data: any, ttl: number): void {
    this.verificationCache[key] = {
      data,
      timestamp: Date.now(),
      ttl
    }
  }

  // Clear expired cache entries
  clearExpiredCache(): void {
    const now = Date.now()
    Object.keys(this.verificationCache).forEach(key => {
      const cached = this.verificationCache[key]
      if (now - cached.timestamp > cached.ttl) {
        delete this.verificationCache[key]
      }
    })
  }

  // Get cache statistics
  getCacheStats(): { totalEntries: number; totalSize: number } {
    const totalEntries = Object.keys(this.verificationCache).length
    const totalSize = JSON.stringify(this.verificationCache).length
    return { totalEntries, totalSize }
  }
}

// Export singleton instance
export const signzyDataEnhancement = new SignzyDataEnhancement() 