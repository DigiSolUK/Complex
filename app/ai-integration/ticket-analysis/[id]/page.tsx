"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Clock,
  FileText,
  Link2,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Sample ticket data
const ticketData = {
  id: "INC0001234",
  title: "Unable to access SharePoint site",
  description:
    "When attempting to access the Marketing department SharePoint site, I receive an error message stating 'Access Denied'. I was able to access this site yesterday without any issues.",
  status: "In Progress",
  priority: "Medium",
  category: "Access",
  submittedBy: "Sarah Johnson",
  assignedTo: "IT Support",
  createdAt: "2023-05-28T09:15:00Z",
  updatedAt: "2023-05-28T10:30:00Z",
}

// Sample AI analysis data
const aiAnalysis = {
  confidence: 87,
  processingTime: "3.2 seconds",
  suggestedCategory: "Access Management",
  suggestedPriority: "Medium",
  rootCauseAnalysis:
    "Based on the error message and recent system changes, this appears to be related to SharePoint permission changes that were implemented during last night's maintenance window. The user likely needs their access permissions updated in Active Directory.",
  suggestedResolution:
    "Update user permissions in Active Directory and SharePoint. Verify user is part of the 'Marketing-Contributors' security group.",
  automationPossible: true,
  automationSteps: [
    "Verify user identity in Active Directory",
    "Check current group memberships",
    "Add user to 'Marketing-Contributors' group if missing",
    "Force permission sync with SharePoint",
  ],
}

// Sample knowledge articles
const suggestedArticles = [
  {
    id: "KB0000123",
    title: "Resolving SharePoint Access Issues",
    relevance: 92,
    excerpt:
      "This article covers common SharePoint access issues and their resolutions, including permission group management and synchronization problems.",
    url: "#",
  },
  {
    id: "KB0000087",
    title: "Understanding SharePoint Permission Groups",
    relevance: 85,
    excerpt:
      "A comprehensive guide to SharePoint permission groups, inheritance, and best practices for managing access control.",
    url: "#",
  },
  {
    id: "KB0000156",
    title: "Troubleshooting Active Directory Synchronization",
    relevance: 78,
    excerpt:
      "Steps to diagnose and resolve synchronization issues between Active Directory and connected services like SharePoint.",
    url: "#",
  },
]

// Sample ticket history
const ticketHistory = [
  {
    id: 1,
    type: "status_change",
    from: "New",
    to: "In Progress",
    by: "System",
    timestamp: "2023-05-28T09:16:00Z",
    note: "Ticket automatically assigned to IT Support",
  },
  {
    id: 2,
    type: "ai_analysis",
    by: "AI System",
    timestamp: "2023-05-28T09:17:00Z",
    note: "AI analysis completed. Suggested category: Access Management",
  },
  {
    id: 3,
    type: "comment",
    by: "IT Support",
    timestamp: "2023-05-28T09:45:00Z",
    note: "Checking user permissions in Active Directory",
  },
  {
    id: 4,
    type: "knowledge_link",
    by: "AI System",
    timestamp: "2023-05-28T09:46:00Z",
    note: "Linked knowledge article KB0000123 - Resolving SharePoint Access Issues",
  },
  {
    id: 5,
    type: "comment",
    by: "IT Support",
    timestamp: "2023-05-28T10:30:00Z",
    note: "User was missing from the Marketing-Contributors group. Added user to group and initiated sync.",
  },
]

