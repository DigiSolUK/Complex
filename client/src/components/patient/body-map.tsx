import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type BodyPart = {
  id: string;
  name: string;
  path: string;
  painLevel?: number;
  notes?: string;
};

interface BodyMapProps {
  initialValues?: Record<string, { painLevel: number; notes: string }>;
  onChange?: (values: Record<string, { painLevel: number; notes: string }>) => void;
  readonly?: boolean;
}

export function BodyMap({ initialValues, onChange, readonly = false }: BodyMapProps) {
  const [activeView, setActiveView] = useState('front');
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const [bodyParts, setBodyParts] = useState<Record<string, { painLevel: number; notes: string }>>(initialValues || {});

  // Body part definitions
  const frontBodyParts: BodyPart[] = [
    { id: 'head-front', name: 'Head (Front)', path: 'M 150,40 C 120,40 120,60 120,70 L 120,100 180,100 180,70 C 180,60 180,40 150,40 Z' },
    { id: 'chest', name: 'Chest', path: 'M 120,100 L 180,100 180,170 120,170 Z' },
    { id: 'abdomen', name: 'Abdomen', path: 'M 120,170 L 180,170 180,220 120,220 Z' },
    { id: 'left-arm', name: 'Left Arm', path: 'M 120,100 L 100,100 80,150 70,220 90,220 100,150 120,150 Z' },
    { id: 'right-arm', name: 'Right Arm', path: 'M 180,100 L 200,100 220,150 230,220 210,220 200,150 180,150 Z' },
    { id: 'left-leg', name: 'Left Leg', path: 'M 120,220 L 140,220 140,350 120,350 Z' },
    { id: 'right-leg', name: 'Right Leg', path: 'M 160,220 L 180,220 180,350 160,350 Z' },
  ];

  const backBodyParts: BodyPart[] = [
    { id: 'head-back', name: 'Head (Back)', path: 'M 150,40 C 120,40 120,60 120,70 L 120,100 180,100 180,70 C 180,60 180,40 150,40 Z' },
    { id: 'upper-back', name: 'Upper Back', path: 'M 120,100 L 180,100 180,170 120,170 Z' },
    { id: 'lower-back', name: 'Lower Back', path: 'M 120,170 L 180,170 180,220 120,220 Z' },
    { id: 'left-arm-back', name: 'Left Arm (Back)', path: 'M 120,100 L 100,100 80,150 70,220 90,220 100,150 120,150 Z' },
    { id: 'right-arm-back', name: 'Right Arm (Back)', path: 'M 180,100 L 200,100 220,150 230,220 210,220 200,150 180,150 Z' },
    { id: 'left-leg-back', name: 'Left Leg (Back)', path: 'M 120,220 L 140,220 140,350 120,350 Z' },
    { id: 'right-leg-back', name: 'Right Leg (Back)', path: 'M 160,220 L 180,220 180,350 160,350 Z' },
  ];

  // Get color based on pain level
  const getPainColor = (id: string) => {
    const painLevel = bodyParts[id]?.painLevel || 0;
    if (painLevel === 0) return 'fill-gray-200 hover:fill-gray-300';
    if (painLevel <= 2) return 'fill-green-300 hover:fill-green-400';
    if (painLevel <= 5) return 'fill-yellow-300 hover:fill-yellow-400';
    if (painLevel <= 8) return 'fill-orange-400 hover:fill-orange-500';
    return 'fill-red-500 hover:fill-red-600';
  };

  const handleBodyPartClick = (part: BodyPart) => {
    if (readonly) return;
    setSelectedPart(part);
  };

  const handlePainLevelChange = (value: number[]) => {
    if (!selectedPart || readonly) return;
    const updatedParts = {
      ...bodyParts,
      [selectedPart.id]: {
        painLevel: value[0],
        notes: bodyParts[selectedPart.id]?.notes || ''
      }
    };
    setBodyParts(updatedParts);
    onChange?.(updatedParts);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedPart || readonly) return;
    const updatedParts = {
      ...bodyParts,
      [selectedPart.id]: {
        painLevel: bodyParts[selectedPart.id]?.painLevel || 0,
        notes: e.target.value
      }
    };
    setBodyParts(updatedParts);
    onChange?.(updatedParts);
  };

  const activeParts = activeView === 'front' ? frontBodyParts : backBodyParts;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="front">Front View</TabsTrigger>
            <TabsTrigger value="back">Back View</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="border rounded-lg p-4 bg-white relative">
          <svg 
            viewBox="0 0 300 400" 
            className="w-full h-auto"
            style={{ maxHeight: '500px' }}
          >
            {/* Body outline */}
            <path 
              d="M 150,40 C 120,40 120,60 120,70 L 120,100 100,100 80,150 70,220 90,220 100,150 120,150 120,220 140,220 140,350 120,350 160,350 180,350 180,220 200,150 180,150 180,220 160,220 160,220 180,220 180,170 120,170 120,220 Z" 
              stroke="#666" 
              strokeWidth="1"
              fill="none"
              className="outline"
            />

            {/* Clickable body parts */}
            {activeParts.map(part => (
              <path
                key={part.id}
                d={part.path}
                className={`cursor-pointer transition-colors ${getPainColor(part.id)}`}
                stroke="#666"
                strokeWidth="1"
                onClick={() => handleBodyPartClick(part)}
                data-active={selectedPart?.id === part.id}
              />
            ))}
          </svg>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <div className="flex justify-center items-center gap-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-200 mr-1"></div>
                <span>None</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-300 mr-1"></div>
                <span>Mild</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-300 mr-1"></div>
                <span>Moderate</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-400 mr-1"></div>
                <span>Severe</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 mr-1"></div>
                <span>Extreme</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        {selectedPart ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{selectedPart.name}</h3>
              <p className="text-sm text-muted-foreground">
                {bodyParts[selectedPart.id]?.painLevel ? `Pain Level: ${bodyParts[selectedPart.id]?.painLevel}/10` : 'No pain recorded'}
              </p>
            </div>

            {!readonly && (
              <div className="space-y-2">
                <Label htmlFor="pain-level">Pain Level (0-10)</Label>
                <Slider
                  id="pain-level"
                  min={0}
                  max={10}
                  step={1}
                  value={[bodyParts[selectedPart.id]?.painLevel || 0]}
                  onValueChange={handlePainLevelChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>No Pain</span>
                  <span>Moderate</span>
                  <span>Extreme</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="pain-notes">Notes</Label>
              <Textarea
                id="pain-notes"
                placeholder={readonly ? 'No notes' : 'Describe the pain (type, frequency, trigger factors...)'}                
                value={bodyParts[selectedPart.id]?.notes || ''}
                onChange={handleNotesChange}
                readOnly={readonly}
                className={readonly ? 'bg-gray-50' : ''}
              />
            </div>

            {!readonly && (
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => setSelectedPart(null)}
              >
                Done
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full border rounded-lg p-6">
            <p className="text-muted-foreground text-center">
              {readonly 
                ? "Select a body part to view recorded pain information"
                : "Select a body part on the diagram to record pain information"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
