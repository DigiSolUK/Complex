"use client"

import { useState } from "react"
import { Menu, Search, X, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Sidebar from "@/components/sidebar"
import NotificationsPopover from "@/components/notifications-popover"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-40 flex h-16 items-center gap-4 border-b border-[#ECEDEE] bg-white/95 backdrop-blur-sm px-4 md:px-8 shadow-sm">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-[#E6F2FF]" onClick={onMenuClick}>
            <Menu className="h-5 w-5 text-[#00175A]" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0 sm:max-w-xs">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {searchOpen ? (
        <div className="flex-1 flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#53565A]" />
            <Input
              type="search"
              placeholder="Search incidents, alerts, services..."
              className="pl-10 pr-4 h-10 bg-[#F7F8F9] border-[#ECEDEE] focus:border-[#006FCF] focus:ring-2 focus:ring-[#006FCF]/20"
              autoFocus
            />
          </div>
          <Button variant="ghost" size="icon" className="ml-2 hover:bg-[#E6F2FF]" onClick={() => setSearchOpen(false)}>
            <X className="h-5 w-5 text-[#00175A]" />
            <span className="sr-only">Close search</span>
          </Button>
        </div>
      ) : (
        <>
          <div className="w-full flex-1 md:grow-0">
            <Button
              variant="outline"
              className="h-10 w-full justify-start text-[#53565A] md:w-64 lg:w-96 bg-[#F7F8F9] border-[#ECEDEE] hover:bg-white hover:border-[#006FCF]"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Search...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-end gap-3">
            <Button variant="ghost" size="icon" className="relative hover:bg-[#E6F2FF]">
              <HelpCircle className="h-5 w-5 text-[#53565A]" />
              <span className="sr-only">Help</span>
            </Button>
            <div className="relative">
              <NotificationsPopover />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-[#D5001F] text-white border-2 border-white">
                3
              </Badge>
            </div>
            <div className="h-8 w-px bg-[#ECEDEE]" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-[#E6F2FF]">
                  <Avatar className="h-10 w-10 border-2 border-[#E6F2FF]">
                    <AvatarImage src="/abstract-geometric-shapes.png" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-[#006FCF] to-[#00175A] text-white">
                      JD
                    </AvatarFallback>
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
                <DropdownMenuItem>
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Notification Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>API Keys</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-[#D5001F]">
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </header>
  )
}
