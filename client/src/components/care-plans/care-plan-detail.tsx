import React from "react";
import { Link } from "wouter";
import { CarePlan, Patient } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FileEdit, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface CarePlanDetailProps {
  carePlan: CarePlan;
  patient: Patient;
  onEdit: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Draft":
      return "bg-blue-100 text-blue-800";
    case "Completed":
      return "bg-gray-100 text-gray-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function CarePlanDetail({
  carePlan,
  patient,
  onEdit,
}: CarePlanDetailProps) {
  const assessments = Array.isArray(carePlan.assessments) ? carePlan.assessments : [];
  const goals = Array.isArray(carePlan.goals) ? carePlan.goals : [];
  const interventions = Array.isArray(carePlan.interventions) ? carePlan.interventions : [];
  const medications = Array.isArray(carePlan.medications) ? carePlan.medications : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{carePlan.title}</h1>
          <div className="flex items-center mt-1 space-x-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                carePlan.status
              )}`}
            >
              {carePlan.status}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-500">
              Started: {formatDate(carePlan.startDate)}
            </span>
            {carePlan.endDate && (
              <>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-500">
                  Ends: {formatDate(carePlan.endDate)}
                </span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link href={`/appointments/new?patientId=${patient.id}`}>
            <Button variant="outline" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Follow-up
            </Button>
          </Link>
          <Button onClick={onEdit} className="flex items-center">
            <FileEdit className="h-4 w-4 mr-2" />
            Edit Care Plan
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
        <div className="flex items-center">
          <PatientAvatar name={patient.name} className="h-10 w-10" />
          <div className="ml-3">
            <Link href={`/patients/${patient.id}`}>
              <a className="text-lg font-medium text-primary-600 hover:text-primary-800">
                {patient.name}
              </a>
            </Link>
            <p className="text-sm text-neutral-500">ID: {patient.patientId}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
        <p className="text-neutral-700 whitespace-pre-line">{carePlan.description}</p>
        {carePlan.reviewSchedule && (
          <div className="mt-4 text-sm text-neutral-500">
            Review schedule: {carePlan.reviewSchedule}
          </div>
        )}
      </div>

      <Tabs defaultValue="goals">
        <TabsList className="w-full">
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="interventions">Interventions</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="pt-4">
          {goals.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center text-neutral-500">
                No goals have been defined for this care plan.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700">{goal.description}</p>
                    {goal.targetDate && (
                      <p className="mt-2 text-sm text-neutral-500">
                        Target date: {formatDate(goal.targetDate)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="assessments" className="pt-4">
          {assessments.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center text-neutral-500">
                No assessments have been recorded for this care plan.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {assessments.map((assessment, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{assessment.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700">{assessment.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="interventions" className="pt-4">
          {interventions.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center text-neutral-500">
                No interventions have been planned for this care plan.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {interventions.map((intervention, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{intervention.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-700">{intervention.description}</p>
                    {intervention.frequency && (
                      <p className="mt-2 text-sm text-neutral-500">
                        Frequency: {intervention.frequency}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="medications" className="pt-4">
          {medications.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center text-neutral-500">
                No medications have been prescribed in this care plan.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {medications.map((medication, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{medication.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Dosage</p>
                        <p className="text-neutral-700">{medication.dosage}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-500">Frequency</p>
                        <p className="text-neutral-700">{medication.frequency}</p>
                      </div>
                      {medication.instructions && (
                        <div className="col-span-2">
                          <p className="text-sm font-medium text-neutral-500">Instructions</p>
                          <p className="text-neutral-700">{medication.instructions}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
