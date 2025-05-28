"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  AlertTriangle,
  BookOpen,
  BrainCircuit,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  Pencil,
  RotateCcw,
  TicketCheck,
  User,
} from "lucide-react"
import type { ServiceNowTicket } from "@/lib/servicenow-api"
import type { ConfluenceArticle } from "@/lib/confluence-api"
import type { ResolutionSuggestion, TicketAnalysis } from "@/lib/ai-service"

export default function TicketPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [ticket, setTicket] = useState<ServiceNowTicket | null>(null)
  const [analysis, setAnalysis] = useState<TicketAnalysis | null>(null)
  const [suggestion, setSuggestion] = useState<ResolutionSuggestion | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<ConfluenceArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [resolveNotes, setResolveNotes] = useState("")
  const [generateKnowledge, setGenerateKnowledge] = useState(true)

  useEffect(() => {
    async function fetchTicket() {
      try {
        const response = await fetch(`/api/tickets/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch ticket")

        const ticketData = await response.json()
        setTicket(ticketData)

        // If the ticket has knowledge links, fetch those articles
        if (ticketData.knowledge_links && ticketData.knowledge_links.length > 0) {
          const articlesPromises = ticketData.knowledge_links.map((id: string) =>
            fetch(`/api/knowledge/${id}`).then((res) => res.json()),
          )
          const articles = await Promise.all(articlesPromises)
          setRelatedArticles(articles)
        }
      } catch (error) {
        console.error("Error fetching ticket:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTicket()
  }, [params.id])

  const analyzeTicket = async () => {
    if (!ticket) return

    setIsAnalyzing(true)
    try {
      // Fetch analysis
      const analysisResponse = await fetch(`/api/tickets/${params.id}/analyze`)
      const analysisData = await analysisResponse.json()
      setAnalysis(analysisData)

      // Fetch suggestions
      const suggestionResponse = await fetch(`/api/tickets/${params.id}/suggest`)
      const suggestionData = await suggestionResponse.json()
      setSuggestion(suggestionData)

      // Set the related articles from the suggestion
      if (suggestionData.knowledgeArticles) {
        setRelatedArticles(suggestionData.knowledgeArticles)
      }
    } catch (error) {
      console.error("Error analyzing ticket:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resolveTicket = async () => {
    if (!ticket) return

    try {
      // Update the ticket status to resolved
      const updateResponse = await fetch(`/api/tickets/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: 3, // Resolved
          resolution_notes: resolveNotes,
        }),
      })

      // Get the updated ticket
      const updatedTicket = await updateResponse.json()
      setTicket(updatedTicket)

      // If generate knowledge article is enabled, create one
      if (generateKnowledge) {
        await fetch("/api/knowledge/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticketId: params.id,
            resolution: resolveNotes,
            space: "IT", // Default space for IT knowledge articles
          }),
        })

        // Refresh the page to show the new article
        router.refresh()
      }
    } catch (error) {
      console.error("Error resolving ticket:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <TicketCheck className="h-12 w-12 text-[#006FCF] animate-pulse mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Loading ticket...</h2>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-[#D5001F] mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Ticket not found</h2>
          <p className="text-muted-foreground mt-2">The requested ticket could not be found.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <TicketCheck className="h-6 w-6 text-[#006FCF]" />
            {ticket.number}
          </h1>
          <p className="text-xl mt-1">{ticket.short_description}</p>
        </div>
        <div className="flex items-center gap-3">
          {getPriorityBadge(ticket.priority)}
          {getStatusBadge(ticket.state)}
          <Button variant="outline" className="gap-1" onClick={() => router.push("/dashboard")}>
            <RotateCcw className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">{ticket.description}</p>
              </div>

              {ticket.resolution_notes && (
                <div>
                  <h3 className="font-semibold mb-2">Resolution Notes</h3>
                  <p className="text-muted-foreground whitespace-pre-line">{ticket.resolution_notes}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <h3 className="font-semibold mb-2">Category</h3>
                  <p>{ticket.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Assigned To</h3>
                  <p>{ticket.assigned_to || "Unassigned"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Created On</h3>
                  <p>{formatDate(ticket.created_on)}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Last Updated</h3>
                  <p>{formatDate(ticket.updated_on)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="ai-analysis" className="space-y-4">
            <TabsList>
              <TabsTrigger value="ai-analysis" className="gap-2">
                <BrainCircuit className="h-4 w-4" />
                AI Analysis
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Knowledge Articles
              </TabsTrigger>
              <TabsTrigger value="resolve" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Resolve Ticket
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai-analysis" className="space-y-4">
              {!analysis && !suggestion ? (
                <Card>
                  <CardHeader>
                    <CardTitle>AI Analysis</CardTitle>
                    <CardDescription>Get AI-powered insights for this ticket</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <BrainCircuit className="h-16 w-16 text-[#006FCF] mb-4" />
                    <h3 className="text-xl font-semibold mb-2">AI Analysis Not Available</h3>
                    <p className="text-center text-muted-foreground mb-6">
                      Use AI to analyze this ticket, get insights, and suggest resolutions based on the knowledge base.
                    </p>
                    <Button className="gap-2 bg-[#006FCF]" disabled={isAnalyzing} onClick={analyzeTicket}>
                      <BrainCircuit className="h-4 w-4" />
                      {isAnalyzing ? "Analyzing..." : "Analyze Ticket with AI"}
                    </Button>
                  </CardContent>
                </Card>
              ) : isAnalyzing ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <BrainCircuit className="h-16 w-16 text-[#006FCF] animate-pulse mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Analyzing Ticket...</h3>
                    <p className="text-center text-muted-foreground">
                      Our AI is analyzing the ticket content and searching for relevant knowledge articles.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {analysis && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BrainCircuit className="h-5 w-5 text-[#006FCF]" />
                          Ticket Analysis
                        </CardTitle>
                        <CardDescription>AI-powered insights about this ticket</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div className="bg-muted/50 p-3 rounded-md">
                            <div className="text-sm text-muted-foreground">Suggested Category</div>
                            <div className="font-semibold">{analysis.category}</div>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-md">
                            <div className="text-sm text-muted-foreground">Suggested Priority</div>
                            <div className="font-semibold">{getPriorityText(analysis.priority)}</div>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-md">
                            <div className="text-sm text-muted-foreground">Complexity</div>
                            <div className="font-semibold capitalize">{analysis.complexity}</div>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-md col-span-2 sm:col-span-3">
                            <div className="text-sm text-muted-foreground">Estimated Resolution Time</div>
                            <div className="font-semibold">{formatMinutes(analysis.estimatedResolutionTime)}</div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Key Insights</h3>
                          <ul className="list-disc pl-5 space-y-1">
                            {analysis.keyInsights.map((insight, index) => (
                              <li key={index} className="text-muted-foreground">
                                {insight}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Suggested Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {analysis.suggestedTags.map((tag, index) => (
                              <Badge key={index} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {suggestion && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-[#00A859]" />
                          Resolution Suggestion
                        </CardTitle>
                        <CardDescription>AI-powered resolution recommendation</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-[#E6F9F1] border border-[#00A859]/20 rounded-md p-4">
                          <div className="font-semibold mb-2">Suggested Resolution</div>
                          <p className="text-muted-foreground whitespace-pre-line">{suggestion.suggestion}</p>
                        </div>

                        <div className="flex justify-between items-center">
                          <Badge className="bg-[#E6F2FF] text-[#006FCF] border-0">
                            Confidence: {suggestion.confidence}%
                          </Badge>
                          {suggestion.automationPossible && (
                            <Badge className="bg-[#E6F9F1] text-[#00A859] border-0">Automation Possible</Badge>
                          )}
                        </div>

                        <div>
                          <h3 className="font-semibold mb-2">Reasoning</h3>
                          <p className="text-muted-foreground">{suggestion.reasoning}</p>
                        </div>

                        {suggestion.automationPossible && suggestion.automationSteps && (
                          <div>
                            <h3 className="font-semibold mb-2">Automation Steps</h3>
                            <ol className="list-decimal pl-5 space-y-1">
                              {suggestion.automationSteps.map((step, index) => (
                                <li key={index} className="text-muted-foreground">
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        <div className="pt-2">
                          <Button className="w-full gap-2 bg-[#00A859]">
                            <CheckCircle className="h-4 w-4" />
                            Apply Suggested Resolution
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="knowledge" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Related Knowledge Articles</CardTitle>
                  <CardDescription>Articles from Confluence related to this ticket</CardDescription>
                </CardHeader>
                <CardContent>
                  {relatedArticles.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Related Articles Found</h3>
                      <p className="text-muted-foreground mb-6">
                        There are no knowledge articles related to this ticket yet.
                      </p>
                      <Button className="gap-2 bg-[#006FCF]" onClick={analyzeTicket}>
                        <BrainCircuit className="h-4 w-4" />
                        Find Related Articles with AI
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {relatedArticles.map((article) => (
                        <div key={article.id} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{article.title}</h3>
                            <Badge>{article.space}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mb-3">
                            Last updated by {article.author} on {formatDate(article.lastUpdated)}
                          </div>
                          <div
                            className="text-sm line-clamp-2 mb-3"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                          />
                          <div className="flex justify-between items-center">
                            <div className="flex flex-wrap gap-2">
                              {article.labels.slice(0, 3).map((label) => (
                                <Badge key={label} variant="outline" className="text-xs">
                                  {label}
                                </Badge>
                              ))}
                              {article.labels.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{article.labels.length - 3} more
                                </Badge>
                              )}
                            </div>
                            <Button size="sm" variant="outline" className="gap-1">
                              <ExternalLink className="h-3.5 w-3.5" />
                              View in Confluence
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resolve" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Resolve Ticket</CardTitle>
                  <CardDescription>Mark this ticket as resolved and document the solution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="resolution-notes" className="mb-2 block">
                      Resolution Notes
                    </Label>
                    <Textarea
                      id="resolution-notes"
                      placeholder="Describe how this ticket was resolved..."
                      className="min-h-[150px]"
                      value={resolveNotes}
                      onChange={(e) => setResolveNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="generate-kb" checked={generateKnowledge} onCheckedChange={setGenerateKnowledge} />
                    <Label htmlFor="generate-kb">Automatically generate knowledge article from resolution</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button className="gap-2 bg-[#00A859]" disabled={!resolveNotes} onClick={resolveTicket}>
                    <CheckCircle className="h-4 w-4" />
                    Resolve Ticket
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start gap-2 bg-[#006FCF]">
                <Pencil className="h-4 w-4" />
                Edit Ticket
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <User className="h-4 w-4" />
                Assign Ticket
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <MessageSquare className="h-4 w-4" />
                Add Comment
              </Button>
              <Button className="w-full justify-start gap-2 bg-[#00A859]">
                <CheckCircle className="h-4 w-4" />
                Resolve Ticket
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <ExternalLink className="h-4 w-4" />
                View in ServiceNow
              </Button>
            </CardContent>
          </Card>

          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.similarTickets && analysis.similarTickets.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Similar Tickets</h3>
                    <ul className="space-y-2">
                      {analysis.similarTickets.map((ticketId, index) => (
                        <li key={index} className="text-sm text-blue-600 underline cursor-pointer">
                          {ticketId}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Last AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">{new Date().toLocaleString()}</p>
                </div>

                <Button className="w-full gap-2 mt-2" variant="outline" onClick={analyzeTicket}>
                  <BrainCircuit className="h-4 w-4" />
                  Refresh AI Analysis
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Ticket Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="bg-[#E6F2FF] p-2 rounded-full">
                      <TicketCheck className="h-4 w-4 text-[#006FCF]" />
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                  </div>
                  <div>
                    <div className="font-semibold">Ticket Created</div>
                    <div className="text-sm text-muted-foreground">{formatDate(ticket.created_on)}</div>
                  </div>
                </div>

                {/* Add more timeline events conditionally based on ticket history */}
                {ticket.assigned_to && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="bg-[#E6F2FF] p-2 rounded-full">
                        <User className="h-4 w-4 text-[#006FCF]" />
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    </div>
                    <div>
                      <div className="font-semibold">Assigned to {ticket.assigned_to}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(ticket.updated_on)}</div>
                    </div>
                  </div>
                )}

                {ticket.resolved_on && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="bg-[#E6F9F1] p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-[#00A859]" />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">Ticket Resolved</div>
                      <div className="text-sm text-muted-foreground">{formatDate(ticket.resolved_on)}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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

// Helper function to get priority text
function getPriorityText(priority: number) {
  switch (priority) {
    case 1:
      return "Critical (P1)"
    case 2:
      return "High (P2)"
    case 3:
      return "Medium (P3)"
    case 4:
      return "Low (P4)"
    case 5:
      return "Very Low (P5)"
    default:
      return "Unknown"
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
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Helper function to format minutes
function formatMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes} minutes`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`
  }

  return `${hours} ${hours === 1 ? "hour" : "hours"} ${remainingMinutes} ${remainingMinutes === 1 ? "minute" : "minutes"}`
}
