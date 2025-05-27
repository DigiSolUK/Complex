"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, RefreshCw, Key, Shield, Server, Network, Laptop, Database } from "lucide-react"

export default function AssetCredentialsPage() {
  const [refreshing, setRefreshing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [credentialType, setCredentialType] = useState("ssh")
  const [credentialName, setCredentialName] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [domain, setDomain] = useState("")

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  const resetForm = () => {
    setCredentialType("ssh")
    setCredentialName("")
    setUsername("")
    setPassword("")
    setPrivateKey("")
    setDomain("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the credential
    setDialogOpen(false)
    resetForm()
  }

  // Sample credentials data
  const credentials = [
    {
      id: "cred-001",
      name: "Linux Servers SSH",
      type: "ssh",
      username: "admin",
      lastUsed: "2025-05-25T10:30:00Z",
      status: "active",
      assetCount: 45,
    },
    {
      id: "cred-002",
      name: "Windows Domain Admin",
      type: "winrm",
      username: "domain\\admin",
      lastUsed: "2025-05-24T14:15:00Z",
      status: "active",
      assetCount: 128,
    },
    {
      id: "cred-003",
      name: "Network Devices",
      type: "snmp",
      username: "readonly",
      lastUsed: "2025-05-23T09:45:00Z",
      status: "active",
      assetCount: 36,
    },
    {
      id: "cred-004",
      name: "Database Servers",
      type: "sql",
      username: "dbadmin",
      lastUsed: "2025-05-20T16:30:00Z",
      status: "inactive",
      assetCount: 12,
    },
    {
      id: "cred-005",
      name: "Cloud VMs",
      type: "ssh",
      username: "cloud-user",
      lastUsed: "2025-05-18T11:20:00Z",
      status: "active",
      assetCount: 67,
    },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case "ssh":
        return <Server className="h-4 w-4 text-[#006FCF]" />
      case "winrm":
        return <Laptop className="h-4 w-4 text-[#006FCF]" />
      case "snmp":
        return <Network className="h-4 w-4 text-[#006FCF]" />
      case "sql":
        return <Database className="h-4 w-4 text-[#006FCF]" />
      default:
        return <Key className="h-4 w-4 text-[#006FCF]" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Active</Badge>
      case "inactive":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">Inactive</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#006FCF]">Remote Access Credentials</h1>
          <p className="text-muted-foreground">Manage credentials for remote access to assets</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-[#006FCF] text-[#006FCF]"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#006FCF] hover:bg-[#004F93]">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Credential
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Credential</DialogTitle>
                <DialogDescription>Add a new credential for remote access to assets</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="credential-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="credential-name"
                      value={credentialName}
                      onChange={(e) => setCredentialName(e.target.value)}
                      className="col-span-3"
                      placeholder="Linux Servers SSH"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="credential-type" className="text-right">
                      Type
                    </Label>
                    <Select value={credentialType} onValueChange={setCredentialType}>
                      <SelectTrigger id="credential-type" className="col-span-3">
                        <SelectValue placeholder="Select credential type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ssh">SSH</SelectItem>
                        <SelectItem value="winrm">Windows Remote Management</SelectItem>
                        <SelectItem value="snmp">SNMP</SelectItem>
                        <SelectItem value="sql">SQL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="col-span-3"
                      placeholder="admin"
                      required
                    />
                  </div>

                  {credentialType === "winrm" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="domain" className="text-right">
                        Domain
                      </Label>
                      <Input
                        id="domain"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="col-span-3"
                        placeholder="CONTOSO"
                      />
                    </div>
                  )}

                  {(credentialType === "ssh" || credentialType === "winrm" || credentialType === "sql") && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="col-span-3"
                        placeholder="••••••••"
                      />
                    </div>
                  )}

                  {credentialType === "ssh" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="private-key" className="text-right">
                        Private Key
                      </Label>
                      <div className="col-span-3">
                        <Input id="private-key-file" type="file" className="hidden" />
                        <div className="flex gap-2">
                          <Input
                            id="private-key"
                            value={privateKey}
                            onChange={(e) => setPrivateKey(e.target.value)}
                            placeholder="No file selected"
                            readOnly
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("private-key-file")?.click()}
                            className="border-[#006FCF] text-[#006FCF]"
                          >
                            Browse
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#006FCF] hover:bg-[#004F93]">
                    <Shield className="mr-2 h-4 w-4" />
                    Save Credential
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="ssh">SSH</TabsTrigger>
          <TabsTrigger value="winrm">WinRM</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Credentials</CardTitle>
              <CardDescription>View and manage all remote access credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Assets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credentials.map((cred) => (
                    <TableRow key={cred.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {getCredentialIcon(cred.type)}
                        {cred.name}
                      </TableCell>
                      <TableCell className="uppercase">{cred.type}</TableCell>
                      <TableCell>{cred.username}</TableCell>
                      <TableCell>{formatDate(cred.lastUsed)}</TableCell>
                      <TableCell>{getStatusBadge(cred.status)}</TableCell>
                      <TableCell className="text-right">{cred.assetCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ssh">
          <Card>
            <CardHeader>
              <CardTitle>SSH Credentials</CardTitle>
              <CardDescription>View and manage SSH credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Assets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credentials
                    .filter((cred) => cred.type === "ssh")
                    .map((cred) => (
                      <TableRow key={cred.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          {getCredentialIcon(cred.type)}
                          {cred.name}
                        </TableCell>
                        <TableCell>{cred.username}</TableCell>
                        <TableCell>{formatDate(cred.lastUsed)}</TableCell>
                        <TableCell>{getStatusBadge(cred.status)}</TableCell>
                        <TableCell className="text-right">{cred.assetCount}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="winrm">
          <Card>
            <CardHeader>
              <CardTitle>Windows Remote Management Credentials</CardTitle>
              <CardDescription>View and manage WinRM credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Assets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credentials
                    .filter((cred) => cred.type === "winrm")
                    .map((cred) => (
                      <TableRow key={cred.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          {getCredentialIcon(cred.type)}
                          {cred.name}
                        </TableCell>
                        <TableCell>{cred.username}</TableCell>
                        <TableCell>{formatDate(cred.lastUsed)}</TableCell>
                        <TableCell>{getStatusBadge(cred.status)}</TableCell>
                        <TableCell className="text-right">{cred.assetCount}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="other">
          <Card>
            <CardHeader>
              <CardTitle>Other Credentials</CardTitle>
              <CardDescription>View and manage SNMP, SQL, and other credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Assets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credentials
                    .filter((cred) => cred.type !== "ssh" && cred.type !== "winrm")
                    .map((cred) => (
                      <TableRow key={cred.id}>
                        <TableCell className="font-medium flex items-center gap-2">
                          {getCredentialIcon(cred.type)}
                          {cred.name}
                        </TableCell>
                        <TableCell className="uppercase">{cred.type}</TableCell>
                        <TableCell>{cred.username}</TableCell>
                        <TableCell>{formatDate(cred.lastUsed)}</TableCell>
                        <TableCell>{getStatusBadge(cred.status)}</TableCell>
                        <TableCell className="text-right">{cred.assetCount}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
