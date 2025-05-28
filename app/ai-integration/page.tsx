"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle, Clock, Database, FileText, RefreshCw, Server, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

// Sample data for charts
const ticketAnalysisData = [
  { name: "Monday", tickets: 12, resolved: 10 },
  { name: "Tuesday", tickets: 19, resolved: 15 },
  { name: "Wednesday", tickets: 15, resolved: 13 },
  { name: "Thursday", tickets: 22, resolved: 19 },
  { name: "Friday", tickets: 18, resolved: 16 },
  { name: "Saturday", tickets: 8, resolved: 7 },
  { name: "Sunday", tickets: 5, resolved: 4 },
]

const knowledgeGrowthData = [
  { name: "Week 1", articles: 45 },
  { name: "Week 2", articles: 52 },
  { name: "Week 3", articles: 61 },
  { name: "Week 4", articles: 68 },
  { name: "Week 5", articles: 79 },
  { name: "Week 6", articles: 85 },
]

// Sample ticket data
const recentTickets = [
  {
    id: "INC0001234",
    title: "Unable to access SharePoint site",
    status: "Analyzing",
    confidence: 87,
    suggestedArticles: 3,
    timeAgo: "5 min ago",
  },
  {
    id: "INC0001235",
    title: "VPN connection drops intermittently",
    status: "Resolved",
    confidence: 92,
    suggestedArticles: 2,
    timeAgo: "15 min ago",
  },
  {
    id: "INC0001236",
    title: "Outlook calendar not syncing with mobile",
    status: "Analyzing",
    confidence: 76,
    suggestedArticles: 4,
    timeAgo: "32 min ago",
  },
  {
    id: "INC0001237",
    title: "Unable to print from accounting application",
    status: "Resolved",
    confidence: 89,
    suggestedArticles: 2,
    timeAgo: "1 hour ago",
  },
]

// Sample knowledge articles
const recentArticles = [
  {
    id: "KB0000123",
    title: "Resolving SharePoint Access Issues",
    source: "AI Generated",
    quality: 92,
    views: 34,
    timeAgo: "2 hours ago",
  },
  {
    id: "KB0000124",
    title: "Troubleshooting VPN Connection Problems",
    source: "AI Enhanced",
    quality: 88,
    views: 27,
    timeAgo: "3 hours ago",
  },
  {
    id: "KB0000125",
    title: "Outlook Mobile Sync Troubleshooting Guide",
    source: "AI Generated",
    quality: 95,
    views: 42,
    timeAgo: "5 hours ago",
  },
  {
    id: "KB0000126",
    title: "Printer Configuration for Financial Applications",
    source: "AI Enhanced",
    quality: 86,
    views: 19,
    timeAgo: "8 hours ago",
  },
]

