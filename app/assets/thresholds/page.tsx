"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PlusCircle,
  RefreshCw,
  Bell,
  Server,
  Network,
  Laptop,
  Database,
  HardDrive,
  Cpu,
  Thermometer,
  Activity,
} from "lucide-react"

export default function AssetThresholdsPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [thresholdName, setThresholdName] = useState("")
  const [assetType, setAssetType] = useState("server")
  const [metricType, setMetricType] = useState("cpu")
  const [warningThreshold, setWarningThreshold] = useState(70)
  const [criticalThreshold, setCriticalThreshold] = useState(90)
  const [enabled, setEnabled] = useState(true)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  const resetForm = () => {
    setThresholdName("")
    setAssetType("server")
    setMetricType("cpu")
    setWarningThreshold(70)
    setCriticalThreshold(90)
    setEnabled(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the threshold
    setDialogOpen(false)
    resetForm()
  }

  // Sample thresholds data
  const thresholds = [
    {
      id: "threshold-001",
      name: "Server CPU Usage",
      assetType: "server",
      metricType: "cpu",
      warningThreshold: 70,
      criticalThreshold: 90,
      enabled: true,
      lastTriggered: "2025-05-25T10:30:00Z",
      status: "normal",
    },
    {
      id: "threshold-002",
      name: "Server Memory Usage",
      assetType: "server",
      metricType: "memory",
      warningThreshold: 80,
      criticalThreshold: 95,
      enabled: true,
      lastTriggered: "2025-05-24T14:15:00Z",
      status: "warning",
    },
    {
      id: "threshold-003",
      name: "Server Disk Space",
      assetType: "server",
      metricType: "disk",
      warningThreshold: 85,
      criticalThreshold: 95,
      enabled: true,
      lastTriggered: "2025-05-23T09:45:00Z",
      status: "critical",
    },
    {
      id: "threshold-004",
      name: "Network Device CPU",
      assetType: "network",
      metricType: "cpu",
      warningThreshold: 60,
      criticalThreshold: 80,
      enabled: true,
      lastTriggered: "2025-05-20T16:30:00Z",
      status: "normal",
    },
    {
      id: "threshold-005",
      name: "Database Server Load",
      assetType: "database",
      metricType: "load",
      warningThreshold: 75,
      criticalThreshold: 90,
      enabled: true,
      lastTriggered: "2025-05-18T11:20:00Z",
      status: "warning",
    },
    {
      id: "threshold-006",
      name: "Workstation Disk Space",
      assetType: "workstation",
      metricType: "disk",
      warningThreshold: 90,
      criticalThreshold: 95,
      enabled: false,
      lastTriggered: null,
      status: "disabled",
    },
  ]

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
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
    switch (type) {
      case "server":
        return <Server className="h-4 w-4 text-[#006FCF]" />
      case "workstation":
        return <Laptop className="h-4 w-4 text-[#006FCF]" />
      case "network":
        return <Network className="h-4 w-4 text-[#006FCF]" />
      case "database":
        return <Database className="h-4 w-4 text-[#006FCF]" />
      default:
        return <HardDrive className="h-4 w-4 text-[#006FCF]" />
    }
  }

  const getMetricTypeIcon = (type: string) => {
    switch (type) {
      case "cpu":
        return <Cpu className="h-4 w-4 text-[#006FCF]" />
      case "memory":
        return <Activity className="h-4 w-4 text-[#006FCF]" />
      case "disk":
        return <HardDrive className="h-4 w-4 text-[#006FCF]" />
      case "temperature":
        return <Thermometer className="h-4 w-4 text-[#006FCF]" />
      case "load":
        return <Activity className="h-4 w-4 text-[#006FCF]" />
      default:
        return <Activity className="h-4 w-4 text-[#006FCF]" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Normal</Badge>
      case "warning":
        return <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">Warning</Badge>
      case "critical":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">Critical</Badge>
      case "disabled":
        return <Badge className="bg-gray-100 text-gray-500 border-gray-500">Disabled</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#006FCF]">Monitoring Thresholds</h1>
          <p className="text-muted-foreground">Configure thresholds for asset monitoring alerts</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-[#006FCF] text-[#006FCF]"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#006FCF] hover:bg-[#004F93]">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Threshold
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Threshold</DialogTitle>
                <DialogDescription>Configure a new monitoring threshold for assets</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="threshold-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="threshold-name"
                      value={thresholdName}
                      onChange={(e) => setThresholdName(e.target.value)}
                      className="col-span-3"
                      placeholder="Server CPU Usage"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="asset-type" className="text-right">
                      Asset Type
                    </Label>
                    <Select value={assetType} onValueChange={setAssetType}>
                      <SelectTrigger id="asset-type" className="col-span-3">
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="server">Server</SelectItem>
                        <SelectItem value="workstation">Workstation</SelectItem>
                        <SelectItem value="network">Network Device</SelectItem>
                        <SelectItem value="database">Database Server</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="metric-type" className="text-right">
                      Metric
                    </Label>
                    <Select value={metricType} onValueChange={setMetricType}>
                      <SelectTrigger id="metric-type" className="col-span-3">
                        <SelectValue placeholder="Select metric type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cpu">CPU Usage</SelectItem>
                        <SelectItem value="memory">Memory Usage</SelectItem>
                        <SelectItem value="disk">Disk Space</SelectItem>
                        <SelectItem value="temperature">Temperature</SelectItem>
                        <SelectItem value="load">System Load</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="warning-threshold" className="text-right">
                      Warning at
                    </Label>
                    <div className="col-span-3 flex items-center gap-4">
                      <Slider
                        id="warning-threshold"
                        value={[warningThreshold]}
                        onValueChange={(value) => setWarningThreshold(value[0])}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-right font-medium">{warningThreshold}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="critical-threshold" className="text-right">
                      Critical at
                    </Label>
                    <div className="col-span-3 flex items-center gap-4">
                      <Slider
                        id="critical-threshold"
                        value={[criticalThreshold]}
                        onValueChange={(value) => setCriticalThreshold(value[0])}
                        max={100}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-12 text-right font-medium">{criticalThreshold}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="enabled" className="text-right">
                      Enabled
                    </Label>
                    <div className="flex items-center gap-2 col-span-3">
                      <Switch id="enabled" checked={enabled} onCheckedChange={setEnabled} />
                      <span>{enabled ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#006FCF] hover:bg-[#004F93]">
                    <Bell className="mr-2 h-4 w-4" />
                    Save Threshold
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="server">Servers</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="workstation">Workstations</TabsTrigger>
          <TabsTrigger value="database">Databases</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Thresholds</CardTitle>
              <CardDescription>View and manage all monitoring thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Asset Type</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead>Warning</TableHead>
                    <TableHead>Critical</TableHead>
                    <TableHead>Last Triggered</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {thresholds.map((threshold) => (
                    <TableRow key={threshold.id}>
                      <TableCell className="font-medium">{threshold.name}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {getAssetTypeIcon(threshold.assetType)}
                        <span className="capitalize">{threshold.assetType}</span>
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        {getMetricTypeIcon(threshold.metricType)}
                        <span className="capitalize">{threshold.metricType}</span>
                      </TableCell>
                      <TableCell>{threshold.warningThreshold}%</TableCell>
                      <TableCell>{threshold.criticalThreshold}%</TableCell>
                      <TableCell>{formatDate(threshold.lastTriggered)}</TableCell>
                      <TableCell>{getStatusBadge(threshold.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {["server", "network", "workstation", "database"].map((type) => (
          <TabsContent key={type} value={type}>
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{type} Thresholds</CardTitle>
                <CardDescription>View and manage {type} monitoring thresholds</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Metric</TableHead>
                      <TableHead>Warning</TableHead>
                      <TableHead>Critical</TableHead>
                      <TableHead>Last Triggered</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {thresholds
                      .filter((threshold) => threshold.assetType === type)
                      .map((threshold) => (
                        <TableRow key={threshold.id}>
                          <TableCell className="font-medium">{threshold.name}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            {getMetricTypeIcon(threshold.metricType)}
                            <span className="capitalize">{threshold.metricType}</span>
                          </TableCell>
                          <TableCell>{threshold.warningThreshold}%</TableCell>
                          <TableCell>{threshold.criticalThreshold}%</TableCell>
                          <TableCell>{formatDate(threshold.lastTriggered)}</TableCell>
                          <TableCell>{getStatusBadge(threshold.status)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
