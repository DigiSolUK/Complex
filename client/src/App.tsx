import { Switch, Route, useLocation } from "wouter";
import React, { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Patients from "@/pages/patients";
import PatientProfile from "@/pages/patient-profile";
import Appointments from "@/pages/appointments";
import CarePlans from "@/pages/care-plans";
import CarePlanDetail from "@/pages/care-plan-detail";
import Staff from "@/pages/staff";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import Login from "@/pages/login";
// Import superadmin pages
import SuperadminDashboard from "@/pages/superadmin/dashboard";
import TenantManagement from "@/pages/superadmin/tenant-management";
import TenantDetail from "@/pages/superadmin/tenant-detail";
import { useAuth, AuthProvider } from "./context/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

function ProtectedRoute({ component: Component, params }: { component: React.ComponentType<any>, params: any }) {
  const { isAuthenticated, isDemoMode, isLoading } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isDemoMode) {
      navigate('/login');
    }
  }, [isAuthenticated, isDemoMode, isLoading, navigate]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated && !isDemoMode) {
    return null;
  }
  
  return <Component params={params} />;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isDemoMode } = useAuth();
  
  if (!isAuthenticated && !isDemoMode) {
    return children;
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
}

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/">
          {(params) => <ProtectedRoute component={Dashboard} params={params} />}
        </Route>
        <Route path="/dashboard">
          {(params) => <ProtectedRoute component={Dashboard} params={params} />}
        </Route>
        <Route path="/patients">
          {(params) => <ProtectedRoute component={Patients} params={params} />}
        </Route>
        <Route path="/patients/:id">
          {(params) => <ProtectedRoute component={PatientProfile} params={params} />}
        </Route>
        <Route path="/appointments">
          {(params) => <ProtectedRoute component={Appointments} params={params} />}
        </Route>
        <Route path="/care-plans">
          {(params) => <ProtectedRoute component={CarePlans} params={params} />}
        </Route>
        <Route path="/care-plans/:id">
          {(params) => <ProtectedRoute component={CarePlanDetail} params={params} />}
        </Route>
        <Route path="/staff">
          {(params) => <ProtectedRoute component={Staff} params={params} />}
        </Route>
        <Route path="/reports">
          {(params) => <ProtectedRoute component={Reports} params={params} />}
        </Route>
        <Route path="/settings">
          {(params) => <ProtectedRoute component={Settings} params={params} />}
        </Route>
        
        {/* Superadmin Routes */}
        <Route path="/superadmin/dashboard">
          {(params) => <ProtectedRoute component={SuperadminDashboard} params={params} />}
        </Route>
        <Route path="/superadmin/tenant-management">
          {(params) => <ProtectedRoute component={TenantManagement} params={params} />}
        </Route>
        <Route path="/superadmin/tenants/:id">
          {(params) => <ProtectedRoute component={TenantDetail} params={params} />}
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
