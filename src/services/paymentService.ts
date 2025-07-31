import { PrismaClient } from '../generated/prisma';
import { insuranceService, type InsuranceQuote } from './insuranceService';

const prisma = new PrismaClient();

// Payment Types
export enum PaymentType {
  LOAN_APPLICATION = 'loan_application',
  INSURANCE_PREMIUM = 'insurance_premium',
  BUNDLED_PAYMENT = 'bundled_payment',
}

// Payment Status
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

// Payment Item Interface
export interface PaymentItem {
  type: PaymentType;
  description: string;
  amount: number;
  quantity: number;
  total: number;
  metadata?: any;
}

// Payment Request Interface
export interface PaymentRequest {
  customerId: string;
  applicationId: string;
  items: PaymentItem[];
  totalAmount: number;
  currency: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
}

// Payment Response Interface
export interface PaymentResponse {
  orderId: string;
  paymentId: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  paymentUrl?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  timestamp: Date;
}

// Payment Service Class
export class PaymentService {
  // Calculate loan application fee based on tier and features
  calculateApplicationFee(applicationData: any): number {
    const baseFee = 1500; // Base application fee
    let totalFee = baseFee;

    // Add premium features cost
    if (applicationData.premiumFeatures?.priorityProcessing) {
      totalFee += 500;
    }
    if (applicationData.premiumFeatures?.advancedAnalytics) {
      totalFee += 300;
    }
    if (applicationData.premiumFeatures?.dedicatedSupport) {
      totalFee += 200;
    }

    // Add document verification fee
    const documentCount = applicationData.documents?.length || 0;
    totalFee += documentCount * 100; // ₹100 per document

    // Add KYC verification fee
    if (applicationData.enhancedData?.kycVerified) {
      totalFee += 200;
    }

    return totalFee;
  }

  // Get real-time insurance quotes with latest pricing
  async getInsuranceQuotesWithPricing(applicationData: any): Promise<InsuranceQuote[]> {
    const riskProfile = {
      creditScore: applicationData.prescreening?.creditScore || 650,
      employmentType: applicationData.employment?.employmentType || 'salaried',
      monthlyIncome: applicationData.income?.monthlyIncome || 50000,
      loanAmount: applicationData.vehicle?.loanAmount || 500000,
      loanTenure: applicationData.vehicle?.tenure || 60,
      vehicleType: applicationData.vehicle?.make || 'sedan',
      age: applicationData.personalInfo?.age || 30,
      healthStatus: 'good',
      occupation: applicationData.employment?.designation || 'employee',
      experience: applicationData.employment?.experience || 3,
      existingEmis: applicationData.expenses?.existingEmis || 0,
      customerId: applicationData.personalInfo?.email || '',
    };

    // Get quotes for all coverage types
    const coverageTypes = ['loan_protection', 'job_loss', 'critical_illness', 'asset_protection'];
    const allQuotes: InsuranceQuote[] = [];

    for (const coverageType of coverageTypes) {
      try {
        const quotes = await insuranceService.getInsuranceQuotes(coverageType, riskProfile);
        allQuotes.push(...quotes);
      } catch (error) {
        console.error(`Error getting quotes for ${coverageType}:`, error);
      }
    }

    return allQuotes;
  }

