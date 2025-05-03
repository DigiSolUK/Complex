import { Switch, Route } from "wouter";
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
import { useAuth } from "./context/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, isDemoMode } = useAuth();
  
  if (!isAuthenticated && !isDemoMode) {
    window.location.href = "/login";
    return null;
  }
  
  return <Component {...rest} />;
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
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/patients" component={Patients} />
        <Route path="/patients/:id" component={PatientProfile} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/care-plans" component={CarePlans} />
        <Route path="/care-plans/:id" component={CarePlanDetail} />
        <Route path="/staff" component={Staff} />
        <Route path="/reports" component={Reports} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
