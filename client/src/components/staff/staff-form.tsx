import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertCareStaffSchema, InsertCareStaff } from "@shared/schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateStaffId } from "@/lib/utils";

// Extend the schema with additional validation
const formSchema = insertCareStaffSchema.extend({
  phone: z.string().optional(),
  qualifications: z.string().optional(),
});

interface StaffFormProps {
  initialData?: Partial<InsertCareStaff>;
  onSubmit: (data: InsertCareStaff) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

export function StaffForm({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}: StaffFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertCareStaff>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      staffId: initialData?.staffId || generateStaffId(),
      name: initialData?.name || "",
      position: initialData?.position || "",
      department: initialData?.department || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      qualifications: initialData?.qualifications || "",
      status: initialData?.status || "Active",
    },
  });

  async function handleSubmit(values: InsertCareStaff) {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
      toast({
        title: isEditing ? "Staff updated" : "Staff member added",
        description: isEditing
          ? "Staff member's information has been updated successfully."
          : "New staff member has been added successfully.",
      });
    } catch (error) {
      console.error("Error submitting staff form:", error);
      toast({
        title: "Error",
        description: "Failed to save staff information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Staff Member" : "Add New Staff Member"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="staffId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Staff ID</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly={isEditing} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for the staff member
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="General Practice">General Practice</SelectItem>
                        <SelectItem value="Community Nursing">Community Nursing</SelectItem>
                        <SelectItem value="Geriatrics">Geriatrics</SelectItem>
                        <SelectItem value="Rehabilitation">Rehabilitation</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                        <SelectItem value="Mental Health">Mental Health</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="qualifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualifications</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      E.g., MD, RN, BSN, PhD
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
              {isSubmitting ? "Saving..." : isEditing ? "Update Staff Member" : "Add Staff Member"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
