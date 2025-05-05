import React from "react";
import { Link, useLocation } from "wouter";
import { Home, Users, Calendar, Menu } from "lucide-react";

export function MobileNavigation() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path || (path !== "/" && location.startsWith(path));
  };

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

        <Link href="/appointments">
          <div
            className={`flex flex-col items-center py-3 px-2 cursor-pointer ${
              isActive("/appointments") ? "text-primary-600" : "text-neutral-600"
            }`}
          >
            <Calendar className="h-6 w-6" />
            <span className="text-xs">Appointments</span>
          </div>
        </Link>

        <button
          type="button"
          className="flex flex-col items-center py-3 px-2 text-neutral-600"
        >
          <Menu className="h-6 w-6" />
          <span className="text-xs">More</span>
        </button>
      </div>
    </div>
  );
}
