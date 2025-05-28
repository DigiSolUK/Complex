"use client"

import type React from "react"

import { useState } from "react"
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  MessageSquare,
  BarChart,
  Server,
  Activity,
  Link,
  ChevronRight,
  FileText,
  PlusCircle,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface IncidentDetailProps {
  incident: any
}

export default function IncidentDetail({ incident }: IncidentDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [comment, setComment] = useState("")

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge className="bg-[#FFEEF0] text-[#D5001F] border-0 font-medium gap-1">
            <span className="w-2 h-2 bg-[#D5001F] rounded-full animate-pulse"></span>
            Critical
          </Badge>
        )
      case "high":
        return (
          <Badge className="bg-[#FFF4EC] text-[#FF6900] border-0 font-medium gap-1">
            <span className="w-2 h-2 bg-[#FF6900] rounded-full"></span>
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge className="bg-[#E6F2FF] text-[#006FCF] border-0 font-medium gap-1">
            <span className="w-2 h-2 bg-[#006FCF] rounded-full"></span>
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge className="bg-[#E6F9F1] text-[#00A859] border-0 font-medium gap-1">
            <span className="w-2 h-2 bg-[#00A859] rounded-full"></span>
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "triggered":
        return (
          <Badge className="bg-[#FFEEF0] text-[#D5001F] border-0 font-medium gap-1">
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            Triggered
          </Badge>
        )
      case "acknowledged":
        return (
          <Badge className="bg-[#FFF4EC] text-[#FF6900] border-0 font-medium gap-1">
            <Clock className="h-3.5 w-3.5 mr-1" />
            Acknowledged
          </Badge>
        )
      case "resolved":
        return (
          <Badge className="bg-[#E6F9F1] text-[#00A859] border-0 font-medium gap-1">
            <CheckCircle className="h-3.5 w-3.5 mr-1" />
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  const timeline = [
    {
      id: 1,
      type: "created",
      timestamp: new Date(incident.createdAt).getTime(),
      user: null,
      message: "Incident created automatically by monitoring system",
    },
    {
      id: 2,
      type: "alert",
      timestamp: new Date(incident.createdAt).getTime() + 60000,
      user: null,
      message: "Alert: Database CPU utilization exceeded 90% threshold",
    },
    {
      id: 3,
      type: "alert",
      timestamp: new Date(incident.createdAt).getTime() + 120000,
      user: null,
      message: "Alert: Database memory utilization exceeded 85% threshold",
    },
    {
      id: 4,
      type: "notification",
      timestamp: new Date(incident.createdAt).getTime() + 180000,
      user: null,
      message: "On-call team notified via SMS and email",
    },
  ]

  if (incident.status === "acknowledged" && incident.assignee) {
    timeline.push({
      id: 5,
      type: "acknowledged",
      timestamp: new Date(incident.createdAt).getTime() + 600000,
      user: incident.assignee,
      message: `Incident acknowledged by ${incident.assignee.name}`,
    })
  }

  if (incident.status === "resolved" && incident.assignee) {
    timeline.push({
      id: 5,
      type: "acknowledged",
      timestamp: new Date(incident.createdAt).getTime() + 600000,
      user: incident.assignee,
      message: `Incident acknowledged by ${incident.assignee.name}`,
    })
    timeline.push({
      id: 6,
      type: "resolved",
      timestamp: new Date(incident.createdAt).getTime() + 3600000,
      user: incident.assignee,
      message: `Incident resolved by ${incident.assignee.name}`,
    })
  }

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "created":
        return <AlertTriangle className="h-5 w-5 text-[#D5001F]" />
      case "alert":
        return <Bell className="h-5 w-5 text-[#FF6900]" />
      case "notification":
        return <MessageSquare className="h-5 w-5 text-[#006FCF]" />
      case "acknowledged":
        return <Clock className="h-5 w-5 text-[#FF6900]" />
      case "comment":
        return <MessageSquare className="h-5 w-5 text-[#006FCF]" />
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-[#00A859]" />
      default:
        return <Activity className="h-5 w-5 text-[#006FCF]" />
    }
  }

  const impactedServices = [
    {
      name: incident.service,
      status: "critical",
      type: "primary",
    },
    {
      name: "User Authentication",
      status: "degraded",
      type: "dependent",
    },
    {
      name: "Payment Processing",
      status: "operational",
      type: "dependent",
    },
  ]

  const getServiceStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-0 font-normal">Critical</Badge>
      case "degraded":
        return <Badge className="bg-[#FFF4EC] text-[#FF6900] border-0 font-normal">Degraded</Badge>
      case "operational":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-0 font-normal">Operational</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-[#00175A]">{incident.id}</h2>
          {getSeverityBadge(incident.severity)}
          {getStatusBadge(incident.status)}
        </div>
        <h3 className="text-xl">{incident.title}</h3>
        <div className="flex items-center gap-4 text-sm text-[#6B7280]">
          <div>Created: {formatDate(incident.createdAt)}</div>
          <div>Service: {incident.service}</div>
          <div>Alerts: {incident.alertCount}</div>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#F9FAFB] p-1 h-auto w-full justify-start">
          <TabsTrigger
            value="overview"
            className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00175A] data-[state=active]:font-medium"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="timeline"
            className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00175A] data-[state=active]:font-medium"
          >
            Timeline
          </TabsTrigger>
          <TabsTrigger
            value="alerts"
            className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00175A] data-[state=active]:font-medium"
          >
            Alerts ({incident.alertCount})
          </TabsTrigger>
          <TabsTrigger
            value="related"
            className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00175A] data-[state=active]:font-medium"
          >
            Related Items
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card className="border-[#E5E7EB] shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Server className="h-5 w-5 mr-2 text-[#006FCF]" />
                    Incident Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-[#6B7280]">
                      {incident.title}. This incident was automatically detected by our monitoring system when CPU
                      utilization exceeded the configured threshold of 90% for more than 5 minutes.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Impact</h4>
                    <p className="text-[#6B7280]">
                      This incident is causing degraded performance for users accessing the {incident.service}. Response
                      times have increased by 300% and some requests are timing out.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E5E7EB] shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-[#006FCF]" />
                    Service Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {impactedServices.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-md border border-[#E5E7EB]"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-full min-h-[40px] rounded-full ${
                              service.status === "critical"
                                ? "bg-[#D5001F]"
                                : service.status === "degraded"
                                  ? "bg-[#FF6900]"
                                  : "bg-[#00A859]"
                            }`}
                          />
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-sm text-[#6B7280]">
                              {service.type === "primary" ? "Primary affected service" : "Dependent service"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getServiceStatusBadge(service.status)}
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E5E7EB] shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart className="h-5 w-5 mr-2 text-[#006FCF]" />
                    Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] flex items-center justify-center bg-[#F9FAFB] rounded-md border border-[#E5E7EB]">
                    <p className="text-[#6B7280]">CPU & Memory utilization charts would appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-[#E5E7EB] shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Incident Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {incident.status === "triggered" && (
                    <Button className="w-full justify-start gap-2 bg-[#FFF4EC] text-[#FF6900] hover:bg-[#FFE4D1] hover:text-[#FF6900]">
                      <Clock className="h-4 w-4" />
                      Acknowledge Incident
                    </Button>
                  )}
                  {incident.status !== "resolved" && (
                    <Button className="w-full justify-start gap-2 bg-[#E6F9F1] text-[#00A859] hover:bg-[#D1F2E6] hover:text-[#00A859]">
                      <CheckCircle className="h-4 w-4" />
                      Resolve Incident
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
                  >
                    <User className="h-4 w-4" />
                    Assign to me
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Add Comment
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
                  >
                    <Link className="h-4 w-4" />
                    Link Related Items
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-[#E5E7EB] shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Assignment</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select defaultValue={incident.assignee ? "assigned" : "unassigned"}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="assigned">
                        {incident.assignee ? incident.assignee.name : "Assign to me"}
                      </SelectItem>
                      <SelectItem value="team">Database Team</SelectItem>
                      <SelectItem value="escalate">Escalate to L2</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card className="border-[#E5E7EB] shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Incident Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-[#6B7280]">Status</div>
                    <div className="font-medium capitalize">{incident.status}</div>

                    <div className="text-[#6B7280]">Severity</div>
                    <div className="font-medium capitalize">{incident.severity}</div>

                    <div className="text-[#6B7280]">Service</div>
                    <div className="font-medium">{incident.service}</div>

                    <div className="text-[#6B7280]">Created</div>
                    <div className="font-medium">{formatDate(incident.createdAt)}</div>

                    <div className="text-[#6B7280]">Source</div>
                    <div className="font-medium">Monitoring System</div>

                    <div className="text-[#6B7280]">Alert Count</div>
                    <div className="font-medium">{incident.alertCount}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#E5E7EB] shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Related Documentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-[#F9FAFB] cursor-pointer">
                    <FileText className="h-4 w-4 text-[#006FCF]" />
                    <span className="text-sm">Database Troubleshooting Guide</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-[#F9FAFB] cursor-pointer">
                    <FileText className="h-4 w-4 text-[#006FCF]" />
                    <span className="text-sm">Incident Response Playbook</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-[#F9FAFB] cursor-pointer">
                    <PlusCircle className="h-4 w-4 text-[#006FCF]" />
                    <span className="text-sm text-[#006FCF]">Add Documentation</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <Card className="border-[#E5E7EB] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Incident Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  {timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F9FAFB] border border-[#E5E7EB]">
                          {getTimelineIcon(event.type)}
                        </div>
                        {index < timeline.length - 1 && <div className="h-full w-px bg-[#E5E7EB] my-1"></div>}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{event.message}</div>
                          <div className="text-sm text-[#6B7280]">{formatDate(new Date(event.timestamp))}</div>
                        </div>
                        {event.user && (
                          <div className="mt-2 flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={event.user.avatar || "/placeholder.svg"} alt={event.user.name} />
                              <AvatarFallback className="bg-[#006FCF] text-white text-xs">
                                {event.user.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{event.user.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E5E7EB] pt-4">
                  <h4 className="font-medium mb-2">Add Comment</h4>
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Add a comment or update..."
                      className="min-h-[100px] border-[#E5E7EB]"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button className="bg-[#006FCF] hover:bg-[#00175A]">Add Comment</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <Card className="border-[#E5E7EB] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Related Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: incident.alertCount }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-md border border-[#E5E7EB] hover:bg-[#F9FAFB] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle
                        className={`h-5 w-5 ${index % 3 === 0 ? "text-[#D5001F]" : index % 3 === 1 ? "text-[#FF6900]" : "text-[#006FCF]"}`}
                      />
                      <div>
                        <div className="font-medium">
                          {index % 3 === 0
                            ? "CPU Utilization Exceeded 90%"
                            : index % 3 === 1
                              ? "Memory Utilization Exceeded 85%"
                              : "Disk I/O Latency Exceeded 100ms"}
                        </div>
                        <div className="text-sm text-[#6B7280]">
                          {formatDate(new Date(incident.createdAt).getTime() + index * 60000)}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#6B7280]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="related" className="mt-6">
          <Card className="border-[#E5E7EB] shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Related Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Related Incidents</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-md border border-[#E5E7EB] hover:bg-[#F9FAFB] cursor-pointer">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-[#FF6900]" />
                        <div>
                          <div className="font-medium">INC-1220: Database Performance Degradation</div>
                          <div className="text-sm text-[#6B7280]">Resolved 3 days ago</div>
                        </div>
                      </div>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-0 font-normal">Resolved</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-md border border-[#E5E7EB] hover:bg-[#F9FAFB] cursor-pointer">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-[#D5001F]" />
                        <div>
                          <div className="font-medium">INC-1198: Database Cluster Failover</div>
                          <div className="text-sm text-[#6B7280]">Resolved 1 week ago</div>
                        </div>
                      </div>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-0 font-normal">Resolved</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Related Changes</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-md border border-[#E5E7EB] hover:bg-[#F9FAFB] cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Activity className="h-5 w-5 text-[#006FCF]" />
                        <div>
                          <div className="font-medium">CHG-567: Database Configuration Update</div>
                          <div className="text-sm text-[#6B7280]">Implemented yesterday</div>
                        </div>
                      </div>
                      <Badge className="bg-[#E6F2FF] text-[#006FCF] border-0 font-normal">Completed</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Related Assets</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-md border border-[#E5E7EB] hover:bg-[#F9FAFB] cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Server className="h-5 w-5 text-[#006FCF]" />
                        <div>
                          <div className="font-medium">db-cluster-01</div>
                          <div className="text-sm text-[#6B7280]">Primary Database Cluster</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[#6B7280]" />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-md border border-[#E5E7EB] hover:bg-[#F9FAFB] cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Server className="h-5 w-5 text-[#006FCF]" />
                        <div>
                          <div className="font-medium">db-node-03</div>
                          <div className="text-sm text-[#6B7280]">Database Node</div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-[#6B7280]" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Bell(props: React.ComponentProps<typeof AlertTriangle>) {
  return <AlertTriangle {...props} />
}
