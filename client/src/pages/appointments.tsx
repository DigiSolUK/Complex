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
import { AppointmentCard } from "@/components/appointments/appointment-card";
import { AppointmentForm } from "@/components/appointments/appointment-form";
import { PlusCircle, Search, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/auth-context";
import { Appointment, InsertAppointment, Patient, CareStaff } from "@shared/schema";
import { filterBySearchQuery, groupAppointmentsByDate } from "@/lib/utils";

export default function Appointments() {
  const { isDemoMode } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Fetch appointments
  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: ["/api/appointments"],
    enabled: !isDemoMode,
  });

  // Fetch patients for appointment form
  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({
    queryKey: ["/api/patients"],
    enabled: !isDemoMode,
  });

  // Fetch staff for appointment form
  const { data: staff = [], isLoading: isLoadingStaff } = useQuery({
    queryKey: ["/api/staff"],
    enabled: !isDemoMode,
  });

  // Demo data
  const demoAppointments: Appointment[] = [
    {
      id: 1,
      patientId: 1,
      staffId: 1,
      title: "Annual check-up",
      description: "Regular health assessment",
      dateTime: new Date().toISOString().replace(/T\d\d:\d\d/, "T09:00"),
      duration: 60,
      status: "Confirmed",
      location: "Main Clinic, Room 3",
      notes: "",
      createdAt: "2023-06-15T10:30:00Z",
    },
    {
      id: 2,
      patientId: 2,
      staffId: 2,
      title: "Medication review",
      description: "Review current medications and adjust as needed",
      dateTime: new Date().toISOString().replace(/T\d\d:\d\d/, "T10:30"),
      duration: 30,
      status: "Pending",
      location: "East Wing, Room 12",
      notes: "",
      createdAt: "2023-06-16T14:15:00Z",
    },
    {
      id: 3,
      patientId: 3,
      staffId: 1,
      title: "Follow-up consultation",
      description: "Follow-up on last week's treatment",
      dateTime: new Date().toISOString().replace(/T\d\d:\d\d/, "T11:45"),
      duration: 45,
      status: "Confirmed",
      location: "Main Clinic, Room 5",
      notes: "",
      createdAt: "2023-06-16T15:30:00Z",
    },
    {
      id: 4,
      patientId: 4,
      staffId: 3,
      title: "Initial assessment",
      description: "First-time patient assessment",
      dateTime: new Date().toISOString().replace(/T\d\d:\d\d/, "T14:15"),
      duration: 90,
      status: "Confirmed",
      location: "West Wing, Room 8",
      notes: "New patient intake",
      createdAt: "2023-06-17T09:45:00Z",
    },
    {
      id: 5,
      patientId: 5,
      staffId: 4,
      title: "Therapy session",
      description: "Regular physiotherapy session",
      dateTime: new Date().toISOString().replace(/T\d\d:\d\d/, "T16:00"),
      duration: 60,
      status: "Confirmed",
      location: "Therapy Center, Room 2",
      notes: "",
      createdAt: "2023-06-17T11:20:00Z",
    },
  ];

  const demoPatients: Patient[] = [
    {
      id: 1,
      patientId: "PAT-2023-001",
      userId: 101,
      name: "Emma Wilson",
      careType: "Home Care",
      status: "Active",
      createdAt: "2023-01-15T10:30:00Z",
    },
    {
      id: 2,
      patientId: "PAT-2023-042",
      userId: 102,
      name: "James Davis",
      careType: "Residential",
      status: "Review",
      createdAt: "2023-02-20T14:15:00Z",
    },
    {
      id: 3,
      patientId: "PAT-2023-078",
      userId: 103,
      name: "Anna Brown",
      careType: "Day Care",
      status: "Active",
      createdAt: "2023-03-05T09:45:00Z",
    },
    {
      id: 4,
      patientId: "PAT-2023-104",
      userId: 104,
      name: "Oliver Taylor",
      careType: "Home Care",
      status: "New",
      createdAt: "2023-05-18T16:20:00Z",
    },
  ];

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
  ];

  // Use real or demo data
  const displayAppointments = isDemoMode 
    ? demoAppointments.map(appt => ({
        ...appt,
        patientName: demoPatients.find(p => p.id === appt.patientId)?.name,
        staffName: demoStaff.find(s => s.id === appt.staffId)?.name,
      }))
    : appointments.map(appt => ({
        ...appt,
        patientName: patients.find(p => p.id === appt.patientId)?.name,
        staffName: staff.find(s => s.id === appt.staffId)?.name,
      }));
  
  const displayPatients = isDemoMode ? demoPatients : patients;
  const displayStaff = isDemoMode ? demoStaff : staff;

  // Filter appointments by date and status
  const filteredAppointments = displayAppointments
    .filter(appt => {
      const appointmentDate = new Date(appt.dateTime).toISOString().split("T")[0];
      return selectedDate === appointmentDate;
    })
    .filter(appt => statusFilter === "all" || appt.status === statusFilter);

  // Search appointments
  const searchedAppointments = filterBySearchQuery(
    filteredAppointments,
    searchQuery,
    ["title", "patientName", "staffName", "location"]
  );

  // Group appointments by date (for UI grouping)
  const groupedAppointments = groupAppointmentsByDate(searchedAppointments);

  // Create appointment mutation
  const createMutation = useMutation({
    mutationFn: async (newAppointment: InsertAppointment) => {
      if (isDemoMode) {
        // In demo mode, just simulate success
        return { id: Math.floor(Math.random() * 1000) };
      }
      const res = await apiRequest("POST", "/api/appointments", newAppointment);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setShowForm(false);
      setEditingAppointment(null);
    },
  });

  // Update appointment mutation
  const updateMutation = useMutation({
    mutationFn: async (appointment: Appointment) => {
      if (isDemoMode) {
        // In demo mode, just simulate success
        return appointment;
      }
      const res = await apiRequest("PUT", `/api/appointments/${appointment.id}`, appointment);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setShowForm(false);
      setEditingAppointment(null);
    },
  });

  // Cancel appointment mutation
  const cancelMutation = useMutation({
    mutationFn: async (id: number) => {
      if (isDemoMode) {
        // In demo mode, just simulate success
        return { success: true };
      }
      const res = await apiRequest("PATCH", `/api/appointments/${id}/cancel`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
  });

  // Complete appointment mutation
  const completeMutation = useMutation({
    mutationFn: async (id: number) => {
      if (isDemoMode) {
        // In demo mode, just simulate success
        return { success: true };
      }
      const res = await apiRequest("PATCH", `/api/appointments/${id}/complete`, {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    },
  });

  const handleAppointmentSubmit = async (data: InsertAppointment) => {
    if (editingAppointment) {
      await updateMutation.mutateAsync({ ...editingAppointment, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEditAppointment = (appointmentId: number) => {
    const appointment = displayAppointments.find(a => a.id === appointmentId);
    if (appointment) {
      setEditingAppointment(appointment);
      setShowForm(true);
    }
  };

  const handleCancelAppointment = (appointmentId: number) => {
    cancelMutation.mutate(appointmentId);
  };

  const handleCompleteAppointment = (appointmentId: number) => {
    completeMutation.mutate(appointmentId);
  };

  const isLoading = isLoadingAppointments || isLoadingPatients || isLoadingStaff;

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <AppointmentForm
          initialData={editingAppointment || undefined}
          onSubmit={handleAppointmentSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingAppointment(null);
          }}
          isEditing={!!editingAppointment}
          patients={displayPatients}
          staff={displayStaff}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="pb-5 border-b border-neutral-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-neutral-900 sm:text-3xl">
          Appointments
        </h2>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <Button onClick={() => setShowForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search appointments..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-neutral-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-40"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading && !isDemoMode ? (
        <div className="flex justify-center mt-8">
          <p>Loading appointments...</p>
        </div>
      ) : Object.keys(groupedAppointments).length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-neutral-500">No appointments found for the selected date</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowForm(true)}
          >
            Schedule New Appointment
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {Object.entries(groupedAppointments).map(([date, appointments]) => (
            <div key={date}>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">{date}</h3>
              <div className="space-y-4">
                {appointments.map(appointment => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onEdit={handleEditAppointment}
                    onCancel={handleCancelAppointment}
                    onComplete={handleCompleteAppointment}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
