import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AlertsPage() {
  const alerts = [
    {
      id: "ALT-4567",
      title: "Database CPU Utilization > 90%",
      source: "Datadog",
      service: "Database Cluster",
      timestamp: "2025-05-27T16:30:00Z",
      severity: "critical",
      status: "active",
      incident: "INC-1234",
    },
    {
      id: "ALT-4568",
      title: "Database Connection Pool Exhausted",
      source: "CloudWatch",
      service: "Database Cluster",
      timestamp: "2025-05-27T16:30:15Z",
      severity: "critical",
      status: "active",
      incident: "INC-1234",
    },
    {
      id: "ALT-4569",
      title: "Database Read Replica Lag > 120s",
      source: "Prometheus",
      service: "Database Cluster",
      timestamp: "2025-05-27T16:31:00Z",
      severity: "high",
      status: "active",
      incident: "INC-1234",
    },
    {
      id: "ALT-4570",
      title: "API Error Rate > 5%",
      source: "New Relic",
      service: "API Services",
      timestamp: "2025-05-27T16:32:00Z",
      severity: "high",
      status: "active",
      incident: "INC-1234",
    },
    {
      id: "ALT-4571",
      title: "Database Query Latency > 500ms",
      source: "Datadog",
      service: "Database Cluster",
      timestamp: "2025-05-27T16:33:00Z",
      severity: "medium",
      status: "active",
      incident: "INC-1234",
    },
    {
      id: "ALT-4572",
      title: "Cache Hit Ratio < 80%",
      source: "CloudWatch",
      service: "Content Delivery",
      timestamp: "2025-05-27T16:34:00Z",
      severity: "medium",
      status: "active",
      incident: "INC-1231",
    },
    {
      id: "ALT-4573",
      title: "Database Connections > 85% of limit",
      source: "Prometheus",
      service: "Database Cluster",
      timestamp: "2025-05-27T16:35:00Z",
      severity: "medium",
      status: "active",
      incident: "INC-1234",
    },
    {
      id: "ALT-4574",
      title: "API Gateway High Latency",
      source: "New Relic",
      service: "API Services",
      timestamp: "2025-05-27T15:45:00Z",
      severity: "high",
      status: "active",
      incident: "INC-1233",
    },
    {
      id: "ALT-4575",
      title: "Payment Processing Service Errors",
      source: "Datadog",
      service: "Payment Gateway",
      timestamp: "2025-05-27T14:20:00Z",
      severity: "high",
      status: "active",
      incident: "INC-1232",
    },
    {
      id: "ALT-4576",
      title: "CDN Cache Miss Rate Increase",
      source: "CloudWatch",
      service: "Content Delivery",
      timestamp: "2025-05-27T13:10:00Z",
      severity: "medium",
      status: "active",
      incident: "INC-1231",
    },
  ]

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
        <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
        <p className="text-muted-foreground">View and manage all incoming alerts</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input placeholder="Search alerts..." />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="datadog">Datadog</SelectItem>
              <SelectItem value="cloudwatch">CloudWatch</SelectItem>
              <SelectItem value="prometheus">Prometheus</SelectItem>
              <SelectItem value="newrelic">New Relic</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-1">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Incident</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.id}</TableCell>
                  <TableCell>{alert.title}</TableCell>
                  <TableCell>{alert.service}</TableCell>
                  <TableCell>{alert.source}</TableCell>
                  <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                  <TableCell>{formatDate(alert.timestamp)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="hover:bg-[#e6ecff] cursor-pointer text-[#5588cc]">
                      {alert.incident}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
