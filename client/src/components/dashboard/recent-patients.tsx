import React from "react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PatientAvatar } from "@/components/ui/avatar";

export type PatientOverview = {
  id: number;
  patientId: string;
  name: string;
  age: number;
  careType: string;
  nextAppointment: string | null;
  status: "Active" | "Inactive" | "Review" | "New";
};

const getStatusColor = (status: PatientOverview["status"]) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Inactive":
      return "bg-red-100 text-red-800";
    case "Review":
      return "bg-yellow-100 text-yellow-800";
    case "New":
      return "bg-blue-100 text-blue-800";
  }
};

export function RecentPatients({
  patients = [],
}: {
  patients: PatientOverview[];
}) {
  return (
    <div>
      <h3 className="text-lg leading-6 font-medium text-neutral-900 mb-4">
        Recent Patients
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {patients.map((patient) => (
          <Card key={patient.id} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PatientAvatar name={patient.name} className="h-12 w-12" />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-neutral-900">
                    {patient.name}
                  </h4>
                  <p className="text-sm text-neutral-500">
                    ID: {patient.patientId}
                  </p>
                </div>
              </div>
              <div className="mt-4 border-t border-neutral-200 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Age</p>
                    <p className="mt-1 text-sm text-neutral-900">
                      {patient.age}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-500">
                      Care Type
                    </p>
                    <p className="mt-1 text-sm text-neutral-900">
                      {patient.careType}
                    </p>
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
                    <p className="text-sm font-medium text-neutral-500">
                      Status
                    </p>
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
        ))}
      </div>
      <div className="mt-4 text-center">
        <Link href="/patients">
          <Button variant="outline">View all patients</Button>
        </Link>
      </div>
    </div>
  );
}
