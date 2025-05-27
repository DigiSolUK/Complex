"use client"

import { useState } from "react"
import { Calendar, Download, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CompliancePage() {
  const [reportPeriod, setReportPeriod] = useState("q2-2025")
  const [serviceFilter, setServiceFilter] = useState("all")

  // Sample data for FCA uptime reporting
  const uptimeData = [
    {
      service: "Payment Processing",
      category: "Critical",
      uptime: 99.98,
      downtime: 17.5,
      incidents: 3,
      status: "compliant",
      trend: "stable",
    },
    {
      service: "Account Management",
      category: "Critical",
      uptime: 99.95,
      downtime: 43.8,
      incidents: 5,
      status: "compliant",
      trend: "improving",
    },
    {
      service: "Card Authorization",
      category: "Critical",
      uptime: 99.99,
      downtime: 8.8,
      incidents: 1,
      status: "compliant",
      trend: "stable",
    },
    {
      service: "Mobile Banking",
      category: "Important",
      uptime: 99.9,
      downtime: 87.6,
      incidents: 7,
      status: "compliant",
      trend: "declining",
    },
    {
      service: "Customer Portal",
      category: "Important",
      uptime: 99.85,
      downtime: 131.4,
      incidents: 12,
      status: "attention",
      trend: "declining",
    },
    {
      service: "Merchant Services",
      category: "Critical",
      uptime: 99.97,
      downtime: 26.3,
      incidents: 4,
      status: "compliant",
      trend: "improving",
    },
    {
      service: "Fraud Detection",
      category: "Critical",
      uptime: 99.99,
      downtime: 8.8,
      incidents: 2,
      status: "compliant",
      trend: "stable",
    },
  ]

  // Sample data for incident response time reporting
  const responseTimeData = [
    {
      category: "P1 - Critical",
      target: "15 minutes",
      actual: "12 minutes",
      compliance: 100,
      status: "compliant",
    },
    {
      category: "P2 - High",
      target: "30 minutes",
      actual: "27 minutes",
      compliance: 98,
      status: "compliant",
    },
    {
      category: "P3 - Medium",
      target: "2 hours",
      actual: "1.8 hours",
      compliance: 95,
      status: "compliant",
    },
    {
      category: "P4 - Low",
      target: "8 hours",
      actual: "6.5 hours",
      compliance: 100,
      status: "compliant",
    },
  ]

  // Sample data for operational resilience reporting
  const resilienceData = [
    {
      category: "Business Continuity Tests",
      completed: 4,
      required: 4,
      lastTest: "2025-04-15",
      status: "compliant",
    },
    {
      category: "Disaster Recovery Tests",
      completed: 2,
      required: 2,
      lastTest: "2025-03-22",
      status: "compliant",
    },
    {
      category: "Cyber Incident Response",
      completed: 3,
      required: 4,
      lastTest: "2025-05-10",
      status: "attention",
    },
    {
      category: "Third-Party Provider Failover",
      completed: 1,
      required: 2,
      lastTest: "2025-02-18",
      status: "attention",
    },
  ]

  // Filter uptime data based on service filter
  const filteredUptimeData =
    serviceFilter === "all" ? uptimeData : uptimeData.filter((item) => item.category.toLowerCase() === serviceFilter)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-[#99ddcc] text-[#55aa99] border-0">Compliant</Badge>
      case "attention":
        return <Badge className="bg-[#ffcc99] text-[#cc8855] border-0">Needs Attention</Badge>
      case "non-compliant":
        return <Badge className="bg-[#ff9999] text-[#cc5555] border-0">Non-Compliant</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case "improving":
        return (
          <Badge variant="outline" className="bg-[#e6ffee] text-[#55aa99] border-[#99ddcc]">
            Improving
          </Badge>
        )
      case "stable":
        return (
          <Badge variant="outline" className="bg-[#e6ecff] text-[#5588cc] border-[#99ccff]">
            Stable
          </Badge>
        )
      case "declining":
        return (
          <Badge variant="outline" className="bg-[#fff5e6] text-[#cc8855] border-[#ffcc99]">
            Declining
          </Badge>
        )
      default:
        return <Badge variant="outline">{trend}</Badge>
    }
  }

  const handleGenerateReport = () => {
    alert("FCA compliance report generation initiated")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Regulatory Compliance</h1>
        <p className="text-muted-foreground">FCA uptime reporting and FSA required monitoring</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select defaultValue="q2-2025" onValueChange={(value) => setReportPeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Reporting period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="q1-2025">Q1 2025</SelectItem>
              <SelectItem value="q2-2025">Q2 2025</SelectItem>
              <SelectItem value="q3-2025">Q3 2025</SelectItem>
              <SelectItem value="q4-2025">Q4 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1" onClick={handleGenerateReport}>
            <FileText className="h-4 w-4" />
            Generate FCA Report
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-[#e6ecff] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#5588cc]">Overall Service Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#5588cc]">99.96%</div>
            <p className="text-xs text-[#8855cc]">+0.02% from previous quarter</p>
            <Progress value={99.96} max={100} className="mt-4 bg-[#e6ecff]" indicatorClassName="bg-[#99ccff]" />
          </CardContent>
        </Card>

        <Card className="border border-[#e6ecff] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#cc66aa]">Critical Services Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#cc66aa]">99.98%</div>
            <p className="text-xs text-[#8855cc]">+0.01% from previous quarter</p>
            <Progress value={99.98} max={100} className="mt-4 bg-[#e6ecff]" indicatorClassName="bg-[#cc99ff]" />
          </CardContent>
        </Card>

        <Card className="border border-[#e6ecff] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#55aa99]">Incident Response Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#55aa99]">98.2%</div>
            <p className="text-xs text-[#8855cc]">+1.5% from previous quarter</p>
            <Progress value={98.2} max={100} className="mt-4 bg-[#e6ecff]" indicatorClassName="bg-[#99ddcc]" />
          </CardContent>
        </Card>

        <Card className="border border-[#e6ecff] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#cc8855]">Operational Resilience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#cc8855]">83%</div>
            <p className="text-xs text-[#8855cc]">-2% from previous quarter</p>
            <Progress value={83} max={100} className="mt-4 bg-[#e6ecff]" indicatorClassName="bg-[#ffcc99]" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="uptime" className="space-y-6">
        <TabsList>
          <TabsTrigger value="uptime">FCA Uptime Reporting</TabsTrigger>
          <TabsTrigger value="response">Incident Response</TabsTrigger>
          <TabsTrigger value="resilience">Operational Resilience</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        <TabsContent value="uptime" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Service Uptime Report</h2>
            <Select defaultValue="all" onValueChange={(value) => setServiceFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Service category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="critical">Critical Services</SelectItem>
                <SelectItem value="important">Important Services</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>FCA Service Availability</CardTitle>
              <CardDescription>Q2 2025 (April - June)</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Uptime %</TableHead>
                    <TableHead>Downtime (min)</TableHead>
                    <TableHead>Incidents</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUptimeData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.service}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.uptime}%</TableCell>
                      <TableCell>{item.downtime}</TableCell>
                      <TableCell>{item.incidents}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{getTrendBadge(item.trend)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      <Info className="h-4 w-4" />
                      FCA Compliance Thresholds
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>Critical Services: 99.95% minimum uptime required</p>
                      <p>Important Services: 99.9% minimum uptime required</p>
                      <p>Standard Services: 99.5% minimum uptime required</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div>Reporting period: April 1, 2025 - June 30, 2025</div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Incident Response Time Compliance</CardTitle>
              <CardDescription>FSA required response time metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident Category</TableHead>
                    <TableHead>Target Response Time</TableHead>
                    <TableHead>Actual Response Time</TableHead>
                    <TableHead>Compliance %</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {responseTimeData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell>{item.target}</TableCell>
                      <TableCell>{item.actual}</TableCell>
                      <TableCell>{item.compliance}%</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      <Info className="h-4 w-4" />
                      FSA Response Requirements
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>P1 incidents must be responded to within 15 minutes</p>
                      <p>P2 incidents must be responded to within 30 minutes</p>
                      <p>P3 incidents must be responded to within 2 hours</p>
                      <p>P4 incidents must be responded to within 8 hours</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div>Reporting period: April 1, 2025 - June 30, 2025</div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="resilience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Operational Resilience Testing</CardTitle>
              <CardDescription>FSA required resilience testing and exercises</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Category</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Last Test Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resilienceData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell>{item.completed}</TableCell>
                      <TableCell>{item.required}</TableCell>
                      <TableCell>{new Date(item.lastTest).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      <Info className="h-4 w-4" />
                      FSA Resilience Requirements
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>Business Continuity Tests: Quarterly</p>
                      <p>Disaster Recovery Tests: Bi-annually</p>
                      <p>Cyber Incident Response: Quarterly</p>
                      <p>Third-Party Provider Failover: Bi-annually</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div>Reporting period: April 1, 2025 - June 30, 2025</div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Audit Trail</CardTitle>
              <CardDescription>Complete audit history for regulatory compliance</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>2025-05-27 15:42:18</TableCell>
                    <TableCell>Sarah Johnson</TableCell>
                    <TableCell>Generated FCA Report</TableCell>
                    <TableCell>Q1 2025 Uptime Report</TableCell>
                    <TableCell>192.168.1.45</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-05-27 14:30:05</TableCell>
                    <TableCell>Michael Chen</TableCell>
                    <TableCell>Updated Incident Response Policy</TableCell>
                    <TableCell>Updated P1 response time from 30 to 15 minutes</TableCell>
                    <TableCell>192.168.1.23</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-05-26 11:15:32</TableCell>
                    <TableCell>Emma Wilson</TableCell>
                    <TableCell>Completed Resilience Test</TableCell>
                    <TableCell>Disaster Recovery Test for Payment Processing</TableCell>
                    <TableCell>192.168.1.87</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-05-25 09:22:47</TableCell>
                    <TableCell>David Kim</TableCell>
                    <TableCell>Modified Service Category</TableCell>
                    <TableCell>Changed Mobile Banking from Standard to Important</TableCell>
                    <TableCell>192.168.1.12</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-05-24 16:08:59</TableCell>
                    <TableCell>Sarah Johnson</TableCell>
                    <TableCell>Submitted FSA Report</TableCell>
                    <TableCell>Monthly Operational Resilience Report</TableCell>
                    <TableCell>192.168.1.45</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-05-23 14:55:21</TableCell>
                    <TableCell>Alex Rodriguez</TableCell>
                    <TableCell>Updated Incident</TableCell>
                    <TableCell>Added regulatory impact assessment to INC-1234</TableCell>
                    <TableCell>192.168.1.36</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-05-22 10:17:33</TableCell>
                    <TableCell>Lisa Patel</TableCell>
                    <TableCell>Generated Compliance Report</TableCell>
                    <TableCell>Incident Response Time Compliance Report</TableCell>
                    <TableCell>192.168.1.92</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2025-05-21 09:05:12</TableCell>
                    <TableCell>Michael Chen</TableCell>
                    <TableCell>Completed Resilience Test</TableCell>
                    <TableCell>Business Continuity Test for Account Management</TableCell>
                    <TableCell>192.168.1.23</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
