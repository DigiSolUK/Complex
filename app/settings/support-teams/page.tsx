"use client"

import { useState } from "react"
import { Edit, Globe, MapPin, Plus, Trash, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

export default function SupportTeamsPage() {
  const [addTeamOpen, setAddTeamOpen] = useState(false)
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)

  // Sample data for support teams based on American Express global locations
  const supportTeams = [
    {
      id: "team-1",
      name: "Global Payment Services",
      location: "New York, USA",
      timezone: "America/New_York",
      members: 12,
      active: true,
      description: "Handles payment processing incidents and service disruptions",
      expertise: ["Payments", "Transactions", "Fraud Detection"],
      leadName: "Sarah Johnson",
      leadEmail: "sarah.johnson@amex.com",
    },
    {
      id: "team-2",
      name: "EMEA Customer Support",
      location: "London, UK",
      timezone: "Europe/London",
      members: 8,
      active: true,
      description: "European customer-facing services and applications",
      expertise: ["Customer Portal", "Mobile Apps", "Authentication"],
      leadName: "James Wilson",
      leadEmail: "james.wilson@amex.com",
    },
    {
      id: "team-3",
      name: "APAC Infrastructure",
      location: "Singapore",
      timezone: "Asia/Singapore",
      members: 10,
      active: true,
      description: "Asia-Pacific infrastructure and networking services",
      expertise: ["Infrastructure", "Cloud Services", "Networking"],
      leadName: "Mei Lin",
      leadEmail: "mei.lin@amex.com",
    },
    {
      id: "team-4",
      name: "Latin America Support",
      location: "Mexico City, Mexico",
      timezone: "America/Mexico_City",
      members: 6,
      active: true,
      description: "Latin American customer services and regional applications",
      expertise: ["Regional Services", "Localization", "Payment Processing"],
      leadName: "Carlos Rodriguez",
      leadEmail: "carlos.rodriguez@amex.com",
    },
    {
      id: "team-5",
      name: "Global Security Operations",
      location: "Phoenix, USA",
      timezone: "America/Phoenix",
      members: 15,
      active: true,
      description: "Security monitoring and incident response across all services",
      expertise: ["Security", "Threat Detection", "Compliance"],
      leadName: "David Kim",
      leadEmail: "david.kim@amex.com",
    },
    {
      id: "team-6",
      name: "India Development Center",
      location: "Bangalore, India",
      timezone: "Asia/Kolkata",
      members: 18,
      active: true,
      description: "Application development and technical support",
      expertise: ["Development", "QA", "Technical Support"],
      leadName: "Priya Sharma",
      leadEmail: "priya.sharma@amex.com",
    },
    {
      id: "team-7",
      name: "Australia Customer Operations",
      location: "Sydney, Australia",
      timezone: "Australia/Sydney",
      members: 7,
      active: true,
      description: "Australian customer services and operations",
      expertise: ["Customer Service", "Operations", "Regional Support"],
      leadName: "Michael Thompson",
      leadEmail: "michael.thompson@amex.com",
    },
  ]

  // Sample team members data
  const teamMembers = [
    {
      id: "member-1",
      name: "Sarah Johnson",
      email: "sarah.johnson@amex.com",
      role: "Team Lead",
      team: "team-1",
      expertise: ["Payments", "Incident Management", "Leadership"],
      availability: "available",
      avatar: "/diverse-woman-portrait.png",
    },
    {
      id: "member-2",
      name: "Michael Chen",
      email: "michael.chen@amex.com",
      role: "Senior Engineer",
      team: "team-1",
      expertise: ["Payment Processing", "Database", "API Services"],
      availability: "available",
      avatar: "/thoughtful-man.png",
    },
    {
      id: "member-3",
      name: "Emma Wilson",
      email: "emma.wilson@amex.com",
      role: "Support Specialist",
      team: "team-1",
      expertise: ["Customer Support", "Troubleshooting", "Documentation"],
      availability: "busy",
      avatar: "/diverse-woman-portrait.png",
    },
    {
      id: "member-4",
      name: "James Wilson",
      email: "james.wilson@amex.com",
      role: "Team Lead",
      team: "team-2",
      expertise: ["Customer Portal", "Authentication", "Leadership"],
      availability: "available",
      avatar: "/thoughtful-man.png",
    },
    {
      id: "member-5",
      name: "Mei Lin",
      email: "mei.lin@amex.com",
      role: "Team Lead",
      team: "team-3",
      expertise: ["Infrastructure", "Cloud Services", "Leadership"],
      availability: "available",
      avatar: "/diverse-woman-portrait.png",
    },
  ]

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "available":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Available</Badge>
      case "busy":
        return <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">Busy</Badge>
      case "offline":
        return <Badge variant="outline">Offline</Badge>
      default:
        return <Badge variant="outline">{availability}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Support Teams</h1>
        <p className="text-muted-foreground">Manage global support teams for incident routing</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 px-3 py-1">
            <Globe className="h-3.5 w-3.5 text-[#006FCF]" />
            <span>Global Teams</span>
          </Badge>
          <Badge variant="outline" className="gap-1 px-3 py-1">
            <Users className="h-3.5 w-3.5 text-[#006FCF]" />
            <span>76 Team Members</span>
          </Badge>
        </div>
        <div className="flex gap-2">
          <Dialog open={addTeamOpen} onOpenChange={setAddTeamOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1 bg-[#006FCF] hover:bg-[#0055A6] text-white">
                <Plus className="h-4 w-4" />
                Add Team
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Support Team</DialogTitle>
                <DialogDescription>Create a new support team for incident routing</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input id="team-name" placeholder="Enter team name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-location">Location</Label>
                  <Input id="team-location" placeholder="City, Country" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-timezone">Timezone</Label>
                  <Select defaultValue="America/New_York">
                    <SelectTrigger id="team-timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Asia/Singapore">Singapore (SGT)</SelectItem>
                      <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                      <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-description">Description</Label>
                  <Input id="team-description" placeholder="Team description" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-lead">Team Lead</Label>
                  <Input id="team-lead" placeholder="Team lead name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-lead-email">Team Lead Email</Label>
                  <Input id="team-lead-email" placeholder="team.lead@amex.com" type="email" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="team-active" defaultChecked />
                  <Label htmlFor="team-active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddTeamOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#006FCF] hover:bg-[#0055A6] text-white" onClick={() => setAddTeamOpen(false)}>
                  Add Team
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Plus className="h-4 w-4" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>Add a new member to a support team</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="member-name">Name</Label>
                  <Input id="member-name" placeholder="Enter name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-email">Email</Label>
                  <Input id="member-email" placeholder="email@amex.com" type="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-role">Role</Label>
                  <Input id="member-role" placeholder="Role or position" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-team">Team</Label>
                  <Select>
                    <SelectTrigger id="member-team">
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {supportTeams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="member-expertise">Expertise (comma separated)</Label>
                  <Input id="member-expertise" placeholder="e.g. Payments, API, Security" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddMemberOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#006FCF] hover:bg-[#0055A6] text-white" onClick={() => setAddMemberOpen(false)}>
                  Add Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="teams" className="space-y-6">
        <TabsList>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="schedules">On-Call Schedules</TabsTrigger>
          <TabsTrigger value="routing">Routing Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Teams</CardTitle>
              <CardDescription>Global support teams for incident routing</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Timezone</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {supportTeams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          {team.location}
                        </div>
                      </TableCell>
                      <TableCell>{team.timezone.split("/")[1].replace("_", " ")}</TableCell>
                      <TableCell>{team.members}</TableCell>
                      <TableCell>{team.leadName}</TableCell>
                      <TableCell>
                        {team.active ? (
                          <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Team Coverage</CardTitle>
                <CardDescription>24/7 global support coverage</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>Team coverage map would be displayed here</p>
                  <p className="text-sm mt-2">Showing global distribution of support teams</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Expertise</CardTitle>
                <CardDescription>Specialized knowledge areas by team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportTeams.slice(0, 4).map((team) => (
                    <div key={team.id} className="space-y-2">
                      <h3 className="font-medium">{team.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        {team.expertise.map((skill, index) => (
                          <Badge key={index} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  View All Teams
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Support personnel across all teams</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Expertise</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {supportTeams.find((team) => team.id === member.team)?.name || "Unassigned"}
                      </TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {member.expertise.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {member.expertise.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.expertise.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getAvailabilityBadge(member.availability)}</TableCell>
                      <TableCell>
                        <a href={`mailto:${member.email}`} className="text-[#006FCF] hover:underline">
                          {member.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>On-Call Schedules</CardTitle>
              <CardDescription>Team rotation schedules for incident response</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>On-call schedule calendar would be displayed here</p>
                <p className="text-sm mt-2">Showing team rotations across time zones</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Incident Routing Rules</CardTitle>
              <CardDescription>Configure automatic incident assignment to teams</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Assigned Team</TableHead>
                    <TableHead>Fallback Team</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Payment Processing Incidents</TableCell>
                    <TableCell>Payment Services</TableCell>
                    <TableCell>P1, P2</TableCell>
                    <TableCell>Global Payment Services</TableCell>
                    <TableCell>Global Security Operations</TableCell>
                    <TableCell>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">European Customer Portal</TableCell>
                    <TableCell>Customer Portal</TableCell>
                    <TableCell>All</TableCell>
                    <TableCell>EMEA Customer Support</TableCell>
                    <TableCell>Global Payment Services</TableCell>
                    <TableCell>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">APAC Infrastructure</TableCell>
                    <TableCell>Infrastructure</TableCell>
                    <TableCell>All</TableCell>
                    <TableCell>APAC Infrastructure</TableCell>
                    <TableCell>India Development Center</TableCell>
                    <TableCell>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Security Incidents</TableCell>
                    <TableCell>All</TableCell>
                    <TableCell>P1</TableCell>
                    <TableCell>Global Security Operations</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Australian Services</TableCell>
                    <TableCell>Regional Services</TableCell>
                    <TableCell>All</TableCell>
                    <TableCell>Australia Customer Operations</TableCell>
                    <TableCell>APAC Infrastructure</TableCell>
                    <TableCell>
                      <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button className="gap-1 bg-[#006FCF] hover:bg-[#0055A6] text-white">
                <Plus className="h-4 w-4" />
                Add Routing Rule
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
