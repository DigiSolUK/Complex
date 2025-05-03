import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertCarePlanSchema, InsertCarePlan, Patient } from "@shared/schema";
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
const formSchema = insertCarePlanSchema.extend({
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date",
  }),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Please enter a valid date",
    }),
  assessments: z.array(z.object({
    title: z.string(),
    description: z.string(),
  })).optional(),
  goals: z.array(z.object({
    title: z.string(),
    description: z.string(),
    targetDate: z.string().optional(),
  })).optional(),
  interventions: z.array(z.object({
    title: z.string(),
    description: z.string(),
    frequency: z.string().optional(),
  })).optional(),
  medications: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string(),
    instructions: z.string().optional(),
  })).optional(),
});

interface CarePlanFormProps {
  initialData?: Partial<InsertCarePlan>;
  onSubmit: (data: InsertCarePlan) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
  patients: Patient[];
}

export function CarePlanForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
  patients,
}: CarePlanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Convert date objects to string format for the form
  const initialStartDate = initialData?.startDate
    ? new Date(initialData.startDate).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  
  const initialEndDate = initialData?.endDate
    ? new Date(initialData.endDate).toISOString().slice(0, 10)
    : "";

  const form = useForm<InsertCarePlan>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: initialData?.patientId || 0,
      title: initialData?.title || "",
      description: initialData?.description || "",
      startDate: initialStartDate,
      endDate: initialEndDate,
      status: initialData?.status || "Draft",
      assessments: initialData?.assessments || [],
      goals: initialData?.goals || [],
      interventions: initialData?.interventions || [],
      medications: initialData?.medications || [],
      reviewSchedule: initialData?.reviewSchedule || "",
    },
  });

  async function handleSubmit(values: InsertCarePlan) {
    setIsSubmitting(true);
    try {
      // Convert string dates to ISO format
      const formattedValues = {
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
      };
      
      await onSubmit(formattedValues);
      toast({
        title: isEditing ? "Care plan updated" : "Care plan created",
        description: isEditing
          ? "Care plan has been updated successfully."
          : "New care plan has been created successfully.",
      });
    } catch (error) {
      console.error("Error submitting care plan form:", error);
      toast({
        title: "Error",
        description: "Failed to save care plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Care Plan" : "Create New Care Plan"}</CardTitle>
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
                    disabled={isEditing}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Comprehensive Care Plan" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      placeholder="Brief description of the care plan's purpose and objectives"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormDescription>
                      Leave blank for ongoing care plans
                    </FormDescription>
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
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reviewSchedule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Schedule</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Monthly, Every 3 months"
                    />
                  </FormControl>
                  <FormDescription>
                    How often this care plan should be reviewed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* In a full implementation, we would add dynamic fields for assessments, goals, interventions, and medications */}
            {/* For simplicity in this example, we're just providing the basic form structure */}
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
                ? "Update Care Plan"
                : "Create Care Plan"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
