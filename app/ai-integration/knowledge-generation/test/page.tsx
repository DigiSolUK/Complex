"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  CheckCircle,
  Copy,
  FileText,
  Loader2,
  RefreshCw,
  TicketCheck,
} from "lucide-react"

// Sample ticket data
const sampleTicket = {
  id: "INC0001234",
  title: "Unable to access SharePoint site",
  description:
    "When trying to access the Marketing team's SharePoint site, I get an error message saying 'Access Denied'. I was able to access this site yesterday without any issues. Other team members can still access the site.",
  category: "Access Management",
  priority: "Medium",
  status: "Resolved",
  resolution:
    "The issue was resolved by adding the user back to the 'Marketing Team' security group in Active Directory. The user had been inadvertently removed during routine maintenance. After adding the user back to the group and waiting for AD synchronization to complete (approximately 30 minutes), the user was able to access the SharePoint site again.",
}

export default function KnowledgeGenerationTestPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [generatedArticle, setGeneratedArticle] = useState("")
  const [activeTab, setActiveTab] = useState("preview")
  const [confidence, setConfidence] = useState(0)
  const [generationProgress, setGenerationProgress] = useState(0)

  // Function to simulate the AI generation process
  const simulateGeneration = () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    // Simulate progress updates
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setIsGenerated(true)
          setConfidence(92)
          setGeneratedArticle(`
<h1>Troubleshooting SharePoint Access Denied Issues</h1>

<h2>Problem Description</h2>
<p>Users may encounter "Access Denied" errors when attempting to access SharePoint sites they previously had permission to view. This issue commonly occurs when a user has been removed from the appropriate Active Directory security group that grants access to the SharePoint site.</p>

<h2>Symptoms</h2>
<ul>
  <li>User receives an "Access Denied" error message when attempting to access a SharePoint site</li>
  <li>User previously had access to the site without issues</li>
  <li>Other team members can still access the site without problems</li>
  <li>No recent changes were made to the SharePoint site permissions directly</li>
</ul>

<h2>Cause</h2>
<p>The most common cause of this issue is inadvertent removal from an Active Directory security group during routine maintenance or user account management. SharePoint permissions are often managed through AD security groups, and changes to group membership may take time to propagate through the system.</p>

<h2>Resolution Steps</h2>
<ol>
  <li>Verify which Active Directory security group is used for access to the specific SharePoint site</li>
  <li>Check if the user is a member of the required security group using Active Directory Users and Computers</li>
  <li>If the user is not a member of the group, add them back to the appropriate security group</li>
  <li>Wait for Active Directory synchronization to complete (typically 30 minutes to 1 hour)</li>
  <li>Have the user attempt to access the SharePoint site again</li>
  <li>If the issue persists, check SharePoint site permissions directly and verify there are no explicit denies set for the user</li>
</ol>

<h2>Prevention Tips</h2>
<ul>
  <li>Implement a change management process for Active Directory group membership modifications</li>
  <li>Document which security groups are used for which SharePoint sites</li>
  <li>Consider using PowerShell scripts to audit group membership changes</li>
  <li>Train IT staff on the relationship between AD groups and SharePoint permissions</li>
  <li>Regularly review access logs to identify potential permission issues before they impact users</li>
</ul>

<h2>Related Information</h2>
<p>This article is related to Active Directory security groups, SharePoint permissions, and access management. For more information, see the following related articles:</p>
<ul>
  <li><a href="#">Active Directory Group Management Guide</a></li>
  <li><a href="#">SharePoint Permission Levels Explained</a></li>
  <li><a href="#">Troubleshooting SharePoint Access Issues</a></li>
</ul>
          `)
          return 100
        }
        return newProgress
      })
    }, 300)
  }

  // Function to advance to the next step
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Function to go back to the previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() => router.push("/ai-integration/knowledge-generation")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Knowledge Generation
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[#006FCF]" />
            <h1 className="text-3xl font-bold">Test Knowledge Article Generation</h1>
          </div>
          <p className="text-muted-foreground mt-1">
            See how AI transforms a resolved ServiceNow ticket into a structured Confluence knowledge article
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="w-full">
        <div className="flex justify-between mb-2">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-[#006FCF] text-white" : "bg-gray-200"}`}
            >
              1
            </div>
            <span className="text-xs mt-1">Ticket Selection</span>
          </div>
          <div className="flex-1 flex items-center">
            <div className={`h-1 w-full ${currentStep >= 2 ? "bg-[#006FCF]" : "bg-gray-200"}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-[#006FCF] text-white" : "bg-gray-200"}`}
            >
              2
            </div>
            <span className="text-xs mt-1">AI Analysis</span>
          </div>
          <div className="flex-1 flex items-center">
            <div className={`h-1 w-full ${currentStep >= 3 ? "bg-[#006FCF]" : "bg-gray-200"}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-[#006FCF] text-white" : "bg-gray-200"}`}
            >
              3
            </div>
            <span className="text-xs mt-1">Article Generation</span>
          </div>
          <div className="flex-1 flex items-center">
            <div className={`h-1 w-full ${currentStep >= 4 ? "bg-[#006FCF]" : "bg-gray-200"}`}></div>
          </div>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 4 ? "bg-[#006FCF] text-white" : "bg-gray-200"}`}
            >
              4
            </div>
            <span className="text-xs mt-1">Review & Publish</span>
          </div>
        </div>
      </div>

      {/* Step 1: Ticket Selection */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Select Resolved Ticket</CardTitle>
            <CardDescription>Choose a resolved ServiceNow ticket to generate a knowledge article</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-md bg-[#F8FAFC]">
              <div className="flex items-center gap-2 mb-3">
                <TicketCheck className="h-5 w-5 text-[#006FCF]" />
                <h3 className="font-semibold">Ticket Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-1">Ticket ID</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{sampleTicket.id}</Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Resolved
                    </Badge>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-1">Category / Priority</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{sampleTicket.category}</Badge>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      {sampleTicket.priority}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium mb-1">Title</div>
                <div className="font-medium">{sampleTicket.title}</div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium mb-1">Description</div>
                <div className="text-sm p-3 bg-white border rounded-md">{sampleTicket.description}</div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-medium mb-1">Resolution</div>
                <div className="text-sm p-3 bg-white border rounded-md border-green-200">{sampleTicket.resolution}</div>
              </div>
            </div>

            <div className="p-4 border rounded-md">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-[#006FCF]" />
                <h3 className="font-semibold">Knowledge Article Settings</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="space">Confluence Space</Label>
                  <Select defaultValue="it-support">
                    <SelectTrigger id="space">
                      <SelectValue placeholder="Select space" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it-support">IT Support</SelectItem>
                      <SelectItem value="network">Network</SelectItem>
                      <SelectItem value="applications">Applications</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template">Article Template</Label>
                  <Select defaultValue="troubleshooting">
                    <SelectTrigger id="template">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="troubleshooting">Troubleshooting Guide</SelectItem>
                      <SelectItem value="howto">How-To Guide</SelectItem>
                      <SelectItem value="reference">Reference Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={nextStep} className="bg-[#006FCF]">
              Continue to AI Analysis
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 2: AI Analysis */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: AI Analysis</CardTitle>
            <CardDescription>AI analyzes the ticket to extract key information and structure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-3">Problem Classification</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Primary Category</span>
                      <Badge>Access Management</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Subcategory</span>
                      <Badge variant="outline">SharePoint Access</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Related Systems</span>
                      <div className="flex gap-1">
                        <Badge variant="outline">SharePoint</Badge>
                        <Badge variant="outline">Active Directory</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-3">Key Entities Identified</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800">SharePoint site</Badge>
                      <span className="text-sm text-muted-foreground">Resource</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-800">Marketing Team</Badge>
                      <span className="text-sm text-muted-foreground">Group</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-100 text-red-800">Access Denied</Badge>
                      <span className="text-sm text-muted-foreground">Error</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800">Active Directory</Badge>
                      <span className="text-sm text-muted-foreground">System</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-800">Security Group</Badge>
                      <span className="text-sm text-muted-foreground">Permission</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-3">Resolution Analysis</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium">Root Cause</div>
                      <div className="text-sm p-2 bg-[#F8FAFC] rounded-md">
                        User removed from required Active Directory security group
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Resolution Method</div>
                      <div className="text-sm p-2 bg-[#F8FAFC] rounded-md">
                        Add user back to security group and wait for synchronization
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Resolution Steps</div>
                      <div className="text-sm p-2 bg-[#F8FAFC] rounded-md">
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Identify required security group</li>
                          <li>Add user to security group</li>
                          <li>Wait for AD synchronization</li>
                          <li>Verify access</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-3">Related Knowledge</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">KB0000087: SharePoint Permission Management</div>
                      <Badge variant="outline">87% Relevant</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">KB0000156: Active Directory Group Management</div>
                      <Badge variant="outline">82% Relevant</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm">KB0000203: Troubleshooting Access Issues</div>
                      <Badge variant="outline">75% Relevant</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="font-semibold mb-3">Knowledge Gap Analysis</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Existing Coverage</span>
                    <span className="text-sm font-medium">Partial (68%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "68%" }}></div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    A specific article about SharePoint access denied errors related to AD group removal is missing from
                    the knowledge base.
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep} className="bg-[#006FCF]">
              Generate Knowledge Article
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 3: Article Generation */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Article Generation</CardTitle>
            <CardDescription>AI is generating a structured knowledge article based on the ticket</CardDescription>
          </CardHeader>
          <CardContent>
            {!isGenerated ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BrainCircuit className="h-20 w-20 text-[#006FCF] animate-pulse mb-6" />
                <h3 className="text-xl font-semibold mb-4">Generating Knowledge Article...</h3>

                <div className="w-full max-w-md mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">{generationProgress.toFixed(0)}% Complete</span>
                    <span className="text-sm">{generationProgress < 100 ? "Processing..." : "Complete!"}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#006FCF] h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4 w-full max-w-md">
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${generationProgress >= 20 ? "bg-green-500 text-white" : "bg-gray-200"}`}
                    >
                      {generationProgress >= 20 && <CheckCircle className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Analyzing ticket content</div>
                      <div className="text-xs text-muted-foreground">Extracting key information from ticket</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${generationProgress >= 40 ? "bg-green-500 text-white" : "bg-gray-200"}`}
                    >
                      {generationProgress >= 40 && <CheckCircle className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Structuring article sections</div>
                      <div className="text-xs text-muted-foreground">
                        Creating problem, cause, and resolution sections
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${generationProgress >= 60 ? "bg-green-500 text-white" : "bg-gray-200"}`}
                    >
                      {generationProgress >= 60 && <CheckCircle className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Generating detailed content</div>
                      <div className="text-xs text-muted-foreground">Writing comprehensive explanations and steps</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${generationProgress >= 80 ? "bg-green-500 text-white" : "bg-gray-200"}`}
                    >
                      {generationProgress >= 80 && <CheckCircle className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Adding prevention tips</div>
                      <div className="text-xs text-muted-foreground">
                        Including proactive measures to prevent recurrence
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${generationProgress >= 100 ? "bg-green-500 text-white" : "bg-gray-200"}`}
                    >
                      {generationProgress >= 100 && <CheckCircle className="h-3 w-3" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Formatting for Confluence</div>
                      <div className="text-xs text-muted-foreground">
                        Applying proper HTML formatting for Confluence
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="mt-8 bg-[#006FCF]" onClick={simulateGeneration} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="mr-2 h-4 w-4" />
                      Start Generation
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="bg-green-100 text-green-800 p-3 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Knowledge Article Generated!</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  The AI has successfully generated a structured knowledge article based on the ticket resolution.
                </p>

                <div className="flex items-center gap-4 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#006FCF]">{confidence}%</div>
                    <div className="text-sm text-muted-foreground">Confidence Score</div>
                  </div>
                  <div className="h-10 border-r"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#006FCF]">5</div>
                    <div className="text-sm text-muted-foreground">Sections Created</div>
                  </div>
                  <div className="h-10 border-r"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#006FCF]">3</div>
                    <div className="text-sm text-muted-foreground">Related Articles</div>
                  </div>
                </div>

                <Button onClick={nextStep} className="bg-[#006FCF]">
                  Review Generated Article
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep} disabled={isGenerating}>
              Back
            </Button>
            <Button onClick={nextStep} className="bg-[#006FCF]" disabled={!isGenerated || isGenerating}>
              Continue to Review
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step 4: Review & Publish */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: Review & Publish</CardTitle>
            <CardDescription>Review the generated article and publish to Confluence</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge className="bg-[#FFF4EC] text-[#FF6900] border-0">AI Generated</Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Regenerate
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md p-4 max-h-[500px] overflow-y-auto">
                  <div dangerouslySetInnerHTML={{ __html: generatedArticle }} />
                </div>
              </TabsContent>

              <TabsContent value="edit">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="article-title">Article Title</Label>
                    <Input id="article-title" defaultValue="Troubleshooting SharePoint Access Denied Issues" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="article-content">Article Content</Label>
                    <Textarea
                      id="article-content"
                      value={generatedArticle}
                      onChange={(e) => setGeneratedArticle(e.target.value)}
                      rows={20}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metadata" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="space">Confluence Space</Label>
                      <Select defaultValue="it-support">
                        <SelectTrigger id="space">
                          <SelectValue placeholder="Select space" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="it-support">IT Support</SelectItem>
                          <SelectItem value="network">Network</SelectItem>
                          <SelectItem value="applications">Applications</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parent-page">Parent Page</Label>
                      <Select defaultValue="troubleshooting">
                        <SelectTrigger id="parent-page">
                          <SelectValue placeholder="Select parent page" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="troubleshooting">Troubleshooting Guides</SelectItem>
                          <SelectItem value="howto">How-To Guides</SelectItem>
                          <SelectItem value="reference">Reference Documents</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="labels">Labels</Label>
                      <Input
                        id="labels"
                        defaultValue="sharepoint, access-denied, active-directory, security-groups, troubleshooting"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="related-articles">Related Articles</Label>
                      <Input id="related-articles" defaultValue="KB0000087, KB0000156, KB0000203" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="source-ticket">Source Ticket</Label>
                      <Input id="source-ticket" value={sampleTicket.id} readOnly />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="article-summary">Article Summary</Label>
                      <Textarea
                        id="article-summary"
                        defaultValue="A guide to troubleshooting SharePoint 'Access Denied' errors caused by Active Directory security group membership issues."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">Save as Draft</Button>
              <Button className="bg-[#00A859]">
                <BookOpen className="mr-2 h-4 w-4" />
                Publish to Confluence
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* AI Process Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>How AI Knowledge Generation Works</CardTitle>
          <CardDescription>The process of transforming ticket resolutions into knowledge articles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#E6F2FF] rounded-lg p-4 text-center">
              <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
                <TicketCheck className="h-5 w-5 text-[#006FCF]" />
              </div>
              <h3 className="font-semibold mb-2">Ticket Analysis</h3>
              <p className="text-sm text-muted-foreground">
                AI extracts key information from the resolved ServiceNow ticket
              </p>
            </div>

            <div className="bg-[#F7F7F8] rounded-lg p-4 text-center">
              <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
                <BrainCircuit className="h-5 w-5 text-[#006FCF]" />
              </div>
              <h3 className="font-semibold mb-2">Content Structuring</h3>
              <p className="text-sm text-muted-foreground">
                AI organizes information into a structured knowledge article format
              </p>
            </div>

            <div className="bg-[#FFF4EC] rounded-lg p-4 text-center">
              <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
                <FileText className="h-5 w-5 text-[#FF6900]" />
              </div>
              <h3 className="font-semibold mb-2">Article Generation</h3>
              <p className="text-sm text-muted-foreground">
                AI generates comprehensive content with proper formatting and sections
              </p>
            </div>

            <div className="bg-[#E6F9F1] rounded-lg p-4 text-center">
              <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
                <BookOpen className="h-5 w-5 text-[#00A859]" />
              </div>
              <h3 className="font-semibold mb-2">Confluence Publishing</h3>
              <p className="text-sm text-muted-foreground">
                Article is published to Confluence with appropriate tags and metadata
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
