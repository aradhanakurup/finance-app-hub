#!/usr/bin/env node

/**
 * Production Setup Script for Fin5
 * This script helps set up the production environment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Fin5 Production Setup Script');
console.log('================================\n');

console.log('📋 To make your Fin5 application truly functional, follow these steps:\n');

console.log('1️⃣  SET UP VERCEL POSTGRES DATABASE:');
console.log('   • Go to https://vercel.com/dashboard');
console.log('   • Click on your "finance-app-hub" project');
console.log('   • Go to "Storage" tab');
console.log('   • Click "Create Database" → Select "Postgres"');
console.log('   • Name: fin5-database');
console.log('   • Region: Choose closest to India');
console.log('   • Click "Create"\n');

console.log('2️⃣  GET YOUR DATABASE CONNECTION STRING:');
console.log('   • After creating the database, copy the connection string');
console.log('   • It looks like: postgresql://postgres:password@host:port/database\n');

console.log('3️⃣  SET ENVIRONMENT VARIABLES IN VERCEL:');
console.log('   • Go to your project Settings → Environment Variables');
console.log('   • Add these variables:\n');

const envVars = [
  { name: 'DATABASE_URL', value: 'your-postgres-connection-string', description: 'Production database URL' },
  { name: 'JWT_SECRET', value: 'generate-a-strong-secret', description: 'JWT signing secret' },
  { name: 'ADMIN_USERNAME', value: 'admin', description: 'Admin login username' },
  { name: 'ADMIN_PASSWORD_HASH', value: 'bcrypt-hash-of-password', description: 'Admin password hash' },
  { name: 'NEXT_PUBLIC_APP_URL', value: 'https://your-app.vercel.app', description: 'Your app URL' },
  { name: 'NEXT_PUBLIC_APP_NAME', value: 'Fin5', description: 'App name' },
  { name: 'NEXT_PUBLIC_APP_DESCRIPTION', value: 'Finance. Fast. Five minutes flat.', description: 'App description' }
];

envVars.forEach(({ name, value, description }) => {
  console.log(`   • ${name}: ${value} (${description})`);
});

console.log('\n4️⃣  GENERATE JWT SECRET:');
console.log('   • Run: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
console.log('   • Copy the output as your JWT_SECRET\n');

console.log('5️⃣  GENERATE ADMIN PASSWORD HASH:');
console.log('   • Run: node -e "const bcrypt = require(\'bcryptjs\'); console.log(bcrypt.hashSync(\'your-admin-password\', 10))"');
console.log('   • Replace \'your-admin-password\' with your desired admin password');
console.log('   • Copy the output as your ADMIN_PASSWORD_HASH\n');

console.log('6️⃣  RUN DATABASE MIGRATIONS:');
console.log('   • After setting DATABASE_URL, run: npx prisma migrate deploy');
console.log('   • This will create all tables in your production database\n');

console.log('7️⃣  SEED PRODUCTION DATA:');
console.log('   • Run: npm run seed');
console.log('   • This will populate lenders, insurance providers, and sample data\n');

console.log('8️⃣  DEPLOY TO PRODUCTION:');
console.log('   • Run: vercel --prod');
console.log('   • Your app will be live with production database!\n');

console.log('🔗 USEFUL LINKS:');
console.log('   • Vercel Dashboard: https://vercel.com/dashboard');
console.log('   • Your App: https://finance-app-jxbl00h28-aradhana-kurups-projects.vercel.app');
console.log('   • Prisma Docs: https://www.prisma.io/docs');
console.log('   • Vercel Postgres Docs: https://vercel.com/docs/storage/vercel-postgres\n');

console.log('⚠️  IMPORTANT NOTES:');
console.log('   • Keep your JWT_SECRET secure and never commit it to git');
console.log('   • Use strong passwords for admin access');
console.log('   • Monitor your database usage in Vercel dashboard');
console.log('   • Set up backups for your production data\n');

console.log('✅ Once completed, your Fin5 application will be fully functional with:');
console.log('   • Real production database');
console.log('   • Secure authentication');
console.log('   • Admin dashboard access');
console.log('   • Application tracking');
console.log('   • Payment processing (mock)');
console.log('   • Insurance integration (mock)\n');

console.log('🎉 Ready to make Fin5 production-ready!'); 