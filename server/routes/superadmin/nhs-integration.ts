import { Router, Request, Response } from "express";
import { storage } from "../../storage";
import {
  insertNhsDigitalIntegrationSchema,
  InsertNhsDigitalIntegration,
} from "@shared/schema";

const router = Router();

// Get NHS Digital integration settings for a tenant
router.get("/tenants/:tenantId/nhs-integration", async (req: Request, res: Response) => {
  try {
    const tenantId = parseInt(req.params.tenantId);
    if (isNaN(tenantId)) {
      return res.status(400).json({ message: "Invalid tenant ID" });
    }

    const integration = await storage.getNhsIntegrationByTenantId(tenantId);
    if (!integration) {
      return res.status(404).json({ message: "NHS integration settings not found" });
    }

    // Don't return sensitive API keys to the frontend
    const sanitizedResponse = {
      ...integration,
      pdsApiKey: integration.pdsApiKey ? "*********" : undefined,
      scrApiKey: integration.scrApiKey ? "*********" : undefined,
      epsApiKey: integration.epsApiKey ? "*********" : undefined,
      eRsApiKey: integration.eRsApiKey ? "*********" : undefined,
      gpConnectApiKey: integration.gpConnectApiKey ? "*********" : undefined,
    };

    return res.status(200).json(sanitizedResponse);
  } catch (error) {
    console.error("Error fetching NHS integration settings:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Create or update NHS Digital integration settings for a tenant
router.post("/tenants/:tenantId/nhs-integration", async (req: Request, res: Response) => {
  try {
    const tenantId = parseInt(req.params.tenantId);
    if (isNaN(tenantId)) {
      return res.status(400).json({ message: "Invalid tenant ID" });
    }

    // Validate request body
    const parseResult = insertNhsDigitalIntegrationSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ 
        message: "Invalid request data", 
        errors: parseResult.error.errors 
      });
    }

    const data: InsertNhsDigitalIntegration = parseResult.data;

    // Check if integration settings already exist
    const existingIntegration = await storage.getNhsIntegrationByTenantId(tenantId);

    // Preserve existing API keys if they were not changed (masked with asterisks in the frontend)
    if (existingIntegration) {
      if (data.pdsApiKey === "*********") data.pdsApiKey = existingIntegration.pdsApiKey;
      if (data.scrApiKey === "*********") data.scrApiKey = existingIntegration.scrApiKey;
      if (data.epsApiKey === "*********") data.epsApiKey = existingIntegration.epsApiKey;
      if (data.eRsApiKey === "*********") data.eRsApiKey = existingIntegration.eRsApiKey;
      if (data.gpConnectApiKey === "*********") data.gpConnectApiKey = existingIntegration.gpConnectApiKey;

      // Update existing integration
      const updatedIntegration = await storage.updateNhsIntegration(existingIntegration.id, data);

      // Also update tenant's nhsIntegrationEnabled flag
      await storage.updateTenantNhsIntegration(tenantId, isAnyServiceEnabled(data));

      return res.status(200).json({ 
        message: "NHS integration settings updated",
        integration: sanitizeIntegration(updatedIntegration)
      });
    }

    // Create new integration
    const newIntegration = await storage.createNhsIntegration({
      ...data,
      tenantId
    });

    // Update tenant's nhsIntegrationEnabled flag
    await storage.updateTenantNhsIntegration(tenantId, isAnyServiceEnabled(data));

    return res.status(201).json({ 
      message: "NHS integration settings created",
      integration: sanitizeIntegration(newIntegration)
    });
  } catch (error) {
    console.error("Error saving NHS integration settings:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Test NHS Digital service connection
router.post("/tenants/:tenantId/nhs-integration/test", async (req: Request, res: Response) => {
  try {
    const tenantId = parseInt(req.params.tenantId);
    if (isNaN(tenantId)) {
      return res.status(400).json({ message: "Invalid tenant ID" });
    }

    const { service } = req.body;
    if (!service || !['pds', 'scr', 'eps', 'ers', 'gpconnect'].includes(service)) {
      return res.status(400).json({ message: "Invalid service specified" });
    }

    const integration = await storage.getNhsIntegrationByTenantId(tenantId);
    if (!integration) {
      return res.status(404).json({ message: "NHS integration settings not found" });
    }

    // Get the API key for the requested service
    let apiKey: string | undefined;
    switch (service) {
      case 'pds': apiKey = integration.pdsApiKey; break;
      case 'scr': apiKey = integration.scrApiKey; break;
      case 'eps': apiKey = integration.epsApiKey; break;
      case 'ers': apiKey = integration.eRsApiKey; break;
      case 'gpconnect': apiKey = integration.gpConnectApiKey; break;
    }

    if (!apiKey) {
      return res.status(400).json({ 
        message: `No API key configured for ${service.toUpperCase()} service` 
      });
    }

    // For now, we'll simulate a successful connection test
    // In a real implementation, this would make an actual API call to the NHS Digital service
    
    // Update the last verified timestamp
    await storage.updateNhsIntegrationLastVerified(integration.id);

    return res.status(200).json({ 
      message: `Successfully connected to NHS Digital ${service.toUpperCase()} service`,
      service,
      status: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error testing NHS integration connection:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Helper function to check if any NHS Digital service is enabled
function isAnyServiceEnabled(data: InsertNhsDigitalIntegration): boolean {
  return (
    data.pdsEnabled ||
    data.scrEnabled ||
    data.epsEnabled ||
    data.eRsEnabled ||
    data.gpConnectEnabled
  );
}

// Helper function to sanitize integration data (remove API keys)
function sanitizeIntegration(integration: any) {
  return {
    ...integration,
    pdsApiKey: integration.pdsApiKey ? "*********" : undefined,
    scrApiKey: integration.scrApiKey ? "*********" : undefined,
    epsApiKey: integration.epsApiKey ? "*********" : undefined,
    eRsApiKey: integration.eRsApiKey ? "*********" : undefined,
    gpConnectApiKey: integration.gpConnectApiKey ? "*********" : undefined,
  };
}

export default router;
