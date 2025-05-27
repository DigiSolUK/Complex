"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  Download,
  Layers,
  Network,
  Plus,
  RefreshCw,
  Save,
  Terminal,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AssetDiscoveryPage() {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
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
            <span>Asset Discovery</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#00175A]">Asset Discovery</h1>
              <p className="text-muted-foreground">Configure and manage asset discovery methods</p>
            </div>
            <div className="flex items-center gap-2">
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
              <Button className="bg-[#006FCF] hover:bg-[#00175A] text-white gap-1">
                <Layers className="h-4 w-4" />
                Run Discovery Now
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="network" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="network">Network Scan</TabsTrigger>
            <TabsTrigger value="wmi">WMI</TabsTrigger>
            <TabsTrigger value="syslog">Syslog</TabsTrigger>
            <TabsTrigger value="manual">Manual Input</TabsTrigger>
          </TabsList>

          <TabsContent value="network" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Network Range Scan</CardTitle>
                    <CardDescription>Discover assets by scanning IP ranges</CardDescription>
                  </div>
                  <Switch id="network-scan-enabled" defaultChecked />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="ip-ranges">IP Ranges (CIDR notation)</Label>
                      <Input
                        id="ip-ranges"
                        placeholder="e.g. 192.168.1.0/24"
                        defaultValue="192.168.1.0/24, 192.168.2.0/24"
                      />
                      <p className="text-xs text-muted-foreground">Enter multiple ranges separated by commas</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scan-frequency">Scan Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger id="scan-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scan-time">Scan Time</Label>
                      <Input id="scan-time" type="time" defaultValue="02:00" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="scan-timeout">Scan Timeout (seconds)</Label>
                      <Input id="scan-timeout" type="number" defaultValue="5" min="1" max="60" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scan-retries">Retries</Label>
                      <Input id="scan-retries" type="number" defaultValue="3" min="0" max="10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scan-ports">Ports to Scan</Label>
                      <Input id="scan-ports" placeholder="e.g. 22,80,443" defaultValue="22,80,443,3389,5985,5986" />
                      <p className="text-xs text-muted-foreground">Enter multiple ports separated by commas</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="scan-os-detection">OS Detection</Label>
                      <p className="text-xs text-muted-foreground">Attempt to detect operating system</p>
                    </div>
                    <Switch id="scan-os-detection" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="scan-service-detection">Service Detection</Label>
                      <p className="text-xs text-muted-foreground">Attempt to detect running services</p>
                    </div>
                    <Switch id="scan-service-detection" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="scan-hostname-resolution">Hostname Resolution</Label>
                      <p className="text-xs text-muted-foreground">Resolve hostnames for discovered IPs</p>
                    </div>
                    <Switch id="scan-hostname-resolution" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[#006FCF] hover:bg-[#00175A] text-white gap-1">
                  <Save className="h-4 w-4" />
                  Save Configuration
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Network Scan History</CardTitle>
                <CardDescription>Recent network discovery scans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-card">
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Network className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Full Network Scan</h3>
                          <p className="text-sm text-muted-foreground">192.168.1.0/24, 192.168.2.0/24</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Completed</Badge>
                        <p className="text-sm text-muted-foreground mt-1">Today, 2:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Network className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Full Network Scan</h3>
                          <p className="text-sm text-muted-foreground">192.168.1.0/24, 192.168.2.0/24</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Completed</Badge>
                        <p className="text-sm text-muted-foreground mt-1">Yesterday, 2:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Network className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Manual Network Scan</h3>
                          <p className="text-sm text-muted-foreground">192.168.1.0/24</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Completed</Badge>
                        <p className="text-sm text-muted-foreground mt-1">May 25, 2025, 3:45 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-md bg-[#E6F2FF]">
                          <Network className="h-5 w-5 text-[#006FCF]" />
                        </div>
                        <div>
                          <h3 className="font-medium">Full Network Scan</h3>
                          <p className="text-sm text-muted-foreground">192.168.1.0/24, 192.168.2.0/24</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Completed</Badge>
                        <p className="text-sm text-muted-foreground mt-1">May 24, 2025, 2:00 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full gap-1">
                  <Download className="h-4 w-4" />
                  Export Scan History
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="wmi" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>WMI Discovery</CardTitle>
                    <CardDescription>Discover Windows assets using WMI</CardDescription>
                  </div>
                  <Switch id="wmi-enabled" defaultChecked />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="wmi-domain">Domain</Label>
                      <Input id="wmi-domain" placeholder="e.g. company.local" defaultValue="amex.local" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wmi-username">Username</Label>
                      <Input id="wmi-username" placeholder="Domain Administrator" defaultValue="wmi-discovery" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wmi-password">Password</Label>
                      <Input id="wmi-password" type="password" value="••••••••••••" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="wmi-frequency">Scan Frequency</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger id="wmi-frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wmi-day">Day of Week</Label>
                      <Select defaultValue="sunday">
                        <SelectTrigger id="wmi-day">
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sunday">Sunday</SelectItem>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                          <SelectItem value="saturday">Saturday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wmi-time">Scan Time</Label>
                      <Input id="wmi-time" type="time" defaultValue="03:00" />
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="wmi-hardware">Hardware Information</Label>
                      <p className="text-xs text-muted-foreground">Collect hardware details</p>
                    </div>
                    <Switch id="wmi-hardware" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="wmi-software">Software Information</Label>
                      <p className="text-xs text-muted-foreground">Collect installed software details</p>
                    </div>
                    <Switch id="wmi-software" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="wmi-services">Services Information</Label>
                      <p className="text-xs text-muted-foreground">Collect running services details</p>
                    </div>
                    <Switch id="wmi-services" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="wmi-updates">Updates Information</Label>
                      <p className="text-xs text-muted-foreground">Collect installed updates details</p>
                    </div>
                    <Switch id="wmi-updates" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[#006FCF] hover:bg-[#00175A] text-white gap-1">
                  <Save className="h-4 w-4" />
                  Save Configuration
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="syslog" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Syslog Receiver</CardTitle>
                    <CardDescription>Discover assets via syslog messages</CardDescription>
                  </div>
                  <Switch id="syslog-enabled" defaultChecked />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="syslog-port">Syslog Port</Label>
                      <Input id="syslog-port" type="number" defaultValue="514" min="1" max="65535" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="syslog-protocol">Protocol</Label>
                      <Select defaultValue="udp">
                        <SelectTrigger id="syslog-protocol">
                          <SelectValue placeholder="Select protocol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="udp">UDP</SelectItem>
                          <SelectItem value="tcp">TCP</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="syslog-facility">Facility Filter</Label>
                      <Input id="syslog-facility" placeholder="e.g. kern,user,daemon" defaultValue="*" />
                      <p className="text-xs text-muted-foreground">
                        Enter * for all facilities or comma-separated list
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="syslog-severity">Severity Filter</Label>
                      <Select defaultValue="all">
                        <SelectTrigger id="syslog-severity">
                          <SelectValue placeholder="Select minimum severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Severities</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="alert">Alert</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="error">Error</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="notice">Notice</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="debug">Debug</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="syslog-auto-discovery">Automatic Asset Discovery</Label>
                      <p className="text-xs text-muted-foreground">Automatically add new assets from syslog messages</p>
                    </div>
                    <Switch id="syslog-auto-discovery" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="syslog-enrichment">Asset Data Enrichment</Label>
                      <p className="text-xs text-muted-foreground">Enrich asset data from syslog messages</p>
                    </div>
                    <Switch id="syslog-enrichment" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[#006FCF] hover:bg-[#00175A] text-white gap-1">
                  <Save className="h-4 w-4" />
                  Save Configuration
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Syslog Status</CardTitle>
                <CardDescription>Current syslog receiver status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-[#E6F9F1]">
                        <Terminal className="h-5 w-5 text-[#00A859]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">Syslog Receiver</h3>
                          <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Active</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Listening on UDP/TCP port 514</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">247,892</p>
                      <p className="text-sm text-muted-foreground">Messages received today</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual" className="space-y-6">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Manual Asset Input</CardTitle>
                <CardDescription>Manually add assets to inventory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="asset-name">Asset Name</Label>
                      <Input id="asset-name" placeholder="e.g. WEB-SERVER-01" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asset-type">Asset Type</Label>
                      <Select>
                        <SelectTrigger id="asset-type">
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="server">Server</SelectItem>
                          <SelectItem value="workstation">Workstation</SelectItem>
                          <SelectItem value="network">Network Device</SelectItem>
                          <SelectItem value="mobile">Mobile Device</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asset-ip">IP Address</Label>
                      <Input id="asset-ip" placeholder="e.g. 192.168.1.10" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asset-mac">MAC Address (optional)</Label>
                      <Input id="asset-mac" placeholder="e.g. 00:1A:2B:3C:4D:5E" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="asset-os">Operating System (optional)</Label>
                      <Input id="asset-os" placeholder="e.g. Windows Server 2022" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asset-location">Location (optional)</Label>
                      <Input id="asset-location" placeholder="e.g. Main Data Center" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asset-department">Department (optional)</Label>
                      <Input id="asset-department" placeholder="e.g. IT" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="asset-description">Description (optional)</Label>
                      <Input id="asset-description" placeholder="e.g. Primary web server" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-[#006FCF] hover:bg-[#00175A] text-white gap-1">
                  <Plus className="h-4 w-4" />
                  Add Asset
                </Button>
              </CardFooter>
            </Card>

            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Bulk Import</CardTitle>
                <CardDescription>Import multiple assets from CSV file</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center">
                    <div className="p-3 rounded-full bg-[#E6F2FF] mb-4">
                      <Upload className="h-6 w-6 text-[#006FCF]" />
                    </div>
                    <h3 className="text-lg font-semibold">Upload CSV File</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drag and drop your CSV file here, or click to browse
                    </p>
                    <Button variant="outline" className="gap-1">
                      <Upload className="h-4 w-4" />
                      Browse Files
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">CSV Format Requirements</h3>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                    <li>First row must contain column headers</li>
                    <li>Required columns: name, type, ip_address</li>
                    <li>Optional columns: mac_address, os, location, department, description</li>
                    <li>Valid asset types: server, workstation, network, mobile, other</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>
                <Button className="bg-[#006FCF] hover:bg-[#00175A] text-white gap-1">
                  <Upload className="h-4 w-4" />
                  Import Assets
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
