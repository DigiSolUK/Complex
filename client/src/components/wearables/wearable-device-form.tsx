import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { ComfortMessage } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

// Form schema with validation
const wearableDeviceSchema = z.object({
  deviceType: z.enum([
    'smartwatch',
    'fitness_tracker',
    'glucose_monitor',
    'blood_pressure_monitor',
    'heart_monitor',
    'pulse_oximeter',
    'sleep_tracker',
    'thermometer',
    'other'
  ], {
    required_error: "Please select a device type",
  }),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
});

type WearableDeviceFormValues = z.infer<typeof wearableDeviceSchema>;

export default function WearableDeviceForm({ 
  patientId, 
  onSuccess 
}: { 
  patientId: number;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  
  // Initialize form
  const form = useForm<WearableDeviceFormValues>({
    resolver: zodResolver(wearableDeviceSchema),
    defaultValues: {
      deviceType: undefined,
      manufacturer: '',
      model: '',
      serialNumber: '',
    },
  });

  // Device add mutation
  const addDeviceMutation = useMutation({
    mutationFn: async (data: WearableDeviceFormValues) => {
      const res = await fetch(`/api/patients/${patientId}/wearables`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to add device');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Device added successfully',
        description: 'The wearable device has been connected to this patient.',
        variant: 'default',
      });
      form.reset();
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error adding device',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: WearableDeviceFormValues) => {
    addDeviceMutation.mutate(data);
  };

  return (
    <div className="space-y-4">
      <ComfortMessage
        type="reassurance"
        message="Adding a wearable device will help you monitor this patient's health in real-time and receive alerts about potential issues."
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="deviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="smartwatch">Smartwatch</SelectItem>
                    <SelectItem value="fitness_tracker">Fitness Tracker</SelectItem>
                    <SelectItem value="glucose_monitor">Glucose Monitor</SelectItem>
                    <SelectItem value="blood_pressure_monitor">Blood Pressure Monitor</SelectItem>
                    <SelectItem value="heart_monitor">Heart Monitor</SelectItem>
                    <SelectItem value="pulse_oximeter">Pulse Oximeter</SelectItem>
                    <SelectItem value="sleep_tracker">Sleep Tracker</SelectItem>
                    <SelectItem value="thermometer">Thermometer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The type of wearable device being connected
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Apple, Fitbit, Dexcom" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Watch Series 8, Charge 5" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Device serial number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end pt-2">
            <Button 
              type="submit" 
              disabled={addDeviceMutation.isPending}
              className="min-w-[120px]"
            >
              {addDeviceMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Device'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}