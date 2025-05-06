import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MicroAnimation } from '@/components/ui/micro-animation';
import { ComfortButton } from '@/components/ui/comfort-button';
import { ComfortMessage } from '@/components/ui/comfort-message';
import { cn } from '@/lib/utils';
import { Heart, Save, Undo } from 'lucide-react';

interface PainArea {
  id: string;
  name: string;
  x: number;
  y: number;
  painLevel: number;
  note?: string;
}

interface PainMapProps {
  onSave?: (painAreas: PainArea[]) => void;
  className?: string;
  initialAreas?: PainArea[];
}

export function PainMap({ onSave, className, initialAreas = [] }: PainMapProps) {
  const [painAreas, setPainAreas] = React.useState<PainArea[]>(initialAreas);
  const [selectedArea, setSelectedArea] = React.useState<PainArea | null>(null);
  const [showTip, setShowTip] = React.useState(true);

  // Get pain level color
  const getPainColor = (level: number) => {
    if (level >= 8) return "bg-red-500";
    if (level >= 6) return "bg-orange-500";
    if (level >= 4) return "bg-amber-400";
    if (level >= 2) return "bg-yellow-300";
    return "bg-green-300";
  };

  // Get emotional state based on pain level
  const getEmotionalState = (level: number) => {
    if (level >= 8) return "error";
    if (level >= 6) return "warning";
    if (level >= 4) return "neutral";
    if (level >= 2) return "calming";
    return "success";
  };

  // Add a new pain area
  const handleAddPainArea = (e: React.MouseEvent<HTMLDivElement>) => {
    // Get click position relative to the body diagram
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newArea: PainArea = {
      id: Date.now().toString(),
      name: "New Pain Area",
      x,
      y,
      painLevel: 5,
    };

    setPainAreas([...painAreas, newArea]);
    setSelectedArea(newArea);
    setShowTip(false);
  };

  // Update pain level for selected area
  const updatePainLevel = (id: string, level: number) => {
    setPainAreas((prev) =>
      prev.map((area) =>
        area.id === id ? { ...area, painLevel: level } : area
      )
    );

    if (selectedArea?.id === id) {
      setSelectedArea({ ...selectedArea, painLevel: level });
    }
  };

  // Remove a pain area
  const removePainArea = (id: string) => {
    setPainAreas((prev) => prev.filter((area) => area.id !== id));
    if (selectedArea?.id === id) {
      setSelectedArea(null);
    }
  };

  // Get message based on number of pain areas
  const getMessage = () => {
    if (painAreas.length === 0) return "";
    
    const highestPain = Math.max(...painAreas.map(area => area.painLevel));
    
    if (highestPain >= 8) {
      return "I'm sorry you're experiencing severe pain. This information will help your care team provide appropriate support.";
    }
    if (highestPain >= 5) {
      return "Thank you for documenting your pain. Your care team will use this to help manage your discomfort.";
    }
    return "You're doing well tracking your pain levels. This helps your care team monitor your progress.";
  };

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MicroAnimation variant="empathetic" playOnMount>
            <Heart className="mr-2 h-5 w-5 text-pink-500" />
          </MicroAnimation>
          <span>Pain Map</span>
        </CardTitle>
        <CardDescription>
          Tap on the body diagram to indicate where you feel pain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Body diagram */}
        <div 
          className="relative h-[400px] w-full cursor-pointer border bg-slate-50 dark:bg-slate-900"
          onClick={handleAddPainArea}
        >
          {/* Simple body outline - replace with actual SVG in production */}
          <div className="absolute left-1/2 top-1/2 h-[350px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="absolute left-1/2 top-[70px] h-[80px] w-[80px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div className="absolute bottom-0 left-0 h-[150px] w-[30px] rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div className="absolute bottom-0 right-0 h-[150px] w-[30px] rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div className="absolute left-1/4 top-[120px] h-[120px] w-[20px] rotate-[20deg] rounded-full bg-slate-200 dark:bg-slate-800"></div>
            <div className="absolute right-1/4 top-[120px] h-[120px] w-[20px] -rotate-[20deg] rounded-full bg-slate-200 dark:bg-slate-800"></div>
          </div>
          
          {/* Pain area markers */}
          {painAreas.map((area) => (
            <MicroAnimation
              key={area.id}
              variant={getEmotionalState(area.painLevel) as any}
              playOnMount
              className={cn(
                "absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full border border-white",
                getPainColor(area.painLevel),
                selectedArea?.id === area.id && "ring-2 ring-primary ring-offset-2"
              )}
              style={{ left: `${area.x}%`, top: `${area.y}%` }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedArea(area);
              }}
            />
          ))}
          
          {/* Help tip */}
          {showTip && painAreas.length === 0 && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-primary/10 p-4 text-center text-sm">
              Tap anywhere on the body to mark areas where you feel pain
            </div>
          )}
        </div>

        {/* Selected area controls */}
        {selectedArea && (
          <div className="rounded-lg border bg-background p-4">
            <h4 className="mb-2 font-medium">Pain Level: {selectedArea.painLevel}/10</h4>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <MicroAnimation
                  key={level}
                  variant={getEmotionalState(level) as any}
                  trigger={selectedArea.painLevel === level}
                >
                  <button
                    className={cn(
                      "h-8 w-8 rounded-full",
                      selectedArea.painLevel === level
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    )}
                    onClick={() => updatePainLevel(selectedArea.id, level)}
                  >
                    {level}
                  </button>
                </MicroAnimation>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <ComfortButton
                emotionalState="error"
                variant="outline"
                size="sm"
                onClick={() => removePainArea(selectedArea.id)}
              >
                Remove
              </ComfortButton>
            </div>
          </div>
        )}

        {/* Supportive message */}
        {getMessage() && (
          <ComfortMessage
            variant={painAreas.length > 0 ? getEmotionalState(Math.max(...painAreas.map(a => a.painLevel))) as any : "info"}
            description={getMessage()}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <ComfortButton
          emotionalState="neutral"
          variant="outline"
          onClick={() => {
            setPainAreas([]);
            setSelectedArea(null);
            setShowTip(true);
          }}
        >
          <Undo className="mr-2 h-4 w-4" />
          Reset
        </ComfortButton>
        <ComfortButton 
          emotionalState="encouraging"
          onClick={() => {
            onSave?.(painAreas);
          }}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Pain Map
        </ComfortButton>
      </CardFooter>
    </Card>
  );
}
