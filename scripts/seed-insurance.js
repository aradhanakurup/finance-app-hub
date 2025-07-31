const { PrismaClient } = require('../src/generated/prisma');

const prisma = new PrismaClient();

const insuranceProviders = [
  {
    name: 'ICICI Lombard',
    logo: '/logos/icici-lombard.png',
    apiEndpoint: 'https://api.icicilombard.com/v1',
    apiKey: 'icici_lombard_api_key',
    isActive: true,
    commissionRate: 0.20,
    supportedCoverageTypes: JSON.stringify(['loan_protection', 'job_loss', 'critical_illness', 'asset_protection']),
    minPremium: 1000,
    maxCoverage: 5000000,
    responseTime: 30,
  },
  {
    name: 'HDFC Ergo',
    logo: '/logos/hdfc-ergo.png',
    apiEndpoint: 'https://api.hdfcergo.com/v1',
    apiKey: 'hdfc_ergo_api_key',
    isActive: true,
    commissionRate: 0.18,
    supportedCoverageTypes: JSON.stringify(['loan_protection', 'job_loss', 'asset_protection']),
    minPremium: 800,
    maxCoverage: 3000000,
    responseTime: 45,
  },
  {
    name: 'Bajaj Allianz',
    logo: '/logos/bajaj-allianz.png',
    apiEndpoint: 'https://api.bajajallianz.com/v1',
    apiKey: 'bajaj_allianz_api_key',
    isActive: true,
    commissionRate: 0.22,
    supportedCoverageTypes: JSON.stringify(['loan_protection', 'critical_illness', 'asset_protection']),
    minPremium: 1200,
    maxCoverage: 4000000,
    responseTime: 60,
  },
  {
    name: 'Tata AIG',
    logo: '/logos/tata-aig.png',
    apiEndpoint: 'https://api.tataaig.com/v1',
    apiKey: 'tata_aig_api_key',
    isActive: true,
    commissionRate: 0.25,
    supportedCoverageTypes: JSON.stringify(['loan_protection', 'job_loss', 'critical_illness']),
    minPremium: 1500,
    maxCoverage: 2500000,
    responseTime: 90,
  },
];

async function seedInsuranceProviders() {
  console.log('🌱 Seeding insurance providers...');

  try {
    // Clear existing insurance providers
    await prisma.insuranceProvider.deleteMany({});

    // Insert insurance providers
    for (const provider of insuranceProviders) {
      await prisma.insuranceProvider.create({
        data: provider,
      });
      console.log(`✅ Created insurance provider: ${provider.name}`);
    }

    console.log('🎉 Insurance providers seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding insurance providers:', error);
  }
}

async function main() {
  await seedInsuranceProviders();
}

main()
  .catch((e) => {
    console.error('❌ Error in main:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 