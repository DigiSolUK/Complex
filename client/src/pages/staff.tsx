import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StaffCard } from "@/components/staff/staff-card";
import { StaffForm } from "@/components/staff/staff-form";
import { PlusCircle, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/auth-context";
import { CareStaff, InsertCareStaff } from "@shared/schema";
import { filterBySearchQuery } from "@/lib/utils";

export default function Staff() {
  const { isDemoMode } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<CareStaff | null>(null);

  // Fetch staff
  const { data: staffMembers = [], isLoading } = useQuery({
    queryKey: ["/api/staff"],
    enabled: !isDemoMode,
  });

  // Demo data
  const demoStaff: CareStaff[] = [
    {
      id: 1,
      userId: 201,
      staffId: "STAFF-2023-001",
      name: "Dr. Mark Thompson",
      position: "Lead Physician",
      department: "General Practice",
      phone: "07700 900001",
      email: "mark.thompson@example.com",
      qualifications: "MD, MRCGP",
      status: "Active",
      createdAt: "2022-11-10T09:00:00Z",
    },
    {
      id: 2,
      userId: 202,
      staffId: "STAFF-2023-002",
      name: "Nurse Lisa Chen",
      position: "Senior Nurse",
      department: "Community Nursing",
      phone: "07700 900002",
      email: "lisa.chen@example.com",
      qualifications: "RN, BSN",
      status: "Active",
      createdAt: "2022-12-05T10:30:00Z",
    },
    {
      id: 3,
      userId: 203,
      staffId: "STAFF-2023-003",
      name: "Dr. James Wilson",
      position: "Specialist",
      department: "Geriatrics",
      phone: "07700 900003",
      email: "james.wilson@example.com",
      qualifications: "MD, PhD",
      status: "Active",
      createdAt: "2023-01-15T08:45:00Z",
    },
    {
      id: 4,
      userId: 204,
      staffId: "STAFF-2023-004",
      name: "Sarah Johnson",
      position: "Physiotherapist",
      department: "Rehabilitation",
      phone: "07700 900004",
      email: "sarah.johnson@example.com",
      qualifications: "MSc Physiotherapy",
      status: "Active",
      createdAt: "2023-02-20T11:15:00Z",
    },
    {
      id: 5,
      userId: 205,
      staffId: "STAFF-2023-005",
      name: "Michael Brown",
      position: "Care Coordinator",
      department: "Administration",
      phone: "07700 900005",
      email: "michael.brown@example.com",
      qualifications: "BSc Health Management",
      status: "On Leave",
      createdAt: "2023-03-10T09:30:00Z",
    },
    {
      id: 6,
      userId: 206,
      staffId: "STAFF-2023-006",
      name: "Dr. Emily Clark",
      position: "General Practitioner",
      department: "General Practice",
      phone: "07700 900006",
      email: "emily.clark@example.com",
      qualifications: "MD, MRCGP",
      status: "Active",
      createdAt: "2023-04-05T14:00:00Z",
    },
  ];

  // Use real or demo data
  const displayStaff = isDemoMode ? demoStaff : staffMembers;

  // Extract unique departments for the filter
  const departments = Array.from(new Set(displayStaff.map(staff => staff.department).filter(Boolean)));

  // Filter staff
  const filteredStaff = displayStaff
    .filter(staff => statusFilter === "all" || staff.status === statusFilter)
    .filter(staff => departmentFilter === "all" || staff.department === departmentFilter);

  // Search staff
  const searchedStaff = filterBySearchQuery(
    filteredStaff,
    searchQuery,
    ["name", "staffId", "position", "email", "phone"]
  );

  // Create staff mutation
  const createMutation = useMutation({
    mutationFn: async (newStaff: InsertCareStaff) => {
      if (isDemoMode) {
        // In demo mode, just simulate success
        return { id: Math.floor(Math.random() * 1000) };
      }
      const res = await apiRequest("POST", "/api/staff", newStaff);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      setShowForm(false);
      setEditingStaff(null);
    },
  });

  // Update staff mutation
  const updateMutation = useMutation({
    mutationFn: async (staff: CareStaff) => {
      if (isDemoMode) {
        // In demo mode, just simulate success
        return staff;
      }
      const res = await apiRequest("PUT", `/api/staff/${staff.id}`, staff);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
      setShowForm(false);
      setEditingStaff(null);
    },
  });

  // Update staff status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ staffId, status }: { staffId: number; status: string }) => {
      if (isDemoMode) {
        // In demo mode, just simulate success
        return { success: true };
      }
      const res = await apiRequest("PATCH", `/api/staff/${staffId}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/staff"] });
    },
  });

  const handleStaffSubmit = async (data: InsertCareStaff) => {
    if (editingStaff) {
      await updateMutation.mutateAsync({ ...editingStaff, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEditStaff = (staffId: number) => {
    const staff = displayStaff.find(s => s.id === staffId);
    if (staff) {
      setEditingStaff(staff);
      setShowForm(true);
    }
  };

  const handleStatusChange = (staffId: number, newStatus: string) => {
    updateStatusMutation.mutate({ staffId, status: newStatus });
  };

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <StaffForm
          initialData={editingStaff || undefined}
          onSubmit={handleStaffSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingStaff(null);
          }}
          isEditing={!!editingStaff}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="pb-5 border-b border-neutral-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-neutral-900 sm:text-3xl">
          Staff
        </h2>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <Button onClick={() => setShowForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Staff Member
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search staff..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept || ""}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading && !isDemoMode ? (
        <div className="flex justify-center mt-8">
          <p>Loading staff...</p>
        </div>
      ) : searchedStaff.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-neutral-500">No staff members found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowForm(true)}
          >
            Add Staff Member
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {searchedStaff.map(staff => (
            <StaffCard
              key={staff.id}
              staff={staff}
              onEdit={handleEditStaff}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
