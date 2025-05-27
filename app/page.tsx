"use client"

import { useState } from "react"
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BrainCircuit,
  Clock,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import IncidentTable from "@/components/incident-table"
import IncidentTrendChart from "@/components/charts/incident-trend-chart"
import IncidentsByServiceChart from "@/components/charts/incidents-by-service-chart"
import OnCallSchedule from "@/components/on-call-schedule"
import AIMonitoringInsights from "@/components/ai-monitoring-insights"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("24h")

  // Enhanced metrics with trends
  const metrics = {
    activeIncidents: {
      value: 12,
      trend: -25,
      trendDirection: "down",
      status: "improving",
    },
    mttr: {
      value: "15m",
      trend: -18,
      trendDirection: "down",
      status: "improving",
    },
    uptime: {
      value: 99.98,
      trend: 0.02,
      trendDirection: "up",
      status: "stable",
    },
    alertsToday: {
      value: 247,
      trend: 12,
      trendDirection: "up",
      status: "attention",
    },
  }

  const getTrendIcon = (direction: string) => {
    return direction === "up" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const getTrendColor = (status: string) => {
    switch (status) {
      case "improving":
        return "text-[#00A859]"
      case "attention":
        return "text-[#FF6900]"
      case "stable":
        return "text-[#006FCF]"
      default:
        return "text-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F8F9]">
      <div className="container-responsive py-8 space-y-8 animate-fade-in">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#00175A] mb-2">Operations Dashboard</h1>
            <p className="text-lg text-[#53565A]">Real-time monitoring and incident management</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="bg-white border-[#ECEDEE] hover:bg-[#F7F8F9]">
              <Clock className="h-4 w-4 mr-2" />
              Last 24 Hours
            </Button>
            <Button className="bg-[#006FCF] hover:bg-[#00175A] text-white shadow-md">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-enhanced border-0 overflow-hidden">
            <div className="h-2 gradient-blue"></div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-[#53565A]">Active Incidents</CardTitle>
                <div className="p-2 bg-[#E6F2FF] rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-[#006FCF]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold text-[#00175A]">{metrics.activeIncidents.value}</div>
                <div className={`flex items-center gap-1 text-sm ${getTrendColor(metrics.activeIncidents.status)}`}>
                  {getTrendIcon(metrics.activeIncidents.trendDirection)}
                  <span>{Math.abs(metrics.activeIncidents.trend)}%</span>
                </div>
              </div>
              <Progress value={30} className="mt-3 h-2" indicatorClassName="bg-[#006FCF]" />
              <p className="text-xs text-[#53565A] mt-2">3 critical, 5 high priority</p>
            </CardContent>
          </Card>

          <Card className="card-enhanced border-0 overflow-hidden">
            <div className="h-2 gradient-green"></div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-[#53565A]">Mean Time to Resolve</CardTitle>
                <div className="p-2 bg-[#E6F9F1] rounded-lg">
                  <Clock className="h-5 w-5 text-[#00A859]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold text-[#00175A]">{metrics.mttr.value}</div>
                <div className={`flex items-center gap-1 text-sm ${getTrendColor(metrics.mttr.status)}`}>
                  {getTrendIcon(metrics.mttr.trendDirection)}
                  <span>{Math.abs(metrics.mttr.trend)}%</span>
                </div>
              </div>
              <Progress value={75} className="mt-3 h-2" indicatorClassName="bg-[#00A859]" />
              <p className="text-xs text-[#53565A] mt-2">Target: 20 minutes</p>
            </CardContent>
          </Card>

          <Card className="card-enhanced border-0 overflow-hidden">
            <div className="h-2 gradient-orange"></div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-[#53565A]">System Uptime</CardTitle>
                <div className="p-2 bg-[#FFF4EC] rounded-lg">
                  <Activity className="h-5 w-5 text-[#FF6900]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold text-[#00175A]">{metrics.uptime.value}%</div>
                <div className={`flex items-center gap-1 text-sm ${getTrendColor(metrics.uptime.status)}`}>
                  {getTrendIcon(metrics.uptime.trendDirection)}
                  <span>{metrics.uptime.trend}%</span>
                </div>
              </div>
              <Progress value={99.98} className="mt-3 h-2" indicatorClassName="bg-[#FF6900]" />
              <p className="text-xs text-[#53565A] mt-2">SLA Target: 99.95%</p>
            </CardContent>
          </Card>

          <Card className="card-enhanced border-0 overflow-hidden">
            <div className="h-2 gradient-red"></div>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-[#53565A]">Alerts Today</CardTitle>
                <div className="p-2 bg-[#FFEEF0] rounded-lg">
                  <Shield className="h-5 w-5 text-[#D5001F]" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold text-[#00175A]">{metrics.alertsToday.value}</div>
                <div className={`flex items-center gap-1 text-sm ${getTrendColor(metrics.alertsToday.status)}`}>
                  {getTrendIcon(metrics.alertsToday.trendDirection)}
                  <span>{metrics.alertsToday.trend}%</span>
                </div>
              </div>
              <Progress value={65} className="mt-3 h-2" indicatorClassName="bg-[#D5001F]" />
              <p className="text-xs text-[#53565A] mt-2">12 critical, 35 high priority</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AIMonitoringInsights />
          </div>
          <div className="space-y-6">
            <Card className="card-enhanced border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                  <Badge className="bg-[#E6F2FF] text-[#006FCF] border-0">5 Pending</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-white border border-[#ECEDEE] text-[#00175A] hover:bg-[#E6F2FF] hover:border-[#006FCF]">
                  <AlertTriangle className="h-4 w-4 mr-2 text-[#D5001F]" />
                  Review Critical Incidents
                </Button>
                <Button className="w-full justify-start bg-white border border-[#ECEDEE] text-[#00175A] hover:bg-[#E6F2FF] hover:border-[#006FCF]">
                  <Users className="h-4 w-4 mr-2 text-[#006FCF]" />
                  Update On-Call Schedule
                </Button>
                <Button className="w-full justify-start bg-white border border-[#ECEDEE] text-[#00175A] hover:bg-[#E6F2FF] hover:border-[#006FCF]">
                  <Shield className="h-4 w-4 mr-2 text-[#00A859]" />
                  Generate Compliance Report
                </Button>
                <Button className="w-full justify-start bg-white border border-[#ECEDEE] text-[#00175A] hover:bg-[#E6F2FF] hover:border-[#006FCF]">
                  <BrainCircuit className="h-4 w-4 mr-2 text-[#FF6900]" />
                  Configure AI Thresholds
                </Button>
              </CardContent>
            </Card>

            <Card className="card-enhanced border-0 bg-gradient-to-br from-[#006FCF] to-[#00175A] text-white">
              <CardHeader>
                <CardTitle className="text-white">System Health Score</CardTitle>
                <CardDescription className="text-blue-100">Overall system performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="text-5xl font-bold">94</div>
                    <div className="text-sm text-blue-100 text-center mt-1">Excellent</div>
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Availability</span>
                    <span className="font-medium">99.98%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Performance</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-100">Security</span>
                    <span className="font-medium">96%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="incidents" className="space-y-6">
          <TabsList className="bg-white border border-[#ECEDEE] p-1">
            <TabsTrigger value="incidents" className="data-[state=active]:bg-[#006FCF] data-[state=active]:text-white">
              Active Incidents
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#006FCF] data-[state=active]:text-white">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="oncall" className="data-[state=active]:bg-[#006FCF] data-[state=active]:text-white">
              On-Call Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incidents" className="space-y-6">
            <Card className="card-enhanced border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Recent Incidents</CardTitle>
                    <CardDescription>Active and recently resolved incidents</CardDescription>
                  </div>
                  <Button variant="outline" className="bg-white">
                    View All Incidents
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <IncidentTable limit={5} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-enhanced border-0">
                <CardHeader>
                  <CardTitle>Incident Trend</CardTitle>
                  <CardDescription>Last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <IncidentTrendChart />
                </CardContent>
              </Card>

              <Card className="card-enhanced border-0">
                <CardHeader>
                  <CardTitle>Incidents by Service</CardTitle>
                  <CardDescription>Distribution across services</CardDescription>
                </CardHeader>
                <CardContent>
                  <IncidentsByServiceChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="oncall" className="space-y-6">
            <Card className="card-enhanced border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">On-Call Schedule</CardTitle>
                    <CardDescription>Current and upcoming on-call rotations</CardDescription>
                  </div>
                  <Button variant="outline" className="bg-white">
                    Manage Schedule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <OnCallSchedule />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
