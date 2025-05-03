import React from "react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PatientAvatar } from "@/components/ui/avatar";
import { MoreHorizontal, Calendar, Clipboard, FileEdit } from "lucide-react";
import { Patient } from "@shared/schema";

interface PatientCardProps {
  patient: Patient & {
    age?: number;
    nextAppointment?: string | null;
  };
  onEdit: (patientId: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Inactive":
      return "bg-red-100 text-red-800";
    case "Review":
      return "bg-yellow-100 text-yellow-800";
    case "New":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function PatientCard({ patient, onEdit }: PatientCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <PatientAvatar name={patient.name} className="h-12 w-12" />
            <div className="ml-4">
              <Link href={`/patients/${patient.id}`}>
                <a className="text-lg font-medium text-neutral-900 hover:text-primary-600">
                  {patient.name}
                </a>
              </Link>
              <p className="text-sm text-neutral-500">ID: {patient.patientId}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(patient.id)}>
                <FileEdit className="h-4 w-4 mr-2" />
                Edit Patient
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/appointments/new?patientId=${patient.id}`}>
                  <a className="flex items-center w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/care-plans/new?patientId=${patient.id}`}>
                  <a className="flex items-center w-full">
                    <Clipboard className="h-4 w-4 mr-2" />
                    Create Care Plan
                  </a>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4 border-t border-neutral-200 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-500">Age</p>
              <p className="mt-1 text-sm text-neutral-900">
                {patient.age || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Care Type</p>
              <p className="mt-1 text-sm text-neutral-900">{patient.careType}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">
                Next Appointment
              </p>
              <p className="mt-1 text-sm text-neutral-900">
                {patient.nextAppointment || "None scheduled"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  patient.status
                )}`}
              >
                {patient.status}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-neutral-50 px-5 py-3 flex justify-between">
        <Link href={`/patients/${patient.id}`}>
          <a className="text-sm font-medium text-primary-600 hover:text-primary-800">
            View Profile
          </a>
        </Link>
        <Link href={`/care-plans?patientId=${patient.id}`}>
          <a className="text-sm font-medium text-primary-600 hover:text-primary-800">
            Care Plan
          </a>
        </Link>
      </CardFooter>
    </Card>
  );
}
