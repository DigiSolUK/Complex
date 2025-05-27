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
        <Button variant="ghost" size="icon" className="relative">
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
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Notifications</h4>
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
              Mark all as read
            </Button>
          </div>
        </div>
        <ScrollArea className="h-[300px]">
          <div className="grid gap-1 p-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 rounded-md p-3 text-sm ${notification.read ? "" : "bg-muted"}`}
              >
                <div className="flex-1">
                  <div className="font-medium">{notification.title}</div>
                  <div className="text-muted-foreground">{notification.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t">
          <Button variant="outline" size="sm" className="w-full">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
