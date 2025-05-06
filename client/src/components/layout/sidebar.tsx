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
  MessageCircle,
  FileText,
  Clock,
  Wrench,
  FileCheck,
  CalendarDays,
  BriefcaseMedical
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
            <div
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                isActive("/") || isActive("/dashboard")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Home className="h-5 w-5 mr-3" />
              Dashboard
            </div>
          </Link>

          <Link href="/patients">
            <div
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                isActive("/patients")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Users className="h-5 w-5 mr-3" />
              Patients
            </div>
          </Link>

          <Link href="/appointments">
            <div
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                isActive("/appointments")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Calendar className="h-5 w-5 mr-3" />
              Appointments
            </div>
          </Link>

          <Link href="/care-plans">
            <div
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                isActive("/care-plans")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <ClipboardList className="h-5 w-5 mr-3" />
              Care Plans
            </div>
          </Link>
          
          {/* Patient Support moved to AI Features section */}

          <Link href="/staff">
            <div
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                isActive("/staff")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <UserPlus className="h-5 w-5 mr-3" />
              Staff
            </div>
          </Link>
          
          <Link href="/care-professionals">
            <div
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                isActive("/care-professionals")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <FileCheck className="h-5 w-5 mr-3" />
              Care Professionals
            </div>
          </Link>
          
          <Link href="/compliance">
            <div
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                isActive("/compliance")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Shield className="h-5 w-5 mr-3" />
              Compliance Management
            </div>
          </Link>

          <Link href="/tasks">
            <div
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                isActive("/tasks")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Clock className="h-5 w-5 mr-3" />
              Tasks
            </div>
          </Link>

          <Link href="/timesheets">
            <div
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                isActive("/timesheets")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <CalendarDays className="h-5 w-5 mr-3" />
              Timesheets
            </div>
          </Link>

          <Link href="/documents">
            <div
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                isActive("/documents")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <FileText className="h-5 w-5 mr-3" />
              Documents
            </div>
          </Link>

          {/* AI Tools section has been moved to dedicated section below */}

          <div className="mt-6 pt-4 border-t border-neutral-200">
            <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              AI Tools
            </h3>
            <div className="mt-2 space-y-1">
              <Link href="/tools">
                <div
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    isActive("/tools") && !isActive("/tools/")
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <Wrench className="h-5 w-5 mr-3" />
                  All AI Tools
                </div>
              </Link>
              
              <Link href="/tools/clinical-support">
                <div
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    isActive("/tools/clinical-support")
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <BriefcaseMedical className="h-5 w-5 mr-3" />
                  Clinical Support
                </div>
              </Link>
              
              <Link href="/tools/patient-support">
                <div
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    isActive("/tools/patient-support")
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <MessageCircle className="h-5 w-5 mr-3" />
                  Patient Support
                </div>
              </Link>
              
              <Link href="/tools/analytics">
                <div
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    isActive("/tools/analytics")
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <BarChart2 className="h-5 w-5 mr-3" />
                  AI Analytics
                </div>
              </Link>

              <Link href="/tools/compliance">
                <div
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                    isActive("/tools/compliance")
                      ? "bg-primary-50 text-primary-700"
                      : "text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <Layers className="h-5 w-5 mr-3" />
                  Compliance Scanner
                </div>
              </Link>
            </div>
          </div>
          
          <Link href="/reports">
            <div
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                isActive("/reports")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <BarChart2 className="h-5 w-5 mr-3" />
              Reports
            </div>
          </Link>

          <Link href="/settings">
            <div
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                isActive("/settings")
                  ? "bg-primary-50 text-primary-700"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </div>
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
                    <div
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                        isActive("/superadmin/dashboard")
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <Shield className="h-5 w-5 mr-3" />
                      Admin Dashboard
                    </div>
                  </Link>
                  
                  <Link href="/compliance-dashboard">
                    <div
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                        isActive("/compliance-dashboard")
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <Layers className="h-5 w-5 mr-3" />
                      Compliance Dashboard
                    </div>
                  </Link>
                  
                  <Link href="/superadmin/tenant-management">
                    <div
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                        isActive("/superadmin/tenant-management") || isActive("/superadmin/tenants/")
                          ? "bg-primary-50 text-primary-700"
                          : "text-neutral-700 hover:bg-neutral-100"
                      }`}
                    >
                      <Building2 className="h-5 w-5 mr-3" />
                      Tenant Management
                    </div>
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
