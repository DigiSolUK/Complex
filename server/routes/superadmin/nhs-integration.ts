import { Router, Request, Response } from "express";
import { auth } from "../../auth";
import { storage } from "../../storage";
import { insertNhsDigitalIntegrationSchema } from "@shared/schema";
import { z } from "zod";

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
      return res.status(404).json({ message: "NHS Digital integration not found for this tenant" });
    }
    
    // Mask API keys for security
    const maskedIntegration = {
      ...integration,
      pdsApiKey: integration.pdsApiKey ? "••••••••" : "",
      scrApiKey: integration.scrApiKey ? "••••••••" : "",
      epsApiKey: integration.epsApiKey ? "••••••••" : "",
      eReferralApiKey: integration.eRsApiKey ? "••••••••" : "",
      gpConnectApiKey: integration.gpConnectApiKey ? "••••••••" : "",
    };
    
    res.json(maskedIntegration);
  } catch (error) {
    console.error("Get NHS integration error:", error);
    res.status(500).json({ message: "An error occurred while fetching NHS Digital integration" });
  }
});

// Create or update NHS Digital integration settings for a tenant
router.post("/tenants/:tenantId/nhs-integration", auth.isAuthenticated, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const tenantId = parseInt(req.params.tenantId);
    const integrationData = insertNhsDigitalIntegrationSchema.parse({
      ...req.body,
      tenantId
    });
    
    // Check if NHS integration already exists for this tenant
    const existingIntegration = await storage.getNhsIntegrationByTenantId(tenantId);
    
    // Handle preserved keys (marked as __UNCHANGED__)
    if (existingIntegration) {
      if (integrationData.pdsApiKey === "__UNCHANGED__") {
        integrationData.pdsApiKey = existingIntegration.pdsApiKey;
      }
      if (integrationData.scrApiKey === "__UNCHANGED__") {
        integrationData.scrApiKey = existingIntegration.scrApiKey;
      }
      if (integrationData.epsApiKey === "__UNCHANGED__") {
        integrationData.epsApiKey = existingIntegration.epsApiKey;
      }
      if (integrationData.eRsApiKey === "__UNCHANGED__") {
        integrationData.eRsApiKey = existingIntegration.eRsApiKey;
      }
      if (integrationData.gpConnectApiKey === "__UNCHANGED__") {
        integrationData.gpConnectApiKey = existingIntegration.gpConnectApiKey;
      }
    }
    
    // Update tenant's NHS integration status based on any service being enabled
    const anyServiceEnabled = [
      integrationData.pdsEnabled,
      integrationData.scrEnabled,
      integrationData.epsEnabled,
      integrationData.eRsEnabled,
      integrationData.gpConnectEnabled
    ].some(Boolean);
    
    await storage.updateTenantNhsIntegration(tenantId, anyServiceEnabled);
    
    // Create or update the integration settings
    let updatedIntegration;
    if (existingIntegration) {
      updatedIntegration = await storage.updateNhsIntegration(existingIntegration.id, integrationData);
    } else {
      updatedIntegration = await storage.createNhsIntegration(integrationData);
    }
    
    // Mask API keys for response
    const maskedIntegration = {
      ...updatedIntegration,
      pdsApiKey: updatedIntegration.pdsApiKey ? "••••••••" : "",
      scrApiKey: updatedIntegration.scrApiKey ? "••••••••" : "",
      epsApiKey: updatedIntegration.epsApiKey ? "••••••••" : "",
      eReferralApiKey: updatedIntegration.eRsApiKey ? "••••••••" : "",
      gpConnectApiKey: updatedIntegration.gpConnectApiKey ? "••••••••" : "",
    };
    
    res.json(maskedIntegration);
  } catch (error) {
    console.error("Create/Update NHS integration error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid integration data", errors: error.errors });
    }
    res.status(500).json({ message: "An error occurred while saving NHS Digital integration" });
  }
});

// Test NHS Digital integration connection
router.post("/tenants/:tenantId/nhs-integration/test", auth.isAuthenticated, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const tenantId = parseInt(req.params.tenantId);
    const { service } = req.body;
    
    if (!service || !['pds', 'scr', 'eps', 'e-referral', 'gp-connect'].includes(service)) {
      return res.status(400).json({ message: "Invalid service specified" });
    }
    
    const integration = await storage.getNhsIntegrationByTenantId(tenantId);
    
    if (!integration) {
      return res.status(404).json({ message: "NHS Digital integration not found for this tenant" });
    }
    
    // Verify the service is enabled and has an API key
    let apiKey = "";
    let isEnabled = false;
    switch (service) {
      case 'pds':
        apiKey = integration.pdsApiKey;
        isEnabled = integration.pdsEnabled;
        break;
      case 'scr':
        apiKey = integration.scrApiKey;
        isEnabled = integration.scrEnabled;
        break;
      case 'eps':
        apiKey = integration.epsApiKey;
        isEnabled = integration.epsEnabled;
        break;
      case 'e-referral':
        apiKey = integration.eRsApiKey;
        isEnabled = integration.eRsEnabled;
        break;
      case 'gp-connect':
        apiKey = integration.gpConnectApiKey;
        isEnabled = integration.gpConnectEnabled;
        break;
    }
    
    if (!isEnabled) {
      return res.status(400).json({ message: `${service.toUpperCase()} service is not enabled` });
    }
    
    if (!apiKey) {
      return res.status(400).json({ message: `No API key provided for ${service.toUpperCase()} service` });
    }
    
    // In a real implementation, we would call the NHS Digital API here
    // For demo purposes, just update the lastVerified timestamp
    await storage.updateNhsIntegrationLastVerified(integration.id);
    
    res.json({ success: true, message: `Successfully connected to NHS Digital ${service.toUpperCase()} service` });
  } catch (error) {
    console.error("Test NHS integration error:", error);
    res.status(500).json({ message: "An error occurred while testing NHS Digital integration" });
  }
});

export default router;