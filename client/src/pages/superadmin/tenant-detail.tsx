import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronLeft, Building2, Settings, Users, Calendar, FileText, Shield } from "lucide-react";
import { NhsDigitalIntegration } from "@/components/superadmin/nhs-digital-integration";
import { useToast } from "@/hooks/use-toast";

export default function TenantDetail() {
  const [, setLocation] = useLocation();
  const { tenantId } = useParams<{ tenantId: string }>();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch tenant details
  const { data: tenant, isLoading, error } = useQuery({
    queryKey: [`/api/superadmin/tenants/${tenantId}`],
    enabled: !!tenantId
  });

  const handleGoBack = () => {
    setLocation("/superadmin/tenants");
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-lg text-muted-foreground">Loading tenant details...</span>
        </div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="text-lg text-muted-foreground">Failed to load tenant details</div>
          <Button onClick={handleGoBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon" onClick={handleGoBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{tenant.name}</h1>
          <p className="text-muted-foreground">{tenant.domain}</p>
        </div>
        <div className="ml-auto flex space-x-2">
          <Button variant="outline" className="px-2">
            <Users className="mr-2 h-4 w-4" /> {tenant.userCount || 0} Users
          </Button>
          <div className={`px-2 py-1 rounded text-xs ${tenant.status === "active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
            {tenant.status?.toUpperCase()}
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Building2 className="h-4 w-4 mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" /> Users
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <Calendar className="h-4 w-4 mr-2" /> Subscription
          </TabsTrigger>
          <TabsTrigger value="usage">
            <FileText className="h-4 w-4 mr-2" /> Usage
          </TabsTrigger>
          <TabsTrigger value="nhs-integration">
            <Shield className="h-4 w-4 mr-2" /> NHS Integration
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tenant Information</CardTitle>
                <CardDescription>Basic details about this tenant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Domain</div>
                    <div className="text-sm font-medium">{tenant.domain}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className="text-sm font-medium">
                      <span className={`px-2 py-1 rounded text-xs ${tenant.status === "active" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                        {tenant.status?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Created</div>
                    <div className="text-sm font-medium">{new Date(tenant.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Subscription Plan</div>
                    <div className="text-sm font-medium">{tenant.plan}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
                <CardDescription>External services integration status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">NHS Digital</div>
                    <div className="text-sm font-medium">
                      <span className={`px-2 py-1 rounded text-xs ${tenant.nhsIntegrationEnabled ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {tenant.nhsIntegrationEnabled ? "ENABLED" : "DISABLED"}
                      </span>
                    </div>
                  </div>
                  {/* Additional integrations would go here */}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users for this tenant</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">User management functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
              <CardDescription>Manage tenant subscription and billing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Subscription management functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>View tenant usage metrics and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Usage statistics functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nhs-integration" className="space-y-4">
          <NhsDigitalIntegration tenantId={parseInt(tenantId)} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Settings</CardTitle>
              <CardDescription>Configure tenant-wide settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Tenant settings functionality will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}