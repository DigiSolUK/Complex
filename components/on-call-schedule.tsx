"use client"

import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Clock, Plus, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function OnCallSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const navigatePrevious = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const teams = [
    {
      id: 1,
      name: "Infrastructure Team",
      currentOnCall: {
        name: "Michael Chen",
        avatar: "/thoughtful-man.png",
        initials: "MC",
        until: "2025-05-28T08:00:00Z",
      },
      nextOnCall: {
        name: "Emma Wilson",
        avatar: "/diverse-woman-portrait.png",
        initials: "EW",
        from: "2025-05-28T08:00:00Z",
      },
    },
    {
      id: 2,
      name: "Application Team",
      currentOnCall: {
        name: "Sarah Johnson",
        avatar: "/diverse-woman-portrait.png",
        initials: "SJ",
        until: "2025-05-28T08:00:00Z",
      },
      nextOnCall: {
        name: "Alex Rodriguez",
        avatar: "/diverse-group.png",
        initials: "AR",
        from: "2025-05-28T08:00:00Z",
      },
    },
    {
      id: 3,
      name: "Database Team",
      currentOnCall: {
        name: "David Kim",
        avatar: "/thoughtful-man.png",
        initials: "DK",
        until: "2025-05-28T08:00:00Z",
      },
      nextOnCall: {
        name: "Lisa Patel",
        avatar: "/diverse-woman-portrait.png",
        initials: "LP",
        from: "2025-05-28T08:00:00Z",
      },
    },
  ]

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  const scheduleData = [
    {
      team: "Infrastructure Team",
      shifts: [
        { day: "Mon", person: "Michael Chen", time: "8:00 - 20:00" },
        { day: "Mon", person: "Emma Wilson", time: "20:00 - 8:00" },
        { day: "Tue", person: "Michael Chen", time: "8:00 - 20:00" },
        { day: "Tue", person: "Emma Wilson", time: "20:00 - 8:00" },
        { day: "Wed", person: "Michael Chen", time: "8:00 - 20:00" },
        { day: "Wed", person: "Emma Wilson", time: "20:00 - 8:00" },
        { day: "Thu", person: "Michael Chen", time: "8:00 - 20:00" },
        { day: "Thu", person: "Emma Wilson", time: "20:00 - 8:00" },
        { day: "Fri", person: "Michael Chen", time: "8:00 - 20:00" },
        { day: "Fri", person: "Emma Wilson", time: "20:00 - 8:00" },
        { day: "Sat", person: "James Taylor", time: "8:00 - 20:00" },
        { day: "Sat", person: "James Taylor", time: "20:00 - 8:00" },
        { day: "Sun", person: "James Taylor", time: "8:00 - 20:00" },
        { day: "Sun", person: "James Taylor", time: "20:00 - 8:00" },
      ],
    },
    {
      team: "Application Team",
      shifts: [
        { day: "Mon", person: "Sarah Johnson", time: "8:00 - 20:00" },
        { day: "Mon", person: "Alex Rodriguez", time: "20:00 - 8:00" },
        { day: "Tue", person: "Sarah Johnson", time: "8:00 - 20:00" },
        { day: "Tue", person: "Alex Rodriguez", time: "20:00 - 8:00" },
        { day: "Wed", person: "Sarah Johnson", time: "8:00 - 20:00" },
        { day: "Wed", person: "Alex Rodriguez", time: "20:00 - 8:00" },
        { day: "Thu", person: "Sarah Johnson", time: "8:00 - 20:00" },
        { day: "Thu", person: "Alex Rodriguez", time: "20:00 - 8:00" },
        { day: "Fri", person: "Sarah Johnson", time: "8:00 - 20:00" },
        { day: "Fri", person: "Alex Rodriguez", time: "20:00 - 8:00" },
        { day: "Sat", person: "Maria Lopez", time: "8:00 - 20:00" },
        { day: "Sat", person: "Maria Lopez", time: "20:00 - 8:00" },
        { day: "Sun", person: "Maria Lopez", time: "8:00 - 20:00" },
        { day: "Sun", person: "Maria Lopez", time: "20:00 - 8:00" },
      ],
    },
    {
      team: "Database Team",
      shifts: [
        { day: "Mon", person: "David Kim", time: "8:00 - 20:00" },
        { day: "Mon", person: "Lisa Patel", time: "20:00 - 8:00" },
        { day: "Tue", person: "David Kim", time: "8:00 - 20:00" },
        { day: "Tue", person: "Lisa Patel", time: "20:00 - 8:00" },
        { day: "Wed", person: "David Kim", time: "8:00 - 20:00" },
        { day: "Wed", person: "Lisa Patel", time: "20:00 - 8:00" },
        { day: "Thu", person: "David Kim", time: "8:00 - 20:00" },
        { day: "Thu", person: "Lisa Patel", time: "20:00 - 8:00" },
        { day: "Fri", person: "David Kim", time: "8:00 - 20:00" },
        { day: "Fri", person: "Lisa Patel", time: "20:00 - 8:00" },
        { day: "Sat", person: "Robert Chen", time: "8:00 - 20:00" },
        { day: "Sat", person: "Robert Chen", time: "20:00 - 8:00" },
        { day: "Sun", person: "Robert Chen", time: "8:00 - 20:00" },
        { day: "Sun", person: "Robert Chen", time: "20:00 - 8:00" },
      ],
    },
  ]

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(date)
  }

  const formatUntilTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">On-Call Schedule</h2>
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Current Week</span>
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(currentDate)}
          </Button>
          <Button variant="outline" size="icon" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id} className="border border-[#e6ecff] bg-white hover:bg-[#f8f9ff] transition-colors">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{team.name}</CardTitle>
              <CardDescription>Current on-call rotation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={team.currentOnCall.avatar || "/placeholder.svg"} alt={team.currentOnCall.name} />
                  <AvatarFallback>{team.currentOnCall.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{team.currentOnCall.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#8855cc]" />
                    <span>Until {formatUntilTime(team.currentOnCall.until)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={team.nextOnCall.avatar || "/placeholder.svg"} alt={team.nextOnCall.name} />
                  <AvatarFallback>{team.nextOnCall.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{team.nextOnCall.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#8855cc]" />
                    <span>Next on-call</span>
                  </div>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    <Users className="h-4 w-4 text-[#8855cc]" />
                    View Full Schedule
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>{team.name} On-Call Schedule</DialogTitle>
                    <DialogDescription>Weekly on-call rotation schedule</DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="calendar" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                      <TabsTrigger value="list">List View</TabsTrigger>
                    </TabsList>
                    <TabsContent value="calendar" className="p-4">
                      <div className="border rounded-md overflow-hidden">
                        <div className="grid grid-cols-7 border-b">
                          {weekDays.map((day) => (
                            <div key={day} className="p-2 text-center font-medium border-r last:border-r-0">
                              {day}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 h-[400px]">
                          {weekDays.map((day) => (
                            <div key={day} className="border-r last:border-r-0 p-2 overflow-y-auto">
                              {scheduleData
                                .find((data) => data.team === team.name)
                                ?.shifts.filter((shift) => shift.day === day)
                                .map((shift, index) => (
                                  <div key={index} className="mb-2 p-2 text-xs rounded bg-[#e6ecff] text-[#5588cc]">
                                    <div className="font-medium">{shift.person}</div>
                                    <div className="text-muted-foreground">{shift.time}</div>
                                  </div>
                                ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="list" className="p-4">
                      <div className="space-y-4">
                        {weekDays.map((day) => (
                          <Card key={day}>
                            <CardHeader className="py-2">
                              <CardTitle className="text-sm">{day}</CardTitle>
                            </CardHeader>
                            <CardContent className="py-2">
                              {scheduleData
                                .find((data) => data.team === team.name)
                                ?.shifts.filter((shift) => shift.day === day)
                                .map((shift, index) => (
                                  <div key={index} className="flex justify-between items-center py-1">
                                    <div className="font-medium">{shift.person}</div>
                                    <div className="text-sm text-muted-foreground">{shift.time}</div>
                                  </div>
                                ))}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Escalation Policies</CardTitle>
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              New Policy
            </Button>
          </div>
          <CardDescription>Configure how incidents are escalated if not acknowledged</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-md border">
              <div className="p-4 border-b bg-[#f0f4ff]">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Infrastructure Team - Default Policy</div>
                  <Badge>Active</Badge>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#e6ecff] flex items-center justify-center text-xs font-medium text-[#8855cc]">
                    1
                  </div>
                  <div className="flex-1">Notify primary on-call via Slack and SMS</div>
                  <div className="text-sm text-muted-foreground">Immediate</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#e6ecff] flex items-center justify-center text-xs font-medium text-[#8855cc]">
                    2
                  </div>
                  <div className="flex-1">Notify primary on-call via phone call</div>
                  <div className="text-sm text-muted-foreground">After 5 min</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#e6ecff] flex items-center justify-center text-xs font-medium text-[#8855cc]">
                    3
                  </div>
                  <div className="flex-1">Notify secondary on-call via all channels</div>
                  <div className="text-sm text-muted-foreground">After 15 min</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#e6ecff] flex items-center justify-center text-xs font-medium text-[#8855cc]">
                    4
                  </div>
                  <div className="flex-1">Notify team manager</div>
                  <div className="text-sm text-muted-foreground">After 30 min</div>
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <div className="p-4 border-b bg-[#f0f4ff]">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Application Team - Default Policy</div>
                  <Badge>Active</Badge>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#e6ecff] flex items-center justify-center text-xs font-medium text-[#8855cc]">
                    1
                  </div>
                  <div className="flex-1">Notify primary on-call via Slack and SMS</div>
                  <div className="text-sm text-muted-foreground">Immediate</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#e6ecff] flex items-center justify-center text-xs font-medium text-[#8855cc]">
                    2
                  </div>
                  <div className="flex-1">Notify primary on-call via phone call</div>
                  <div className="text-sm text-muted-foreground">After 5 min</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#e6ecff] flex items-center justify-center text-xs font-medium text-[#8855cc]">
                    3
                  </div>
                  <div className="flex-1">Notify secondary on-call via all channels</div>
                  <div className="text-sm text-muted-foreground">After 10 min</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
