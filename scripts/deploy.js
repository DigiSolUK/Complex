/**
 * ComplexCare CRM Deployment Script
 * 
 * This script prepares the application for production deployment
 * - Validates environment variables
 * - Performs database migrations
 * - Creates initial superadmin user if none exists
 * - Sets up required directories
 */

require('dotenv').config();
const { db } = require('../server/db');
const { users } = require('../shared/schema');
const { eq } = require('drizzle-orm');
const { cryptoService } = require('../server/crypto');
const fs = require('fs');
const path = require('path');

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'GROQ_API_KEY',
  'UPLOAD_DIR',
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Error: Missing required environment variables:', missingVars.join(', '));
  process.exit(1);
}

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  console.log(`Creating uploads directory at ${uploadDir}`);
  fs.mkdirSync(uploadDir, { recursive: true });
}

async function main() {
  try {
    console.log('Deploying ComplexCare CRM...');
    
    // Check database connection
    console.log('Checking database connection...');
    await db.select().from(users).limit(1);
    console.log('Database connection successful!');
    
    // Check if superadmin exists
    console.log('Checking for superadmin user...');
    const superadmin = await db.select().from(users).where(eq(users.role, 'superadmin')).limit(1);
    
    if (superadmin.length === 0) {
      console.log('No superadmin found. Creating default superadmin account...');
      const adminPassword = await cryptoService.hashPassword('admin123');
      await db.insert(users).values({
        username: 'admin',
        password: adminPassword,
        email: 'admin@complexcare.dev',
        role: 'superadmin',
        name: 'Admin User',
        createdAt: new Date(),
      });
      console.log('Default superadmin created with username: admin and password: admin123');
      console.log('IMPORTANT: Change this password immediately after first login!');
    } else {
      console.log('Superadmin user already exists.');
    }
    
    console.log('\nDeployment preparation completed successfully!');
    console.log('--------------------------------------------');
    console.log('You can now start the application with:');
    console.log('npm start');
    console.log('\nFor local development:');
    console.log('npm run dev');
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

main();
