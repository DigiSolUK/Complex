import { Router, Request, Response } from "express";
import { auth } from "../../auth";
import { storage } from "../../storage";
import { insertTenantSchema } from "@shared/schema";
import { z } from "zod";

const router = Router();

// Middleware to check if the user is a superadmin
const requireSuperAdmin = (req: Request, res: Response, next: Function) => {
  if (req.user?.role !== "superadmin") {
    return res.status(403).json({ message: "Access denied. Superadmin access required." });
  }
  next();
};

// Get all tenants
router.get("/tenants", auth.isAuthenticated, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    // Fetch tenants from the database
    const tenants = await storage.getAllTenants();
    
    // Calculate user count per tenant (could be moved to storage layer in future)
    const enhancedTenants = await Promise.all(tenants.map(async (tenant) => {
      // Default to 0 if user count can't be determined
      let userCount = 0;
      // Return tenant with enhanced data
      return {
        ...tenant,
        userCount,
        // Subscription tier should be used on client side, but for backward compatibility
        plan: tenant.subscriptionTier
      };
    }));
    
    res.json(enhancedTenants);
  } catch (error) {
    console.error("Get tenants error:", error);
    res.status(500).json({ message: "An error occurred while fetching tenants" });
  }
});


// Get tenant by ID
router.get("/tenants/:id", auth.isAuthenticated, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const tenantId = parseInt(req.params.id);
    
    // Fetch tenant from the database
    const tenant = await storage.getTenantById(tenantId);
    
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    
    // Add userCount and plan for backward compatibility
    const enhancedTenant = {
      ...tenant,
      userCount: 0, // This could be improved by actually counting users
      plan: tenant.subscriptionTier
    };
    
    res.json(enhancedTenant);
  } catch (error) {
    console.error("Get tenant error:", error);
    res.status(500).json({ message: "An error occurred while fetching tenant" });
  }
});

// Create tenant
router.post("/tenants", auth.isAuthenticated, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    // Validate tenant data
    const tenantData = insertTenantSchema.parse(req.body);
    
    // Create tenant in database
    const tenant = await storage.createTenant(tenantData);
    
    // Add userCount and plan for backward compatibility
    const enhancedTenant = {
      ...tenant,
      userCount: 0,
      plan: tenant.subscriptionTier
    };
    
    res.status(201).json(enhancedTenant);
  } catch (error) {
    console.error("Create tenant error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid tenant data", errors: error.errors });
    }
    res.status(500).json({ message: "An error occurred while creating tenant" });
  }
});

// Update tenant
router.put("/tenants/:id", auth.isAuthenticated, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const tenantId = parseInt(req.params.id);
    
    // Validate tenant data
    const tenantData = insertTenantSchema.parse(req.body);
    
    // Update tenant in database
    const tenant = await storage.updateTenant(tenantId, tenantData);
    
    // Add userCount and plan for backward compatibility
    const enhancedTenant = {
      ...tenant,
      userCount: 0,
      plan: tenant.subscriptionTier
    };
    
    res.json(enhancedTenant);
  } catch (error) {
    console.error("Update tenant error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid tenant data", errors: error.errors });
    }
    res.status(500).json({ message: "An error occurred while updating tenant" });
  }
});

export default router;