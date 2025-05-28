"use client"

import { useState } from "react"
import {
  Filter,
  MoreHorizontal,
  User,
  AlertTriangle,
  Clock,
  CheckCircle,
  Bell,
  Tag,
  Activity,
  Search,
  ExternalLink,
} from "lucide-react"
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
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import IncidentDetail from "@/components/incident-detail"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>(["critical", "high", "medium", "low"])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(["triggered", "acknowledged", "resolved"])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<"all" | "today" | "week" | "month">("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  // List of unique services for filtering
  const services = Array.from(new Set(incidents.map((incident) => incident.service)))

  const handleSeverityChange = (severity: string) => {
    setSelectedSeverities((current) =>
      current.includes(severity) ? current.filter((s) => s !== severity) : [...current, severity],
    )
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatuses((current) =>
      current.includes(status) ? current.filter((s) => s !== status) : [...current, status],
    )
  }

  const handleServiceChange = (service: string) => {
    setSelectedServices((current) =>
      current.includes(service) ? current.filter((s) => s !== service) : [...current, service],
    )
  }

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident)
    setIsDialogOpen(true)
  }

  // Filter incidents based on search and filters
  const filteredIncidents = incidents.filter((incident) => {
    // Search query
    const matchesSearch =
      searchQuery === "" ||
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.service.toLowerCase().includes(searchQuery.toLowerCase())

    // Severity filter
    const matchesSeverity = selectedSeverities.includes(incident.severity)

    // Status filter
    const matchesStatus = selectedStatuses.includes(incident.status)

    // Service filter
    const matchesService = selectedServices.length === 0 || selectedServices.includes(incident.service)

    // Date filter
    let matchesDate = true
    const incidentDate = new Date(incident.createdAt)
    const now = new Date()

    if (dateRange === "today") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      matchesDate = incidentDate >= today
    } else if (dateRange === "week") {
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 7)
      matchesDate = incidentDate >= weekAgo
    } else if (dateRange === "month") {
      const monthAgo = new Date(now)
      monthAgo.setMonth(now.getMonth() - 1)
      matchesDate = incidentDate >= monthAgo
    }

    return matchesSearch && matchesSeverity && matchesStatus && matchesService && matchesDate
  })

  const displayedIncidents = limit ? filteredIncidents.slice(0, limit) : filteredIncidents

  // Update getSeverityBadge function
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

  // Update getStatusBadge function
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "triggered":
        return (
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#D5001F]" />
            <span className="text-[#D5001F] font-medium">Triggered</span>
          </div>
        )
      case "acknowledged":
        return (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[#FF6900]" />
            <span className="text-[#FF6900] font-medium">Acknowledged</span>
          </div>
        )
      case "resolved":
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-[#00A859]" />
            <span className="text-[#00A859] font-medium">Resolved</span>
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
    <TooltipProvider>
      <div className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-[#E5E7EB] gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search incidents..."
              className="pl-9 max-w-md bg-[#F9FAFB] border-[#E5E7EB]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={dateRange}
              onValueChange={(value: "all" | "today" | "week" | "month") => setDateRange(value)}
            >
              <SelectTrigger className="w-[140px] bg-white border-[#E5E7EB]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Past week</SelectItem>
                <SelectItem value="month">Past month</SelectItem>
              </SelectContent>
            </Select>
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1 border-[#E5E7EB]">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Filter</span>
                  {(selectedSeverities.length !== 4 ||
                    selectedStatuses.length !== 3 ||
                    selectedServices.length > 0) && (
                    <Badge className="ml-1 bg-[#006FCF] hover:bg-[#006FCF]">Active</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Tag className="h-4 w-4" /> Severity
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {["critical", "high", "medium", "low"].map((severity) => (
                        <div key={severity} className="flex items-center space-x-2">
                          <Checkbox
                            id={`severity-${severity}`}
                            checked={selectedSeverities.includes(severity)}
                            onCheckedChange={() => handleSeverityChange(severity)}
                          />
                          <label
                            htmlFor={`severity-${severity}`}
                            className="flex items-center text-sm font-medium capitalize"
                          >
                            {getSeverityBadge(severity)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" /> Status
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {["triggered", "acknowledged", "resolved"].map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={() => handleStatusChange(status)}
                          />
                          <label htmlFor={`status-${status}`} className="flex items-center text-sm font-medium">
                            {getStatusBadge(status)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Bell className="h-4 w-4" /> Service
                    </h4>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {services.map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={`service-${service.replace(/\s+/g, "-").toLowerCase()}`}
                            checked={selectedServices.includes(service)}
                            onCheckedChange={() => handleServiceChange(service)}
                          />
                          <label
                            htmlFor={`service-${service.replace(/\s+/g, "-").toLowerCase()}`}
                            className="text-sm font-medium"
                          >
                            {service}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSeverities(["critical", "high", "medium", "low"])
                        setSelectedStatuses(["triggered", "acknowledged", "resolved"])
                        setSelectedServices([])
                        setDateRange("all")
                      }}
                    >
                      Reset
                    </Button>
                    <Button size="sm" className="bg-[#006FCF] hover:bg-[#00175A]" onClick={() => setFilterOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F9FAFB] hover:bg-[#F9FAFB]">
                <TableHead className="font-medium text-[#6B7280]">Incident</TableHead>
                <TableHead className="font-medium text-[#6B7280]">Service</TableHead>
                <TableHead className="font-medium text-[#6B7280]">Severity</TableHead>
                <TableHead className="font-medium text-[#6B7280]">Status</TableHead>
                <TableHead className="font-medium text-[#6B7280]">Created</TableHead>
                <TableHead className="font-medium text-[#6B7280]">Assignee</TableHead>
                <TableHead className="font-medium text-[#6B7280]">Alerts</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedIncidents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-[#6B7280]">
                      <AlertTriangle className="h-8 w-8 mb-2" />
                      <h3 className="font-medium text-lg mb-1">No incidents found</h3>
                      <p>Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                displayedIncidents.map((incident) => (
                  <TableRow
                    key={incident.id}
                    className="cursor-pointer hover:bg-[#F9FAFB] border-b border-[#E5E7EB]"
                    onClick={() => handleIncidentClick(incident)}
                  >
                    <TableCell>
                      <div className="font-semibold text-[#00175A]">{incident.id}</div>
                      <div className="text-sm text-[#6B7280] truncate max-w-[200px]">{incident.title}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-[#F9FAFB] font-normal border-[#E5E7EB]">
                        {incident.service}
                      </Badge>
                    </TableCell>
                    <TableCell>{getSeverityBadge(incident.severity)}</TableCell>
                    <TableCell>{getStatusBadge(incident.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{formatDate(incident.createdAt)}</span>
                        <span className="text-xs text-[#6B7280]">{calculateTimeAgo(incident.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {incident.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={incident.assignee.avatar || "/placeholder.svg"}
                              alt={incident.assignee.name}
                            />
                            <AvatarFallback className="bg-[#006FCF] text-white text-xs">
                              {incident.assignee.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{incident.assignee.name}</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="gap-1 bg-[#F9FAFB] border-[#E5E7EB]">
                          <User className="h-3 w-3" />
                          <span>Unassigned</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-[#E6F2FF] text-[#006FCF] border-[#006FCF]">{incident.alertCount}</Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Actions</p>
                          </TooltipContent>
                        </Tooltip>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleIncidentClick(incident)}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open Ticket
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Acknowledge
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            Assign to me
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Bell className="mr-2 h-4 w-4" />
                            Escalate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Resolve
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {limit && displayedIncidents.length > 0 && displayedIncidents.length < filteredIncidents.length && (
          <div className="p-4 text-center border-t border-[#E5E7EB]">
            <Button variant="outline" className="text-[#006FCF] border-[#E5E7EB]">
              View All {filteredIncidents.length} Incidents
            </Button>
          </div>
        )}
      </div>

      {/* Separate Dialog component for better control */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          {selectedIncident && <IncidentDetail incident={selectedIncident} />}
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}

// Helper function to calculate time ago
function calculateTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60)
    return `${minutesAgo} ${minutesAgo === 1 ? "minute" : "minutes"} ago`
  } else if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600)
    return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`
  } else {
    const daysAgo = Math.floor(secondsAgo / 86400)
    return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`
  }
}
