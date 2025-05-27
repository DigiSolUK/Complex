"use client"

import { useState } from "react"
import { Save, Shield, Sliders, Undo } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ComplianceThresholdsPage() {
  const [thresholds, setThresholds] = useState({
    criticalServices: {
      uptime: 99.95,
      responseTime: 15,
      resolutionTime: 240,
      reportingDeadline: 24,
      autoEscalate: true,
    },
    importantServices: {
      uptime: 99.9,
      responseTime: 30,
      resolutionTime: 480,
      reportingDeadline: 48,
      autoEscalate: true,
    },
    standardServices: {
      uptime: 99.5,
      responseTime: 60,
      resolutionTime: 1440,
      reportingDeadline: 72,
      autoEscalate: false,
    },
  })

  const [aiRecommendations, setAiRecommendations] = useState<null | {
    criticalServices: { uptime: number; responseTime: number }
    importantServices: { uptime: number; responseTime: number }
    explanation: string
  }>(null)

  const [loading, setLoading] = useState(false)

  const handleThresholdChange = (
    category: "criticalServices" | "importantServices" | "standardServices",
    field: string,
    value: any,
  ) => {
    setThresholds((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }))
  }

  const handleReset = () => {
    setThresholds({
      criticalServices: {
        uptime: 99.95,
        responseTime: 15,
        resolutionTime: 240,
        reportingDeadline: 24,
        autoEscalate: true,
      },
      importantServices: {
        uptime: 99.9,
        responseTime: 30,
        resolutionTime: 480,
        reportingDeadline: 48,
        autoEscalate: true,
      },
      standardServices: {
        uptime: 99.5,
        responseTime: 60,
        resolutionTime: 1440,
        reportingDeadline: 72,
        autoEscalate: false,
      },
    })
  }

  const handleSave = () => {
    // In a real app, this would save to a database
    alert("Thresholds saved successfully")
  }

  const getAiRecommendations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/compliance/ai-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentThresholds: thresholds,
          serviceData: {
            criticalIncidents: 24,
            importantIncidents: 42,
            standardIncidents: 78,
            averageResponseTimes: {
              critical: 12,
              important: 28,
              standard: 55,
            },
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI recommendations")
      }

      const data = await response.json()
      setAiRecommendations(data)
    } catch (error) {
      console.error("Error getting AI recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyAiRecommendations = () => {
    if (!aiRecommendations) return

    setThresholds((prev) => ({
      ...prev,
      criticalServices: {
        ...prev.criticalServices,
        uptime: aiRecommendations.criticalServices.uptime,
        responseTime: aiRecommendations.criticalServices.responseTime,
      },
      importantServices: {
        ...prev.importantServices,
        uptime: aiRecommendations.importantServices.uptime,
        responseTime: aiRecommendations.importantServices.responseTime,
      },
    }))

    setAiRecommendations(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">FCA Reporting Thresholds</h1>
        <p className="text-muted-foreground">Configure compliance thresholds for different service categories</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 px-3 py-1">
            <Shield className="h-3.5 w-3.5 text-[#8855cc]" />
            <span>FCA Compliance Settings</span>
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1" onClick={handleReset}>
            <Undo className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button className="gap-1" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {aiRecommendations && (
        <Alert className="bg-[#e6ecff] border-[#99ccff] text-[#5588cc]">
          <Shield className="h-4 w-4" />
          <AlertTitle>AI-Powered Recommendations Available</AlertTitle>
          <AlertDescription>
            <div className="mt-2 space-y-2">
              <p>{aiRecommendations.explanation}</p>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline" onClick={() => setAiRecommendations(null)}>
                  Dismiss
                </Button>
                <Button
                  size="sm"
                  className="bg-[#99ccff] text-[#5588cc] hover:bg-[#b3daff]"
                  onClick={applyAiRecommendations}
                >
                  Apply Recommendations
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="critical" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="critical">Critical Services</TabsTrigger>
            <TabsTrigger value="important">Important Services</TabsTrigger>
            <TabsTrigger value="standard">Standard Services</TabsTrigger>
          </TabsList>
          <Button variant="outline" className="gap-1" onClick={getAiRecommendations} disabled={loading}>
            <Sliders className="h-4 w-4" />
            {loading ? "Analyzing..." : "Get AI Recommendations"}
          </Button>
        </div>

        <TabsContent value="critical">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Availability Thresholds</CardTitle>
                <CardDescription>Minimum uptime requirements for critical services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="critical-uptime">Minimum Uptime Percentage</Label>
                    <span className="text-sm font-medium">{thresholds.criticalServices.uptime}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="critical-uptime"
                      min={99}
                      max={100}
                      step={0.01}
                      value={[thresholds.criticalServices.uptime]}
                      onValueChange={(value) => handleThresholdChange("criticalServices", "uptime", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={thresholds.criticalServices.uptime}
                      onChange={(e) =>
                        handleThresholdChange("criticalServices", "uptime", Number.parseFloat(e.target.value))
                      }
                      className="w-20"
                      step={0.01}
                      min={99}
                      max={100}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    FCA requires critical financial services to maintain at least 99.95% uptime
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Maximum Allowed Downtime</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="cursor-help">
                            {(100 - thresholds.criticalServices.uptime) * 14.4} minutes/day
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Based on current uptime threshold of {thresholds.criticalServices.uptime}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Calculated as maximum allowed downtime per day based on uptime percentage
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incident Response Thresholds</CardTitle>
                <CardDescription>Response and resolution time requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="critical-response">Maximum Response Time (minutes)</Label>
                    <span className="text-sm font-medium">{thresholds.criticalServices.responseTime} min</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="critical-response"
                      min={5}
                      max={60}
                      step={1}
                      value={[thresholds.criticalServices.responseTime]}
                      onValueChange={(value) => handleThresholdChange("criticalServices", "responseTime", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={thresholds.criticalServices.responseTime}
                      onChange={(e) =>
                        handleThresholdChange("criticalServices", "responseTime", Number.parseInt(e.target.value))
                      }
                      className="w-20"
                      min={5}
                      max={60}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Time from alert to acknowledgment for critical service incidents
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="critical-resolution">Target Resolution Time (minutes)</Label>
                    <span className="text-sm font-medium">{thresholds.criticalServices.resolutionTime} min</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="critical-resolution"
                      min={60}
                      max={1440}
                      step={30}
                      value={[thresholds.criticalServices.resolutionTime]}
                      onValueChange={(value) => handleThresholdChange("criticalServices", "resolutionTime", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={thresholds.criticalServices.resolutionTime}
                      onChange={(e) =>
                        handleThresholdChange("criticalServices", "resolutionTime", Number.parseInt(e.target.value))
                      }
                      className="w-20"
                      min={60}
                      max={1440}
                      step={30}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Target time to resolve critical service incidents</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Regulatory Reporting Settings</CardTitle>
                <CardDescription>FCA incident reporting requirements for critical services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="critical-reporting">Reporting Deadline (hours)</Label>
                    <Select
                      value={thresholds.criticalServices.reportingDeadline.toString()}
                      onValueChange={(value) =>
                        handleThresholdChange("criticalServices", "reportingDeadline", Number.parseInt(value))
                      }
                    >
                      <SelectTrigger id="critical-reporting">
                        <SelectValue placeholder="Select deadline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 hours</SelectItem>
                        <SelectItem value="12">12 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                        <SelectItem value="72">72 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Maximum time to submit initial incident report to FCA
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="critical-auto-escalate">Auto-Escalate to Compliance Team</Label>
                      <Switch
                        id="critical-auto-escalate"
                        checked={thresholds.criticalServices.autoEscalate}
                        onCheckedChange={(checked) =>
                          handleThresholdChange("criticalServices", "autoEscalate", checked)
                        }
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Automatically notify compliance team for all critical service incidents
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  <Shield className="inline-block h-4 w-4 mr-1 text-[#8855cc]" />
                  FCA requires all critical service incidents to be reported within 24 hours, with a detailed root cause
                  analysis within 5 business days.
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="important">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Availability Thresholds</CardTitle>
                <CardDescription>Minimum uptime requirements for important services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="important-uptime">Minimum Uptime Percentage</Label>
                    <span className="text-sm font-medium">{thresholds.importantServices.uptime}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="important-uptime"
                      min={99}
                      max={100}
                      step={0.01}
                      value={[thresholds.importantServices.uptime]}
                      onValueChange={(value) => handleThresholdChange("importantServices", "uptime", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={thresholds.importantServices.uptime}
                      onChange={(e) =>
                        handleThresholdChange("importantServices", "uptime", Number.parseFloat(e.target.value))
                      }
                      className="w-20"
                      step={0.01}
                      min={99}
                      max={100}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    FCA requires important financial services to maintain at least 99.9% uptime
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Maximum Allowed Downtime</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="cursor-help">
                            {(100 - thresholds.importantServices.uptime) * 14.4} minutes/day
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Based on current uptime threshold of {thresholds.importantServices.uptime}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Calculated as maximum allowed downtime per day based on uptime percentage
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incident Response Thresholds</CardTitle>
                <CardDescription>Response and resolution time requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="important-response">Maximum Response Time (minutes)</Label>
                    <span className="text-sm font-medium">{thresholds.importantServices.responseTime} min</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="important-response"
                      min={5}
                      max={60}
                      step={1}
                      value={[thresholds.importantServices.responseTime]}
                      onValueChange={(value) => handleThresholdChange("importantServices", "responseTime", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={thresholds.importantServices.responseTime}
                      onChange={(e) =>
                        handleThresholdChange("importantServices", "responseTime", Number.parseInt(e.target.value))
                      }
                      className="w-20"
                      min={5}
                      max={60}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Time from alert to acknowledgment for important service incidents
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="important-resolution">Target Resolution Time (minutes)</Label>
                    <span className="text-sm font-medium">{thresholds.importantServices.resolutionTime} min</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="important-resolution"
                      min={60}
                      max={1440}
                      step={30}
                      value={[thresholds.importantServices.resolutionTime]}
                      onValueChange={(value) => handleThresholdChange("importantServices", "resolutionTime", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={thresholds.importantServices.resolutionTime}
                      onChange={(e) =>
                        handleThresholdChange("importantServices", "resolutionTime", Number.parseInt(e.target.value))
                      }
                      className="w-20"
                      min={60}
                      max={1440}
                      step={30}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Target time to resolve important service incidents</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Regulatory Reporting Settings</CardTitle>
                <CardDescription>FCA incident reporting requirements for important services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="important-reporting">Reporting Deadline (hours)</Label>
                    <Select
                      value={thresholds.importantServices.reportingDeadline.toString()}
                      onValueChange={(value) =>
                        handleThresholdChange("importantServices", "reportingDeadline", Number.parseInt(value))
                      }
                    >
                      <SelectTrigger id="important-reporting">
                        <SelectValue placeholder="Select deadline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                        <SelectItem value="72">72 hours</SelectItem>
                        <SelectItem value="96">96 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Maximum time to submit initial incident report to FCA
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="important-auto-escalate">Auto-Escalate to Compliance Team</Label>
                      <Switch
                        id="important-auto-escalate"
                        checked={thresholds.importantServices.autoEscalate}
                        onCheckedChange={(checked) =>
                          handleThresholdChange("importantServices", "autoEscalate", checked)
                        }
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Automatically notify compliance team for all important service incidents
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  <Shield className="inline-block h-4 w-4 mr-1 text-[#8855cc]" />
                  FCA requires important service incidents to be reported within 48 hours, with a detailed root cause
                  analysis within 7 business days.
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="standard">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Service Availability Thresholds</CardTitle>
                <CardDescription>Minimum uptime requirements for standard services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="standard-uptime">Minimum Uptime Percentage</Label>
                    <span className="text-sm font-medium">{thresholds.standardServices.uptime}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="standard-uptime"
                      min={99}
                      max={100}
                      step={0.01}
                      value={[thresholds.standardServices.uptime]}
                      onValueChange={(value) => handleThresholdChange("standardServices", "uptime", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={thresholds.standardServices.uptime}
                      onChange={(e) =>
                        handleThresholdChange("standardServices", "uptime", Number.parseFloat(e.target.value))
                      }
                      className="w-20"
                      step={0.01}
                      min={99}
                      max={100}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    FCA requires standard financial services to maintain at least 99.5% uptime
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Maximum Allowed Downtime</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant="outline" className="cursor-help">
                            {(100 - thresholds.standardServices.uptime) * 14.4} minutes/day
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Based on current uptime threshold of {thresholds.standardServices.uptime}%</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Calculated as maximum allowed downtime per day based on uptime percentage
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incident Response Thresholds</CardTitle>
                <CardDescription>Response and resolution time requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="standard-response">Maximum Response Time (minutes)</Label>
                    <span className="text-sm font-medium">{thresholds.standardServices.responseTime} min</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="standard-response"
                      min={15}
                      max={120}
                      step={5}
                      value={[thresholds.standardServices.responseTime]}
                      onValueChange={(value) => handleThresholdChange("standardServices", "responseTime", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={thresholds.standardServices.responseTime}
                      onChange={(e) =>
                        handleThresholdChange("standardServices", "responseTime", Number.parseInt(e.target.value))
                      }
                      className="w-20"
                      min={15}
                      max={120}
                      step={5}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Time from alert to acknowledgment for standard service incidents
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="standard-resolution">Target Resolution Time (minutes)</Label>
                    <span className="text-sm font-medium">{thresholds.standardServices.resolutionTime} min</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      id="standard-resolution"
                      min={240}
                      max={2880}
                      step={60}
                      value={[thresholds.standardServices.resolutionTime]}
                      onValueChange={(value) => handleThresholdChange("standardServices", "resolutionTime", value[0])}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={thresholds.standardServices.resolutionTime}
                      onChange={(e) =>
                        handleThresholdChange("standardServices", "resolutionTime", Number.parseInt(e.target.value))
                      }
                      className="w-20"
                      min={240}
                      max={2880}
                      step={60}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Target time to resolve standard service incidents</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Regulatory Reporting Settings</CardTitle>
                <CardDescription>FCA incident reporting requirements for standard services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="standard-reporting">Reporting Deadline (hours)</Label>
                    <Select
                      value={thresholds.standardServices.reportingDeadline.toString()}
                      onValueChange={(value) =>
                        handleThresholdChange("standardServices", "reportingDeadline", Number.parseInt(value))
                      }
                    >
                      <SelectTrigger id="standard-reporting">
                        <SelectValue placeholder="Select deadline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="48">48 hours</SelectItem>
                        <SelectItem value="72">72 hours</SelectItem>
                        <SelectItem value="96">96 hours</SelectItem>
                        <SelectItem value="120">120 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Maximum time to submit initial incident report to FCA
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="standard-auto-escalate">Auto-Escalate to Compliance Team</Label>
                      <Switch
                        id="standard-auto-escalate"
                        checked={thresholds.standardServices.autoEscalate}
                        onCheckedChange={(checked) =>
                          handleThresholdChange("standardServices", "autoEscalate", checked)
                        }
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Automatically notify compliance team for all standard service incidents
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <p className="text-sm text-muted-foreground">
                  <Shield className="inline-block h-4 w-4 mr-1 text-[#8855cc]" />
                  FCA requires standard service incidents to be reported within 72 hours, with a detailed root cause
                  analysis within 10 business days.
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
