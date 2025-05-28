"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertTriangle,
  BarChart2,
  Bell,
  Cog,
  Database,
  Gauge,
  Home,
  LifeBuoy,
  Network,
  Ticket,
  MonitorSmartphone,
  ChevronRight,
  Shield,
  BrainCircuit,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setCollapsed(true)
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const routes = [
    {
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Incidents",
      icon: <AlertTriangle className="h-5 w-5" />,
      href: "/incidents",
      active: pathname === "/incidents" || pathname.startsWith("/incidents/"),
    },
    {
      label: "Tickets",
      icon: <Ticket className="h-5 w-5" />,
      href: "/tickets",
      active: pathname === "/tickets" || pathname.startsWith("/tickets/"),
    },
    {
      label: "Alerts",
      icon: <Bell className="h-5 w-5" />,
      href: "/alerts",
      active: pathname === "/alerts" || pathname.startsWith("/alerts/"),
    },
    {
      label: "Monitoring",
      icon: <Gauge className="h-5 w-5" />,
      href: "/monitoring",
      active: pathname === "/monitoring" || pathname.startsWith("/monitoring/"),
    },
    {
      label: "Assets",
      icon: <Database className="h-5 w-5" />,
      href: "/assets",
      active: pathname === "/assets" || pathname.startsWith("/assets/"),
    },
    {
      label: "Analytics",
      icon: <BarChart2 className="h-5 w-5" />,
      href: "/analytics",
      active: pathname === "/analytics",
    },
    {
      label: "Compliance",
      icon: <Shield className="h-5 w-5" />,
      href: "/compliance",
      active: pathname === "/compliance" || pathname.startsWith("/compliance/"),
    },
    {
      label: "Integrations",
      icon: <Network className="h-5 w-5" />,
      href: "/integrations",
      active: pathname === "/integrations",
    },
    {
      label: "AI Integration",
      icon: <BrainCircuit className="h-5 w-5" />,
      href: "/ai-integration",
      active: pathname === "/ai-integration" || pathname.startsWith("/ai-integration/"),
    },
    {
      label: "Settings",
      icon: <Cog className="h-5 w-5" />,
      href: "/settings",
      active: pathname === "/settings" || pathname.startsWith("/settings/"),
    },
  ]

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-[#001B5A] transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[260px]",
      )}
    >
      <div className="flex h-16 items-center border-b border-[#0A2A6B] px-4">
        <Link href="/" className="flex items-center gap-2">
          {collapsed ? (
            <MonitorSmartphone className="h-6 w-6 text-white" />
          ) : (
            <>
              <MonitorSmartphone className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">Nexus Command</span>
            </>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto text-white hover:bg-[#0A2A6B]"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronRight className={cn("h-5 w-5 transition-transform", !collapsed && "rotate-180")} />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 mb-1 text-sm font-medium transition-colors",
                route.active ? "bg-[#0A2A6B] text-white" : "text-[#8A9CC9] hover:bg-[#0A2A6B] hover:text-white",
              )}
            >
              {route.icon}
              {!collapsed && <span>{route.label}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t border-[#0A2A6B] p-2">
        <Link
          href="#"
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
            "bg-[#1E4DB7] text-white hover:bg-[#2E5DC7]",
          )}
        >
          <LifeBuoy className="h-5 w-5" />
          {!collapsed && <span>Support</span>}
        </Link>
      </div>
    </div>
  )
}
