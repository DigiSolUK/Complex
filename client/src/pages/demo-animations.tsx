import React, { useState } from 'react';
// Use the app layout structure instead of importing a layout component
import { AnimatedCard } from '@/components/ui/animated-card';
import { ComfortMessage } from '@/components/ui/animations';
import { AnimatedButton } from '@/components/ui/animated-button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Patient info transition component for smooth transitions between patient data
type TransitionType = 'gentle-fade' | 'gentle-slide' | 'scale-fade';

interface PatientInfoTransitionProps {
  children: React.ReactNode;
  id: number;
  isVisible: boolean;
  transitionType?: TransitionType;
}

function PatientInfoTransition({ 
  children, 
  id, 
  isVisible, 
  transitionType = 'gentle-fade' 
}: PatientInfoTransitionProps) {
  // Set up animation variants based on transition type
  const getAnimationVariants = () => {
    switch (transitionType) {
      case 'gentle-slide':
        return {
          hidden: { opacity: 0, x: -20 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.5, ease: 'easeOut' } 
          },
          exit: { 
            opacity: 0, 
            x: 20,
            transition: { duration: 0.3, ease: 'easeIn' } 
          }
        };
      case 'scale-fade':
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.4, ease: 'easeOut' } 
          },
          exit: { 
            opacity: 0, 
            scale: 0.95,
            transition: { duration: 0.3, ease: 'easeIn' } 
          }
        };
      default: // gentle-fade
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { duration: 0.4 } 
          },
          exit: { 
            opacity: 0,
            transition: { duration: 0.3 } 
          }
        };
    }
  };

  if (!isVisible) return null;
  
  return (
    <motion.div
      key={id}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={getAnimationVariants()}
    >
      {children}
    </motion.div>
  );
}

// Patient info item component for displaying patient details with styling
interface PatientInfoItemProps {
  label: string;
  value: string;
  important?: boolean;
}

function PatientInfoItem({ label, value, important = false }: PatientInfoItemProps) {
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn(
        "text-sm", 
        important ? "font-semibold text-primary" : "font-medium"
      )}>
        {value}
      </span>
    </div>
  );
}

