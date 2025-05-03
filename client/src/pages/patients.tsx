import React, { useState } from "react";
import { Link } from "wouter";
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
import { Patient, InsertPatient } from "@shared/schema";
import { PatientCard } from "@/components/patients/patient-card";
import { PatientForm } from "@/components/patients/patient-form";
import { PlusCircle, Search } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/auth-context";
import { filterBySearchQuery } from "@/lib/utils";

export default function Patients() {
  const { isDemoMode } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [careTypeFilter, setCareTypeFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Fetch patients
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["/api/patients"],
    enabled: !isDemoMode,
  });

  // Demo data
  const demoPatients: Patient[] = [
    {
      id: 1,
      patientId: "PAT-2023-001",
      userId: 101,
      name: "Emma Wilson",
      dateOfBirth: "1981-05-12",
      gender: "Female",
      address: "123 Main St, Anytown, UK",
      phone: "07700 900123",
      email: "emma.wilson@example.com",
      emergencyContact: "John Wilson (Husband) - 07700 900124",
      careType: "Home Care",
      status: "Active",
      notes: "Regular check-ups every 3 months. Prefers morning appointments.",
      medicalHistory: "History of hypertension. On medication since 2018.",
      createdAt: "2023-01-15T10:30:00Z",
    },
    {
      id: 2,
      patientId: "PAT-2023-042",
      userId: 102,
      name: "James Davis",
      dateOfBirth: "1956-11-28",
      gender: "Male",
      address: "45 Oak Avenue, Othertown, UK",
      phone: "07700 900125",
      email: "james.davis@example.com",
      emergencyContact: "Mary Davis (Daughter) - 07700 900126",
      careType: "Residential",
      status: "Review",
      notes: "Needs assistance with daily activities. Weekly physiotherapy.",
      medicalHistory: "Type 2 diabetes, diagnosed in 2015. Hip replacement in 2020.",
      createdAt: "2023-02-20T14:15:00Z",
    },
    {
      id: 3,
      patientId: "PAT-2023-078",
      userId: 103,
      name: "Anna Brown",
      dateOfBirth: "1969-07-03",
      gender: "Female",
      address: "8 Pine Lane, Sometown, UK",
      phone: "07700 900127",
      email: "anna.brown@example.com",
      emergencyContact: "Robert Brown (Son) - 07700 900128",
      careType: "Day Care",
      status: "Active",
      notes: "Attends day care center three times a week. Enjoys group activities.",
      medicalHistory: "Mild cognitive impairment. Heart condition monitored regularly.",
      createdAt: "2023-03-05T09:45:00Z",
    },
    {
      id: 4,
      patientId: "PAT-2023-104",
      userId: 104,
      name: "Oliver Taylor",
      dateOfBirth: "1992-09-17",
      gender: "Male",
      address: "22 Elm Street, Newtown, UK",
      phone: "07700 900129",
      email: "oliver.taylor@example.com",
      emergencyContact: "Sarah Taylor (Sister) - 07700 900130",
      careType: "Home Care",
      status: "New",
      notes: "Recently enrolled in home care program. Initial assessment completed.",
      medicalHistory: "Recovering from sports injury. Physical therapy in progress.",
      createdAt: "2023-05-18T16:20:00Z",
    },
  ];

  // Use real or demo data
  const displayPatients = isDemoMode ? demoPatients : patients;

  // Filter patients
  const filteredPatients = displayPatients
    .filter(patient => statusFilter === "all" || patient.status === statusFilter)
    .filter(patient => careTypeFilter === "all" || patient.careType === careTypeFilter);

  // Search patients
  const searchedPatients = filterBySearchQuery(
    filteredPatients,
    searchQuery,
    ["name", "patientId", "email", "phone"]
  );

  // Create patient mutation
  const createMutation = useMutation({
    mutationFn: async (newPatient: InsertPatient) => {
      if (isDemoMode) {
        // In demo mode, just simulate success
        return { id: Math.floor(Math.random() * 1000) };
      }
      const res = await apiRequest("POST", "/api/patients", newPatient);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      setShowForm(false);
      setEditingPatient(null);
    },
  });

  // Update patient mutation
  const updateMutation = useMutation({
    mutationFn: async (patient: Patient) => {
      if (isDemoMode) {
        // In demo mode, just simulate success
        return patient;
      }
      const res = await apiRequest("PUT", `/api/patients/${patient.id}`, patient);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
      setShowForm(false);
      setEditingPatient(null);
    },
  });

  const handlePatientSubmit = async (data: InsertPatient) => {
    if (editingPatient) {
      await updateMutation.mutateAsync({ ...editingPatient, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEditPatient = (patientId: number) => {
    const patient = displayPatients.find(p => p.id === patientId);
    if (patient) {
      setEditingPatient(patient);
      setShowForm(true);
    }
  };

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <PatientForm
          initialData={editingPatient || undefined}
          onSubmit={handlePatientSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPatient(null);
          }}
          isEditing={!!editingPatient}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="pb-5 border-b border-neutral-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-neutral-900 sm:text-3xl">
          Patients
        </h2>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <Button onClick={() => setShowForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search patients..."
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
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="New">New</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={careTypeFilter}
              onValueChange={setCareTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Care Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Care Types</SelectItem>
                <SelectItem value="Home Care">Home Care</SelectItem>
                <SelectItem value="Day Care">Day Care</SelectItem>
                <SelectItem value="Residential">Residential</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading && !isDemoMode ? (
        <div className="flex justify-center mt-8">
          <p>Loading patients...</p>
        </div>
      ) : searchedPatients.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-neutral-500">No patients found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowForm(true)}
          >
            Add New Patient
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {searchedPatients.map(patient => (
            <PatientCard
              key={patient.id}
              patient={{
                ...patient,
                age: patient.dateOfBirth
                  ? new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                  : undefined,
                nextAppointment: null, // In a real app, we'd fetch this
              }}
              onEdit={handleEditPatient}
            />
          ))}
        </div>
      )}
    </div>
  );
}
