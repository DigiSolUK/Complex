"use client"

import { useState } from "react"
import { Download, FileText, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function CompliancePoliciesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const policies = [
    {
      id: "POL-001",
      name: "Incident Response Policy",
      category: "Operational",
      lastUpdated: "2025-04-15",
      status: "active",
      owner: "Operations Team",
      reviewCycle: "Annual",
      nextReview: "2026-04-15",
    },
    {
      id: "POL-002",
      name: "FCA Incident Reporting Procedure",
      category: "Regulatory",
      lastUpdated: "2025-03-22",
      status: "active",
      owner: "Compliance Team",
      reviewCycle: "Bi-annual",
      nextReview: "2025-09-22",
    },
    {
      id: "POL-003",
      name: "Service Availability Standards",
      category: "Regulatory",
      lastUpdated: "2025-02-10",
      status: "active",
      owner: "Infrastructure Team",
      reviewCycle: "Annual",
      nextReview: "2026-02-10",
    },
    {
      id: "POL-004",
      name: "Business Continuity Plan",
      category: "Operational",
      lastUpdated: "2025-01-18",
      status: "active",
      owner: "Business Continuity Team",
      reviewCycle: "Annual",
      nextReview: "2026-01-18",
    },
    {
      id: "POL-005",
      name: "Operational Resilience Testing",
      category: "Regulatory",
      lastUpdated: "2025-05-05",
      status: "active",
      owner: "Risk Management",
      reviewCycle: "Quarterly",
      nextReview: "2025-08-05",
    },
    {
      id: "POL-006",
      name: "Critical Third-Party Monitoring",
      category: "Regulatory",
      lastUpdated: "2025-04-30",
      status: "active",
      owner: "Vendor Management",
      reviewCycle: "Annual",
      nextReview: "2026-04-30",
    },
    {
      id: "POL-007",
      name: "Incident Severity Classification",
      category: "Operational",
      lastUpdated: "2025-03-15",
      status: "active",
      owner: "Operations Team",
      reviewCycle: "Annual",
      nextReview: "2026-03-15",
    },
  ]

  const filteredPolicies = policies.filter(
    (policy) =>
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-[#99ddcc] text-[#55aa99] border-0">Active</Badge>
      case "draft":
        return <Badge className="bg-[#ffcc99] text-[#cc8855] border-0">Draft</Badge>
      case "review":
        return <Badge className="bg-[#99ccff] text-[#5588cc] border-0">Under Review</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Regulatory":
        return (
          <Badge variant="outline" className="bg-[#e6ecff] text-[#5588cc] border-[#99ccff]">
            {category}
          </Badge>
        )
      case "Operational":
        return (
          <Badge variant="outline" className="bg-[#e6ffee] text-[#55aa99] border-[#99ddcc]">
            {category}
          </Badge>
        )
      default:
        return <Badge variant="outline">{category}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Compliance Policies</h1>
        <p className="text-muted-foreground">FCA and FSA required policies and procedures</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search policies..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            New Policy
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Policies</CardTitle>
          <CardDescription>Policies and procedures for regulatory compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Next Review</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.id}</TableCell>
                  <TableCell>{policy.name}</TableCell>
                  <TableCell>{getCategoryBadge(policy.category)}</TableCell>
                  <TableCell>{new Date(policy.lastUpdated).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(policy.status)}</TableCell>
                  <TableCell>{policy.owner}</TableCell>
                  <TableCell>{new Date(policy.nextReview).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="gap-1">
                      <FileText className="h-4 w-4" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div>
            Showing {filteredPolicies.length} of {policies.length} policies
          </div>
          <div>Last policy update: May 5, 2025</div>
        </CardFooter>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>FCA Regulatory Requirements</CardTitle>
            <CardDescription>Key compliance requirements for financial services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Service Availability</h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Critical services must maintain 99.95% uptime</li>
                <li>Quarterly reporting of all service disruptions</li>
                <li>Immediate notification of critical service outages</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Incident Response</h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Critical incidents must be reported within 24 hours</li>
                <li>Root cause analysis required for all critical incidents</li>
                <li>Documented remediation plans for all reported incidents</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Operational Resilience</h3>
              <ul className="text-sm space-y-1 list-disc pl-5">
                <li>Regular testing of business continuity plans</li>
                <li>Documented recovery time objectives for all critical services</li>
                <li>Third-party provider contingency arrangements</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Policy Reviews</CardTitle>
            <CardDescription>Policies requiring review in the next 90 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy</TableHead>
                  <TableHead>Review Date</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">FCA Incident Reporting Procedure</TableCell>
                  <TableCell>Sep 22, 2025</TableCell>
                  <TableCell>Compliance Team</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Operational Resilience Testing</TableCell>
                  <TableCell>Aug 5, 2025</TableCell>
                  <TableCell>Risk Management</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
