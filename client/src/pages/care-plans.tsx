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
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Search, Clock, CalendarRange, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/auth-context";
import { CarePlan, InsertCarePlan, Patient } from "@shared/schema";
import { filterBySearchQuery, formatDate } from "@/lib/utils";
import { Link } from "wouter";
import { CarePlanForm } from "@/components/care-plans/care-plan-form";
import { PatientAvatar } from "@/components/ui/avatar";

export default function CarePlans() {
  const { isDemoMode } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingCarePlan, setEditingCarePlan] = useState<CarePlan | null>(null);

  // Fetch care plans
  const { data: carePlans = [], isLoading: isLoadingCarePlans } = useQuery({
    queryKey: ["/api/care-plans"],
    enabled: !isDemoMode,
  });

  // Fetch patients for care plan form
  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({
    queryKey: ["/api/patients"],
    enabled: !isDemoMode,
  });

  // Demo data
  const demoCarePlans: CarePlan[] = [
    {
      id: 1,
      patientId: 1,
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
    {
      id: 2,
      patientId: 2,
      title: "Medication Management Plan",
      description: "Focused plan for managing multiple medications and monitoring side effects.",
      startDate: "2023-05-15T00:00:00Z",
      endDate: null,
      status: "Active",
      assessments: [
        { title: "Medication Review", description: "Comprehensive review of all current medications, dosages, and interactions." }
      ],
      goals: [
        { title: "Medication Adherence", description: "Consistently take medications as prescribed", targetDate: "2023-08-15" }
      ],
      interventions: [
        { title: "Medication Organizer", description: "Use weekly pill organizer with reminders", frequency: "Weekly setup" }
      ],
      medications: [
        { name: "Metformin", dosage: "500mg", frequency: "Twice daily", instructions: "Take with meals" },
        { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", instructions: "Take in the morning" }
      ],
      reviewSchedule: "Every 2 months",
      createdBy: 2,
      lastUpdatedBy: 2,
      createdAt: "2023-05-15T14:30:00Z",
      updatedAt: "2023-05-15T14:30:00Z",
    },
    {
      id: 3,
      patientId: 3,
      title: "Cognitive Support Plan",
      description: "Plan focused on maintaining cognitive function and providing appropriate support.",
      startDate: "2023-04-20T00:00:00Z",
      endDate: "2024-04-19T23:59:59Z",
      status: "Active",
      assessments: [
        { title: "Cognitive Assessment", description: "Evaluation of cognitive abilities using standardized tools." }
      ],
      goals: [
        { title: "Maintain Independence", description: "Continue to perform daily activities with minimal assistance", targetDate: "2023-10-20" }
      ],
      interventions: [
        { title: "Cognitive Stimulation", description: "Structured activities to engage mind and memory", frequency: "Daily" },
        { title: "Social Interaction", description: "Regular social activities to prevent isolation", frequency: "Three times weekly" }
      ],
      medications: [],
      reviewSchedule: "Every 3 months",
      createdBy: 1,
      lastUpdatedBy: 3,
      createdAt: "2023-04-20T09:15:00Z",
      updatedAt: "2023-05-05T11:30:00Z",
    },
    {
      id: 4,
      patientId: 4,
      title: "Rehabilitation Plan",
      description: "Structured plan for recovery and rehabilitation following sports injury.",
      startDate: "2023-05-25T00:00:00Z",
      endDate: "2023-08-24T23:59:59Z",
      status: "Active",
      assessments: [
        { title: "Physical Assessment", description: "Evaluation of current mobility, strength, and pain levels." }
      ],
      goals: [
        { title: "Pain Reduction", description: "Reduce pain to 2/10 or less on pain scale", targetDate: "2023-07-15" },
        { title: "Return to Sport", description: "Resume regular sporting activities", targetDate: "2023-08-20" }
      ],
      interventions: [
        { title: "Physiotherapy", description: "Specialized exercises for injury rehabilitation", frequency: "Three times weekly" },
        { title: "Hydrotherapy", description: "Water-based exercises to reduce strain", frequency: "Once weekly" }
      ],
      medications: [
        { name: "Ibuprofen", dosage: "400mg", frequency: "As needed for pain", instructions: "Take with food, max 3 times daily" }
      ],
      reviewSchedule: "Every 3 weeks",
      createdBy: 4,
      lastUpdatedBy: 4,
      createdAt: "2023-05-25T16:45:00Z",
      updatedAt: "2023-05-25T16:45:00Z",
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

  // Use real or demo data
  const displayCarePlans = isDemoMode 
    ? demoCarePlans.map(plan => ({
        ...plan,
        patientName: demoPatients.find(p => p.id === plan.patientId)?.name,
      }))
    : carePlans.map(plan => ({
        ...plan,
        patientName: patients.find(p => p.id === plan.patientId)?.name,
      }));
  
  const displayPatients = isDemoMode ? demoPatients : patients;

  // Filter care plans by status
  const filteredCarePlans = displayCarePlans
    .filter(plan => statusFilter === "all" || plan.status === statusFilter);

  // Search care plans
  const searchedCarePlans = filterBySearchQuery(
    filteredCarePlans,
    searchQuery,
    ["title", "description", "patientName"]
  );

  // Create care plan mutation
  const createMutation = useMutation({
    mutationFn: async (newCarePlan: InsertCarePlan) => {
      if (isDemoMode) {
        // In demo mode, just simulate success
        return { id: Math.floor(Math.random() * 1000) };
      }
      const res = await apiRequest("POST", "/api/care-plans", newCarePlan);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/care-plans"] });
      setShowForm(false);
      setEditingCarePlan(null);
    },
  });

  // Update care plan mutation
  const updateMutation = useMutation({
    mutationFn: async (carePlan: CarePlan) => {
      if (isDemoMode) {
        // In demo mode, just simulate success
        return carePlan;
      }
      const res = await apiRequest("PUT", `/api/care-plans/${carePlan.id}`, carePlan);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/care-plans"] });
      setShowForm(false);
      setEditingCarePlan(null);
    },
  });

  const handleCarePlanSubmit = async (data: InsertCarePlan) => {
    if (editingCarePlan) {
      await updateMutation.mutateAsync({ ...editingCarePlan, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEditCarePlan = (carePlanId: number) => {
    const carePlan = displayCarePlans.find(p => p.id === carePlanId);
    if (carePlan) {
      setEditingCarePlan(carePlan);
      setShowForm(true);
    }
  };

  const isLoading = isLoadingCarePlans || isLoadingPatients;

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto">
        <CarePlanForm
          initialData={editingCarePlan || undefined}
          onSubmit={handleCarePlanSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingCarePlan(null);
          }}
          isEditing={!!editingCarePlan}
          patients={displayPatients}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="pb-5 border-b border-neutral-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-neutral-900 sm:text-3xl">
          Care Plans
        </h2>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <Button onClick={() => setShowForm(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Care Plan
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search care plans..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
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
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading && !isDemoMode ? (
        <div className="flex justify-center mt-8">
          <p>Loading care plans...</p>
        </div>
      ) : searchedCarePlans.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-neutral-500">No care plans found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowForm(true)}
          >
            Create New Care Plan
          </Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {searchedCarePlans.map(carePlan => (
            <Card key={carePlan.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center mb-4">
                  <PatientAvatar
                    name={carePlan.patientName || "Unknown Patient"}
                    className="h-10 w-10"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium">
                      {carePlan.patientName || "Unknown Patient"}
                    </p>
                    <Link href={`/patients/${carePlan.patientId}`}>
                      <a className="text-xs text-primary-600 hover:text-primary-800">
                        View Patient
                      </a>
                    </Link>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2">{carePlan.title}</h3>
                <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                  {carePlan.description}
                </p>

                <div className="grid grid-cols-1 gap-2 mb-4">
                  <div className="flex items-center text-sm">
                    <CalendarRange className="h-4 w-4 mr-2 text-neutral-400" />
                    <span className="text-neutral-600">
                      {formatDate(carePlan.startDate)}
                      {carePlan.endDate ? ` - ${formatDate(carePlan.endDate)}` : " (Ongoing)"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-neutral-400" />
                    <span className="text-neutral-600">
                      Review: {carePlan.reviewSchedule || "Not specified"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${carePlan.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        carePlan.status === 'Draft' ? 'bg-blue-100 text-blue-800' :
                        carePlan.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'}`}>
                      {carePlan.status}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditCarePlan(carePlan.id)}
                    >
                      Edit
                    </Button>
                    <Link href={`/care-plans/${carePlan.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
