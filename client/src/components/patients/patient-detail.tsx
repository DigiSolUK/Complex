import React from "react";
import { Link } from "wouter";
import { Patient, Appointment, CarePlan } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, ClipboardList, FileEdit } from "lucide-react";
import { calculateAge } from "@/lib/utils";
import { AppointmentCard } from "@/components/appointments/appointment-card";

interface PatientDetailProps {
  patient: Patient;
  appointments: Appointment[];
  carePlans: CarePlan[];
  onEdit: () => void;
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

export function PatientDetail({
  patient,
  appointments,
  carePlans,
  onEdit,
}: PatientDetailProps) {
  const age = patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : "N/A";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <PatientAvatar name={patient.name} className="h-16 w-16" />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-neutral-900">{patient.name}</h1>
            <div className="flex items-center mt-1 space-x-2">
              <p className="text-sm text-neutral-500">ID: {patient.patientId}</p>
              <span className="text-neutral-300">•</span>
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
        <div className="flex space-x-3">
          <Link href={`/appointments/new?patientId=${patient.id}`}>
            <Button variant="outline" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </Link>
          <Link href={`/care-plans/new?patientId=${patient.id}`}>
            <Button variant="outline" className="flex items-center">
              <ClipboardList className="h-4 w-4 mr-2" />
              Create Care Plan
            </Button>
          </Link>
          <Button onClick={onEdit} className="flex items-center">
            <FileEdit className="h-4 w-4 mr-2" />
            Edit Patient
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="border-b border-neutral-200 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="careplans">Care Plans</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-neutral-500">Age</dt>
                    <dd className="mt-1 text-sm text-neutral-900">{age}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-neutral-500">Gender</dt>
                    <dd className="mt-1 text-sm text-neutral-900">
                      {patient.gender || "Not specified"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-neutral-500">Care Type</dt>
                    <dd className="mt-1 text-sm text-neutral-900">{patient.careType}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-neutral-500">Email</dt>
                    <dd className="mt-1 text-sm text-neutral-900">{patient.email || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-neutral-500">Phone</dt>
                    <dd className="mt-1 text-sm text-neutral-900">{patient.phone || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-neutral-500">
                      Emergency Contact
                    </dt>
                    <dd className="mt-1 text-sm text-neutral-900">
                      {patient.emergencyContact || "Not provided"}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-neutral-500">Address</dt>
                    <dd className="mt-1 text-sm text-neutral-900 whitespace-pre-line">
                      {patient.address || "Not provided"}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {appointments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Appointment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <AppointmentCard appointment={appointments[0]} minimal />
                  </CardContent>
                </Card>
              )}

              {carePlans.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Active Care Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{carePlans[0].title}</h4>
                        <p className="text-sm text-neutral-500">
                          Started: {new Date(carePlans[0].startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Link href={`/care-plans/${carePlans[0].id}`}>
                        <Button variant="outline" size="sm">
                          View Plan
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-700 whitespace-pre-line">
                    {patient.notes || "No notes available."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="pt-4">
          {appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-neutral-500">No appointments found.</p>
              <Link href={`/appointments/new?patientId=${patient.id}`}>
                <Button variant="outline" className="mt-4">
                  Schedule New Appointment
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="careplans" className="pt-4">
          {carePlans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-neutral-500">No care plans found.</p>
              <Link href={`/care-plans/new?patientId=${patient.id}`}>
                <Button variant="outline" className="mt-4">
                  Create New Care Plan
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {carePlans.map((plan) => (
                <Card key={plan.id}>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-medium text-neutral-900">{plan.title}</h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      {plan.description?.slice(0, 120)}
                      {plan.description && plan.description.length > 120 ? "..." : ""}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            plan.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : plan.status === "Draft"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {plan.status}
                        </span>
                      </div>
                      <Link href={`/care-plans/${plan.id}`}>
                        <Button variant="outline" size="sm">
                          View Plan
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-700 whitespace-pre-line">
                {patient.medicalHistory || "No medical history recorded."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
