import { MedicationAdministrationRecord } from '@shared/schema';
import { Calendar, Clock, Pill, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AnimatedCard } from '../ui/animated-card';

interface MedicationRecordCardProps {
  record: MedicationAdministrationRecord;
  onEdit?: (record: MedicationAdministrationRecord) => void;
  minimal?: boolean;
}

export function MedicationRecordCard({ 
  record, 
  onEdit, 
  minimal = false 
}: MedicationRecordCardProps) {
  // Helper function to format the date
  const formatDateTime = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleString();
  };

  // Helper to get status badge color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'administered':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      case 'refused':
        return 'bg-orange-100 text-orange-800';
      case 'held':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-neutral-100 text-neutral-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <AnimatedCard className={minimal ? 'shadow-sm' : 'shadow-md'}>
      <CardHeader className={minimal ? 'pb-2' : 'pb-4'}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={minimal ? 'text-base' : 'text-lg'}>
              {record.medicationName}
            </CardTitle>
            <CardDescription className="mt-1">
              {record.dose} {record.unit} - {record.route} - {record.frequency}
            </CardDescription>
          </div>
          <Badge 
            className={getStatusColor(record.status)}
          >
            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-neutral-500" />
            <span className="text-neutral-600">
              Scheduled: {formatDateTime(record.scheduledDateTime)}
            </span>
          </div>
          
          {record.administrationDateTime && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-neutral-500" />
              <span className="text-neutral-600">
                Administered: {formatDateTime(record.administrationDateTime)}
              </span>
            </div>
          )}
          
          {record.administeredBy && (
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-neutral-500" />
              <span className="text-neutral-600">
                By: {record.administeredBy}
              </span>
            </div>
          )}
          
          {record.prescribedBy && (
            <div className="flex items-center text-sm">
              <Pill className="h-4 w-4 mr-2 text-neutral-500" />
              <span className="text-neutral-600">
                Prescribed by: {record.prescribedBy}
              </span>
            </div>
          )}
        </div>
        
        {record.notes && !minimal && (
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <p className="text-sm text-neutral-600">{record.notes}</p>
          </div>
        )}
      </CardContent>
      
      {!minimal && onEdit && (
        <CardFooter className="flex justify-end bg-neutral-50 border-t pt-3 pb-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(record)}
          >
            Update Record
          </Button>
        </CardFooter>
      )}
    </AnimatedCard>
  );
}
