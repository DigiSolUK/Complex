"use client"

import { useState } from "react"
import {
  ArrowUpDown,
  ComputerIcon as Desktop,
  Download,
  ExternalLink,
  HardDrive,
  MoreHorizontal,
  Network,
  Server,
  Settings,
  Smartphone,
  Terminal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Sample asset data
const assets = [
  {
    id: "ASSET-1001",
    name: "WEB-SERVER-01",
    type: "Server",
    ip: "192.168.1.10",
    os: "Windows Server 2022",
    status: "online",
    lastSeen: "2025-05-27T16:30:00Z",
  },
  {
    id: "ASSET-1002",
    name: "DB-SERVER-01",
    type: "Server",
    ip: "192.168.1.11",
    os: "Ubuntu 22.04 LTS",
    status: "online",
    lastSeen: "2025-05-27T16:35:00Z",
  },
  {
    id: "ASSET-1003",
    name: "FINANCE-PC-01",
    type: "Workstation",
    ip: "192.168.2.101",
    os: "Windows 11 Pro",
    status: "online",
    lastSeen: "2025-05-27T16:25:00Z",
  },
  {
    id: "ASSET-1004",
    name: "ROUTER-CORE-01",
    type: "Network",
    ip: "192.168.0.1",
    os: "Cisco IOS",
    status: "online",
    lastSeen: "2025-05-27T16:32:00Z",
  },
  {
    id: "ASSET-1005",
    name: "SALES-LAPTOP-03",
    type: "Workstation",
    ip: "192.168.2.153",
    os: "Windows 11 Pro",
    status: "offline",
    lastSeen: "2025-05-27T10:15:00Z",
  },
  {
    id: "ASSET-1006",
    name: "MARKETING-PC-02",
    type: "Workstation",
    ip: "192.168.2.122",
    os: "macOS Ventura",
    status: "warning",
    lastSeen: "2025-05-27T16:10:00Z",
  },
  {
    id: "ASSET-1007",
    name: "APP-SERVER-02",
    type: "Server",
    ip: "192.168.1.12",
    os: "Windows Server 2022",
    status: "online",
    lastSeen: "2025-05-27T16:33:00Z",
  },
  {
    id: "ASSET-1008",
    name: "SWITCH-FLOOR-2",
    type: "Network",
    ip: "192.168.0.2",
    os: "Cisco IOS",
    status: "online",
    lastSeen: "2025-05-27T16:31:00Z",
  },
  {
    id: "ASSET-1009",
    name: "CEO-PHONE",
    type: "Mobile",
    ip: "192.168.3.101",
    os: "iOS 17",
    status: "online",
    lastSeen: "2025-05-27T16:20:00Z",
  },
  {
    id: "ASSET-1010",
    name: "HR-PC-01",
    type: "Workstation",
    ip: "192.168.2.110",
    os: "Windows 11 Pro",
    status: "warning",
    lastSeen: "2025-05-27T16:15:00Z",
  },
]

export function AssetTable() {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getAssetTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "server":
        return <Server className="h-4 w-4" />
      case "workstation":
        return <Desktop className="h-4 w-4" />
      case "network":
        return <Network className="h-4 w-4" />
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      default:
        return <HardDrive className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-[#E6F9F1] text-[#00A859] border-[#00A859]">Online</Badge>
      case "offline":
        return <Badge className="bg-[#FFEEF0] text-[#D5001F] border-[#D5001F]">Offline</Badge>
      case "warning":
        return <Badge className="bg-[#FFF4EC] text-[#FF6900] border-[#FF6900]">Warning</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const toggleSelectAll = () => {
    if (selectedAssets.length === assets.length) {
      setSelectedAssets([])
    } else {
      setSelectedAssets(assets.map((asset) => asset.id))
    }
  }

  const toggleSelectAsset = (id: string) => {
    if (selectedAssets.includes(id)) {
      setSelectedAssets(selectedAssets.filter((assetId) => assetId !== id))
    } else {
      setSelectedAssets([...selectedAssets, id])
    }
  }

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedAssets.length === assets.length}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all assets"
                />
              </TableHead>
              <TableHead className="w-[180px]">
                <div className="flex items-center">
                  Asset Name
                  <Button variant="ghost" size="sm" className="ml-1 h-8 p-0">
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Operating System</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Seen</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => (
              <TableRow key={asset.id} className="hover:bg-[#F7F8F9]">
                <TableCell>
                  <Checkbox
                    checked={selectedAssets.includes(asset.id)}
                    onCheckedChange={() => toggleSelectAsset(asset.id)}
                    aria-label={`Select ${asset.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-[#E6F2FF]">{getAssetTypeIcon(asset.type)}</div>
                    {asset.name}
                  </div>
                </TableCell>
                <TableCell>{asset.type}</TableCell>
                <TableCell>{asset.ip}</TableCell>
                <TableCell>{asset.os}</TableCell>
                <TableCell>{getStatusBadge(asset.status)}</TableCell>
                <TableCell>{formatDate(asset.lastSeen)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer">
                        <Desktop className="mr-2 h-4 w-4" />
                        <span>Remote Desktop</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Terminal className="mr-2 h-4 w-4" />
                        <span>SSH</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>Web Console</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Configure</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Download className="mr-2 h-4 w-4" />
                        <span>Export Details</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
