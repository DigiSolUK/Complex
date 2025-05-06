import { CarePlanTemplate } from '@shared/schema';
import { CalendarCheck, ClipboardList, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AnimatedCard } from '../ui/animated-card';

interface CarePlanTemplateCardProps {
  template: CarePlanTemplate;
  onSelect?: (template: CarePlanTemplate) => void;
  onViewDetails?: (template: CarePlanTemplate) => void;
  minimal?: boolean;
}

export function CarePlanTemplateCard({ 
  template, 
  onSelect, 
  onViewDetails, 
  minimal = false 
}: CarePlanTemplateCardProps) {
  return (
    <AnimatedCard className={minimal ? 'shadow-sm' : 'shadow-md'}>
      <CardHeader className={minimal ? 'pb-2' : 'pb-4'}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={minimal ? 'text-base' : 'text-lg'}>{template.name}</CardTitle>
            <CardDescription className="mt-1">
              {template.category.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} Plan
            </CardDescription>
          </div>
          <Badge variant={template.isActive ? "success" : "secondary"}>
            {template.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {!minimal && (
          <p className="text-sm text-neutral-600 mb-4">{template.description}</p>
        )}
        <div className="grid grid-cols-1 gap-2">
          <div className="flex items-center text-sm">
            <ClipboardList className="h-4 w-4 mr-2 text-neutral-500" />
            <span className="text-neutral-600">
              {template.goals && Array.isArray(template.goals) ? template.goals.length : 0} Goals, 
              {template.interventions && Array.isArray(template.interventions) ? template.interventions.length : 0} Interventions
            </span>
          </div>
          {template.reviewFrequency && (
            <div className="flex items-center text-sm">
              <CalendarCheck className="h-4 w-4 mr-2 text-neutral-500" />
              <span className="text-neutral-600">Review: {template.reviewFrequency}</span>
            </div>
          )}
          {template.estimatedDuration && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-neutral-500" />
              <span className="text-neutral-600">Duration: {template.estimatedDuration}</span>
            </div>
          )}
        </div>
      </CardContent>
      {!minimal && (
        <CardFooter className="flex justify-between bg-neutral-50 border-t pt-3 pb-3">
          {onViewDetails && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onViewDetails(template)}
            >
              View Details
            </Button>
          )}
          {onSelect && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => onSelect(template)}
            >
              Use Template
            </Button>
          )}
        </CardFooter>
      )}
    </AnimatedCard>
  );
}
