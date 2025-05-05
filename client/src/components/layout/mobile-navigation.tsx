import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, Users, Calendar, Menu, BarChart2, Settings, ClipboardList, MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNavigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path || (path !== "/" && location.startsWith(path));
  };

  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white">
      <div className="flex justify-around">
        <Link href="/dashboard">
          <div
            className={`flex flex-col items-center py-3 px-2 cursor-pointer ${
              isActive("/") || isActive("/dashboard")
                ? "text-primary-600"
                : "text-neutral-600"
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs">Dashboard</span>
          </div>
        </Link>

        <Link href="/patients">
          <div
            className={`flex flex-col items-center py-3 px-2 cursor-pointer ${
              isActive("/patients") ? "text-primary-600" : "text-neutral-600"
            }`}
          >
            <Users className="h-6 w-6" />
            <span className="text-xs">Patients</span>
          </div>
        </Link>

        <Link href="/analytics-dashboard">
          <div
            className={`flex flex-col items-center py-3 px-2 cursor-pointer ${
              isActive("/analytics-dashboard") ? "text-primary-600" : "text-neutral-600"
            }`}
          >
            <BarChart2 className="h-6 w-6" />
            <span className="text-xs">Analytics</span>
          </div>
        </Link>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex flex-col items-center py-3 px-2 text-neutral-600"
            >
              <Menu className="h-6 w-6" />
              <span className="text-xs">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh]">
            <div className="grid grid-cols-2 gap-6 p-6">
              <Link href="/appointments" onClick={() => setIsOpen(false)}>
                <div className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                  <Calendar className="h-8 w-8 mb-2 text-primary-600" />
                  <span className="text-sm font-medium">Appointments</span>
                </div>
              </Link>
              
              <Link href="/care-plans" onClick={() => setIsOpen(false)}>
                <div className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                  <ClipboardList className="h-8 w-8 mb-2 text-secondary-600" />
                  <span className="text-sm font-medium">Care Plans</span>
                </div>
              </Link>
              
              <Link href="/patient-support" onClick={() => setIsOpen(false)}>
                <div className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                  <MessageCircle className="h-8 w-8 mb-2 text-yellow-600" />
                  <span className="text-sm font-medium">Patient Support</span>
                </div>
              </Link>
              
              <Link href="/settings" onClick={() => setIsOpen(false)}>
                <div className="flex flex-col items-center p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                  <Settings className="h-8 w-8 mb-2 text-neutral-600" />
                  <span className="text-sm font-medium">Settings</span>
                </div>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
