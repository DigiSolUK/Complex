"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function IntegrationsPage() {
  const [monitoringIntegrations, setMonitoringIntegrations] = useState([
    {
      id: 1,
      name: "Datadog",
      description: "Ingest alerts from Datadog monitoring",
      status: "connected",
      logo: "/datadog-logo.png",
    },
    {
      id: 2,
      name: "AWS CloudWatch",
      description: "Connect to AWS CloudWatch alerts",
      status: "connected",
      logo: "/placeholder-jv1s9.png",
    },
    {
      id: 3,
      name: "Prometheus",
      description: "Receive alerts from Prometheus",
      status: "not_connected",
      logo: "/prometheus-logo.png",
    },
    {
      id: 4,
      name: "New Relic",
      description: "Connect to New Relic alerts",
      status: "connected",
      logo: "/new-relic-logo.png",
    },
    {
      id: 5,
      name: "Grafana",
      description: "Receive alerts from Grafana",
      status: "not_connected",
      logo: "/grafana-logo.png",
    },
    {
      id: 6,
      name: "Dynatrace",
      description: "Connect to Dynatrace alerts",
      status: "not_connected",
      logo: "/dynatrace-logo.png",
    },
  ])

  const [notificationIntegrations, setNotificationIntegrations] = useState([
    {
      id: 1,
      name: "Slack",
      description: "Send notifications to Slack channels",
      status: "connected",
      logo: "/slack-logo.png",
    },
    {
      id: 2,
      name: "Microsoft Teams",
      description: "Send notifications to Teams channels",
      status: "not_connected",
      logo: "/microsoft-teams-logo.png",
    },
    {
      id: 3,
      name: "Email",
      description: "Send email notifications",
      status: "connected",
      logo: "/email-icon.png",
    },
    {
      id: 4,
      name: "SMS",
      description: "Send SMS notifications via Twilio",
      status: "connected",
      logo: "/sms-icon.png",
    },
    {
      id: 5,
      name: "Webhook",
      description: "Send notifications to custom webhooks",
      status: "not_connected",
      logo: "/webhook-icon.png",
    },
  ])

  const toggleIntegrationStatus = (type: "monitoring" | "notification", id: number) => {
    if (type === "monitoring") {
      setMonitoringIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === id
            ? { ...integration, status: integration.status === "connected" ? "not_connected" : "connected" }
            : integration,
        ),
      )
    } else {
      setNotificationIntegrations((prev) =>
        prev.map((integration) =>
          integration.id === id
            ? { ...integration, status: integration.status === "connected" ? "not_connected" : "connected" }
            : integration,
        ),
      )
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">Connect monitoring tools and notification channels</p>
      </div>

      <Tabs defaultValue="monitoring" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="monitoring">Monitoring Tools</TabsTrigger>
            <TabsTrigger value="notifications">Notification Channels</TabsTrigger>
          </TabsList>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Add Integration
          </Button>
        </div>

        <TabsContent value="monitoring">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {monitoringIntegrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <img
                    src={integration.logo || "/placeholder.svg"}
                    alt={`${integration.name} logo`}
                    className="h-10 w-10 rounded"
                  />
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  {integration.status === "connected" ? (
                    <>
                      <Badge variant="outline" className="bg-[#e6ffee] text-[#55aa99] border-[#99ddcc]">
                        Connected
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#99ddcc] text-[#55aa99] hover:bg-[#e6ffee]"
                      >
                        Configure
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge variant="outline">Not Connected</Badge>
                      <Button
                        size="sm"
                        className="bg-[#99ccff] text-[#5588cc] hover:bg-[#b3daff]"
                        onClick={() => toggleIntegrationStatus("monitoring", integration.id)}
                      >
                        Connect
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notificationIntegrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <img
                    src={integration.logo || "/placeholder.svg"}
                    alt={`${integration.name} logo`}
                    className="h-10 w-10 rounded"
                  />
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  {integration.status === "connected" ? (
                    <>
                      <Badge variant="outline" className="bg-[#e6ffee] text-[#55aa99] border-[#99ddcc]">
                        Connected
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#99ddcc] text-[#55aa99] hover:bg-[#e6ffee]"
                      >
                        Configure
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge variant="outline">Not Connected</Badge>
                      <Button
                        size="sm"
                        className="bg-[#99ccff] text-[#5588cc] hover:bg-[#b3daff]"
                        onClick={() => toggleIntegrationStatus("notification", integration.id)}
                      >
                        Connect
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
