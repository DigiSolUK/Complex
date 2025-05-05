import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { auth } from "./auth";
import { cryptoService } from "./crypto";
import { z } from "zod";
import { insertUserSchema, insertPatientSchema, insertCareStaffSchema, insertAppointmentSchema, insertCarePlanSchema, insertActivityLogSchema, insertNhsDigitalIntegrationSchema, insertTenantSchema } from "@shared/schema";
import aiRoutes from "./routes/ai";
import complianceRoutes from "./routes/compliance";
import nhsDigitalRoutes from "./routes/superadmin/nhs-integration";
import tenantRoutes from "./routes/superadmin/tenants";
import tenantThemeRoutes from "./routes/tenant-theme";


export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication middleware
  const authMiddlewares = auth.initialize();
  authMiddlewares.forEach(middleware => {
    app.use(middleware);
  });
  
  // Auth Routes
  app.post("/api/auth/login", (req, res, next) => {
    console.log("Login request received:", { username: req.body.username });
    console.log("Request headers:", req.headers);
    
    auth.authenticateLocal(req, res, (err) => {
      if (err) {
        console.error("Login error in route:", err);
        return next(err);
      }
      
      // This is only called if authentication was successful
      console.log("Login successful, sending user data", req.user);
      
      // Augment user data with role and tenant info for compatibility with frontend
      if (req.user) {
        const userData = req.user as any;
        // Default to care_staff role if not set
        userData.role = userData.role || "care_staff";
        // Set tenantId to 1 for existing users if not set
        userData.tenantId = userData.tenantId || 1;
      }
      
      res.json(req.user);
    });
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      // Validate the user data
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Hash the password
      const hashedPassword = await cryptoService.hashPassword(userData.password);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      // Log in the user automatically
      req.login(userWithoutPassword, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "An error occurred during registration" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    // Debug the session state
    console.log('Request cookies:', req.headers.cookie);
    console.log('Session ID:', req.sessionID);
    console.log('Passport isAuthenticated:', req.isAuthenticated());
    console.log('User in session:', req.user ? `User ID: ${req.user.id}` : 'No user');
    console.log('Session data:', req.session);
    console.log('User ID cookie:', req.cookies.user_id);
    
    // Case 1: User is authenticated through Passport
    if (req.isAuthenticated()) {
      console.log('User is authenticated via Passport');
      return res.json(req.user);
    }
    
    // Case 2: User is authenticated via our custom session mechanism
    if (req.session.isAuthenticated && req.session.userId) {
      console.log('User is authenticated via custom session, userId:', req.session.userId);
      // Fetch user data from storage and return it
      return storage.getUserById(req.session.userId)
        .then(user => {
          if (!user) {
            return res.status(401).json({ message: "User not found" });
          }
          // Remove password from response
          const { password: _, ...userWithoutPassword } = user;
          return res.json(userWithoutPassword);
        })
        .catch(err => {
          console.error("Error fetching user by ID:", err);
          return res.status(500).json({ message: "Error fetching user data" });
        });
    }
    
    // Case 3: User is not authenticated
    return res.status(401).json({ message: "Unauthorized" });
  });
  
  // Test session route - not protected for testing purposes
  app.get("/api/test-session", (req, res) => {
    // Set a test value in session if it doesn't exist
    if (!req.session.testValue) {
      req.session.testValue = Date.now();
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).json({ message: "Session save error" });
        }
        console.log("Session test value set:", req.session.testValue);
        return res.json({ 
          message: 'Session test value set', 
          sessionID: req.sessionID,
          testValue: req.session.testValue,
          cookies: req.headers.cookie
        });
      });
    } else {
      console.log("Session test value exists:", req.session.testValue);
      return res.json({ 
        message: 'Session test value exists', 
        sessionID: req.sessionID,
        testValue: req.session.testValue,
        cookies: req.headers.cookie
      });
    }
  });

  app.post("/api/auth/change-password", auth.isAuthenticated, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      // Verify current password
      const user = await storage.getUserById(req.user!.id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const isMatch = await cryptoService.verifyPassword(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      // Update password
      const hashedPassword = await cryptoService.hashPassword(newPassword);
      await storage.updateUserPassword(user.id, hashedPassword);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "An error occurred while changing password" });
    }
  });

  // Dashboard Route
  app.get("/api/dashboard", auth.isAuthenticated, async (req, res) => {
    try {
      // Get metrics for dashboard
      const totalPatients = await storage.getPatientCount();
      const activePlans = await storage.getActiveCarePlansCount();
      const todayAppointments = await storage.getTodayAppointmentsCount();
      const staffOnDuty = await storage.getActiveStaffCount();
      
      // Get activity data
      const activities = await storage.getRecentActivities(5);
      
      // Get today's appointments
      const appointments = await storage.getTodayAppointments();
      
      // Get recent patients
      const patients = await storage.getRecentPatients(4);
      
      res.json({
        metrics: {
          totalPatients,
          activePlans,
          todayAppointments,
          staffOnDuty,
        },
        activities,
        appointments,
        patients,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "An error occurred while fetching dashboard data" });
    }
  });

  // Patient Routes
  app.get("/api/patients", auth.isAuthenticated, async (req, res) => {
    try {
      const patients = await storage.getAllPatients();
      res.json(patients);
    } catch (error) {
      console.error("Get patients error:", error);
      res.status(500).json({ message: "An error occurred while fetching patients" });
    }
  });

  app.get("/api/patients/:id", auth.isAuthenticated, async (req, res) => {
    try {
      const patient = await storage.getPatient(parseInt(req.params.id));
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      console.error("Get patient error:", error);
      res.status(500).json({ message: "An error occurred while fetching patient" });
    }
  });

  app.post("/api/patients", auth.isAuthenticated, async (req, res) => {
    try {
      const patientData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(patientData);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user!.id,
        action: "create",
        entityType: "patient",
        entityId: patient.id,
        details: `Created new patient: ${patient.name}`,
      });
      
      res.status(201).json(patient);
    } catch (error) {
      console.error("Create patient error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid patient data", errors: error.errors });
      }
      res.status(500).json({ message: "An error occurred while creating patient" });
    }
  });

  app.put("/api/patients/:id", auth.isAuthenticated, async (req, res) => {
    try {
      const patientId = parseInt(req.params.id);
      const patientData = insertPatientSchema.parse(req.body);
      const updatedPatient = await storage.updatePatient(patientId, patientData);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user!.id,
        action: "update",
        entityType: "patient",
        entityId: patientId,
        details: `Updated patient information: ${updatedPatient.name}`,
      });
      
      res.json(updatedPatient);
    } catch (error) {
      console.error("Update patient error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid patient data", errors: error.errors });
      }
      res.status(500).json({ message: "An error occurred while updating patient" });
    }
  });

  // Patient Appointments Route
  app.get("/api/patients/:id/appointments", auth.isAuthenticated, async (req, res) => {
    try {
      const patientId = parseInt(req.params.id);
      const appointments = await storage.getPatientAppointments(patientId);
      res.json(appointments);
    } catch (error) {
      console.error("Get patient appointments error:", error);
      res.status(500).json({ message: "An error occurred while fetching patient appointments" });
    }
  });

  // Patient Care Plans Route
  app.get("/api/patients/:id/care-plans", auth.isAuthenticated, async (req, res) => {
    try {
      const patientId = parseInt(req.params.id);
      const carePlans = await storage.getPatientCarePlans(patientId);
      res.json(carePlans);
    } catch (error) {
      console.error("Get patient care plans error:", error);
      res.status(500).json({ message: "An error occurred while fetching patient care plans" });
    }
  });

  // Staff Routes
  app.get("/api/staff", auth.isAuthenticated, async (req, res) => {
    try {
      const staff = await storage.getAllStaff();
      res.json(staff);
    } catch (error) {
      console.error("Get staff error:", error);
      res.status(500).json({ message: "An error occurred while fetching staff" });
    }
  });

  app.get("/api/staff/:id", auth.isAuthenticated, async (req, res) => {
    try {
      const staff = await storage.getStaff(parseInt(req.params.id));
      if (!staff) {
        return res.status(404).json({ message: "Staff member not found" });
      }
      res.json(staff);
    } catch (error) {
      console.error("Get staff error:", error);
      res.status(500).json({ message: "An error occurred while fetching staff member" });
    }
  });

  app.post("/api/staff", auth.isAuthenticated, async (req, res) => {
    try {
      const staffData = insertCareStaffSchema.parse(req.body);
      const staff = await storage.createStaff(staffData);
      
      // Create user account for staff member if needed
      // This would be implemented in a real system
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user!.id,
        action: "create",
        entityType: "staff",
        entityId: staff.id,
        details: `Added new staff member: ${staff.name}`,
      });
      
      res.status(201).json(staff);
    } catch (error) {
      console.error("Create staff error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid staff data", errors: error.errors });
      }
      res.status(500).json({ message: "An error occurred while creating staff member" });
    }
  });

  app.put("/api/staff/:id", auth.isAuthenticated, async (req, res) => {
    try {
      const staffId = parseInt(req.params.id);
      const staffData = insertCareStaffSchema.parse(req.body);
      const updatedStaff = await storage.updateStaff(staffId, staffData);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user!.id,
        action: "update",
        entityType: "staff",
        entityId: staffId,
        details: `Updated staff information: ${updatedStaff.name}`,
      });
      
      res.json(updatedStaff);
    } catch (error) {
      console.error("Update staff error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid staff data", errors: error.errors });
      }
      res.status(500).json({ message: "An error occurred while updating staff member" });
    }
  });

  app.patch("/api/staff/:id/status", auth.isAuthenticated, async (req, res) => {
    try {
      const staffId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!["Active", "On Leave", "Inactive"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const updatedStaff = await storage.updateStaffStatus(staffId, status);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user!.id,
        action: "update",
        entityType: "staff",
        entityId: staffId,
        details: `Updated staff status to ${status}: ${updatedStaff.name}`,
      });
      
      res.json(updatedStaff);
    } catch (error) {
      console.error("Update staff status error:", error);
      res.status(500).json({ message: "An error occurred while updating staff status" });
    }
  });

  // Appointment Routes
  app.get("/api/appointments", auth.isAuthenticated, async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      console.error("Get appointments error:", error);
      res.status(500).json({ message: "An error occurred while fetching appointments" });
    }
  });

  app.get("/api/appointments/:id", auth.isAuthenticated, async (req, res) => {
    try {
      const appointment = await storage.getAppointment(parseInt(req.params.id));
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Get appointment error:", error);
      res.status(500).json({ message: "An error occurred while fetching appointment" });
    }
  });

  app.post("/api/appointments", auth.isAuthenticated, async (req, res) => {
    try {
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(appointmentData);
      
      // Get patient name for activity log
      const patient = await storage.getPatient(appointment.patientId);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user!.id,
        action: "create",
        entityType: "appointment",
        entityId: appointment.id,
        details: `Scheduled new appointment for ${patient?.name || 'Unknown patient'}: ${appointment.title}`,
      });
      
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Create appointment error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      res.status(500).json({ message: "An error occurred while creating appointment" });
    }
  });

  app.put("/api/appointments/:id", auth.isAuthenticated, async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const updatedAppointment = await storage.updateAppointment(appointmentId, appointmentData);
      
      // Get patient name for activity log
      const patient = await storage.getPatient(updatedAppointment.patientId);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user!.id,
        action: "update",
        entityType: "appointment",
        entityId: appointmentId,
        details: `Updated appointment for ${patient?.name || 'Unknown patient'}: ${updatedAppointment.title}`,
      });
      
      res.json(updatedAppointment);
    } catch (error) {
      console.error("Update appointment error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      res.status(500).json({ message: "An error occurred while updating appointment" });
    }
  });

  app.patch("/api/appointments/:id/cancel", auth.isAuthenticated, async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const updatedAppointment = await storage.updateAppointmentStatus(appointmentId, "Cancelled");
      
      // Get patient name for activity log
      const patient = await storage.getPatient(updatedAppointment.patientId);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user!.id,
        action: "cancel",
        entityType: "appointment",
        entityId: appointmentId,
        details: `Cancelled appointment for ${patient?.name || 'Unknown patient'}: ${updatedAppointment.title}`,
      });
      
      res.json(updatedAppointment);
    } catch (error) {
      console.error("Cancel appointment error:", error);
      res.status(500).json({ message: "An error occurred while cancelling appointment" });
    }
  });

  app.patch("/api/appointments/:id/complete", auth.isAuthenticated, async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const updatedAppointment = await storage.updateAppointmentStatus(appointmentId, "Completed");
      
      // Get patient name for activity log
      const patient = await storage.getPatient(updatedAppointment.patientId);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user!.id,
        action: "complete",
        entityType: "appointment",
        entityId: appointmentId,
        details: `Completed appointment for ${patient?.name || 'Unknown patient'}: ${updatedAppointment.title}`,
      });
      
      res.json(updatedAppointment);
    } catch (error) {
      console.error("Complete appointment error:", error);
      res.status(500).json({ message: "An error occurred while completing appointment" });
    }
  });

  // Care Plan Routes
  app.get("/api/care-plans", auth.isAuthenticated, async (req, res) => {
    try {
      const carePlans = await storage.getAllCarePlans();
      res.json(carePlans);
    } catch (error) {
      console.error("Get care plans error:", error);
      res.status(500).json({ message: "An error occurred while fetching care plans" });
    }
  });

  app.get("/api/care-plans/:id", auth.isAuthenticated, async (req, res) => {
    try {
      const carePlan = await storage.getCarePlan(parseInt(req.params.id));
      if (!carePlan) {
        return res.status(404).json({ message: "Care plan not found" });
      }
      res.json(carePlan);
    } catch (error) {
      console.error("Get care plan error:", error);
      res.status(500).json({ message: "An error occurred while fetching care plan" });
    }
  });

  app.post("/api/care-plans", auth.isAuthenticated, async (req, res) => {
    try {
      const carePlanData = insertCarePlanSchema.parse({
        ...req.body,
        createdBy: req.user!.id,
        lastUpdatedBy: req.user!.id,
      });
      
      const carePlan = await storage.createCarePlan(carePlanData);
      
      // Get patient name for activity log
      const patient = await storage.getPatient(carePlan.patientId);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user!.id,
        action: "create",
        entityType: "care_plan",
        entityId: carePlan.id,
        details: `Created new care plan for ${patient?.name || 'Unknown patient'}: ${carePlan.title}`,
      });
      
      res.status(201).json(carePlan);
    } catch (error) {
      console.error("Create care plan error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid care plan data", errors: error.errors });
      }
      res.status(500).json({ message: "An error occurred while creating care plan" });
    }
  });

  app.put("/api/care-plans/:id", auth.isAuthenticated, async (req, res) => {
    try {
      const carePlanId = parseInt(req.params.id);
      const carePlanData = insertCarePlanSchema.parse({
        ...req.body,
        lastUpdatedBy: req.user!.id,
      });
      
      const updatedCarePlan = await storage.updateCarePlan(carePlanId, carePlanData);
      
      // Get patient name for activity log
      const patient = await storage.getPatient(updatedCarePlan.patientId);
      
      // Log activity
      await storage.createActivityLog({
        userId: req.user!.id,
        action: "update",
        entityType: "care_plan",
        entityId: carePlanId,
        details: `Updated care plan for ${patient?.name || 'Unknown patient'}: ${updatedCarePlan.title}`,
      });
      
      res.json(updatedCarePlan);
    } catch (error) {
      console.error("Update care plan error:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid care plan data", errors: error.errors });
      }
      res.status(500).json({ message: "An error occurred while updating care plan" });
    }
  });

  // Reports Routes
  app.get("/api/reports/:type", auth.isAuthenticated, async (req, res) => {
    try {
      const reportType = req.params.type;
      const { startDate, endDate } = req.query;
      
      // Validate date parameters
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      let reportData;
      
      switch (reportType) {
        case "patient-summary":
          reportData = await storage.getPatientSummaryReport(startDate.toString(), endDate.toString());
          break;
        case "appointment-analysis":
          reportData = await storage.getAppointmentAnalysisReport(startDate.toString(), endDate.toString());
          break;
        case "care-plan-metrics":
          reportData = await storage.getCarePlanMetricsReport(startDate.toString(), endDate.toString());
          break;
        case "staff-activity":
          reportData = await storage.getStaffActivityReport(startDate.toString(), endDate.toString());
          break;
        default:
          return res.status(400).json({ message: "Invalid report type" });
      }
      
      res.json(reportData);
    } catch (error) {
      console.error("Report generation error:", error);
      res.status(500).json({ message: "An error occurred while generating report" });
    }
  });

  // Settings Routes
  app.post("/api/settings/:type", auth.isAuthenticated, async (req, res) => {
    try {
      const settingType = req.params.type;
      const settingsData = req.body;
      
      // In a real implementation, we would validate and store these settings
      // For now, we'll just return success
      
      res.json({ success: true, type: settingType });
    } catch (error) {
      console.error("Settings update error:", error);
      res.status(500).json({ message: "An error occurred while updating settings" });
    }
  });

  // Add seed data endpoint (only for development)
  app.post("/api/seed", async (req, res) => {
    try {
      // Store created entities
      const created = {
        users: {},
        patients: [],
        staff: [],
        appointments: [],
        carePlans: [],
        tenant: null,
      };

      // Check if admin user exists
      let adminUser = await storage.getUserByUsername("admin");
      if (!adminUser) {
        const adminPassword = await cryptoService.hashPassword("admin123");
        adminUser = await storage.createUser({
          username: "admin",
          password: adminPassword,
          email: "admin@complexcare.dev",
          role: "superadmin",
          name: "Admin User",
        });
      }
      created.users.admin = adminUser;

      // Check for existing tenant
      const existingTenants = await storage.getAllTenants();
      let tenant;
      if (existingTenants.length === 0) {
        tenant = await storage.createTenant({
          name: "City Health Partners",
          domain: "cityhealthpartners.com",
          status: "active",
          subscriptionTier: "professional",
          userLimit: 10,
          contactEmail: "contact@cityhealthpartners.com",
          contactName: "John Smith",
          nhsIntegrationEnabled: false,
        });
      } else {
        tenant = existingTenants[0];
      }
      created.tenant = tenant;

      // Create or get demo users
      const demoPassword = await cryptoService.hashPassword("demo123");
      let drJohnson = await storage.getUserByUsername("drjohnson");
      if (!drJohnson) {
        drJohnson = await storage.createUser({
          username: "drjohnson",
          password: demoPassword,
          email: "sarah.johnson@complexcare.dev",
          role: "admin",
          name: "Dr. Sarah Johnson",
        });
      }
      created.users.doctor = drJohnson;
      
      let nurseUser = await storage.getUserByUsername("nurse");
      if (!nurseUser) {
        nurseUser = await storage.createUser({
          username: "nurse",
          password: demoPassword,
          email: "lisa.chen@complexcare.dev",
          role: "care_staff",
          name: "Nurse Lisa Chen",
        });
      }
      created.users.nurse = nurseUser;
      
      let patientUser = await storage.getUserByUsername("patient");
      if (!patientUser) {
        patientUser = await storage.createUser({
          username: "patient",
          password: demoPassword,
          email: "emma.wilson@example.com",
          role: "patient",
          name: "Emma Wilson",
        });
      }
      created.users.patient = patientUser;

      // Get all existing patients
      const existingPatients = await storage.getAllPatients();
      const existingPatientIds = new Map(existingPatients.map(p => [p.patientId, p.id]));

      // Create demo patients if they don't exist
      let patient1;
      if (!existingPatientIds.has("PAT-2023-001")) {
        patient1 = await storage.createPatient({
          patientId: "PAT-2023-001",
          userId: patientUser.id,
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
        created.patients.push(patient1);
      } else {
        patient1 = existingPatients.find(p => p.patientId === "PAT-2023-001");
      }
      
      let patient2;
      if (!existingPatientIds.has("PAT-2023-042")) {
        patient2 = await storage.createPatient({
          patientId: "PAT-2023-042",
          userId: null,
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
        created.patients.push(patient2);
      } else {
        patient2 = existingPatients.find(p => p.patientId === "PAT-2023-042");
      }

      // Get all existing staff
      const existingStaff = await storage.getAllStaff();
      const existingStaffIds = new Map(existingStaff.map(s => [s.staffId, s.id]));

      // Create demo staff if they don't exist
      let staff1;
      if (!existingStaffIds.has("STAFF-2023-001")) {
        staff1 = await storage.createStaff({
          userId: drJohnson.id,
          staffId: "STAFF-2023-001",
          name: "Dr. Sarah Johnson",
          position: "Lead Physician",
          department: "General Practice",
          phone: "07700 900001",
          email: "sarah.johnson@complexcare.dev",
          qualifications: "MD, MRCGP",
          status: "Active",
        });
        created.staff.push(staff1);
      } else {
        staff1 = existingStaff.find(s => s.staffId === "STAFF-2023-001");
      }
      
      let staff2;
      if (!existingStaffIds.has("STAFF-2023-002")) {
        staff2 = await storage.createStaff({
          userId: nurseUser.id,
          staffId: "STAFF-2023-002",
          name: "Nurse Lisa Chen",
          position: "Senior Nurse",
          department: "Community Nursing",
          phone: "07700 900002",
          email: "lisa.chen@complexcare.dev",
          qualifications: "RN, BSN",
          status: "Active",
        });
        created.staff.push(staff2);
      } else {
        staff2 = existingStaff.find(s => s.staffId === "STAFF-2023-002");
      }

      // Check for existing appointments
      const existingAppointments = await storage.getAllAppointments();

      // Create demo appointments if needed
      if (existingAppointments.length === 0 && patient1 && patient2 && staff1 && staff2) {
        const today = new Date();
        
        const appointment1 = await storage.createAppointment({
          patientId: patient1.id,
          staffId: staff1.id,
          title: "Annual check-up",
          description: "Regular health assessment",
          dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0),
          duration: 60,
          status: "Confirmed",
          location: "Main Clinic, Room 3",
          notes: "Patient should bring medication list and recent test results.",
        });
        created.appointments.push(appointment1);
        
        const appointment2 = await storage.createAppointment({
          patientId: patient2.id,
          staffId: staff2.id,
          title: "Medication review",
          description: "Review current medications and adjust as needed",
          dateTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30, 0),
          duration: 30,
          status: "Pending",
          location: "East Wing, Room 12",
          notes: "",
        });
        created.appointments.push(appointment2);

        // Check for existing care plans
        const existingCarePlans = await storage.getAllCarePlans();

        // Create demo care plan if needed
        if (existingCarePlans.length === 0 && patient1) {
          const carePlan1 = await storage.createCarePlan({
            patientId: patient1.id,
            title: "Comprehensive Care Plan",
            description: "Holistic care plan addressing all current health needs and preventive measures.",
            startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
            endDate: new Date(today.getFullYear(), today.getMonth() + 6, today.getDate()),
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
            createdBy: drJohnson.id,
            lastUpdatedBy: drJohnson.id,
          });
          created.carePlans.push(carePlan1);

          // Create some activity logs
          if (created.appointments.length > 0 && created.patients.length > 0) {
            await storage.createActivityLog({
              userId: drJohnson.id,
              action: "create",
              entityType: "patient",
              entityId: patient1.id,
              details: "Created new patient: Emma Wilson",
            });
            
            await storage.createActivityLog({
              userId: drJohnson.id,
              action: "create",
              entityType: "appointment",
              entityId: created.appointments[0].id,
              details: `Scheduled new appointment for ${patient1.name}: ${created.appointments[0].title}`,
            });
            
            await storage.createActivityLog({
              userId: drJohnson.id,
              action: "create",
              entityType: "care_plan",
              entityId: carePlan1.id,
              details: `Created new care plan for ${patient1.name}: ${carePlan1.title}`,
            });
          }
        }
      }

      // Prepare response
      const responseData = {
        users: created.users,
        patients: created.patients.length > 0 ? created.patients : [patient1, patient2].filter(Boolean),
        staff: created.staff.length > 0 ? created.staff : [staff1, staff2].filter(Boolean),
        appointments: created.appointments,
        carePlans: created.carePlans,
        tenant: created.tenant,
      };

      res.json({ 
        success: true, 
        message: "Database seeded successfully",
        created: Object.entries(responseData).reduce((acc, [key, value]) => {
          if (Array.isArray(value)) {
            acc[key] = value.length;
          } else if (typeof value === 'object' && value !== null) {
            acc[key] = Object.keys(value).length;
          } else {
            acc[key] = value ? 1 : 0;
          }
          return acc;
        }, {}),
        data: responseData
      });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ message: "An error occurred while seeding the database" });
    }
  });

  // AI route handler
  app.use('/api/ai', aiRoutes);

  // Compliance routes
  app.use('/api/compliance', complianceRoutes);

  // SuperAdmin routes
  app.use('/api/superadmin', nhsDigitalRoutes);
  app.use('/api/superadmin', tenantRoutes);
  
  // Tenant theme routes
  app.use(tenantThemeRoutes);

  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
