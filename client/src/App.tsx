import React from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";

// UI Components
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

// Contexts
import { ThemeProvider } from "./context/theme-context";
import { useAuth, AuthProvider } from "./context/auth-context";

// Pages
import HomePage from "@/pages/landing/home-page";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import TestLogin from "@/pages/test-login";
import DemoLogin from "@/pages/demo-login";

// Marketing/Sales Pages
import FeaturesPage from "@/pages/landing/features-page";
import PricingPage from "@/pages/landing/pricing-page";
import AboutPage from "@/pages/landing/about-page";
import ContactPage from "@/pages/landing/contact-page";

// Protected Pages
import Dashboard from "@/pages/dashboard";
import Patients from "@/pages/patients";
import PatientProfile from "@/pages/patient-profile";
import PatientSupport from "@/pages/patient-support";
import Appointments from "@/pages/appointments";
import CarePlans from "@/pages/care-plans";
import CarePlanDetail from "@/pages/care-plan-detail";
import Staff from "@/pages/staff";
import CareProfessionals from "@/pages/care-professionals";
import Tasks from "@/pages/tasks";
import Documents from "@/pages/documents";
import Timesheets from "@/pages/timesheets";
import Compliance from "@/pages/compliance";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import PayrollPage from "@/pages/payroll";

// AI Tools
import AITools from "@/pages/tools";
import ClinicalSupport from "@/pages/tools/clinical-support";
import PatientSupportTool from "@/pages/tools/patient-support";
import AnalyticsTool from "@/pages/tools/analytics";
import ComplianceTool from "@/pages/tools/compliance";
import ComplianceDashboard from "@/pages/compliance-dashboard";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import WearableDevices from "@/pages/wearable-devices";
import WearableDeviceData from "@/pages/wearable-device-data";
import AnimationsDemo from "@/pages/demo-animations";
import MicroAnimationsDemo from "@/pages/micro-animations-demo";

// Superadmin Pages
import SuperadminDashboard from "@/pages/superadmin/dashboard";
import TenantManagement from "@/pages/superadmin/tenant-management";
import TenantDetail from "@/pages/superadmin/tenant-detail";

// Layout Components
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

// Define the protected route wrapper as a regular component (not a hook-using component)
function ProtectedRoute(props) {
  const { component: Component, requireAdmin = false } = props;
  const { isAuthenticated, isDemoMode, isAdmin, isSuperAdmin } = useAuth();
  const [, navigate] = useLocation();

  // Check authorization and redirect if needed
  if (!isAuthenticated && !isDemoMode) {
    navigate('/auth');
    return <div>Redirecting to login...</div>;
  }

  if (requireAdmin && !isAdmin && !isSuperAdmin) {
    navigate('/dashboard');
    return <div>Unauthorized. Redirecting...</div>;
  }

  // Render the actual component once all checks pass
  return <Component {...props} />;
}

