import React, { useState } from "react";
import { Link } from "wouter";
import { Patient, Appointment, CarePlan, CarePlanTemplate, MedicationAdministrationRecord, PatientMedication } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, ClipboardList, FileEdit, Activity, Clock, PlusCircle, Plus, Pill } from "lucide-react";
import { calculateAge } from "@/lib/utils";
import { AppointmentCard } from "@/components/appointments/appointment-card";
import WearableDeviceList from "@/components/wearables/wearable-device-list";
import { PatientDailyLog } from "@/components/patient/daily-log";
import { BodyMap } from "@/components/patient/body-map";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CarePlanTemplateCard } from "@/components/care-plans/care-plan-template-card";
import { TemplateSelector } from "@/components/care-plans/template-selector";
import { MedicationRecordCard } from "@/components/medications/medication-record-card";
import { PatientMedicationCard } from "@/components/medications/patient-medication-card";
import { AddMedicationDialog } from "@/components/medications/add-medication-dialog";
import { useQuery } from "@tanstack/react-query";
import { AnimatedCard } from "@/components/ui";
import { ComfortMessage } from "@/components/ui/comfort-message";
import { AnimatedButton } from "@/components/ui/animated-button";
import { motion } from "framer-motion";

interface PatientDetailProps {
  patient: Patient;
  appointments: Appointment[];
  carePlans: CarePlan[];
  onEdit: () => void;
}

