/**
 * ComplexCare CRM Demo Data Seeding Script
 * 
 * This script populates the database with sample data for testing and demo purposes
 * - Creates demo patients, staff, appointments, care plans
 * - Creates a demo tenant organization
 * - Only runs if the database is empty
 */

require('dotenv').config();
const { db } = require('../server/db');
const { users, patients, careStaff, appointments, carePlans, tenants } = require('../shared/schema');
const { cryptoService } = require('../server/crypto');
const { eq } = require('drizzle-orm');

async function main() {
  console.log('ComplexCare CRM Demo Data Seeder');
  console.log('===============================');
  
  try {
    // Check if we already have data
    const existingPatients = await db.select({ count: { _count: users } }).from(patients);
    if (existingPatients[0]?.count > 0) {
      console.log('Database already contains data. Skipping seed operation.');
      console.log('If you want to re-seed, please clear the database first.');
      return;
    }
    
    console.log('Seeding database with demo data...');
    
    // Create demo tenant
    console.log('Creating demo tenant organization...');
    const [tenant] = await db.insert(tenants).values({
      name: "City Health Partners",
      domain: "cityhealthpartners.com",
      status: "active",
      subscriptionTier: "professional",
      userLimit: 100,
      contactEmail: "admin@cityhealthpartners.com",
      contactName: "John Smith",
      contactPhone: "+1234567890",
      createdAt: new Date(),
      lastActivity: new Date(),
      nhsIntegrationEnabled: false,
      billingInfo: "Monthly subscription",
      metadata: {}
    }).returning();
    
    console.log(`Created tenant: ${tenant.name} (ID: ${tenant.id})`);
    
    // Create demo admin user
    console.log('Creating demo admin user...');
    const demoPassword = await cryptoService.hashPassword("demo123");
    const [admin] = await db.insert(users).values({
      username: "drjohnson",
      password: demoPassword,
      email: "sarah.johnson@cityhealthpartners.com",
      role: "admin",
      name: "Dr. Sarah Johnson",
      createdAt: new Date(),
      tenantId: tenant.id
    }).returning();
    
    console.log(`Created admin user: ${admin.name} (ID: ${admin.id})`);
    
    // Create demo nurse user
    const [nurse] = await db.insert(users).values({
      username: "nurse",
      password: demoPassword,
      email: "lisa.chen@cityhealthpartners.com",
      role: "care_staff",
      name: "Nurse Lisa Chen",
      createdAt: new Date(),
      tenantId: tenant.id
    }).returning();
    
    console.log(`Created care staff user: ${nurse.name} (ID: ${nurse.id})`);
    
    // Create demo patient user
    const [patientUser] = await db.insert(users).values({
      username: "patient",
      password: demoPassword,
      email: "emma.wilson@example.com",
      role: "patient",
      name: "Emma Wilson",
      createdAt: new Date(),
      tenantId: tenant.id
    }).returning();
    
    console.log(`Created patient user: ${patientUser.name} (ID: ${patientUser.id})`);
    
    // Create staff profiles
    console.log('Creating staff profiles...');
    const [drJohnson] = await db.insert(careStaff).values({
      userId: admin.id,
      staffId: "STAFF-2023-001",
      name: "Dr. Sarah Johnson",
      position: "Lead Physician",
      department: "General Practice",
      phone: "07700 900001",
      email: "sarah.johnson@cityhealthpartners.com",
      qualifications: "MD, MRCGP",
      status: "Active",
      createdAt: new Date()
    }).returning();
    
    const [nurseProfile] = await db.insert(careStaff).values({
      userId: nurse.id,
      staffId: "STAFF-2023-002",
      name: "Nurse Lisa Chen",
      position: "Senior Nurse",
      department: "Community Nursing",
      phone: "07700 900002",
      email: "lisa.chen@cityhealthpartners.com",
      qualifications: "RN, BSN",
      status: "Active",
      createdAt: new Date()
    }).returning();
    
    console.log(`Created ${2} staff profiles`);
    
    // Create demo patients
    console.log('Creating patient profiles...');
    const [patient1] = await db.insert(patients).values({
      patientId: "PAT-2023-001",
      userId: patientUser.id,
      tenantId: tenant.id,
      name: "Emma Wilson",
      dateOfBirth: "1981-05-12",
      gender: "Female",
      address: "123 Main St, Anytown, UK",
      phone: "07700 900123",
      email: "emma.wilson@example.com",
      emergencyContact: "John Wilson (Husband) - 07700 900124",
      careType: "Home Care",
      status: "Active",
      notes: "Regular check-ups every 3 months. Prefers morning appointments.",
      medicalHistory: "History of hypertension. On medication since 2018.",
      createdAt: new Date()
    }).returning();
    
    const [patient2] = await db.insert(patients).values({
      patientId: "PAT-2023-042",
      tenantId: tenant.id,
      name: "James Davis",
      dateOfBirth: "1956-11-28",
      gender: "Male",
      address: "45 Oak Avenue, Othertown, UK",
      phone: "07700 900125",
      email: "james.davis@example.com",
      emergencyContact: "Mary Davis (Daughter) - 07700 900126",
      careType: "Residential",
      status: "Review",
      notes: "Needs assistance with daily activities. Weekly physiotherapy.",
      medicalHistory: "Type 2 diabetes, diagnosed in 2015. Hip replacement in 2020.",
      createdAt: new Date()
    }).returning();
    
    console.log(`Created ${2} patient profiles`);
    
    // Create appointments
    console.log('Creating appointments...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const [appointment1] = await db.insert(appointments).values({
      patientId: patient1.id,
      staffId: drJohnson.id,
      tenantId: tenant.id,
      title: "Annual check-up",
      description: "Regular health assessment",
      dateTime: new Date(today.setHours(9, 0, 0, 0)),
      duration: 60,
      status: "Confirmed",
      location: "Main Clinic, Room 3",
      notes: "Patient should bring medication list and recent test results.",
      createdAt: new Date()
    }).returning();
    
    const [appointment2] = await db.insert(appointments).values({
      patientId: patient2.id,
      staffId: nurseProfile.id,
      tenantId: tenant.id,
      title: "Medication review",
      description: "Review current medications and adjust as needed",
      dateTime: new Date(today.setHours(11, 30, 0, 0)),
      duration: 30,
      status: "Pending",
      location: "East Wing, Room 12",
      createdAt: new Date()
    }).returning();
    
    console.log(`Created ${2} appointments`);
    
    // Create care plan
    console.log('Creating care plans...');
    const [carePlan1] = await db.insert(carePlans).values({
      patientId: patient1.id,
      tenantId: tenant.id,
      title: "Comprehensive Care Plan",
      description: "Holistic care plan addressing all current health needs and preventive measures.",
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
      status: "Active",
      assessments: [{
        title: "Initial Health Assessment",
        description: "Complete health evaluation including physical and cognitive assessment."
      }],
      goals: [{
        title: "Improved Mobility",
        description: "Increase walking distance to 500m without assistance",
        targetDate: new Date(new Date().setMonth(new Date().getMonth() + 3))
      }],
      interventions: [{
        title: "Physical Therapy",
        description: "Twice weekly sessions focusing on lower body strength",
        frequency: "Twice weekly"
      }],
      medications: [{
        name: "Paracetamol",
        dosage: "500mg",
        frequency: "As needed for pain",
        instructions: "Take with food"
      }],
      reviewSchedule: "Monthly",
      createdBy: drJohnson.id,
      lastUpdatedBy: drJohnson.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    console.log(`Created ${1} care plans`);
    
    console.log('\nDemo data seeding completed successfully!');
    console.log('You can now log in with the following demo accounts:');
    console.log('\nAdmin: username=drjohnson, password=demo123');
    console.log('Care Staff: username=nurse, password=demo123');
    console.log('Patient: username=patient, password=demo123');
  } catch (error) {
    console.error('Error seeding demo data:', error);
    process.exit(1);
  }
}

main();