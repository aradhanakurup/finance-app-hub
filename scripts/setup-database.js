#!/usr/bin/env node

/**
 * Database Setup Script for Fin5
 * This script helps set up the production database
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Fin5 Database Setup Script');
console.log('==============================\n');

console.log('📋 Your Database: prisma-postgres-amber-jacket');
console.log('🌐 Your App: https://finance-app-jxbl00h28-aradhana-kurups-projects.vercel.app\n');

console.log('1️⃣  GET YOUR DATABASE CONNECTION STRING:');
console.log('   • Go to https://vercel.com/dashboard');
console.log('   • Click on your "finance-app-hub" project');
console.log('   • Go to "Storage" tab');
console.log('   • Click on "prisma-postgres-amber-jacket"');
console.log('   • Copy the connection string\n');

console.log('2️⃣  SET ENVIRONMENT VARIABLES IN VERCEL:');
console.log('   • Go to your project Settings → Environment Variables');
console.log('   • Add these variables:\n');

const envVars = [
  { name: 'DATABASE_URL', value: 'your-postgres-connection-string', description: 'Production database URL' },
  { name: 'JWT_SECRET', value: 'f39e866b5516b80cbfcfeba022a24fa6890bce80aff50f806705eeb55a560d7bcecc9c30660859a2c4e1df61146b0fe3d321d531edc0f0af616652ce528bb591', description: 'JWT signing secret' },
  { name: 'ADMIN_USERNAME', value: 'admin', description: 'Admin login username' },
  { name: 'ADMIN_PASSWORD_HASH', value: '$2b$10$i4W7rcyNR1VdYEOweHqmA.4Fk.IFFjrH6Oux.ChTKH2arlOVqtXPO', description: 'Admin password hash' },
  { name: 'NEXT_PUBLIC_APP_URL', value: 'https://finance-app-jxbl00h28-aradhana-kurups-projects.vercel.app', description: 'Your app URL' }
];

envVars.forEach(({ name, value, description }) => {
  console.log(`   • ${name}: ${value} (${description})`);
});

console.log('\n3️⃣  RUN THESE COMMANDS AFTER SETTING DATABASE_URL:');
console.log('   • npx prisma generate');
console.log('   • npx prisma migrate deploy');
console.log('   • npm run seed');
console.log('   • vercel --prod\n');

console.log('4️⃣  TEST THE SETUP:');
console.log('   • Visit: https://finance-app-jxbl00h28-aradhana-kurups-projects.vercel.app/tracker');
console.log('   • Should show sample applications');
console.log('   • Admin login: https://finance-app-jxbl00h28-aradhana-kurups-projects.vercel.app/admin/login');
console.log('   • Username: admin, Password: admin123\n');

console.log('🔗 USEFUL LINKS:');
console.log('   • Vercel Dashboard: https://vercel.com/dashboard');
console.log('   • Your App: https://finance-app-jxbl00h28-aradhana-kurups-projects.vercel.app');
console.log('   • Tracker: https://finance-app-jxbl00h28-aradhana-kurups-projects.vercel.app/tracker');
console.log('   • Admin: https://finance-app-jxbl00h28-aradhana-kurups-projects.vercel.app/admin/login\n');

console.log('⚠️  IMPORTANT NOTES:');
console.log('   • Make sure to set all environment variables for Production, Preview, and Development');
console.log('   • The database connection string should start with "postgresql://"');
console.log('   • After setting variables, redeploy with: vercel --prod\n');

console.log('✅ Once completed, your tracker will show:');
console.log('   • Sample loan applications');
console.log('   • Application statistics');
console.log('   • Real-time status updates');
console.log('   • Admin dashboard with analytics\n');

console.log('🎉 Ready to populate your database with data!'); 