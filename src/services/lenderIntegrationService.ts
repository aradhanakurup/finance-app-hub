import { 
  LenderApplication, 
  ApplicationStatus, 
  ApplicationSubmission,
  LenderResponse,
  CustomerData,
  VehicleData,
  FinancialData,
  DocumentData
} from '../types/lender';
import { mockLenderService, MOCK_LENDERS } from './mockLenderService';

// In-memory storage for demo purposes (replace with database in production)
class ApplicationStore {
  private applications: Map<string, LenderApplication[]> = new Map();
  private submissions: Map<string, ApplicationSubmission> = new Map();

  addApplication(applicationId: string, lenderApp: LenderApplication) {
    if (!this.applications.has(applicationId)) {
      this.applications.set(applicationId, []);
    }
    this.applications.get(applicationId)!.push(lenderApp);
  }

  updateApplication(applicationId: string, lenderId: string, updates: Partial<LenderApplication>) {
    const apps = this.applications.get(applicationId);
    if (apps) {
      const app = apps.find(a => a.lenderId === lenderId);
      if (app) {
        Object.assign(app, updates);
      }
    }
  }

  getApplications(applicationId: string): LenderApplication[] {
    return this.applications.get(applicationId) || [];
  }

  addSubmission(submission: ApplicationSubmission) {
    this.submissions.set(submission.applicationId, submission);
  }

  getSubmission(applicationId: string): ApplicationSubmission | undefined {
    return this.submissions.get(applicationId);
  }

  getAllApplications(): LenderApplication[] {
    const allApps: LenderApplication[] = [];
    for (const apps of this.applications.values()) {
      allApps.push(...apps);
    }
    return allApps;
  }
}

export class LenderIntegrationService {
  private store: ApplicationStore;
  private activeSubmissions: Set<string> = new Set();

  constructor() {
    this.store = new ApplicationStore();
  }

