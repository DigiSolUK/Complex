import express from "express";
import { db } from "../db";
import { tenants } from "@shared/schema";
import { eq } from "drizzle-orm";
import { storage } from "../storage";
import { auth } from "../auth";

const router = express.Router();

// Get current tenant theme settings (based on user's session)
router.get("/api/tenants/current/theme", auth.isAuthenticated, async (req, res) => {
  try {
    // Get the tenant associated with the user
    // This is a simplified version - in a real multi-tenant system, you would look up the user's tenant ID
    // For demo purposes, we'll just get the first tenant
    const [tenant] = await db.select().from(tenants).limit(1);
    
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    
    // Return theme settings
    res.json({
      themeName: tenant.themeName,
      themeColors: tenant.themeColors,
      themeDarkMode: tenant.themeDarkMode,
      themeCustomCss: tenant.themeCustomCss,
    });
  } catch (error) {
    console.error("Error fetching tenant theme:", error);
    res.status(500).json({ message: "An error occurred while fetching tenant theme" });
  }
});

// Update tenant theme settings (admin only)
router.put("/api/tenants/:id/theme", auth.hasRole(["superadmin", "admin"]), async (req, res) => {
  try {
    const tenantId = parseInt(req.params.id);
    const { themeName, themeColors, themeDarkMode, themeCustomCss } = req.body;
    
    // Update tenant theme settings
    const [updatedTenant] = await db
      .update(tenants)
      .set({
        themeName: themeName,
        themeColors: themeColors,
        themeDarkMode: themeDarkMode,
        themeCustomCss: themeCustomCss,
      })
      .where(eq(tenants.id, tenantId))
      .returning();
    
    if (!updatedTenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    
    // Log activity
    await storage.createActivityLog({
      userId: req.user!.id,
      action: "update",
      entityType: "tenant",
      entityId: tenantId,
      details: `Updated tenant theme settings: ${updatedTenant.name}`,
    });
    
    res.json({
      themeName: updatedTenant.themeName,
      themeColors: updatedTenant.themeColors,
      themeDarkMode: updatedTenant.themeDarkMode,
      themeCustomCss: updatedTenant.themeCustomCss,
    });
  } catch (error) {
    console.error("Error updating tenant theme:", error);
    res.status(500).json({ message: "An error occurred while updating tenant theme" });
  }
});

export default router;
