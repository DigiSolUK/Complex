"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  Info,
  Search,
  Sliders,
  TicketCheck,
  BookOpen,
  BrainCircuit,
} from "lucide-react"
import type { ServiceNowTicket } from "@/lib/servicenow-api"
import type { ConfluenceArticle } from "@/lib/confluence-api"

export default function Dashboard() {
  const [tickets, setTickets] = useState<ServiceNowTicket[]>([])
  const [articles, setArticles] = useState<ConfluenceArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        const ticketsResponse = await fetch("/api/tickets")
        const articlesResponse = await fetch("/api/knowledge?limit=5")

        const ticketsData = await ticketsResponse.json()
        const articlesData = await articlesResponse.json()

        setTickets(ticketsData.tickets)
        setArticles(articlesData.articles)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Statistics for dashboard
  const openTickets = tickets.filter((t) => t.state < 3).length
  const resolvedTickets = tickets.filter((t) => t.state >= 3).length
  const criticalTickets = tickets.filter((t) => t.priority === 1).length

  const avgResolutionTime =
    tickets
      .filter((t) => t.resolved_on)
      .reduce((acc, ticket) => {
        const created = new Date(ticket.created_on).getTime()
        const resolved = new Date(ticket.resolved_on!).getTime()
        return acc + (resolved - created) / (1000 * 60 * 60) // hours
      }, 0) / (resolvedTickets || 1)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI-Powered Service Management</h1>
        <p className="text-muted-foreground">Monitor tickets, knowledge base, and AI-enhanced resolution processes</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <TicketCheck className="h-4 w-4 text-[#006FCF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openTickets}</div>
            <p className="text-xs text-muted-foreground">{criticalTickets} critical tickets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Tickets</CardTitle>
            <FileText className="h-4 w-4 text-[#00A859]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedTickets}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-[#FF6900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResolutionTime.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">-15% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
            <BookOpen className="h-4 w-4 text-[#006FCF]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">Recently updated articles</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets" className="gap-2">
            <TicketCheck className="h-4 w-4" />
            Tickets
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Knowledge Base
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="gap-2">
            <BrainCircuit className="h-4 w-4" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 mb-4 gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-9 max-w-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Filter</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Sliders className="h-3.5 w-3.5" />
              <span>View</span>
            </Button>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Date Range</span>
            </Button>
          </div>
        </div>

        <TabsContent value="tickets" className="space-y-4">
          <div className="rounded-md border">
            <div className="p-4">
              <h2 className="text-xl font-semibold">Recent Tickets</h2>
              <p className="text-sm text-muted-foreground">View and manage service tickets from ServiceNow</p>
            </div>

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Ticket
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3">
                      AI Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">
                        Loading tickets...
                      </td>
                    </tr>
                  ) : tickets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">
                        No tickets found
                      </td>
                    </tr>
                  ) : (
                    tickets
                      .filter(
                        (ticket) =>
                          ticket.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ticket.short_description.toLowerCase().includes(searchQuery.toLowerCase()),
                      )
                      .map((ticket) => (
                        <tr key={ticket.id} className="bg-white border-b hover:bg-muted/50">
                          <td className="px-6 py-4 font-medium">{ticket.number}</td>
                          <td className="px-6 py-4">{ticket.short_description}</td>
                          <td className="px-6 py-4">{getPriorityBadge(ticket.priority)}</td>
                          <td className="px-6 py-4">{getStatusBadge(ticket.state)}</td>
                          <td className="px-6 py-4">{ticket.category}</td>
                          <td className="px-6 py-4">{formatDate(ticket.created_on)}</td>
                          <td className="px-6 py-4">
                            {ticket.knowledge_links && ticket.knowledge_links.length > 0 ? (
                              <Badge className="bg-[#E6F9F1] text-[#00A859] border-0">AI Assisted</Badge>
                            ) : (
                              <Button size="sm" className="gap-1 bg-[#006FCF]">
                                <BrainCircuit className="h-3.5 w-3.5" />
                                Analyze
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Showing {tickets.length} tickets</div>
              <Button className="gap-1 bg-[#006FCF]">
                <ChevronRight className="h-4 w-4" />
                View All Tickets
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-4">
          <div className="rounded-md border">
            <div className="p-4">
              <h2 className="text-xl font-semibold">Knowledge Base</h2>
              <p className="text-sm text-muted-foreground">Access and manage Confluence knowledge articles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {isLoading ? (
                <div className="col-span-2 text-center py-8">Loading knowledge articles...</div>
              ) : articles.length === 0 ? (
                <div className="col-span-2 text-center py-8">No knowledge articles found</div>
              ) : (
                articles.map((article) => (
                  <Card key={article.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <CardDescription>
                        Last updated: {formatDate(article.lastUpdated)} by {article.author}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="text-sm line-clamp-3" dangerouslySetInnerHTML={{ __html: article.content }} />
                    </CardContent>
                    <div className="px-6 pb-4 pt-1 flex flex-wrap gap-2">
                      {article.labels.map((label) => (
                        <Badge key={label} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                    <div className="px-6 pb-4 flex justify-between items-center">
                      <Badge>{article.space}</Badge>
                      <Button size="sm" className="gap-1 bg-[#006FCF]">
                        <Info className="h-3.5 w-3.5" />
                        View Article
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <div className="p-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Showing {articles.length} knowledge articles</div>
              <Button className="gap-1 bg-[#006FCF]">
                <ChevronRight className="h-4 w-4" />
                View All Articles
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-4">
          <div className="rounded-md border">
            <div className="p-4">
              <h2 className="text-xl font-semibold">AI Insights</h2>
              <p className="text-sm text-muted-foreground">AI-powered analytics and recommendations</p>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-[#006FCF]" />
                    Resolution Recommendations
                  </CardTitle>
                  <CardDescription>AI-suggested solutions for open tickets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="text-center py-8">Loading AI insights...</div>
                    ) : (
                      tickets
                        .filter((t) => t.state < 3)
                        .slice(0, 3)
                        .map((ticket) => (
                          <div key={ticket.id} className="rounded-md border p-3 bg-muted/30">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium">
                                {ticket.number}: {ticket.short_description}
                              </div>
                              <Badge className="bg-[#E6F2FF] text-[#006FCF] border-0">AI Score: 92%</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Based on 3 similar resolved tickets and 2 knowledge articles
                            </p>
                            <Button size="sm" className="w-full gap-1 bg-[#006FCF]">
                              <BrainCircuit className="h-3.5 w-3.5" />
                              View AI Recommendations
                            </Button>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#00A859]" />
                    Knowledge Gap Analysis
                  </CardTitle>
                  <CardDescription>Suggested knowledge articles to create</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="rounded-md border p-3 bg-muted/30">
                      <div className="font-medium mb-1">Network Connectivity in Remote Locations</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        5 similar tickets resolved without knowledge article references
                      </div>
                      <Button size="sm" className="w-full gap-1 bg-[#00A859]">
                        <BookOpen className="h-3.5 w-3.5" />
                        Generate Knowledge Article
                      </Button>
                    </div>

                    <div className="rounded-md border p-3 bg-muted/30">
                      <div className="font-medium mb-1">Email Distribution List Management</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        7 similar tickets resolved without knowledge article references
                      </div>
                      <Button size="sm" className="w-full gap-1 bg-[#00A859]">
                        <BookOpen className="h-3.5 w-3.5" />
                        Generate Knowledge Article
                      </Button>
                    </div>

                    <div className="rounded-md border p-3 bg-muted/30">
                      <div className="font-medium mb-1">VPN Access Troubleshooting</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        4 similar tickets resolved without knowledge article references
                      </div>
                      <Button size="sm" className="w-full gap-1 bg-[#00A859]">
                        <BookOpen className="h-3.5 w-3.5" />
                        Generate Knowledge Article
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="rounded-md border">
            <div className="p-4">
              <h2 className="text-xl font-semibold">Analytics & Reporting</h2>
              <p className="text-sm text-muted-foreground">Performance metrics and trend analysis</p>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resolution Time Trend</CardTitle>
                  <CardDescription>Average time to resolve tickets (last 30 days)</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center bg-muted">
                  <div className="text-center text-muted-foreground">
                    <BarChart className="h-10 w-10 mx-auto mb-2" />
                    <p>Resolution time chart visualization would appear here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Knowledge Base Effectiveness</CardTitle>
                  <CardDescription>Impact of knowledge articles on resolution time</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center bg-muted">
                  <div className="text-center text-muted-foreground">
                    <BarChart className="h-10 w-10 mx-auto mb-2" />
                    <p>Knowledge base effectiveness chart would appear here</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">AI Automation Impact</CardTitle>
                  <CardDescription>Time saved through AI-assisted resolution processes</CardDescription>
                </CardHeader>
                <CardContent className="h-64 flex items-center justify-center bg-muted">
                  <div className="text-center text-muted-foreground">
                    <BarChart className="h-10 w-10 mx-auto mb-2" />
                    <p>AI automation impact visualization would appear here</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="p-4 flex justify-center">
              <Button className="gap-1 bg-[#006FCF]">
                <FileText className="h-4 w-4" />
                Generate Comprehensive Report
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper function to get priority badge
function getPriorityBadge(priority: number) {
  switch (priority) {
    case 1:
      return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-0">Critical</Badge>
    case 2:
      return <Badge className="bg-[#FFF4EC] text-[#FF6900] border-0">High</Badge>
    case 3:
      return <Badge className="bg-[#E6F2FF] text-[#006FCF] border-0">Medium</Badge>
    case 4:
    case 5:
      return <Badge className="bg-[#E6F9F1] text-[#00A859] border-0">Low</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

// Helper function to get status badge
function getStatusBadge(state: number) {
  switch (state) {
    case 1:
      return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-0">New</Badge>
    case 2:
      return <Badge className="bg-[#E6F2FF] text-[#006FCF] border-0">In Progress</Badge>
    case 3:
      return <Badge className="bg-[#E6F9F1] text-[#00A859] border-0">Resolved</Badge>
    case 4:
      return <Badge className="bg-[#E6F9F1] text-[#00A859] border-0">Closed</Badge>
    default:
      return <Badge variant="outline">Unknown</Badge>
  }
}

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}
