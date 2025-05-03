import React from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PatientAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileEdit, XCircle, CheckCircle } from "lucide-react";
import { Appointment } from "@shared/schema";
import { formatDateTime } from "@/lib/utils";

interface AppointmentCardProps {
  appointment: Appointment & {
    patientName?: string;
    staffName?: string;
  };
  minimal?: boolean;
  onEdit?: (id: number) => void;
  onCancel?: (id: number) => void;
  onComplete?: (id: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    case "Completed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function AppointmentCard({
  appointment,
  minimal = false,
  onEdit,
  onCancel,
  onComplete,
}: AppointmentCardProps) {
  const { id, title, dateTime, duration, status, patientId, staffId, description, location, patientName, staffName } = appointment;
  
  const formattedDateTime = formatDateTime(dateTime);
  const formattedTime = new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (minimal) {
    return (
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary-100 text-primary-600">
            <span className="text-sm font-medium">{formattedTime}</span>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900 truncate">{title}</p>
          <p className="text-sm text-neutral-500 truncate">{formattedDateTime}</p>
        </div>
        <div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              status
            )}`}
          >
            {status}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600">
                <span className="text-sm font-medium">{formattedTime}</span>
              </span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
              <p className="text-sm text-neutral-500">{formattedDateTime}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  status
                )}`}
              >
                {status}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(id)}>
                    <FileEdit className="h-4 w-4 mr-2" />
                    Edit Appointment
                  </DropdownMenuItem>
                )}
                {onCancel && status !== "Cancelled" && (
                  <DropdownMenuItem onClick={() => onCancel(id)}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Appointment
                  </DropdownMenuItem>
                )}
                {onComplete && status !== "Completed" && (
                  <DropdownMenuItem onClick={() => onComplete(id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {patientName && (
            <div>
              <p className="text-sm font-medium text-neutral-500">Patient</p>
              <div className="mt-1 flex items-center">
                <PatientAvatar name={patientName} className="h-6 w-6 mr-2" />
                <Link href={`/patients/${patientId}`}>
                  <a className="text-sm text-primary-600 hover:text-primary-800">{patientName}</a>
                </Link>
              </div>
            </div>
          )}
          
          {staffName && (
            <div>
              <p className="text-sm font-medium text-neutral-500">Provider</p>
              <p className="mt-1 text-sm text-neutral-900">{staffName}</p>
            </div>
          )}
          
          {location && (
            <div>
              <p className="text-sm font-medium text-neutral-500">Location</p>
              <p className="mt-1 text-sm text-neutral-900">{location}</p>
            </div>
          )}
          
          {duration && (
            <div>
              <p className="text-sm font-medium text-neutral-500">Duration</p>
              <p className="mt-1 text-sm text-neutral-900">{duration} minutes</p>
            </div>
          )}
        </div>
        
        {description && (
          <div className="mt-4">
            <p className="text-sm font-medium text-neutral-500">Notes</p>
            <p className="mt-1 text-sm text-neutral-700 whitespace-pre-line">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
