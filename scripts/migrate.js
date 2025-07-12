#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting database migration...');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Run database migrations
  console.log('🔄 Running database migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });

  // Seed database with initial data if needed
  if (process.env.SEED_DATABASE === 'true') {
    console.log('🌱 Seeding database...');
    execSync('npx prisma db seed', { stdio: 'inherit' });
  }

  // Verify database connection
  console.log('✅ Verifying database connection...');
  execSync('npx prisma db pull', { stdio: 'inherit' });

  console.log('✅ Database migration completed successfully!');
} catch (error) {
  console.error('❌ Database migration failed:', error.message);
  process.exit(1);
} 