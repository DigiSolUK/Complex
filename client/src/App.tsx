import { Switch, Route, useLocation } from "wouter";
import React, { useEffect } from "react";
import AuthPage from "@/pages/auth-page";
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
import ComplianceDashboard from "@/pages/compliance-dashboard";
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
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

function ProtectedRoute({ component: Component, params, requireAdmin = false }: { component: React.ComponentType<any>, params: any, requireAdmin?: boolean }) {
  const { isAuthenticated, isDemoMode, isLoading, isAdmin, isSuperAdmin } = useAuth();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    if (!isLoading) {
      // Check authentication
      if (!isAuthenticated && !isDemoMode) {
        navigate('/auth'); // Navigate to auth page instead of login
      } 
      // Check admin access for protected routes
      else if (requireAdmin && !isAdmin && !isSuperAdmin) {
        navigate('/dashboard'); // Redirect non-admin users
      }
    }
  }, [isAuthenticated, isDemoMode, isLoading, isAdmin, isSuperAdmin, requireAdmin, navigate]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated && !isDemoMode) {
    return null;
  }
  
  if (requireAdmin && !isAdmin && !isSuperAdmin) {
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
  const { isAuthenticated, isDemoMode } = useAuth();
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
          window.location.href = '/auth';
          return null;
        }}
      </Route>
      {/* Landing Pages */}
      <Route path="/" component={HomePage} />
      <Route path="/features" component={FeaturesPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
    </>
  );

  // For landing pages and auth page when not authenticated, don't use AppLayout
  if (!isAuthenticated && !isDemoMode) {
    return (
      <Switch>
        {commonRoutes}
        <Route>  
          {() => {
            // Redirect to auth if accessing a protected route
            navigate('/auth');
            return null;
          }}
        </Route>
      </Switch>
    );
  }

  // For authenticated or dashboard pages, use the AppLayout
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
