import React from 'react';
import { ComfortMessage } from '@/components/ui/comfort-message';
import { ComfortButton } from '@/components/ui/comfort-button';
import { MicroAnimation } from '@/components/ui/micro-animation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ActivitySquare, AlertTriangle, Award, Bell, Calendar, CheckCircle, HelpCircle, Heart, Info, Medal, Pill, ShieldCheck, ThumbsUp, X } from 'lucide-react';

export default function MicroAnimationsDemo() {
  const [triggerAnimation, setTriggerAnimation] = React.useState(false);

  const handleTriggerAnimation = () => {
    setTriggerAnimation(true);
    setTimeout(() => setTriggerAnimation(false), 100);
  };

  return (
    <div className="container mx-auto py-10">
      <header className="mb-10 text-center">
        <MicroAnimation variant="calming" playOnMount={true} size="lg">
          <Heart className="mx-auto h-12 w-12 text-teal-500" />
        </MicroAnimation>
        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Micro-Interactions</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Subtle animations designed for emotional comfort in healthcare environments
        </p>
      </header>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-3">
          <TabsTrigger value="messages">Comfort Messages</TabsTrigger>
          <TabsTrigger value="buttons">Comfort Buttons</TabsTrigger>
          <TabsTrigger value="animations">Custom Animations</TabsTrigger>
        </TabsList>
        
        {/* Comfort Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ComfortMessage
              title="Success Message"
              description="Your medication reminder has been successfully scheduled."
              variant="success"
            />

            <ComfortMessage
              title="Warning Message"
              description="Your appointment is in 24 hours. Please confirm your attendance."
              variant="warning"
            />

            <ComfortMessage
              title="Error Message"
              description="We couldn't process your request. Please try again later."
              variant="error"
            />

            <ComfortMessage
              title="Information Message"
              description="Your next doctor appointment is scheduled for Friday at 2:00 PM."
              variant="info"
            />

            <ComfortMessage
              title="Empathetic Message"
              description="We understand this may be difficult. Take your time to process the information."
              variant="empathetic"
            />

            <ComfortMessage
              title="Calming Message"
              description="Remember to take deep breaths. It's normal to feel anxious before a procedure."
              variant="calming"
            />

            <ComfortMessage
              title="Encouraging Message"
              description="You've made great progress in your recovery plan. Keep it up!"
              variant="encouraging"
            />

            <ComfortMessage
              title="Auto-hiding Message"
              description="This message will disappear after 5 seconds."
              variant="info"
              autoHide={true}
              hideDelay={5000}
            />
          </div>
        </TabsContent>

        {/* Comfort Buttons Tab */}
        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emotional State Buttons</CardTitle>
              <CardDescription>
                Buttons with different emotional states and micro-animations
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col gap-3">
                <h3 className="text-md font-medium">Neutral Buttons</h3>
                <div className="flex flex-wrap gap-2">
                  <ComfortButton emotionalState="neutral">
                    Neutral
                  </ComfortButton>
                  <ComfortButton emotionalState="neutral" pulseEffect={false}>
                    No Pulse
                  </ComfortButton>
                  <ComfortButton emotionalState="neutral" pulseOnMount={true}>
                    Pulse on Mount
                  </ComfortButton>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-md font-medium">Success & Error States</h3>
                <div className="flex flex-wrap gap-2">
                  <ComfortButton emotionalState="success">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Success
                  </ComfortButton>
                  <ComfortButton emotionalState="warning">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Warning
                  </ComfortButton>
                  <ComfortButton emotionalState="error">
                    <X className="mr-2 h-4 w-4" />
                    Error
                  </ComfortButton>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-md font-medium">Healthcare Specific</h3>
                <div className="flex flex-wrap gap-2">
                  <ComfortButton emotionalState="empathetic">
                    <Heart className="mr-2 h-4 w-4" />
                    Empathetic
                  </ComfortButton>
                  <ComfortButton emotionalState="calming">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Calming
                  </ComfortButton>
                  <ComfortButton emotionalState="encouraging">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Encouraging
                  </ComfortButton>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Button Actions</CardTitle>
              <CardDescription>
                Common healthcare actions with appropriate emotional states
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex justify-between gap-2">
                  <ComfortButton emotionalState="calming">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Appointment
                  </ComfortButton>
                  <ComfortButton emotionalState="empathetic">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Get Help
                  </ComfortButton>
                </div>
                <div className="flex justify-between gap-2">
                  <ComfortButton emotionalState="encouraging">
                    <ActivitySquare className="mr-2 h-4 w-4" />
                    View Progress
                  </ComfortButton>
                  <ComfortButton emotionalState="success">
                    <Pill className="mr-2 h-4 w-4" />
                    Medication Reminder
                  </ComfortButton>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between gap-2">
                  <ComfortButton emotionalState="warning">
                    <Bell className="mr-2 h-4 w-4" />
                    Emergency Contact
                  </ComfortButton>
                  <ComfortButton emotionalState="neutral">
                    <Info className="mr-2 h-4 w-4" />
                    More Information
                  </ComfortButton>
                </div>
                <div className="flex justify-between gap-2">
                  <ComfortButton emotionalState="calming">
                    <Medal className="mr-2 h-4 w-4" />
                    Contact Doctor
                  </ComfortButton>
                  <ComfortButton emotionalState="encouraging">
                    <Award className="mr-2 h-4 w-4" />
                    Complete Task
                  </ComfortButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Custom Animations Tab */}
        <TabsContent value="animations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom Micro-Animations</CardTitle>
              <CardDescription>
                Individual animations that can be applied to any component
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-3">
                {Object.entries({
                  success: <CheckCircle className="h-10 w-10 text-success" />,
                  warning: <AlertTriangle className="h-10 w-10 text-warning" />,
                  error: <X className="h-10 w-10 text-error" />,
                  neutral: <Info className="h-10 w-10 text-primary" />,
                  empathetic: <Heart className="h-10 w-10 text-blue-500" />,
                  calming: <ShieldCheck className="h-10 w-10 text-teal-500" />,
                  encouraging: <ThumbsUp className="h-10 w-10 text-yellow-500" />
                }).map(([variant, icon]) => (
                  <div key={variant} className="flex flex-col items-center justify-center gap-2">
                    <div className="rounded-full bg-slate-100 p-6 dark:bg-slate-800">
                      <MicroAnimation variant={variant as any} trigger={triggerAnimation} repeat={false} playOnMount>
                        {icon}
                      </MicroAnimation>
                    </div>
                    <span className="mt-2 text-sm font-medium capitalize">{variant}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-center">
                <Button onClick={handleTriggerAnimation}>
                  Trigger All Animations
                </Button>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <p>
                All animations are designed to be subtle and non-distracting, focusing on
                providing emotional feedback without causing visual fatigue or anxiety.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
