import { Chatbot } from "@/components/patient/chatbot";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer } from "@/components/ui/page-container";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Info, Plus, MessageSquare, File, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function PatientSupportPage() {
  const { toast } = useToast();
  const [activePatientId, setActivePatientId] = useState<number | null>(null);

  // Fetch patients to display in the sidebar
  const { data: patients, isLoading: isLoadingPatients } = useQuery({
    queryKey: ["/api/patients"],
  });

  // Select a patient to chat with
  const selectPatient = (patientId: number) => {
    const patient = patients?.find((p: any) => p.id === patientId);
    if (patient) {
      setActivePatientId(patientId);
      toast({
        title: "Patient Selected",
        description: `Now chatting with ${patient.name}`,
      });
    }
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Patient Support" 
        description="Connect with patients through our AI-powered support system."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-4 lg:col-span-3">
          <Card className="p-4">
            <div className="font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Patients
            </div>
            
            {isLoadingPatients ? (
              <p className="text-muted-foreground text-sm">Loading patients...</p>
            ) : patients && patients.length > 0 ? (
              <div className="space-y-2">
                {patients.map((patient: any) => (
                  <Button
                    key={patient.id}
                    variant={activePatientId === patient.id ? "default" : "ghost"}
                    className="w-full justify-start text-left"
                    onClick={() => selectPatient(patient.id)}
                  >
                    <span className="truncate">{patient.name}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No patients found.</p>
            )}
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-8 lg:col-span-9">
          {activePatientId ? (
            <Tabs defaultValue="chat">
              <TabsList className="mb-4">
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" /> Chat
                </TabsTrigger>
                <TabsTrigger value="resources" className="flex items-center gap-1">
                  <File className="h-4 w-4" /> Resources
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-1">
                  <Phone className="h-4 w-4" /> Contact
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="chat">
                <Chatbot patientId={activePatientId} />
              </TabsContent>
              
              <TabsContent value="resources">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Helpful Resources</h3>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium mb-1">Understanding Your Care Plan</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        A guide to help patients understand their care plans and how to follow them effectively.
                      </p>
                      <Button variant="outline" size="sm">
                        View Resource
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium mb-1">Medication Management</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Tips and tools for managing medications, including schedules and side effects.
                      </p>
                      <Button variant="outline" size="sm">
                        View Resource
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <h4 className="font-medium mb-1">Daily Health Tracking</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Learn how to monitor and record your health metrics for better care outcomes.
                      </p>
                      <Button variant="outline" size="sm">
                        View Resource
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="contact">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Your Care Team</h3>
                  
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Primary Care Provider</h4>
                      <div className="space-y-1">
                        <p className="text-sm">Dr. Sarah Johnson</p>
                        <p className="text-sm text-muted-foreground">Phone: (555) 123-4567</p>
                        <p className="text-sm text-muted-foreground">Email: sarah.johnson@complexcare.example</p>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" /> Call
                        </Button>
                        <Button size="sm" variant="outline">
                          Message
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Care Coordinator</h4>
                      <div className="space-y-1">
                        <p className="text-sm">Michael Chen</p>
                        <p className="text-sm text-muted-foreground">Phone: (555) 987-6543</p>
                        <p className="text-sm text-muted-foreground">Email: michael.chen@complexcare.example</p>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4 mr-1" /> Call
                        </Button>
                        <Button size="sm" variant="outline">
                          Message
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted/50 rounded">
                      <Info className="h-4 w-4" />
                      <span>For emergencies, please call 911 or go to your nearest emergency room.</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="p-6 min-h-[600px] flex flex-col items-center justify-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a Patient to Start</h3>
              <p className="text-muted-foreground text-center max-w-md mb-4">
                Choose a patient from the list on the left to start a conversation or view their support resources.
              </p>
              {patients && patients.length > 0 && (
                <Button onClick={() => selectPatient(patients[0].id)}>
                  Start with {patients[0].name}
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
