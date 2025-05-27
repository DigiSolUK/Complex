"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  ComputerIcon as Desktop,
  Download,
  HardDrive,
  History,
  Info,
  Layers,
  Network,
  RefreshCw,
  Server,
  Settings,
  Terminal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  // Sample asset data (in a real app, this would be fetched based on the ID)
  const asset = {
    id: params.id || "ASSET-1001",
    name: "WEB-SERVER-01",
    type: "Server",
    ip: "192.168.1.10",
    mac: "00:1A:2B:3C:4D:5E",
    os: "Windows Server 2022",
    status: "online",
    lastSeen: "2025-05-27T16:30:00Z",
    discoveredAt: "2025-01-15T09:30:00Z",
    discoveryMethod: "Network Scan",
    location: "Main Data Center",
    department: "IT",
    owner: "System Administration Team",
    description: "Primary web server hosting the company website and internal applications.",
    specs: {
      cpu: "Intel Xeon E5-2680 v4 @ 2.40GHz (8 cores, 16 threads)",
      memory: "64GB DDR4",
      storage: [
        { name: "C:", total: 500, used: 125 },
        { name: "D:", total: 2000, used: 850 },
      ],
      network: [{ name: "Ethernet", speed: "1 Gbps", ip: "192.168.1.10", mac: "00:1A:2B:3C:4D:5E" }],
    },
    performance: {
      cpu: 35,
      memory: 42,
      disk: 28,
      network: 15,
    },
    services: [
      { name: "HTTP", port: 80, status: "running" },
      { name: "HTTPS", port: 443, status: "running" },
      { name: "SQL Server", port: 1433, status: "running" },
      { name: "Remote Desktop", port: 3389, status: "stopped" },
    ],
    software: [
      { name: "Windows Server 2022", version: "21H2", installDate: "2025-01-15" },
      { name: "IIS Web Server", version: "10.0", installDate: "2025-01-16" },
      { name: "SQL Server 2022", version: "16.0", installDate: "2025-01-16" },
      { name: ".NET Framework", version: "4.8", installDate: "2025-01-15" },
      { name: "Microsoft Visual C++ Redistributable", version: "14.32", installDate: "2025-01-15" },
    ],
    updates: {
      total: 12,
      critical: 0,
      important: 2,
      optional: 10,
      lastUpdated: "2025-05-25T03:15:00Z",
    },
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getAssetTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "server":
        return <Server className="h-5 w-5" />
      case "workstation":
        return <Desktop className="h-5 w-5" />
      case "network":
        return <Network className="h-5 w-5" />
      default:
        return <HardDrive className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Online</Badge>
      case "offline":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">Offline</Badge>
      case "warning":
        return <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">Warning</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getServiceStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Running</Badge>
      case "stopped":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">Stopped</Badge>
      case "warning":
        return <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">Warning</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container-responsive animate-fade-in">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/assets" className="flex items-center gap-1 hover:text-[#006FCF]">
              <ArrowLeft className="h-4 w-4" />
              Back to Assets
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span>Asset Details</span>
            <ChevronRight className="h-4 w-4" />
            <span>{asset.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-[#E6F2FF]">{getAssetTypeIcon(asset.type)}</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#00175A]">{asset.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{asset.type}</Badge>
                  {getStatusBadge(asset.status)}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" className="gap-1" onClick={handleRefresh} disabled={refreshing}>
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
              <Button variant="outline" className="gap-1">
                <Desktop className="h-4 w-4" />
                Remote Desktop
              </Button>
              <Button variant="outline" className="gap-1">
                <Terminal className="h-4 w-4" />
                SSH
              </Button>
              <Button className="bg-[#006FCF] hover:bg-[#00175A] text-white gap-1">
                <Settings className="h-4 w-4" />
                Manage
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="card-enhanced md:col-span-2">
            <CardHeader>
              <CardTitle>Asset Information</CardTitle>
              <CardDescription>Detailed information about this asset</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                  <p>{asset.ip}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">MAC Address</p>
                  <p>{asset.mac}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Operating System</p>
                  <p>{asset.os}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Last Seen</p>
                  <p>{formatDate(asset.lastSeen)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Discovered</p>
                  <p>{formatDate(asset.discoveredAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Discovery Method</p>
                  <p>{asset.discoveryMethod}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p>{asset.location}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Department</p>
                  <p>{asset.department}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Owner</p>
                  <p>{asset.owner}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{asset.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-enhanced">
            <CardHeader>
              <CardTitle>Performance</CardTitle>
              <CardDescription>Current resource utilization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">CPU Usage</p>
                  <p className="text-sm font-medium">{asset.performance.cpu}%</p>
                </div>
                <Progress value={asset.performance.cpu} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Memory Usage</p>
                  <p className="text-sm font-medium">{asset.performance.memory}%</p>
                </div>
                <Progress value={asset.performance.memory} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Disk Usage</p>
                  <p className="text-sm font-medium">{asset.performance.disk}%</p>
                </div>
                <Progress value={asset.performance.disk} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Network Usage</p>
                  <p className="text-sm font-medium">{asset.performance.network}%</p>
                </div>
                <Progress value={asset.performance.network} className="h-2" />
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full gap-1">
                <Activity className="h-4 w-4" />
                View Performance History
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="hardware" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:w-[800px]">
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
            <TabsTrigger value="software">Software</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="hardware" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Hardware Specifications</CardTitle>
                <CardDescription>Detailed hardware information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">System</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">CPU</p>
                        <p className="text-sm">{asset.specs.cpu}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Memory</p>
                        <p className="text-sm">{asset.specs.memory}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Storage</h3>
                    <div className="space-y-4">
                      {asset.specs.storage.map((drive, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {drive.name} Drive ({drive.total} GB)
                            </p>
                            <p className="text-sm font-medium">{Math.round((drive.used / drive.total) * 100)}% Used</p>
                          </div>
                          <Progress value={(drive.used / drive.total) * 100} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {drive.used} GB used of {drive.total} GB
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Network Interfaces</h3>
                    <div className="space-y-4">
                      {asset.specs.network.map((interface_, index) => (
                        <div key={index} className="rounded-lg border p-4 bg-white">
                          <div className="flex items-center gap-2 mb-2">
                            <Network className="h-4 w-4 text-[#006FCF]" />
                            <h4 className="font-medium">{interface_.name}</h4>
                            <Badge variant="outline">{interface_.speed}</Badge>
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">IP Address</p>
                              <p className="text-sm">{interface_.ip}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">MAC Address</p>
                              <p className="text-sm">{interface_.mac}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="software" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Installed Software</CardTitle>
                    <CardDescription>Software installed on this asset</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Export List
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-card">
                  <div className="flex flex-col">
                    {asset.software.map((software, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 ${index < asset.software.length - 1 ? "border-b" : ""}`}
                      >
                        <div>
                          <h3 className="font-medium">{software.name}</h3>
                          <p className="text-sm text-muted-foreground">Version: {software.version}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">Installed: {software.installDate}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Running Services</CardTitle>
                    <CardDescription>Services and ports</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    <RefreshCw className="h-4 w-4" />
                    Refresh Services
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-card">
                  <div className="flex flex-col">
                    {asset.services.map((service, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 ${index < asset.services.length - 1 ? "border-b" : ""}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-[#E6F2FF]">
                            <Layers className="h-4 w-4 text-[#006FCF]" />
                          </div>
                          <div>
                            <h3 className="font-medium">{service.name}</h3>
                            <p className="text-sm text-muted-foreground">Port: {service.port}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getServiceStatusBadge(service.status)}
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>System Updates</CardTitle>
                    <CardDescription>Update status and history</CardDescription>
                  </div>
                  <Button className="bg-[#006FCF] hover:bg-[#00175A] text-white gap-1">
                    <Download className="h-4 w-4" />
                    Check for Updates
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-4">
                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-2 rounded-full bg-[#E6F2FF] mb-2">
                        <Info className="h-5 w-5 text-[#006FCF]" />
                      </div>
                      <p className="text-2xl font-bold">{asset.updates.total}</p>
                      <p className="text-sm text-muted-foreground">Total Updates</p>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-2 rounded-full bg-[#FFEEF0] mb-2">
                        <AlertTriangle className="h-5 w-5 text-[#D5001F]" />
                      </div>
                      <p className="text-2xl font-bold">{asset.updates.critical}</p>
                      <p className="text-sm text-muted-foreground">Critical Updates</p>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-2 rounded-full bg-[#FFF4EC] mb-2">
                        <Info className="h-5 w-5 text-[#FF6900]" />
                      </div>
                      <p className="text-2xl font-bold">{asset.updates.important}</p>
                      <p className="text-sm text-muted-foreground">Important Updates</p>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 bg-white">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-2 rounded-full bg-[#E6F9F1] mb-2">
                        <Info className="h-5 w-5 text-[#00A859]" />
                      </div>
                      <p className="text-2xl font-bold">{asset.updates.optional}</p>
                      <p className="text-sm text-muted-foreground">Optional Updates</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground">
                    Last checked for updates: {formatDate(asset.updates.lastUpdated)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Asset History</CardTitle>
                <CardDescription>Activity and change history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 border-l">
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute -left-10 mt-1.5 h-4 w-4 rounded-full bg-[#006FCF]"></div>
                      <div>
                        <p className="font-medium">System Update Installed</p>
                        <p className="text-sm text-muted-foreground">May 25, 2025 at 3:15 AM</p>
                        <p className="text-sm mt-1">Installed 5 security updates</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-10 mt-1.5 h-4 w-4 rounded-full bg-[#006FCF]"></div>
                      <div>
                        <p className="font-medium">Remote Session</p>
                        <p className="text-sm text-muted-foreground">May 24, 2025 at 2:30 PM</p>
                        <p className="text-sm mt-1">Remote desktop session by admin</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-10 mt-1.5 h-4 w-4 rounded-full bg-[#006FCF]"></div>
                      <div>
                        <p className="font-medium">Configuration Changed</p>
                        <p className="text-sm text-muted-foreground">May 23, 2025 at 11:45 AM</p>
                        <p className="text-sm mt-1">IIS Web Server configuration updated</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-10 mt-1.5 h-4 w-4 rounded-full bg-[#006FCF]"></div>
                      <div>
                        <p className="font-medium">Software Installed</p>
                        <p className="text-sm text-muted-foreground">May 20, 2025 at 9:30 AM</p>
                        <p className="text-sm mt-1">Installed SQL Server 2022 Service Pack 1</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-10 mt-1.5 h-4 w-4 rounded-full bg-[#006FCF]"></div>
                      <div>
                        <p className="font-medium">Asset Discovered</p>
                        <p className="text-sm text-muted-foreground">January 15, 2025 at 9:30 AM</p>
                        <p className="text-sm mt-1">Asset discovered via Network Scan</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full gap-1">
                  <History className="h-4 w-4" />
                  View Full History
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
