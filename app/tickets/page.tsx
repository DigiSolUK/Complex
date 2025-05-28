"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  User,
  MessageSquare,
  FileText,
  ExternalLink,
} from "lucide-react"
import IncidentDetail from "@/components/incident-detail"

export default function TicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const tickets = [
    {
      id: "TKT-2345",
      title: "Database CPU Utilization Exceeding Threshold",
      type: "incident",
      status: "open",
      priority: "critical",
      createdAt: "2025-05-27T16:30:00Z",
      updatedAt: "2025-05-27T17:30:00Z",
      assignee: null,
      service: "Database Cluster",
      comments: 3,
    },
    {
      id: "TKT-2344",
      title: "API Gateway High Latency",
      type: "incident",
      status: "in-progress",
      priority: "high",
      createdAt: "2025-05-27T15:45:00Z",
      updatedAt: "2025-05-27T16:45:00Z",
      assignee: {
        name: "Sarah Johnson",
        avatar: "/diverse-woman-portrait.png",
        initials: "SJ",
      },
      service: "API Services",
      comments: 5,
    },
    {
      id: "TKT-2343",
      title: "Request for additional database capacity",
      type: "request",
      status: "open",
      priority: "medium",
      createdAt: "2025-05-27T14:30:00Z",
      updatedAt: "2025-05-27T14:30:00Z",
      assignee: null,
      service: "Database Cluster",
      comments: 0,
    },
    {
      id: "TKT-2342",
      title: "New user account creation for finance team",
      type: "request",
      status: "in-progress",
      priority: "low",
      createdAt: "2025-05-27T13:15:00Z",
      updatedAt: "2025-05-27T14:20:00Z",
      assignee: {
        name: "Michael Chen",
        avatar: "/thoughtful-man.png",
        initials: "MC",
      },
      service: "Identity Management",
      comments: 2,
    },
    {
      id: "TKT-2341",
      title: "Payment Processing Service Errors",
      type: "incident",
      status: "open",
      priority: "high",
      createdAt: "2025-05-27T12:20:00Z",
      updatedAt: "2025-05-27T13:10:00Z",
      assignee: null,
      service: "Payment Gateway",
      comments: 4,
    },
    {
      id: "TKT-2340",
      title: "Request for new API endpoint for customer data",
      type: "request",
      status: "closed",
      priority: "medium",
      createdAt: "2025-05-27T11:05:00Z",
      updatedAt: "2025-05-27T15:30:00Z",
      assignee: {
        name: "Emma Wilson",
        avatar: "/diverse-woman-portrait.png",
        initials: "EW",
      },
      service: "API Services",
      comments: 7,
    },
    {
      id: "TKT-2339",
      title: "Storage Capacity Warning",
      type: "incident",
      status: "closed",
      priority: "low",
      createdAt: "2025-05-27T10:30:00Z",
      updatedAt: "2025-05-27T12:45:00Z",
      assignee: {
        name: "Alex Rodriguez",
        avatar: "/diverse-group.png",
        initials: "AR",
      },
      service: "Object Storage",
      comments: 3,
    },
  ]

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.service.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleTicketClick = (ticket: any) => {
    setSelectedTicket(ticket)
    setIsDialogOpen(true)
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
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
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-0 font-medium">Open</Badge>
      case "in-progress":
        return <Badge className="bg-[#E6F2FF] text-[#006FCF] border-0 font-medium">In Progress</Badge>
      case "closed":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-0 font-medium">Closed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "incident":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-0 font-medium">Incident</Badge>
      case "request":
        return <Badge className="bg-[#E6F2FF] text-[#006FCF] border-0 font-medium">Request</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#00175A]">Tickets</h1>
        <p className="text-muted-foreground">Manage all tickets, incidents, and service requests</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <FileText className="h-4 w-4 text-[#006FCF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#D5001F]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">18 incidents, 24 requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-[#FF6900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2h</div>
            <p className="text-xs text-muted-foreground">-8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved This Week</CardTitle>
            <CheckCircle className="h-4 w-4 text-[#00A859]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">37</div>
            <p className="text-xs text-muted-foreground">15 incidents, 22 requests</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList className="bg-[#F7F8F9]">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">
                All Tickets
              </TabsTrigger>
              <TabsTrigger value="incidents" className="data-[state=active]:bg-white">
                Incidents
              </TabsTrigger>
              <TabsTrigger value="requests" className="data-[state=active]:bg-white">
                Requests
              </TabsTrigger>
              <TabsTrigger value="closed" className="data-[state=active]:bg-white">
                Closed
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button className="gap-1 bg-[#006FCF] hover:bg-[#00175A] text-white">
                <Plus className="h-4 w-4" />
                Create Ticket
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 mb-4 gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                className="pl-9 max-w-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="newest">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="updated">Last updated</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>View</span>
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="rounded-lg overflow-hidden border border-[#ECEDEE]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F7F8F9]">
                    <th className="text-left p-3 font-medium">Ticket</th>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Priority</th>
                    <th className="text-left p-3 font-medium">Service</th>
                    <th className="text-left p-3 font-medium">Assignee</th>
                    <th className="text-left p-3 font-medium">Updated</th>
                    <th className="text-left p-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-[#ECEDEE] hover:bg-[#F7F8F9] cursor-pointer"
                      onClick={() => handleTicketClick(ticket)}
                    >
                      <td className="p-3">
                        <div className="font-semibold text-[#00175A]">{ticket.id}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">{ticket.title}</div>
                      </td>
                      <td className="p-3">{getTypeBadge(ticket.type)}</td>
                      <td className="p-3">{getStatusBadge(ticket.status)}</td>
                      <td className="p-3">{getPriorityBadge(ticket.priority)}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="bg-[#F7F8F9] font-normal">
                          {ticket.service}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {ticket.assignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={ticket.assignee.avatar || "/placeholder.svg"}
                                alt={ticket.assignee.name}
                              />
                              <AvatarFallback className="bg-[#006FCF] text-white text-xs">
                                {ticket.assignee.initials}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{ticket.assignee.name}</span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="gap-1 bg-[#F7F8F9]">
                            <User className="h-3 w-3" />
                            <span>Unassigned</span>
                          </Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="text-sm">{formatDate(ticket.updatedAt)}</div>
                        <div className="text-xs text-muted-foreground">{calculateTimeAgo(ticket.updatedAt)}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {ticket.comments > 0 && (
                            <Badge variant="outline" className="gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {ticket.comments}
                            </Badge>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleTicketClick(ticket)
                                }}
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open Ticket
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                <User className="mr-2 h-4 w-4" />
                                Assign to me
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                {ticket.status === "closed" ? "Reopen" : "Close"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="incidents" className="mt-0">
            <div className="rounded-lg overflow-hidden border border-[#ECEDEE]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F7F8F9]">
                    <th className="text-left p-3 font-medium">Ticket</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Priority</th>
                    <th className="text-left p-3 font-medium">Service</th>
                    <th className="text-left p-3 font-medium">Assignee</th>
                    <th className="text-left p-3 font-medium">Updated</th>
                    <th className="text-left p-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets
                    .filter((ticket) => ticket.type === "incident")
                    .map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="border-b border-[#ECEDEE] hover:bg-[#F7F8F9] cursor-pointer"
                        onClick={() => handleTicketClick(ticket)}
                      >
                        <td className="p-3">
                          <div className="font-semibold text-[#00175A]">{ticket.id}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">{ticket.title}</div>
                        </td>
                        <td className="p-3">{getStatusBadge(ticket.status)}</td>
                        <td className="p-3">{getPriorityBadge(ticket.priority)}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="bg-[#F7F8F9] font-normal">
                            {ticket.service}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {ticket.assignee ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={ticket.assignee.avatar || "/placeholder.svg"}
                                  alt={ticket.assignee.name}
                                />
                                <AvatarFallback className="bg-[#006FCF] text-white text-xs">
                                  {ticket.assignee.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{ticket.assignee.name}</span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="gap-1 bg-[#F7F8F9]">
                              <User className="h-3 w-3" />
                              <span>Unassigned</span>
                            </Badge>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="text-sm">{formatDate(ticket.updatedAt)}</div>
                          <div className="text-xs text-muted-foreground">{calculateTimeAgo(ticket.updatedAt)}</div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {ticket.comments > 0 && (
                              <Badge variant="outline" className="gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {ticket.comments}
                              </Badge>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleTicketClick(ticket)
                                  }}
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Open Ticket
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                  <User className="mr-2 h-4 w-4" />
                                  Assign to me
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  {ticket.status === "closed" ? "Reopen" : "Close"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-0">
            <div className="rounded-lg overflow-hidden border border-[#ECEDEE]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F7F8F9]">
                    <th className="text-left p-3 font-medium">Ticket</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Priority</th>
                    <th className="text-left p-3 font-medium">Service</th>
                    <th className="text-left p-3 font-medium">Assignee</th>
                    <th className="text-left p-3 font-medium">Updated</th>
                    <th className="text-left p-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets
                    .filter((ticket) => ticket.type === "request")
                    .map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="border-b border-[#ECEDEE] hover:bg-[#F7F8F9] cursor-pointer"
                        onClick={() => handleTicketClick(ticket)}
                      >
                        <td className="p-3">
                          <div className="font-semibold text-[#00175A]">{ticket.id}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">{ticket.title}</div>
                        </td>
                        <td className="p-3">{getStatusBadge(ticket.status)}</td>
                        <td className="p-3">{getPriorityBadge(ticket.priority)}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="bg-[#F7F8F9] font-normal">
                            {ticket.service}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {ticket.assignee ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={ticket.assignee.avatar || "/placeholder.svg"}
                                  alt={ticket.assignee.name}
                                />
                                <AvatarFallback className="bg-[#006FCF] text-white text-xs">
                                  {ticket.assignee.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{ticket.assignee.name}</span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="gap-1 bg-[#F7F8F9]">
                              <User className="h-3 w-3" />
                              <span>Unassigned</span>
                            </Badge>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="text-sm">{formatDate(ticket.updatedAt)}</div>
                          <div className="text-xs text-muted-foreground">{calculateTimeAgo(ticket.updatedAt)}</div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {ticket.comments > 0 && (
                              <Badge variant="outline" className="gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {ticket.comments}
                              </Badge>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleTicketClick(ticket)
                                  }}
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Open Ticket
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                  <User className="mr-2 h-4 w-4" />
                                  Assign to me
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  {ticket.status === "closed" ? "Reopen" : "Close"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="closed" className="mt-0">
            <div className="rounded-lg overflow-hidden border border-[#ECEDEE]">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F7F8F9]">
                    <th className="text-left p-3 font-medium">Ticket</th>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Priority</th>
                    <th className="text-left p-3 font-medium">Service</th>
                    <th className="text-left p-3 font-medium">Assignee</th>
                    <th className="text-left p-3 font-medium">Closed</th>
                    <th className="text-left p-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets
                    .filter((ticket) => ticket.status === "closed")
                    .map((ticket) => (
                      <tr
                        key={ticket.id}
                        className="border-b border-[#ECEDEE] hover:bg-[#F7F8F9] cursor-pointer"
                        onClick={() => handleTicketClick(ticket)}
                      >
                        <td className="p-3">
                          <div className="font-semibold text-[#00175A]">{ticket.id}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">{ticket.title}</div>
                        </td>
                        <td className="p-3">{getTypeBadge(ticket.type)}</td>
                        <td className="p-3">{getPriorityBadge(ticket.priority)}</td>
                        <td className="p-3">
                          <Badge variant="outline" className="bg-[#F7F8F9] font-normal">
                            {ticket.service}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {ticket.assignee ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={ticket.assignee.avatar || "/placeholder.svg"}
                                  alt={ticket.assignee.name}
                                />
                                <AvatarFallback className="bg-[#006FCF] text-white text-xs">
                                  {ticket.assignee.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{ticket.assignee.name}</span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="gap-1 bg-[#F7F8F9]">
                              <User className="h-3 w-3" />
                              <span>Unassigned</span>
                            </Badge>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="text-sm">{formatDate(ticket.updatedAt)}</div>
                          <div className="text-xs text-muted-foreground">{calculateTimeAgo(ticket.updatedAt)}</div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {ticket.comments > 0 && (
                              <Badge variant="outline" className="gap-1">
                                <MessageSquare className="h-3 w-3" />
                                {ticket.comments}
                              </Badge>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleTicketClick(ticket)
                                  }}
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Open Ticket
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Reopen
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Separate Dialog component for better control */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          {selectedTicket && selectedTicket.type === "incident" ? (
            <IncidentDetail incident={selectedTicket} />
          ) : (
            selectedTicket && (
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-[#00175A]">{selectedTicket.id}</h2>
                    {getTypeBadge(selectedTicket.type)}
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  <h3 className="text-xl">{selectedTicket.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div>Service: {selectedTicket.service}</div>
                    <div>Created: {formatDate(selectedTicket.createdAt)}</div>
                    <div>Updated: {formatDate(selectedTicket.updatedAt)}</div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Request Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          This is a service request. Additional details would be shown here.
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card className="border-[#F7F8F9]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Ticket Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button className="w-full justify-start gap-2 bg-[#E6F2FF] text-[#006FCF] hover:bg-[#CCE5FF] hover:text-[#006FCF]">
                          <User className="h-4 w-4" />
                          Assign to me
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start gap-2 border-[#E6F2FF] text-[#006FCF] hover:bg-[#E6F2FF] hover:text-[#006FCF]"
                        >
                          <MessageSquare className="h-4 w-4" />
                          Add Comment
                        </Button>
                        <Button className="w-full justify-start gap-2 bg-[#E6F9F1] text-[#00A859] hover:bg-[#CCF2E3] hover:text-[#00A859]">
                          <CheckCircle className="h-4 w-4" />
                          {selectedTicket.status === "closed" ? "Reopen Ticket" : "Close Ticket"}
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-[#F7F8F9]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Assignment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Select
                          defaultValue={
                            selectedTicket.assignee
                              ? selectedTicket.assignee.name.toLowerCase().replace(/\s+/g, "-")
                              : "unassigned"
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Assign to..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            <SelectItem value="me">Assign to me</SelectItem>
                            <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                            <SelectItem value="michael-chen">Michael Chen</SelectItem>
                            <SelectItem value="alex-rodriguez">Alex Rodriguez</SelectItem>
                            <SelectItem value="emma-wilson">Emma Wilson</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>

                    <Card className="border-[#F7F8F9]">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Ticket Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Status</div>
                          <div className="font-medium capitalize">{selectedTicket.status.replace("-", " ")}</div>

                          <div className="text-muted-foreground">Priority</div>
                          <div className="font-medium capitalize">{selectedTicket.priority}</div>

                          <div className="text-muted-foreground">Service</div>
                          <div className="font-medium">{selectedTicket.service}</div>

                          <div className="text-muted-foreground">Created</div>
                          <div className="font-medium">{formatDate(selectedTicket.createdAt)}</div>

                          <div className="text-muted-foreground">Updated</div>
                          <div className="font-medium">{formatDate(selectedTicket.updatedAt)}</div>

                          <div className="text-muted-foreground">Comments</div>
                          <div className="font-medium">{selectedTicket.comments}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
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
