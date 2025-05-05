import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { PageContainer } from '@/components/ui/page-container';
import { PatientChatbot } from '@/components/patient/chatbot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

export default function PatientSupportPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  
  // Fetch patients list
  const { data: patients, isLoading } = useQuery({
    queryKey: ['/api/patients'],
  });

  // Find selected patient
  const selectedPatient = selectedPatientId ? 
    patients?.find((patient: any) => patient.id === selectedPatientId) : null;

  return (
    <PageContainer>
      <PageHeader heading="Patient Support" subheading="Compassionate AI Support for Patients" />
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-sm">
              <Label htmlFor="patient">Patient</Label>
              <Select 
                disabled={isLoading} 
                onValueChange={(value) => setSelectedPatientId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading patients...</span>
                    </div>
                  ) : patients?.length ? (
                    patients.map((patient: any) => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {patient.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-muted-foreground text-center">
                      No patients found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {selectedPatientId && selectedPatient && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <div className="font-medium">{selectedPatient.name}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Care Type</Label>
                    <div className="font-medium">{selectedPatient.careType || 'Not specified'}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Medical Conditions</Label>
                    <div className="font-medium">{selectedPatient.medicalConditions || 'None specified'}</div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Medications</Label>
                    <div className="font-medium">{selectedPatient.medications || 'None specified'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <PatientChatbot
              patientId={selectedPatientId}
              patientName={selectedPatient.name}
            />
          </div>
        )}

        {!selectedPatientId && (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-4xl">👆</div>
              <h3 className="text-2xl font-semibold">Select a Patient</h3>
              <p className="text-muted-foreground">
                Please select a patient from the dropdown above to start the AI-powered support conversation.
              </p>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