export default function AnimationsDemo() {
  const [activeTab, setActiveTab] = useState('buttons');
  const [activePatient, setActivePatient] = useState(1);
  
  // Sample patient data
  const patients = [
    {
      id: 1,
      name: 'Alice Johnson',
      age: 45,
      condition: 'Type 2 Diabetes',
      lastVisit: '2025-04-28',
      nextVisit: '2025-05-12',
      medications: ['Metformin', 'Lisinopril'],
      notes: 'Patient is responding well to new medication regimen.'
    },
    {
      id: 2,
      name: 'Robert Smith',
      age: 62,
      condition: 'Hypertension',
      lastVisit: '2025-05-01',
      nextVisit: '2025-05-15',
      medications: ['Amlodipine', 'Atorvastatin'],
      notes: 'Blood pressure showing improvement. Continue monitoring.'
    },
    {
      id: 3,
      name: 'Emily Chen',
      age: 34,
      condition: 'Asthma',
      lastVisit: '2025-04-20',
      nextVisit: '2025-05-20',
      medications: ['Albuterol', 'Fluticasone'],
      notes: 'Seasonal allergies exacerbating asthma symptoms.'
    }
  ];
  
  return (
    <div className="flex flex-col h-full w-full">
      <div className="container mx-auto py-8 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6">Emotional Comfort Animations Demo</h1>
          <p className="text-lg mb-8">
            This page demonstrates the micro-interactions designed to create a more
            comforting and reassuring healthcare interface.
          </p>
        </motion.div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="buttons">Animated Buttons</TabsTrigger>
            <TabsTrigger value="cards">Animated Cards</TabsTrigger>
            <TabsTrigger value="messages">Comfort Messages</TabsTrigger>
            <TabsTrigger value="patient">Patient Info</TabsTrigger>
          </TabsList>
          
          {/* Animated Buttons Demo */}
          <TabsContent value="buttons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Animated Buttons with Emotional States</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Default Buttons</h3>
                  <div className="flex flex-wrap gap-4">
                    <AnimatedButton>Default Button</AnimatedButton>
                    <AnimatedButton variant="secondary">Secondary Button</AnimatedButton>
                    <AnimatedButton variant="outline">Outline Button</AnimatedButton>
                    <AnimatedButton variant="destructive">Destructive Button</AnimatedButton>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Emotional State Buttons</h3>
                  <div className="flex flex-wrap gap-4">
                    <AnimatedButton emotionalState="calm">Calm Action</AnimatedButton>
                    <AnimatedButton emotionalState="positive">Positive Feedback</AnimatedButton>
                    <AnimatedButton emotionalState="urgent">Important Action</AnimatedButton>
                    <AnimatedButton emotionalState="neutral">Neutral Action</AnimatedButton>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Feedback Intensity</h3>
                  <div className="flex flex-wrap gap-4">
                    <AnimatedButton feedbackType="gentle">Gentle Feedback</AnimatedButton>
                    <AnimatedButton feedbackType="strong">Strong Feedback</AnimatedButton>
                    <AnimatedButton feedbackType="none">No Animation</AnimatedButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Animated Cards Demo */}
          <TabsContent value="cards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatedCard
                header={<h3 className="text-lg font-medium">Gentle Lift Effect</h3>}
                hoverEffect="gentle-lift"
              >
                <p className="text-sm text-muted-foreground">
                  This card gently lifts on hover to provide subtle interactive feedback.
                  Ideal for patient record cards that need to feel responsive but calm.
                </p>
              </AnimatedCard>
              
              <AnimatedCard
                header={<h3 className="text-lg font-medium">Gentle Glow Effect</h3>}
                hoverEffect="gentle-glow"
                transitionDelay={0.1}
              >
                <p className="text-sm text-muted-foreground">
                  This card has a subtle glow effect on hover to provide warm, reassuring
                  feedback. Good for highlighting important but non-urgent information.
                </p>
              </AnimatedCard>
              
              <AnimatedCard
                header={<h3 className="text-lg font-medium">Soft Border Effect</h3>}
                hoverEffect="soft-border"
                transitionDelay={0.2}
              >
                <p className="text-sm text-muted-foreground">
                  This card highlights its border on hover, drawing attention in a
                  non-intrusive way. Useful for selectable items in a calm interface.
                </p>
              </AnimatedCard>
            </div>
          </TabsContent>
          
          {/* Comfort Messages Demo */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comfort Messages for Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ComfortMessage 
                  type="reassurance"
                  message="Your medical information is encrypted and securely stored. Only authorized healthcare professionals can access your records."
                />
                
                <ComfortMessage 
                  type="empathy"
                  message="We understand this diagnosis might feel overwhelming. Your care team is here to support you every step of the way."
                />
                
                <ComfortMessage 
                  type="success"
                  message="Your appointment has been scheduled successfully. We've sent a confirmation to your phone with all the details."
                />
                
                <ComfortMessage 
                  type="information"
                  message="Your prescription has been sent to your preferred pharmacy. It should be ready for pickup in about 20 minutes."
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Patient Info Transitions Demo */}
          <TabsContent value="patient" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information with Calming Transitions</CardTitle>
                <div className="flex space-x-2 mt-4">
                  {patients.map(patient => (
                    <AnimatedButton 
                      key={patient.id}
                      variant={activePatient === patient.id ? 'default' : 'outline'}
                      onClick={() => setActivePatient(patient.id)}
                      emotionalState="calm"
                    >
                      {patient.name}
                    </AnimatedButton>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {patients.map(patient => (
                  <PatientInfoTransition
                    key={patient.id}
                    id={patient.id}
                    isVisible={activePatient === patient.id}
                    transitionType="gentle-slide"
                  >
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PatientInfoItem label="Patient Name" value={patient.name} important />
                        <PatientInfoItem label="Age" value={`${patient.age} years`} />
                        <PatientInfoItem label="Primary Condition" value={patient.condition} />
                        <PatientInfoItem label="Last Visit" value={patient.lastVisit} />
                        <PatientInfoItem label="Next Appointment" value={patient.nextVisit} />
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Current Medications</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {patient.medications.map((med, idx) => (
                            <motion.li 
                              key={idx}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + (idx * 0.1) }}
                              className="text-sm"
                            >
                              {med}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                      
                      <ComfortMessage 
                        type="empathy"
                        message={patient.notes}
                      />
                    </div>
                  </PatientInfoTransition>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
