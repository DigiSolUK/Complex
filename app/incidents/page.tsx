import { Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import IncidentTable from "@/components/incident-table"

export default function IncidentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Incidents</h1>
        <p className="text-muted-foreground">Manage and respond to active incidents</p>
      </div>

      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Incidents</TabsTrigger>
              <TabsTrigger value="triggered">Triggered</TabsTrigger>
              <TabsTrigger value="acknowledged">Acknowledged</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                Create Incident
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-6">
            <IncidentTable />
          </TabsContent>

          <TabsContent value="triggered" className="mt-6">
            <IncidentTable />
          </TabsContent>

          <TabsContent value="acknowledged" className="mt-6">
            <IncidentTable />
          </TabsContent>

          <TabsContent value="resolved" className="mt-6">
            <IncidentTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
