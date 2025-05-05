import { Router, Request, Response } from "express";
import { auth } from "../../auth";
import { storage } from "../../storage";

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
    // In a real implementation, we would fetch tenants from the database
    // For now, return mock data
    const mockTenants = [
      { 
        id: 1, 
        name: "ComplexCare Medical Group", 
        domain: "complexcare.dev",
        status: "active", 
        plan: "enterprise",
        userCount: 125,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        contactEmail: "admin@complexcare.dev",
        contactName: "John Smith",
        contactPhone: "+1234567890",
        nhsIntegrationEnabled: true
      },
      { 
        id: 2, 
        name: "Ubercare Health Services", 
        domain: "ubercare.dev",
        status: "active", 
        plan: "professional",
        userCount: 68,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        contactEmail: "admin@ubercare.dev",
        contactName: "Sarah Johnson",
        contactPhone: "+1987654321",
        nhsIntegrationEnabled: false
      },
      { 
        id: 3, 
        name: "MediCare Solutions", 
        domain: "medicare.dev",
        status: "trial", 
        plan: "standard",
        userCount: 22,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        contactEmail: "admin@medicare.dev",
        contactName: "Michael Brown",
        contactPhone: "+1555123456",
        nhsIntegrationEnabled: false
      },
      { 
        id: 4, 
        name: "HealthFirst Clinic", 
        domain: "healthfirst.dev",
        status: "suspended", 
        plan: "professional",
        userCount: 43,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        contactEmail: "admin@healthfirst.dev",
        contactName: "Emily Wilson",
        contactPhone: "+1555789123",
        nhsIntegrationEnabled: false
      }
    ];
    
    res.json(mockTenants);
  } catch (error) {
    console.error("Get tenants error:", error);
    res.status(500).json({ message: "An error occurred while fetching tenants" });
  }
});

// Get tenant by ID
router.get("/tenants/:id", auth.isAuthenticated, requireSuperAdmin, async (req: Request, res: Response) => {
  try {
    const tenantId = parseInt(req.params.id);
    
    // In a real implementation, we would fetch tenant from the database
    // For now, return mock data
    const mockTenants = [
      { 
        id: 1, 
        name: "ComplexCare Medical Group", 
        domain: "complexcare.dev",
        status: "active", 
        plan: "enterprise",
        userCount: 125,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        contactEmail: "admin@complexcare.dev",
        contactName: "John Smith",
        contactPhone: "+1234567890",
        nhsIntegrationEnabled: true
      },
      { 
        id: 2, 
        name: "Ubercare Health Services", 
        domain: "ubercare.dev",
        status: "active", 
        plan: "professional",
        userCount: 68,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        contactEmail: "admin@ubercare.dev",
        contactName: "Sarah Johnson",
        contactPhone: "+1987654321",
        nhsIntegrationEnabled: false
      },
      { 
        id: 3, 
        name: "MediCare Solutions", 
        domain: "medicare.dev",
        status: "trial", 
        plan: "standard",
        userCount: 22,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        contactEmail: "admin@medicare.dev",
        contactName: "Michael Brown",
        contactPhone: "+1555123456",
        nhsIntegrationEnabled: false
      },
      { 
        id: 4, 
        name: "HealthFirst Clinic", 
        domain: "healthfirst.dev",
        status: "suspended", 
        plan: "professional",
        userCount: 43,
        lastActivity: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        contactEmail: "admin@healthfirst.dev",
        contactName: "Emily Wilson",
        contactPhone: "+1555789123",
        nhsIntegrationEnabled: false
      }
    ];
    
    const tenant = mockTenants.find(t => t.id === tenantId);
    
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    
    res.json(tenant);
  } catch (error) {
    console.error("Get tenant error:", error);
    res.status(500).json({ message: "An error occurred while fetching tenant" });
  }
});

export default router;