import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CarePlanDetail } from "@/components/care-plans/care-plan-detail";
import { CarePlanForm } from "@/components/care-plans/care-plan-form";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/auth-context";
import { CarePlan, Patient, InsertCarePlan } from "@shared/schema";

export default function CarePlanDetailPage({ params }: { params: { id: string } }) {
  const carePlanId = parseInt(params.id);
  const { isDemoMode } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch care plan data
  const { data: carePlan, isLoading: isLoadingCarePlan } = useQuery({
    queryKey: [`/api/care-plans/${carePlanId}`],
    enabled: !isDemoMode && !isNaN(carePlanId),
  });

  // Fetch patient data
  const { data: patient, isLoading: isLoadingPatient } = useQuery({
    queryKey: [`/api/patients/${carePlan?.patientId}`],
    enabled: !isDemoMode && !!carePlan?.patientId,
  });

  // Fetch all patients for the form
  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({
    queryKey: ["/api/patients"],
    enabled: !isDemoMode && isEditing,
  });

  // Demo data
  const demoCarePlan: CarePlan = {
    id: carePlanId,
    patientId: 1,
    title: "Comprehensive Care Plan",
    description: "Holistic care plan addressing all current health needs and preventive measures.",
    startDate: "2023-06-01T00:00:00Z",
    endDate: "2023-12-31T23:59:59Z",
    status: "Active",
    assessments: [
      { title: "Initial Health Assessment", description: "Complete health evaluation including physical and cognitive assessment." },
      { title: "Nutritional Assessment", description: "Evaluation of dietary needs and current nutritional status." },
      { title: "Functional Assessment", description: "Evaluation of ability to perform activities of daily living." }
    ],
    goals: [
      { title: "Improved Mobility", description: "Increase walking distance to 500m without assistance", targetDate: "2023-09-30" },
      { title: "Medication Management", description: "Independent management of medication schedule", targetDate: "2023-10-15" },
      { title: "Weight Management", description: "Maintain healthy weight between 65-70kg", targetDate: "2023-11-30" }
    ],
    interventions: [
      { title: "Physical Therapy", description: "Twice weekly sessions focusing on lower body strength", frequency: "Twice weekly" },
      { title: "Medication Review", description: "Monthly review of all medications and their effects", frequency: "Monthly" },
      { title: "Nutritional Counseling", description: "Development of balanced meal plans", frequency: "Every 6 weeks" }
    ],
    medications: [
      { name: "Paracetamol", dosage: "500mg", frequency: "As needed for pain", instructions: "Take with food" },
      { name: "Vitamin D", dosage: "1000 IU", frequency: "Daily", instructions: "Take with breakfast" },
      { name: "Calcium", dosage: "500mg", frequency: "Twice daily", instructions: "Take with meals" }
    ],
    reviewSchedule: "Monthly",
    createdBy: 1,
    lastUpdatedBy: 1,
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2023-06-01T10:00:00Z",
  };

  const demoPatient: Patient = {
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
  };

  const demoPatients: Patient[] = [
    demoPatient,
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
  ];

  // Use demo data or actual data
  const displayCarePlan = isDemoMode ? demoCarePlan : carePlan;
  const displayPatient = isDemoMode ? demoPatient : patient;
  const displayPatients = isDemoMode ? demoPatients : patients;

  // Update care plan mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedCarePlan: InsertCarePlan) => {
      if (isDemoMode) {
        // In demo mode, just simulate success
        return { ...demoCarePlan, ...updatedCarePlan };
      }
      const res = await apiRequest("PUT", `/api/care-plans/${carePlanId}`, updatedCarePlan);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/care-plans/${carePlanId}`] });
      setIsEditing(false);
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCarePlanSubmit = async (data: InsertCarePlan) => {
    await updateMutation.mutateAsync(data);
  };

  const isLoading = isLoadingCarePlan || isLoadingPatient || (isEditing && isLoadingPatients);

  if (isLoading && !isDemoMode) {
    return (
      <div className="flex justify-center mt-8">
        <p>Loading care plan information...</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto">
        <CarePlanForm
          initialData={displayCarePlan}
          onSubmit={handleCarePlanSubmit}
          onCancel={() => setIsEditing(false)}
          isEditing={true}
          patients={displayPatients}
        />
      </div>
    );
  }

  if (!displayCarePlan || !displayPatient) {
    return (
      <div className="text-center mt-8">
        <p className="text-neutral-500">Care plan not found</p>
      </div>
    );
  }

  return (
    <CarePlanDetail
      carePlan={displayCarePlan}
      patient={displayPatient}
      onEdit={handleEdit}
    />
  );
}
