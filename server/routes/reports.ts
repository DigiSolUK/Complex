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

// Helper function to handle errors with proper typing
function handleApiError(error: unknown, message: string, res: Response): Response {
  console.error(message, error);
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  return res.status(500).json({ message, error: errorMessage });
}

// Helper function to check if a value exists and create an SQL condition
function eqCond(column: any, value: any) {
  return value !== undefined && value !== null ? sql`${column} = ${value}` : undefined;
}

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
        .where(sql`${analyticsReports.tenantId} = ${tenantId}`)
        .orderBy(desc(analyticsReports.createdAt));

      return res.status(200).json(reports);
    } catch (error: unknown) {
      return handleApiError(error, "Failed to retrieve reports", res);
    }
  });

  // Get a specific report by ID
  app.get("/api/reports/:id", auth.isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const report = await db
        .select()
        .from(analyticsReports)
        .where(sql`${analyticsReports.id} = ${parseInt(id)}`)
        .limit(1);

      if (!report || report.length === 0) {
        return res.status(404).json({ message: "Report not found" });
      }

      return res.status(200).json(report[0]);
    } catch (error: unknown) {
      return handleApiError(error, `Failed to retrieve report ${req.params.id}`, res);
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
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid report data", errors: error.errors });
      }
      return handleApiError(error, "Failed to create report", res);
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
        .where(sql`${analyticsReports.id} = ${parseInt(id)}`)
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
        .where(sql`${analyticsReports.id} = ${parseInt(id)}`)
        .returning();

      return res.status(200).json(updatedReport);
    } catch (error: unknown) {
      return handleApiError(error, `Failed to update report ${req.params.id}`, res);
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
        .where(sql`${analyticsReports.id} = ${parseInt(id)}`)
        .limit(1);

      if (!existingReport || existingReport.length === 0) {
        return res.status(404).json({ message: "Report not found" });
      }

      // Delete the report
      await db
        .delete(analyticsReports)
        .where(sql`${analyticsReports.id} = ${parseInt(id)}`);

      return res.status(200).json({ message: "Report deleted successfully" });
    } catch (error: unknown) {
      return handleApiError(error, `Failed to delete report ${req.params.id}`, res);
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
            name: item.careType || "Not Set",
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
        
        // Other report types remain unchanged
        // ...
      }

      // Save the report if requested
      if (req.body.saveReport) {
        const [savedReport] = await db
          .insert(analyticsReports)
          .values({
            title,
            reportType,
            parameters: JSON.stringify({ startDate, endDate, ...parameters }),
            results: JSON.stringify(reportData),
            createdBy: userId,
            tenantId: tenantId,
          })
          .returning();
          
        return res.status(200).json({
          ...reportData,
          reportId: savedReport.id
        });
      }

      return res.status(200).json(reportData);
    } catch (error: unknown) {
      return handleApiError(error, `Failed to generate ${req.params.reportType} report`, res);
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
        .where(sql`${reportDashboards.tenantId} = ${tenantId}`)
        .orderBy(desc(reportDashboards.createdAt));

      return res.status(200).json(dashboards);
    } catch (error: unknown) {
      return handleApiError(error, "Failed to retrieve dashboards", res);
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
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid dashboard data", errors: error.errors });
      }
      return handleApiError(error, "Failed to create dashboard", res);
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
        .where(sql`${analyticsReports.id} = ${parseInt(id)}`)
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
    } catch (error: unknown) {
      return handleApiError(error, `Failed to export report ${req.params.id}`, res);
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
        .where(sql`${analyticsMetrics.tenantId} = ${tenantId}`)
        .orderBy(asc(analyticsMetrics.category), asc(analyticsMetrics.metricName));

      return res.status(200).json(metrics);
    } catch (error: unknown) {
      return handleApiError(error, "Failed to retrieve metrics", res);
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
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid metric data", errors: error.errors });
      }
      return handleApiError(error, "Failed to create metric", res);
    }
  });
}
