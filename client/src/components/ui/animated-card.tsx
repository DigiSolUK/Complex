import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type EmotionalState = 'success' | 'warning' | 'error' | 'neutral';

type AnimatedCardProps = {
  children: ReactNode;
  header?: ReactNode;
  emotionalState?: EmotionalState;
  hoverEffect?: 'gentle-lift' | 'pulse' | 'glow' | 'none';
  className?: string;
};

export function AnimatedCard({
  children,
  header,
  emotionalState = 'neutral',
  hoverEffect = 'none',
  className,
}: AnimatedCardProps) {
  // Define the emotion-based styles
  const getEmotionalStateStyles = () => {
    switch (emotionalState) {
      case 'success':
        return 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30';
      case 'warning':
        return 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30';
      case 'error':
        return 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30';
      case 'neutral':
      default:
        return 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/30';
    }
  };

  // Define hover effects
  const getHoverEffectStyles = () => {
    switch (hoverEffect) {
      case 'gentle-lift':
        return 'transition-all duration-300 hover:-translate-y-1 hover:shadow-md';
      case 'pulse':
        return 'transition-all duration-300 hover:scale-[1.02]';
      case 'glow':
        return 'transition-all duration-300 hover:shadow-md hover:shadow-primary/20';
      case 'none':
      default:
        return '';
    }
  };

  return (
    <Card className={cn(
      getEmotionalStateStyles(),
      getHoverEffectStyles(),
      className
    )}>
      {header && (
        <CardHeader className="pb-2">
          {header}
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
