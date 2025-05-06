import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Check, Clock4, FileText, Save } from 'lucide-react';
import { format } from 'date-fns';
import { BodyMap } from './body-map';

interface DailyLogProps {
  patientId: string;
  patientName: string;
  onSave?: (data: PatientDailyLog) => void;
  initialData?: PatientDailyLog;
  readOnly?: boolean;
}

export interface PatientDailyLog {
  id?: string;
  patientId: string;
  date: Date;
  mood: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  sleep: 'well' | 'adequate' | 'restless' | 'poor' | 'none';
  appetite: 'excellent' | 'good' | 'fair' | 'poor' | 'none';
  bodyMap: Record<string, { painLevel: number; notes: string }>;
  notes: string;
  medications: {
    taken: boolean;
    notes: string;
  };
  hydration: 1 | 2 | 3 | 4 | 5;
  activities: string;
  symptoms: string;
  caregiverNotes?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export function PatientDailyLog({ patientId, patientName, onSave, initialData, readOnly = false }: DailyLogProps) {
  const [activeTab, setActiveTab] = useState('health');
  const [date, setDate] = useState<Date>(initialData?.date || new Date());
  const [formData, setFormData] = useState<PatientDailyLog>(initialData || {
    patientId,
    date: new Date(),
    mood: 'good',
    sleep: 'adequate',
    appetite: 'good',
    bodyMap: {},
    notes: '',
    medications: {
      taken: true,
      notes: ''
    },
    hydration: 3,
    activities: '',
    symptoms: '',
    caregiverNotes: ''
  });

  const handleInputChange = (field: string, value: any) => {
    if (readOnly) return;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    if (readOnly) return;
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleBodyMapChange = (data: Record<string, { painLevel: number; notes: string }>) => {
    if (readOnly) return;
    setFormData(prev => ({ ...prev, bodyMap: data }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    onSave?.(formData);
  };

  const renderMoodIcon = (mood: string) => {
    switch (mood) {
      case 'excellent':
        return '😀';
      case 'good':
        return '🙂';
      case 'fair':
        return '😐';
      case 'poor':
        return '😕';
      case 'critical':
        return '😣';
      default:
        return '😐';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Daily Health Log</CardTitle>
              <CardDescription>Recording health data for {patientName}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock4 className="h-4 w-4 mr-1" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1 h-8 w-auto"
                      disabled={readOnly}
                    >
                      <CalendarIcon className="h-4 w-4" />
                      {format(date, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        if (newDate && !readOnly) {
                          setDate(newDate);
                          handleInputChange('date', newDate);
                        }
                      }}
                      disabled={readOnly}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="health">Health Status</TabsTrigger>
              <TabsTrigger value="pain">Pain Assessment</TabsTrigger>
              <TabsTrigger value="notes">Notes & Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="health" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Mood Today</Label>
                    <RadioGroup
                      value={formData.mood}
                      onValueChange={(value) => handleInputChange('mood', value)}
                      className="flex justify-between mt-2"
                      disabled={readOnly}
                    >
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="excellent" id="mood-excellent" className="sr-only" />
                        <Label
                          htmlFor="mood-excellent"
                          className={`text-2xl cursor-pointer p-2 rounded-full ${formData.mood === 'excellent' ? 'bg-primary/20' : ''}`}
                        >
                          😀
                        </Label>
                        <span className="text-xs mt-1">Excellent</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="good" id="mood-good" className="sr-only" />
                        <Label
                          htmlFor="mood-good"
                          className={`text-2xl cursor-pointer p-2 rounded-full ${formData.mood === 'good' ? 'bg-primary/20' : ''}`}
                        >
                          🙂
                        </Label>
                        <span className="text-xs mt-1">Good</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="fair" id="mood-fair" className="sr-only" />
                        <Label
                          htmlFor="mood-fair"
                          className={`text-2xl cursor-pointer p-2 rounded-full ${formData.mood === 'fair' ? 'bg-primary/20' : ''}`}
                        >
                          😐
                        </Label>
                        <span className="text-xs mt-1">Fair</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="poor" id="mood-poor" className="sr-only" />
                        <Label
                          htmlFor="mood-poor"
                          className={`text-2xl cursor-pointer p-2 rounded-full ${formData.mood === 'poor' ? 'bg-primary/20' : ''}`}
                        >
                          😕
                        </Label>
                        <span className="text-xs mt-1">Poor</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <RadioGroupItem value="critical" id="mood-critical" className="sr-only" />
                        <Label
                          htmlFor="mood-critical"
                          className={`text-2xl cursor-pointer p-2 rounded-full ${formData.mood === 'critical' ? 'bg-primary/20' : ''}`}
                        >
                          😣
                        </Label>
                        <span className="text-xs mt-1">Critical</span>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Sleep Quality</Label>
                    <RadioGroup
                      value={formData.sleep}
                      onValueChange={(value) => handleInputChange('sleep', value)}
                      className="grid grid-cols-5 gap-2 mt-2"
                      disabled={readOnly}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="well" id="sleep-well" />
                        <Label htmlFor="sleep-well">Well</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="adequate" id="sleep-adequate" />
                        <Label htmlFor="sleep-adequate">Adequate</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="restless" id="sleep-restless" />
                        <Label htmlFor="sleep-restless">Restless</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poor" id="sleep-poor" />
                        <Label htmlFor="sleep-poor">Poor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="sleep-none" />
                        <Label htmlFor="sleep-none">None</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Appetite</Label>
                    <RadioGroup
                      value={formData.appetite}
                      onValueChange={(value) => handleInputChange('appetite', value)}
                      className="grid grid-cols-5 gap-2 mt-2"
                      disabled={readOnly}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="excellent" id="appetite-excellent" />
                        <Label htmlFor="appetite-excellent">Excellent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id="appetite-good" />
                        <Label htmlFor="appetite-good">Good</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fair" id="appetite-fair" />
                        <Label htmlFor="appetite-fair">Fair</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="poor" id="appetite-poor" />
                        <Label htmlFor="appetite-poor">Poor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="appetite-none" />
                        <Label htmlFor="appetite-none">None</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Hydration Level (1-5)</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <RadioGroup
                        value={String(formData.hydration)}
                        onValueChange={(value) => handleInputChange('hydration', parseInt(value) as 1 | 2 | 3 | 4 | 5)}
                        className="flex gap-4"
                        disabled={readOnly}
                      >
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div key={level} className="flex flex-col items-center">
                            <RadioGroupItem value={String(level)} id={`hydration-${level}`} className="sr-only" />
                            <Label
                              htmlFor={`hydration-${level}`}
                              className={`flex items-center justify-center h-10 w-10 rounded-full cursor-pointer text-sm border ${formData.hydration === level ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-input'}`}
                            >
                              {level}
                            </Label>
                            <span className="text-xs mt-1">
                              {level === 1 ? 'Low' : level === 5 ? 'High' : ''}
                            </span>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2">
                      <span>Medications Taken</span>
                      {formData.medications.taken && (
                        <Check className="h-4 w-4 text-green-500" />
                      )}
                    </Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <RadioGroup
                        value={formData.medications.taken ? 'yes' : 'no'}
                        onValueChange={(value) => handleNestedInputChange('medications', 'taken', value === 'yes')}
                        className="flex gap-4"
                        disabled={readOnly}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="meds-yes" />
                          <Label htmlFor="meds-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="meds-no" />
                          <Label htmlFor="meds-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    {(formData.medications.taken || formData.medications.notes) && (
                      <Textarea
                        placeholder="Medication notes..."
                        className="mt-2"
                        value={formData.medications.notes}
                        onChange={(e) => handleNestedInputChange('medications', 'notes', e.target.value)}
                        readOnly={readOnly}
                      />
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pain" className="space-y-4">
              <BodyMap
                initialValues={formData.bodyMap}
                onChange={handleBodyMapChange}
                readonly={readOnly}
              />
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe any new or recurring symptoms"
                    value={formData.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    className="mt-1"
                    readOnly={readOnly}
                  />
                </div>
                <div>
                  <Label htmlFor="activities">Activities & Exercise</Label>
                  <Textarea
                    id="activities"
                    placeholder="Activities completed today"
                    value={formData.activities}
                    onChange={(e) => handleInputChange('activities', e.target.value)}
                    className="mt-1"
                    readOnly={readOnly}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any other relevant information"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="mt-1"
                    readOnly={readOnly}
                  />
                </div>
                {(readOnly || formData.caregiverNotes) && (
                  <div>
                    <Label htmlFor="caregiver-notes">Caregiver Notes</Label>
                    <Textarea
                      id="caregiver-notes"
                      placeholder="Notes from care professional"
                      value={formData.caregiverNotes || ''}
                      onChange={(e) => handleInputChange('caregiverNotes', e.target.value)}
                      className="mt-1"
                      readOnly={readOnly && !formData.caregiverNotes?.includes('(Care Professional)')}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        {!readOnly && (
          <CardFooter className="justify-between">
            <Button type="button" variant="outline" onClick={() => setActiveTab(activeTab === 'health' ? 'pain' : activeTab === 'pain' ? 'notes' : 'health')}>
              {activeTab === 'health' ? 'Next: Pain Assessment' : activeTab === 'pain' ? 'Next: Notes' : 'Back to Health Status'}
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" /> Save Daily Log
            </Button>
          </CardFooter>
        )}
      </Card>
    </form>
  );
}
