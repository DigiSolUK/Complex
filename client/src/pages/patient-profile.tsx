import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PatientDetail } from "@/components/patients/patient-detail";
import { PatientForm } from "@/components/patients/patient-form";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/auth-context";
import { Patient, Appointment, CarePlan, InsertPatient } from "@shared/schema";

export default function PatientProfile({ params }: { params: { id: string } }) {
  const patientId = parseInt(params.id);
  const { isDemoMode } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch patient data
  const { data: patient, isLoading: isLoadingPatient } = useQuery({
    queryKey: [`/api/patients/${patientId}`],
    enabled: !isDemoMode && !isNaN(patientId),
  });

  // Fetch patient appointments
  const { data: appointments = [], isLoading: isLoadingAppointments } = useQuery({
    queryKey: [`/api/patients/${patientId}/appointments`],
    enabled: !isDemoMode && !isNaN(patientId),
  });

  // Fetch patient care plans
  const { data: carePlans = [], isLoading: isLoadingCarePlans } = useQuery({
    queryKey: [`/api/patients/${patientId}/care-plans`],
    enabled: !isDemoMode && !isNaN(patientId),
  });

  // Demo data
  const demoPatient: Patient = {
    id: patientId,
    patientId: `PAT-2023-${String(patientId).padStart(3, '0')}`,
    userId: 100 + patientId,
    name: ["Emma Wilson", "James Davis", "Anna Brown", "Oliver Taylor"][patientId % 4],
    dateOfBirth: ["1981-05-12", "1956-11-28", "1969-07-03", "1992-09-17"][patientId % 4],
    gender: ["Female", "Male", "Female", "Male"][patientId % 4],
    address: [
      "123 Main St, Anytown, UK",
      "45 Oak Avenue, Othertown, UK",
      "8 Pine Lane, Sometown, UK",
      "22 Elm Street, Newtown, UK"
    ][patientId % 4],
    phone: `07700 9001${patientId.toString().padStart(2, '0')}`,
    email: ["emma.wilson@example.com", "james.davis@example.com", "anna.brown@example.com", "oliver.taylor@example.com"][patientId % 4],
    emergencyContact: [
      "John Wilson (Husband) - 07700 900124",
      "Mary Davis (Daughter) - 07700 900126",
      "Robert Brown (Son) - 07700 900128",
      "Sarah Taylor (Sister) - 07700 900130"
    ][patientId % 4],
    careType: ["Home Care", "Residential", "Day Care", "Home Care"][patientId % 4],
    status: ["Active", "Review", "Active", "New"][patientId % 4],
    notes: [
      "Regular check-ups every 3 months. Prefers morning appointments.",
      "Needs assistance with daily activities. Weekly physiotherapy.",
      "Attends day care center three times a week. Enjoys group activities.",
      "Recently enrolled in home care program. Initial assessment completed."
    ][patientId % 4],
    medicalHistory: [
      "History of hypertension. On medication since 2018.",
      "Type 2 diabetes, diagnosed in 2015. Hip replacement in 2020.",
      "Mild cognitive impairment. Heart condition monitored regularly.",
      "Recovering from sports injury. Physical therapy in progress."
    ][patientId % 4],
    createdAt: "2023-01-15T10:30:00Z",
  };

  const demoAppointments: Appointment[] = [
    {
      id: 101,
      patientId,
      staffId: 1,
      title: "Annual check-up",
      description: "Routine annual health assessment",
      dateTime: "2023-07-15T09:00:00Z",
      duration: 60,
      status: "Scheduled",
      location: "Main Clinic, Room 3",
      notes: "Patient should bring medication list and recent test results.",
      createdAt: "2023-06-20T14:30:00Z",
    },
    {
      id: 102,
      patientId,
      staffId: 2,
      title: "Follow-up consultation",
      description: "Follow-up for medication review",
      dateTime: "2023-08-05T14:15:00Z",
      duration: 30,
      status: "Confirmed",
      location: "East Wing, Room 12",
      notes: "",
      createdAt: "2023-07-01T11:45:00Z",
    },
  ];

  const demoCarePlans: CarePlan[] = [
    {
      id: 201,
      patientId,
      title: "Comprehensive Care Plan",
      description: "Holistic care plan addressing all current health needs and preventive measures.",
      startDate: "2023-06-01T00:00:00Z",
      endDate: "2023-12-31T23:59:59Z",
      status: "Active",
      assessments: [
        { title: "Initial Health Assessment", description: "Complete health evaluation including physical and cognitive assessment." }
      ],
      goals: [
        { title: "Improved Mobility", description: "Increase walking distance to 500m without assistance", targetDate: "2023-09-30" }
      ],
      interventions: [
        { title: "Physical Therapy", description: "Twice weekly sessions focusing on lower body strength", frequency: "Twice weekly" }
      ],
      medications: [
        { name: "Paracetamol", dosage: "500mg", frequency: "As needed for pain", instructions: "Take with food" }
      ],
      reviewSchedule: "Monthly",
      createdBy: 1,
      lastUpdatedBy: 1,
      createdAt: "2023-06-01T10:00:00Z",
      updatedAt: "2023-06-01T10:00:00Z",
    },
  ];

  // Update patient mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedPatient: InsertPatient) => {
      if (isDemoMode) {
        // In demo mode, just simulate success
        return { ...demoPatient, ...updatedPatient };
      }
      const res = await apiRequest("PUT", `/api/patients/${patientId}`, updatedPatient);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patientId}`] });
      setIsEditing(false);
    },
  });

  // Use demo data or actual data
  const displayPatient = isDemoMode ? demoPatient : patient;
  const displayAppointments = isDemoMode ? demoAppointments : appointments;
  const displayCarePlans = isDemoMode ? demoCarePlans : carePlans;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handlePatientSubmit = async (data: InsertPatient) => {
    await updateMutation.mutateAsync(data);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-8">
        <p>Loading patient information...</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto">
        <PatientForm
          initialData={displayPatient}
          onSubmit={handlePatientSubmit}
          onCancel={() => setIsEditing(false)}
          isEditing={true}
        />
      </div>
    );
  }

  if (!displayPatient) {
    return (
      <div className="text-center mt-8">
        <p className="text-neutral-500">Patient not found</p>
      </div>
    );
  }

  return (
    <PatientDetail
      patient={displayPatient}
      appointments={displayAppointments}
      carePlans={displayCarePlans}
      onEdit={handleEdit}
    />
  );
}
