import { AlertTriangle, Bell, CheckCircle, Clock, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import IncidentTable from "@/components/incident-table"
import OnCallSchedule from "@/components/on-call-schedule"
import IncidentsByServiceChart from "@/components/charts/incidents-by-service-chart"
import IncidentTrendChart from "@/components/charts/incident-trend-chart"
import AIMonitoringInsights from "@/components/ai-monitoring-insights"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your incident management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#D5001F]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 in the last hour</p>
            <div className="mt-4 flex items-center gap-2">
              <Badge className="bg-[#FFEEF0] text-[#D5001F] border-0">Critical: 3</Badge>
              <Badge className="bg-[#FFF4EC] text-[#FF6900] border-0">High: 5</Badge>
              <Badge className="bg-[#E6F2FF] text-[#006FCF] border-0">Medium: 4</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts Today</CardTitle>
            <Bell className="h-4 w-4 text-[#FF6900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">78% correlated into incidents</p>
            <Progress value={78} className="mt-4 bg-[#ECEDEE]" indicatorClassName="bg-[#006FCF]" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-[#006FCF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4m 32s</div>
            <p className="text-xs text-muted-foreground">-12% from last week</p>
            <Progress value={68} className="mt-4 bg-[#ECEDEE]" indicatorClassName="bg-[#006FCF]" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#00A859]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Avg resolution time: 32m 14s</p>
            <Progress value={85} className="mt-4 bg-[#ECEDEE]" indicatorClassName="bg-[#00A859]" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AIMonitoringInsights />

        <Card className="border-[#E6F2FF]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#006FCF]" />
                FCA Compliance Status
              </CardTitle>
              <Button variant="outline" size="sm" className="gap-1">
                <Shield className="h-4 w-4" />
                View Full Report
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Critical Services Uptime</span>
                  <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Compliant</Badge>
                </div>
                <Progress value={99.98} max={100} className="h-2 bg-[#ECEDEE]" indicatorClassName="bg-[#00A859]" />
                <div className="flex justify-between text-xs">
                  <span>99.98%</span>
                  <span className="text-muted-foreground">Target: 99.95%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">P1 Response Time</span>
                  <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Compliant</Badge>
                </div>
                <Progress value={12} max={15} className="h-2 bg-[#ECEDEE]" indicatorClassName="bg-[#00A859]" />
                <div className="flex justify-between text-xs">
                  <span>12 min</span>
                  <span className="text-muted-foreground">Target: 15 min</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Resilience Testing</span>
                  <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">Attention</Badge>
                </div>
                <Progress value={75} max={100} className="h-2 bg-[#ECEDEE]" indicatorClassName="bg-[#FF6900]" />
                <div className="flex justify-between text-xs">
                  <span>75% complete</span>
                  <span className="text-muted-foreground">Target: 100%</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Incident Reporting</span>
                  <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Compliant</Badge>
                </div>
                <Progress value={100} max={100} className="h-2 bg-[#ECEDEE]" indicatorClassName="bg-[#00A859]" />
                <div className="flex justify-between text-xs">
                  <span>100% reported</span>
                  <span className="text-muted-foreground">Target: 100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="incidents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="incidents">Active Incidents</TabsTrigger>
          <TabsTrigger value="on-call">On-Call Schedule</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Incidents</h2>
            <Button variant="outline" size="sm">
              View All Incidents
            </Button>
          </div>
          <IncidentTable limit={5} />
        </TabsContent>

        <TabsContent value="on-call" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Current On-Call</h2>
            <Button variant="outline" size="sm">
              Manage Schedules
            </Button>
          </div>
          <OnCallSchedule />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Incidents by Service</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <IncidentsByServiceChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Incident Trend</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <IncidentTrendChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
