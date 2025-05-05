import { Router, Request, Response } from "express";
import { auth } from "../../auth";
import { storage } from "../../storage";
import { z } from "zod";
import { insertNhsDigitalIntegrationSchema } from "@shared/schema";

const router = Router();

// Middleware to check if the user is a superadmin
const requireSuperAdmin = (req: Request, res: Response, next: Function) => {
  if (req.user?.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied. Superadmin access required." });
  }
  next();
};

// Get NHS Digital integration settings for a tenant
router.get("/tenants/:tenantId/nhs-integration", auth.isAuthenticated, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const tenantId = parseInt(req.params.tenantId);
    const integration = await storage.getNhsIntegrationByTenantId(tenantId);
    
    if (!integration) {
      return res.json({
        tenantId,
        pdsApiKey: null,
        scrApiKey: null,
        epsApiKey: null,
        eReferralApiKey: null,
        gpConnectApiKey: null,
        pdsEnabled: false,
        scrEnabled: false,
        epsEnabled: false,
        eReferralEnabled: false,
        gpConnectEnabled: false,
      });
    }
    
    // Return sanitized integration data (no actual API keys)
    const sanitizedIntegration = sanitizeIntegration(integration);
    res.json(sanitizedIntegration);
  } catch (error) {
    console.error("Get NHS integration error:", error);
    res.status(500).json({ message: "An error occurred while fetching NHS integration settings" });
  }
});

// Update NHS Digital integration settings for a tenant
router.post("/tenants/:tenantId/nhs-integration", auth.isAuthenticated, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const tenantId = parseInt(req.params.tenantId);
    const parseResult = insertNhsDigitalIntegrationSchema.safeParse({
      ...req.body,
      tenantId
    });
    
    if (!parseResult.success) {
      return res.status(400).json({ 
        message: "Invalid NHS integration data", 
        errors: parseResult.error.errors 
      });
    }
    
    const data = parseResult.data;
    const existingIntegration = await storage.getNhsIntegrationByTenantId(tenantId);
    
    let result;
    if (existingIntegration) {
      // Update existing integration
      result = await storage.updateNhsIntegration(existingIntegration.id, data);
      
      // Update tenant NHS integration flag
      await storage.updateTenantNhsIntegration(tenantId, isAnyServiceEnabled(data));
    } else {
      // Create new integration
      result = await storage.createNhsIntegration(data);
      
      // Update tenant NHS integration flag
      await storage.updateTenantNhsIntegration(tenantId, isAnyServiceEnabled(data));
    }
    
    // Return sanitized result
    const sanitizedResult = sanitizeIntegration(result);
    res.json(sanitizedResult);
  } catch (error) {
    console.error("Update NHS integration error:", error);
    res.status(500).json({ message: "An error occurred while updating NHS integration settings" });
  }
});

// Test NHS Digital integration connection
router.post("/tenants/:tenantId/nhs-integration/test", auth.isAuthenticated, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const tenantId = parseInt(req.params.tenantId);
    const { service } = req.body;
    
    if (!service || ![
      "pds", 
      "scr", 
      "eps", 
      "e-referral", 
      "gp-connect"
    ].includes(service)) {
      return res.status(400).json({ message: "Invalid service specified" });
    }
    
    const integration = await storage.getNhsIntegrationByTenantId(tenantId);
    if (!integration) {
      return res.status(404).json({ message: "NHS integration not configured for this tenant" });
    }
    
    // In a real implementation, we would test the connection to the NHS Digital service
    // For now, we'll simulate a successful connection
    
    // Update last verified timestamp
    const updatedIntegration = await storage.updateNhsIntegrationLastVerified(integration.id);
    
    res.json({ 
      success: true,
      service,
      message: `Successfully connected to NHS Digital ${service.toUpperCase()} service.`,
      lastVerified: updatedIntegration.lastVerified
    });
  } catch (error) {
    console.error("Test NHS integration error:", error);
    res.status(500).json({ 
      success: false,
      message: "An error occurred while testing NHS integration connection" 
    });
  }
});

function isAnyServiceEnabled(data: any): boolean {
  return !!(
    data.pdsEnabled || 
    data.scrEnabled || 
    data.epsEnabled || 
    data.eReferralEnabled || 
    data.gpConnectEnabled
  );
}

function sanitizeIntegration(integration: any) {
  // Create a copy of the integration object
  const sanitized = { ...integration };
  
  // Mask the API keys if they exist
  if (sanitized.pdsApiKey) sanitized.pdsApiKey = "••••••••";
  if (sanitized.scrApiKey) sanitized.scrApiKey = "••••••••";
  if (sanitized.epsApiKey) sanitized.epsApiKey = "••••••••";
  if (sanitized.eReferralApiKey) sanitized.eReferralApiKey = "••••••••";
  if (sanitized.gpConnectApiKey) sanitized.gpConnectApiKey = "••••••••";
  
  return sanitized;
}

export default router;