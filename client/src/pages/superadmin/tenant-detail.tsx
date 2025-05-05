import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NhsDigitalIntegration } from "@/components/superadmin/nhs-digital-integration";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/custom-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Activity,
  Users,
  Settings,
  Calendar,
  CreditCard,
  BarChart,
  Building2,
  ArrowLeft,
  Edit,
  Download,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  Link as LinkIcon,
  Mail,
  Phone,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Link, useParams } from "wouter";

export default function TenantDetail() {
  const [activeTab, setActiveTab] = useState("overview");
  const { id } = useParams();
  const tenantId = parseInt(id || "0");
  
  // Fetch tenant data
  const { data: tenant, isLoading, error } = useQuery({
    queryKey: [`/api/superadmin/tenants/${tenantId}`],
    queryFn: () => ({
      // Mock data until API is implemented
      id: tenantId,
      name: "ComplexCare Medical Group",
      domain: "complexcare.dev",
      status: "active", 
      subscriptionTier: "enterprise",
      userLimit: 150,
      currentUsers: 128,
      lastActivity: new Date().toISOString(),
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(), // 6 months ago
      contactEmail: "admin@complexcare.dev",
      contactName: "John Smith",
      contactPhone: "+1234567890",
      logo: null,
      billingInfo: "Annual enterprise plan",
      metrics: {
        activePatients: 528,
        activeCareStaff: 78,
        appointmentsThisMonth: 1245,
        activeCarePlans: 312,
      },
      activity: [
        { id: 1, action: "user_login", details: "Admin user logged in", timestamp: new Date().toISOString() },
        { id: 2, action: "patient_added", details: "New patient registered", timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
        { id: 3, action: "appointment_scheduled", details: "New appointment scheduled", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      ]
    })
  });

  // Simulate suspend/reinstate tenant mutation
  const suspendMutation = useMutation({
    mutationFn: async (suspend: boolean) => {
      const action = suspend ? "suspend" : "reinstate";
      const response = await apiRequest("POST", `/api/superadmin/tenants/${tenantId}/${action}`, {});
      return await response.json();
    },
    onSuccess: (_, suspend) => {
      const action = suspend ? "suspended" : "reinstated";
      toast({
        title: `Tenant ${action}`,
        description: `The tenant has been ${action} successfully.`,
      });
    },
    onError: (error: Error, suspend) => {
      const action = suspend ? "suspend" : "reinstate";
      toast({
        title: `Failed to ${action} tenant`,
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="p-8">Loading tenant details...</div>;
  }
  
  if (error) {
    return <div className="p-8">Error loading tenant details</div>;
  }
  
  if (!tenant) {
    return <div className="p-8">Tenant not found</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isActive = tenant.status === "active";

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center mb-8 space-x-2">
        <Link href="/superadmin/tenant-management">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tenants
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{tenant.name}</h1>
            <p className="text-muted-foreground">
              <span className="inline-flex items-center">
                <LinkIcon className="mr-1 h-3 w-3" />
                {tenant.domain}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/superadmin/tenants/${tenant.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Tenant
            </Button>
          </Link>
          
          <Button 
            variant={isActive ? "destructive" : "default"} 
            onClick={() => suspendMutation.mutate(isActive)}
            disabled={suspendMutation.isPending}
          >
            {suspendMutation.isPending ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : isActive ? (
              <PauseCircle className="mr-2 h-4 w-4" />
            ) : (
              <PlayCircle className="mr-2 h-4 w-4" />
            )}
            {isActive ? "Suspend Tenant" : "Reinstate Tenant"}
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenant.currentUsers} / {tenant.userLimit}</div>
            <div className="h-1 w-full bg-muted mt-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${(tenant.currentUsers / tenant.userLimit) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{tenant.subscriptionTier}</div>
            <p className="text-xs text-muted-foreground">{tenant.billingInfo}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize flex items-center">
              <StatusBadge variant={tenant.status === "active" ? "success" : "destructive"} className="mr-2 capitalize">
                {tenant.status}
              </StatusBadge>
            </div>
            <p className="text-xs text-muted-foreground">Since {formatDate(tenant.createdAt)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Primary Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-base font-medium">{tenant.contactName}</div>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3 mr-1" />
              {tenant.contactEmail}
            </div>
            {tenant.contactPhone && (
              <div className="flex items-center mt-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3 mr-1" />
                {tenant.contactPhone}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="usage">
            <BarChart className="h-4 w-4 mr-2" />
            Usage
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Overview</CardTitle>
              <CardDescription>
                General metrics and recent activity for this tenant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Key Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Active Patients</p>
                    <p className="text-2xl font-bold">{tenant.metrics.activePatients}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Care Staff</p>
                    <p className="text-2xl font-bold">{tenant.metrics.activeCareStaff}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Appointments (Month)</p>
                    <p className="text-2xl font-bold">{tenant.metrics.appointmentsThisMonth}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Active Care Plans</p>
                    <p className="text-2xl font-bold">{tenant.metrics.activeCarePlans}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {tenant.activity.map((item, index) => (
                    <div key={item.id} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Activity className="h-5 w-5" />
                        </div>
                        {index < tenant.activity.length - 1 && (
                          <div className="h-full w-px bg-border" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{item.details}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                View and manage users for this tenant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>User management content will go here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>
                View detailed tenant usage metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Usage statistics content will go here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>
                Manage billing and subscription details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Billing information content will go here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Settings</CardTitle>
              <CardDescription>
                Configure tenant-specific settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Tenant settings content will go here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
