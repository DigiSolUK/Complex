import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { UserAvatar } from "@/components/ui/avatar";
import {
  Home,
  Users,
  Calendar,
  ClipboardList,
  UserPlus,
  BarChart2,
  Settings,
  AlertCircle,
  Building2,
  Shield,
  Layers,
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  const { user, isDemoMode, isAdmin, isSuperAdmin } = useAuth();

  const isActive = (path: string) => {
    return location === path || (path !== "/" && location.startsWith(path));
  };

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 border-r border-neutral-200 bg-white">
      <div className="flex items-center justify-center h-16 border-b border-neutral-200">
        <h1 className="text-xl font-bold text-primary-700">ComplexCare CRM</h1>
      </div>

      {/* User profile */}
      <div className="flex items-center p-4 border-b border-neutral-200">
        <UserAvatar
          name={user?.name || "Demo User"}
          className="w-10 h-10"
        />
        <div className="ml-3">
          <p className="text-sm font-medium">{user?.name || "Dr. Sarah Johnson"}</p>
          <p className="text-xs text-neutral-500">
            {user?.role === "superadmin"
              ? "System Administrator"
              : user?.role === "admin"
              ? "Administrator"
              : user?.role === "care_staff"
              ? "Care Staff"
              : "Patient"}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-3 flex-1 overflow-y-auto">
        <div className="px-2 space-y-1">
          <Link href="/dashboard">
            <a
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/") || isActive("/dashboard")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Home className="h-5 w-5 mr-3" />
              Dashboard
            </a>
          </Link>

          <Link href="/patients">
            <a
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/patients")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              Patients
            </a>
          </Link>

          <Link href="/appointments">
            <a
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/appointments")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Calendar className="h-5 w-5 mr-3" />
              Appointments
            </a>
          </Link>

          <Link href="/care-plans">
            <a
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/care-plans")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <ClipboardList className="h-5 w-5 mr-3" />
              Care Plans
            </a>
          </Link>

          <Link href="/staff">
            <a
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/staff")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <UserPlus className="h-5 w-5 mr-3" />
              Staff
            </a>
          </Link>

          <Link href="/reports">
            <a
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/reports")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <BarChart2 className="h-5 w-5 mr-3" />
              Reports
            </a>
          </Link>

          <Link href="/settings">
            <a
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("/settings")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </a>
          </Link>
          
          {/* Superadmin Navigation Section */}
          {(isAdmin || isSuperAdmin) && (
            <>
              <div className="mt-6 pt-4 border-t border-neutral-200">
                <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  System Administration
                </h3>
                <div className="mt-2 space-y-1">
                  <Link href="/superadmin/dashboard">
                    <a
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive("/superadmin/dashboard")
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <Shield className="h-5 w-5 mr-3" />
                      Admin Dashboard
                    </a>
                  </Link>
                  
                  <Link href="/superadmin/tenant-management">
                    <a
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive("/superadmin/tenant-management") || isActive("/superadmin/tenants/")
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <Building2 className="h-5 w-5 mr-3" />
                      Tenant Management
                    </a>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Demo mode indicator */}
      {isDemoMode && (
        <div className="p-4 mt-2 border-t border-neutral-200">
          <div className="bg-yellow-50 p-2 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-yellow-700">Demo Mode Active</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
