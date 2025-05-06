import { pgTable, text, serial, integer, boolean, timestamp, json, jsonb, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User and authentication
export const tenants = pgTable("tenants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  status: text("status", { enum: ["active", "inactive", "suspended", "trial"] }).notNull().default("active"),
  subscriptionTier: text("subscription_tier", { enum: ["standard", "professional", "enterprise"] }).notNull().default("standard"),
  userLimit: integer("user_limit").notNull().default(10),
  lastActivity: timestamp("last_activity"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  logo: text("logo"),
  contactEmail: text("contact_email").notNull(),
  contactName: text("contact_name").notNull(),
  contactPhone: text("contact_phone"),
  billingInfo: text("billing_info"),
  metadata: json("metadata"),
  // NHS Digital API integration settings
  nhsIntegrationEnabled: boolean("nhs_integration_enabled").default(false),
  // Theme settings
  themeColors: json("theme_colors").default({
    primary: "#0070f3",
    secondary: "#6c757d",
    accent: "#f59e0b",
    background: "#ffffff",
    text: "#000000",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  }),
  themeName: text("theme_name").default("default"),
  themeDarkMode: boolean("theme_dark_mode").default(false),
  themeCustomCss: text("theme_custom_css"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  role: text("role", { enum: ["superadmin", "admin", "care_staff", "patient"] }).notNull().default("care_staff"),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  tenantId: integer("tenant_id").references(() => tenants.id),
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

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  plan: text("plan", { enum: ["standard", "professional", "enterprise"] }).notNull(),
  status: text("status", { enum: ["active", "canceled", "past_due", "pending"] }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  paymentMethod: text("payment_method"),
  paymentId: text("payment_id"),
  amount: integer("amount"),
  currency: text("currency").default("USD"),
  billingCycle: text("billing_cycle", { enum: ["monthly", "quarterly", "annual"] }),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
  lastActivity: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenant = typeof tenants.$inferSelect;

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// NHS Digital API integration
export const nhsDigitalIntegrations = pgTable("nhs_digital_integrations", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  // Service-specific API keys and configurations
  pdsApiKey: text("pds_api_key"),
  pdsEnabled: boolean("pds_enabled").default(false),
  scrApiKey: text("scr_api_key"),
  scrEnabled: boolean("scr_enabled").default(false),
  epsApiKey: text("eps_api_key"),
  epsEnabled: boolean("eps_enabled").default(false),
  eRsApiKey: text("e_rs_api_key"),
  eRsEnabled: boolean("e_rs_enabled").default(false),
  gpConnectApiKey: text("gp_connect_api_key"),
  gpConnectEnabled: boolean("gp_connect_enabled").default(false),
  // Configuration and metadata
  environmentType: text("environment_type", { enum: ["sandbox", "production"] }).default("sandbox"),
  lastVerified: timestamp("last_verified"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  metadata: json("metadata"),
});

export const insertNhsDigitalIntegrationSchema = createInsertSchema(nhsDigitalIntegrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastVerified: true,
});

export type InsertNhsDigitalIntegration = z.infer<typeof insertNhsDigitalIntegrationSchema>;
export type NhsDigitalIntegration = typeof nhsDigitalIntegrations.$inferSelect;

// Compliance Analysis and Reports
export const complianceAnalyses = pgTable("compliance_analyses", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  score: numeric("score").notNull(),
  overallStatus: text("overall_status", { enum: ["compliant", "at-risk", "non-compliant"] }).notNull(),
  areas: jsonb("areas").notNull(),
  recommendations: jsonb("recommendations").notNull(),
  findings: jsonb("findings"),
  reportUrl: text("report_url"),
  conductedBy: integer("conducted_by").references(() => users.id),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const insertComplianceAnalysisSchema = createInsertSchema(complianceAnalyses).omit({
  id: true,
  createdAt: true,
});

export type InsertComplianceAnalysis = z.infer<typeof insertComplianceAnalysisSchema>;
export type ComplianceAnalysis = typeof complianceAnalyses.$inferSelect;

// Types for compliance data
export interface ComplianceArea {
  name: string;
  score: number;
  findings: string[];
  status: 'compliant' | 'at-risk' | 'non-compliant';
  regulation: string;
}

export interface ComplianceResult {
  score: number;
  areas: ComplianceArea[];
  recommendations: string[];
  overallStatus: 'compliant' | 'at-risk' | 'non-compliant';
  lastUpdated: Date;
}

// Chat history for patient support feature
export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  patientMessage: text("patient_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: json("metadata"),
});

export const insertChatHistorySchema = createInsertSchema(chatHistory).omit({
  id: true,
  timestamp: true,
});

export type InsertChatHistory = z.infer<typeof insertChatHistorySchema>;
export type ChatHistory = typeof chatHistory.$inferSelect;

// Analytics and report data
export const analyticsReports = pgTable("analytics_reports", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  title: text("title").notNull(),
  description: text("description"),
  reportType: text("report_type", {
    enum: [
      "patient_summary",
      "staff_performance",
      "appointment_analysis",
      "care_plan_metrics",
      "financial_analysis",
      "medication_administration", 
      "clinical_outcomes",
      "operational_efficiency",
      "custom"
    ]
  }).notNull(),
  parameters: json("parameters").default({}),
  generatedData: json("generated_data").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  isTemplate: boolean("is_template").default(false),
  scheduledFrequency: text("scheduled_frequency", {
    enum: ["daily", "weekly", "monthly", "quarterly", "yearly", "none"]
  }).default("none"),
  lastRun: timestamp("last_run"),
  nextScheduledRun: timestamp("next_scheduled_run"),
  visualizationSettings: json("visualization_settings").default({}),
});

export const analyticsMetrics = pgTable("analytics_metrics", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  metricName: text("metric_name").notNull(),
  metricKey: text("metric_key").notNull(),
  metricType: text("metric_type", {
    enum: ["count", "sum", "average", "ratio", "percentage", "custom"]
  }).notNull(),
  category: text("category", {
    enum: ["patient", "staff", "appointment", "care_plan", "financial", "medication", "clinical", "operational"]
  }).notNull(),
  calculation: text("calculation"),
  description: text("description"),
  visualization: text("visualization", {
    enum: ["bar", "line", "pie", "table", "kpi", "map", "custom"]
  }).default("bar"),
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  metadata: json("metadata").default({}),
});

export const analyticsDataSources = pgTable("analytics_data_sources", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  name: text("name").notNull(),
  sourceType: text("source_type", {
    enum: ["internal", "external_api", "file_import", "manual_entry"]
  }).notNull(),
  connectionDetails: json("connection_details").default({}),
  refreshFrequency: text("refresh_frequency", {
    enum: ["real_time", "hourly", "daily", "weekly", "monthly", "manual"]
  }).default("daily"),
  lastRefresh: timestamp("last_refresh"),
  nextScheduledRefresh: timestamp("next_scheduled_refresh"),
  isActive: boolean("is_active").default(true),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  metadata: json("metadata").default({}),
});

export const reportDashboards = pgTable("report_dashboards", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id),
  name: text("name").notNull(),
  description: text("description"),
  layout: json("layout").notNull(),
  isPublic: boolean("is_public").default(false),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  dashboardType: text("dashboard_type", {
    enum: ["executive", "clinical", "operational", "financial", "custom"]
  }).default("custom"),
  permission: text("permission", { 
    enum: ["public", "tenant", "role", "user"]
  }).default("tenant"),
  permissionDetails: json("permission_details").default({}),
});

