import React, { useState } from "react";
import { Menu, Search, Bell, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/context/auth-context";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const { logout } = useAuth();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // In a real implementation, this would trigger a search API call
  };

  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo (mobile only) */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="ml-2 text-xl font-bold text-primary-700">
              ComplexCare
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                <Input
                  id="search"
                  name="search"
                  className="block w-full pl-10 border-neutral-300"
                  placeholder="Search patients, staff, etc..."
                  type="search"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
          </div>

          {/* User profile & notifications (right side) */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="p-1 rounded-full text-neutral-500 hover:text-neutral-900 focus:outline-none"
            >
              <Bell className="h-6 w-6" />
            </button>
          </div>

          <div className="hidden lg:flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-1 mr-4 rounded-full text-neutral-500 hover:text-neutral-900 focus:outline-none"
                  >
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-1 rounded-full text-neutral-500 hover:text-neutral-900 focus:outline-none"
                  >
                    <span className="sr-only">Help</span>
                    <HelpCircle className="h-6 w-6" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get help</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </header>
  );
}
