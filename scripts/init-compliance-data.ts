import { db } from '../server/db';
import { cryptoService } from '../server/crypto';
import { storage } from '../server/storage';
import { complianceAnalyses, tenants, users } from '../shared/schema';
import { ComplianceResult } from '../server/storage';

async function main() {
  console.log('Initializing database with sample data...');

  try {
    // Check if we have a superadmin user
    const userResult = await db.select().from(users);
    if (userResult.length === 0) {
      console.log('Creating admin user...');
      const adminPassword = await cryptoService.hashPassword('admin123');
      await db.insert(users).values({
        username: 'admin',
        password: adminPassword,
        email: 'admin@complexcare.dev',
        role: 'superadmin',
        name: 'Admin User',
      });
    }

    // Check if we have a tenant
    const tenantResult = await db.select().from(tenants);
    if (tenantResult.length === 0) {
      console.log('Creating default tenant...');
      await db.insert(tenants).values({
        name: 'City Health Partners',
        domain: 'cityhealthpartners.com',
        status: 'active',
        subscriptionTier: 'professional',
        userLimit: 10,
        contactEmail: 'admin@cityhealthpartners.com',
        contactName: 'Admin User',
      });
    }

    // Create a sample compliance analysis
    console.log('Creating sample compliance analysis...');
    const sampleCompliance: ComplianceResult = {
      score: 85,
      areas: [
        {
          name: 'Data Security',
          score: 90,
          findings: [
            'Strong encryption for patient data',
            'Access controls well implemented',
            'Regular security audits'
          ],
          status: 'compliant',
          regulation: 'GDPR Article 32'
        },
        {
          name: 'Patient Consent',
          score: 75,
          findings: [
            'Consent forms need updating',
            'Withdrawal process needs improvement'
          ],
          status: 'at-risk',
          regulation: 'GDPR Article 7'
        },
        {
          name: 'Records Management',
          score: 88,
          findings: [
            'Well-structured storage system',
            'Automated retention policies'
          ],
          status: 'compliant',
          regulation: 'NHS Records Management Code'
        }
      ],
      recommendations: [
        'Update consent management system',
        'Implement additional staff training on data protection',
        'Review third-party data sharing agreements'
      ],
      overallStatus: 'at-risk',
      lastUpdated: new Date()
    };

    await storage.saveComplianceAnalysis(sampleCompliance);
    
    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    process.exit();
  }
}

main();