// App layout component with sidebar and header
function AppLayout({ children }) {
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

// Main router component
function Router() {
  const { isAuthenticated, isDemoMode, isLoading } = useAuth();
  const [location] = useLocation();

  // Define which routes should use the landing page layout
  const isLandingPage = ['/', '/features', '/pricing', '/about', '/contact'].includes(location);
  const isAuthPage = ['/auth', '/login', '/test-login', '/demo-login'].includes(location);

  // If still loading authentication data, show a loading indicator
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

  // Public routes that don't require authentication
  const publicRoutes = (
    <>
      <Route path="/" component={HomePage} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/login" component={() => {
        const [, navigate] = useLocation();
        navigate('/auth');
        return <div>Redirecting to login...</div>;
      }} />
      <Route path="/test-login" component={TestLogin} />
      <Route path="/demo-login" component={DemoLogin} />
    </>
  );

  // If viewing a public page or not authenticated, show without app layout
  if ((isLandingPage || isAuthPage) || (!isAuthenticated && !isDemoMode)) {
    return (
      <Switch>
        {publicRoutes}
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Otherwise, show authenticated routes with app layout
  return (
    <AppLayout>
      <Switch>
        {/* Public routes are still accessible when logged in */}
        {publicRoutes}

        {/* Dashboard Routes */}
        <Route path="/dashboard">
          {() => <ProtectedRoute component={Dashboard} />}
        </Route>

        {/* Patient Routes */}
        <Route path="/patients">
          {() => <ProtectedRoute component={Patients} />}
        </Route>
        <Route path="/patients/:id">
          {(params) => <ProtectedRoute component={PatientProfile} params={params} />}
        </Route>
        <Route path="/patient-support">
          {() => <ProtectedRoute component={PatientSupport} />}
        </Route>

        {/* Care Routes */}
        <Route path="/appointments">
          {() => <ProtectedRoute component={Appointments} />}
        </Route>
        <Route path="/care-plans">
          {() => <ProtectedRoute component={CarePlans} />}
        </Route>
        <Route path="/care-plans/:id">
          {(params) => <ProtectedRoute component={CarePlanDetail} params={params} />}
        </Route>

        {/* Staff Routes */}
        <Route path="/staff">
          {() => <ProtectedRoute component={Staff} />}
        </Route>
        <Route path="/care-professionals">
          {() => <ProtectedRoute component={CareProfessionals} />}
        </Route>

        {/* Operation Routes */}
        <Route path="/tasks">
          {() => <ProtectedRoute component={Tasks} />}
        </Route>
        <Route path="/documents">
          {() => <ProtectedRoute component={Documents} />}
        </Route>
        <Route path="/timesheets">
          {() => <ProtectedRoute component={Timesheets} />}
        </Route>
        <Route path="/compliance">
          {() => <ProtectedRoute component={Compliance} />}
        </Route>
        <Route path="/reports">
          {() => <ProtectedRoute component={Reports} />}
        </Route>
        <Route path="/settings">
          {() => <ProtectedRoute component={Settings} />}
        </Route>
        <Route path="/payroll">
          {() => <ProtectedRoute component={PayrollPage} />}
        </Route>

        {/* AI Tools Routes */}
        <Route path="/tools">
          {() => <ProtectedRoute component={AITools} />}
        </Route>
        <Route path="/tools/clinical-support">
          {() => <ProtectedRoute component={ClinicalSupport} />}
        </Route>
        <Route path="/tools/patient-support">
          {() => <ProtectedRoute component={PatientSupportTool} />}
        </Route>
        <Route path="/tools/analytics">
          {() => <ProtectedRoute component={AnalyticsTool} />}
        </Route>
        <Route path="/tools/compliance">
          {() => <ProtectedRoute component={ComplianceTool} />}
        </Route>

        {/* Misc Routes */}
        <Route path="/demo-animations">
          {() => <ProtectedRoute component={AnimationsDemo} />}
        </Route>
        <Route path="/micro-animations">
          {() => <ProtectedRoute component={MicroAnimationsDemo} />}
        </Route>

        {/* Wearable Devices Routes */}
        <Route path="/wearable-devices">
          {() => <ProtectedRoute component={WearableDevices} />}
        </Route>
        <Route path="/patients/:patientId/wearables">
          {(params) => <ProtectedRoute component={WearableDevices} params={params} />}
        </Route>
        <Route path="/patients/:patientId/wearables/:deviceId/data">
          {(params) => <ProtectedRoute component={WearableDeviceData} params={params} />}
        </Route>

        {/* Legacy/Analytics Routes */}
        <Route path="/analytics-dashboard">
          {() => <ProtectedRoute component={AnalyticsDashboard} />}
        </Route>
        <Route path="/compliance-dashboard">
          {() => <ProtectedRoute component={ComplianceDashboard} requireAdmin={true} />}
        </Route>

        {/* Superadmin Routes */}
        <Route path="/superadmin/dashboard">
          {() => <ProtectedRoute component={SuperadminDashboard} requireAdmin={true} />}
        </Route>
        <Route path="/superadmin/tenant-management">
          {() => <ProtectedRoute component={TenantManagement} requireAdmin={true} />}
        </Route>
        <Route path="/superadmin/tenants/:id">
          {(params) => <ProtectedRoute component={TenantDetail} params={params} requireAdmin={true} />}
        </Route>

        {/* Catch-all for unknown routes */}
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