  // Create payment order for loan application and insurance
  async createPaymentOrder(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Generate order ID
      const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      // Create payment record in database
      const payment = await prisma.payment.create({
        data: {
          orderId,
          paymentId,
          customerId: paymentRequest.customerId,
          applicationId: paymentRequest.applicationId,
          amount: paymentRequest.totalAmount,
          currency: paymentRequest.currency,
          status: PaymentStatus.PENDING,
          paymentType: PaymentType.BUNDLED_PAYMENT,
          items: JSON.stringify(paymentRequest.items),
          customerEmail: paymentRequest.customerEmail,
          customerPhone: paymentRequest.customerPhone,
          customerName: paymentRequest.customerName,
          createdAt: new Date(),
        },
      });

      // Create Razorpay order (mock implementation)
      const razorpayOrder = await this.createRazorpayOrder(paymentRequest);

      // Update payment with Razorpay order ID
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          razorpayOrderId: razorpayOrder.id,
          paymentUrl: razorpayOrder.paymentUrl,
        },
      });

      return {
        orderId,
        paymentId,
        status: PaymentStatus.PENDING,
        amount: paymentRequest.totalAmount,
        currency: paymentRequest.currency,
        paymentUrl: razorpayOrder.paymentUrl,
        razorpayOrderId: razorpayOrder.id,
        timestamp: new Date(),
      };

    } catch (error) {
      console.error('Error creating payment order:', error);
      throw new Error('Failed to create payment order');
    }
  }

  // Mock Razorpay order creation
  private async createRazorpayOrder(paymentRequest: PaymentRequest): Promise<any> {
    // In production, this would integrate with Razorpay API
    const orderId = `rzp_order_${Date.now()}`;
    
    return {
      id: orderId,
      amount: paymentRequest.totalAmount * 100, // Razorpay expects amount in paise
      currency: paymentRequest.currency,
      receipt: `receipt_${Date.now()}`,
      paymentUrl: `https://checkout.razorpay.com/v1/checkout.html?key=rzp_test_key&amount=${paymentRequest.totalAmount * 100}&currency=${paymentRequest.currency}&order_id=${orderId}`,
    };
  }

  // Verify payment and process post-payment actions
  async verifyPayment(paymentId: string, razorpayPaymentId: string, signature: string): Promise<boolean> {
    try {
      // Verify Razorpay signature (mock implementation)
      const isValidSignature = this.verifyRazorpaySignature(paymentId, razorpayPaymentId, signature);
      
      if (!isValidSignature) {
        throw new Error('Invalid payment signature');
      }

      // Update payment status
      await prisma.payment.update({
        where: { paymentId },
        data: {
          status: PaymentStatus.COMPLETED,
          razorpayPaymentId,
          completedAt: new Date(),
        },
      });

      // Process post-payment actions
      await this.processPostPaymentActions(paymentId);

      return true;

    } catch (error) {
      console.error('Error verifying payment:', error);
      
      // Update payment status to failed
      await prisma.payment.update({
        where: { paymentId },
        data: {
          status: PaymentStatus.FAILED,
          failureReason: error.message,
        },
      });

      return false;
    }
  }

  // Mock Razorpay signature verification
  private verifyRazorpaySignature(paymentId: string, razorpayPaymentId: string, signature: string): boolean {
    // In production, this would verify the actual Razorpay signature
    return true; // Mock successful verification
  }

  // Process actions after successful payment
  private async processPostPaymentActions(paymentId: string): Promise<void> {
    const payment = await prisma.payment.findUnique({
      where: { paymentId },
      include: {
        application: true,
      },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    // Process each payment item
    const items: PaymentItem[] = JSON.parse(payment.items as string);
    
    for (const item of items) {
      switch (item.type) {
        case PaymentType.LOAN_APPLICATION:
          await this.processLoanApplicationPayment(payment.applicationId);
          break;
        case PaymentType.INSURANCE_PREMIUM:
          await this.processInsurancePayment(item.metadata);
          break;
        case PaymentType.BUNDLED_PAYMENT:
          await this.processBundledPayment(payment.applicationId, item.metadata);
          break;
      }
    }
  }

  // Process loan application payment
  private async processLoanApplicationPayment(applicationId: string): Promise<void> {
    // Update application status to paid
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
      },
    });

    // Trigger application processing
    await this.triggerApplicationProcessing(applicationId);
  }

  // Process insurance payment
  private async processInsurancePayment(insuranceData: any): Promise<void> {
    // Create insurance policy
    if (insuranceData.providerId && insuranceData.coverageType) {
      await insuranceService.createPolicy(
        insuranceData.applicationId,
        insuranceData.providerId,
        insuranceData.coverageType,
        insuranceData.riskProfile
      );
    }
  }

  // Process bundled payment
  private async processBundledPayment(applicationId: string, insuranceData: any): Promise<void> {
    // Process both loan application and insurance
    await this.processLoanApplicationPayment(applicationId);
    
    if (insuranceData) {
      await this.processInsurancePayment(insuranceData);
    }
  }

  // Trigger application processing after payment
  private async triggerApplicationProcessing(applicationId: string): Promise<void> {
    // This would trigger the multi-lender submission process
    console.log(`Triggering application processing for: ${applicationId}`);
    
    // Update application status to processing
    await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: 'PROCESSING',
        processingStartedAt: new Date(),
      },
    });
  }

  // Get payment details
  async getPaymentDetails(paymentId: string): Promise<any> {
    return await prisma.payment.findUnique({
      where: { paymentId },
      include: {
        application: true,
      },
    });
  }

  // Get payment history for customer
  async getCustomerPaymentHistory(customerId: string): Promise<any[]> {
    return await prisma.payment.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        application: true,
      },
    });
  }

  // Refund payment
  async refundPayment(paymentId: string, reason: string): Promise<boolean> {
    try {
      // Update payment status
      await prisma.payment.update({
        where: { paymentId },
        data: {
          status: PaymentStatus.REFUNDED,
          refundReason: reason,
          refundedAt: new Date(),
        },
      });

      // In production, this would trigger actual refund through Razorpay
      console.log(`Refund initiated for payment: ${paymentId}`);

      return true;
    } catch (error) {
      console.error('Error refunding payment:', error);
      return false;
    }
  }

  // Calculate total cost breakdown
  async calculateTotalCost(applicationData: any, selectedInsurance?: any): Promise<any> {
    const applicationFee = this.calculateApplicationFee(applicationData);
    let insuranceCost = 0;
    let insuranceDetails = null;

    if (selectedInsurance) {
      insuranceCost = selectedInsurance.premium;
      insuranceDetails = selectedInsurance;
    }

    const subtotal = applicationFee + insuranceCost;
    const gst = subtotal * 0.18; // 18% GST
    const total = subtotal + gst;

    return {
      breakdown: {
        applicationFee,
        insuranceCost,
        subtotal,
        gst,
        total,
      },
      insuranceDetails,
      currency: 'INR',
    };
  }
}

// Export singleton instance
export const paymentService = new PaymentService(); 