import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MedicationForm } from '@/components/medications/medication-form';
import { type PatientMedication } from '@shared/schema';

interface AddMedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: { id: number };
  initialData?: PatientMedication;
  onSuccess?: () => void;
}

export function AddMedicationDialog({
  open,
  onOpenChange,
  patient,
  initialData,
  onSuccess
}: AddMedicationDialogProps) {
  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Medication' : 'Add New Medication'}
          </DialogTitle>
        </DialogHeader>
        
        <MedicationForm
          patient={patient}
          initialData={initialData}
          onSuccess={handleSuccess}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
