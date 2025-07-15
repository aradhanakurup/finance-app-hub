import { Lender, LenderResponse, ApplicationStatus, CustomerData, VehicleData, FinancialData } from '../types/lender';

// Mock Indian Lenders Configuration
export const MOCK_LENDERS: Lender[] = [
  {
    id: 'hdfc-bank',
    name: 'HDFC Bank',
    logo: '/images/lenders/hdfc-bank.png',
    apiEndpoint: 'https://api.hdfcbank.com/auto-loans',
    apiKey: 'mock-hdfc-key',
    isActive: true,
    approvalRate: 0.75,
    avgResponseTime: 45,
    minCreditScore: 650,
    maxLoanAmount: 5000000,
    minLoanAmount: 100000,
    processingFee: 2500,
    commissionRate: 1.5,
    supportedVehicleTypes: ['sedan', 'suv', 'hatchback', 'muv'],
    supportedEmploymentTypes: ['salaried', 'self-employed', 'business-owner'],
  },
  {
    id: 'icici-bank',
    name: 'ICICI Bank',
    logo: '/images/lenders/icici-bank.png',
    apiEndpoint: 'https://api.icicibank.com/vehicle-finance',
    apiKey: 'mock-icici-key',
    isActive: true,
    approvalRate: 0.72,
    avgResponseTime: 60,
    minCreditScore: 680,
    maxLoanAmount: 3000000,
    minLoanAmount: 150000,
    processingFee: 3000,
    commissionRate: 1.8,
    supportedVehicleTypes: ['sedan', 'suv', 'hatchback'],
    supportedEmploymentTypes: ['salaried', 'self-employed'],
  },
  {
    id: 'bajaj-finserv',
    name: 'Bajaj Finserv',
    logo: '/images/lenders/bajaj-finserv.png',
    apiEndpoint: 'https://api.bajajfinserv.com/consumer-finance',
    apiKey: 'mock-bajaj-key',
    isActive: true,
    approvalRate: 0.68,
    avgResponseTime: 30,
    minCreditScore: 600,
    maxLoanAmount: 2000000,
    minLoanAmount: 50000,
    processingFee: 1500,
    commissionRate: 2.0,
    supportedVehicleTypes: ['sedan', 'suv', 'hatchback', 'muv', 'commercial'],
    supportedEmploymentTypes: ['salaried', 'self-employed', 'business-owner', 'freelancer'],
  },
  {
    id: 'mahindra-finance',
    name: 'Mahindra Finance',
    logo: '/images/lenders/mahindra-finance.png',
    apiEndpoint: 'https://api.mahindrafinance.com/vehicle-finance',
    apiKey: 'mock-mahindra-key',
    isActive: true,
    approvalRate: 0.65,
    avgResponseTime: 90,
    minCreditScore: 580,
    maxLoanAmount: 1500000,
    minLoanAmount: 75000,
    processingFee: 2000,
    commissionRate: 1.2,
    supportedVehicleTypes: ['suv', 'muv', 'commercial'],
    supportedEmploymentTypes: ['salaried', 'self-employed', 'business-owner'],
  },
  {
    id: 'sbi',
    name: 'State Bank of India',
    logo: '/images/lenders/sbi.png',
    apiEndpoint: 'https://api.sbi.co.in/auto-loans',
    apiKey: 'mock-sbi-key',
    isActive: true,
    approvalRate: 0.70,
    avgResponseTime: 120,
    minCreditScore: 620,
    maxLoanAmount: 4000000,
    minLoanAmount: 100000,
    processingFee: 1800,
    commissionRate: 1.0,
    supportedVehicleTypes: ['sedan', 'suv', 'hatchback', 'muv'],
    supportedEmploymentTypes: ['salaried', 'self-employed', 'business-owner'],
  },
];

