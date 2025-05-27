"use client"

import { useState } from "react"
import { Calendar, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import IncidentsByServiceChart from "@/components/charts/incidents-by-service-chart"
import IncidentTrendChart from "@/components/charts/incident-trend-chart"

export default function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState("30days")

  // Add a function to handle data export
  const handleExportData = () => {
    // In a real app, this would generate and download a CSV/Excel file
    alert("Analytics data export initiated")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Incident metrics and performance analytics</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select defaultValue="30days" onValueChange={(value) => setTimePeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" className="gap-1" onClick={handleExportData}>
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-[#e6ecff] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#5588cc]">Total Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#5588cc]">142</div>
            <p className="text-xs text-[#8855cc]">+12% from previous period</p>
          </CardContent>
        </Card>

        <Card className="border border-[#e6ecff] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#cc66aa]">Mean Time to Acknowledge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#cc66aa]">4m 32s</div>
            <p className="text-xs text-[#8855cc]">-18% from previous period</p>
          </CardContent>
        </Card>

        <Card className="border border-[#e6ecff] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#55aa99]">Mean Time to Resolve</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#55aa99]">32m 14s</div>
            <p className="text-xs text-[#8855cc]">-5% from previous period</p>
          </CardContent>
        </Card>

        <Card className="border border-[#e6ecff] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#cc8855]">Alert Correlation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#cc8855]">78%</div>
            <p className="text-xs text-[#8855cc]">+3% from previous period</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Incidents by Service</CardTitle>
                <CardDescription>Distribution of incidents across services</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <IncidentsByServiceChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incident Trend</CardTitle>
                <CardDescription>Daily incident count by severity</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <IncidentTrendChart />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Response Time Metrics</CardTitle>
                <CardDescription>MTTA and MTTR trends over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Response time chart would be displayed here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Incidents by Severity</CardTitle>
                <CardDescription>Distribution of incidents by severity level</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Severity distribution chart would be displayed here
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incidents by Time of Day</CardTitle>
                <CardDescription>When incidents are most likely to occur</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Time of day heatmap would be displayed here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Reliability</CardTitle>
              <CardDescription>Incident frequency and resolution time by service</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Service reliability metrics would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Response and resolution metrics by team</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Team performance metrics would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
