import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertAppointmentSchema, InsertAppointment, Patient, CareStaff } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PatientAvatar } from "@/components/ui/avatar";

// Extend the schema with additional validation
const formSchema = insertAppointmentSchema.extend({
  dateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date and time",
  }),
});

interface AppointmentFormProps {
  initialData?: Partial<InsertAppointment>;
  onSubmit: (data: InsertAppointment) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  patients: Patient[];
  staff: CareStaff[];
}

export function AppointmentForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  patients,
  staff,
}: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Convert date object to string format for the form
  const initialDateTime = initialData?.dateTime 
    ? new Date(initialData.dateTime).toISOString().slice(0, 16) 
    : new Date().toISOString().slice(0, 16);

  const form = useForm<InsertAppointment>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: initialData?.patientId || 0,
      staffId: initialData?.staffId || undefined,
      title: initialData?.title || "",
      description: initialData?.description || "",
      dateTime: initialDateTime,
      duration: initialData?.duration || 30,
      status: initialData?.status || "Scheduled",
      location: initialData?.location || "",
      notes: initialData?.notes || "",
    },
  });

  async function handleSubmit(values: InsertAppointment) {
    setIsSubmitting(true);
    try {
      // Convert string date to Date object
      const formattedValues = {
        ...values,
        dateTime: new Date(values.dateTime).toISOString(),
      };
      
      await onSubmit(formattedValues);
      toast({
        title: isEditing ? "Appointment updated" : "Appointment scheduled",
        description: isEditing
          ? "Appointment has been updated successfully."
          : "New appointment has been scheduled successfully.",
      });
    } catch (error) {
      console.error("Error submitting appointment form:", error);
      toast({
        title: "Error",
        description: "Failed to save appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Appointment" : "Schedule New Appointment"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id.toString()}>
                          <div className="flex items-center">
                            <PatientAvatar name={patient.name} className="h-5 w-5 mr-2" />
                            {patient.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value ? parseInt(value) : undefined)}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No specific provider</SelectItem>
                      {staff.map((s) => (
                        <SelectItem key={s.id} value={s.id.toString()}>
                          {s.name} ({s.position})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Leave blank if no specific provider is needed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Annual check-up" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time</FormLabel>
                    <FormControl>
                      <Input {...field} type="datetime-local" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={15}
                        step={15}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. Room 103" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      {...field}
                      placeholder="Brief description of the appointment purpose"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      {...field}
                      placeholder="Any additional information or preparation instructions"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Appointment"
                : "Schedule Appointment"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