export default function AIIntegrationDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">AI Integration Dashboard</h1>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ServiceNow Connection Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">ServiceNow Connection</CardTitle>
              <CardDescription>Real-time integration status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Server className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-medium">Connected</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Last sync: 2 minutes ago</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>API Health</span>
                  <span className="font-medium">98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <span>View Connection Details</span>
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Confluence Connection Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Confluence Connection</CardTitle>
              <CardDescription>Knowledge base integration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Database className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="font-medium">Connected</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Last sync: 5 minutes ago</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>API Health</span>
                  <span className="font-medium">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <span>View Connection Details</span>
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* AI Processing Status */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">AI Processing</CardTitle>
              <CardDescription>Real-time analysis metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-blue-500 mr-3" />
                <div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="font-medium">Active</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Processing 3 tickets</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Average Analysis Time</span>
                    <span className="font-medium">12.3s</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Accuracy Rate</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <span>View AI Performance</span>
                <ArrowRight className="ml-auto h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tickets">Ticket Analysis</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Analysis Performance</CardTitle>
                  <CardDescription>Weekly ticket processing metrics</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ticketAnalysisData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tickets" fill="#1E4DB7" name="Total Tickets" />
                      <Bar dataKey="resolved" fill="#4ADE80" name="AI Resolved" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Base Growth</CardTitle>
                  <CardDescription>Weekly article creation and enhancement</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={knowledgeGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="articles"
                        stroke="#1E4DB7"
                        activeDot={{ r: 8 }}
                        name="Knowledge Articles"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>AI Integration Workflow</CardTitle>
                <CardDescription>How AI connects ServiceNow and Confluence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between p-4 text-center">
                  <div className="flex flex-col items-center mb-4 md:mb-0">
                    <Server className="h-12 w-12 text-blue-500 mb-2" />
                    <h3 className="font-medium">ServiceNow</h3>
                    <p className="text-sm text-muted-foreground">Ticket Source</p>
                  </div>

                  <div className="hidden md:flex items-center text-muted-foreground">
                    <ArrowRight className="h-6 w-6" />
                  </div>

                  <div className="flex flex-col items-center mb-4 md:mb-0">
                    <Zap className="h-12 w-12 text-purple-500 mb-2" />
                    <h3 className="font-medium">AI Analysis</h3>
                    <p className="text-sm text-muted-foreground">Processing Engine</p>
                  </div>

                  <div className="hidden md:flex items-center text-muted-foreground">
                    <ArrowRight className="h-6 w-6" />
                  </div>

                  <div className="flex flex-col items-center">
                    <FileText className="h-12 w-12 text-green-500 mb-2" />
                    <h3 className="font-medium">Confluence</h3>
                    <p className="text-sm text-muted-foreground">Knowledge Repository</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium mb-2">1. Ticket Ingestion</h4>
                    <p className="text-sm text-muted-foreground">
                      New ServiceNow tickets are automatically ingested into the AI processing queue
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium mb-2">2. AI Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      AI analyzes ticket content, searches knowledge base, and generates resolution suggestions
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="font-medium mb-2">3. Knowledge Creation</h4>
                    <p className="text-sm text-muted-foreground">
                      Resolved tickets are converted to knowledge articles and stored in Confluence
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Ticket Analysis</CardTitle>
                <CardDescription>AI-processed ServiceNow tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 font-medium border-b">
                    <div>Ticket ID</div>
                    <div className="col-span-2">Description</div>
                    <div>Status</div>
                    <div>Confidence</div>
                    <div>Suggested</div>
                  </div>
                  <div className="divide-y">
                    {recentTickets.map((ticket) => (
                      <div key={ticket.id} className="grid grid-cols-6 p-4 items-center">
                        <div className="font-medium">{ticket.id}</div>
                        <div className="col-span-2">
                          <div>{ticket.title}</div>
                          <div className="text-sm text-muted-foreground">{ticket.timeAgo}</div>
                        </div>
                        <div>
                          <Badge
                            variant={ticket.status === "Analyzing" ? "outline" : "default"}
                            className={
                              ticket.status === "Analyzing" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""
                            }
                          >
                            {ticket.status}
                          </Badge>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{ticket.confidence}%</span>
                            <Progress value={ticket.confidence} className="h-2 w-16" />
                          </div>
                        </div>
                        <div>
                          <Badge variant="secondary">{ticket.suggestedArticles} articles</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Analyzed Tickets
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Resolution Metrics</CardTitle>
                <CardDescription>Performance of AI ticket resolution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                    <div className="text-4xl font-bold text-blue-600">87%</div>
                    <div className="text-sm font-medium mt-2">First-Time Resolution</div>
                    <div className="text-xs text-muted-foreground mt-1">+5% from last month</div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                    <div className="text-4xl font-bold text-green-600">92%</div>
                    <div className="text-sm font-medium mt-2">Knowledge Match Rate</div>
                    <div className="text-xs text-muted-foreground mt-1">+3% from last month</div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                    <div className="text-4xl font-bold text-purple-600">14.2m</div>
                    <div className="text-sm font-medium mt-2">Average Resolution Time</div>
                    <div className="text-xs text-muted-foreground mt-1">-2.5m from last month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Knowledge Articles</CardTitle>
                <CardDescription>AI-generated and enhanced Confluence articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 font-medium border-b">
                    <div>Article ID</div>
                    <div className="col-span-2">Title</div>
                    <div>Source</div>
                    <div>Quality</div>
                    <div>Views</div>
                  </div>
                  <div className="divide-y">
                    {recentArticles.map((article) => (
                      <div key={article.id} className="grid grid-cols-6 p-4 items-center">
                        <div className="font-medium">{article.id}</div>
                        <div className="col-span-2">
                          <div>{article.title}</div>
                          <div className="text-sm text-muted-foreground">{article.timeAgo}</div>
                        </div>
                        <div>
                          <Badge
                            variant={article.source === "AI Generated" ? "default" : "outline"}
                            className={
                              article.source === "AI Enhanced"
                                ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                                : ""
                            }
                          >
                            {article.source}
                          </Badge>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">{article.quality}%</span>
                            <Progress value={article.quality} className="h-2 w-16" />
                          </div>
                        </div>
                        <div>
                          <Badge variant="secondary">{article.views} views</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Knowledge Articles
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base Metrics</CardTitle>
                <CardDescription>Performance of AI knowledge management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                    <div className="text-4xl font-bold text-blue-600">243</div>
                    <div className="text-sm font-medium mt-2">Total Articles</div>
                    <div className="text-xs text-muted-foreground mt-1">+28 from last month</div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                    <div className="text-4xl font-bold text-green-600">78%</div>
                    <div className="text-sm font-medium mt-2">Knowledge Coverage</div>
                    <div className="text-xs text-muted-foreground mt-1">+7% from last month</div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
                    <div className="text-4xl font-bold text-purple-600">89%</div>
                    <div className="text-sm font-medium mt-2">Article Quality Score</div>
                    <div className="text-xs text-muted-foreground mt-1">+4% from last month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
