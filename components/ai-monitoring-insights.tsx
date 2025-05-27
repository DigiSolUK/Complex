"use client"

import { useState } from "react"
import {
  BrainCircuit,
  ChevronRight,
  LineChart,
  Sparkles,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function AIMonitoringInsights() {
  const [aiEnabled, setAiEnabled] = useState(true)

  // Sample AI predictions
  const predictions = [
    {
      id: "pred-001",
      title: "Database connection pool exhaustion risk",
      service: "Payment Processing API",
      confidence: 92,
      timeframe: "Next 30 minutes",
      impact: "high",
      trend: "increasing",
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    {
      id: "pred-002",
      title: "Memory utilization anomaly detected",
      service: "Customer Portal",
      confidence: 87,
      timeframe: "Next 2 hours",
      impact: "medium",
      trend: "stable",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      id: "pred-003",
      title: "API latency increasing",
      service: "Mobile Banking Services",
      confidence: 78,
      timeframe: "Next 1 hour",
      impact: "medium",
      trend: "increasing",
      icon: <Clock className="h-5 w-5" />,
    },
  ]

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-0 font-medium">High Impact</Badge>
      case "medium":
        return <Badge className="bg-[#FFF4EC] text-[#FF6900] border-0 font-medium">Medium Impact</Badge>
      case "low":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-0 font-medium">Low Impact</Badge>
      default:
        return <Badge variant="outline">{impact}</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-[#D5001F]" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-[#00A859]" />
      case "stable":
        return <LineChart className="h-4 w-4 text-[#006FCF]" />
      default:
        return null
    }
  }

  if (!aiEnabled) {
    return (
      <Card className="card-enhanced border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-[#006FCF]" />
            AI Monitoring
          </CardTitle>
          <CardDescription>Predictive analytics for incident prevention</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="p-4 bg-[#E6F2FF] rounded-full mb-4">
            <BrainCircuit className="h-12 w-12 text-[#006FCF]" />
          </div>
          <h3 className="text-lg font-semibold text-[#00175A] mb-2">AI Monitoring Not Enabled</h3>
          <p className="text-sm text-[#53565A] text-center mb-6 max-w-sm">
            Enable AI monitoring to get predictive insights and prevent incidents before they occur.
          </p>
          <Button className="gap-2 bg-gradient-to-r from-[#006FCF] to-[#00175A] hover:from-[#00175A] hover:to-[#006FCF] text-white shadow-md">
            <BrainCircuit className="h-4 w-4" />
            Enable AI Monitoring
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-enhanced border-0 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-[#006FCF] via-[#FF6900] to-[#00A859]"></div>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-[#E6F2FF] to-[#F7F8F9] rounded-lg">
              <BrainCircuit className="h-5 w-5 text-[#006FCF]" />
            </div>
            AI Monitoring Insights
          </CardTitle>
          <Badge className="bg-gradient-to-r from-[#00A859] to-[#008547] text-white border-0 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Active
          </Badge>
        </div>
        <CardDescription>Predictive analytics and incident prevention</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-[#E6F9F1] to-[#F7F8F9] rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-[#53565A]">Incidents Prevented</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="bg-white/80 text-[#00A859] border-0 text-xs">+8</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">8 more incidents prevented compared to last month</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-3xl font-bold text-[#00A859] mb-2">24</div>
            <Progress
              value={80}
              max={100}
              className="h-2 bg-white/50"
              indicatorClassName="bg-gradient-to-r from-[#00A859] to-[#008547]"
            />
          </div>

          <div className="bg-gradient-to-br from-[#E6F2FF] to-[#F7F8F9] rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-[#53565A]">Prediction Accuracy</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="bg-white/80 text-[#006FCF] border-0 text-xs">+3%</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">3% improvement in accuracy compared to last month</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-3xl font-bold text-[#006FCF] mb-2">92%</div>
            <Progress
              value={92}
              max={100}
              className="h-2 bg-white/50"
              indicatorClassName="bg-gradient-to-r from-[#006FCF] to-[#00175A]"
            />
          </div>

          <div className="bg-gradient-to-br from-[#FFF4EC] to-[#F7F8F9] rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-[#53565A]">Avg Warning Time</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge className="bg-white/80 text-[#FF6900] border-0 text-xs">+5m</Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">5 minutes more warning time compared to last month</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="text-3xl font-bold text-[#FF6900] mb-2">42m</div>
            <Progress
              value={70}
              max={100}
              className="h-2 bg-white/50"
              indicatorClassName="bg-gradient-to-r from-[#FF6900] to-[#E55A00]"
            />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#00175A] uppercase tracking-wider">Current Predictions</h3>
          {predictions.map((prediction) => (
            <div
              key={prediction.id}
              className="group flex items-center justify-between p-4 rounded-lg border border-[#ECEDEE] bg-white hover:bg-[#F7F8F9] hover:border-[#006FCF] transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    prediction.impact === "high"
                      ? "bg-[#FFEEF0]"
                      : prediction.impact === "medium"
                        ? "bg-[#FFF4EC]"
                        : "bg-[#E6F9F1]"
                  }`}
                >
                  <div
                    className={`${
                      prediction.impact === "high"
                        ? "text-[#D5001F]"
                        : prediction.impact === "medium"
                          ? "text-[#FF6900]"
                          : "text-[#00A859]"
                    }`}
                  >
                    {prediction.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-[#00175A]">{prediction.title}</p>
                    {getTrendIcon(prediction.trend)}
                  </div>
                  <p className="text-sm text-[#53565A] mb-2">{prediction.service}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className="text-xs border-[#ECEDEE]">
                      <Clock className="h-3 w-3 mr-1" />
                      {prediction.timeframe}
                    </Badge>
                    {getImpactBadge(prediction.impact)}
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-[#53565A]">Confidence:</span>
                      <span className="text-xs font-semibold text-[#006FCF]">{prediction.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t bg-[#F7F8F9] pt-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 border-[#006FCF] text-[#006FCF] hover:bg-[#006FCF] hover:text-white transition-colors"
        >
          <BrainCircuit className="h-4 w-4" />
          View All AI Insights
        </Button>
      </CardFooter>
    </Card>
  )
}
