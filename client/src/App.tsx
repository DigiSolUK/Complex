import { Switch, Route, useLocation } from "wouter";
import React, { useEffect } from "react";
import AuthPage from "@/pages/auth-page";
import { queryClient } from "./lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Patients from "@/pages/patients";
import PatientProfile from "@/pages/patient-profile";
import PatientSupport from "@/pages/patient-support";
import AITools from "@/pages/tools";
import ClinicalSupport from "@/pages/tools/clinical-support";
import PatientSupportTool from "@/pages/tools/patient-support";
import AnalyticsTool from "@/pages/tools/analytics";
import ComplianceTool from "@/pages/tools/compliance";
import AnimationsDemo from "@/pages/demo-animations";
import WearableDevices from "@/pages/wearable-devices";
import WearableDeviceData from "@/pages/wearable-device-data";
import Appointments from "@/pages/appointments";
import CarePlans from "@/pages/care-plans";
import CarePlanDetail from "@/pages/care-plan-detail";
import Staff from "@/pages/staff";
import Tasks from "@/pages/tasks";
import Documents from "@/pages/documents";
import CareProfessionals from "@/pages/care-professionals";
import Timesheets from "@/pages/timesheets";
import Compliance from "@/pages/compliance";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import PayrollPage from "@/pages/payroll";
import Login from "@/pages/login";
import TestLogin from "@/pages/test-login";
import DemoLogin from "@/pages/demo-login";
import ComplianceDashboard from "@/pages/compliance-dashboard";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
// Import superadmin pages
import SuperadminDashboard from "@/pages/superadmin/dashboard";
import TenantManagement from "@/pages/superadmin/tenant-management";
import TenantDetail from "@/pages/superadmin/tenant-detail";
// Import landing pages
import HomePage from "@/pages/landing/home-page";
import FeaturesPage from "@/pages/landing/features-page";
import PricingPage from "@/pages/landing/pricing-page";
import AboutPage from "@/pages/landing/about-page";
import ContactPage from "@/pages/landing/contact-page";
import { useAuth, AuthProvider } from "./context/auth-context";
import { ThemeProvider } from "./context/theme-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

