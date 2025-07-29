#!/usr/bin/env node

const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create default system configuration
    const systemConfigs = [
      {
        key: 'DEALER_ONBOARDING_ENABLED',
        value: 'true',
        description: 'Enable dealer onboarding process'
      },
      {
        key: 'MAX_FILE_SIZE_MB',
        value: '10',
        description: 'Maximum file upload size in MB'
      },
      {
        key: 'SUPPORT_EMAIL',
        value: 'support@financehub.com',
        description: 'Support email address'
      },
      {
        key: 'APP_VERSION',
        value: '1.0.0',
        description: 'Current application version'
      }
    ];

    for (const config of systemConfigs) {
      await prisma.systemConfig.upsert({
        where: { key: config.key },
        update: config,
        create: config
      });
    }

    // Create sample lenders for testing
    const sampleLenders = [
      {
        name: 'HDFC Bank',
        logo: '/logos/hdfc.png',
        apiEndpoint: 'https://api.hdfc.com/v1',
        apiKey: 'sample-key-1',
        approvalRate: 85.5,
        avgResponseTime: 120,
        minCreditScore: 650,
        maxLoanAmount: 5000000,
        minLoanAmount: 100000,
        processingFee: 2500,
        commissionRate: 2.5,
        supportedVehicleTypes: JSON.stringify(['CAR', 'BIKE', 'COMMERCIAL']),
        supportedEmploymentTypes: JSON.stringify(['SALARIED', 'SELF_EMPLOYED', 'BUSINESS'])
      },
      {
        name: 'ICICI Bank',
        logo: '/logos/icici.png',
        apiEndpoint: 'https://api.icici.com/v1',
        apiKey: 'sample-key-2',
        approvalRate: 82.3,
        avgResponseTime: 180,
        minCreditScore: 680,
        maxLoanAmount: 3000000,
        minLoanAmount: 50000,
        processingFee: 2000,
        commissionRate: 2.0,
        supportedVehicleTypes: JSON.stringify(['CAR', 'BIKE']),
        supportedEmploymentTypes: JSON.stringify(['SALARIED', 'SELF_EMPLOYED'])
      }
    ];

    for (const lender of sampleLenders) {
      await prisma.lender.upsert({
        where: { name: lender.name },
        update: lender,
        create: lender
      });
    }

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 