import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { StaffAvatar } from "@/components/ui/avatar";
import { MoreHorizontal, FileEdit, UserX, UserCheck } from "lucide-react";
import { CareStaff } from "@shared/schema";

interface StaffCardProps {
  staff: CareStaff;
  onEdit: (staffId: number) => void;
  onStatusChange: (staffId: number, newStatus: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "On Leave":
      return "bg-yellow-100 text-yellow-800";
    case "Inactive":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function StaffCard({ staff, onEdit, onStatusChange }: StaffCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <StaffAvatar name={staff.name} className="h-12 w-12" />
            <div className="ml-4">
              <h4 className="text-lg font-medium text-neutral-900">{staff.name}</h4>
              <p className="text-sm text-neutral-500">ID: {staff.staffId}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(staff.id)}>
                <FileEdit className="h-4 w-4 mr-2" />
                Edit Staff Member
              </DropdownMenuItem>
              {staff.status !== "Active" && (
                <DropdownMenuItem
                  onClick={() => onStatusChange(staff.id, "Active")}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Set as Active
                </DropdownMenuItem>
              )}
              {staff.status !== "On Leave" && (
                <DropdownMenuItem
                  onClick={() => onStatusChange(staff.id, "On Leave")}
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Mark as On Leave
                </DropdownMenuItem>
              )}
              {staff.status !== "Inactive" && (
                <DropdownMenuItem
                  onClick={() => onStatusChange(staff.id, "Inactive")}
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Set as Inactive
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-4 border-t border-neutral-200 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-500">Position</p>
              <p className="mt-1 text-sm text-neutral-900">{staff.position}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Department</p>
              <p className="mt-1 text-sm text-neutral-900">
                {staff.department || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Phone</p>
              <p className="mt-1 text-sm text-neutral-900">
                {staff.phone || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-500">Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  staff.status
                )}`}
              >
                {staff.status}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-neutral-50 px-5 py-3 flex justify-between">
        <p className="text-sm text-neutral-700">{staff.email}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(staff.id)}
          className="text-primary-600 hover:text-primary-800"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