type DailyLogDisplayData = {
  id: string;
  date: Date;
  mood: string;
  activities: string;
  bodyMap: Record<string, { painLevel: number; notes: string }>;
  notes: string;
};

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
  const [isBodyMapDialogOpen, setIsBodyMapDialogOpen] = useState(false);
  const [selectedDailyLog, setSelectedDailyLog] = useState<DailyLogDisplayData | null>(null);
  const [isMedicationDialogOpen, setIsMedicationDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<PatientMedication | null>(null);
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CarePlanTemplate | null>(null);
  
  // Fetch wearable devices for this patient
  const { data: wearableDevices = [] } = useQuery<any[]>({
    queryKey: [`/api/patients/${patient.id}/wearables`],
  });
  
  // Fetch patient daily logs
  const { data: dailyLogs = [] } = useQuery<DailyLogDisplayData[]>({
    queryKey: [`/api/patients/${patient.id}/daily-logs`],
  });
  
  // Fetch patient medications
  const { data: patientMedications = [] } = useQuery<PatientMedication[]>({
    queryKey: [`/api/patients/${patient.id}/medications`],
  });
  
  // Fetch medication administration records
  const { data: medicationRecords = [] } = useQuery<MedicationAdministrationRecord[]>({
    queryKey: [`/api/patients/${patient.id}/medication-records`],
  });
  
  // Fetch care plan templates
  const { data: carePlanTemplates = [] } = useQuery<CarePlanTemplate[]>({
    queryKey: [`/api/care-plan-templates`],
  });
  
  // Demo data for daily logs if needed
  const demoDailyLogs: DailyLogDisplayData[] = [
    {
      id: '1',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday
      mood: 'good',
      activities: 'Morning walk, reading, family visit',
      bodyMap: {
        'lower-back': { painLevel: 6, notes: 'Dull ache when standing for long periods' },
        'right-leg': { painLevel: 4, notes: 'Occasional sharp pain when walking' }
      },
      notes: 'Patient reports improved sleep after medication adjustment.'
    },
    {
      id: '2',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      mood: 'fair',
      activities: 'Physical therapy session, resting',
      bodyMap: {
        'lower-back': { painLevel: 7, notes: 'Persistent pain throughout the day' },
        'right-leg': { painLevel: 5, notes: 'Pain increases with activity' }
      },
      notes: 'Experiencing more discomfort today. Recommended heat therapy.'
    }
  ];
  
  // Sample wearable device data if no devices are found
  const demoWearableDevices = [
    {
      id: 1,
      patientId: patient.id,
      deviceType: 'glucose_monitor',
      manufacturer: 'Dexcom',
      model: 'G6 CGM',
      serialNumber: 'DX2023-' + patient.id + '001',
      lastSyncDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      batteryStatus: 78,
      connectionStatus: 'connected',
      activationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    },
    {
      id: 2,
      patientId: patient.id,
      deviceType: 'blood_pressure_monitor',
      manufacturer: 'Omron',
      model: 'HeartGuide',
      serialNumber: 'OM2023-' + patient.id + '002',
      lastSyncDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      batteryStatus: 92,
      connectionStatus: 'connected',
      activationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    }
  ];
  
  // Demo data for medications
  const demoPatientMedications: PatientMedication[] = [
    {
      id: 1,
      patientId: patient.id,
      medicationName: 'Lisinopril',
      dose: '10',
      unit: 'mg',
      route: 'oral',
      frequency: 'once daily',
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      endDate: null,
      isActive: true,
      instructions: 'Take in the morning with food',
      reason: 'Hypertension management',
      prescribedBy: 'Dr. Sarah Johnson',
      prescriptionDate: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
      pharmacy: 'Central Pharmacy',
      allergies: [],
      sideEffects: ['dizziness', 'dry cough'],
      interactions: ['potassium supplements'],
      createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000),
      updatedAt: null,
      metadata: {},
    },
    {
      id: 2,
      patientId: patient.id,
      medicationName: 'Metformin',
      dose: '500',
      unit: 'mg',
      route: 'oral',
      frequency: 'twice daily',
      startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      endDate: null,
      isActive: true,
      instructions: 'Take with meals',
      reason: 'Type 2 diabetes',
      prescribedBy: 'Dr. Michael Chen',
      prescriptionDate: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000),
      pharmacy: 'Central Pharmacy',
      allergies: [],
      sideEffects: ['nausea', 'diarrhea'],
      interactions: ['alcohol'],
      createdAt: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000),
      updatedAt: null,
      metadata: {},
    }
  ];
  
  // Demo data for medication records
  const demoMedicationRecords: MedicationAdministrationRecord[] = [
    {
      id: 1,
      patientId: patient.id,
      medicationName: 'Lisinopril',
      dose: '10',
      unit: 'mg',
      route: 'oral',
      frequency: 'once daily',
      scheduledDateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
      administrationDateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000 + 5 * 60 * 1000),
      administeredBy: 1,
      status: 'administered',
      notes: 'Patient took medication without issues',
      prescribedBy: 'Dr. Sarah Johnson',
      prescriptionDate: null,
      witness: null,
      metadata: {},
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: null,
    },
    {
      id: 2,
      patientId: patient.id,
      medicationName: 'Metformin',
      dose: '500',
      unit: 'mg',
      route: 'oral',
      frequency: 'twice daily',
      scheduledDateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
      administrationDateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000 + 10 * 60 * 1000),
      administeredBy: 1,
      status: 'administered',
      notes: 'Taken with breakfast',
      prescribedBy: 'Dr. Michael Chen',
      prescriptionDate: null,
      witness: null,
      metadata: {},
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: null,
    },
    {
      id: 3,
      patientId: patient.id,
      medicationName: 'Metformin',
      dose: '500',
      unit: 'mg',
      route: 'oral',
      frequency: 'twice daily',
      scheduledDateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000),
      administrationDateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000 + 15 * 60 * 1000),
      administeredBy: 2,
      status: 'administered',
      notes: 'Taken with dinner',
      prescribedBy: 'Dr. Michael Chen',
      prescriptionDate: null,
      witness: null,
      metadata: {},
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: null,
    },
    {
      id: 4,
      patientId: patient.id,
      medicationName: 'Lisinopril',
      dose: '10',
      unit: 'mg',
      route: 'oral',
      frequency: 'once daily',
      scheduledDateTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
      administrationDateTime: null,
      administeredBy: null,
      status: 'scheduled',
      notes: null,
      prescribedBy: 'Dr. Sarah Johnson',
      prescriptionDate: null,
      witness: null,
      metadata: {},
      createdAt: new Date(),
      updatedAt: null,
    },
  ];
  
  // Demo care plan templates
  const demoCarePlanTemplates: CarePlanTemplate[] = [
    {
      id: 1,
      name: 'Diabetes Management Plan',
      description: 'Comprehensive care plan for managing type 2 diabetes with regular monitoring and lifestyle adjustments',
      category: 'chronic',
      assessments: [
        { id: 1, name: 'Blood Glucose Monitoring', frequency: 'daily' },
        { id: 2, name: 'HbA1c Test', frequency: 'quarterly' },
        { id: 3, name: 'Foot Examination', frequency: 'monthly' }
      ],
      goals: [
        { id: 1, description: 'Maintain blood glucose between 70-130 mg/dL before meals' },
        { id: 2, description: 'Achieve HbA1c level below 7%' },
        { id: 3, description: 'Maintain healthy weight through diet and exercise' }
      ],
      interventions: [
        { id: 1, description: 'Daily glucose monitoring', frequency: 'daily' },
        { id: 2, description: 'Medication adherence check', frequency: 'daily' },
        { id: 3, description: 'Dietary counseling', frequency: 'monthly' },
        { id: 4, description: 'Exercise program', frequency: 'weekly' }
      ],
      medicationRefs: [],
      suitableConditions: ['diabetes', 'pre-diabetes', 'metabolic syndrome'],
      targetAudience: 'Adult patients with type 2 diabetes',
      estimatedDuration: '6 months',
      reviewFrequency: 'monthly',
      isActive: true,
      createdBy: null,
      tenantId: null,
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      updatedAt: null,
      evidenceBase: null,
    },
    {
      id: 2,
      name: 'Hypertension Management Plan',
      description: 'Structured approach to blood pressure control through medication, monitoring, and lifestyle changes',
      category: 'chronic',
      assessments: [
        { id: 1, name: 'Blood Pressure Reading', frequency: 'daily' },
        { id: 2, name: 'Weight Check', frequency: 'weekly' },
        { id: 3, name: 'Cardiovascular Assessment', frequency: 'quarterly' }
      ],
      goals: [
        { id: 1, description: 'Maintain blood pressure below 130/80 mmHg' },
        { id: 2, description: 'Reduce sodium intake to less than 2,300 mg per day' },
        { id: 3, description: 'Exercise for 30 minutes at least 5 days per week' }
      ],
      interventions: [
        { id: 1, description: 'Medication management', frequency: 'daily' },
        { id: 2, description: 'Blood pressure monitoring', frequency: 'twice weekly' },
        { id: 3, description: 'DASH diet education', frequency: 'initial and as needed' },
        { id: 4, description: 'Stress management techniques', frequency: 'weekly' }
      ],
      medicationRefs: [],
      suitableConditions: ['hypertension', 'pre-hypertension', 'cardiovascular disease'],
      targetAudience: 'Adults with hypertension or at risk of hypertension',
      estimatedDuration: '3 months',
      reviewFrequency: 'monthly',
      isActive: true,
      createdBy: null,
      tenantId: null,
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      updatedAt: null,
      evidenceBase: null,
    },
    {
      id: 3,
      name: 'Post-Hospital Care Transition',
      description: 'Structured support for patients transitioning from hospital to home care',
      category: 'post-hospital',
      assessments: [
        { id: 1, name: 'Medication Reconciliation', frequency: 'initial and weekly' },
        { id: 2, name: 'Wound Assessment', frequency: 'daily if applicable' },
        { id: 3, name: 'Activities of Daily Living Assessment', frequency: 'weekly' }
      ],
      goals: [
        { id: 1, description: 'Prevent hospital readmission within 30 days' },
        { id: 2, description: 'Ensure medication compliance' },
        { id: 3, description: 'Successful transition to independent care management' }
      ],
      interventions: [
        { id: 1, description: 'Home safety evaluation', frequency: 'initial' },
        { id: 2, description: 'Medication management support', frequency: 'daily then weekly' },
        { id: 3, description: 'Symptom monitoring and management', frequency: 'daily' },
        { id: 4, description: 'Care coordination with specialists', frequency: 'as needed' }
      ],
      medicationRefs: [],
      suitableConditions: ['post-surgery', 'post-acute care', 'chronic condition exacerbation'],
      targetAudience: 'Patients recently discharged from hospital',
      estimatedDuration: '30 days',
      reviewFrequency: 'weekly',
      isActive: true,
      createdBy: null,
      tenantId: null,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      updatedAt: null,
      evidenceBase: null,
    }
  ];
  
  // Use real data or demo data
  const displayDailyLogs: DailyLogDisplayData[] = dailyLogs && dailyLogs.length > 0 ? dailyLogs : demoDailyLogs;
  const displayWearableDevices: any[] = (wearableDevices && wearableDevices.length > 0) ? wearableDevices : demoWearableDevices;
  const displayPatientMedications: PatientMedication[] = patientMedications && patientMedications.length > 0 ? patientMedications : demoPatientMedications;
  const displayMedicationRecords: MedicationAdministrationRecord[] = medicationRecords && medicationRecords.length > 0 ? medicationRecords : demoMedicationRecords;
  const displayCarePlanTemplates: CarePlanTemplate[] = carePlanTemplates && carePlanTemplates.length > 0 ? carePlanTemplates : demoCarePlanTemplates;
  
  const openBodyMapDialog = (log: DailyLogDisplayData) => {
    setSelectedDailyLog(log);
    setIsBodyMapDialogOpen(true);
  };

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
          <TabsTrigger value="wearables">Wearable Devices</TabsTrigger>
          <TabsTrigger value="dailylogs">Daily Logs</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="templates">Care Templates</TabsTrigger>
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

        {/* Medications Tab */}
        <TabsContent value="medications" className="pt-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Patient Medications</h3>
              <AnimatedButton 
                emotionalState="positive" 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setIsMedicationDialogOpen(true)}
              >
                <Pill className="h-4 w-4" />
                Add Medication
              </AnimatedButton>
            </div>
            
            {displayPatientMedications.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {displayPatientMedications.map((medication) => (
                  <motion.div
                    key={medication.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <PatientMedicationCard
                      key={medication.id}
                      medication={medication}
                      onEdit={() => {
                        setSelectedMedication(medication);
                        setIsMedicationDialogOpen(true);
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-neutral-500 mb-4">No medications have been added for this patient.</p>
                  <AnimatedButton 
                    emotionalState="calm" 
                    variant="outline"
                    onClick={() => setIsMedicationDialogOpen(true)}
                  >
                    Add First Medication
                  </AnimatedButton>
                </CardContent>
              </Card>
            )}
            
            <div className="mt-10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Recent Medication Administration</h3>
                <Link href={`/medication-records/new?patientId=${patient.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Record
                  </Button>
                </Link>
              </div>
              
              {displayMedicationRecords.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayMedicationRecords.map((record) => (
                    <MedicationRecordCard
                      key={record.id}
                      record={record}
                      onEdit={() => {/* TODO: implement edit */}}
                    />
                  ))}
                </div>
              ) : (
                <Card className="mt-4">
                  <CardContent className="py-8 text-center">
                    <p className="text-neutral-500 mb-4">No medication administration records available.</p>
                    <Link href={`/medication-records/new?patientId=${patient.id}`}>
                      <Button variant="outline">
                        Add First Record
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        {/* Care Plan Templates Tab */}
        <TabsContent value="templates" className="pt-4">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Available Care Plan Templates</h3>
              <div className="flex space-x-2">
                <AnimatedButton 
                  emotionalState="calm"
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => setIsTemplateSelectorOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Select Template
                </AnimatedButton>
              </div>
            </div>
            
            {displayCarePlanTemplates.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {displayCarePlanTemplates.slice(0, 4).map((template) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CarePlanTemplateCard
                      key={template.id}
                      template={template}
                      onSelect={(template) => {
                        setSelectedTemplate(template);
                        // Here you would create a new care plan based on this template
                        console.log("Selected template for new care plan:", template);
                      }}
                      onViewDetails={(template) => {
                        // Set the selected template and open the template details dialog
                        setSelectedTemplate(template);
                        console.log("View template details:", template);
                      }}
                      minimal={true}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-neutral-500 mb-4">No care plan templates available.</p>
                  <AnimatedButton 
                    emotionalState="positive" 
                    variant="outline"
                    onClick={() => setIsTemplateSelectorOpen(true)}
                  >
                    Browse Templates
                  </AnimatedButton>
                </CardContent>
              </Card>
            )}
          </div>
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
        
        {/* Wearable Devices Tab */}
        <TabsContent value="wearables" className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Connected Devices</h3>
              <Link href={`/wearable-devices/new?patientId=${patient.id}`}>
                <Button variant="outline" size="sm" className="flex items-center">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </Link>
            </div>
            
            {displayWearableDevices.length > 0 ? (
              <div className="space-y-4">
                {displayWearableDevices.map((device: any) => (
                  <AnimatedCard key={device.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">
                          {device.manufacturer} {device.model}
                        </CardTitle>
                        <span className={`px-2 py-1 rounded text-xs ${device.connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {device.connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                        </span>
                      </div>
                      <CardDescription>
                        {device.deviceType.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Serial Number</h4>
                          <p className="text-sm text-neutral-700">{device.serialNumber}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Battery</h4>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className={`h-2.5 rounded-full ${device.batteryStatus > 60 ? 'bg-green-500' : device.batteryStatus > 30 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${device.batteryStatus}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-neutral-700">{device.batteryStatus}%</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Last Synced</h4>
                          <p className="text-sm text-neutral-700">{device.lastSyncDate ? new Date(device.lastSyncDate).toLocaleString() : 'Never'}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Activated</h4>
                          <p className="text-sm text-neutral-700">{new Date(device.activationDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-neutral-50 p-3">
                      <div className="flex justify-between w-full">
                        <Link href={`/wearable-devices/${device.id}`}>
                          <Button variant="ghost" size="sm" className="text-xs">
                            View Details
                          </Button>
                        </Link>
                        <Link href={`/wearable-devices/${device.id}/readings`}>
                          <Button variant="ghost" size="sm" className="text-xs">
                            View Readings
                          </Button>
                        </Link>
                      </div>
                    </CardFooter>
                  </AnimatedCard>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-neutral-500">No wearable devices connected.</p>
                  <p className="text-sm text-neutral-400 mt-1">Add a device to monitor patient health metrics.</p>
                  <Link href={`/wearable-devices/new?patientId=${patient.id}`}>
                    <Button variant="outline" className="mt-4">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Connect Device
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
            
            <ComfortMessage
              type="information"
              message="Wearable devices help track patient vital signs and activity patterns in real-time, enabling more proactive care and early intervention."
            />
          </div>
        </TabsContent>
        
        {/* Daily Logs Tab with Body Map Integration */}
        <TabsContent value="dailylogs" className="pt-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Patient Daily Logs</h3>
              <Link href={`/patients/${patient.id}/daily-logs/new`}>
                <Button variant="outline" size="sm" className="flex items-center">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Log Entry
                </Button>
              </Link>
            </div>
            
            {displayDailyLogs.length > 0 ? (
              <div className="space-y-4">
                {displayDailyLogs.map((log: DailyLogDisplayData) => (
                  <AnimatedCard key={log.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base">
                          Log Entry: {log.date.toLocaleDateString()}
                        </CardTitle>
                        <span className="text-2xl">
                          {log.mood === 'excellent' ? '😀' : 
                           log.mood === 'good' ? '🙂' : 
                           log.mood === 'fair' ? '😐' : 
                           log.mood === 'poor' ? '😕' : '😣'}
                        </span>
                      </div>
                      <CardDescription>
                        Recorded activities and health status
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium mb-1">Activities</h4>
                          <p className="text-sm text-neutral-700">{log.activities}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Notes</h4>
                          <p className="text-sm text-neutral-700">{log.notes}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-1">Pain Areas</h4>
                          {Object.keys(log.bodyMap).length > 0 ? (
                            <div className="text-sm">
                              <ul className="space-y-1">
                                {Object.entries(log.bodyMap).map(([area, data]) => (
                                  <li key={area} className="flex items-center justify-between">
                                    <span>{area.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                                    <span className={`px-2 py-0.5 rounded ${data.painLevel > 7 ? 'bg-red-100 text-red-800' : 
                                                 data.painLevel > 5 ? 'bg-orange-100 text-orange-800' : 
                                                 data.painLevel > 3 ? 'bg-yellow-100 text-yellow-800' : 
                                                 'bg-green-100 text-green-800'}`}>
                                      Pain level: {data.painLevel}/10
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <p className="text-sm text-neutral-500">No pain areas recorded</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-neutral-50">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openBodyMapDialog(log)}>
                        View Body Map
                      </Button>
                    </CardFooter>
                  </AnimatedCard>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-neutral-500">No daily logs recorded yet.</p>
                  <p className="text-sm text-neutral-400 mt-1">
                    Daily logs help track patient condition over time.
                  </p>
                  <Link href={`/patients/${patient.id}/daily-logs/new`}>
                    <Button variant="outline" className="mt-4">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create First Log
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Body Map Dialog */}
      <Dialog open={isBodyMapDialogOpen} onOpenChange={setIsBodyMapDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Body Pain Map - {selectedDailyLog?.date.toLocaleDateString()}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedDailyLog && (
              <BodyMap 
                initialValues={selectedDailyLog.bodyMap} 
                readonly={true} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Medication Dialog */}
      <AddMedicationDialog
        open={isMedicationDialogOpen}
        onOpenChange={setIsMedicationDialogOpen}
        patient={patient}
        initialData={selectedMedication || undefined}
        onSuccess={() => {
          setSelectedMedication(null);
          // Refetch data to show the updated medication list
        }}
      />
      
      {/* Care Plan Template Selector Dialog */}
      <Dialog open={isTemplateSelectorOpen} onOpenChange={setIsTemplateSelectorOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <TemplateSelector
            templates={displayCarePlanTemplates}
            patientId={patient.id}
            onSelect={(template) => {
              setSelectedTemplate(template);
              setIsTemplateSelectorOpen(false);
              // Here you would create a new care plan based on this template
              console.log("Creating new care plan from template:", template);
            }}
            onClose={() => setIsTemplateSelectorOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
