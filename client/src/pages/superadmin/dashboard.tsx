import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { 
  Activity, 
  CheckCircle, 
  Clock, 
  Users, 
  DollarSign, 
  Building2, 
  Search,
  Filter
} from "lucide-react";
import { Link } from "wouter";

export default function SuperadminDashboard() {
  // Fetch dashboard data
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/superadmin/dashboard"],
    queryFn: () => ({
      // Mock data until API is implemented
      metrics: {
        activeTenants: 24,
        totalUsers: 1284,
        monthlyRevenue: 24350,
        systemStatus: "Healthy"
      },
      recentActivity: [
        { id: 1, type: "tenant_created", name: "New Medical Group", timestamp: new Date().toISOString() },
        { id: 2, type: "subscription_upgraded", name: "ComplexCare Medical Group", timestamp: new Date().toISOString() },
        { id: 3, type: "tenant_suspended", name: "HealthFirst Clinic", timestamp: new Date().toISOString() }
      ],
      tenants: [
        { id: 1, name: "ComplexCare Medical Group", subscription: "Enterprise", users: 128, lastActivity: "Just now", status: "Active" },
        { id: 2, name: "Ubercare Health Services", subscription: "Professional", users: 64, lastActivity: "5 minutes ago", status: "Active" },
        { id: 3, name: "MediCare Solutions", subscription: "Standard", users: 32, lastActivity: "1 hour ago", status: "Active" },
        { id: 4, name: "HealthFirst Clinic", subscription: "Professional", users: 48, lastActivity: "3 hours ago", status: "Active" }
      ]
    })
  });
  
  if (isLoading) {
    return <div className="p-8">Loading dashboard data...</div>;
  }
  
  if (error) {
    return <div className="p-8">Error loading dashboard data</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Superadmin Dashboard</h1>
          <p className="text-muted-foreground">System-wide administration and monitoring</p>
        </div>
        <Link href="/superadmin/tenants/new">
          <Button>
            <Building2 className="mr-2 h-4 w-4" />
            Add New Tenant
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.activeTenants}</div>
            <p className="text-xs text-muted-foreground">+2 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+43 this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{data.metrics.monthlyRevenue}</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.systemStatus}</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="tenant-activity" className="mb-8">
        <TabsList>
          <TabsTrigger value="tenant-activity">Tenant Activity</TabsTrigger>
          <TabsTrigger value="system-health">System Health</TabsTrigger>
          <TabsTrigger value="recent-alerts">Recent Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tenant-activity" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tenant Activity</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search tenants..." className="pl-8 w-[200px] md:w-[300px]" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 p-4 text-sm font-medium text-muted-foreground bg-muted">
                  <div>Tenant Name</div>
                  <div>Subscription</div>
                  <div>Users</div>
                  <div>Last Activity</div>
                  <div>Status</div>
                  <div className="text-right">Actions</div>
                </div>
                {data.tenants.map(tenant => (
                  <div key={tenant.id} className="grid grid-cols-6 p-4 items-center border-t">
                    <div className="font-medium">{tenant.name}</div>
                    <div>{tenant.subscription}</div>
                    <div>{tenant.users}</div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                      {tenant.lastActivity}
                    </div>
                    <div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs bg-green-50 text-green-700">
                        {tenant.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <Link href={`/superadmin/tenants/${tenant.id}`}>
                        <Button size="sm" variant="outline">View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system-health">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">API Response Time</div>
                    <div className="text-2xl font-bold">87ms</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-1/5" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Database Load</div>
                    <div className="text-2xl font-bold">32%</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-full w-1/3" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">Memory Usage</div>
                    <div className="text-2xl font-bold">45%</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full w-2/5" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">CPU Load</div>
                    <div className="text-2xl font-bold">28%</div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-1/4" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recent-alerts">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg bg-yellow-50 text-yellow-900">
                  <Activity className="h-6 w-6 mr-4" />
                  <div>
                    <div className="font-medium">Unusual Login Activity</div>
                    <div className="text-sm">Multiple failed login attempts detected for tenant "HealthFirst Clinic"</div>
                  </div>
                  <div className="ml-auto text-sm">2 hours ago</div>
                </div>
                
                <div className="flex items-center p-4 border rounded-lg">
                  <Activity className="h-6 w-6 mr-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Subscription Payment Failed</div>
                    <div className="text-sm">Payment method declined for tenant "MediCare Solutions"</div>
                  </div>
                  <div className="ml-auto text-sm">1 day ago</div>
                </div>
                
                <div className="flex items-center p-4 border rounded-lg">
                  <Activity className="h-6 w-6 mr-4 text-gray-500" />
                  <div>
                    <div className="font-medium">Database Backup Completed</div>
                    <div className="text-sm">Weekly database backup completed successfully</div>
                  </div>
                  <div className="ml-auto text-sm">2 days ago</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