// Mock Response Scenarios
const APPROVAL_SCENARIOS = [
  {
    probability: 0.6,
    status: 'APPROVED' as ApplicationStatus,
    interestRateRange: { min: 8.5, max: 12.5 },
    approvalAmountRange: { min: 0.8, max: 1.0 }, // percentage of requested amount
    conditions: [
      'Income verification required',
      'Bank statements for last 3 months',
      'Vehicle insurance mandatory',
    ],
  },
  {
    probability: 0.15,
    status: 'CONDITIONAL_APPROVAL' as ApplicationStatus,
    interestRateRange: { min: 10.0, max: 14.0 },
    approvalAmountRange: { min: 0.7, max: 0.9 },
    conditions: [
      'Additional income proof required',
      'Co-applicant signature needed',
      'Higher down payment required',
    ],
  },
  {
    probability: 0.15,
    status: 'COUNTER_OFFER' as ApplicationStatus,
    interestRateRange: { min: 9.0, max: 13.0 },
    approvalAmountRange: { min: 0.6, max: 0.8 },
    conditions: [
      'Reduced loan amount offered',
      'Extended tenure available',
      'Processing fee waiver on higher down payment',
    ],
  },
  {
    probability: 0.1,
    status: 'REJECTED' as ApplicationStatus,
    rejectionReasons: [
      'Insufficient credit score',
      'High debt-to-income ratio',
      'Incomplete documentation',
      'Vehicle age exceeds policy limit',
      'Employment verification failed',
    ],
  },
];

// Define a type for approval scenario
export type Scenario = {
  probability: number;
  status: ApplicationStatus;
  interestRateRange?: { min: number; max: number };
  approvalAmountRange?: { min: number; max: number };
  conditions?: string[];
  rejectionReasons?: string[];
};

// Define a type for the return value of the function
export type MockLenderResponse = {
  lenderId: string;
  status: string;
  message?: string;
  timestamp: Date;
};

// Utility Functions
function getRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Removed unused function

function calculateEMI(principal: number, rate: number, tenure: number): number {
  const monthlyRate = rate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
}

// Mock Lender Service
export class MockLenderService {
  private lenders: Lender[];

  constructor() {
    this.lenders = MOCK_LENDERS;
  }

  async submitApplication(
    lenderId: string,
    applicationId: string,
    customerData: CustomerData,
    vehicleData: VehicleData,
    financialData: FinancialData
  ): Promise<LenderResponse> {
    const lender = this.lenders.find(l => l.id === lenderId);
    if (!lender) {
      throw new Error(`Lender ${lenderId} not found`);
    }

    // Simulate API processing time
    const responseTime = lender.avgResponseTime * (0.5 + Math.random());
    await new Promise(resolve => setTimeout(resolve, responseTime * 1000));

    // Validate application against lender criteria
    const validationResult = this.validateApplication(lender, customerData, vehicleData, financialData);
    
    if (!validationResult.isValid) {
      return {
        success: false,
        applicationId,
        lenderId,
        status: 'REJECTED',
        message: validationResult.reason || 'Application rejected due to validation failure',
        timestamp: new Date(),
      };
    }

    // Determine response scenario
    const scenario = this.determineResponseScenario(customerData, vehicleData, financialData);
    
    return this.generateResponse(applicationId, lenderId, scenario, financialData);
  }

  private validateApplication(
    lender: Lender,
    customerData: CustomerData,
    vehicleData: VehicleData,
    financialData: FinancialData
  ): { isValid: boolean; reason?: string } {
    // Credit score validation
    if (customerData.financialInfo.creditScore < lender.minCreditScore) {
      return {
        isValid: false,
        reason: `Credit score ${customerData.financialInfo.creditScore} is below minimum requirement of ${lender.minCreditScore}`,
      };
    }

    // Loan amount validation
    if (financialData.requestedAmount < lender.minLoanAmount) {
      return {
        isValid: false,
        reason: `Requested amount ₹${financialData.requestedAmount} is below minimum loan amount of ₹${lender.minLoanAmount}`,
      };
    }

    if (financialData.requestedAmount > lender.maxLoanAmount) {
      return {
        isValid: false,
        reason: `Requested amount ₹${financialData.requestedAmount} exceeds maximum loan amount of ₹${lender.maxLoanAmount}`,
      };
    }

    // Vehicle type validation
    if (!lender.supportedVehicleTypes.includes(vehicleData.make.toLowerCase())) {
      return {
        isValid: false,
        reason: `Vehicle type ${vehicleData.make} is not supported by ${lender.name}`,
      };
    }

    // Employment type validation
    if (!lender.supportedEmploymentTypes.includes(customerData.employmentInfo.employmentType)) {
      return {
        isValid: false,
        reason: `Employment type ${customerData.employmentInfo.employmentType} is not supported by ${lender.name}`,
      };
    }

    return { isValid: true };
  }

