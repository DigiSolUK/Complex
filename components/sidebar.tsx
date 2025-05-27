"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  AlertTriangle,
  Bell,
  BrainCircuit,
  ChevronDown,
  Clock,
  Cog,
  LayoutDashboard,
  LineChart,
  Plug,
  Shield,
  Users,
  X,
  Activity,
  HardDrive,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: { title: string; href: string }[]
  badge?: string
}

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "Assets",
      href: "/assets",
      icon: <HardDrive className="h-5 w-5" />,
      submenu: [
        { title: "Inventory", href: "/assets" },
        { title: "Discovery", href: "/assets/discovery" },
        { title: "Monitoring", href: "/assets?tab=monitoring" },
        { title: "Remote Access", href: "/assets?tab=remote" },
      ],
    },
    {
      title: "Monitoring",
      href: "/monitoring",
      icon: <Activity className="h-5 w-5" />,
      submenu: [
        { title: "Overview", href: "/monitoring" },
        { title: "Applications", href: "/monitoring/applications" },
        { title: "Infrastructure", href: "/monitoring/infrastructure" },
      ],
    },
    {
      title: "Incidents",
      href: "/incidents",
      icon: <AlertTriangle className="h-5 w-5" />,
      submenu: [
        { title: "Active", href: "/incidents/active" },
        { title: "Acknowledged", href: "/incidents/acknowledged" },
        { title: "Resolved", href: "/incidents/resolved" },
      ],
    },
    {
      title: "Alerts",
      href: "/alerts",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "On-Call",
      href: "/on-call",
      icon: <Clock className="h-5 w-5" />,
      submenu: [
        { title: "Schedules", href: "/on-call/schedules" },
        { title: "Escalation Policies", href: "/on-call/escalation-policies" },
      ],
    },
    {
      title: "AI Monitoring",
      href: "/settings/ai-monitoring",
      icon: <BrainCircuit className="h-5 w-5" />,
      badge: "New",
      submenu: [
        { title: "Insights", href: "/settings/ai-monitoring/insights" },
        { title: "Configuration", href: "/settings/ai-monitoring" },
        { title: "Model Training", href: "/settings/ai-monitoring/training" },
      ],
    },
    {
      title: "Teams",
      href: "/teams",
      icon: <Users className="h-5 w-5" />,
      submenu: [
        { title: "All Teams", href: "/teams" },
        { title: "Support Teams", href: "/settings/support-teams" },
      ],
    },
    {
      title: "Integrations",
      href: "/integrations",
      icon: <Plug className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <LineChart className="h-5 w-5" />,
    },
    {
      title: "Compliance",
      href: "/compliance",
      icon: <Shield className="h-5 w-5" />,
      submenu: [
        { title: "Dashboard", href: "/compliance/dashboard" },
        { title: "FCA Reporting", href: "/compliance" },
        { title: "Reports", href: "/compliance/reports" },
        { title: "Policies", href: "/compliance/policies" },
      ],
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Cog className="h-5 w-5" />,
    },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={onClose} />}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-200 ease-in-out",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-[#ECEDEE] bg-gradient-to-r from-[#006FCF] to-[#00175A]">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Nexus Command</span>
            </Link>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden text-white hover:bg-white/20">
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {sidebarItems.map((item) =>
                item.submenu ? (
                  <Collapsible key={item.href} className="w-full">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between font-normal hover:bg-[#E6F2FF] hover:text-[#006FCF] px-4 py-2.5",
                          pathname.startsWith(item.href) && "bg-[#E6F2FF] text-[#006FCF] font-medium",
                        )}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.title}</span>
                          {item.badge && (
                            <Badge className="ml-2 bg-gradient-to-r from-[#006FCF] to-[#00175A] text-white text-xs py-0 px-1.5 border-0">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-10 space-y-1 pt-2">
                      {item.submenu.map((subItem) => (
                        <Link key={subItem.href} href={subItem.href}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start font-normal text-sm hover:bg-[#E6F2FF] hover:text-[#006FCF] py-2",
                              pathname === subItem.href && "bg-[#E6F2FF] text-[#006FCF] font-medium",
                            )}
                          >
                            {subItem.title}
                          </Button>
                        </Link>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start font-normal hover:bg-[#E6F2FF] hover:text-[#006FCF] px-4 py-2.5",
                        pathname === item.href && "bg-[#E6F2FF] text-[#006FCF] font-medium",
                      )}
                    >
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                      {item.badge && (
                        <Badge className="ml-2 bg-gradient-to-r from-[#006FCF] to-[#00175A] text-white text-xs py-0 px-1.5 border-0">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                ),
              )}
            </nav>
          </ScrollArea>
          <div className="p-4 border-t border-[#ECEDEE]">
            <div className="p-4 bg-gradient-to-br from-[#E6F2FF] to-[#F7F8F9] rounded-lg">
              <h3 className="font-semibold text-[#00175A] mb-1">Need Help?</h3>
              <p className="text-xs text-[#53565A] mb-3">Contact our support team for assistance</p>
              <Button size="sm" className="w-full bg-[#006FCF] hover:bg-[#00175A] text-white">
                Get Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
