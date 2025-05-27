"use client"

import { useState } from "react"
import { Activity, AlertTriangle, ArrowRight, RefreshCw, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function MonitoringDashboardPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [timeRange, setTimeRange] = useState("24h")

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  // Sample monitoring data
  const monitoringSummary = {
    applications: {
      total: 200,
      healthy: 176,
      degraded: 18,
      critical: 6,
    },
    services: {
      total: 42,
      healthy: 38,
      degraded: 3,
      critical: 1,
    },
    infrastructure: {
      total: 156,
      healthy: 149,
      degraded: 5,
      critical: 2,
    },
    alerts: {
      total: 247,
      critical: 12,
      high: 35,
      medium: 98,
      low: 102,
    },
  }

  // Sample critical issues
  const criticalIssues = [
    {
      id: "ISSUE-001",
      title: "Payment API High Latency",
      service: "Payment Processing API",
      started: "2025-05-27T15:30:00Z",
      status: "critical",
      impact: "Customer payment processing delayed",
    },
    {
      id: "ISSUE-002",
      title: "Database Connection Pool Exhausted",
      service: "Account Database Cluster",
      started: "2025-05-27T16:15:00Z",
      status: "critical",
      impact: "Account lookup operations degraded",
    },
    {
      id: "ISSUE-003",
      title: "CDN Cache Hit Ratio Below Threshold",
      service: "Content Delivery Network",
      started: "2025-05-27T14:45:00Z",
      status: "degraded",
      impact: "Slower content loading for customers",
    },
    {
      id: "ISSUE-004",
      title: "Authentication Service High Error Rate",
      service: "Identity Provider",
      started: "2025-05-27T16:30:00Z",
      status: "critical",
      impact: "Intermittent login failures",
    },
  ]

  // Sample recent alerts
  const recentAlerts = [
    {
      id: "ALT-4567",
      title: "Database CPU Utilization > 90%",
      service: "Database Cluster",
      timestamp: "2025-05-27T16:30:00Z",
      severity: "critical",
    },
    {
      id: "ALT-4568",
      title: "API Error Rate > 5%",
      service: "Payment API",
      timestamp: "2025-05-27T16:32:00Z",
      severity: "high",
    },
    {
      id: "ALT-4569",
      title: "Memory Usage > 85%",
      service: "Authentication Service",
      timestamp: "2025-05-27T16:35:00Z",
      severity: "high",
    },
    {
      id: "ALT-4570",
      title: "CDN Cache Hit Ratio < 80%",
      service: "Content Delivery",
      timestamp: "2025-05-27T16:34:00Z",
      severity: "medium",
    },
    {
      id: "ALT-4571",
      title: "Database Connections > 85% of limit",
      service: "Account Database",
      timestamp: "2025-05-27T16:35:00Z",
      severity: "medium",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Healthy</Badge>
      case "degraded":
        return <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">Degraded</Badge>
      case "critical":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">Critical</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">Critical</Badge>
      case "high":
        return <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">High</Badge>
      case "medium":
        return <Badge className="bg-[#E6F2FF] text-[#006FCF] border-[#006FCF]">Medium</Badge>
      case "low":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Low</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Monitoring Dashboard</h1>
        <p className="text-muted-foreground">Real-time status of applications and services</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select defaultValue="24h" onValueChange={(value) => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last hour</SelectItem>
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
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
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-[#E6F9F1] bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#00A859]">Applications</CardTitle>
            <Server className="h-4 w-4 text-[#00A859]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00A859]">
              {monitoringSummary.applications.healthy} / {monitoringSummary.applications.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((monitoringSummary.applications.healthy / monitoringSummary.applications.total) * 100)}%
              healthy
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">
                {monitoringSummary.applications.critical} Critical
              </Badge>
              <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">
                {monitoringSummary.applications.degraded} Degraded
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E6F9F1] bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#00A859]">Services</CardTitle>
            <Activity className="h-4 w-4 text-[#00A859]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00A859]">
              {monitoringSummary.services.healthy} / {monitoringSummary.services.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((monitoringSummary.services.healthy / monitoringSummary.services.total) * 100)}% healthy
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">
                {monitoringSummary.services.critical} Critical
              </Badge>
              <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">
                {monitoringSummary.services.degraded} Degraded
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E6F9F1] bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#00A859]">Infrastructure</CardTitle>
            <Server className="h-4 w-4 text-[#00A859]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00A859]">
              {monitoringSummary.infrastructure.healthy} / {monitoringSummary.infrastructure.total}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((monitoringSummary.infrastructure.healthy / monitoringSummary.infrastructure.total) * 100)}%
              healthy
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">
                {monitoringSummary.infrastructure.critical} Critical
              </Badge>
              <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">
                {monitoringSummary.infrastructure.degraded} Degraded
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E6F2FF] bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#006FCF]">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#006FCF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#006FCF]">{monitoringSummary.alerts.total}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
            <div className="mt-4 flex items-center gap-2">
              <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">
                {monitoringSummary.alerts.critical} Critical
              </Badge>
              <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">
                {monitoringSummary.alerts.high} High
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Critical Issues</CardTitle>
                <CardDescription>Active issues requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criticalIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{issue.title}</h3>
                          {getStatusBadge(issue.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{issue.service}</p>
                        <p className="text-xs text-muted-foreground mt-1">Started: {formatDate(issue.started)}</p>
                        <p className="text-xs text-[#D5001F] mt-1">{issue.impact}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="shrink-0">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full gap-1">
                  View All Issues
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest monitoring alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{alert.title}</h3>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.service}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(alert.timestamp)}</p>
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
                  View All Alerts
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Health Overview</CardTitle>
              <CardDescription>Key performance metrics across all systems</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>System health dashboard would be displayed here</p>
                <p className="text-sm mt-2">Showing key metrics and trends</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Web Applications</CardTitle>
                  <CardDescription>Status of all monitored web applications</CardDescription>
                </div>
                <Button variant="outline" className="gap-1">
                  <Server className="h-4 w-4" />
                  View All Applications
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Applications monitoring dashboard would be displayed here</p>
                <p className="text-sm mt-2">Showing status of 200 monitored applications</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Services</CardTitle>
                  <CardDescription>Status of all monitored services</CardDescription>
                </div>
                <Button variant="outline" className="gap-1">
                  <Activity className="h-4 w-4" />
                  View All Services
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Services monitoring dashboard would be displayed here</p>
                <p className="text-sm mt-2">Showing status of all monitored services</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Infrastructure</CardTitle>
                  <CardDescription>Status of all infrastructure components</CardDescription>
                </div>
                <Button variant="outline" className="gap-1">
                  <Server className="h-4 w-4" />
                  View All Infrastructure
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Infrastructure monitoring dashboard would be displayed here</p>
                <p className="text-sm mt-2">Showing status of all infrastructure components</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
