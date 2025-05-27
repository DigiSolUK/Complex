"use client"

import { useState } from "react"
import { AlertCircle, BrainCircuit, Clock, Database, LineChart, Save, Settings, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"

export default function AIMonitoringPage() {
  const [aiEnabled, setAiEnabled] = useState(false)
  const [activating, setActivating] = useState(false)
  const [activated, setActivated] = useState(false)
  const [sensitivityLevel, setSensitivityLevel] = useState(70)
  const [trainingProgress, setTrainingProgress] = useState(0)
  const [trainingStatus, setTrainingStatus] = useState<"idle" | "training" | "completed">("idle")
  const [selectedModels, setSelectedModels] = useState<string[]>(["anomaly_detection", "pattern_recognition"])
  const [dataRetention, setDataRetention] = useState("90")
  const [alertThreshold, setAlertThreshold] = useState("medium")

  const handleActivate = () => {
    setActivating(true)
    setAiEnabled(true)

    // Simulate AI model training progress
    let progress = 0
    setTrainingStatus("training")

    const interval = setInterval(() => {
      progress += 5
      setTrainingProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setTrainingStatus("completed")
        setActivated(true)
        setActivating(false)
      }
    }, 500)
  }

  const handleModelToggle = (modelId: string) => {
    setSelectedModels((prev) => (prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]))
  }

  const aiModels = [
    {
      id: "anomaly_detection",
      name: "Anomaly Detection",
      description: "Identifies unusual patterns in metrics that may indicate potential incidents",
      accuracy: 94,
      resource: "Low",
    },
    {
      id: "pattern_recognition",
      name: "Pattern Recognition",
      description: "Recognizes recurring patterns that lead to incidents based on historical data",
      accuracy: 91,
      resource: "Medium",
    },
    {
      id: "predictive_alerts",
      name: "Predictive Alerts",
      description: "Forecasts potential incidents before they occur based on trend analysis",
      accuracy: 87,
      resource: "High",
    },
    {
      id: "root_cause_analysis",
      name: "Root Cause Analysis",
      description: "Automatically identifies potential root causes for incidents",
      accuracy: 82,
      resource: "Medium",
    },
    {
      id: "seasonal_forecasting",
      name: "Seasonal Forecasting",
      description: "Predicts incident likelihood based on seasonal patterns and business cycles",
      accuracy: 89,
      resource: "Low",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Monitoring Configuration</h1>
        <p className="text-muted-foreground">Configure predictive analytics for incident prevention</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`px-3 py-1 ${activated ? "bg-[#E6F2FF] text-[#006FCF] border-[#006FCF]" : ""}`}
          >
            <BrainCircuit className="h-3.5 w-3.5 mr-1" />
            <span>{activated ? "AI Monitoring Active" : "AI Monitoring Inactive"}</span>
          </Badge>
          {activated && (
            <Badge variant="outline" className="bg-[#E6F9F1] text-[#00A859] border-[#00A859] px-3 py-1">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              <span>Predictive Analytics Enabled</span>
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          {!activated ? (
            <Button
              onClick={handleActivate}
              disabled={activating}
              className="gap-1 bg-[#006FCF] hover:bg-[#0055A6] text-white"
            >
              {activating ? (
                <>
                  <LineChart className="h-4 w-4 animate-pulse" />
                  Activating...
                </>
              ) : (
                <>
                  <BrainCircuit className="h-4 w-4" />
                  Activate AI Monitoring
                </>
              )}
            </Button>
          ) : (
            <Button
              className="gap-1 bg-[#006FCF] hover:bg-[#0055A6] text-white"
              onClick={() => {
                // Save settings
              }}
            >
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
          )}
        </div>
      </div>

      {activating && (
        <Card className="border-[#006FCF]">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#006FCF]">AI Model Training</CardTitle>
            <CardDescription>Training predictive models with your historical data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Training Progress</span>
                  <span>{trainingProgress}%</span>
                </div>
                <Progress value={trainingProgress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-[#006FCF]" />
                  <span>Processing historical incidents</span>
                </div>
                <div className="flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-[#006FCF]" />
                  <span>Building prediction models</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#006FCF]" />
                  <span>Analyzing temporal patterns</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-[#006FCF]" />
                  <span>Calibrating alert thresholds</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activated && (
        <Tabs defaultValue="models" className="space-y-6">
          <TabsList>
            <TabsTrigger value="models">AI Models</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
            <TabsTrigger value="alerts">Alert Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {aiModels.map((model) => (
                <Card
                  key={model.id}
                  className={`border ${selectedModels.includes(model.id) ? "border-[#006FCF]" : ""}`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{model.name}</CardTitle>
                      <Switch
                        checked={selectedModels.includes(model.id)}
                        onCheckedChange={() => handleModelToggle(model.id)}
                      />
                    </div>
                    <CardDescription>{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Accuracy:</span>
                        <div className="flex items-center mt-1">
                          <span className="font-medium">{model.accuracy}%</span>
                          <Progress
                            value={model.accuracy}
                            className="h-2 ml-2 flex-1"
                            indicatorClassName={`${model.accuracy > 90 ? "bg-[#00A859]" : "bg-[#006FCF]"}`}
                          />
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Resource Usage:</span>
                        <div className="mt-1">
                          <Badge
                            variant="outline"
                            className={`
                              ${model.resource === "Low" ? "bg-[#E6F9F1] text-[#00A859] border-[#00A859]" : ""}
                              ${model.resource === "Medium" ? "bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]" : ""}
                              ${model.resource === "High" ? "bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]" : ""}
                            `}
                          >
                            {model.resource}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1 text-[#006FCF]"
                      disabled={!selectedModels.includes(model.id)}
                    >
                      <Settings className="h-4 w-4" />
                      Configure Model
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Sensitivity Configuration</CardTitle>
                <CardDescription>Adjust how sensitive the AI models are to potential incidents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sensitivity">AI Sensitivity Level</Label>
                      <span className="text-sm font-medium">{sensitivityLevel}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="sensitivity"
                        min={0}
                        max={100}
                        step={1}
                        value={[sensitivityLevel]}
                        onValueChange={(value) => setSensitivityLevel(value[0])}
                        className="flex-1"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Fewer alerts, higher precision</span>
                      <span>More alerts, higher recall</span>
                    </div>
                  </div>

                  <Alert className="bg-[#E6F2FF] border-[#006FCF]">
                    <BrainCircuit className="h-4 w-4 text-[#006FCF]" />
                    <AlertTitle className="text-[#006FCF]">AI Recommendation</AlertTitle>
                    <AlertDescription>
                      Based on your historical incident data, we recommend a sensitivity level of 65-75% for optimal
                      balance between alert volume and incident prevention.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="learning-rate">Continuous Learning Rate</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="learning-rate" className="w-[180px]">
                          <SelectValue placeholder="Select rate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low (Weekly)</SelectItem>
                          <SelectItem value="medium">Medium (Daily)</SelectItem>
                          <SelectItem value="high">High (Hourly)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Controls how frequently the AI models update based on new incident data
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Advanced Settings</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="seasonal" defaultChecked />
                        <label
                          htmlFor="seasonal"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Enable seasonal pattern detection
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="correlation" defaultChecked />
                        <label
                          htmlFor="correlation"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Enable cross-service correlation
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="anomaly" defaultChecked />
                        <label
                          htmlFor="anomaly"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Enable anomaly explanation generation
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Configure how AI training data is managed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="data-retention">Historical Data Retention</Label>
                    <Select value={dataRetention} onValueChange={setDataRetention}>
                      <SelectTrigger id="data-retention">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                        <SelectItem value="365">365 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      How long to retain historical incident data for AI training
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data-sources">Data Sources</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="incidents" defaultChecked />
                        <label
                          htmlFor="incidents"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Incident history
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="alerts" defaultChecked />
                        <label
                          htmlFor="alerts"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Alert history
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="metrics" defaultChecked />
                        <label
                          htmlFor="metrics"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Performance metrics
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="logs" defaultChecked />
                        <label
                          htmlFor="logs"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          System logs
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Data Privacy</Label>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Data Privacy Notice</AlertTitle>
                    <AlertDescription>
                      All data used for AI training is processed within your secure environment. No sensitive data is
                      shared externally.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="retraining">Model Retraining Schedule</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="retraining" className="w-[180px]">
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">How frequently AI models are retrained with new data</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Predictive Alert Configuration</CardTitle>
                <CardDescription>Configure how AI-generated alerts are handled</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="alert-threshold">Alert Threshold</Label>
                    <Select value={alertThreshold} onValueChange={setAlertThreshold}>
                      <SelectTrigger id="alert-threshold">
                        <SelectValue placeholder="Select threshold" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (More Alerts)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced)</SelectItem>
                        <SelectItem value="high">High (Fewer Alerts)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Confidence threshold required before generating a predictive alert
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prediction-window">Prediction Window</Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="prediction-window">
                        <SelectValue placeholder="Select window" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="180">3 hours</SelectItem>
                        <SelectItem value="360">6 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">How far in advance to predict potential incidents</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Alert Routing</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="auto-create" defaultChecked />
                      <label
                        htmlFor="auto-create"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Automatically create incidents from high-confidence predictions
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notify-oncall" defaultChecked />
                      <label
                        htmlFor="notify-oncall"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Notify on-call personnel of predictive alerts
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="slack-notify" defaultChecked />
                      <label
                        htmlFor="slack-notify"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Send predictive alerts to Slack channels
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Alert Enrichment</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="root-cause" defaultChecked />
                      <label
                        htmlFor="root-cause"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include potential root causes
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remediation" defaultChecked />
                      <label
                        htmlFor="remediation"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Include suggested remediation steps
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="similar-incidents" defaultChecked />
                      <label
                        htmlFor="similar-incidents"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Link to similar historical incidents
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service-Specific Thresholds</CardTitle>
                <CardDescription>Configure AI sensitivity by service category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Payment Processing Services</Label>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Critical</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider defaultValue={[85]} max={100} step={1} className="flex-1" />
                      <span className="text-sm font-medium w-8">85%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Customer Portal Services</Label>
                      <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">High</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider defaultValue={[75]} max={100} step={1} className="flex-1" />
                      <span className="text-sm font-medium w-8">75%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Mobile Banking Services</Label>
                      <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">High</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider defaultValue={[75]} max={100} step={1} className="flex-1" />
                      <span className="text-sm font-medium w-8">75%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Internal Tools</Label>
                      <Badge variant="outline">Medium</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider defaultValue={[65]} max={100} step={1} className="flex-1" />
                      <span className="text-sm font-medium w-8">65%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {activated && (
        <Card>
          <CardHeader>
            <CardTitle>AI Monitoring Dashboard</CardTitle>
            <CardDescription>Overview of predictive analytics performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Incidents Prevented</h3>
                <div className="text-2xl font-bold text-[#006FCF]">24</div>
                <p className="text-xs text-[#00A859]">+8 from last month</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Prediction Accuracy</h3>
                <div className="text-2xl font-bold text-[#006FCF]">92%</div>
                <p className="text-xs text-[#00A859]">+3% from last month</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">False Positives</h3>
                <div className="text-2xl font-bold text-[#006FCF]">7%</div>
                <p className="text-xs text-[#00A859]">-2% from last month</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Average Warning Time</h3>
                <div className="text-2xl font-bold text-[#006FCF]">42m</div>
                <p className="text-xs text-[#00A859]">+5m from last month</p>
              </div>
            </div>

            <div className="mt-6 border rounded-md p-4">
              <h3 className="font-medium mb-2">Recent AI Insights</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <BrainCircuit className="h-5 w-5 text-[#006FCF] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Payment API latency pattern detected</p>
                    <p className="text-muted-foreground">
                      Recurring latency spikes detected every Monday at 9:00 AM, correlating with weekly batch
                      processing.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto shrink-0">
                    View Details
                  </Button>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <BrainCircuit className="h-5 w-5 text-[#006FCF] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Database connection pool optimization</p>
                    <p className="text-muted-foreground">
                      AI suggests increasing connection pool size by 20% to prevent recurring exhaustion incidents.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto shrink-0">
                    View Details
                  </Button>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <BrainCircuit className="h-5 w-5 text-[#006FCF] mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium">Seasonal traffic pattern identified</p>
                    <p className="text-muted-foreground">
                      End-of-month traffic increases of 35-40% detected across customer portal services.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto shrink-0">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
