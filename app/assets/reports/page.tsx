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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, RefreshCw, FileText, Download, Calendar, Clock, Filter, BarChart, PieChart } from "lucide-react"

export default function AssetReportsPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [reportName, setReportName] = useState("")
  const [reportType, setReportType] = useState("inventory")
  const [reportFormat, setReportFormat] = useState("pdf")
  const [reportDescription, setReportDescription] = useState("")
  const [scheduleType, setScheduleType] = useState("once")

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  const resetForm = () => {
    setReportName("")
    setReportType("inventory")
    setReportFormat("pdf")
    setReportDescription("")
    setScheduleType("once")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the report
    setDialogOpen(false)
    resetForm()
  }

  // Sample reports data
  const reports = [
    {
      id: "report-001",
      name: "Monthly Asset Inventory",
      type: "inventory",
      format: "pdf",
      schedule: "monthly",
      lastRun: "2025-05-01T10:30:00Z",
      nextRun: "2025-06-01T10:30:00Z",
      status: "completed",
    },
    {
      id: "report-002",
      name: "Weekly Compliance Status",
      type: "compliance",
      format: "excel",
      schedule: "weekly",
      lastRun: "2025-05-20T14:15:00Z",
      nextRun: "2025-05-27T14:15:00Z",
      status: "completed",
    },
    {
      id: "report-003",
      name: "Software License Audit",
      type: "software",
      format: "pdf",
      schedule: "quarterly",
      lastRun: "2025-04-01T09:45:00Z",
      nextRun: "2025-07-01T09:45:00Z",
      status: "completed",
    },
    {
      id: "report-004",
      name: "Hardware Warranty Status",
      type: "hardware",
      format: "excel",
      schedule: "monthly",
      lastRun: "2025-05-05T16:30:00Z",
      nextRun: "2025-06-05T16:30:00Z",
      status: "completed",
    },
    {
      id: "report-005",
      name: "Network Device Performance",
      type: "performance",
      format: "pdf",
      schedule: "daily",
      lastRun: "2025-05-26T08:00:00Z",
      nextRun: "2025-05-27T08:00:00Z",
      status: "scheduled",
    },
    {
      id: "report-006",
      name: "End-of-Life Assets",
      type: "lifecycle",
      format: "pdf",
      schedule: "once",
      lastRun: null,
      nextRun: "2025-06-15T12:00:00Z",
      status: "scheduled",
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

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "inventory":
        return <FileText className="h-4 w-4 text-[#006FCF]" />
      case "compliance":
        return <FileText className="h-4 w-4 text-[#006FCF]" />
      case "software":
        return <FileText className="h-4 w-4 text-[#006FCF]" />
      case "hardware":
        return <FileText className="h-4 w-4 text-[#006FCF]" />
      case "performance":
        return <BarChart className="h-4 w-4 text-[#006FCF]" />
      case "lifecycle":
        return <PieChart className="h-4 w-4 text-[#006FCF]" />
      default:
        return <FileText className="h-4 w-4 text-[#006FCF]" />
    }
  }

  const getScheduleIcon = (schedule: string) => {
    switch (schedule) {
      case "daily":
        return <Clock className="h-4 w-4 text-[#006FCF]" />
      case "weekly":
        return <Calendar className="h-4 w-4 text-[#006FCF]" />
      case "monthly":
        return <Calendar className="h-4 w-4 text-[#006FCF]" />
      case "quarterly":
        return <Calendar className="h-4 w-4 text-[#006FCF]" />
      case "once":
        return <Calendar className="h-4 w-4 text-[#006FCF]" />
      default:
        return <Calendar className="h-4 w-4 text-[#006FCF]" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Completed</Badge>
      case "scheduled":
        return <Badge className="bg-[#F0F7FF] text-[#006FCF] border-[#006FCF]">Scheduled</Badge>
      case "running":
        return <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">Running</Badge>
      case "failed":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">Failed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#006FCF]">Asset Reports</h1>
          <p className="text-muted-foreground">Generate and schedule asset inventory reports</p>
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
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>Configure a new asset report</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="report-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="report-name"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      className="col-span-3"
                      placeholder="Monthly Asset Inventory"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="report-type" className="text-right">
                      Report Type
                    </Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger id="report-type" className="col-span-3">
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inventory">Asset Inventory</SelectItem>
                        <SelectItem value="compliance">Compliance Status</SelectItem>
                        <SelectItem value="software">Software Licenses</SelectItem>
                        <SelectItem value="hardware">Hardware Warranty</SelectItem>
                        <SelectItem value="performance">Performance Metrics</SelectItem>
                        <SelectItem value="lifecycle">Lifecycle Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="report-format" className="text-right">
                      Format
                    </Label>
                    <Select value={reportFormat} onValueChange={setReportFormat}>
                      <SelectTrigger id="report-format" className="col-span-3">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="schedule-type" className="text-right">
                      Schedule
                    </Label>
                    <Select value={scheduleType} onValueChange={setScheduleType}>
                      <SelectTrigger id="schedule-type" className="col-span-3">
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Run Once</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="report-description" className="text-right pt-2">
                      Description
                    </Label>
                    <Textarea
                      id="report-description"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      className="col-span-3"
                      placeholder="Enter report description"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#006FCF] hover:bg-[#004F93]">
                    <FileText className="mr-2 h-4 w-4" />
                    Create Report
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>View and manage all asset reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {getReportTypeIcon(report.type)}
                        <span className="capitalize">{report.type}</span>
                      </TableCell>
                      <TableCell className="uppercase">{report.format}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {getScheduleIcon(report.schedule)}
                        <span className="capitalize">{report.schedule}</span>
                      </TableCell>
                      <TableCell>{formatDate(report.lastRun)}</TableCell>
                      <TableCell>{formatDate(report.nextRun)}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>View and manage scheduled reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports
                    .filter((report) => report.status === "scheduled")
                    .map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          {getReportTypeIcon(report.type)}
                          <span className="capitalize">{report.type}</span>
                        </TableCell>
                        <TableCell className="uppercase">{report.format}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          {getScheduleIcon(report.schedule)}
                          <span className="capitalize">{report.schedule}</span>
                        </TableCell>
                        <TableCell>{formatDate(report.nextRun)}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Reports</CardTitle>
              <CardDescription>View and download completed reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports
                    .filter((report) => report.status === "completed")
                    .map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.name}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          {getReportTypeIcon(report.type)}
                          <span className="capitalize">{report.type}</span>
                        </TableCell>
                        <TableCell className="uppercase">{report.format}</TableCell>
                        <TableCell className="flex items-center gap-2">
                          {getScheduleIcon(report.schedule)}
                          <span className="capitalize">{report.schedule}</span>
                        </TableCell>
                        <TableCell>{formatDate(report.lastRun)}</TableCell>
                        <TableCell>{formatDate(report.nextRun)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