  // Main method to submit application to multiple lenders
  async submitToMultipleLenders(
    applicationId: string,
    customerData: CustomerData,
    vehicleData: VehicleData,
    financialData: FinancialData,
    documents: DocumentData[],
    selectedLenders: string[] = []
  ): Promise<{
    success: boolean;
    applicationId: string;
    submittedLenders: string[];
    message: string;
  }> {
    try {
      // Prevent duplicate submissions
      if (this.activeSubmissions.has(applicationId)) {
        throw new Error('Application already being processed');
      }

      this.activeSubmissions.add(applicationId);

      // Select lenders if not provided
      const lendersToSubmit = selectedLenders.length > 0 
        ? selectedLenders 
        : this.selectOptimalLenders(customerData, vehicleData, financialData);

      // Create submission record
      const submission: ApplicationSubmission = {
        applicationId,
        customerData,
        vehicleData,
        financialData,
        documents,
        selectedLenders: lendersToSubmit,
        submittedAt: new Date(),
        priority: this.calculatePriority(customerData, financialData),
      };

      this.store.addSubmission(submission);

      // Submit to all selected lenders simultaneously
      const submissionPromises = lendersToSubmit.map(lenderId =>
        this.submitToLender(applicationId, lenderId, customerData, vehicleData, financialData)
      );

      // Wait for all submissions to complete
      const results = await Promise.allSettled(submissionPromises);
      
      const successfulSubmissions = results
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value.lenderId);

      return {
        success: successfulSubmissions.length > 0,
        applicationId,
        submittedLenders: successfulSubmissions,
        message: `Successfully submitted to ${successfulSubmissions.length} lenders`,
      };

    } catch (error) {
      console.error('Error submitting to multiple lenders:', error);
      throw error;
    } finally {
      this.activeSubmissions.delete(applicationId);
    }
  }

  // Submit application to a single lender
  private async submitToLender(
    applicationId: string,
    lenderId: string,
    customerData: CustomerData,
    vehicleData: VehicleData,
    financialData: FinancialData
  ): Promise<{ lenderId: string; response: LenderResponse }> {
    try {
      // Create initial application record
      const lenderApp: LenderApplication = {
        id: `${applicationId}-${lenderId}`,
        applicationId,
        lenderId,
        lenderName: MOCK_LENDERS.find(l => l.id === lenderId)?.name || lenderId,
        status: 'SUBMITTED',
        submittedAt: new Date(),
        retryCount: 0,
      };

      this.store.addApplication(applicationId, lenderApp);

      // Submit to lender API
      const response = await mockLenderService.submitApplication(
        lenderId,
        applicationId,
        customerData,
        vehicleData,
        financialData
      );

      // Update application with response
      this.store.updateApplication(applicationId, lenderId, {
        status: response.status,
        respondedAt: response.timestamp,
        responseTime: this.calculateResponseTime(lenderApp.submittedAt, response.timestamp),
        interestRate: response.data?.interestRate,
        approvedAmount: response.data?.approvedAmount,
        loanTenure: response.data?.loanTenure,
        processingFee: response.data?.processingFee,
        emiAmount: response.data?.emiAmount,
        rejectionReason: response.data?.rejectionReason,
        additionalDocuments: response.data?.additionalDocuments,
        conditions: response.data?.conditions,
        counterOffer: response.data?.counterOffer,
        webhookData: {
          success: response.success,
          applicationId: response.applicationId,
          lenderId: response.lenderId,
          status: response.status,
          message: response.message,
          data: response.data,
          timestamp: response.timestamp,
        },
      });

      return { lenderId, response };

    } catch (error) {
      console.error(`Error submitting to lender ${lenderId}:`, error);
      
      // Update application with error status
      this.store.updateApplication(applicationId, lenderId, {
        status: 'FAILED',
        respondedAt: new Date(),
        rejectionReason: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  // Select optimal lenders based on customer profile
  private selectOptimalLenders(
    customerData: CustomerData,
    vehicleData: VehicleData,
    financialData: FinancialData
  ): string[] {
    const availableLenders = MOCK_LENDERS.filter(l => l.isActive);
    const scoredLenders = availableLenders.map(lender => {
      let score = 0;

      // Credit score compatibility
      if (customerData.financialInfo.creditScore >= lender.minCreditScore) {
        score += 20;
      }

      // Loan amount compatibility
      if (financialData.requestedAmount >= lender.minLoanAmount && 
          financialData.requestedAmount <= lender.maxLoanAmount) {
        score += 20;
      }

      // Vehicle type compatibility
      if (lender.supportedVehicleTypes.includes(vehicleData.make.toLowerCase())) {
        score += 15;
      }

      // Employment type compatibility
      if (lender.supportedEmploymentTypes.includes(customerData.employmentInfo.employmentType)) {
        score += 15;
      }

      // Historical performance
      score += lender.approvalRate * 20;

      // Response time (faster is better)
      score += Math.max(0, 10 - lender.avgResponseTime / 10);

      return { lender, score };
    });

    // Sort by score and return top 3-5 lenders
    return scoredLenders
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(5, scoredLenders.length))
      .map(item => item.lender.id);
  }

  // Calculate application priority
  private calculatePriority(customerData: CustomerData, financialData: FinancialData): 'HIGH' | 'MEDIUM' | 'LOW' {
    let score = 0;

    // Credit score impact
    if (customerData.financialInfo.creditScore >= 750) score += 30;
    else if (customerData.financialInfo.creditScore >= 700) score += 20;
    else if (customerData.financialInfo.creditScore >= 650) score += 10;

    // Income impact
    if (customerData.employmentInfo.monthlyIncome >= 100000) score += 25;
    else if (customerData.employmentInfo.monthlyIncome >= 50000) score += 15;
    else if (customerData.employmentInfo.monthlyIncome >= 25000) score += 10;

    // Employment stability
    if (customerData.employmentInfo.experience >= 5) score += 20;
    else if (customerData.employmentInfo.experience >= 3) score += 15;
    else if (customerData.employmentInfo.experience >= 1) score += 10;

    // Loan amount impact
    if (financialData.requestedAmount >= 1000000) score += 15;
    else if (financialData.requestedAmount >= 500000) score += 10;
    else if (financialData.requestedAmount >= 200000) score += 5;

    if (score >= 70) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  }

  // Calculate response time in minutes
  private calculateResponseTime(submittedAt: Date, respondedAt: Date): number {
    return Math.round((respondedAt.getTime() - submittedAt.getTime()) / (1000 * 60));
  }

  // Get application status for all lenders
  async getApplicationStatus(applicationId: string): Promise<LenderApplication[]> {
    return this.store.getApplications(applicationId);
  }

  // Get all applications for admin dashboard
  async getAllApplications(): Promise<LenderApplication[]> {
    return this.store.getAllApplications();
  }

  // Get submission details
  async getSubmissionDetails(applicationId: string): Promise<ApplicationSubmission | undefined> {
    return this.store.getSubmission(applicationId);
  }

  // Simulate webhook response from lender
  async simulateLenderWebhook(
    applicationId: string,
    lenderId: string,
    status: ApplicationStatus,
    data?: Record<string, unknown>
  ): Promise<void> {
    const response: LenderResponse = {
      success: true,
      applicationId,
      lenderId,
      status,
      message: `Status updated to ${status.toLowerCase().replace('_', ' ')}`,
      data,
      timestamp: new Date(),
    };

    this.store.updateApplication(applicationId, lenderId, {
      status: response.status,
      respondedAt: response.timestamp,
      webhookData: {
        success: response.success,
        applicationId: response.applicationId,
        lenderId: response.lenderId,
        status: response.status,
        message: response.message,
        data: response.data,
        timestamp: response.timestamp,
      },
      ...data,
    });
  }

  // Retry failed applications
  async retryFailedApplication(applicationId: string, lenderId: string): Promise<boolean> {
    const applications = this.store.getApplications(applicationId);
    const app = applications.find(a => a.lenderId === lenderId);
    
    if (!app || app.status !== 'FAILED') {
      return false;
    }

    const submission = this.store.getSubmission(applicationId);
    if (!submission) {
      return false;
    }

    try {
      // Update retry count
      this.store.updateApplication(applicationId, lenderId, {
        status: 'SUBMITTED',
        retryCount: app.retryCount + 1,
        lastRetryAt: new Date(),
      });

      // Resubmit
      await this.submitToLender(
        applicationId,
        lenderId,
        submission.customerData,
        submission.vehicleData,
        submission.financialData
      );

      return true;
    } catch (error) {
      console.error(`Retry failed for ${applicationId}-${lenderId}:`, error);
      return false;
    }
  }

  // Get lender analytics
  async getLenderAnalytics(): Promise<Record<string, unknown>[]> {
    const allApplications = this.store.getAllApplications();
    const lenderStats = new Map<string, {
      lenderId: string;
      lenderName: string;
      totalApplications: number;
      approvedApplications: number;
      rejectedApplications: number;
      pendingApplications: number;
      totalResponseTime: number;
      totalInterestRate: number;
      totalCommission: number;
    }>();

    for (const app of allApplications) {
      if (!lenderStats.has(app.lenderId)) {
        lenderStats.set(app.lenderId, {
          lenderId: app.lenderId,
          lenderName: app.lenderName,
          totalApplications: 0,
          approvedApplications: 0,
          rejectedApplications: 0,
          pendingApplications: 0,
          totalResponseTime: 0,
          totalInterestRate: 0,
          totalCommission: 0,
        });
      }

      const stats = lenderStats.get(app.lenderId)!;
      stats.totalApplications++;

      if (app.status === 'APPROVED') {
        stats.approvedApplications++;
        if (app.interestRate) stats.totalInterestRate += app.interestRate;
        if (app.approvedAmount) {
          const lender = MOCK_LENDERS.find(l => l.id === app.lenderId);
          if (lender) {
            stats.totalCommission += (app.approvedAmount * lender.commissionRate) / 100;
          }
        }
      } else if (app.status === 'REJECTED') {
        stats.rejectedApplications++;
      } else if (['PENDING', 'SUBMITTED', 'UNDER_REVIEW'].includes(app.status)) {
        stats.pendingApplications++;
      }

      if (app.responseTime) {
        stats.totalResponseTime += app.responseTime;
      }
    }

    return Array.from(lenderStats.values()).map(stats => ({
      ...stats,
      approvalRate: stats.totalApplications > 0 ? stats.approvedApplications / stats.totalApplications : 0,
      avgResponseTime: stats.totalApplications > 0 ? stats.totalResponseTime / stats.totalApplications : 0,
      avgInterestRate: stats.approvedApplications > 0 ? stats.totalInterestRate / stats.approvedApplications : 0,
    }));
  }
}

export const lenderIntegrationService = new LenderIntegrationService(); 