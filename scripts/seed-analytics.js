const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function seedAnalyticsData() {
  try {
    console.log('🌱 Seeding analytics data...');

    // Create sample lenders
    const lenders = await Promise.all([
      prisma.lender.create({
        data: {
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
      }),
      prisma.lender.create({
        data: {
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
      }),
      prisma.lender.create({
        data: {
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
      }),
    ]);

    console.log(`✅ Created ${lenders.length} lenders`);

    // Create sample applications with different dates
    const applications = [];
    const statuses = ['DRAFT', 'SUBMITTED', 'COMPLETED'];
    const priorities = ['HIGH', 'MEDIUM', 'LOW'];

    for (let i = 1; i <= 25; i++) {
      const daysAgo = Math.floor(Math.random() * 90); // Random date within last 90 days
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const application = await prisma.application.create({
        data: {
          status: statuses[Math.floor(Math.random() * statuses.length)],
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          submittedAt: Math.random() > 0.3 ? createdAt : null,
          completedAt: Math.random() > 0.7 ? new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
          createdAt,
          updatedAt: createdAt,
        },
      });
      applications.push(application);
    }

    console.log(`✅ Created ${applications.length} applications`);

    // Create sample customers and vehicles for applications
    for (const application of applications) {
      // Create customer
      await prisma.customer.create({
        data: {
          applicationId: application.id,
          firstName: `Customer${application.id.slice(-4)}`,
          lastName: 'Sample',
          email: `customer${application.id.slice(-4)}@example.com`,
          phone: `98765${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
          aadhaar: `1234${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
          pan: `ABCDE${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}F`,
          dateOfBirth: new Date(1980 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
          addressStreet: `${Math.floor(Math.random() * 999) + 1} Main Street`,
          addressCity: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'][Math.floor(Math.random() * 5)],
          addressState: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana'][Math.floor(Math.random() * 5)],
          addressPincode: String(Math.floor(Math.random() * 900000) + 100000),
          employmentType: ['salaried', 'self-employed', 'business-owner'][Math.floor(Math.random() * 3)],
          companyName: `Company ${Math.floor(Math.random() * 100)}`,
          designation: ['Manager', 'Engineer', 'Consultant', 'Director'][Math.floor(Math.random() * 4)],
          monthlyIncome: Math.floor(Math.random() * 200000) + 30000,
          experience: Math.floor(Math.random() * 15) + 1,
          creditScore: Math.floor(Math.random() * 300) + 600,
          existingEmis: Math.floor(Math.random() * 50000),
          bankName: ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'][Math.floor(Math.random() * 4)],
          accountNumber: String(Math.floor(Math.random() * 1000000000000)),
          ifscCode: 'HDFC0001234',
        },
      });

      // Create vehicle
      await prisma.vehicle.create({
        data: {
          applicationId: application.id,
          make: ['Maruti', 'Hyundai', 'Honda', 'Toyota', 'Mahindra'][Math.floor(Math.random() * 5)],
          model: ['Swift', 'i20', 'City', 'Innova', 'XUV500'][Math.floor(Math.random() * 5)],
          year: 2020 + Math.floor(Math.random() * 4),
          variant: ['Petrol', 'Diesel', 'Electric'][Math.floor(Math.random() * 3)],
          price: Math.floor(Math.random() * 1500000) + 500000,
          downPayment: Math.floor(Math.random() * 200000) + 50000,
          loanAmount: Math.floor(Math.random() * 1000000) + 300000,
          tenure: Math.floor(Math.random() * 60) + 12,
          dealerName: `Dealer ${Math.floor(Math.random() * 50)}`,
          dealerId: `DEALER${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
          dealerLocation: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'][Math.floor(Math.random() * 5)],
        },
      });
    }

    console.log(`✅ Created customers and vehicles for ${applications.length} applications`);

    // Create lender applications for each application
    const lenderApplicationStatuses = ['PENDING', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
    
    for (const application of applications) {
      // Each application goes to 2-3 random lenders
      const numLenders = Math.floor(Math.random() * 2) + 2;
      const selectedLenders = lenders.sort(() => 0.5 - Math.random()).slice(0, numLenders);

      for (const lender of selectedLenders) {
        const status = lenderApplicationStatuses[Math.floor(Math.random() * lenderApplicationStatuses.length)];
        const submittedAt = new Date(application.createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000);
        const respondedAt = status !== 'PENDING' ? new Date(submittedAt.getTime() + Math.random() * 72 * 60 * 60 * 1000) : null;

        await prisma.lenderApplication.create({
          data: {
            applicationId: application.id,
            lenderId: lender.id,
            status,
            submittedAt,
            respondedAt,
            responseTime: respondedAt ? Math.floor((respondedAt.getTime() - submittedAt.getTime()) / (1000 * 60)) : null,
            interestRate: status === 'APPROVED' ? Math.random() * 8 + 8 : null, // 8-16%
            approvedAmount: status === 'APPROVED' ? Math.floor(Math.random() * 800000) + 200000 : null,
            loanTenure: status === 'APPROVED' ? Math.floor(Math.random() * 60) + 12 : null,
            processingFee: Math.floor(Math.random() * 5000) + 1000,
            emiAmount: status === 'APPROVED' ? Math.floor(Math.random() * 25000) + 5000 : null,
            rejectionReason: status === 'REJECTED' ? ['Insufficient income', 'Low credit score', 'Incomplete documentation'][Math.floor(Math.random() * 3)] : null,
            additionalDocuments: status === 'DOCUMENTS_REQUIRED' ? ['Bank statements', 'Salary slips', 'Address proof'] : [],
            conditions: status === 'CONDITIONAL_APPROVAL' ? ['Co-applicant required', 'Higher down payment', 'Insurance mandatory'] : [],
            retryCount: Math.floor(Math.random() * 3),
            lastRetryAt: Math.random() > 0.8 ? new Date() : null,
          },
        });
      }
    }

    console.log(`✅ Created lender applications for all applications`);

    // Create some sample documents
    for (const application of applications.slice(0, 10)) { // Only for first 10 applications
      const documentTypes = ['identity_proof', 'income_proof', 'address_proof', 'employment_proof'];
      
      for (const docType of documentTypes) {
        await prisma.document.create({
          data: {
            applicationId: application.id,
            type: docType,
            fileName: `${docType}_${application.id.slice(-4)}.pdf`,
            fileUrl: `/uploads/${docType}_${application.id.slice(-4)}.pdf`,
            verified: Math.random() > 0.3,
            uploadedAt: new Date(application.createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    console.log(`✅ Created sample documents for applications`);

    console.log('🎉 Analytics data seeding completed successfully!');
    console.log('\n📊 Sample data created:');
    console.log(`   - ${lenders.length} lenders`);
    console.log(`   - ${applications.length} applications`);
    console.log(`   - ${applications.length} customers and vehicles`);
    console.log(`   - Multiple lender applications per application`);
    console.log(`   - Sample documents for first 10 applications`);
    console.log('\n🌐 You can now view the analytics dashboard at: http://localhost:3002/admin');

  } catch (error) {
    console.error('❌ Error seeding analytics data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedAnalyticsData(); 