import React from "react";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type AppointmentItem = {
  id: number;
  time: string;
  patientName: string;
  patientId: number;
  purpose: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
};

const getStatusColor = (status: AppointmentItem["status"]) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    case "Completed":
      return "bg-blue-100 text-blue-800";
  }
};

export function TodayAppointments({
  appointments = [],
}: {
  appointments: AppointmentItem[];
}) {
  return (
    <Card>
      <CardHeader className="px-4 py-5 sm:px-6 border-b border-neutral-200">
        <CardTitle className="text-lg leading-6 font-medium text-neutral-900">
          Today's Appointments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 overflow-y-auto h-80">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-neutral-500">No appointments for today</p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-200">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 text-primary-600">
                      <span className="text-sm font-medium">
                        {appointment.time}
                      </span>
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/patients/${appointment.patientId}`} className="text-sm font-medium text-neutral-900 truncate hover:text-primary-600">
                      {appointment.patientName}
                    </Link>
                    <p className="text-sm text-neutral-500 truncate">
                      {appointment.purpose}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-neutral-500 hover:bg-neutral-100">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Link href={`/appointments/${appointment.id}`} className="w-full">
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        {appointment.status !== "Confirmed" && (
                          <DropdownMenuItem>Confirm</DropdownMenuItem>
                        )}
                        {appointment.status !== "Cancelled" && (
                          <DropdownMenuItem>Cancel</DropdownMenuItem>
                        )}
                        {appointment.status !== "Completed" && (
                          <DropdownMenuItem>Mark Completed</DropdownMenuItem>
                        )}
                        <DropdownMenuItem>Reschedule</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="border-t border-neutral-200 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-center w-full">
          <Link href="/appointments">
            <Button variant="outline">View full schedule</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
