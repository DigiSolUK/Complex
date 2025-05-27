"use client"

import { useState } from "react"
import { BrainCircuit, ChevronRight, Clock, LineChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AIMonitoringInsights() {
  const [expanded, setExpanded] = useState(false)

  const insights = [
    {
      id: 1,
      title: "Payment Gateway CPU Spike Predicted",
      description: "AI has detected a pattern that may lead to CPU spikes in the next 45 minutes",
      confidence: 87,
      timeWindow: "45 minutes",
      service: "Payment Gateway",
      suggestedAction: "Consider scaling up resources preemptively",
      severity: "high",
    },
    {
      id: 2,
      title: "Database Connection Pool Exhaustion Risk",
      description: "Current growth rate of connections may lead to pool exhaustion",
      confidence: 92,
      timeWindow: "30 minutes",
      service: "Database Cluster",
      suggestedAction: "Increase connection pool size or implement connection recycling",
      severity: "critical",
    },
    {
      id: 3,
      title: "API Rate Limiting Threshold Approaching",
      description: "Current API usage trending toward rate limit threshold",
      confidence: 78,
      timeWindow: "60 minutes",
      service: "API Services",
      suggestedAction: "Implement request batching or increase rate limits temporarily",
      severity: "medium",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]"
      case "high":
        return "bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]"
      case "medium":
        return "bg-[#E6F2FF] text-[#006FCF] border-[#006FCF]"
      case "low":
        return "bg-[#E6F9F1] text-[#00A859] border-[#00A859]"
      default:
        return "bg-[#E6F2FF] text-[#006FCF] border-[#006FCF]"
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-[#00A859]"
    if (confidence >= 75) return "bg-[#006FCF]"
    if (confidence >= 60) return "bg-[#FF6900]"
    return "bg-[#D5001F]"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-[#006FCF]" />
            AI Monitoring Insights
          </CardTitle>
          <Badge variant="outline" className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">
            Active
          </Badge>
        </div>
        <CardDescription>Predictive analytics and incident prevention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Incidents Prevented</div>
            <div className="text-2xl font-bold text-[#006FCF]">24</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Current Predictions</div>
            <div className="text-2xl font-bold text-[#006FCF]">{insights.length}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Accuracy</div>
            <div className="text-2xl font-bold text-[#006FCF]">92%</div>
          </div>
        </div>

        <div className="space-y-3">
          {insights.slice(0, expanded ? insights.length : 2).map((insight) => (
            <div key={insight.id} className="border rounded-md p-3">
              <div className="flex items-start gap-2">
                <BrainCircuit className="h-5 w-5 text-[#006FCF] mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <Badge variant="outline" className={getSeverityColor(insight.severity)}>
                      {insight.severity.charAt(0).toUpperCase() + insight.severity.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{insight.description}</p>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 text-xs">
                    <div className="flex items-center gap-1">
                      <LineChart className="h-3.5 w-3.5 text-[#006FCF]" />
                      <span className="text-muted-foreground">Confidence:</span>
                      <div className="flex items-center gap-1 ml-1">
                        <span className="font-medium">{insight.confidence}%</span>
                        <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getConfidenceColor(insight.confidence)}`}
                            style={{ width: `${insight.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-[#006FCF]" />
                      <span className="text-muted-foreground">Time Window:</span>
                      <span className="font-medium ml-1">{insight.timeWindow}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1">
                      <ChevronRight className="h-3.5 w-3.5 text-[#006FCF]" />
                      <span className="text-muted-foreground">Suggested Action:</span>
                      <span className="font-medium ml-1">{insight.suggestedAction}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="ghost" size="sm" className="text-[#006FCF]" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Show Less" : "Show More"}
        </Button>
        <Button size="sm" className="bg-[#006FCF] hover:bg-[#0055A6] text-white">
          View All Insights
        </Button>
      </CardFooter>
    </Card>
  )
}