function ProtectedRoute({ component: Component, params, requireAdmin = false }: { component: React.ComponentType<any>, params: any, requireAdmin?: boolean }) {
  const { isAuthenticated, isDemoMode, isLoading, isAdmin, isSuperAdmin } = useAuth();
  const [, navigate] = useLocation();
  
  // Use useEffect for redirects to avoid React state updates during render
  useEffect(() => {
    // Handle authentication check
    if (!isLoading && !isAuthenticated && !isDemoMode) {
      navigate('/auth');
    }
    // Handle admin check for protected routes
    else if (!isLoading && requireAdmin && !isAdmin && !isSuperAdmin) {
      navigate('/dashboard');
    }
  }, [isLoading, isAuthenticated, isDemoMode, requireAdmin, isAdmin, isSuperAdmin, navigate]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated or not authorized, show a loading state until redirect happens
  if ((!isAuthenticated && !isDemoMode) || (requireAdmin && !isAdmin && !isSuperAdmin)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }
  
  // User is authenticated and has proper permissions
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
  const { isAuthenticated, isDemoMode, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Get the current route
  const location = useLocation()[0];
  const isLandingPage = [
    '/', 
    '/features', 
    '/pricing', 
    '/about', 
    '/contact'
  ].includes(location);

  // Common routes that should be accessible regardless of authentication
  const commonRoutes = (
    <>
      <Route path="/auth" component={AuthPage} />
      <Route path="/login">
        {() => {
          // Redirect /login to /auth
          React.useEffect(() => {
            navigate('/auth');
          }, []);
          return null;
        }}
      </Route>
      <Route path="/test-login" component={TestLogin} />
      <Route path="/demo-login" component={DemoLogin} />
      {/* Landing Pages */}
      <Route path="/" component={HomePage} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
    </>
  );

  // If still loading authentication state, show loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  // For landing pages and auth page when not authenticated, don't use AppLayout
  if (!isAuthenticated && !isDemoMode) {
    if (isLandingPage || location === '/auth' || location === '/login' || location === '/demo-login') {
      // For landing pages and auth, render without app layout
      return (
        <Switch>
          {commonRoutes}
          <Route component={NotFound} />
        </Switch>
      );
    } else {
      // For protected routes when not authenticated, redirect to auth
      return (
        <Switch>
          {commonRoutes}
          <Route>
            {() => {
              React.useEffect(() => {
                navigate('/auth');
              }, []);
              return null;
            }}
          </Route>
        </Switch>
      );
    }
  }

  // For authenticated users or demo mode, use the AppLayout for non-landing pages
  if (isLandingPage) {
    // Keep landing pages with landing layout even when authenticated
    return (
      <Switch>
        {commonRoutes}
        <Route component={NotFound} />
      </Switch>
    );
  } else {
    // For authenticated/demo users accessing app pages, use AppLayout
    return (
      <AppLayout>
        <Switch>
          {commonRoutes}
          <Route path="/dashboard">
            {(params) => <ProtectedRoute component={Dashboard} params={params} />}
          </Route>
          <Route path="/patients">
            {(params) => <ProtectedRoute component={Patients} params={params} />}
          </Route>
          <Route path="/patients/:id">
            {(params) => <ProtectedRoute component={PatientProfile} params={params} />}
          </Route>
          <Route path="/patient-support">
            {(params) => <ProtectedRoute component={PatientSupport} params={params} />}
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
          <Route path="/care-professionals">
            {(params) => <ProtectedRoute component={CareProfessionals} params={params} />}
          </Route>
          <Route path="/tasks">
            {(params) => <ProtectedRoute component={Tasks} params={params} />}
          </Route>
          <Route path="/documents">
            {(params) => <ProtectedRoute component={Documents} params={params} />}
          </Route>
          <Route path="/timesheets">
            {(params) => <ProtectedRoute component={Timesheets} params={params} />}
          </Route>
          <Route path="/compliance">
            {(params) => <ProtectedRoute component={Compliance} params={params} />}
          </Route>
          <Route path="/reports">
            {(params) => <ProtectedRoute component={Reports} params={params} />}
          </Route>
          <Route path="/settings">
            {(params) => <ProtectedRoute component={Settings} params={params} />}
          </Route>
          <Route path="/payroll">
            {(params) => <ProtectedRoute component={PayrollPage} params={params} />}
          </Route>

          {/* AI Tools Routes */}
          <Route path="/tools">
            {(params) => <ProtectedRoute component={AITools} params={params} />}
          </Route>
          <Route path="/tools/clinical-support">
            {(params) => <ProtectedRoute component={ClinicalSupport} params={params} />}
          </Route>
          <Route path="/tools/patient-support">
            {(params) => <ProtectedRoute component={PatientSupportTool} params={params} />}
          </Route>
          <Route path="/tools/analytics">
            {(params) => <ProtectedRoute component={AnalyticsTool} params={params} />}
          </Route>
          <Route path="/tools/compliance">
            {(params) => <ProtectedRoute component={ComplianceTool} params={params} />}
          </Route>
          
          {/* Animation Demo Route */}
          <Route path="/demo-animations">
            {(params) => <ProtectedRoute component={AnimationsDemo} params={params} />}
          </Route>
          
          {/* Wearable Devices Routes */}
          <Route path="/wearable-devices">
            {(params) => <ProtectedRoute component={WearableDevices} params={params} />}
          </Route>
          <Route path="/patients/:patientId/wearables">
            {(params) => <ProtectedRoute component={WearableDevices} params={params} />}
          </Route>
          <Route path="/patients/:patientId/wearables/:deviceId/data">
            {(params) => <ProtectedRoute component={WearableDeviceData} params={params} />}
          </Route>
          
          {/* Legacy routes - will eventually be redirected to new tools section */}
          <Route path="/analytics-dashboard">
            {(params) => <ProtectedRoute component={AnalyticsDashboard} params={params} />}
          </Route>
          
          <Route path="/compliance-dashboard">
            {(params) => <ProtectedRoute component={ComplianceDashboard} params={params} requireAdmin={true} />}
          </Route>
          
          {/* Superadmin Routes */}
          <Route path="/superadmin/dashboard">
            {(params) => <ProtectedRoute component={SuperadminDashboard} params={params} requireAdmin={true} />}
          </Route>
          <Route path="/superadmin/tenant-management">
            {(params) => <ProtectedRoute component={TenantManagement} params={params} requireAdmin={true} />}
          </Route>
          <Route path="/superadmin/tenants/:id">
            {(params) => <ProtectedRoute component={TenantDetail} params={params} requireAdmin={true} />}
          </Route>
          
          <Route component={NotFound} />
        </Switch>
      </AppLayout>
    );
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ThemeProvider>
            <Toaster />
            <Router />
          </ThemeProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
