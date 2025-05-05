import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { auth } from "./auth";
import { cryptoService } from "./crypto";
import { z } from "zod";
import { insertUserSchema, insertPatientSchema, insertCareStaffSchema, insertAppointmentSchema, insertCarePlanSchema, insertActivityLogSchema, insertNhsDigitalIntegrationSchema } from "@shared/schema";
import aiRoutes from "./routes/ai";
import nhsDigitalRoutes from "./routes/superadmin/nhs-integration";


export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication middleware
  app.use(auth.initialize());
  
  // Auth Routes
  app.post("/api/auth/login", auth.authenticateLocal, (req, res) => {
    res.json(req.user);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", auth.isAuthenticated, (req, res) => {
    res.json(req.user);
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

  // AI route handler
  app.use('/api/ai', aiRoutes);

  // NHS Digital Integration routes (SuperAdmin only)
  app.use('/api/superadmin', nhsDigitalRoutes);

  // Create HTTP server
  const httpServer = createServer(app);
  
  return httpServer;
}
