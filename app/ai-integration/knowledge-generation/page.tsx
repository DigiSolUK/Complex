"use client"

import { useState } from "react"
import { ArrowLeft, Check, Copy, Edit, FileText, Filter, Plus, RefreshCw, Search, Zap, ThumbsUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Sample resolved tickets
const resolvedTickets = [
  {
    id: "INC0001235",
    title: "VPN connection drops intermittently",
    category: "Network",
    resolutionQuality: 92,
    knowledgeStatus: "Generated",
    resolvedDate: "2023-05-27T14:30:00Z",
  },
  {
    id: "INC0001237",
    title: "Unable to print from accounting application",
    category: "Software",
    resolutionQuality: 89,
    knowledgeStatus: "Pending",
    resolvedDate: "2023-05-28T10:45:00Z",
  },
  {
    id: "INC0001240",
    title: "Email signature not displaying correctly",
    category: "Email",
    resolutionQuality: 85,
    knowledgeStatus: "Generated",
    resolvedDate: "2023-05-28T11:20:00Z",
  },
  {
    id: "INC0001242",
    title: "CRM data export failing with timeout error",
    category: "Software",
    resolutionQuality: 78,
    knowledgeStatus: "In Progress",
    resolvedDate: "2023-05-28T13:15:00Z",
  },
  {
    id: "INC0001245",
    title: "Unable to access shared drive after password reset",
    category: "Access",
    resolutionQuality: 94,
    knowledgeStatus: "Pending",
    resolvedDate: "2023-05-28T15:30:00Z",
  },
]

// Sample generated articles
const generatedArticles = [
  {
    id: "KB0000124",
    title: "Troubleshooting VPN Connection Problems",
    sourceTicket: "INC0001235",
    category: "Network",
    quality: 92,
    createdDate: "2023-05-27T15:10:00Z",
    status: "Published",
  },
  {
    id: "KB0000126",
    title: "Email Signature Troubleshooting Guide",
    sourceTicket: "INC0001240",
    category: "Email",
    quality: 88,
    createdDate: "2023-05-28T12:05:00Z",
    status: "Published",
  },
  {
    id: "KB0000127",
    title: "CRM Data Export Error Resolution",
    sourceTicket: "INC0001242",
    category: "Software",
    quality: 76,
    createdDate: "2023-05-28T14:20:00Z",
    status: "Draft",
  },
]

// Sample article content
const sampleArticleContent = `
# Troubleshooting VPN Connection Problems

## Overview
This article provides steps to diagnose and resolve intermittent VPN connection issues that users may experience when connecting to the corporate network.

## Symptoms
- VPN connection drops unexpectedly
- Unable to reconnect to VPN after disconnection
- Slow or unstable VPN connection
- Error messages indicating "Connection Lost" or "Network Unreachable"

## Troubleshooting Steps

### 1. Check Local Network Connection
Ensure that the local internet connection is stable:
- Run a speed test to verify bandwidth
- Check if other devices on the same network are experiencing issues
- Restart your router/modem if necessary

### 2. VPN Client Configuration
Verify the VPN client settings:
- Ensure the VPN client software is up to date
- Confirm the correct server address is being used
- Check that the authentication credentials are correct

### 3. Network Interference
Identify potential sources of interference:
- Disable conflicting security software temporarily
- Check for firewall rules blocking VPN traffic
- Try connecting from a different network if possible

### 4. Advanced Troubleshooting
If the issue persists:
- Clear the VPN client cache and reconnect
- Try an alternative VPN protocol (IKEv2, OpenVPN, etc.)
- Contact IT Support with the specific error messages and timestamps

## Resolution
In most cases, the issue can be resolved by:
1. Updating the VPN client to the latest version
2. Ensuring the correct VPN profile is selected
3. Adjusting firewall settings to allow VPN traffic
4. Connecting to a different VPN server if multiple are available

## Related Information
- [VPN Access Policy](internal://policies/vpn-access)
- [Remote Work Guidelines](internal://policies/remote-work)
- [Network Connectivity FAQ](internal://faq/network)
`

export default function KnowledgeGenerationPage() {
  const [activeTab, setActiveTab] = useState("tickets")
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [articleContent, setArticleContent] = useState(sampleArticleContent)

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
          <h1 className="text-3xl font-bold">Knowledge Generation</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tickets">Resolved Tickets</TabsTrigger>
            <TabsTrigger value="articles">Generated Articles</TabsTrigger>
            <TabsTrigger value="preview">Article Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search tickets..." className="w-[300px] pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
              <Button>
                <Zap className="mr-2 h-4 w-4" />
                Generate All Articles
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resolved Tickets</CardTitle>
                <CardDescription>Tickets with high-quality resolutions suitable for knowledge articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 font-medium border-b">
                    <div>Ticket ID</div>
                    <div className="col-span-2">Title</div>
                    <div>Category</div>
                    <div>Quality</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y">
                    {resolvedTickets.map((ticket) => (
                      <div key={ticket.id} className="grid grid-cols-6 p-4 items-center">
                        <div className="font-medium">{ticket.id}</div>
                        <div className="col-span-2">
                          <div>{ticket.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Resolved on {new Date(ticket.resolvedDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <Badge variant="outline">{ticket.category}</Badge>
                        </div>
                        <div>
                          <Badge
                            variant="outline"
                            className={
                              ticket.resolutionQuality >= 90
                                ? "bg-green-100 text-green-800"
                                : ticket.resolutionQuality >= 80
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {ticket.resolutionQuality}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={ticket.knowledgeStatus === "Generated" ? "default" : "outline"}
                            className={
                              ticket.knowledgeStatus === "In Progress"
                                ? "bg-blue-100 text-blue-800"
                                : ticket.knowledgeStatus === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : ""
                            }
                          >
                            {ticket.knowledgeStatus}
                          </Badge>
                          {ticket.knowledgeStatus === "Pending" && (
                            <Button variant="ghost" size="sm">
                              <Zap className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Showing 5 of 24 resolved tickets</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Knowledge Generation Settings</CardTitle>
                <CardDescription>Configure how AI generates knowledge articles from resolved tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Automatic Generation</Label>
                        <div className="text-sm text-muted-foreground">
                          Generate articles automatically from high-quality resolutions
                        </div>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <div className="space-y-2">
                      <Label>Minimum Quality Threshold</Label>
                      <Select defaultValue="80">
                        <SelectTrigger>
                          <SelectValue placeholder="Select threshold" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="70">70% - More articles, variable quality</SelectItem>
                          <SelectItem value="80">80% - Balanced approach</SelectItem>
                          <SelectItem value="90">90% - Fewer articles, higher quality</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Human Review Required</Label>
                        <div className="text-sm text-muted-foreground">
                          Require approval before publishing to Confluence
                        </div>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <div className="space-y-2">
                      <Label>Article Template</Label>
                      <Select defaultValue="standard">
                        <SelectTrigger>
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard Troubleshooting</SelectItem>
                          <SelectItem value="howto">How-To Guide</SelectItem>
                          <SelectItem value="reference">Reference Document</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search articles..." className="w-[300px] pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Article
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Generated Knowledge Articles</CardTitle>
                <CardDescription>AI-generated articles from resolved tickets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 font-medium border-b">
                    <div>Article ID</div>
                    <div className="col-span-2">Title</div>
                    <div>Category</div>
                    <div>Quality</div>
                    <div>Status</div>
                  </div>
                  <div className="divide-y">
                    {generatedArticles.map((article) => (
                      <div key={article.id} className="grid grid-cols-6 p-4 items-center">
                        <div className="font-medium">{article.id}</div>
                        <div className="col-span-2">
                          <div>{article.title}</div>
                          <div className="text-sm text-muted-foreground">
                            From ticket {article.sourceTicket} • {new Date(article.createdDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <Badge variant="outline">{article.category}</Badge>
                        </div>
                        <div>
                          <Badge
                            variant="outline"
                            className={
                              article.quality >= 90
                                ? "bg-green-100 text-green-800"
                                : article.quality >= 80
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {article.quality}%
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={article.status === "Published" ? "default" : "outline"}
                            className={article.status === "Draft" ? "bg-yellow-100 text-yellow-800" : ""}
                          >
                            {article.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedArticle(article)
                              setActiveTab("preview")
                            }}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Showing 3 of 18 generated articles</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Confluence Integration</CardTitle>
                <CardDescription>Configure how articles are published to Confluence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Target Space</Label>
                      <Select defaultValue="it-kb">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Confluence space" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="it-kb">IT Knowledge Base</SelectItem>
                          <SelectItem value="support">Support Documentation</SelectItem>
                          <SelectItem value="internal">Internal Processes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Default Parent Page</Label>
                      <Select defaultValue="troubleshooting">
                        <SelectTrigger>
                          <SelectValue placeholder="Select parent page" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="troubleshooting">Troubleshooting Guides</SelectItem>
                          <SelectItem value="howto">How-To Articles</SelectItem>
                          <SelectItem value="reference">Reference Documentation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Auto-Publish Approved Articles</Label>
                        <div className="text-sm text-muted-foreground">
                          Automatically publish articles after approval
                        </div>
                      </div>
                      <Switch checked={true} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Link Articles to Source Tickets</Label>
                        <div className="text-sm text-muted-foreground">
                          Add references to original ServiceNow tickets
                        </div>
                      </div>
                      <Switch checked={true} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Article Preview</CardTitle>
                  <CardDescription>
                    {selectedArticle ? selectedArticle.title : "Troubleshooting VPN Connection Problems"}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button size="sm">
                    <Check className="mr-2 h-4 w-4" />
                    Publish to Confluence
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-6 prose max-w-none">
                  <div className="whitespace-pre-wrap font-mono text-sm">{articleContent}</div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Generated from ticket {selectedArticle ? selectedArticle.sourceTicket : "INC0001235"}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Button variant="outline" size="sm">
                      <ThumbsUp className="mr-2 h-4 w-4" />
                      Helpful
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Article Metadata</CardTitle>
                <CardDescription>Information used to categorize and organize the article</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={selectedArticle ? selectedArticle.title : "Troubleshooting VPN Connection Problems"}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select defaultValue={selectedArticle ? selectedArticle.category.toLowerCase() : "network"}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="network">Network</SelectItem>
                          <SelectItem value="software">Software</SelectItem>
                          <SelectItem value="hardware">Hardware</SelectItem>
                          <SelectItem value="access">Access Management</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <Input defaultValue="vpn, connectivity, remote access, troubleshooting" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Summary</Label>
                      <Textarea
                        rows={3}
                        defaultValue="A guide to troubleshooting intermittent VPN connection issues, including steps to diagnose and resolve common problems."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Related Articles</Label>
                      <Input defaultValue="KB0000087, KB0000156" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Mark as Featured</Label>
                        <div className="text-sm text-muted-foreground">
                          Highlight this article in the knowledge base
                        </div>
                      </div>
                      <Switch checked={false} />
                    </div>
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
