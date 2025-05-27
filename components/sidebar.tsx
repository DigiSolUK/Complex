"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AlertTriangle, Bell, ChevronDown, Clock, Cog, LayoutDashboard, LineChart, Plug, Users, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  submenu?: { title: string; href: string }[]
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
      title: "Teams",
      href: "/teams",
      icon: <Users className="h-5 w-5" />,
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
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-[#f0f4ff] border-r border-[#e6ecff] transition-transform duration-200 ease-in-out",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-[#e6ecff] bg-[#f0f4ff]">
            <Link href="/" className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-[#cc66aa]" />
              <span className="text-xl font-bold text-gray-800">AlertOps</span>
            </Link>
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
          <ScrollArea className="flex-1 px-3 py-2">
            <nav className="space-y-1">
              {sidebarItems.map((item) =>
                item.submenu ? (
                  <Collapsible key={item.href} className="w-full">
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-between font-normal hover:bg-[#e6ecff] hover:text-[#8855cc]",
                          pathname.startsWith(item.href) && "bg-[#e6ecff] text-[#8855cc] font-medium",
                        )}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.title}</span>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-10 space-y-1 pt-1">
                      {item.submenu.map((subItem) => (
                        <Link key={subItem.href} href={subItem.href}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start font-normal text-sm hover:bg-[#e6ecff] hover:text-[#8855cc]",
                              pathname === subItem.href && "bg-[#e6ecff] text-[#8855cc] font-medium",
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
                        "w-full justify-start font-normal hover:bg-[#e6ecff] hover:text-[#8855cc]",
                        pathname === item.href && "bg-[#e6ecff] text-[#8855cc] font-medium",
                      )}
                    >
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </Button>
                  </Link>
                ),
              )}
            </nav>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}
