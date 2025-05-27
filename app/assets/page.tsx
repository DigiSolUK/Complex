"use client"

import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Clock,
  ComputerIcon as Desktop,
  Download,
  Filter,
  HardDrive,
  Layers,
  Network,
  RefreshCw,
  Router,
  Search,
  Server,
  Settings,
  Smartphone,
  Terminal,
  Upload,
  Wifi,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AssetTable } from "@/components/asset-table"
import { AssetStatusChart } from "@/components/charts/asset-status-chart"
import { AssetTypeChart } from "@/components/charts/asset-type-chart"

export default function AssetManagementPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [assetType, setAssetType] = useState("all")
  const [assetStatus, setAssetStatus] = useState("all")

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  // Sample asset summary data
  const assetSummary = {
    total: 487,
    online: 432,
    offline: 23,
    warning: 32,
    types: {
      servers: 78,
      workstations: 215,
      network: 94,
      mobile: 62,
      other: 38,
    },
  }

  // Sample recent discoveries
  const recentDiscoveries = [
    {
      id: "ASSET-1245",
      name: "WEB-SERVER-04",
      type: "Server",
      ip: "192.168.1.45",
      discoveredAt: "2025-05-27T14:30:00Z",
      method: "Network Scan",
    },
    {
      id: "ASSET-1246",
      name: "FINANCE-PC-12",
      type: "Workstation",
      ip: "192.168.2.112",
      discoveredAt: "2025-05-27T15:15:00Z",
      method: "WMI",
    },
    {
      id: "ASSET-1247",
      name: "ROUTER-CORE-02",
      type: "Network",
      ip: "192.168.0.2",
      discoveredAt: "2025-05-27T15:45:00Z",
      method: "Syslog",
    },
    {
      id: "ASSET-1248",
      name: "SALES-LAPTOP-07",
      type: "Workstation",
      ip: "192.168.3.45",
      discoveredAt: "2025-05-27T16:10:00Z",
      method: "Manual",
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getAssetTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "server":
        return <Server className="h-4 w-4" />
      case "workstation":
        return <Desktop className="h-4 w-4" />
      case "network":
        return <Network className="h-4 w-4" />
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      default:
        return <HardDrive className="h-4 w-4" />
    }
  }

  return (
    <div className="container-responsive animate-fade-in">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-[#00175A]">Asset Management</h1>
          <p className="text-muted-foreground">Discover, monitor, and manage network assets</p>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search assets..."
                className="pl-9 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select defaultValue="all" onValueChange={setAssetType}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white">
                  <SelectValue placeholder="Asset Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="server">Servers</SelectItem>
                  <SelectItem value="workstation">Workstations</SelectItem>
                  <SelectItem value="network">Network Devices</SelectItem>
                  <SelectItem value="mobile">Mobile Devices</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all" onValueChange={setAssetStatus}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button className="bg-[#006FCF] hover:bg-[#00175A] text-white gap-1 w-full sm:w-auto">
              <Layers className="h-4 w-4" />
              New Discovery
            </Button>
            <Button variant="outline" className="gap-1 w-full sm:w-auto" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card className="card-enhanced border-[#E6F9F1]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#00A859]">Total Assets</CardTitle>
              <HardDrive className="h-4 w-4 text-[#00A859]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00A859]">{assetSummary.total}</div>
              <p className="text-xs text-muted-foreground">Discovered devices</p>
            </CardContent>
          </Card>

          <Card className="card-enhanced border-[#E6F9F1]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#00A859]">Online</CardTitle>
              <Activity className="h-4 w-4 text-[#00A859]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#00A859]">{assetSummary.online}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((assetSummary.online / assetSummary.total) * 100)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="card-enhanced border-[#FFEEF0]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#D5001F]">Offline</CardTitle>
              <AlertTriangle className="h-4 w-4 text-[#D5001F]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#D5001F]">{assetSummary.offline}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((assetSummary.offline / assetSummary.total) * 100)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="card-enhanced border-[#FFF4EC]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#FF6900]">Warning</CardTitle>
              <Clock className="h-4 w-4 text-[#FF6900]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#FF6900]">{assetSummary.warning}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((assetSummary.warning / assetSummary.total) * 100)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="card-enhanced border-[#E6F2FF]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#006FCF]">Servers</CardTitle>
              <Server className="h-4 w-4 text-[#006FCF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#006FCF]">{assetSummary.types.servers}</div>
              <p className="text-xs text-muted-foreground">
                {Math.round((assetSummary.types.servers / assetSummary.total) * 100)}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="discovery">Discovery</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="remote">Remote Access</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="card-enhanced col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Asset Inventory</CardTitle>
                      <CardDescription>Complete list of discovered assets</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Filter className="h-4 w-4" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <AssetTable />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Assets by Status</CardTitle>
                  <CardDescription>Distribution of asset status</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <AssetStatusChart />
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Assets by Type</CardTitle>
                  <CardDescription>Distribution of asset types</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <AssetTypeChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="discovery" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Discovery Methods</CardTitle>
                  <CardDescription>Configure asset discovery methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Network className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Network Range Scan</h3>
                          <p className="text-sm text-muted-foreground">Scan IP ranges for active devices</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#006FCF] hover:bg-[#00175A]">
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Wifi className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">WMI Discovery</h3>
                          <p className="text-sm text-muted-foreground">Windows Management Instrumentation</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#006FCF] hover:bg-[#00175A]">
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Terminal className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Syslog Receiver</h3>
                          <p className="text-sm text-muted-foreground">Collect syslog messages from devices</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#006FCF] hover:bg-[#00175A]">
                        Configure
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Upload className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Manual Input</h3>
                          <p className="text-sm text-muted-foreground">Manually add assets by hostname or IP</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#006FCF] hover:bg-[#00175A]">
                        Add Asset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle>Recent Discoveries</CardTitle>
                  <CardDescription>Recently discovered assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentDiscoveries.map((discovery) => (
                      <div
                        key={discovery.id}
                        className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-[#E6F2FF]">{getAssetTypeIcon(discovery.type)}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{discovery.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {discovery.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{discovery.ip}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground">
                                Discovered: {formatDate(discovery.discoveredAt)}
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                {discovery.method}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="shrink-0">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    View All Discoveries
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Discovery Schedule</CardTitle>
                <CardDescription>Scheduled asset discovery tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-card">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Clock className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Network Range Scan</h3>
                          <p className="text-sm text-muted-foreground">192.168.1.0/24, 192.168.2.0/24</p>
                        </div>
                      </div>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Daily at 2:00 AM</Badge>
                    </div>
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Clock className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">WMI Discovery</h3>
                          <p className="text-sm text-muted-foreground">Domain workstations and servers</p>
                        </div>
                      </div>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">
                        Weekly on Sunday at 3:00 AM
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Clock className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Syslog Receiver</h3>
                          <p className="text-sm text-muted-foreground">Continuous monitoring</p>
                        </div>
                      </div>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Always Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" className="gap-1">
                  <Settings className="h-4 w-4" />
                  Configure Schedule
                </Button>
                <Button size="sm" className="bg-[#006FCF] hover:bg-[#00175A] gap-1">
                  <Layers className="h-4 w-4" />
                  Run Discovery Now
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Asset Monitoring</CardTitle>
                    <CardDescription>Performance and health monitoring</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Settings className="h-4 w-4" />
                    Configure Monitoring
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Activity className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Performance Monitoring</h3>
                          <p className="text-sm text-muted-foreground">CPU, memory, disk, and network usage</p>
                        </div>
                      </div>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Active</Badge>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <AlertTriangle className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Availability Monitoring</h3>
                          <p className="text-sm text-muted-foreground">Ping, port checks, and service availability</p>
                        </div>
                      </div>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Active</Badge>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <HardDrive className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Hardware Health</h3>
                          <p className="text-sm text-muted-foreground">Temperature, fan status, and hardware errors</p>
                        </div>
                      </div>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Active</Badge>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Terminal className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Log Monitoring</h3>
                          <p className="text-sm text-muted-foreground">Event logs, syslog, and application logs</p>
                        </div>
                      </div>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Monitoring Dashboard</CardTitle>
                <CardDescription>Real-time asset performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>Asset monitoring dashboard would be displayed here</p>
                  <p className="text-sm mt-2">Showing performance metrics and health status</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="remote" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Remote Access</CardTitle>
                    <CardDescription>Securely access and manage remote assets</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Settings className="h-4 w-4" />
                    Configure Access
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Desktop className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Remote Desktop (RDP)</h3>
                          <p className="text-sm text-muted-foreground">Connect to Windows workstations and servers</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#006FCF] hover:bg-[#00175A]">
                        Launch
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Terminal className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Secure Shell (SSH)</h3>
                          <p className="text-sm text-muted-foreground">Connect to Linux servers and network devices</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#006FCF] hover:bg-[#00175A]">
                        Launch
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Settings className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Remote Management</h3>
                          <p className="text-sm text-muted-foreground">Execute commands and scripts remotely</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#006FCF] hover:bg-[#00175A]">
                        Launch
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Router className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Web Console</h3>
                          <p className="text-sm text-muted-foreground">Access web-based management interfaces</p>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#006FCF] hover:bg-[#00175A]">
                        Launch
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Remote Session History</CardTitle>
                <CardDescription>Recent remote access sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-card">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Desktop className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">WEB-SERVER-04</h3>
                          <p className="text-sm text-muted-foreground">RDP Session by admin</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">Today, 2:30 PM</div>
                    </div>
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Terminal className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">DB-SERVER-01</h3>
                          <p className="text-sm text-muted-foreground">SSH Session by sysadmin</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">Today, 1:15 PM</div>
                    </div>
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Settings className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">ROUTER-CORE-02</h3>
                          <p className="text-sm text-muted-foreground">Remote Management by netadmin</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">Yesterday, 4:45 PM</div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Desktop className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">FINANCE-PC-12</h3>
                          <p className="text-sm text-muted-foreground">RDP Session by helpdesk</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">Yesterday, 2:10 PM</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full gap-1">
                  View Full Session History
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
