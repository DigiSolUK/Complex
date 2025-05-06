import { PatientMedication } from '@shared/schema';
import { AlertCircle, Calendar, Clock, Pill } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AnimatedCard } from '../ui/animated-card';

interface PatientMedicationCardProps {
  medication: PatientMedication;
  onEdit?: (medication: PatientMedication) => void;
  minimal?: boolean;
}

export function PatientMedicationCard({ 
  medication, 
  onEdit, 
  minimal = false 
}: PatientMedicationCardProps) {
  // Helper function to format the date
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString();
  };

  return (
    <AnimatedCard className={minimal ? 'shadow-sm' : 'shadow-md'}>
      <CardHeader className={minimal ? 'pb-2' : 'pb-4'}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={minimal ? 'text-base' : 'text-lg'}>
              {medication.medicationName}
            </CardTitle>
            <CardDescription className="mt-1">
              {medication.dose} {medication.unit} - {medication.route} - {medication.frequency}
            </CardDescription>
          </div>
          <Badge 
            className={medication.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
          >
            {medication.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-neutral-500" />
            <span className="text-neutral-600">
              Started: {formatDate(medication.startDate)}
              {medication.endDate && ` · Ends: ${formatDate(medication.endDate)}`}
            </span>
          </div>
          
          {medication.prescribedBy && (
            <div className="flex items-center text-sm">
              <Pill className="h-4 w-4 mr-2 text-neutral-500" />
              <span className="text-neutral-600">
                Prescribed by: {medication.prescribedBy}
                {medication.prescriptionDate && ` on ${formatDate(medication.prescriptionDate)}`}
              </span>
            </div>
          )}
          
          {medication.pharmacy && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-neutral-500" />
              <span className="text-neutral-600">
                Pharmacy: {medication.pharmacy}
              </span>
            </div>
          )}
          
          {medication.allergies && medication.allergies.length > 0 && (
            <div className="flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
              <span className="text-red-600">
                Allergies: {medication.allergies.join(', ')}
              </span>
            </div>
          )}
        </div>
        
        {medication.instructions && !minimal && (
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <p className="text-sm font-medium">Instructions:</p>
            <p className="text-sm text-neutral-600">{medication.instructions}</p>
          </div>
        )}
        
        {medication.reason && !minimal && (
          <div className="mt-3">
            <p className="text-sm font-medium">Reason for medication:</p>
            <p className="text-sm text-neutral-600">{medication.reason}</p>
          </div>
        )}
      </CardContent>
      
      {!minimal && onEdit && (
        <CardFooter className="flex justify-end bg-neutral-50 border-t pt-3 pb-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(medication)}
          >
            Edit Medication
          </Button>
        </CardFooter>
      )}
    </AnimatedCard>
  );
}