  private determineResponseScenario(
    customerData: CustomerData,
    vehicleData: VehicleData,
    financialData: FinancialData
  ): Scenario {
    // Calculate approval probability based on customer profile
    let probability = 0.6;
    
    // Credit score impact
    if (customerData.financialInfo.creditScore >= 750) probability += 0.2;
    else if (customerData.financialInfo.creditScore >= 700) probability += 0.1;
    else if (customerData.financialInfo.creditScore < 650) probability -= 0.2;

    // Income impact
    const debtToIncomeRatio = (customerData.financialInfo.existingEmis + financialData.requestedAmount * 0.02) / customerData.employmentInfo.monthlyIncome;
    if (debtToIncomeRatio < 0.3) probability += 0.15;
    else if (debtToIncomeRatio > 0.6) probability -= 0.25;

    // Employment stability
    if (customerData.employmentInfo.experience >= 5) probability += 0.1;
    else if (customerData.employmentInfo.experience < 2) probability -= 0.15;

    // Vehicle age impact
    const vehicleAge = new Date().getFullYear() - vehicleData.year;
    if (vehicleAge <= 3) probability += 0.1;
    else if (vehicleAge > 8) probability -= 0.2;

    // Select scenario based on probability
    const random = Math.random();
    let cumulativeProbability = 0;
    
    for (const scenario of APPROVAL_SCENARIOS) {
      cumulativeProbability += scenario.probability;
      if (random <= cumulativeProbability) {
        return scenario;
      }
    }

    return APPROVAL_SCENARIOS[0]; // Default to approval
  }

  private generateResponse(
    applicationId: string,
    lenderId: string,
    scenario: Scenario,
    financialData: FinancialData
  ): LenderResponse {
    const lender = this.lenders.find(l => l.id === lenderId)!;
    
    if (scenario.status === 'REJECTED') {
      return {
        success: false,
        applicationId,
        lenderId,
        status: 'REJECTED',
        message: getRandomElement(scenario.rejectionReasons || []),
        timestamp: new Date(),
      };
    }

    // Generate approval data
    const interestRate = getRandomNumber(scenario.interestRateRange?.min || 0, scenario.interestRateRange?.max || 0);
    const approvalPercentage = getRandomNumber(scenario.approvalAmountRange?.min || 0, scenario.approvalAmountRange?.max || 0);
    const approvedAmount = Math.round(financialData.requestedAmount * approvalPercentage);
    const emiAmount = calculateEMI(approvedAmount, interestRate, financialData.tenure);

    const response: LenderResponse = {
      success: true,
      applicationId,
      lenderId,
      status: scenario.status,
      message: `Application ${scenario.status.toLowerCase().replace('_', ' ')}`,
      data: {
        interestRate: Math.round(interestRate * 100) / 100,
        approvedAmount,
        loanTenure: financialData.tenure,
        processingFee: lender.processingFee,
        emiAmount,
        conditions: scenario.conditions,
      },
      timestamp: new Date(),
    };

    // Add counter offer if applicable
    if (scenario.status === 'COUNTER_OFFER') {
      response.data!.counterOffer = {
        amount: Math.round(approvedAmount * 0.9),
        tenure: financialData.tenure + 12,
        rate: interestRate + 1,
      };
    }

    return response;
  }

  async getLenderStatus(lenderId: string): Promise<Lender | null> {
    return this.lenders.find(l => l.id === lenderId) || null;
  }

  async getAllLenders(): Promise<Lender[]> {
    return this.lenders.filter(l => l.isActive);
  }

  async simulateWebhookResponse(
    applicationId: string,
    lenderId: string,
    delay: number = 0
  ): Promise<LenderResponse> {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay * 1000));
    }

    // Simulate webhook response with updated status
    const statuses: ApplicationStatus[] = ['UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CONDITIONAL_APPROVAL'];
    const randomStatus = getRandomElement(statuses);

    return {
      success: true,
      applicationId,
      lenderId,
      status: randomStatus,
      message: `Status updated to ${randomStatus.toLowerCase().replace('_', ' ')}`,
      timestamp: new Date(),
    };
  }
}

export const mockLenderService = new MockLenderService(); 