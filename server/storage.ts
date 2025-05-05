import { 
  users, type User, type InsertUser,
  patients, type Patient, type InsertPatient,
  careStaff, type CareStaff, type InsertCareStaff,
  appointments, type Appointment, type InsertAppointment,
  carePlans, type CarePlan, type InsertCarePlan,
  activityLogs, type ActivityLog, type InsertActivityLog,
  tenants, type Tenant, type InsertTenant,
  nhsDigitalIntegrations, type NhsDigitalIntegration, type InsertNhsDigitalIntegration
} from "@shared/schema";
import { cryptoService } from "./crypto";

// Define storage interface with all required methods
export interface IStorage {
  // User methods
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: number, password: string): Promise<User>;
  
  // Patient methods
  getAllPatients(): Promise<Patient[]>;
  getPatient(id: number): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: number, patient: InsertPatient): Promise<Patient>;
  getPatientCount(): Promise<number>;
  getRecentPatients(limit: number): Promise<Patient[]>;
  
  // Care staff methods
  getAllStaff(): Promise<CareStaff[]>;
  getStaff(id: number): Promise<CareStaff | undefined>;
  createStaff(staff: InsertCareStaff): Promise<CareStaff>;
  updateStaff(id: number, staff: InsertCareStaff): Promise<CareStaff>;
  updateStaffStatus(id: number, status: string): Promise<CareStaff>;
  getActiveStaffCount(): Promise<number>;
  
  // Appointment methods
  getAllAppointments(): Promise<Appointment[]>;
  getAppointment(id: number): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment>;
  getPatientAppointments(patientId: number): Promise<Appointment[]>;
  getTodayAppointments(): Promise<Appointment[]>;
  getTodayAppointmentsCount(): Promise<number>;
  
  // Care plan methods
  getAllCarePlans(): Promise<CarePlan[]>;
  getCarePlan(id: number): Promise<CarePlan | undefined>;
  createCarePlan(carePlan: InsertCarePlan): Promise<CarePlan>;
  updateCarePlan(id: number, carePlan: InsertCarePlan): Promise<CarePlan>;
  getPatientCarePlans(patientId: number): Promise<CarePlan[]>;
  getActiveCarePlansCount(): Promise<number>;
  
  // Activity log methods
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getRecentActivities(limit: number): Promise<ActivityLog[]>;
  
  // Report methods
  getPatientSummaryReport(startDate: string, endDate: string): Promise<any>;
  getAppointmentAnalysisReport(startDate: string, endDate: string): Promise<any>;
  getCarePlanMetricsReport(startDate: string, endDate: string): Promise<any>;
  getStaffActivityReport(startDate: string, endDate: string): Promise<any>;
  
  // Tenant methods
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: number, tenant: InsertTenant): Promise<Tenant>;
  getTenantById(id: number): Promise<Tenant | undefined>;
  getAllTenants(): Promise<Tenant[]>;

  // NHS Digital Integration methods
  getNhsIntegrationByTenantId(tenantId: number): Promise<NhsDigitalIntegration | undefined>;
  createNhsIntegration(integration: InsertNhsDigitalIntegration): Promise<NhsDigitalIntegration>;
  updateNhsIntegration(id: number, integration: InsertNhsDigitalIntegration): Promise<NhsDigitalIntegration>;
  updateNhsIntegrationLastVerified(id: number): Promise<NhsDigitalIntegration>;
  updateTenantNhsIntegration(tenantId: number, enabled: boolean): Promise<Tenant>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private patients: Map<number, Patient>;
  private staff: Map<number, CareStaff>;
  private appointments: Map<number, Appointment>;
  private carePlans: Map<number, CarePlan>;
  private activityLogs: Map<number, ActivityLog>;
  private tenants: Map<number, Tenant>;
  private nhsIntegrations: Map<number, NhsDigitalIntegration>;
  
  currentId: {
    users: number;
    patients: number;
    staff: number;
    appointments: number;
    carePlans: number;
    activityLogs: number;
    tenants: number;
    nhsIntegrations: number;
  };

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.staff = new Map();
    this.appointments = new Map();
    this.carePlans = new Map();
    this.activityLogs = new Map();
    this.tenants = new Map();
    this.nhsIntegrations = new Map();
    
    this.currentId = {
      users: 1,
      patients: 1,
      staff: 1,
      appointments: 1,
      carePlans: 1,
      activityLogs: 1,
      tenants: 1,
      nhsIntegrations: 1,
    };
    
    // Initialize with seed data
    this.initSeedData();
  }

  private async initSeedData() {
    // Create super admin user
    const adminPassword = await cryptoService.hashPassword("admin123");
    await this.createUser({
      username: "admin",
      password: adminPassword,
      email: "admin@complexcare.dev",
      role: "superadmin",
      name: "Admin User",
    });
    
    // Create demo users
    const demoPassword = await cryptoService.hashPassword("demo123");
    await this.createUser({
      username: "drjohnson",
      password: demoPassword,
      email: "sarah.johnson@complexcare.dev",
      role: "admin",
      name: "Dr. Sarah Johnson",
    });
    
    await this.createUser({
      username: "nurse",
      password: demoPassword,
      email: "lisa.chen@complexcare.dev",
      role: "care_staff",
      name: "Nurse Lisa Chen",
    });
    
    await this.createUser({
      username: "patient",
      password: demoPassword,
      email: "emma.wilson@example.com",
      role: "patient",
      name: "Emma Wilson",
    });

    // Create demo tenant
    const tenant = {
      id: this.currentId.tenants++,
      name: "City Health Partners",
      domain: "cityhealthpartners.com",
      status: "active",
      plan: "professional",
      createdAt: new Date().toISOString(),
      nhsIntegrationEnabled: false
    };
    this.tenants.set(tenant.id, tenant);
    
    // Create demo patients
    const patient1 = await this.createPatient({
      patientId: "PAT-2023-001",
      userId: 3,
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
    });
    
    await this.createPatient({
      patientId: "PAT-2023-042",
      userId: undefined,
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
    });
    
    await this.createPatient({
      patientId: "PAT-2023-078",
      userId: undefined,
      name: "Anna Brown",
      dateOfBirth: "1969-07-03",
      gender: "Female",
      address: "8 Pine Lane, Sometown, UK",
      phone: "07700 900127",
      email: "anna.brown@example.com",
      emergencyContact: "Robert Brown (Son) - 07700 900128",
      careType: "Day Care",
      status: "Active",
      notes: "Attends day care center three times a week. Enjoys group activities.",
      medicalHistory: "Mild cognitive impairment. Heart condition monitored regularly.",
    });
    
    await this.createPatient({
      patientId: "PAT-2023-104",
      userId: undefined,
      name: "Oliver Taylor",
      dateOfBirth: "1992-09-17",
      gender: "Male",
      address: "22 Elm Street, Newtown, UK",
      phone: "07700 900129",
      email: "oliver.taylor@example.com",
      emergencyContact: "Sarah Taylor (Sister) - 07700 900130",
      careType: "Home Care",
      status: "New",
      notes: "Recently enrolled in home care program. Initial assessment completed.",
      medicalHistory: "Recovering from sports injury. Physical therapy in progress.",
    });
    
    // Create demo staff
    const staff1 = await this.createStaff({
      userId: 2,
      staffId: "STAFF-2023-001",
      name: "Dr. Sarah Johnson",
      position: "Lead Physician",
      department: "General Practice",
      phone: "07700 900001",
      email: "sarah.johnson@complexcare.dev",
      qualifications: "MD, MRCGP",
      status: "Active",
    });
    
    const staff2 = await this.createStaff({
      userId: 2,
      staffId: "STAFF-2023-002",
      name: "Nurse Lisa Chen",
      position: "Senior Nurse",
      department: "Community Nursing",
      phone: "07700 900002",
      email: "lisa.chen@complexcare.dev",
      qualifications: "RN, BSN",
      status: "Active",
    });
    
    // Create demo appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    await this.createAppointment({
      patientId: 1,
      staffId: 1,
      title: "Annual check-up",
      description: "Regular health assessment",
      dateTime: new Date(today.setHours(9, 0, 0, 0)).toISOString(),
      duration: 60,
      status: "Confirmed",
      location: "Main Clinic, Room 3",
      notes: "Patient should bring medication list and recent test results.",
    });
    
    await this.createAppointment({
      patientId: 2,
      staffId: 2,
      title: "Medication review",
      description: "Review current medications and adjust as needed",
      dateTime: new Date(today.setHours(10, 30, 0, 0)).toISOString(),
      duration: 30,
      status: "Pending",
      location: "East Wing, Room 12",
      notes: "",
    });
    
    await this.createAppointment({
      patientId: 3,
      staffId: 1,
      title: "Follow-up consultation",
      description: "Follow-up on last week's treatment",
      dateTime: new Date(today.setHours(11, 45, 0, 0)).toISOString(),
      duration: 45,
      status: "Confirmed",
      location: "Main Clinic, Room 5",
      notes: "",
    });
    
    // Create demo care plans
    const carePlan1 = await this.createCarePlan({
      patientId: 1,
      title: "Comprehensive Care Plan",
      description: "Holistic care plan addressing all current health needs and preventive measures.",
      startDate: new Date("2023-06-01").toISOString(),
      endDate: new Date("2023-12-31").toISOString(),
      status: "Active",
      assessments: [
        { title: "Initial Health Assessment", description: "Complete health evaluation including physical and cognitive assessment." }
      ],
      goals: [
        { title: "Improved Mobility", description: "Increase walking distance to 500m without assistance", targetDate: "2023-09-30" }
      ],
      interventions: [
        { title: "Physical Therapy", description: "Twice weekly sessions focusing on lower body strength", frequency: "Twice weekly" }
      ],
      medications: [
        { name: "Paracetamol", dosage: "500mg", frequency: "As needed for pain", instructions: "Take with food" }
      ],
      reviewSchedule: "Monthly",
      createdBy: 2,
      lastUpdatedBy: 2,
    });
    
    // Create demo activity logs
    await this.createActivityLog({
      userId: 2,
      action: "create",
      entityType: "patient",
      entityId: 1,
      details: "Created new patient: Emma Wilson",
    });
    
    await this.createActivityLog({
      userId: 2,
      action: "create",
      entityType: "appointment",
      entityId: 1,
      details: "Scheduled new appointment for Emma Wilson: Annual check-up",
    });
    
    await this.createActivityLog({
      userId: 2,
      action: "create",
      entityType: "care_plan",
      entityId: 1,
      details: "Created new care plan for Emma Wilson: Comprehensive Care Plan",
    });
  }

  // User methods
  async getUserById(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id, createdAt: new Date().toISOString() };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserPassword(id: number, password: string): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, password };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Patient methods
  async getAllPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = this.currentId.patients++;
    const patient: Patient = { ...insertPatient, id, createdAt: new Date().toISOString() };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatient(id: number, patientData: InsertPatient): Promise<Patient> {
    const patient = await this.getPatient(id);
    if (!patient) {
      throw new Error("Patient not found");
    }
    
    const updatedPatient = { ...patient, ...patientData };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }
  
  async getPatientCount(): Promise<number> {
    return this.patients.size;
  }
  
  async getRecentPatients(limit: number): Promise<Patient[]> {
    return Array.from(this.patients.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // Care staff methods
  async getAllStaff(): Promise<CareStaff[]> {
    return Array.from(this.staff.values());
  }

  async getStaff(id: number): Promise<CareStaff | undefined> {
    return this.staff.get(id);
  }

  async createStaff(insertStaff: InsertCareStaff): Promise<CareStaff> {
    const id = this.currentId.staff++;
    const staff: CareStaff = { ...insertStaff, id, createdAt: new Date().toISOString() };
    this.staff.set(id, staff);
    return staff;
  }

  async updateStaff(id: number, staffData: InsertCareStaff): Promise<CareStaff> {
    const staff = await this.getStaff(id);
    if (!staff) {
      throw new Error("Staff member not found");
    }
    
    const updatedStaff = { ...staff, ...staffData };
    this.staff.set(id, updatedStaff);
    return updatedStaff;
  }
  
  async updateStaffStatus(id: number, status: string): Promise<CareStaff> {
    const staff = await this.getStaff(id);
    if (!staff) {
      throw new Error("Staff member not found");
    }
    
    const updatedStaff = { ...staff, status };
    this.staff.set(id, updatedStaff);
    return updatedStaff;
  }
  
  async getActiveStaffCount(): Promise<number> {
    return Array.from(this.staff.values()).filter(staff => staff.status === "Active").length;
  }

  // Appointment methods
  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = this.currentId.appointments++;
    const appointment: Appointment = { ...insertAppointment, id, createdAt: new Date().toISOString() };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointment(id: number, appointmentData: InsertAppointment): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    
    const updatedAppointment = { ...appointment, ...appointmentData };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
  
  async updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    
    const updatedAppointment = { ...appointment, status };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
  
  async getPatientAppointments(patientId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values())
      .filter(appointment => appointment.patientId === patientId)
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }
  
  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return Array.from(this.appointments.values())
      .filter(appointment => {
        const appointmentDate = new Date(appointment.dateTime);
        return appointmentDate >= today && appointmentDate < tomorrow;
      })
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
      .map(appointment => {
        // Enhance appointment with patient and staff names
        const patient = this.patients.get(appointment.patientId);
        const staffMember = appointment.staffId ? this.staff.get(appointment.staffId) : undefined;
        
        return {
          ...appointment,
          patientName: patient?.name,
          staffName: staffMember?.name,
        };
      });
  }
  
  async getTodayAppointmentsCount(): Promise<number> {
    const todayAppointments = await this.getTodayAppointments();
    return todayAppointments.length;
  }

  // Care plan methods
  async getAllCarePlans(): Promise<CarePlan[]> {
    return Array.from(this.carePlans.values());
  }

  async getCarePlan(id: number): Promise<CarePlan | undefined> {
    return this.carePlans.get(id);
  }

  async createCarePlan(insertCarePlan: InsertCarePlan): Promise<CarePlan> {
    const id = this.currentId.carePlans++;
    const now = new Date().toISOString();
    const carePlan: CarePlan = { 
      ...insertCarePlan, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.carePlans.set(id, carePlan);
    return carePlan;
  }

  async updateCarePlan(id: number, carePlanData: InsertCarePlan): Promise<CarePlan> {
    const carePlan = await this.getCarePlan(id);
    if (!carePlan) {
      throw new Error("Care plan not found");
    }
    
    const updatedCarePlan = { 
      ...carePlan, 
      ...carePlanData,
      updatedAt: new Date().toISOString()
    };
    this.carePlans.set(id, updatedCarePlan);
    return updatedCarePlan;
  }
  
  async getPatientCarePlans(patientId: number): Promise<CarePlan[]> {
    return Array.from(this.carePlans.values())
      .filter(carePlan => carePlan.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getActiveCarePlansCount(): Promise<number> {
    return Array.from(this.carePlans.values()).filter(carePlan => carePlan.status === "Active").length;
  }

  // Activity log methods
  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const id = this.currentId.activityLogs++;
    const log: ActivityLog = { 
      ...insertLog, 
      id, 
      timestamp: new Date().toISOString(),
      ipAddress: "127.0.0.1" // In a real app, this would come from the request
    };
    this.activityLogs.set(id, log);
    return log;
  }
  
  async getRecentActivities(limit: number): Promise<ActivityLog[]> {
    const logs = Array.from(this.activityLogs.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    // Transform logs to the format needed by the frontend
    return Promise.all(logs.map(async log => {
      let patientId = 0;
      let patientName = "";
      
      if (log.entityType === "patient" && log.entityId) {
        patientId = log.entityId;
        const patient = await this.getPatient(patientId);
        if (patient) {
          patientName = patient.name;
        }
      } else if (log.entityType === "appointment" && log.entityId) {
        const appointment = await this.getAppointment(log.entityId);
        if (appointment) {
          patientId = appointment.patientId;
          const patient = await this.getPatient(patientId);
          if (patient) {
            patientName = patient.name;
          }
        }
      } else if (log.entityType === "care_plan" && log.entityId) {
        const carePlan = await this.getCarePlan(log.entityId);
        if (carePlan) {
          patientId = carePlan.patientId;
          const patient = await this.getPatient(patientId);
          if (patient) {
            patientName = patient.name;
          }
        }
      }
      
      const user = await this.getUserById(log.userId);
      const performedBy = user ? user.name : "Unknown User";
      
      let type: string;
      switch(`${log.action}_${log.entityType}`) {
        case "create_patient":
          type = "new_patient";
          break;
        case "create_appointment":
        case "update_appointment":
          type = "appointment_scheduled";
          break;
        case "cancel_appointment":
          type = "appointment_cancelled";
          break;
        case "create_care_plan":
        case "update_care_plan":
          type = "care_plan_update";
          break;
        default:
          type = "notes_added";
      }
      
      return {
        id: log.id.toString(),
        type,
        patientName,
        patientId,
        performedBy,
        timestamp: log.timestamp,
      };
    }));
  }

  // Report methods
  async getPatientSummaryReport(startDate: string, endDate: string): Promise<any> {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    // Get patients within the date range
    const patientsInRange = Array.from(this.patients.values())
      .filter(patient => {
        const createdAt = new Date(patient.createdAt);
        return createdAt >= startDateTime && createdAt <= endDateTime;
      });
    
    // Count by status
    const byStatus = [
      { name: "Active", value: patientsInRange.filter(p => p.status === "Active").length },
      { name: "Inactive", value: patientsInRange.filter(p => p.status === "Inactive").length },
      { name: "Review", value: patientsInRange.filter(p => p.status === "Review").length },
      { name: "New", value: patientsInRange.filter(p => p.status === "New").length },
    ];
    
    // Count by care type
    const byCareType = [
      { name: "Home Care", value: patientsInRange.filter(p => p.careType === "Home Care").length },
      { name: "Day Care", value: patientsInRange.filter(p => p.careType === "Day Care").length },
      { name: "Residential", value: patientsInRange.filter(p => p.careType === "Residential").length },
    ];
    
    return {
      title: "Patient Summary Report",
      period: `${startDate} - ${endDate}`,
      summary: {
        totalPatients: this.patients.size,
        newPatients: patientsInRange.length,
        activePatients: Array.from(this.patients.values()).filter(p => p.status === "Active").length,
        inactivePatients: Array.from(this.patients.values()).filter(p => p.status === "Inactive").length,
      },
      byStatus,
      byCareType,
    };
  }
  
  async getAppointmentAnalysisReport(startDate: string, endDate: string): Promise<any> {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    // Get appointments within the date range
    const appointmentsInRange = Array.from(this.appointments.values())
      .filter(appointment => {
        const appointmentDate = new Date(appointment.dateTime);
        return appointmentDate >= startDateTime && appointmentDate <= endDateTime;
      });
    
    // Count by status
    const byStatus = [
      { name: "Completed", value: appointmentsInRange.filter(a => a.status === "Completed").length },
      { name: "Confirmed", value: appointmentsInRange.filter(a => a.status === "Confirmed").length },
      { name: "Scheduled", value: appointmentsInRange.filter(a => a.status === "Scheduled").length },
      { name: "Pending", value: appointmentsInRange.filter(a => a.status === "Pending").length },
      { name: "Cancelled", value: appointmentsInRange.filter(a => a.status === "Cancelled").length },
    ];
    
    // Count by day of week
    const byDayOfWeek = [
      { name: "Monday", value: appointmentsInRange.filter(a => new Date(a.dateTime).getDay() === 1).length },
      { name: "Tuesday", value: appointmentsInRange.filter(a => new Date(a.dateTime).getDay() === 2).length },
      { name: "Wednesday", value: appointmentsInRange.filter(a => new Date(a.dateTime).getDay() === 3).length },
      { name: "Thursday", value: appointmentsInRange.filter(a => new Date(a.dateTime).getDay() === 4).length },
      { name: "Friday", value: appointmentsInRange.filter(a => new Date(a.dateTime).getDay() === 5).length },
      { name: "Saturday", value: appointmentsInRange.filter(a => new Date(a.dateTime).getDay() === 6).length },
      { name: "Sunday", value: appointmentsInRange.filter(a => new Date(a.dateTime).getDay() === 0).length },
    ];
    
    return {
      title: "Appointment Analysis Report",
      period: `${startDate} - ${endDate}`,
      summary: {
        totalAppointments: appointmentsInRange.length,
        completed: appointmentsInRange.filter(a => a.status === "Completed").length,
        cancelled: appointmentsInRange.filter(a => a.status === "Cancelled").length,
        pending: appointmentsInRange.filter(a => ["Scheduled", "Pending", "Confirmed"].includes(a.status)).length,
      },
      byStatus,
      byDayOfWeek,
    };
  }
  
  async getCarePlanMetricsReport(startDate: string, endDate: string): Promise<any> {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    // Get care plans within the date range
    const carePlansInRange = Array.from(this.carePlans.values())
      .filter(carePlan => {
        const createdAt = new Date(carePlan.createdAt);
        return createdAt >= startDateTime && createdAt <= endDateTime;
      });
    
    // Count by status
    const byStatus = [
      { name: "Active", value: carePlansInRange.filter(cp => cp.status === "Active").length },
      { name: "Draft", value: carePlansInRange.filter(cp => cp.status === "Draft").length },
      { name: "Completed", value: carePlansInRange.filter(cp => cp.status === "Completed").length },
      { name: "Cancelled", value: carePlansInRange.filter(cp => cp.status === "Cancelled").length },
    ];
    
    // Count by review frequency
    const reviewSchedules = Array.from(new Set(carePlansInRange.map(cp => cp.reviewSchedule || "Not Specified")));
    const byReviewFrequency = reviewSchedules.map(schedule => ({
      name: schedule,
      value: carePlansInRange.filter(cp => (cp.reviewSchedule || "Not Specified") === schedule).length,
    }));
    
    return {
      title: "Care Plan Metrics Report",
      period: `${startDate} - ${endDate}`,
      summary: {
        totalPlans: carePlansInRange.length,
        activePlans: carePlansInRange.filter(cp => cp.status === "Active").length,
        draftPlans: carePlansInRange.filter(cp => cp.status === "Draft").length,
        completedPlans: carePlansInRange.filter(cp => cp.status === "Completed").length,
      },
      byStatus,
      byReviewFrequency,
    };
  }
  
  async getStaffActivityReport(startDate: string, endDate: string): Promise<any> {
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    
    // Get activities within the date range
    const activitiesInRange = Array.from(this.activityLogs.values())
      .filter(log => {
        const timestamp = new Date(log.timestamp);
        return timestamp >= startDateTime && timestamp <= endDateTime;
      });
    
    // Count activities by staff member
    const staffActivities = new Map<number, number>();
    for (const log of activitiesInRange) {
      const count = staffActivities.get(log.userId) || 0;
      staffActivities.set(log.userId, count + 1);
    }
    
    // Get top staff by activity
    const topActivityByStaff = await Promise.all(
      Array.from(staffActivities.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(async ([userId, count]) => {
          const user = await this.getUserById(userId);
          return {
            name: user?.name || `User ID ${userId}`,
            value: count,
          };
        })
    );
    
    // Count staff by department
    const departments = Array.from(new Set(Array.from(this.staff.values()).map(s => s.department || "Unassigned")));
    const byDepartment = departments.map(dept => ({
      name: dept,
      value: Array.from(this.staff.values()).filter(s => (s.department || "Unassigned") === dept).length,
    }));
    
    return {
      title: "Staff Activity Report",
      period: `${startDate} - ${endDate}`,
      summary: {
        totalStaff: this.staff.size,
        activeStaff: Array.from(this.staff.values()).filter(s => s.status === "Active").length,
        onLeaveStaff: Array.from(this.staff.values()).filter(s => s.status === "On Leave").length,
        inactiveStaff: Array.from(this.staff.values()).filter(s => s.status === "Inactive").length,
      },
      byDepartment,
      topActivityByStaff,
    };
  }

  // Tenant methods
  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const id = this.currentId.tenants++;
    const newTenant: Tenant = {
      ...tenant,
      id,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      logo: null,
      userCount: 0,
      apiKey: null,
      customizations: null,
    };
    this.tenants.set(id, newTenant);
    return newTenant;
  }
  
  async updateTenant(id: number, tenant: InsertTenant): Promise<Tenant> {
    const existingTenant = this.tenants.get(id);
    if (!existingTenant) {
      throw new Error("Tenant not found");
    }
    
    const updatedTenant: Tenant = {
      ...existingTenant,
      ...tenant,
    };
    this.tenants.set(id, updatedTenant);
    return updatedTenant;
  }
  
  async getTenantById(id: number): Promise<Tenant | undefined> {
    return this.tenants.get(id);
  }
  
  async getAllTenants(): Promise<Tenant[]> {
    return Array.from(this.tenants.values());
  }

  // NHS Digital Integration methods
  async getNhsIntegrationByTenantId(tenantId: number): Promise<NhsDigitalIntegration | undefined> {
    return Array.from(this.nhsIntegrations.values()).find(integration => integration.tenantId === tenantId);
  }

  async createNhsIntegration(integration: InsertNhsDigitalIntegration): Promise<NhsDigitalIntegration> {
    const id = this.currentId.nhsIntegrations++;
    const newIntegration: NhsDigitalIntegration = {
      ...integration,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastVerified: null
    };
    this.nhsIntegrations.set(id, newIntegration);
    return newIntegration;
  }

  async updateNhsIntegration(id: number, integration: InsertNhsDigitalIntegration): Promise<NhsDigitalIntegration> {
    const existingIntegration = this.nhsIntegrations.get(id);
    if (!existingIntegration) {
      throw new Error("NHS Digital integration not found");
    }

    const updatedIntegration: NhsDigitalIntegration = {
      ...existingIntegration,
      ...integration,
      updatedAt: new Date().toISOString()
    };
    this.nhsIntegrations.set(id, updatedIntegration);
    return updatedIntegration;
  }

  async updateNhsIntegrationLastVerified(id: number): Promise<NhsDigitalIntegration> {
    const integration = this.nhsIntegrations.get(id);
    if (!integration) {
      throw new Error("NHS Digital integration not found");
    }

    const updatedIntegration: NhsDigitalIntegration = {
      ...integration,
      lastVerified: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.nhsIntegrations.set(id, updatedIntegration);
    return updatedIntegration;
  }

  async updateTenantNhsIntegration(tenantId: number, enabled: boolean): Promise<Tenant> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) {
      throw new Error("Tenant not found");
    }

    const updatedTenant: Tenant = {
      ...tenant,
      nhsIntegrationEnabled: enabled
    };
    this.tenants.set(tenantId, updatedTenant);
    return updatedTenant;
  }
}

import connectPg from "connect-pg-simple";
import session from "express-session";
import { eq } from "drizzle-orm";
import { db } from "./db";

const PostgresSessionStore = connectPg(session);

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool: db.client, 
      createTableIfMissing: true 
    });
  }
  
  // User methods
  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async updateUserPassword(id: number, password: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ password })
      .where(eq(users.id, id))
      .returning();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return user;
  }
  
  // Patient methods
  async getAllPatients(): Promise<Patient[]> {
    return db.select().from(patients);
  }

  async getPatient(id: number): Promise<Patient | undefined> {
    const [patient] = await db.select().from(patients).where(eq(patients.id, id));
    return patient || undefined;
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const [patient] = await db
      .insert(patients)
      .values(insertPatient)
      .returning();
    return patient;
  }

  async updatePatient(id: number, patientData: InsertPatient): Promise<Patient> {
    const [patient] = await db
      .update(patients)
      .set(patientData)
      .where(eq(patients.id, id))
      .returning();
    
    if (!patient) {
      throw new Error("Patient not found");
    }
    
    return patient;
  }
  
  async getPatientCount(): Promise<number> {
    const result = await db.select({ count: db.fn.count() }).from(patients);
    return Number(result[0].count) || 0;
  }
  
  async getRecentPatients(limit: number): Promise<Patient[]> {
    return db.select()
      .from(patients)
      .orderBy(patients.createdAt)
      .limit(limit);
  }
  
  // Care staff methods
  async getAllStaff(): Promise<CareStaff[]> {
    return db.select().from(careStaff);
  }

  async getStaff(id: number): Promise<CareStaff | undefined> {
    const [staff] = await db.select().from(careStaff).where(eq(careStaff.id, id));
    return staff || undefined;
  }

  async createStaff(insertStaff: InsertCareStaff): Promise<CareStaff> {
    const [staff] = await db
      .insert(careStaff)
      .values(insertStaff)
      .returning();
    return staff;
  }

  async updateStaff(id: number, staffData: InsertCareStaff): Promise<CareStaff> {
    const [staff] = await db
      .update(careStaff)
      .set(staffData)
      .where(eq(careStaff.id, id))
      .returning();
    
    if (!staff) {
      throw new Error("Staff member not found");
    }
    
    return staff;
  }
  
  async updateStaffStatus(id: number, status: string): Promise<CareStaff> {
    const [staff] = await db
      .update(careStaff)
      .set({ status })
      .where(eq(careStaff.id, id))
      .returning();
    
    if (!staff) {
      throw new Error("Staff member not found");
    }
    
    return staff;
  }
  
  async getActiveStaffCount(): Promise<number> {
    const result = await db
      .select({ count: db.fn.count() })
      .from(careStaff)
      .where(eq(careStaff.status, "Active"));
    return Number(result[0].count) || 0;
  }
  
  // Appointment methods
  async getAllAppointments(): Promise<Appointment[]> {
    return db.select().from(appointments);
  }

  async getAppointment(id: number): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment || undefined;
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values(insertAppointment)
      .returning();
    return appointment;
  }

  async updateAppointment(id: number, appointmentData: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .update(appointments)
      .set(appointmentData)
      .where(eq(appointments.id, id))
      .returning();
    
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    
    return appointment;
  }
  
  async updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
    const [appointment] = await db
      .update(appointments)
      .set({ status })
      .where(eq(appointments.id, id))
      .returning();
    
    if (!appointment) {
      throw new Error("Appointment not found");
    }
    
    return appointment;
  }
  
  async getPatientAppointments(patientId: number): Promise<Appointment[]> {
    return db
      .select()
      .from(appointments)
      .where(eq(appointments.patientId, patientId));
  }
  
  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // This is a simplification; for production, you would need more precise date filtering
    return db
      .select()
      .from(appointments)
      .where(appointments.dateTime >= today && appointments.dateTime < tomorrow);
  }
  
  async getTodayAppointmentsCount(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const result = await db
      .select({ count: db.fn.count() })
      .from(appointments)
      .where(appointments.dateTime >= today && appointments.dateTime < tomorrow);
    return Number(result[0].count) || 0;
  }
  
  // Care plan methods
  async getAllCarePlans(): Promise<CarePlan[]> {
    return db.select().from(carePlans);
  }

  async getCarePlan(id: number): Promise<CarePlan | undefined> {
    const [carePlan] = await db.select().from(carePlans).where(eq(carePlans.id, id));
    return carePlan || undefined;
  }

  async createCarePlan(insertCarePlan: InsertCarePlan): Promise<CarePlan> {
    const [carePlan] = await db
      .insert(carePlans)
      .values(insertCarePlan)
      .returning();
    return carePlan;
  }

  async updateCarePlan(id: number, carePlanData: InsertCarePlan): Promise<CarePlan> {
    const [carePlan] = await db
      .update(carePlans)
      .set(carePlanData)
      .where(eq(carePlans.id, id))
      .returning();
    
    if (!carePlan) {
      throw new Error("Care plan not found");
    }
    
    return carePlan;
  }
  
  async getPatientCarePlans(patientId: number): Promise<CarePlan[]> {
    return db
      .select()
      .from(carePlans)
      .where(eq(carePlans.patientId, patientId));
  }
  
  async getActiveCarePlansCount(): Promise<number> {
    const result = await db
      .select({ count: db.fn.count() })
      .from(carePlans)
      .where(eq(carePlans.status, "Active"));
    return Number(result[0].count) || 0;
  }
  
  // Activity log methods
  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db
      .insert(activityLogs)
      .values(insertLog)
      .returning();
    return log;
  }
  
  async getRecentActivities(limit: number): Promise<ActivityLog[]> {
    return db
      .select()
      .from(activityLogs)
      .orderBy(activityLogs.timestamp)
      .limit(limit);
  }
  
  // Report methods - These would be more complex in a real implementation
  async getPatientSummaryReport(startDate: string, endDate: string): Promise<any> {
    // Simplified implementation
    return {
      totalPatients: await this.getPatientCount(),
      activePatients: await db
        .select({ count: db.fn.count() })
        .from(patients)
        .where(eq(patients.status, "Active"))
        .then(result => Number(result[0].count) || 0)
    };
  }
  
  async getAppointmentAnalysisReport(startDate: string, endDate: string): Promise<any> {
    // Simplified implementation
    return {
      totalAppointments: await db
        .select({ count: db.fn.count() })
        .from(appointments)
        .then(result => Number(result[0].count) || 0),
      cancelledAppointments: await db
        .select({ count: db.fn.count() })
        .from(appointments)
        .where(eq(appointments.status, "Cancelled"))
        .then(result => Number(result[0].count) || 0)
    };
  }
  
  async getCarePlanMetricsReport(startDate: string, endDate: string): Promise<any> {
    // Simplified implementation
    return {
      totalCarePlans: await db
        .select({ count: db.fn.count() })
        .from(carePlans)
        .then(result => Number(result[0].count) || 0),
      activeCarePlans: await this.getActiveCarePlansCount()
    };
  }
  
  async getStaffActivityReport(startDate: string, endDate: string): Promise<any> {
    // Simplified implementation
    return {
      totalStaff: await db
        .select({ count: db.fn.count() })
        .from(careStaff)
        .then(result => Number(result[0].count) || 0),
      activeStaff: await this.getActiveStaffCount()
    };
  }
  
  // Tenant methods
  async createTenant(insertTenant: InsertTenant): Promise<Tenant> {
    const [tenant] = await db
      .insert(tenants)
      .values(insertTenant)
      .returning();
    return tenant;
  }

  async updateTenant(id: number, tenantData: InsertTenant): Promise<Tenant> {
    const [tenant] = await db
      .update(tenants)
      .set(tenantData)
      .where(eq(tenants.id, id))
      .returning();
    
    if (!tenant) {
      throw new Error("Tenant not found");
    }
    
    return tenant;
  }

  async getTenantById(id: number): Promise<Tenant | undefined> {
    const [tenant] = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, id));
    return tenant || undefined;
  }

  async getAllTenants(): Promise<Tenant[]> {
    return db.select().from(tenants);
  }
  
  // NHS Digital Integration methods
  async getNhsIntegrationByTenantId(tenantId: number): Promise<NhsDigitalIntegration | undefined> {
    const [integration] = await db
      .select()
      .from(nhsDigitalIntegrations)
      .where(eq(nhsDigitalIntegrations.tenantId, tenantId));
    return integration || undefined;
  }
  
  async createNhsIntegration(insertIntegration: InsertNhsDigitalIntegration): Promise<NhsDigitalIntegration> {
    const [integration] = await db
      .insert(nhsDigitalIntegrations)
      .values(insertIntegration)
      .returning();
    return integration;
  }
  
  async updateNhsIntegration(id: number, integrationData: InsertNhsDigitalIntegration): Promise<NhsDigitalIntegration> {
    const [integration] = await db
      .update(nhsDigitalIntegrations)
      .set(integrationData)
      .where(eq(nhsDigitalIntegrations.id, id))
      .returning();
    
    if (!integration) {
      throw new Error("NHS integration not found");
    }
    
    return integration;
  }
  
  async updateNhsIntegrationLastVerified(id: number): Promise<NhsDigitalIntegration> {
    const [integration] = await db
      .update(nhsDigitalIntegrations)
      .set({ lastVerified: new Date() })
      .where(eq(nhsDigitalIntegrations.id, id))
      .returning();
    
    if (!integration) {
      throw new Error("NHS integration not found");
    }
    
    return integration;
  }
  
  async updateTenantNhsIntegration(tenantId: number, enabled: boolean): Promise<Tenant> {
    const [tenant] = await db
      .update(tenants)
      .set({ nhsIntegrationEnabled: enabled })
      .where(eq(tenants.id, tenantId))
      .returning();
    
    if (!tenant) {
      throw new Error("Tenant not found");
    }
    
    return tenant;
  }
}

export const storage = new DatabaseStorage();
