"use client"

import { useState } from "react"
import { AlertTriangle, Bell, CheckCircle, Clock, Link2, MessageSquare, Send, User, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface IncidentDetailProps {
  incident: any
}

export default function IncidentDetail({ incident }: IncidentDetailProps) {
  const [newNote, setNewNote] = useState("")

  const timelineEvents = [
    {
      id: 1,
      type: "alert",
      title: "Alert triggered: Database CPU Utilization > 90%",
      timestamp: "2025-05-27T16:30:00Z",
      source: "Datadog",
    },
    {
      id: 2,
      type: "alert",
      title: "Alert triggered: Database Connection Pool Exhausted",
      timestamp: "2025-05-27T16:30:15Z",
      source: "CloudWatch",
    },
    {
      id: 3,
      type: "incident",
      title: "Incident created from correlated alerts",
      timestamp: "2025-05-27T16:30:30Z",
    },
    {
      id: 4,
      type: "alert",
      title: "Alert triggered: Database Read Replica Lag > 120s",
      timestamp: "2025-05-27T16:31:00Z",
      source: "Prometheus",
    },
    {
      id: 5,
      type: "notification",
      title: "On-call engineer notified via Slack and SMS",
      timestamp: "2025-05-27T16:31:30Z",
    },
    {
      id: 6,
      type: "alert",
      title: "Alert triggered: API Error Rate > 5%",
      timestamp: "2025-05-27T16:32:00Z",
      source: "New Relic",
    },
    {
      id: 7,
      type: "alert",
      title: "Alert correlated to incident",
      timestamp: "2025-05-27T16:32:15Z",
    },
    {
      id: 8,
      type: "escalation",
      title: "Escalation: No acknowledgment after 5 minutes",
      timestamp: "2025-05-27T16:35:30Z",
    },
  ]

  const relatedAlerts = [
    {
      id: "ALT-4567",
      title: "Database CPU Utilization > 90%",
      source: "Datadog",
      timestamp: "2025-05-27T16:30:00Z",
      severity: "critical",
    },
    {
      id: "ALT-4568",
      title: "Database Connection Pool Exhausted",
      source: "CloudWatch",
      timestamp: "2025-05-27T16:30:15Z",
      severity: "critical",
    },
    {
      id: "ALT-4569",
      title: "Database Read Replica Lag > 120s",
      source: "Prometheus",
      timestamp: "2025-05-27T16:31:00Z",
      severity: "high",
    },
    {
      id: "ALT-4570",
      title: "API Error Rate > 5%",
      source: "New Relic",
      timestamp: "2025-05-27T16:32:00Z",
      severity: "high",
    },
    {
      id: "ALT-4571",
      title: "Database Query Latency > 500ms",
      source: "Datadog",
      timestamp: "2025-05-27T16:33:00Z",
      severity: "medium",
    },
    {
      id: "ALT-4572",
      title: "Cache Hit Ratio < 80%",
      source: "CloudWatch",
      timestamp: "2025-05-27T16:34:00Z",
      severity: "medium",
    },
    {
      id: "ALT-4573",
      title: "Database Connections > 85% of limit",
      source: "Prometheus",
      timestamp: "2025-05-27T16:35:00Z",
      severity: "medium",
    },
  ]

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

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <Bell className="h-4 w-4 text-[#cc5555]" />
      case "incident":
        return <AlertTriangle className="h-4 w-4 text-[#cc5555]" />
      case "notification":
        return <MessageSquare className="h-4 w-4 text-[#5588cc]" />
      case "note":
        return <MessageSquare className="h-4 w-4 text-[#8855cc]" />
      case "acknowledgment":
        return <User className="h-4 w-4 text-[#cc8855]" />
      case "escalation":
        return <Users className="h-4 w-4 text-[#cc66aa]" />
      case "resolution":
        return <CheckCircle className="h-4 w-4 text-[#55aa99]" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-[#ff9999] text-[#cc5555] border-0">Critical</Badge>
      case "high":
        return <Badge className="bg-[#ffcc99] text-[#cc8855] border-0">High</Badge>
      case "medium":
        return <Badge className="bg-[#ffee99] text-[#ccbb55] border-0">Medium</Badge>
      case "low":
        return <Badge className="bg-[#99ddcc] text-[#55aa99] border-0">Low</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const handleSubmitNote = () => {
    if (newNote.trim()) {
      // In a real app, this would add the note to the incident
      console.log("Adding note:", newNote)
      setNewNote("")
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{incident.id}</h2>
          <Badge variant="destructive">Critical</Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="mr-2 h-2 w-2 rounded-full bg-destructive"></span>
            Triggered
          </div>
        </div>
        <h3 className="text-xl">{incident.title}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div>Service: {incident.service}</div>
          <div>Created: {formatDate(incident.createdAt)}</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="alerts">Related Alerts ({relatedAlerts.length})</TabsTrigger>
              <TabsTrigger value="runbooks">Runbooks</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="border rounded-md mt-6">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Incident Timeline</h3>
              </div>
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {timelineEvents.map((event) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="mt-1 h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                        {getTimelineIcon(event.type)}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">{event.title}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>{formatDate(event.timestamp)}</span>
                          {event.source && (
                            <>
                              <span>•</span>
                              <span>{event.source}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Add a note to the incident..."
                    className="min-h-[80px]"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                </div>
                <div className="flex justify-end mt-2">
                  <Button onClick={handleSubmitNote} className="gap-1">
                    <Send className="h-4 w-4" />
                    Add Note
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="alerts" className="border rounded-md mt-6">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Related Alerts</h3>
              </div>
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-3">
                  {relatedAlerts.map((alert) => (
                    <Card key={alert.id}>
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{alert.id}</span>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDate(alert.timestamp)}</span>
                        </div>
                        <CardTitle className="text-base">{alert.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Source: {alert.source}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="runbooks" className="border rounded-md mt-6 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Suggested Runbooks</h3>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Link2 className="h-4 w-4" />
                    Add Runbook
                  </Button>
                </div>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">Database High CPU Troubleshooting</CardTitle>
                    <CardDescription>Steps to diagnose and resolve database CPU issues</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm space-y-2">
                      <p>1. Check for long-running queries using the monitoring dashboard</p>
                      <p>2. Examine query plans for inefficient execution</p>
                      <p>3. Look for connection pool exhaustion</p>
                      <p>4. Consider scaling up database resources if needed</p>
                    </div>
                    <Button variant="link" className="p-0 h-auto mt-2">
                      View full runbook
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base">API Error Rate Troubleshooting</CardTitle>
                    <CardDescription>Steps to diagnose and resolve API errors</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-sm space-y-2">
                      <p>1. Check API logs for specific error messages</p>
                      <p>2. Verify database connectivity</p>
                      <p>3. Check for recent deployments or changes</p>
                      <p>4. Examine downstream service dependencies</p>
                    </div>
                    <Button variant="link" className="p-0 h-auto mt-2">
                      View full runbook
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Incident Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start gap-2 bg-[#99ccff] text-[#5588cc] hover:bg-[#b3daff] hover:text-[#5588cc]">
                <User className="h-4 w-4" />
                Acknowledge
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 border-[#cc99ff] text-[#8855cc] hover:bg-[#e6d9ff] hover:text-[#8855cc]"
              >
                <Users className="h-4 w-4" />
                Escalate
              </Button>
              <Button className="w-full justify-start gap-2 bg-[#99ddcc] text-[#55aa99] hover:bg-[#b3e6dd] hover:text-[#55aa99]">
                <CheckCircle className="h-4 w-4" />
                Resolve
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <Select defaultValue="unassigned">
                <SelectTrigger>
                  <SelectValue placeholder="Assign to..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="me">Assign to me</SelectItem>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="michael">Michael Chen</SelectItem>
                  <SelectItem value="alex">Alex Rodriguez</SelectItem>
                  <SelectItem value="emma">Emma Wilson</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Status</div>
                <div className="font-medium">Triggered</div>

                <div className="text-muted-foreground">Priority</div>
                <div className="font-medium">P1 - Critical</div>

                <div className="text-muted-foreground">Service</div>
                <div className="font-medium">{incident.service}</div>

                <div className="text-muted-foreground">Created</div>
                <div className="font-medium">{formatDate(incident.createdAt)}</div>

                <div className="text-muted-foreground">Alert Count</div>
                <div className="font-medium">{incident.alertCount}</div>

                <div className="text-muted-foreground">Team</div>
                <div className="font-medium">Database Team</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Notify</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slack-db-team">#db-team (Slack)</SelectItem>
                  <SelectItem value="slack-incidents">#incidents (Slack)</SelectItem>
                  <SelectItem value="teams-sre">SRE Team (Teams)</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full">
                Send Notification
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
