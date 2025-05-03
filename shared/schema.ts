import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User and authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["admin", "care_staff", "patient"] }).notNull().default("care_staff"),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Patient information
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").notNull().unique(), // Format: PAT-YYYY-XXX
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  dateOfBirth: text("date_of_birth"),
  gender: text("gender"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  emergencyContact: text("emergency_contact"),
  careType: text("care_type", { enum: ["Home Care", "Day Care", "Residential"] }).notNull(),
  status: text("status", { enum: ["Active", "Inactive", "Review", "New"] }).notNull().default("New"),
  notes: text("notes"),
  medicalHistory: text("medical_history"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
});

// Care staff information
export const careStaff = pgTable("care_staff", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  staffId: text("staff_id").notNull().unique(), // Format: STAFF-YYYY-XXX
  name: text("name").notNull(),
  position: text("position").notNull(),
  department: text("department"),
  phone: text("phone"),
  email: text("email").notNull(),
  qualifications: text("qualifications"),
  status: text("status", { enum: ["Active", "On Leave", "Inactive"] }).notNull().default("Active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCareStaffSchema = createInsertSchema(careStaff).omit({
  id: true,
  createdAt: true,
});

// Appointments
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  staffId: integer("staff_id").references(() => careStaff.id),
  title: text("title").notNull(),
  description: text("description"),
  dateTime: timestamp("date_time").notNull(),
  duration: integer("duration").notNull(), // Duration in minutes
  status: text("status", { enum: ["Scheduled", "Confirmed", "Cancelled", "Completed", "Pending"] }).notNull().default("Scheduled"),
  location: text("location"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

// Care Plans
export const carePlans = pgTable("care_plans", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  status: text("status", { enum: ["Active", "Completed", "Cancelled", "Draft"] }).notNull().default("Draft"),
  assessments: json("assessments").default([]),
  goals: json("goals").default([]),
  interventions: json("interventions").default([]),
  medications: json("medications").default([]),
  reviewSchedule: text("review_schedule"),
  createdBy: integer("created_by").references(() => users.id),
  lastUpdatedBy: integer("last_updated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertCarePlanSchema = createInsertSchema(carePlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Activity Logs for audit trail
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(), // patient, care_plan, appointment, etc.
  entityId: integer("entity_id"),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow(),
  ipAddress: text("ip_address"),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  timestamp: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

export type InsertCareStaff = z.infer<typeof insertCareStaffSchema>;
export type CareStaff = typeof careStaff.$inferSelect;

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export type InsertCarePlan = z.infer<typeof insertCarePlanSchema>;
export type CarePlan = typeof carePlans.$inferSelect;

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
