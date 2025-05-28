"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function NotificationsPopover() {
  const notifications = [
    {
      id: 1,
      title: "Critical: Database CPU Spike",
      description: "Database server experiencing high CPU usage",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Warning: API Latency Increase",
      description: "API response times exceeding thresholds",
      time: "15 minutes ago",
      read: false,
    },
    {
      id: 3,
      title: "Info: Deployment Completed",
      description: "New version deployed successfully",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 4,
      title: "Incident #1234 Acknowledged",
      description: "Sarah Johnson acknowledged the incident",
      time: "3 hours ago",
      read: true,
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:bg-[#F9FAFB]">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-[#00175A]">Notifications</h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-[#006FCF] hover:text-[#00175A] hover:bg-transparent"
            >
              Mark all as read
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="grid gap-1 p-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 rounded-md p-3 text-sm ${notification.read ? "" : "bg-[#F9FAFB]"}`}
              >
                <div className="flex-1">
                  <div className="font-medium text-[#00175A]">{notification.title}</div>
                  <div className="text-[#6B7280]">{notification.description}</div>
                  <div className="text-xs text-[#6B7280] mt-1">{notification.time}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t border-[#E5E7EB]">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-[#E5E7EB] text-[#006FCF] hover:bg-[#E6F2FF] hover:text-[#00175A]"
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
