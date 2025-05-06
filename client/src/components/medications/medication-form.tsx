import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { type PatientMedication, type InsertPatientMedication } from '@shared/schema';

// Extend the schema for form validation
const medicationFormSchema = z.object({
  patientId: z.number(),
  medicationName: z.string().min(2, 'Medication name is required'),
  dose: z.string().min(1, 'Dose is required'),
  unit: z.string().min(1, 'Unit is required'),
  route: z.string().min(1, 'Route is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  startDate: z.date(),
  endDate: z.date().nullable(),
  isActive: z.boolean().default(true),
  instructions: z.string().optional(),
  reason: z.string().optional(),
  prescribedBy: z.string().optional(),
  prescriptionDate: z.date().nullable().optional(),
  pharmacy: z.string().optional(),
  allergies: z.array(z.string()).default([]),
  sideEffects: z.array(z.string()).default([]),
  interactions: z.array(z.string()).default([]),
  metadata: z.any().optional(),
});

type MedicationFormData = z.infer<typeof medicationFormSchema>;

interface MedicationFormProps {
  patient: { id: number };
  initialData?: PatientMedication;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MedicationForm({ 
  patient, 
  initialData, 
  onSuccess, 
  onCancel 
}: MedicationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Default values
  const defaultValues: Partial<MedicationFormData> = {
    patientId: patient.id,
    medicationName: initialData?.medicationName || '',
    dose: initialData?.dose || '',
    unit: initialData?.unit || 'mg',
    route: initialData?.route || 'oral',
    frequency: initialData?.frequency || 'once daily',
    startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
    endDate: initialData?.endDate ? new Date(initialData.endDate) : null,
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    instructions: initialData?.instructions || '',
    reason: initialData?.reason || '',
    prescribedBy: initialData?.prescribedBy || '',
    prescriptionDate: initialData?.prescriptionDate ? new Date(initialData.prescriptionDate) : null,
    pharmacy: initialData?.pharmacy || '',
    allergies: initialData?.allergies || [],
    sideEffects: initialData?.sideEffects || [],
    interactions: initialData?.interactions || [],
    metadata: initialData?.metadata || {},
  };
  
  const form = useForm<MedicationFormData>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues,
  });
  
  // This would connect to your API endpoint
  const isEditing = !!initialData;
  const mutation = useMutation({
    mutationFn: async (data: MedicationFormData) => {
      const endpoint = isEditing 
        ? `/api/patients/${patient.id}/medications/${initialData.id}` 
        : `/api/patients/${patient.id}/medications`;
      const method = isEditing ? 'PATCH' : 'POST';
      const res = await apiRequest(method, endpoint, data);
      if (!res.ok) throw new Error('Failed to save medication');
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: `Medication ${isEditing ? 'updated' : 'added'} successfully`,
        description: `The medication has been ${isEditing ? 'updated' : 'added'} to the patient's record.`,
        variant: 'default',
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patient.id}/medications`] });
      queryClient.invalidateQueries({ queryKey: [`/api/patients/${patient.id}`] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: 'Error saving medication',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  async function onSubmit(data: MedicationFormData) {
    // For demonstration, we'll just convert string arrays
    const preparedData = {
      ...data,
      allergies: data.allergies || [],
      sideEffects: data.sideEffects || [],
      interactions: data.interactions || [],
    };
    
    mutation.mutate(preparedData);
  }
  
  // Handle string arrays (allergies, side effects, interactions)
  const [allergiesInput, setAllergiesInput] = useState('');
  const [sideEffectsInput, setSideEffectsInput] = useState('');
  const [interactionsInput, setInteractionsInput] = useState('');
  
  const addAllergy = () => {
    if (allergiesInput.trim()) {
      const current = form.getValues('allergies') || [];
      form.setValue('allergies', [...current, allergiesInput.trim()]);
      setAllergiesInput('');
    }
  };
  
  const removeAllergy = (index: number) => {
    const current = form.getValues('allergies') || [];
    form.setValue('allergies', current.filter((_, i) => i !== index));
  };
  
  const addSideEffect = () => {
    if (sideEffectsInput.trim()) {
      const current = form.getValues('sideEffects') || [];
      form.setValue('sideEffects', [...current, sideEffectsInput.trim()]);
      setSideEffectsInput('');
    }
  };
  
  const removeSideEffect = (index: number) => {
    const current = form.getValues('sideEffects') || [];
    form.setValue('sideEffects', current.filter((_, i) => i !== index));
  };
  
  const addInteraction = () => {
    if (interactionsInput.trim()) {
      const current = form.getValues('interactions') || [];
      form.setValue('interactions', [...current, interactionsInput.trim()]);
      setInteractionsInput('');
    }
  };
  
  const removeInteraction = (index: number) => {
    const current = form.getValues('interactions') || [];
    form.setValue('interactions', current.filter((_, i) => i !== index));
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Medication Name */}
          <FormField
            control={form.control}
            name="medicationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medication Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter medication name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Dosage information */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dose*</FormLabel>
                  <FormControl>
                    <Input placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit*</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mg">mg</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="mcg">mcg</SelectItem>
                      <SelectItem value="tablet">tablet</SelectItem>
                      <SelectItem value="capsule">capsule</SelectItem>
                      <SelectItem value="patch">patch</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Route */}
          <FormField
            control={form.control}
            name="route"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Route*</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="oral">Oral</SelectItem>
                    <SelectItem value="topical">Topical</SelectItem>
                    <SelectItem value="injection">Injection</SelectItem>
                    <SelectItem value="sublingual">Sublingual</SelectItem>
                    <SelectItem value="inhalation">Inhalation</SelectItem>
                    <SelectItem value="rectal">Rectal</SelectItem>
                    <SelectItem value="transdermal">Transdermal</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Frequency */}
          <FormField
            control={form.control}
            name="frequency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Frequency*</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="once daily">Once daily</SelectItem>
                    <SelectItem value="twice daily">Twice daily</SelectItem>
                    <SelectItem value="three times daily">Three times daily</SelectItem>
                    <SelectItem value="four times daily">Four times daily</SelectItem>
                    <SelectItem value="every 4 hours">Every 4 hours</SelectItem>
                    <SelectItem value="every 6 hours">Every 6 hours</SelectItem>
                    <SelectItem value="every 8 hours">Every 8 hours</SelectItem>
                    <SelectItem value="every 12 hours">Every 12 hours</SelectItem>
                    <SelectItem value="as needed">As needed (PRN)</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date*</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* End Date (Optional) */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < form.getValues().startDate || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Active Status */}
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Active Medication
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Indicates if this medication is currently being administered
                </p>
              </div>
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Prescribed By */}
          <FormField
            control={form.control}
            name="prescribedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prescribed By</FormLabel>
                <FormControl>
                  <Input placeholder="Doctor's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Pharmacy */}
          <FormField
            control={form.control}
            name="pharmacy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pharmacy</FormLabel>
                <FormControl>
                  <Input placeholder="Pharmacy name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Prescription Date */}
        <FormField
          control={form.control}
          name="prescriptionDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Prescription Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Instructions */}
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter detailed instructions for taking this medication" 
                  {...field} 
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Reason for Medication */}
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Medication</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter the medical reason for this medication" 
                  {...field} 
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Allergies */}
        <FormItem>
          <FormLabel>Allergies</FormLabel>
          <div className="flex space-x-2">
            <Input 
              placeholder="Add an allergy" 
              value={allergiesInput} 
              onChange={(e) => setAllergiesInput(e.target.value)} 
            />
            <Button type="button" onClick={addAllergy} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {form.watch('allergies')?.map((allergy, index) => (
              <div key={index} className="flex items-center bg-neutral-100 px-3 py-1 rounded-full">
                <span className="text-sm">{allergy}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 ml-1" 
                  onClick={() => removeAllergy(index)}
                >
                  &times;
                </Button>
              </div>
            ))}
          </div>
        </FormItem>
        
        {/* Side Effects */}
        <FormItem>
          <FormLabel>Side Effects</FormLabel>
          <div className="flex space-x-2">
            <Input 
              placeholder="Add a side effect" 
              value={sideEffectsInput} 
              onChange={(e) => setSideEffectsInput(e.target.value)} 
            />
            <Button type="button" onClick={addSideEffect} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {form.watch('sideEffects')?.map((effect, index) => (
              <div key={index} className="flex items-center bg-neutral-100 px-3 py-1 rounded-full">
                <span className="text-sm">{effect}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 ml-1" 
                  onClick={() => removeSideEffect(index)}
                >
                  &times;
                </Button>
              </div>
            ))}
          </div>
        </FormItem>
        
        {/* Interactions */}
        <FormItem>
          <FormLabel>Interactions</FormLabel>
          <div className="flex space-x-2">
            <Input 
              placeholder="Add an interaction" 
              value={interactionsInput} 
              onChange={(e) => setInteractionsInput(e.target.value)} 
            />
            <Button type="button" onClick={addInteraction} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {form.watch('interactions')?.map((interaction, index) => (
              <div key={index} className="flex items-center bg-neutral-100 px-3 py-1 rounded-full">
                <span className="text-sm">{interaction}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 ml-1" 
                  onClick={() => removeInteraction(index)}
                >
                  &times;
                </Button>
              </div>
            ))}
          </div>
        </FormItem>
        
        <div className="flex items-center justify-end space-x-4 pt-4">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <AnimatedButton 
            type="submit" 
            emotionalState="positive" 
            isLoading={mutation.isPending}
          >
            {isEditing ? 'Update Medication' : 'Add Medication'}
          </AnimatedButton>
        </div>
      </form>
    </Form>
  );
}

// Add missing import
import { useState } from 'react';
