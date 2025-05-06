import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type CarePlanTemplate } from '@shared/schema';
import { Clock, Calendar, CheckCircle2, ListTodo, PlusCircle, ArrowRight } from 'lucide-react';
import { AnimatedButton } from '@/components/ui/animated-button';
import { motion } from 'framer-motion';

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
  const {
    name,
    description,
    category,
    reviewFrequency,
    suitableConditions,
    targetAudience,
    estimatedDuration,
    assessments,
    goals,
    interventions
  } = template;
  
  const categoryColors: Record<string, string> = {
    'general': 'bg-blue-100 text-blue-800',
    'physical': 'bg-green-100 text-green-800',
    'mental': 'bg-purple-100 text-purple-800',
    'palliative': 'bg-amber-100 text-amber-800',
    'chronic': 'bg-indigo-100 text-indigo-800',
    'post-hospital': 'bg-teal-100 text-teal-800',
    'rehabilitation': 'bg-rose-100 text-rose-800'
  };
  
  const countAssessments = Array.isArray(assessments) ? assessments.length : 0;
  const countGoals = Array.isArray(goals) ? goals.length : 0;
  const countInterventions = Array.isArray(interventions) ? interventions.length : 0;
  
  return (
    <Card className={`overflow-hidden border-l-4 ${categoryColors[category] || 'border-blue-500'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className={minimal ? 'text-base' : 'text-lg'}>{name}</CardTitle>
          <Badge className={categoryColors[category] || 'bg-blue-100 text-blue-800'}>
            {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      {!minimal && (
        <CardContent className="pb-2">
          <div className="space-y-2">
            {targetAudience && (
              <div className="flex items-start gap-2 text-sm">
                <span className="text-neutral-500 font-medium min-w-[120px]">Target Audience:</span>
                <span>{targetAudience}</span>
              </div>
            )}
            
            {suitableConditions && suitableConditions.length > 0 && (
              <div className="flex items-start gap-2 text-sm">
                <span className="text-neutral-500 font-medium min-w-[120px]">Suitable For:</span>
                <div className="flex flex-wrap gap-1">
                  {suitableConditions.map((condition, index) => (
                    <Badge key={index} variant="outline" className="bg-neutral-50">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="flex flex-col items-center justify-center p-2 bg-neutral-50 rounded-md">
                <div className="flex items-center gap-1 text-sm font-medium text-neutral-700">
                  <Calendar className="h-4 w-4 text-neutral-500" />
                  <span>Duration</span>
                </div>
                <span className="text-sm">{estimatedDuration || 'Variable'}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center p-2 bg-neutral-50 rounded-md">
                <div className="flex items-center gap-1 text-sm font-medium text-neutral-700">
                  <Clock className="h-4 w-4 text-neutral-500" />
                  <span>Review</span>
                </div>
                <span className="text-sm">{reviewFrequency || 'As needed'}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div className="flex flex-col items-center justify-center p-2">
                <div className="flex items-center gap-1 text-xs font-medium text-neutral-600">
                  <CheckCircle2 className="h-3 w-3 text-neutral-500" />
                  <span>Assessments</span>
                </div>
                <span className="text-lg font-bold">{countAssessments}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center p-2">
                <div className="flex items-center gap-1 text-xs font-medium text-neutral-600">
                  <ListTodo className="h-3 w-3 text-neutral-500" />
                  <span>Goals</span>
                </div>
                <span className="text-lg font-bold">{countGoals}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center p-2">
                <div className="flex items-center gap-1 text-xs font-medium text-neutral-600">
                  <ArrowRight className="h-3 w-3 text-neutral-500" />
                  <span>Interventions</span>
                </div>
                <span className="text-lg font-bold">{countInterventions}</span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
      
      {minimal && (
        <CardContent className="py-2">
          <div className="flex flex-wrap gap-1">
            {suitableConditions && suitableConditions.slice(0, 3).map((condition, index) => (
              <Badge key={index} variant="outline" className="bg-neutral-50 text-xs">
                {condition}
              </Badge>
            ))}
            {suitableConditions && suitableConditions.length > 3 && (
              <Badge variant="outline" className="bg-neutral-50 text-xs">
                +{suitableConditions.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{estimatedDuration || 'Variable'}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{reviewFrequency || 'As needed'}</span>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardFooter className={minimal ? 'pt-0' : 'pt-2 pb-4'}>
        <div className="flex w-full justify-between gap-2">
          {onViewDetails && (
            <Button 
              variant="ghost" 
              size={minimal ? 'sm' : 'default'}
              onClick={() => onViewDetails(template)}
            >
              View Details
            </Button>
          )}
          
          {onSelect && (
            <AnimatedButton
              emotionalState="success"
              size={minimal ? 'sm' : 'default'}
              onClick={() => onSelect(template)}
              className="ml-auto"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Select Template
            </AnimatedButton>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
