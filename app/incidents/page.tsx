"use client"

import { Suspense, useState } from "react"
import { Plus, BarChart, Clock, ListFilter, Activity, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import IncidentTable from "@/components/incident-table"
import { Skeleton } from "@/components/ui/skeleton"
import CreateIncidentModal from "@/components/create-incident-modal"

export default function IncidentsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#00175A]">Incidents</h1>
        <p className="text-[#6B7280] mt-1">Manage and respond to active incidents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-[#E5E7EB] shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#6B7280]">Total Incidents</p>
                <h3 className="text-3xl font-bold mt-2 text-[#00175A]">124</h3>
                <p className="text-xs text-[#6B7280] mt-1">+8% from last month</p>
              </div>
              <div className="p-2 rounded-full bg-[#FFEEF0]">
                <AlertTriangle className="h-5 w-5 text-[#D5001F]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E5E7EB] shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#6B7280]">Active Incidents</p>
                <h3 className="text-3xl font-bold mt-2 text-[#00175A]">18</h3>
                <p className="text-xs text-[#6B7280] mt-1">5 critical, 13 high/medium</p>
              </div>
              <div className="p-2 rounded-full bg-[#FFF4EC]">
                <Activity className="h-5 w-5 text-[#FF6900]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E5E7EB] shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#6B7280]">MTTR</p>
                <h3 className="text-3xl font-bold mt-2 text-[#00175A]">2.5h</h3>
                <p className="text-xs text-[#6B7280] mt-1">-15% from last month</p>
              </div>
              <div className="p-2 rounded-full bg-[#E6F2FF]">
                <Clock className="h-5 w-5 text-[#006FCF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#E5E7EB] shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-[#6B7280]">Services Impacted</p>
                <h3 className="text-3xl font-bold mt-2 text-[#00175A]">8</h3>
                <p className="text-xs text-[#6B7280] mt-1">3 critical services</p>
              </div>
              <div className="p-2 rounded-full bg-[#E6F9F1]">
                <BarChart className="h-5 w-5 text-[#00A859]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-sm">
        <Tabs defaultValue="all" className="w-full">
          <div className="p-4 border-b border-[#E5E7EB]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <TabsList className="bg-[#F9FAFB] p-1 h-auto">
                <TabsTrigger
                  value="all"
                  className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00175A] data-[state=active]:font-medium"
                >
                  All Incidents
                </TabsTrigger>
                <TabsTrigger
                  value="triggered"
                  className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00175A] data-[state=active]:font-medium"
                >
                  Triggered
                </TabsTrigger>
                <TabsTrigger
                  value="acknowledged"
                  className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00175A] data-[state=active]:font-medium"
                >
                  Acknowledged
                </TabsTrigger>
                <TabsTrigger
                  value="resolved"
                  className="px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#00175A] data-[state=active]:font-medium"
                >
                  Resolved
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <Select defaultValue="severity">
                  <SelectTrigger className="w-[180px] bg-white border-[#E5E7EB]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="severity">Sort by Severity</SelectItem>
                    <SelectItem value="time">Sort by Time</SelectItem>
                    <SelectItem value="service">Sort by Service</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-1 border-[#E5E7EB]">
                  <ListFilter className="h-4 w-4" />
                  Group
                </Button>
                <Button
                  className="gap-1 bg-[#006FCF] hover:bg-[#00175A] text-white"
                  onClick={() => setCreateModalOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Create Incident
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <Suspense fallback={<IncidentTableSkeleton />}>
              <IncidentTable />
            </Suspense>
          </TabsContent>

          <TabsContent value="triggered" className="m-0">
            <Suspense fallback={<IncidentTableSkeleton />}>
              <IncidentTable />
            </Suspense>
          </TabsContent>

          <TabsContent value="acknowledged" className="m-0">
            <Suspense fallback={<IncidentTableSkeleton />}>
              <IncidentTable />
            </Suspense>
          </TabsContent>

          <TabsContent value="resolved" className="m-0">
            <Suspense fallback={<IncidentTableSkeleton />}>
              <IncidentTable />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>

      <CreateIncidentModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  )
}

function IncidentTableSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}
