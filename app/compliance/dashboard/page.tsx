"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import { Calendar, Download, FileText, Info, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ComplianceDashboardPage() {
  const [reportPeriod, setReportPeriod] = useState("q2-2025")
  const [serviceFilter, setServiceFilter] = useState("all")

  // Sample data for compliance metrics
  const complianceMetrics = {
    overall: {
      score: 94,
      trend: "+2%",
      status: "compliant",
    },
    categories: [
      {
        name: "Service Availability",
        score: 99.8,
        target: 99.5,
        status: "compliant",
        trend: "improving",
      },
      {
        name: "Incident Response",
        score: 96.5,
        target: 95.0,
        status: "compliant",
        trend: "stable",
      },
      {
        name: "Operational Resilience",
        score: 87.2,
        target: 90.0,
        status: "attention",
        trend: "declining",
      },
      {
        name: "Regulatory Reporting",
        score: 100.0,
        target: 100.0,
        status: "compliant",
        trend: "stable",
      },
    ],
    services: [
      {
        name: "Payment Processing",
        category: "Critical",
        compliance: 98.7,
        status: "compliant",
      },
      {
        name: "Account Management",
        category: "Critical",
        compliance: 97.5,
        status: "compliant",
      },
      {
        name: "Card Authorization",
        category: "Critical",
        compliance: 99.2,
        status: "compliant",
      },
      {
        name: "Mobile Banking",
        category: "Important",
        compliance: 95.8,
        status: "compliant",
      },
      {
        name: "Customer Portal",
        category: "Important",
        compliance: 89.4,
        status: "attention",
      },
      {
        name: "Merchant Services",
        category: "Critical",
        compliance: 96.3,
        status: "compliant",
      },
    ],
    regulatoryActions: [
      {
        id: "ACT-001",
        title: "Update Operational Resilience Framework",
        deadline: "2025-06-30",
        status: "in-progress",
        owner: "Risk Management",
        progress: 65,
      },
      {
        id: "ACT-002",
        title: "Implement Enhanced Monitoring for Critical Services",
        deadline: "2025-07-15",
        status: "in-progress",
        owner: "Infrastructure Team",
        progress: 42,
      },
      {
        id: "ACT-003",
        title: "Review Third-Party Provider Contingency Plans",
        deadline: "2025-08-31",
        status: "not-started",
        owner: "Vendor Management",
        progress: 0,
      },
      {
        id: "ACT-004",
        title: "Update Incident Response Procedures",
        deadline: "2025-06-15",
        status: "in-progress",
        owner: "Operations Team",
        progress: 78,
      },
    ],
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Compliant</Badge>
      case "attention":
        return <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">Needs Attention</Badge>
      case "non-compliant":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">Non-Compliant</Badge>
      case "in-progress":
        return <Badge className="bg-[#E6F2FF] text-[#006FCF] border-[#006FCF]">In Progress</Badge>
      case "not-started":
        return <Badge variant="outline">Not Started</Badge>
      case "completed":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case "improving":
        return (
          <Badge variant="outline" className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">
            Improving
          </Badge>
        )
      case "stable":
        return (
          <Badge variant="outline" className="bg-[#E6F2FF] text-[#006FCF] border-[#006FCF]">
            Stable
          </Badge>
        )
      case "declining":
        return (
          <Badge variant="outline" className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">
            Declining
          </Badge>
        )
      default:
        return <Badge variant="outline">{trend}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h1>
        <p className="text-muted-foreground">Overview of regulatory compliance status and metrics</p>
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
          <Button variant="outline" className="gap-1">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-[#E6F2FF] bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#006FCF]">Overall Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#006FCF]">{complianceMetrics.overall.score}%</div>
            <p className="text-xs text-[#00A859]">{complianceMetrics.overall.trend} from previous period</p>
            <Progress
              value={complianceMetrics.overall.score}
              max={100}
              className="mt-4 bg-[#ECEDEE]"
              indicatorClassName="bg-[#006FCF]"
            />
          </CardContent>
        </Card>

        {complianceMetrics.categories.slice(0, 3).map((category, index) => (
          <Card key={index} className="border border-[#E6F2FF] bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#006FCF]">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#006FCF]">{category.score}%</div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">Target: {category.target}%</p>
                {getStatusBadge(category.status)}
              </div>
              <Progress
                value={category.score}
                max={100}
                className="mt-4 bg-[#ECEDEE]"
                indicatorClassName={`
                  ${category.status === "compliant" ? "bg-[#00A859]" : ""}
                  ${category.status === "attention" ? "bg-[#FF6900]" : ""}
                  ${category.status === "non-compliant" ? "bg-[#D5001F]" : ""}
                `}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="actions">Regulatory Actions</TabsTrigger>
          <TabsTrigger value="history">Compliance History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance by Category</CardTitle>
              <CardDescription>Detailed compliance metrics by regulatory category</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceMetrics.categories.map((category, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.score}%</TableCell>
                      <TableCell>{category.target}%</TableCell>
                      <TableCell>{getStatusBadge(category.status)}</TableCell>
                      <TableCell>{getTrendBadge(category.trend)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Regulatory Deadlines</CardTitle>
                <CardDescription>Key compliance deadlines in the next 90 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F2FF]">
                      <Calendar className="h-5 w-5 text-[#006FCF]" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">FCA Quarterly Uptime Report</p>
                      <p className="text-sm text-muted-foreground">Due: June 30, 2025</p>
                      <Badge className="mt-1 bg-[#E6F2FF] text-[#006FCF] border-[#006FCF]">34 days remaining</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF4EC]">
                      <Shield className="h-5 w-5 text-[#FF6900]" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Update Incident Response Procedures</p>
                      <p className="text-sm text-muted-foreground">Due: June 15, 2025</p>
                      <Badge className="mt-1 bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">19 days remaining</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F2FF]">
                      <FileText className="h-5 w-5 text-[#006FCF]" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">Enhanced Monitoring Implementation</p>
                      <p className="text-sm text-muted-foreground">Due: July 15, 2025</p>
                      <Badge className="mt-1 bg-[#E6F2FF] text-[#006FCF] border-[#006FCF]">49 days remaining</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Insights</CardTitle>
                <CardDescription>Key observations and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border-l-4 border-l-[#00A859] p-4 bg-[#F8FCFA]">
                    <h3 className="font-medium text-[#00A859] mb-1">Strength</h3>
                    <p className="text-sm">
                      Regulatory reporting compliance is at 100%, exceeding FCA requirements for the third consecutive
                      quarter.
                    </p>
                  </div>

                  <div className="rounded-md border-l-4 border-l-[#FF6900] p-4 bg-[#FFFAF5]">
                    <h3 className="font-medium text-[#FF6900] mb-1">Attention Required</h3>
                    <p className="text-sm">
                      Operational resilience score has declined by 3.5% since last quarter, primarily due to incomplete
                      third-party provider contingency testing.
                    </p>
                  </div>

                  <div className="rounded-md border-l-4 border-l-[#006FCF] p-4 bg-[#F5FAFF]">
                    <h3 className="font-medium text-[#006FCF] mb-1">Recommendation</h3>
                    <p className="text-sm">
                      Prioritize the completion of operational resilience testing for third-party providers to improve
                      overall compliance score.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Service Compliance</h2>
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
              <CardTitle>Service Compliance Metrics</CardTitle>
              <CardDescription>Compliance status by service</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Compliance Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceMetrics.services.map((service, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            ${service.category === "Critical" ? "bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]" : ""}
                            ${service.category === "Important" ? "bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]" : ""}
                          `}
                        >
                          {service.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{service.compliance}%</span>
                          <Progress
                            value={service.compliance}
                            max={100}
                            className="w-24 h-2 bg-[#ECEDEE]"
                            indicatorClassName={`
                              ${service.status === "compliant" ? "bg-[#00A859]" : ""}
                              ${service.status === "attention" ? "bg-[#FF6900]" : ""}
                              ${service.status === "non-compliant" ? "bg-[#D5001F]" : ""}
                            `}
                          />
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(service.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <p className="text-sm text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="flex items-center gap-1 cursor-help">
                      <Info className="h-4 w-4" />
                      FCA Compliance Thresholds
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>Critical Services: 95% minimum compliance required</p>
                      <p>Important Services: 90% minimum compliance required</p>
                      <p>Standard Services: 85% minimum compliance required</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Actions</CardTitle>
              <CardDescription>Required actions to maintain regulatory compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceMetrics.regulatoryActions.map((action, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{action.id}</TableCell>
                      <TableCell>{action.title}</TableCell>
                      <TableCell>{new Date(action.deadline).toLocaleDateString()}</TableCell>
                      <TableCell>{action.owner}</TableCell>
                      <TableCell>{getStatusBadge(action.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={action.progress}
                            max={100}
                            className="w-24 h-2 bg-[#ECEDEE]"
                            indicatorClassName={`
                              ${action.progress >= 80 ? "bg-[#00A859]" : ""}
                              ${action.progress >= 40 && action.progress < 80 ? "bg-[#006FCF]" : ""}
                              ${action.progress < 40 ? "bg-[#FF6900]" : ""}
                            `}
                          />
                          <span className="text-sm">{action.progress}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance History</CardTitle>
              <CardDescription>Historical compliance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Compliance history chart would be displayed here</p>
                <p className="text-sm mt-2">Showing quarterly compliance scores for the past 2 years</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Findings</CardTitle>
                <CardDescription>Historical regulatory findings and resolutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 border-b pb-4">
                    <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859] mt-0.5">Resolved</Badge>
                    <div>
                      <p className="font-medium">Incident Response Time Compliance</p>
                      <p className="text-sm text-muted-foreground">
                        Q1 2025: Response times for P1 incidents exceeded target by 3 minutes on average
                      </p>
                      <p className="text-xs mt-1">Resolution: Updated alerting system and on-call procedures</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-b pb-4">
                    <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859] mt-0.5">Resolved</Badge>
                    <div>
                      <p className="font-medium">Third-Party Provider Documentation</p>
                      <p className="text-sm text-muted-foreground">
                        Q4 2024: Incomplete documentation for 2 critical third-party providers
                      </p>
                      <p className="text-xs mt-1">Resolution: Implemented new vendor management system</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859] mt-0.5">Resolved</Badge>
                    <div>
                      <p className="font-medium">Resilience Testing Frequency</p>
                      <p className="text-sm text-muted-foreground">
                        Q3 2024: Resilience testing for payment services below required frequency
                      </p>
                      <p className="text-xs mt-1">Resolution: Implemented automated quarterly testing schedule</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Improvements</CardTitle>
                <CardDescription>Key improvements in compliance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Service Availability</h3>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">+1.2%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Improved from 98.6% in Q1 2024 to 99.8% in Q2 2025 through enhanced monitoring and automated
                      recovery procedures.
                    </p>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Incident Response Time</h3>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">-42%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reduced average response time from 26 minutes to 15 minutes through improved alerting and on-call
                      procedures.
                    </p>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">Regulatory Reporting</h3>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">+5%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Improved from 95% to 100% compliance through automated report generation and enhanced review
                      processes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
