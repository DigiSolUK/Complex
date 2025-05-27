"use client"

import { useState } from "react"
import { ChevronDown, Filter, MoreHorizontal, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import IncidentDetail from "@/components/incident-detail"

interface Incident {
  id: string
  title: string
  service: string
  severity: "critical" | "high" | "medium" | "low"
  status: "triggered" | "acknowledged" | "resolved"
  createdAt: string
  assignee?: {
    name: string
    avatar?: string
    initials: string
  }
  alertCount: number
}

interface IncidentTableProps {
  limit?: number
}

export default function IncidentTable({ limit }: IncidentTableProps) {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)

  const incidents: Incident[] = [
    {
      id: "INC-1234",
      title: "Database CPU Utilization Exceeding Threshold",
      service: "Database Cluster",
      severity: "critical",
      status: "triggered",
      createdAt: "2025-05-27T16:30:00Z",
      alertCount: 8,
    },
    {
      id: "INC-1233",
      title: "API Gateway High Latency",
      service: "API Services",
      severity: "high",
      status: "acknowledged",
      createdAt: "2025-05-27T15:45:00Z",
      assignee: {
        name: "Sarah Johnson",
        avatar: "/diverse-woman-portrait.png",
        initials: "SJ",
      },
      alertCount: 5,
    },
    {
      id: "INC-1232",
      title: "Payment Processing Service Errors",
      service: "Payment Gateway",
      severity: "high",
      status: "triggered",
      createdAt: "2025-05-27T14:20:00Z",
      alertCount: 3,
    },
    {
      id: "INC-1231",
      title: "CDN Cache Miss Rate Increase",
      service: "Content Delivery",
      severity: "medium",
      status: "acknowledged",
      createdAt: "2025-05-27T13:10:00Z",
      assignee: {
        name: "Michael Chen",
        avatar: "/thoughtful-man.png",
        initials: "MC",
      },
      alertCount: 2,
    },
    {
      id: "INC-1230",
      title: "Authentication Service Slow Response",
      service: "Auth System",
      severity: "medium",
      status: "triggered",
      createdAt: "2025-05-27T12:05:00Z",
      alertCount: 4,
    },
    {
      id: "INC-1229",
      title: "Storage Capacity Warning",
      service: "Object Storage",
      severity: "low",
      status: "acknowledged",
      createdAt: "2025-05-27T10:30:00Z",
      assignee: {
        name: "Alex Rodriguez",
        avatar: "/diverse-group.png",
        initials: "AR",
      },
      alertCount: 1,
    },
    {
      id: "INC-1228",
      title: "Kubernetes Node Memory Pressure",
      service: "Container Platform",
      severity: "medium",
      status: "resolved",
      createdAt: "2025-05-27T09:15:00Z",
      assignee: {
        name: "Emma Wilson",
        avatar: "/diverse-woman-portrait.png",
        initials: "EW",
      },
      alertCount: 3,
    },
  ]

  const displayedIncidents = limit ? incidents.slice(0, limit) : incidents

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "triggered":
        return (
          <div className="flex items-center">
            <span className="mr-2 h-2 w-2 rounded-full bg-[#ff9999]"></span>
            <span className="text-[#cc5555] font-medium">Triggered</span>
          </div>
        )
      case "acknowledged":
        return (
          <div className="flex items-center">
            <span className="mr-2 h-2 w-2 rounded-full bg-[#ffcc99]"></span>
            <span className="text-[#cc8855] font-medium">Acknowledged</span>
          </div>
        )
      case "resolved":
        return (
          <div className="flex items-center">
            <span className="mr-2 h-2 w-2 rounded-full bg-[#99ddcc]"></span>
            <span className="text-[#55aa99] font-medium">Resolved</span>
          </div>
        )
      default:
        return <div>{status}</div>
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
    <>
      <div className="rounded-md border">
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-1 items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Incident</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Alerts</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedIncidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No incidents found.
                </TableCell>
              </TableRow>
            ) : (
              displayedIncidents.map((incident) => (
                <TableRow key={incident.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium" onClick={() => setSelectedIncident(incident)}>
                    <Dialog>
                      <DialogTrigger asChild>
                        <div>
                          <div>{incident.id}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">{incident.title}</div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <IncidentDetail incident={incident} />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>{incident.service}</TableCell>
                  <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                  <TableCell>{getStatusBadge(incident.status)}</TableCell>
                  <TableCell>{formatDate(incident.createdAt)}</TableCell>
                  <TableCell>
                    {incident.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={incident.assignee.avatar || "/placeholder.svg"}
                            alt={incident.assignee.name}
                          />
                          <AvatarFallback>{incident.assignee.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{incident.assignee.name}</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <User className="h-3 w-3" />
                        <span>Unassigned</span>
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{incident.alertCount}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Acknowledge</DropdownMenuItem>
                        <DropdownMenuItem>Assign to me</DropdownMenuItem>
                        <DropdownMenuItem>Escalate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Resolve</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
