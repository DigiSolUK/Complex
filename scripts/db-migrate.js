/**
 * ComplexCare CRM Database Migration Script
 * 
 * This script helps manage database schema changes
 * - Applies Drizzle schema changes to the database
 * - Can be used for both development and production
 */

require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');

console.log('ComplexCare CRM Database Migration Tool');
console.log('======================================');

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is not set.');
  console.error('Please set DATABASE_URL in your .env file or environment variables.');
  process.exit(1);
}

try {
  console.log('Starting database migration...');
  console.log('This will apply schema changes from shared/schema.ts to your database.');
  console.log('\nRunning migration...');
  
  execSync('npx drizzle-kit push:pg', { stdio: 'inherit' });
  
  console.log('\nMigration completed successfully!');
  console.log('Your database schema is now up-to-date.');
} catch (error) {
  console.error('\nMigration failed:', error.message);
  console.error('Please check your database connection and try again.');
  process.exit(1);
}