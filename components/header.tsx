"use client"

import { useState } from "react"
import { Search, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NotificationsPopover from "@/components/notifications-popover"
import { Badge } from "@/components/ui/badge"

export default function Header() {
  const [searchValue, setSearchValue] = useState("")

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center border-b border-[#E5E7EB] bg-white px-4 md:left-[60px] lg:left-[260px]">
      <div className="flex w-full items-center justify-between">
        <div className="relative flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-10 w-full pl-10 pr-4 text-sm bg-[#F9FAFB] border-[#E5E7EB] focus-visible:ring-[#006FCF]"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-[#E5E7EB] bg-[#F9FAFB] px-1.5 text-xs text-gray-500">
              ⌘K
            </kbd>
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-[#F9FAFB]">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <div className="relative">
            <NotificationsPopover />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#D5001F] text-white border-2 border-white">
              3
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9 border border-[#E5E7EB]">
                  <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                  <AvatarFallback className="bg-[#006FCF] text-white">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe</p>
                  <p className="text-xs leading-none text-muted-foreground">john.doe@amex.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Notification Preferences</DropdownMenuItem>
              <DropdownMenuItem>API Keys</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#D5001F]">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
