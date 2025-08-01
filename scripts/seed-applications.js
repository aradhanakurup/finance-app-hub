#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedApplications() {
  console.log('🌱 Seeding sample applications...');

  try {
    // First, create a test user
    const testUser = await prisma.user.upsert({
      where: { email: 'test@fin5.com' },
      update: {},
      create: {
        email: 'test@fin5.com',
        password: '$2b$10$i4W7rcyNR1VdYEOweHqmA.4Fk.IFFjrH6Oux.ChTKH2arlOVqtXPO', // admin123
        firstName: 'Test',
        lastName: 'User',
        phone: '+91-9999999999'
      }
    });

    console.log(`✅ Created test user: ${testUser.id}`);

    // Create sample applications
    const sampleApplications = [
      {
        id: 'APP001',
        userId: testUser.id,
        status: 'APPROVED',
        approvedAmount: 500000,
        interestRate: 12.5,
        processingFee: 2500,
        totalAmount: 502500,
        submittedAt: new Date('2024-01-15'),
        approvedAt: new Date('2024-01-20'),
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 'APP002',
        userId: testUser.id,
        status: 'PROCESSING',
        submittedAt: new Date('2024-01-18'),
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-19')
      },
      {
        id: 'APP003',
        userId: testUser.id,
        status: 'PENDING',
        submittedAt: new Date('2024-01-20'),
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 'APP004',
        userId: testUser.id,
        status: 'REJECTED',
        rejectionReason: 'Insufficient credit score',
        submittedAt: new Date('2024-01-10'),
        rejectedAt: new Date('2024-01-12'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: 'APP005',
        userId: testUser.id,
        status: 'APPROVED',
        approvedAmount: 1200000,
        interestRate: 11.8,
        processingFee: 3000,
        totalAmount: 1203000,
        submittedAt: new Date('2024-01-05'),
        approvedAt: new Date('2024-01-15'),
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-15')
      }
    ];

    for (const app of sampleApplications) {
      await prisma.application.upsert({
        where: { id: app.id },
        update: app,
        create: app
      });
      console.log(`✅ Created application: ${app.id} - Status: ${app.status}`);
    }

    // Create sample customers for the applications
    const sampleCustomers = [
      {
        userId: testUser.id,
        firstName: 'Rahul',
        lastName: 'Sharma',
        email: 'rahul.sharma@email.com',
        phone: '+91-9876543210',
        aadhaar: '123456789012',
        pan: 'ABCDE1234F',
        dateOfBirth: new Date('1990-05-15'),
        addressStreet: '123, MG Road',
        addressCity: 'Bangalore',
        addressState: 'Karnataka',
        addressPincode: '560001',
        employmentType: 'salaried',
        companyName: 'TechCorp India',
        designation: 'Software Engineer',
        monthlyIncome: 75000,
        experience: 5
      }
    ];

    for (const customer of sampleCustomers) {
      await prisma.customer.upsert({
        where: { userId: customer.userId },
        update: customer,
        create: customer
      });
      console.log(`✅ Created customer profile for: ${customer.firstName} ${customer.lastName}`);
    }

    console.log('🎉 Sample applications seeded successfully!');
  } catch (error) {
    console.error('❌ Application seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedApplications()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 