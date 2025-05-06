import { Request, Response } from "express";
import { db } from "../db";
import {
  appointments,
  patients,
  carePlans,
  careStaff,
  users,
  activityLogs,
  analyticsReports,
  analyticsMetrics,
  insertAnalyticsReportSchema,
  insertAnalyticsMetricSchema,
  reportDashboards,
  insertReportDashboardSchema,
  reportExports,
  insertReportExportSchema
} from "@shared/schema";
import { eq, count, between, and, sum, avg, sql, desc, asc, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { auth } from "../auth";

export function registerReportRoutes(app: any) {
  // Get all reports for a tenant
  app.get("/api/reports", auth.isAuthenticated, async (req: Request, res: Response) => {
    try {
      // @ts-ignore - User is added by the isAuthenticated middleware
      const tenantId = req.user?.tenantId;

      if (!tenantId) {
        return res.status(400).json({ message: "Tenant ID is required" });
      }

      const reports = await db
        .select()
        .from(analyticsReports)
        .where(tenantId ? sql`${analyticsReports.tenantId} = ${tenantId}` : undefined)
        .orderBy(desc(analyticsReports.createdAt));

      return res.status(200).json(reports);
    } catch (error: any) {
      console.error("Error retrieving reports:", error);
      return res.status(500).json({ message: "Failed to retrieve reports", error: error.message });
    }
  });

  // Get a specific report by ID
  app.get("/api/reports/:id", auth.isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const report = await db
        .select()
        .from(analyticsReports)
        .where(eq(analyticsReports.id, parseInt(id)))
        .limit(1);

      if (!report || report.length === 0) {
        return res.status(404).json({ message: "Report not found" });
      }

      return res.status(200).json(report[0]);
    } catch (error) {
      console.error(`Error retrieving report ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to retrieve report", error: error.message });
    }
  });

  // Create a new report
  app.post("/api/reports", auth.isAuthenticated, async (req: Request, res: Response) => {
    try {
      // @ts-ignore - User is added by the isAuthenticated middleware
      const userId = req.user?.id;
      // @ts-ignore
      const tenantId = req.user?.tenantId;

      // Validate the request body
      const validatedData = insertAnalyticsReportSchema.parse({
        ...req.body,
        createdBy: userId,
        tenantId: tenantId
      });

      const [newReport] = await db
        .insert(analyticsReports)
        .values(validatedData)
        .returning();

      return res.status(201).json(newReport);
    } catch (error) {
      console.error("Error creating report:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid report data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create report", error: error.message });
    }
  });

  // Update a report
  app.put("/api/reports/:id", auth.isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // @ts-ignore - User is added by the isAuthenticated middleware
      const userId = req.user?.id;

      // Check if the report exists
      const existingReport = await db
        .select()
        .from(analyticsReports)
        .where(eq(analyticsReports.id, parseInt(id)))
        .limit(1);

      if (!existingReport || existingReport.length === 0) {
        return res.status(404).json({ message: "Report not found" });
      }

      // Update the report
      const [updatedReport] = await db
        .update(analyticsReports)
        .set({
          ...req.body,
          // Only update fields that are provided
        })
        .where(eq(analyticsReports.id, parseInt(id)))
        .returning();

      return res.status(200).json(updatedReport);
    } catch (error) {
      console.error(`Error updating report ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to update report", error: error.message });
    }
  });

  // Delete a report
  app.delete("/api/reports/:id", auth.isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Check if the report exists
      const existingReport = await db
        .select()
        .from(analyticsReports)
        .where(eq(analyticsReports.id, parseInt(id)))
        .limit(1);

      if (!existingReport || existingReport.length === 0) {
        return res.status(404).json({ message: "Report not found" });
      }

      // Delete the report
      await db
        .delete(analyticsReports)
        .where(eq(analyticsReports.id, parseInt(id)));

      return res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
      console.error(`Error deleting report ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to delete report", error: error.message });
    }
  });

  // Generate a dynamic report based on type
  app.post("/api/reports/:reportType/generate", auth.isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { reportType } = req.params;
      const { startDate, endDate, parameters } = req.body;
      
      // @ts-ignore - User is added by the isAuthenticated middleware
      const userId = req.user?.id;
      // @ts-ignore
      const tenantId = req.user?.tenantId;
      
      let reportData: any = {};
      let title = "";

      // Parse dates
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      // Generate different reports based on the report type
      switch (reportType) {
        case "patient_summary": {
          title = "Patient Summary Report";
          
          // Get patient counts
          const totalPatientsResult = await db.select({ count: count() }).from(patients);
          const totalPatients = totalPatientsResult[0].count;
          
          const activeStatusResult = await db
            .select({ status: patients.status, count: count() })
            .from(patients)
            .groupBy(patients.status);
          
          const newPatientsResult = await db
            .select({ count: count() })
            .from(patients)
            .where(gte(patients.createdAt, parsedStartDate));
            
          const newPatients = newPatientsResult[0].count;
          
          // Transform status counts to byStatus chart data
          const byStatus = activeStatusResult.map(item => ({
            name: item.status,
            value: item.count
          }));

          // Get care type counts
          const careTypeResult = await db
            .select({ careType: patients.careType, count: count() })
            .from(patients)
            .groupBy(patients.careType);
          
          // Transform care type counts to byCareType chart data
          const byCareType = careTypeResult.map(item => ({
            name: item.careType,
            value: item.count
          }));

          reportData = {
            title,
            period: `${parsedStartDate.toLocaleDateString()} - ${parsedEndDate.toLocaleDateString()}`,
            summary: {
              totalPatients,
              newPatients,
              activePatients: activeStatusResult.find(item => item.status === "Active")?.count || 0,
              inactivePatients: activeStatusResult.find(item => item.status === "Inactive")?.count || 0,
            },
            byStatus,
            byCareType
          };
          break;
        }
        
        case "appointment_analysis": {
          title = "Appointment Analysis Report";
          
          // Get appointment counts
          const totalAppointmentsResult = await db
            .select({ count: count() })
            .from(appointments)
            .where(and(
              gte(appointments.dateTime, parsedStartDate),
              lte(appointments.dateTime, parsedEndDate)
            ));
          
          const totalAppointments = totalAppointmentsResult[0].count;
          
          // Get appointment status counts
          const statusResult = await db
            .select({ status: appointments.status, count: count() })
            .from(appointments)
            .where(and(
              gte(appointments.dateTime, parsedStartDate),
              lte(appointments.dateTime, parsedEndDate)
            ))
            .groupBy(appointments.status);
            
          // Transform status counts to byStatus chart data
          const byStatus = statusResult.map(item => ({
            name: item.status,
            value: item.count
          }));

          // Calculate appointments by day of week
          const dayOfWeekResult = await db
            .select({ 
              dayOfWeek: sql`to_char(${appointments.dateTime}, 'Day')`, 
              count: count() 
            })
            .from(appointments)
            .where(and(
              gte(appointments.dateTime, parsedStartDate),
              lte(appointments.dateTime, parsedEndDate)
            ))
            .groupBy(sql`to_char(${appointments.dateTime}, 'Day')`)
            .orderBy(sql`to_char(${appointments.dateTime}, 'Day')`);

          // Transform day of week counts to chart data  
          const byDayOfWeek = dayOfWeekResult.map(item => ({
            name: item.dayOfWeek.trim(),
            value: item.count
          }));
          
          reportData = {
            title,
            period: `${parsedStartDate.toLocaleDateString()} - ${parsedEndDate.toLocaleDateString()}`,
            summary: {
              totalAppointments,
              completed: statusResult.find(item => item.status === "Completed")?.count || 0,
              cancelled: statusResult.find(item => item.status === "Cancelled")?.count || 0,
              pending: statusResult.find(item => item.status === "Pending")?.count || 0,
            },
            byStatus,
            byDayOfWeek
          };
          break;
        }
        
        case "care_plan_metrics": {
          title = "Care Plan Metrics Report";
          
          // Get care plan counts
          const totalPlansResult = await db
            .select({ count: count() })
            .from(carePlans)
            .where(and(
              gte(carePlans.startDate, parsedStartDate),
              lte(carePlans.startDate, parsedEndDate)
            ));
          
          const totalPlans = totalPlansResult[0].count;
          
          // Get care plan status counts
          const statusResult = await db
            .select({ status: carePlans.status, count: count() })
            .from(carePlans)
            .where(and(
              gte(carePlans.startDate, parsedStartDate),
              lte(carePlans.startDate, parsedEndDate)
            ))
            .groupBy(carePlans.status);
            
          // Transform status counts to byStatus chart data
          const byStatus = statusResult.map(item => ({
            name: item.status,
            value: item.count
          }));

          // Get review schedule counts
          const reviewResult = await db
            .select({ schedule: carePlans.reviewSchedule, count: count() })
            .from(carePlans)
            .where(and(
              gte(carePlans.startDate, parsedStartDate),
              lte(carePlans.startDate, parsedEndDate),
              sql`${carePlans.reviewSchedule} IS NOT NULL`
            ))
            .groupBy(carePlans.reviewSchedule);
            
          // Transform review schedule counts to chart data
          const byReviewFrequency = reviewResult.map(item => ({
            name: item.schedule || "Not Set",
            value: item.count
          }));
          
          reportData = {
            title,
            period: `${parsedStartDate.toLocaleDateString()} - ${parsedEndDate.toLocaleDateString()}`,
            summary: {
              totalPlans,
              activePlans: statusResult.find(item => item.status === "Active")?.count || 0,
              completedPlans: statusResult.find(item => item.status === "Completed")?.count || 0,
              draftPlans: statusResult.find(item => item.status === "Draft")?.count || 0,
            },
            byStatus,
            byReviewFrequency
          };
          break;
        }
        
        case "staff_performance": {
          title = "Staff Performance Report";
          
          // Get staff counts
          const totalStaffResult = await db
            .select({ count: count() })
            .from(careStaff);
          
          const totalStaff = totalStaffResult[0].count;
          
          // Get staff appointment counts
          const staffAppointmentsResult = await db
            .select({
              staffId: careStaff.id,
              staffName: careStaff.name,
              appointmentCount: count(appointments.id)
            })
            .from(careStaff)
            .leftJoin(appointments, eq(appointments.staffId, careStaff.id))
            .where(and(
              gte(appointments.dateTime, parsedStartDate),
              lte(appointments.dateTime, parsedEndDate)
            ))
            .groupBy(careStaff.id, careStaff.name)
            .orderBy(desc(count(appointments.id)));
          
          // Get status distribution per staff
          const staffStatusResult = await db
            .select({
              staffId: careStaff.id,
              status: appointments.status,
              count: count()
            })
            .from(appointments)
            .leftJoin(careStaff, eq(appointments.staffId, careStaff.id))
            .where(and(
              gte(appointments.dateTime, parsedStartDate),
              lte(appointments.dateTime, parsedEndDate)
            ))
            .groupBy(careStaff.id, appointments.status);

          // Transform to chart data
          const byStaff = staffAppointmentsResult.slice(0, 10).map(item => ({
            name: item.staffName,
            value: Number(item.appointmentCount)
          }));
          
          // Get staff activity log counts
          const staffActivityResult = await db
            .select({
              staffUserId: activityLogs.userId,
              count: count()
            })
            .from(activityLogs)
            .where(and(
              gte(activityLogs.timestamp, parsedStartDate),
              lte(activityLogs.timestamp, parsedEndDate)
            ))
            .groupBy(activityLogs.userId);

          // Get user names for staff
          const staffUsers = await db
            .select({
              id: users.id,
              name: users.name,
              role: users.role
            })
            .from(users)
            .where(eq(users.role, "care_staff"));

          // Combine activity data with user names
          const byActivity = staffUsers
            .map(user => {
              const activityCount = staffActivityResult.find(a => a.staffUserId === user.id);
              return {
                name: user.name,
                value: activityCount ? Number(activityCount.count) : 0
              };
            })
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
          
          // Calculate average appointments per staff
          const avgAppointments = totalStaff > 0 ? 
            Math.round((staffAppointmentsResult.reduce((sum, item) => sum + Number(item.appointmentCount), 0) / totalStaff) * 10) / 10 : 0;
          
          // Get department distribution
          const departmentResult = await db
            .select({
              department: careStaff.department,
              count: count()
            })
            .from(careStaff)
            .groupBy(careStaff.department);
            
          const byDepartment = departmentResult
            .filter(item => item.department)
            .map(item => ({
              name: item.department || "Not Assigned",
              value: item.count
            }));

          reportData = {
            title,
            period: `${parsedStartDate.toLocaleDateString()} - ${parsedEndDate.toLocaleDateString()}`,
            summary: {
              totalStaff,
              activeStaff: totalStaffResult[0].count, // We need to get active staff count from the database
              avgAppointmentsPerStaff: avgAppointments,
              appointmentsCompleted: staffStatusResult
                .filter(item => item.status === "Completed")
                .reduce((sum, item) => sum + Number(item.count), 0),
            },
            byStaff,
            byActivity,
            byDepartment
          };
          break;
        }

        // Add more report types as needed
        
        default:
          return res.status(400).json({ message: `Unsupported report type: ${reportType}` });
      }

      // Save the report if requested
      if (req.body.saveReport) {
        const [savedReport] = await db
          .insert(analyticsReports)
          .values({
            title,
            reportType: reportType as any,
            parameters: parameters || {},
            generatedData: reportData,
            startDate: parsedStartDate,
            endDate: parsedEndDate,
            createdBy: userId,
            tenantId: tenantId,
          })
          .returning();

        reportData.id = savedReport.id;
        reportData.savedAt = savedReport.createdAt;
      }

      return res.status(200).json(reportData);
    } catch (error) {
      console.error(`Error generating ${req.params.reportType} report:`, error);
      return res.status(500).json({ message: "Failed to generate report", error: error.message });
    }
  });

  // Dashboard endpoints
  app.get("/api/dashboards", auth.isAuthenticated, async (req: Request, res: Response) => {
    try {
      // @ts-ignore - User is added by the isAuthenticated middleware
      const tenantId = req.user?.tenantId;
      
      if (!tenantId) {
        return res.status(400).json({ message: "Tenant ID is required" });
      }

      const dashboards = await db
        .select()
        .from(reportDashboards)
        .where(tenantId ? sql`${reportDashboards.tenantId} = ${tenantId}` : undefined)
        .orderBy(desc(reportDashboards.createdAt));

      return res.status(200).json(dashboards);
    } catch (error: any) {
      console.error("Error retrieving dashboards:", error);
      return res.status(500).json({ message: "Failed to retrieve dashboards", error: error.message });
    }
  });

  app.post("/api/dashboards", auth.isAuthenticated, async (req: Request, res: Response) => {
    try {
      // @ts-ignore - User is added by the isAuthenticated middleware
      const userId = req.user?.id;
      // @ts-ignore
      const tenantId = req.user?.tenantId;

      // Validate the request body
      const validatedData = insertReportDashboardSchema.parse({
        ...req.body,
        createdBy: userId,
        tenantId: tenantId
      });

      const [newDashboard] = await db
        .insert(reportDashboards)
        .values(validatedData)
        .returning();

      return res.status(201).json(newDashboard);
    } catch (error) {
      console.error("Error creating dashboard:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid dashboard data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create dashboard", error: error.message });
    }
  });

  // Export endpoints
  app.post("/api/reports/:id/export", auth.isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { format } = req.body;
      
      // @ts-ignore - User is added by the isAuthenticated middleware
      const userId = req.user?.id;

      // Check if the report exists
      const report = await db
        .select()
        .from(analyticsReports)
        .where(eq(analyticsReports.id, parseInt(id)))
        .limit(1);

      if (!report || report.length === 0) {
        return res.status(404).json({ message: "Report not found" });
      }

      // In a real implementation, this would generate a file and store it
      // For now, we'll just create a record of the export
      const fileName = `report_${id}_${new Date().toISOString().replace(/[:.]/g, '-')}.${format}`;
      const filePath = `/exports/${fileName}`;

      const [exportRecord] = await db
        .insert(reportExports)
        .values({
          reportId: parseInt(id),
          exportFormat: format as any,
          fileName,
          filePath,
          exportedBy: userId,
        })
        .returning();

      // In a real implementation, we would return a download URL
      return res.status(200).json({
        ...exportRecord,
        downloadUrl: `/api/exports/${exportRecord.id}/download`,
      });
    } catch (error) {
      console.error(`Error exporting report ${req.params.id}:`, error);
      return res.status(500).json({ message: "Failed to export report", error: error.message });
    }
  });

  // Analytics Metrics endpoints
  app.get("/api/metrics", auth.isAuthenticated, async (req: Request, res: Response) => {
    try {
      // @ts-ignore - User is added by the isAuthenticated middleware
      const tenantId = req.user?.tenantId;
      
      if (!tenantId) {
        return res.status(400).json({ message: "Tenant ID is required" });
      }

      const metrics = await db
        .select()
        .from(analyticsMetrics)
        .where(tenantId ? sql`${analyticsMetrics.tenantId} = ${tenantId}` : undefined)
        .orderBy(asc(analyticsMetrics.category), asc(analyticsMetrics.metricName));

      return res.status(200).json(metrics);
    } catch (error) {
      console.error("Error retrieving metrics:", error);
      return res.status(500).json({ message: "Failed to retrieve metrics", error: error.message });
    }
  });

  app.post("/api/metrics", auth.isAuthenticated, async (req: Request, res: Response) => {
    try {
      // @ts-ignore - User is added by the isAuthenticated middleware
      const userId = req.user?.id;
      // @ts-ignore
      const tenantId = req.user?.tenantId;

      // Validate the request body
      const validatedData = insertAnalyticsMetricSchema.parse({
        ...req.body,
        createdBy: userId,
        tenantId: tenantId
      });

      const [newMetric] = await db
        .insert(analyticsMetrics)
        .values(validatedData)
        .returning();

      return res.status(201).json(newMetric);
    } catch (error) {
      console.error("Error creating metric:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid metric data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create metric", error: error.message });
    }
  });
}
