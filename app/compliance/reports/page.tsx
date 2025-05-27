"use client"

import { useState } from "react"
import { Calendar, Check, Clock, Download, FileText, Plus, RefreshCw, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export default function ComplianceReportsPage() {
  const [reportPeriod, setReportPeriod] = useState("q2-2025")
  const [generatingReport, setGeneratingReport] = useState(false)
  const [showAiDialog, setShowAiDialog] = useState(false)

  // Sample data for scheduled reports
  const scheduledReports = [
    {
      id: "REP-001",
      name: "FCA Quarterly Uptime Report",
      frequency: "Quarterly",
      nextRun: "2025-06-30",
      lastRun: "2025-03-31",
      status: "scheduled",
      recipients: ["compliance@amex.com", "regulatory@amex.com"],
    },
    {
      id: "REP-002",
      name: "Monthly Incident Summary",
      frequency: "Monthly",
      nextRun: "2025-05-31",
      lastRun: "2025-04-30",
      status: "scheduled",
      recipients: ["operations@amex.com", "compliance@amex.com"],
    },
    {
      id: "REP-003",
      name: "Weekly Compliance Dashboard",
      frequency: "Weekly",
      nextRun: "2025-05-31",
      lastRun: "2025-05-24",
      status: "scheduled",
      recipients: ["team-leads@amex.com", "compliance@amex.com"],
    },
    {
      id: "REP-004",
      name: "Daily Critical Service Status",
      frequency: "Daily",
      nextRun: "2025-05-28",
      lastRun: "2025-05-27",
      status: "scheduled",
      recipients: ["operations@amex.com", "alerts@amex.com"],
    },
  ]

  // Sample data for generated reports
  const generatedReports = [
    {
      id: "REP-2025-Q1-001",
      name: "FCA Quarterly Uptime Report - Q1 2025",
      generated: "2025-03-31T16:30:00Z",
      generatedBy: "System",
      size: "4.2 MB",
      status: "submitted",
    },
    {
      id: "REP-2025-04-001",
      name: "Monthly Incident Summary - April 2025",
      generated: "2025-04-30T14:15:00Z",
      generatedBy: "Sarah Johnson",
      size: "2.8 MB",
      status: "submitted",
    },
    {
      id: "REP-2025-05-W3-001",
      name: "Weekly Compliance Dashboard - Week 3, May 2025",
      generated: "2025-05-21T09:45:00Z",
      generatedBy: "System",
      size: "1.5 MB",
      status: "draft",
    },
    {
      id: "REP-2025-05-27-001",
      name: "Daily Critical Service Status - May 27, 2025",
      generated: "2025-05-27T08:00:00Z",
      generatedBy: "System",
      size: "0.8 MB",
      status: "submitted",
    },
    {
      id: "REP-2025-INC-1234",
      name: "Critical Incident Report - INC-1234",
      generated: "2025-05-27T17:15:00Z",
      generatedBy: "Michael Chen",
      size: "3.1 MB",
      status: "submitted",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-[#e6ecff] text-[#5588cc] border-[#99ccff]">Scheduled</Badge>
      case "running":
        return <Badge className="bg-[#ffee99] text-[#ccbb55] border-0">Running</Badge>
      case "submitted":
        return <Badge className="bg-[#99ddcc] text-[#55aa99] border-0">Submitted</Badge>
      case "draft":
        return <Badge className="bg-[#ffcc99] text-[#cc8855] border-0">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleGenerateReport = () => {
    setGeneratingReport(true)
    // Simulate report generation
    setTimeout(() => {
      setGeneratingReport(false)
      setShowAiDialog(true)
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Automated Compliance Reports</h1>
        <p className="text-muted-foreground">Schedule and manage FCA and FSA required reports</p>
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Plus className="h-4 w-4" />
                Schedule New Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Schedule New Report</DialogTitle>
                <DialogDescription>Create a new automated compliance report</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input id="report-name" placeholder="Enter report name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select defaultValue="uptime">
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uptime">Service Uptime Report</SelectItem>
                      <SelectItem value="incident">Incident Summary Report</SelectItem>
                      <SelectItem value="compliance">Compliance Dashboard</SelectItem>
                      <SelectItem value="regulatory">Regulatory Submission</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-frequency">Frequency</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger id="report-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-recipients">Recipients</Label>
                  <Input id="report-recipients" placeholder="Enter email addresses" />
                  <p className="text-xs text-muted-foreground">Separate multiple emails with commas</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="report-ai" />
                  <Label htmlFor="report-ai">Use AI to enhance report with insights and recommendations</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Schedule Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button className="gap-1" onClick={handleGenerateReport} disabled={generatingReport}>
            {generatingReport ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Generate FCA Report
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="scheduled" className="space-y-6">
        <TabsList>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="generated">Generated Reports</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Compliance Reports</CardTitle>
              <CardDescription>Automated reports for regulatory compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.name}</TableCell>
                      <TableCell>{report.frequency}</TableCell>
                      <TableCell>{new Date(report.nextRun).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(report.lastRun).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>{report.recipients.length} recipients</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <FileText className="h-4 w-4" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Report Generation Status</CardTitle>
                <CardDescription>Status of scheduled report generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">FCA Quarterly Uptime Report</span>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>34 days remaining</span>
                    </Badge>
                  </div>
                  <Progress value={61} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Q2 2025 progress</span>
                    <span>61% complete</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly Incident Summary</span>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>4 days remaining</span>
                    </Badge>
                  </div>
                  <Progress value={87} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>May 2025 progress</span>
                    <span>87% complete</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Compliance Dashboard</span>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>4 days remaining</span>
                    </Badge>
                  </div>
                  <Progress value={43} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Week 4, May 2025 progress</span>
                    <span>43% complete</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regulatory Submission Calendar</CardTitle>
                <CardDescription>Upcoming regulatory reporting deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6ecff]">
                      <Calendar className="h-5 w-5 text-[#5588cc]" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">FCA Quarterly Uptime Report</p>
                      <p className="text-sm text-muted-foreground">Due: June 30, 2025</p>
                      <Badge className="mt-1 bg-[#e6ecff] text-[#5588cc] border-[#99ccff]">34 days remaining</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff5e6]">
                      <Shield className="h-5 w-5 text-[#cc8855]" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">FSA Operational Resilience Assessment</p>
                      <p className="text-sm text-muted-foreground">Due: July 15, 2025</p>
                      <Badge className="mt-1 bg-[#fff5e6] text-[#cc8855] border-[#ffcc99]">49 days remaining</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 rounded-lg border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e6ffee]">
                      <Check className="h-5 w-5 text-[#55aa99]" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">PRA Financial Stability Report</p>
                      <p className="text-sm text-muted-foreground">Due: August 31, 2025</p>
                      <Badge className="mt-1 bg-[#e6ffee] text-[#55aa99] border-[#99ddcc]">96 days remaining</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="generated" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Previously generated compliance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Generated By</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generatedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.id}</TableCell>
                      <TableCell>{report.name}</TableCell>
                      <TableCell>{new Date(report.generated).toLocaleString()}</TableCell>
                      <TableCell>{report.generatedBy}</TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>FCA Quarterly Uptime Report</CardTitle>
                <CardDescription>Service availability and incident summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Sections</Label>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Executive Summary</li>
                      <li>Service Availability Metrics</li>
                      <li>Critical Incident Summary</li>
                      <li>Remediation Actions</li>
                      <li>Compliance Statement</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <Label>Required Approvals</Label>
                    <div className="text-sm">CTO, Head of Compliance, CISO</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" className="gap-1">
                  <FileText className="h-4 w-4" />
                  Preview
                </Button>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Use Template
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Incident Summary</CardTitle>
                <CardDescription>Detailed incident analysis and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Sections</Label>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Incident Overview</li>
                      <li>Critical Incidents</li>
                      <li>Response Time Analysis</li>
                      <li>Trend Analysis</li>
                      <li>Improvement Actions</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <Label>Required Approvals</Label>
                    <div className="text-sm">Head of Operations, Team Leads</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" className="gap-1">
                  <FileText className="h-4 w-4" />
                  Preview
                </Button>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Use Template
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Critical Incident Report</CardTitle>
                <CardDescription>Detailed analysis of critical incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Sections</Label>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Incident Summary</li>
                      <li>Timeline of Events</li>
                      <li>Root Cause Analysis</li>
                      <li>Customer Impact</li>
                      <li>Remediation Plan</li>
                      <li>Regulatory Impact Assessment</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <Label>Required Approvals</Label>
                    <div className="text-sm">CTO, Head of Compliance, Service Owner</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" className="gap-1">
                  <FileText className="h-4 w-4" />
                  Preview
                </Button>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Use Template
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operational Resilience Report</CardTitle>
                <CardDescription>Assessment of operational resilience capabilities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Sections</Label>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Resilience Testing Results</li>
                      <li>Business Continuity Exercises</li>
                      <li>Recovery Time Objectives</li>
                      <li>Third-Party Dependencies</li>
                      <li>Improvement Actions</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <Label>Required Approvals</Label>
                    <div className="text-sm">COO, Head of Risk, CISO</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" className="gap-1">
                  <FileText className="h-4 w-4" />
                  Preview
                </Button>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Use Template
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regulatory Submission</CardTitle>
                <CardDescription>Official regulatory filing template</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Report Sections</Label>
                    <ul className="text-sm space-y-1 list-disc pl-5">
                      <li>Regulatory Cover Sheet</li>
                      <li>Executive Summary</li>
                      <li>Compliance Statement</li>
                      <li>Supporting Evidence</li>
                      <li>Attestation</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <Label>Required Approvals</Label>
                    <div className="text-sm">CEO, Head of Compliance, Board Member</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" className="gap-1">
                  <FileText className="h-4 w-4" />
                  Preview
                </Button>
                <Button size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Use Template
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Report Template</CardTitle>
                <CardDescription>Create a custom report template</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[200px]">
                <Button className="gap-1">
                  <Plus className="h-4 w-4" />
                  Create Custom Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI-Enhanced Report Dialog */}
      <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>AI-Enhanced Report Generated</DialogTitle>
            <DialogDescription>
              The FCA Quarterly Uptime Report has been generated with AI-powered insights
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-md border p-4 bg-[#f8f9ff]">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-[#8855cc]" />
                <h3 className="font-semibold">AI-Generated Executive Summary</h3>
              </div>
              <p className="text-sm">
                The Q2 2025 reporting period shows overall compliance with FCA requirements, with critical services
                maintaining 99.97% uptime against the 99.95% target. Three significant incidents occurred, all resolved
                within SLA timeframes. The AI analysis identified a potential risk pattern in the payment processing
                services that may require proactive monitoring. Customer impact was minimal, with no regulatory breaches
                reported. Recommended actions include enhanced monitoring for the identified risk pattern and a review
                of the incident response procedures for payment services.
              </p>
            </div>

            <div className="rounded-md border p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-[#5588cc]" />
                <h3 className="font-semibold">Report Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Report ID</p>
                  <p className="font-medium">REP-2025-Q2-001</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Generated</p>
                  <p className="font-medium">May 27, 2025 15:42</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reporting Period</p>
                  <p className="font-medium">Q2 2025 (Apr 1 - Jun 30)</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">Draft (Pending Review)</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-medium">4.8 MB</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Required Approvals</p>
                  <p className="font-medium">3 (0 completed)</p>
                </div>
              </div>
            </div>

            <div className="rounded-md border p-4 bg-[#fff5e6]">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-[#cc8855]" />
                <h3 className="font-semibold">AI-Detected Insights</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    <span className="font-medium">Pattern detected:</span> Correlation between system updates and minor
                    service degradations in payment processing services.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    <span className="font-medium">Trend identified:</span> 12% reduction in incident resolution time
                    compared to Q1 2025.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    <span className="font-medium">Anomaly detected:</span> Unusual pattern of authentication failures
                    during non-peak hours (2-4 AM EST).
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="gap-1">
              <FileText className="h-4 w-4" />
              View Full Report
            </Button>
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4" />
              Download Report
            </Button>
            <Button className="gap-1">
              <Check className="h-4 w-4" />
              Submit for Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
