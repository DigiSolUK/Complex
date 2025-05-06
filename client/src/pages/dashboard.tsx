import React, { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageCircle, BarChart2, Layers } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DashboardCards } from "@/components/dashboard/dashboard-cards";
import { RecentActivity, ActivityItem } from "@/components/dashboard/recent-activity";
import { TodayAppointments, AppointmentItem } from "@/components/dashboard/today-appointments";
import { RecentPatients, PatientOverview } from "@/components/dashboard/recent-patients";
import { useAuth } from "@/context/auth-context";

export default function Dashboard() {
  const { isDemoMode } = useAuth();
  
  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard"],
    enabled: !isDemoMode,
  });

  // Use demo data when in demo mode
  const demoData = {
    metrics: {
      totalPatients: 124,
      activePlans: 87,
      todayAppointments: 12,
      staffOnDuty: 8,
    },
    activities: [
      {
        id: "act1",
        type: "care_plan_update",
        patientName: "Emma Wilson",
        patientId: 1,
        performedBy: "Dr. Mark Thompson",
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      {
        id: "act2",
        type: "appointment_scheduled",
        patientName: "James Davis",
        patientId: 2,
        performedBy: "Nurse Lisa Chen",
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      },
      {
        id: "act3",
        type: "new_patient",
        patientName: "Oliver Taylor",
        patientId: 4,
        performedBy: "Receptionist Sarah Johnson",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "act4",
        type: "notes_added",
        patientName: "Anna Brown",
        patientId: 3,
        performedBy: "Dr. James Wilson",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "act5",
        type: "appointment_cancelled",
        patientName: "Michael Johnson",
        patientId: 5,
        performedBy: "Patient requested",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ] as ActivityItem[],
    appointments: [
      {
        id: 1,
        time: "9:00",
        patientName: "Emma Wilson",
        patientId: 1,
        purpose: "Annual check-up",
        status: "Confirmed" as const,
      },
      {
        id: 2,
        time: "10:30",
        patientName: "James Davis",
        patientId: 2,
        purpose: "Medication review",
        status: "Pending" as const,
      },
      {
        id: 3,
        time: "11:45",
        patientName: "Anna Brown",
        patientId: 3,
        purpose: "Follow-up consultation",
        status: "Confirmed" as const,
      },
      {
        id: 4,
        time: "14:15",
        patientName: "Oliver Taylor",
        patientId: 4,
        purpose: "Initial assessment",
        status: "Confirmed" as const,
      },
      {
        id: 5,
        time: "16:00",
        patientName: "Sophie Anderson",
        patientId: 6,
        purpose: "Therapy session",
        status: "Confirmed" as const,
      },
    ] as AppointmentItem[],
    patients: [
      {
        id: 1,
        patientId: "PAT-2023-001",
        name: "Emma Wilson",
        age: 42,
        careType: "Home Care",
        nextAppointment: "Today, 9:00 AM",
        status: "Active" as const,
      },
      {
        id: 2,
        patientId: "PAT-2023-042",
        name: "James Davis",
        age: 67,
        careType: "Residential",
        nextAppointment: "Today, 10:30 AM",
        status: "Review" as const,
      },
      {
        id: 3,
        patientId: "PAT-2023-078",
        name: "Anna Brown",
        age: 54,
        careType: "Day Care",
        nextAppointment: "Today, 11:45 AM",
        status: "Active" as const,
      },
      {
        id: 4,
        patientId: "PAT-2023-104",
        name: "Oliver Taylor",
        age: 31,
        careType: "Home Care",
        nextAppointment: "Today, 2:15 PM",
        status: "New" as const,
      },
    ] as PatientOverview[],
  };

  // Use either real or demo data depending on authentication state
  const metrics = isDemoMode
    ? demoData.metrics
    : dashboardData?.metrics;
  
  const activities = isDemoMode
    ? demoData.activities
    : dashboardData?.activities || [];
  
  const appointments = isDemoMode
    ? demoData.appointments
    : dashboardData?.appointments || [];
  
  const patients = isDemoMode
    ? demoData.patients
    : dashboardData?.patients || [];

  if (isLoading && !isDemoMode) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="pb-5 border-b border-neutral-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-neutral-900 sm:text-3xl">
          Dashboard
        </h2>
        <div className="mt-3 flex sm:mt-0 sm:ml-4">
          <Link href="/patients/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Patient
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard metrics */}
      <div className="mt-6">
        <DashboardCards
          totalPatients={metrics?.totalPatients}
          activePlans={metrics?.activePlans}
          todayAppointments={metrics?.todayAppointments}
          staffOnDuty={metrics?.staffOnDuty}
        />
      </div>

      {/* AI Features Highlight */}
      <div className="mt-8">
        <div className="rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border border-primary/20">
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI-Powered Healthcare Features
          </h2>
          <p className="mb-4 text-muted-foreground">ComplexCare CRM integrates advanced AI capabilities to enhance patient care and streamline operations.</p>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Link href="/patient-support">
              <div className="p-4 rounded-md border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                <h3 className="font-medium mb-2 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                  Patient Support Chatbot
                </h3>
                <p className="text-sm text-muted-foreground">Provide compassionate, 24/7 support for patients via our AI-powered chatbot.</p>
              </div>
            </Link>

            <Link href="/analytics-dashboard">
              <div className="p-4 rounded-md border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                <h3 className="font-medium mb-2 flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-primary" />
                  AI Analytics & Insights
                </h3>
                <p className="text-sm text-muted-foreground">Leverage AI to analyze patient trends and generate actionable healthcare insights.</p>
              </div>
            </Link>

            <Link href="/compliance-dashboard">
              <div className="p-4 rounded-md border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                <h3 className="font-medium mb-2 flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-primary" />
                  Compliance Analytics
                </h3>
                <p className="text-sm text-muted-foreground">AI-powered compliance monitoring and risk assessment for healthcare regulations.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent activity and upcoming appointments split view */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentActivity activities={activities} />
        <TodayAppointments appointments={appointments} />
      </div>

      {/* Patient overview section */}
      <div className="mt-8">
        <RecentPatients patients={patients} />
      </div>
    </div>
  );
}