export default function TicketAnalysisPage() {
  const params = useParams()
  const ticketId = params.id
  const [activeTab, setActiveTab] = useState("analysis")

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/ai-integration">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Ticket Analysis</h1>
          <Badge variant="outline" className="ml-4">
            {ticketId}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{ticketData.title}</CardTitle>
            <CardDescription>
              Submitted by {ticketData.submittedBy} on {new Date(ticketData.createdAt).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Status</div>
                <div className="font-medium">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {ticketData.status}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Priority</div>
                <div className="font-medium">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    {ticketData.priority}
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Category</div>
                <div className="font-medium">
                  <Badge variant="outline">{ticketData.category}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Description</div>
              <div className="p-4 bg-muted rounded-md text-sm">{ticketData.description}</div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Articles</TabsTrigger>
            <TabsTrigger value="history">Ticket History</TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>AI Analysis Results</CardTitle>
                  <Badge className="bg-blue-100 text-blue-800">
                    <Clock className="mr-1 h-3 w-3" />
                    {aiAnalysis.processingTime}
                  </Badge>
                </div>
                <CardDescription>AI-powered analysis of ticket content and suggested resolution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Confidence Score</div>
                    <div className="flex items-center">
                      <div className="font-medium text-lg mr-3">{aiAnalysis.confidence}%</div>
                      <Progress value={aiAnalysis.confidence} className="h-2 flex-1" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Suggested Category</div>
                    <div className="font-medium">
                      <Badge variant="outline" className="bg-purple-100 text-purple-800">
                        {aiAnalysis.suggestedCategory}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">Suggested Priority</div>
                    <div className="font-medium">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        {aiAnalysis.suggestedPriority}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Root Cause Analysis</h3>
                    <div className="p-4 bg-muted rounded-md text-sm">{aiAnalysis.rootCauseAnalysis}</div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Suggested Resolution</h3>
                    <div className="p-4 bg-muted rounded-md text-sm">{aiAnalysis.suggestedResolution}</div>
                  </div>

                  {aiAnalysis.automationPossible && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Automation Opportunity</h3>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex items-start">
                          <Zap className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                          <div>
                            <div className="font-medium text-blue-800 mb-2">
                              This issue can be automatically resolved
                            </div>
                            <div className="text-sm text-blue-700 mb-3">
                              The following steps can be automated to resolve this issue:
                            </div>
                            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                              {aiAnalysis.automationSteps.map((step, index) => (
                                <li key={index}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Helpful
                  </Button>
                  <Button variant="outline" size="sm">
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Not Helpful
                  </Button>
                </div>
                <Button>Apply Suggestions</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Knowledge Articles</CardTitle>
                <CardDescription>AI-matched articles from Confluence knowledge base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {suggestedArticles.map((article) => (
                    <div key={article.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-muted">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-500 mr-3" />
                          <div>
                            <div className="font-medium">{article.title}</div>
                            <div className="text-sm text-muted-foreground">{article.id}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          {article.relevance}% Match
                        </Badge>
                      </div>
                      <div className="p-4 text-sm">{article.excerpt}</div>
                      <div className="p-4 pt-0 flex justify-between">
                        <Button variant="ghost" size="sm">
                          <Link2 className="mr-2 h-4 w-4" />
                          Link to Ticket
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={article.url} target="_blank" rel="noopener noreferrer">
                            View Full Article
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Search Knowledge Base
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ticket Activity Timeline</CardTitle>
                <CardDescription>Complete history of ticket updates and AI interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {ticketHistory.map((event, index) => (
                    <div key={event.id} className="flex">
                      <div className="mr-4 flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          {event.type === "status_change" && <AlertCircle className="h-5 w-5 text-blue-500" />}
                          {event.type === "ai_analysis" && <Zap className="h-5 w-5 text-purple-500" />}
                          {event.type === "comment" && <MessageSquare className="h-5 w-5 text-gray-500" />}
                          {event.type === "knowledge_link" && <FileText className="h-5 w-5 text-green-500" />}
                        </div>
                        {index < ticketHistory.length - 1 && <div className="h-full w-px bg-border" />}
                      </div>
                      <div className="flex flex-col pb-6">
                        <div className="flex items-center">
                          <div className="font-medium">{event.by}</div>
                          <div className="ml-2 text-xs text-muted-foreground">
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <div className="mt-1 text-sm">
                          {event.type === "status_change" ? (
                            <div className="flex items-center">
                              <Badge variant="outline" className="mr-2">
                                {event.from}
                              </Badge>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
                                {event.to}
                              </Badge>
                            </div>
                          ) : (
                            event.note
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