export const reportExports = pgTable("report_exports", {
  id: serial("id").primaryKey(),
  reportId: integer("report_id").references(() => analyticsReports.id).notNull(),
  exportFormat: text("export_format", {
    enum: ["pdf", "csv", "excel", "json"]
  }).notNull(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  exportedBy: integer("exported_by").references(() => users.id),
  exportedAt: timestamp("exported_at").defaultNow().notNull(),
  metadata: json("metadata").default({}),
});

// Insert schemas for analytics tables
export const insertAnalyticsReportSchema = createInsertSchema(analyticsReports).omit({
  id: true,
  createdAt: true,
  lastRun: true,
});

export const insertAnalyticsMetricSchema = createInsertSchema(analyticsMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnalyticsDataSourceSchema = createInsertSchema(analyticsDataSources).omit({
  id: true,
  createdAt: true,
  lastRefresh: true,
  nextScheduledRefresh: true,
});

export const insertReportDashboardSchema = createInsertSchema(reportDashboards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReportExportSchema = createInsertSchema(reportExports).omit({
  id: true,
  exportedAt: true,
});

// Types for analytics and reports
export type InsertAnalyticsReport = z.infer<typeof insertAnalyticsReportSchema>;
export type AnalyticsReport = typeof analyticsReports.$inferSelect;

export type InsertAnalyticsMetric = z.infer<typeof insertAnalyticsMetricSchema>;
export type AnalyticsMetric = typeof analyticsMetrics.$inferSelect;

export type InsertAnalyticsDataSource = z.infer<typeof insertAnalyticsDataSourceSchema>;
export type AnalyticsDataSource = typeof analyticsDataSources.$inferSelect;

export type InsertReportDashboard = z.infer<typeof insertReportDashboardSchema>;
export type ReportDashboard = typeof reportDashboards.$inferSelect;

export type InsertReportExport = z.infer<typeof insertReportExportSchema>;
export type ReportExport = typeof reportExports.$inferSelect;

// Patient Documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  documentId: text("document_id").notNull().unique(), // UUID for the document
  patientId: integer("patient_id").references(() => patients.id),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  documentType: text("document_type", { 
    enum: [
      "medical_record",
      "prescription",
      "consent_form",
      "care_plan",
      "lab_result",
      "referral_letter",
      "hospital_discharge",
      "patient_id",
      "insurance",
      "other"
    ] 
  }).notNull(),
  uploadedBy: integer("uploaded_by").references(() => users.id).notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
  storageLocation: text("storage_location").notNull(), // Path or URL to the document
  description: text("description"),
  tags: text("tags").array(),
  relatedEntityType: text("related_entity_type"),
  relatedEntityId: integer("related_entity_id"),
  metadata: json("metadata"),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

// Wearable Device Integration
export const wearableDevices = pgTable("wearable_devices", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  deviceType: text("device_type", { 
    enum: [
      "smartwatch",
      "fitness_tracker",
      "glucose_monitor",
      "blood_pressure_monitor",
      "heart_monitor",
      "pulse_oximeter",
      "sleep_tracker",
      "thermometer",
      "other"
    ] 
  }).notNull(),
  manufacturer: text("manufacturer").notNull(), // Apple, Fitbit, Samsung, Dexcom, etc.
  model: text("model").notNull(),
  serialNumber: text("serial_number").notNull(),
  lastSyncDate: timestamp("last_sync_date"),
  batteryStatus: integer("battery_status"), // Battery percentage (0-100)
  connectionStatus: text("connection_status", { 
    enum: ["connected", "disconnected", "pairing", "error"] 
  }).default("disconnected"),
  activationDate: timestamp("activation_date").defaultNow(),
  deactivationDate: timestamp("deactivation_date"),
  apiAccessToken: text("api_access_token"),
  apiRefreshToken: text("api_refresh_token"),
  tokenExpiryDate: timestamp("token_expiry_date"),
  dataPermissions: json("data_permissions").default({}), 
  settings: json("settings").default({}),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

// Device measurements/readings
export const deviceReadings = pgTable("device_readings", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").references(() => wearableDevices.id).notNull(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  readingType: text("reading_type", { 
    enum: [
      "heart_rate",
      "blood_pressure",
      "blood_glucose",
      "oxygen_saturation",
      "temperature",
      "respiratory_rate",
      "steps",
      "sleep",
      "calories",
      "activity",
      "weight",
      "ecg",
      "other"
    ] 
  }).notNull(),
  value: text("value").notNull(), // Store as text to handle different types of values
  unit: text("unit").notNull(), // bpm, mmHg, mg/dL, etc.
  timestamp: timestamp("timestamp").notNull(),
  readingStatus: text("reading_status", { 
    enum: ["normal", "warning", "critical", "error"] 
  }).default("normal"),
  locationRecorded: text("location_recorded"),
  notes: text("notes"),
  rawData: json("raw_data"),
  metricGroup: text("metric_group"), // For grouping related metrics (e.g. systolic and diastolic)
  relatedReadingIds: integer("related_reading_ids").array(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Device alerts based on readings
export const deviceAlerts = pgTable("device_alerts", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").references(() => wearableDevices.id).notNull(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  readingId: integer("reading_id").references(() => deviceReadings.id),
  alertType: text("alert_type", { 
    enum: [
      "low_heart_rate",
      "high_heart_rate",
      "low_blood_glucose",
      "high_blood_glucose",
      "low_oxygen",
      "high_blood_pressure",
      "irregular_heartbeat",
      "fever",
      "fall_detected",
      "lack_of_movement",
      "device_disconnected",
      "battery_low",
      "missed_reading",
      "other"
    ] 
  }).notNull(),
  severity: text("severity", { 
    enum: ["info", "warning", "urgent", "emergency"] 
  }).notNull(),
  message: text("message").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  acknowledgedBy: integer("acknowledged_by").references(() => users.id),
  acknowledgedAt: timestamp("acknowledged_at"),
  actionTaken: text("action_taken"),
  resolved: boolean("resolved").default(false),
  resolvedAt: timestamp("resolved_at"),
  notificationSent: boolean("notification_sent").default(false),
  metadata: json("metadata"),
});

// Microsoft 365 Integration
export const msIntegrations = pgTable("ms_integrations", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenants.id).notNull(),
  mstenantId: text("mstenant_id").notNull(), // Microsoft 365 tenant ID
  clientId: text("client_id").notNull(), // Azure App registration client ID
  clientSecret: text("client_secret").notNull(),
  redirectUri: text("redirect_uri").notNull(),
  scopes: text("scopes").array(),
  adminConsent: boolean("admin_consent").default(false),
  consentDate: timestamp("consent_date"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiryDate: timestamp("token_expiry_date"),
  emailScanEnabled: boolean("email_scan_enabled").default(false),
  emailScanFrequency: text("email_scan_frequency", { 
    enum: ["hourly", "daily", "weekly"] 
  }).default("daily"),
  lastScanDate: timestamp("last_scan_date"),
  scanFilters: json("scan_filters").default({}),
  status: text("status", { 
    enum: ["active", "inactive", "error", "setup_required"] 
  }).default("setup_required"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

// Patient communications (emails, messages, etc.)
export const patientCommunications = pgTable("patient_communications", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  communicationType: text("communication_type", { 
    enum: ["email", "message", "call", "video", "letter", "other"] 
  }).notNull(),
  source: text("source", {
    enum: ["ms365", "manual", "system", "other"]
  }).notNull(),
  sourceId: text("source_id"), // ID in the source system (e.g., email ID)
  direction: text("direction", { 
    enum: ["inbound", "outbound"] 
  }).notNull(),
  subject: text("subject"),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  sender: text("sender"),
  recipients: text("recipients").array(),
  carbonCopies: text("carbon_copies").array(),
  attachmentCount: integer("attachment_count").default(0),
  attachments: json("attachments").default([]),
  status: text("status", { 
    enum: ["new", "read", "archived", "flagged"] 
  }).default("new"),
  importanceFlag: text("importance_flag", { 
    enum: ["low", "normal", "high"] 
  }).default("normal"),
  tags: text("tags").array(),
  notes: text("notes"),
  linkedStaffId: integer("linked_staff_id").references(() => careStaff.id),
  createdAt: timestamp("created_at").defaultNow(),
  metadata: json("metadata"),
});

// Insert schemas
export const insertWearableDeviceSchema = createInsertSchema(wearableDevices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDeviceReadingSchema = createInsertSchema(deviceReadings).omit({
  id: true,
  createdAt: true,
});

export const insertDeviceAlertSchema = createInsertSchema(deviceAlerts).omit({
  id: true,
  timestamp: true,
});

export const insertMsIntegrationSchema = createInsertSchema(msIntegrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPatientCommunicationSchema = createInsertSchema(patientCommunications).omit({
  id: true,
  createdAt: true,
});

// Care Plan Templates
export const carePlanTemplates = pgTable("care_plan_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category", { 
    enum: ["general", "physical", "mental", "palliative", "chronic", "post-hospital", "rehabilitation"] 
  }).notNull().default("general"),
  assessments: json("assessments").default([]),
  goals: json("goals").default([]),
  interventions: json("interventions").default([]),
  medicationRefs: json("medication_refs").default([]),
  reviewFrequency: text("review_frequency"), // e.g., "weekly", "monthly", "quarterly"
  suitableConditions: text("suitable_conditions").array(),
  targetAudience: text("target_audience"),
  estimatedDuration: text("estimated_duration"), // e.g., "3 months", "6 weeks"
  evidenceBase: text("evidence_base"),
  createdBy: integer("created_by").references(() => users.id),
  tenantId: integer("tenant_id").references(() => tenants.id),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertCarePlanTemplateSchema = createInsertSchema(carePlanTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Medication Administration Records (MAR)
export const medicationAdministrationRecords = pgTable("medication_administration_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  medicationName: text("medication_name").notNull(),
  dose: text("dose").notNull(),
  unit: text("unit").notNull(), // e.g., "mg", "ml", "tablet"
  route: text("route").notNull(), // e.g., "oral", "injection", "topical"
  frequency: text("frequency").notNull(), // e.g., "twice daily", "every 8 hours"
  scheduledDateTime: timestamp("scheduled_date_time").notNull(),
  administrationDateTime: timestamp("administration_date_time"),
  administeredBy: integer("administered_by").references(() => careStaff.id),
  status: text("status", { 
    enum: ["scheduled", "administered", "missed", "refused", "held", "cancelled"] 
  }).notNull().default("scheduled"),
  notes: text("notes"),
  witness: integer("witness").references(() => careStaff.id),
  prescribedBy: text("prescribed_by"),
  prescriptionDate: timestamp("prescription_date"),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertMedicationAdministrationRecordSchema = createInsertSchema(medicationAdministrationRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Patient Medication Details
export const patientMedications = pgTable("patient_medications", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  medicationName: text("medication_name").notNull(),
  dose: text("dose").notNull(),
  unit: text("unit").notNull(),
  route: text("route").notNull(),
  frequency: text("frequency").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  instructions: text("instructions"),
  reason: text("reason"),
  prescribedBy: text("prescribed_by"),
  prescriptionDate: timestamp("prescription_date"),
  pharmacy: text("pharmacy"),
  allergies: text("allergies").array(),
  sideEffects: text("side_effects").array(),
  interactions: text("interactions").array(),
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
});

export const insertPatientMedicationSchema = createInsertSchema(patientMedications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertWearableDevice = z.infer<typeof insertWearableDeviceSchema>;
export type WearableDevice = typeof wearableDevices.$inferSelect;

export type InsertDeviceReading = z.infer<typeof insertDeviceReadingSchema>;
export type DeviceReading = typeof deviceReadings.$inferSelect;

export type InsertDeviceAlert = z.infer<typeof insertDeviceAlertSchema>;
export type DeviceAlert = typeof deviceAlerts.$inferSelect;

export type InsertMsIntegration = z.infer<typeof insertMsIntegrationSchema>;
export type MsIntegration = typeof msIntegrations.$inferSelect;

export type InsertPatientCommunication = z.infer<typeof insertPatientCommunicationSchema>;
export type PatientCommunication = typeof patientCommunications.$inferSelect;

export type InsertCarePlanTemplate = z.infer<typeof insertCarePlanTemplateSchema>;
export type CarePlanTemplate = typeof carePlanTemplates.$inferSelect;

export type InsertMedicationAdministrationRecord = z.infer<typeof insertMedicationAdministrationRecordSchema>;
export type MedicationAdministrationRecord = typeof medicationAdministrationRecords.$inferSelect;

export type InsertPatientMedication = z.infer<typeof insertPatientMedicationSchema>;
export type PatientMedication = typeof patientMedications.$inferSelect;
