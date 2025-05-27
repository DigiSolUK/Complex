"use client"

import { useState } from "react"
import { AlertTriangle, ArrowUpDown, Check, Clock, Filter, Search, Server } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function WebApplicationsMonitoringPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Generate sample data for 200 web applications
  const generateApplications = () => {
    const categories = ["Payment", "Banking", "Customer", "Internal", "Merchant", "Admin", "API", "Mobile"]
    const environments = ["Production", "Staging", "Development"]
    const statuses = ["healthy", "degraded", "critical", "maintenance"]
    const statusWeights = [0.7, 0.15, 0.1, 0.05] // Probability weights for statuses

    const applications = []

    for (let i = 1; i <= 200; i++) {
      const categoryIndex = Math.floor(Math.random() * categories.length)
      const envIndex = Math.floor(Math.random() * environments.length)

      // Weighted random status selection
      const rand = Math.random()
      let statusIndex = 0
      let cumulativeWeight = 0

      for (let j = 0; j < statusWeights.length; j++) {
        cumulativeWeight += statusWeights[j]
        if (rand < cumulativeWeight) {
          statusIndex = j
          break
        }
      }

      const uptime = 100 - Math.random() * (statusIndex === 0 ? 0.1 : statusIndex === 1 ? 1 : statusIndex === 2 ? 5 : 0)
      const responseTime = Math.floor(
        100 + Math.random() * (statusIndex === 0 ? 200 : statusIndex === 1 ? 500 : statusIndex === 2 ? 1000 : 300),
      )

      applications.push({
        id: `APP-${i.toString().padStart(3, "0")}`,
        name: `${categories[categoryIndex]} ${environments[envIndex]} ${i}`,
        category: categories[categoryIndex],
        environment: environments[envIndex],
        status: statuses[statusIndex],
        uptime: uptime.toFixed(2),
        responseTime,
        lastChecked: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
        url: `https://example.com/app-${i}`,
      })
    }

    return applications
  }

  const applications = generateApplications()

  // Filter and sort applications
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchQuery === "" ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesCategory = categoryFilter === "all" || app.category === categoryFilter

    return matchesSearch && matchesStatus && matchesCategory
  })

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    let comparison = 0

    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name)
    } else if (sortBy === "status") {
      const statusOrder = { healthy: 0, maintenance: 1, degraded: 2, critical: 3 }
      comparison = statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder]
    } else if (sortBy === "uptime") {
      comparison = Number.parseFloat(a.uptime) - Number.parseFloat(b.uptime)
    } else if (sortBy === "responseTime") {
      comparison = a.responseTime - b.responseTime
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Healthy</Badge>
      case "degraded":
        return <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">Degraded</Badge>
      case "critical":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">Critical</Badge>
      case "maintenance":
        return <Badge className="bg-[#E6F2FF] text-[#006FCF] border-[#006FCF]">Maintenance</Badge>
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
    }).format(date)
  }

  // Calculate summary metrics
  const healthySummary = applications.filter((app) => app.status === "healthy").length
  const degradedSummary = applications.filter((app) => app.status === "degraded").length
  const criticalSummary = applications.filter((app) => app.status === "critical").length
  const maintenanceSummary = applications.filter((app) => app.status === "maintenance").length

  // Get unique categories for filter
  const categories = Array.from(new Set(applications.map((app) => app.category)))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Web Applications Monitoring</h1>
        <p className="text-muted-foreground">Monitor the status and performance of all web applications</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-[#E6F9F1] bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#00A859]">Healthy</CardTitle>
            <Check className="h-4 w-4 text-[#00A859]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#00A859]">{healthySummary}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((healthySummary / applications.length) * 100)}% of applications
            </p>
            <Progress
              value={healthySummary}
              max={applications.length}
              className="mt-4 bg-[#ECEDEE]"
              indicatorClassName="bg-[#00A859]"
            />
          </CardContent>
        </Card>

        <Card className="border border-[#FFF4EC] bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#FF6900]">Degraded</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#FF6900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#FF6900]">{degradedSummary}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((degradedSummary / applications.length) * 100)}% of applications
            </p>
            <Progress
              value={degradedSummary}
              max={applications.length}
              className="mt-4 bg-[#ECEDEE]"
              indicatorClassName="bg-[#FF6900]"
            />
          </CardContent>
        </Card>

        <Card className="border border-[#FFEEF0] bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#D5001F]">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#D5001F]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#D5001F]">{criticalSummary}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((criticalSummary / applications.length) * 100)}% of applications
            </p>
            <Progress
              value={criticalSummary}
              max={applications.length}
              className="mt-4 bg-[#ECEDEE]"
              indicatorClassName="bg-[#D5001F]"
            />
          </CardContent>
        </Card>

        <Card className="border border-[#E6F2FF] bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#006FCF]">Maintenance</CardTitle>
            <Clock className="h-4 w-4 text-[#006FCF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#006FCF]">{maintenanceSummary}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((maintenanceSummary / applications.length) * 100)}% of applications
            </p>
            <Progress
              value={maintenanceSummary}
              max={applications.length}
              className="mt-4 bg-[#ECEDEE]"
              indicatorClassName="bg-[#006FCF]"
            />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">All Applications</TabsTrigger>
            <TabsTrigger value="critical">Critical</TabsTrigger>
            <TabsTrigger value="degraded">Degraded</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search applications..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all" onValueChange={(value) => setCategoryFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </div>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>
                Showing {filteredApplications.length} of {applications.length} applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 font-semibold flex items-center gap-1"
                        onClick={() => handleSort("name")}
                      >
                        Name
                        {sortBy === "name" && <ArrowUpDown className="h-3 w-3" />}
                      </Button>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 font-semibold flex items-center gap-1"
                        onClick={() => handleSort("status")}
                      >
                        Status
                        {sortBy === "status" && <ArrowUpDown className="h-3 w-3" />}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 font-semibold flex items-center gap-1"
                        onClick={() => handleSort("uptime")}
                      >
                        Uptime
                        {sortBy === "uptime" && <ArrowUpDown className="h-3 w-3" />}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        className="p-0 font-semibold flex items-center gap-1"
                        onClick={() => handleSort("responseTime")}
                      >
                        Response Time
                        {sortBy === "responseTime" && <ArrowUpDown className="h-3 w-3" />}
                      </Button>
                    </TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedApplications.slice(0, 20).map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.id}</TableCell>
                      <TableCell>{app.name}</TableCell>
                      <TableCell>{app.category}</TableCell>
                      <TableCell>{app.environment}</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>{app.uptime}%</TableCell>
                      <TableCell>{app.responseTime} ms</TableCell>
                      <TableCell>{formatDate(app.lastChecked)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Server className="h-4 w-4" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {sortedApplications.length > 20 && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline">Load More</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical">
          <Card>
            <CardHeader>
              <CardTitle>Critical Applications</CardTitle>
              <CardDescription>Applications with critical status requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications
                    .filter((app) => app.status === "critical")
                    .map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>{app.name}</TableCell>
                        <TableCell>{app.category}</TableCell>
                        <TableCell>{app.environment}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>{app.uptime}%</TableCell>
                        <TableCell>{app.responseTime} ms</TableCell>
                        <TableCell>{formatDate(app.lastChecked)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Server className="h-4 w-4" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="degraded">
          <Card>
            <CardHeader>
              <CardTitle>Degraded Applications</CardTitle>
              <CardDescription>Applications with degraded performance requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications
                    .filter((app) => app.status === "degraded")
                    .map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>{app.name}</TableCell>
                        <TableCell>{app.category}</TableCell>
                        <TableCell>{app.environment}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>{app.uptime}%</TableCell>
                        <TableCell>{app.responseTime} ms</TableCell>
                        <TableCell>{formatDate(app.lastChecked)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Server className="h-4 w-4" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Applications</CardTitle>
              <CardDescription>Applications currently under scheduled maintenance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Response Time</TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications
                    .filter((app) => app.status === "maintenance")
                    .map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.id}</TableCell>
                        <TableCell>{app.name}</TableCell>
                        <TableCell>{app.category}</TableCell>
                        <TableCell>{app.environment}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>{app.uptime}%</TableCell>
                        <TableCell>{app.responseTime} ms</TableCell>
                        <TableCell>{formatDate(app.lastChecked)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Server className="h-4 w-4" />
                            Details
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
