import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MicroAnimation } from '@/components/ui/micro-animation';
import { ComfortButton } from '@/components/ui/comfort-button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Smile, Meh, Frown, Heart, ThumbsUp, Activity } from 'lucide-react';

type MoodLevel = 'excellent' | 'good' | 'neutral' | 'poor' | 'terrible';

interface MoodData {
  moodLevel: MoodLevel;
  moodScore: number;
  sleepQuality: number;
  painLevel: number;
  anxietyLevel: number;
  energyLevel: number;
  note?: string;
}

interface MoodTrackerProps {
  initialMood?: Partial<MoodData>;
  onSave?: (data: MoodData) => void;
  className?: string;
}

const defaultMood: MoodData = {
  moodLevel: 'neutral',
  moodScore: 3,
  sleepQuality: 5,
  painLevel: 3,
  anxietyLevel: 3,
  energyLevel: 5,
};

const moodEmojis = {
  excellent: <Smile className="h-10 w-10 text-green-500" />,
  good: <Smile className="h-10 w-10 text-blue-500" />,
  neutral: <Meh className="h-10 w-10 text-amber-500" />,
  poor: <Frown className="h-10 w-10 text-orange-500" />,
  terrible: <Frown className="h-10 w-10 text-red-500" />,
};

const animationVariantMap = {
  excellent: 'success',
  good: 'encouraging',
  neutral: 'neutral',
  poor: 'warning',
  terrible: 'error',
} as const;

export function MoodTracker({ initialMood, onSave, className }: MoodTrackerProps) {
  const [mood, setMood] = React.useState<MoodData>({ ...defaultMood, ...initialMood });
  const [animationTrigger, setAnimationTrigger] = React.useState(false);

  // Trigger animation when mood level changes
  const updateMoodLevel = (level: MoodLevel) => {
    setMood((prev) => ({ ...prev, moodLevel: level }));
    setAnimationTrigger(true);
    setTimeout(() => setAnimationTrigger(false), 100);
  };

  // Calculate mood score based on slider value
  const updateMoodScore = (value: number[]) => {
    const score = value[0];
    setMood((prev) => ({
      ...prev,
      moodScore: score,
      moodLevel: getMoodLevelFromScore(score),
    }));
  };

  // Get mood level from numeric score
  const getMoodLevelFromScore = (score: number): MoodLevel => {
    if (score >= 9) return 'excellent';
    if (score >= 7) return 'good';
    if (score >= 4) return 'neutral';
    if (score >= 2) return 'poor';
    return 'terrible';
  };

  // Helper function to handle slider changes
  const handleSliderChange = (field: keyof MoodData) => (value: number[]) => {
    setMood((prev) => ({ ...prev, [field]: value[0] }));
  };

  // Calculate message based on current mood
  const getMoodMessage = () => {
    switch (mood.moodLevel) {
      case 'excellent':
        return 'You\'re doing wonderfully today!';
      case 'good':
        return 'You\'re having a good day. Keep it up!';
      case 'neutral':
        return 'You\'re feeling okay today. That\'s alright.';
      case 'poor':
        return 'You\'re not feeling your best today. That\'s okay.';
      case 'terrible':
        return 'You\'re having a rough day. Please reach out if you need support.';
    }
  };

  return (
    <Card className={cn('w-full max-w-md', className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="mr-2 h-5 w-5 text-pink-500" />
          <span>Daily Mood Tracker</span>
        </CardTitle>
        <CardDescription>How are you feeling today?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Emoji Selector */}
        <div className="flex justify-center py-4">
          <MicroAnimation
            variant={animationVariantMap[mood.moodLevel]}
            trigger={animationTrigger}
            size="lg"
          >
            {moodEmojis[mood.moodLevel]}
          </MicroAnimation>
        </div>

        {/* Mood Message */}
        <div className="text-center text-sm font-medium text-muted-foreground">
          {getMoodMessage()}
        </div>

        {/* Mood Score Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Very Unwell</span>
            <span>Excellent</span>
          </div>
          <Slider
            defaultValue={[mood.moodScore]}
            max={10}
            step={1}
            onValueChange={updateMoodScore}
            className="py-4"
          />
        </div>

        {/* Sleep Quality */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Sleep Quality</span>
            <span className="text-xs text-muted-foreground">{mood.sleepQuality}/10</span>
          </div>
          <Slider
            defaultValue={[mood.sleepQuality]}
            max={10}
            step={1}
            onValueChange={handleSliderChange('sleepQuality')}
          />
        </div>

        {/* Pain Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Pain Level</span>
            <span className="text-xs text-muted-foreground">{mood.painLevel}/10</span>
          </div>
          <Slider
            defaultValue={[mood.painLevel]}
            max={10}
            step={1}
            onValueChange={handleSliderChange('painLevel')}
          />
        </div>

        {/* Anxiety Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Anxiety Level</span>
            <span className="text-xs text-muted-foreground">{mood.anxietyLevel}/10</span>
          </div>
          <Slider
            defaultValue={[mood.anxietyLevel]}
            max={10}
            step={1}
            onValueChange={handleSliderChange('anxietyLevel')}
          />
        </div>

        {/* Energy Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Energy Level</span>
            <span className="text-xs text-muted-foreground">{mood.energyLevel}/10</span>
          </div>
          <Slider
            defaultValue={[mood.energyLevel]}
            max={10}
            step={1}
            onValueChange={handleSliderChange('energyLevel')}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <ComfortButton emotionalState="calming" variant="outline">
          Previous Entries
        </ComfortButton>
        <ComfortButton 
          emotionalState="encouraging" 
          onClick={() => onSave?.(mood)}
        >
          <ThumbsUp className="mr-2 h-4 w-4" />
          Save Entry
        </ComfortButton>
      </CardFooter>
    </Card>
  );
}
