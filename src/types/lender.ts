// Lender Integration Types

export interface Lender {
  id: string;
  name: string;
  logo: string;
  apiEndpoint: string;
  apiKey: string;
  isActive: boolean;
  approvalRate: number;
  avgResponseTime: number; // in minutes
  minCreditScore: number;
  maxLoanAmount: number;
  minLoanAmount: number;
  processingFee: number;
  commissionRate: number; // percentage
  supportedVehicleTypes: string[];
  supportedEmploymentTypes: string[];
  webhookUrl?: string;
}

export interface LenderApplication {
  id: string;
  applicationId: string;
  lenderId: string;
  lenderName: string;
  status: ApplicationStatus;
  submittedAt: Date;
  respondedAt?: Date;
  responseTime?: number; // in minutes
  interestRate?: number;
  approvedAmount?: number;
  loanTenure?: number;
  processingFee?: number;
  emiAmount?: number;
  rejectionReason?: string;
  additionalDocuments?: string[];
  conditions?: string[];
  counterOffer?: {
    amount: number;
    tenure: number;
    rate: number;
  };
  webhookData?: any;
  retryCount: number;
  lastRetryAt?: Date;
}

export type ApplicationStatus = 
  | 'PENDING'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'CONDITIONAL_APPROVAL'
  | 'COUNTER_OFFER'
  | 'DOCUMENTS_REQUIRED'
  | 'FAILED'
  | 'EXPIRED';

export interface LenderResponse {
  success: boolean;
  applicationId: string;
  lenderId: string;
  status: ApplicationStatus;
  message: string;
  data?: {
    interestRate?: number;
    approvedAmount?: number;
    loanTenure?: number;
    processingFee?: number;
    emiAmount?: number;
    rejectionReason?: string;
    additionalDocuments?: string[];
    conditions?: string[];
    counterOffer?: {
      amount: number;
      tenure: number;
      rate: number;
    };
  };
  timestamp: Date;
}

export interface ApplicationSubmission {
  applicationId: string;
  customerData: CustomerData;
  vehicleData: VehicleData;
  financialData: FinancialData;
  documents: DocumentData[];
  selectedLenders: string[];
  submittedAt: Date;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface CustomerData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    aadhaar: string;
    pan: string;
    dateOfBirth: Date;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
    };
  };
  employmentInfo: {
    employmentType: string;
    companyName: string;
    designation: string;
    monthlyIncome: number;
    experience: number;
  };
  financialInfo: {
    creditScore: number;
    existingEmis: number;
    bankAccount: {
      bankName: string;
      accountNumber: string;
      ifscCode: string;
    };
  };
}

export interface VehicleData {
  make: string;
  model: string;
  year: number;
  variant: string;
  price: number;
  downPayment: number;
  loanAmount: number;
  tenure: number;
  dealerInfo: {
    name: string;
    id: string;
    location: string;
  };
}

export interface FinancialData {
  requestedAmount: number;
  tenure: number;
  downPayment: number;
  monthlyIncome: number;
  existingEmis: number;
  creditScore: number;
}

export interface DocumentData {
  id: string;
  type: string;
  fileName: string;
  fileUrl: string;
  verified: boolean;
  uploadedAt: Date;
}

export interface LenderAnalytics {
  lenderId: string;
  lenderName: string;
  totalApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  pendingApplications: number;
  approvalRate: number;
  avgResponseTime: number;
  avgInterestRate: number;
  totalCommission: number;
  monthlyStats: {
    month: string;
    applications: number;
    approvals: number;
    revenue: number;
  }[];
}

export interface AdminDashboard {
  totalApplications: number;
  activeApplications: number;
  totalRevenue: number;
  monthlyRevenue: number;
  topLenders: LenderAnalytics[];
  recentApplications: LenderApplication[];
  performanceMetrics: {
    avgApprovalRate: number;
    avgResponseTime: number;
    avgInterestRate: number;
  };
} 